"use client";

import { useMemo, useRef, useState } from "react";

import Accordion from "@/components/Accordion";
import AddToCartForm from "@/components/AddToCartForm";
import ProductGallery from "@/components/ProductGallery";
import DeliveryEstimate from "@/components/DeliveryEstimate";
import ProductOptions from "@/components/ProductOptions";
import StickyBuyBar from "@/components/StickyBuyBar";
import TrustRow from "@/components/TrustRow";
import {
  defaultShippingCopy,
  selectedImage,
  unitPrice,
  type OptionSelection,
  type Product,
} from "@/data/products";
import StarRating from "@/components/StarRating";
import { useCart } from "@/components/CartProvider";
import { getAggregateRating } from "@/data/reviews";
import { formatPrice } from "@/lib/format";

/**
 * The interactive half of a product page.
 *
 * Gallery, option pickers and buy button are one component because they share
 * a single piece of state — the customer's selection. Choosing a colour has to
 * move the gallery AND re-price the button AND unblock the submit; as siblings
 * they could not agree on any of it.
 *
 * Nothing is pre-selected. The price shown is always the price of what is
 * currently configured, so the number on the button never disagrees with the
 * number in the bag.
 */
export default function ProductDetail({ product }: { product: Product }) {
  const [selection, setSelection] = useState<OptionSelection>({});
  const [missing, setMissing] = useState<string[]>([]);
  const { add } = useCart();
  // The sticky mobile bar appears once this block scrolls off the top.
  const buyRef = useRef<HTMLDivElement>(null);

  // The chosen colour leads the gallery; everything else keeps its order, so
  // the strip does not reshuffle under the customer on every click.
  const gallery = useMemo(() => {
    const lead = selectedImage(product, selection);
    if (!lead) return product.images.gallery;
    const rest = product.images.gallery.filter((src) => src !== lead);
    return [lead, ...rest];
  }, [product, selection]);

  const price = unitPrice(product, selection);
  const rating = getAggregateRating(product.slug);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <ProductGallery
        key={gallery[0]}
        images={gallery}
        productName={product.name}
        accentColor={product.accentColor}
      />

      <div className="lg:sticky lg:top-28 lg:self-start">
        <h1 className="font-serif text-display-md">{product.name}</h1>
        {rating && (
          <a href="#reviews-heading" className="mt-4 inline-flex hover:opacity-70">
            <StarRating rating={rating.average} count={rating.count} size="md" />
          </a>
        )}
        <p className="mt-4 text-lg text-charcoal/60">{product.tagline}</p>
        <p className="mt-7 font-serif text-3xl tabular-nums">{formatPrice(price)}</p>

        {/* What it does, before what it is. The description is one accordion
            down; a customer who reads nothing else should still get this. */}
        {product.benefits && product.benefits.length > 0 && (
          <ul className="mt-9 space-y-3 border-t border-charcoal/10 pt-8">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3 text-[0.95rem] leading-relaxed text-charcoal/75">
                <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-charcoal/30" />
                {benefit}
              </li>
            ))}
          </ul>
        )}

        <div ref={buyRef}>
          <ProductOptions
            product={product}
            selection={selection}
            highlight={missing}
            onChange={(next) => {
              setSelection(next);
              setMissing([]);
            }}
          />

          <AddToCartForm product={product} selection={selection} onMissing={setMissing} />
        </div>

        <DeliveryEstimate />
        <TrustRow />

        <div className="mt-12">
          <Accordion
            defaultOpenIndex={0}
            items={[
              { title: "Description", content: product.description },
              { title: "How to use", content: product.howToUse },
              { title: "Materials", content: product.materials },
              { title: "Shipping & returns", content: product.shipping ?? defaultShippingCopy },
            ]}
          />
        </div>
      </div>

      <StickyBuyBar
        product={product}
        selection={selection}
        onMissing={setMissing}
        onAdd={() => add(product.slug, 1, selection)}
        watchRef={buyRef}
      />
    </div>
  );
}
