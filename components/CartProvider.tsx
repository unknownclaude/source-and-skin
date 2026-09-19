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

import {
  cartLineKey,
  describeSelection,
  products,
  pruneSelection,
  unitPrice,
  type OptionSelection,
  type Product,
} from "@/data/products";

/**
 * Local-only cart.
 *
 * Deliberately has no network calls: it holds line items in React state and
 * mirrors them to localStorage so a refresh does not empty the bag. When real
 * checkout lands, keep this context as the UI contract and swap the reducer
 * body for Shopify cart mutations (or a Stripe Checkout session) — see
 * README → "Wiring up real checkout".
 */

/**
 * A line is a product PLUS the choices made about it.
 *
 * Keying by slug alone would merge a red sponge and a blue one into one line
 * of two, which is wrong at every stage after it: the customer sees one item
 * where they bought two different things, and whoever packs the box has no
 * record of which colours to put in it.
 */
export type CartLine = { slug: string; quantity: number; selection: OptionSelection };

type CartState = { lines: CartLine[] };

type CartAction =
  | { type: "add"; slug: string; quantity: number; selection: OptionSelection }
  | { type: "setQuantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

const STORAGE_KEY = "source-and-skin:cart";
const MAX_PER_LINE = 10;

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };
    case "add": {
      const key = cartLineKey(action.slug, action.selection);
      const existing = state.lines.find(
        (line) => cartLineKey(line.slug, line.selection) === key
      );
      if (!existing) {
        return {
          lines: [
            ...state.lines,
            { slug: action.slug, quantity: action.quantity, selection: action.selection },
          ],
        };
      }
      return {
        lines: state.lines.map((line) =>
          cartLineKey(line.slug, line.selection) === key
            ? { ...line, quantity: Math.min(MAX_PER_LINE, line.quantity + action.quantity) }
            : line
        ),
      };
    }
    case "setQuantity": {
      if (action.quantity < 1) {
        return {
          lines: state.lines.filter(
            (line) => cartLineKey(line.slug, line.selection) !== action.key
          ),
        };
      }
      return {
        lines: state.lines.map((line) =>
          cartLineKey(line.slug, line.selection) === action.key
            ? { ...line, quantity: Math.min(MAX_PER_LINE, action.quantity) }
            : line
        ),
      };
    }
    case "remove":
      return {
        lines: state.lines.filter((line) => cartLineKey(line.slug, line.selection) !== action.key),
      };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

export type HydratedLine = CartLine & {
  product: Product;
  /** Stable identity — what `setQuantity` and `remove` take. */
  key: string;
  /** Price of one, with any option surcharge applied. */
  unitPrice: number;
  lineTotal: number;
  /** "Regular · Blue", or "" when the product has no options. */
  selectionLabel: string;
};

type CartContextValue = {
  lines: HydratedLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (slug: string, quantity?: number, selection?: OptionSelection) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
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
      // A stored cart can outlive the catalogue it was built from, so the
      // selection is re-validated against the product as it is TODAY — a
      // colour we have since dropped is pruned rather than ordered.
      const lines = parsed.flatMap<CartLine>((entry) => {
        if (typeof entry !== "object" || entry === null) return [];
        const candidate = entry as Partial<CartLine>;
        if (typeof candidate.slug !== "string" || typeof candidate.quantity !== "number") return [];
        const product = products.find((item) => item.slug === candidate.slug);
        if (!product) return [];

        const stored =
          typeof candidate.selection === "object" && candidate.selection !== null
            ? (candidate.selection as OptionSelection)
            : {};
        return [
          {
            slug: product.slug,
            quantity: candidate.quantity,
            selection: pruneSelection(product, stored),
          },
        ];
      });
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
      const each = unitPrice(product, line.selection);
      return [
        {
          ...line,
          product,
          key: cartLineKey(line.slug, line.selection),
          unitPrice: each,
          lineTotal: each * line.quantity,
          selectionLabel: describeSelection(product, line.selection),
        },
      ];
    });

    return {
      lines: hydrated,
      count: hydrated.reduce((total, line) => total + line.quantity, 0),
      subtotal: hydrated.reduce((total, line) => total + line.lineTotal, 0),
      isOpen,
      openCart,
      closeCart,
      add: (slug, quantity = 1, selection = {}) => {
        dispatch({ type: "add", slug, quantity, selection });
        setIsOpen(true);
      },
      setQuantity: (key, quantity) => dispatch({ type: "setQuantity", key, quantity }),
      remove: (key) => dispatch({ type: "remove", key }),
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
