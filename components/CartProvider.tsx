"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { products, type Product } from "@/data/products";

/**
 * Local-only cart.
 *
 * Deliberately has no network calls: it holds line items in React state and
 * mirrors them to localStorage so a refresh does not empty the bag. When real
 * checkout lands, keep this context as the UI contract and swap the reducer
 * body for Shopify cart mutations (or a Stripe Checkout session) — see
 * README → "Wiring up real checkout".
 */

export type CartLine = { slug: string; quantity: number };

type CartState = { lines: CartLine[] };

type CartAction =
  | { type: "add"; slug: string; quantity: number }
  | { type: "setQuantity"; slug: string; quantity: number }
  | { type: "remove"; slug: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

const STORAGE_KEY = "source-and-skin:cart";
const MAX_PER_LINE = 10;

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };
    case "add": {
      const existing = state.lines.find((line) => line.slug === action.slug);
      if (!existing) {
        return { lines: [...state.lines, { slug: action.slug, quantity: action.quantity }] };
      }
      return {
        lines: state.lines.map((line) =>
          line.slug === action.slug
            ? { ...line, quantity: Math.min(MAX_PER_LINE, line.quantity + action.quantity) }
            : line
        ),
      };
    }
    case "setQuantity": {
      if (action.quantity < 1) {
        return { lines: state.lines.filter((line) => line.slug !== action.slug) };
      }
      return {
        lines: state.lines.map((line) =>
          line.slug === action.slug
            ? { ...line, quantity: Math.min(MAX_PER_LINE, action.quantity) }
            : line
        ),
      };
    }
    case "remove":
      return { lines: state.lines.filter((line) => line.slug !== action.slug) };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

export type HydratedLine = CartLine & { product: Product; lineTotal: number };

type CartContextValue = {
  lines: HydratedLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [isOpen, setIsOpen] = useState(false);

  // Restore on mount only — never during render, so SSR and the first client
  // paint agree and React does not warn about a hydration mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const lines = parsed.filter(
        (line): line is CartLine =>
          typeof line === "object" &&
          line !== null &&
          typeof (line as CartLine).slug === "string" &&
          typeof (line as CartLine).quantity === "number" &&
          products.some((product) => product.slug === (line as CartLine).slug)
      );
      if (lines.length) dispatch({ type: "hydrate", lines });
    } catch {
      // A corrupt or unavailable store is not worth surfacing — start empty.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Private mode / quota exceeded: the cart still works for this session.
    }
  }, [state.lines]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const hydrated = state.lines.flatMap<HydratedLine>((line) => {
      const product = products.find((candidate) => candidate.slug === line.slug);
      if (!product) return [];
      return [{ ...line, product, lineTotal: product.price * line.quantity }];
    });

    return {
      lines: hydrated,
      count: hydrated.reduce((total, line) => total + line.quantity, 0),
      subtotal: hydrated.reduce((total, line) => total + line.lineTotal, 0),
      isOpen,
      openCart,
      closeCart,
      add: (slug, quantity = 1) => {
        dispatch({ type: "add", slug, quantity });
        setIsOpen(true);
      },
      setQuantity: (slug, quantity) => dispatch({ type: "setQuantity", slug, quantity }),
      remove: (slug) => dispatch({ type: "remove", slug }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.lines, isOpen, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside a CartProvider");
  return context;
}
