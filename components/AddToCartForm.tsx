"use client";

import { useState } from "react";

import { useCart } from "@/components/CartProvider";
import { useLiveCatalogue } from "@/components/LiveCatalogueProvider";
import {
  isSelectionComplete,
  missingOptions,
  type OptionSelection,
  type Product,
} from "@/data/products";
import { shippingTerms } from "@/data/site";
import { availabilityFor, priceFor } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";

const MAX_QUANTITY = 10;

/**
 * Quantity stepper + add to cart. Writes to local cart state only.
 *
 * The button stays live even when the product is not fully configured. A
 * disabled button tells you nothing about why — it just refuses — whereas a
 * blocked submit can say which question is outstanding and put the eye back on
 * it. The guard is the same either way: nothing reaches the bag until every
 * live option has an answer.
 */
export default function AddToCartForm({
  product,
  selection,
  onMissing,
}: {
  product: Product;
  selection: OptionSelection;
  /** Called with the ids of unanswered options when a submit is blocked. */
  onMissing?: (optionIds: string[]) => void;
}) {
  const { add } = useCart();
  const live = useLiveCatalogue();
  const [quantity, setQuantity] = useState(1);
  const [blocked, setBlocked] = useState<string[]>([]);

  const complete = isSelectionComplete(product, selection);
  const price = priceFor(product, selection, live);
  // Only ever true when Shopify has actually reported this exact variant as
  // unavailable. An unreachable store reports "unknown" and the button stays
  // live — better to let an order through and refund it than to refuse a sale
  // because a network call failed.
  const soldOut = complete && availabilityFor(product, selection, live) === "sold-out";

  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();

        if (!complete) {
          const outstanding = missingOptions(product, selection);
          setBlocked(outstanding.map((option) => option.label));
          onMissing?.(outstanding.map((option) => option.id));
          return;
        }

        if (soldOut) return;

        setBlocked([]);
        add(product.slug, quantity, selection);
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
          disabled={soldOut}
          aria-describedby={
            soldOut ? "add-to-bag-soldout" : blocked.length ? "add-to-bag-blocked" : undefined
          }
          className={`flex-1 rounded-full px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] transition-all duration-500 ease-editorial ${
            soldOut
              ? "cursor-not-allowed bg-charcoal/20 text-charcoal/50"
              : complete
                ? "bg-charcoal text-cream hover:-translate-y-0.5"
                : "bg-charcoal/25 text-cream"
          }`}
        >
          {soldOut ? "Sold out" : `Add to bag — ${formatPrice(price * quantity)}`}
        </button>
      </div>

      {soldOut && (
        <p id="add-to-bag-soldout" role="alert" className="mt-4 text-sm text-clay">
          That combination has sold out. Choose another colour, or email us and we will tell you
          when it is back.
        </p>
      )}

      {blocked.length > 0 && !complete && (
        <p id="add-to-bag-blocked" role="alert" className="mt-4 text-sm text-clay">
          {blocked.length === 1
            ? `Choose a ${blocked[0].toLowerCase()} first.`
            : `Choose a ${blocked.map((label) => label.toLowerCase()).join(" and a ")} first.`}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
        {`Free Australian shipping over $${shippingTerms.freeThreshold}. Ships plastic-free within ${shippingTerms.dispatchDays} business days.`}
      </p>
    </form>
  );
}
