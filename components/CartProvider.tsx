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
  selectedImage,
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
  /**
   * The shot that matches what was chosen, falling back to the product's own.
   *
   * The same image the product page led with once the colour was picked — so
   * the bag confirms the choice rather than showing a stock photograph of a
   * different colour and quietly undermining it. Colour is the single most
   * common thing people get wrong in an order, and a thumbnail is a faster
   * check than reading the label beside it.
   */
  image: string;
};

type CartContextValue = {
  lines: HydratedLine[];
  count: number;
  subtotal: number;
  /**
   * False until localStorage has been read.
   *
   * The bag is restored in an effect, so the server HTML and the first client
   * paint both show an empty cart. The drawer can live with that — it only
   * opens on a click, by which time this is true. A full checkout page cannot:
   * without this flag it renders "your bag is empty" for a frame to someone
   * who is standing at the payment step with four items, which reads as the
   * site having lost their order.
   */
  hydrated: boolean;
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
  const [hydrated, setHydrated] = useState(false);

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
    } finally {
      // In `finally` so a thrown parse does not leave the UI waiting forever
      // on a bag that is never coming.
      setHydrated(true);
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
    const hydratedLines = state.lines.flatMap<HydratedLine>((line) => {
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
          image: selectedImage(product, line.selection) ?? product.images.main,
        },
      ];
    });

    return {
      lines: hydratedLines,
      count: hydratedLines.reduce((total, line) => total + line.quantity, 0),
      subtotal: hydratedLines.reduce((total, line) => total + line.lineTotal, 0),
      hydrated,
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
  }, [state.lines, hydrated, isOpen, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside a CartProvider");
  return context;
}
