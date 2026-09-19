"use client";

import Image from "next/image";

import { useCart } from "@/components/CartProvider";
import { products, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

/**
 * One suggestion in the bag, addable in a single click.
 *
 * Two rules decide what can appear here, and both are hard:
 *
 *   1. It must need no configuration. A one-click add on a product that
 *      requires a colour would either silently pick one — the exact failure the
 *      option pickers exist to prevent — or bounce the customer to a page and
 *      lose the click. Only products with no `options` are eligible.
 *   2. It must not already be in the bag, in any configuration.
 *
 * The order of `SUGGESTION_ORDER` is deliberate: miswak is small, cheap
 * relative to a sponge, and the only thing in the catalogue with a real
 * reorder cadence, so it is the natural addition to a sponge order.
 */
const SUGGESTION_ORDER = ["miswak-stick-3-pack", "miswak-stick-single"];

function pickSuggestion(inBag: Set<string>): Product | null {
  for (const slug of SUGGESTION_ORDER) {
    const product = products.find((item) => item.slug === slug);
    if (!product) continue;
    if (inBag.has(product.slug)) continue;
    if (product.options?.length) continue; // Rule 1 — nothing configurable.
    return product;
  }
  return null;
}

export default function CartCrossSell() {
  const { lines, add } = useCart();

  const inBag = new Set(lines.map((line) => line.slug));
  const suggestion = pickSuggestion(inBag);
  if (!suggestion) return null;

  return (
    <div className="border-t border-charcoal/10 bg-cream-deep/50 px-6 py-5">
      <p className="eyebrow">Add to your ritual</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-sand">
          <Image
            src={suggestion.images.main}
            alt=""
            aria-hidden
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-serif text-sm leading-snug">{suggestion.name}</p>
          <p className="mt-0.5 text-xs text-charcoal/55">{formatPrice(suggestion.price)}</p>
        </div>

        <button
          type="button"
          onClick={() => add(suggestion.slug, 1)}
          className="shrink-0 rounded-full border border-charcoal px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-charcoal hover:text-cream"
        >
          <span aria-hidden>Add</span>
          <span className="sr-only">Add {suggestion.name} to bag</span>
        </button>
      </div>
    </div>
  );
}
