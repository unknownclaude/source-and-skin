"use client";

import { useState } from "react";

import { useCart } from "@/components/CartProvider";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

const MAX_QUANTITY = 10;

/** Quantity stepper + add to cart. Writes to local cart state only. */
export default function AddToCartForm({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();
        add(product.slug, quantity);
        setQuantity(1);
      }}
    >
      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-center border border-charcoal/25">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            className="px-4 py-3.5 text-base transition-colors hover:bg-charcoal/5 disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span
            className="min-w-10 text-center text-sm tabular-nums"
            aria-live="polite"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
            disabled={quantity >= MAX_QUANTITY}
            className="px-4 py-3.5 text-base transition-colors hover:bg-charcoal/5 disabled:opacity-30"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="submit"
          className="flex-1 rounded-full bg-charcoal px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-cream transition-transform duration-500 ease-editorial hover:-translate-y-0.5"
        >
          Add to bag — {formatPrice(product.price * quantity)}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
        Free US shipping over $45. Ships plastic-free within two business days.
      </p>
    </form>
  );
}
