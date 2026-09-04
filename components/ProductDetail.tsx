"use client";

import { useMemo, useState } from "react";

import Accordion from "@/components/Accordion";
import AddToCartForm from "@/components/AddToCartForm";
import ColorwayPicker from "@/components/ColorwayPicker";
import ProductGallery from "@/components/ProductGallery";
import { defaultShippingCopy, type Colorway, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

/**
 * The interactive half of a product page.
 *
 * Gallery and colour picker are lifted into one component because selecting a
 * colour has to change the image — as siblings they could not share that state.
 * Everything static (breadcrumb, JSON-LD, related products) stays server-rendered
 * on the page itself.
 */
export default function ProductDetail({ product }: { product: Product }) {
  const [selected, setSelected] = useState<Colorway | null>(product.colorways?.[0] ?? null);

  // A colourway without photography falls back to the product's own gallery, so
  // the customer always sees the product rather than an empty frame.
  const gallery = useMemo(() => {
    if (!selected?.image) return product.images.gallery;
    const rest = product.images.gallery.filter((src) => src !== selected.image);
    return [selected.image, ...rest];
  }, [selected, product.images.gallery]);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <ProductGallery
        key={selected?.name ?? "default"}
        images={gallery}
        productName={product.name}
        accentColor={product.accentColor}
      />

      <div className="lg:sticky lg:top-28 lg:self-start">
        <h1 className="font-serif text-display-md">{product.name}</h1>
        <p className="mt-4 text-lg text-charcoal/60">{product.tagline}</p>
        <p className="mt-7 font-serif text-3xl tabular-nums">{formatPrice(product.price)}</p>

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

        {product.colorways && product.colorways.length > 0 && selected && (
          <ColorwayPicker
            colorways={product.colorways}
            selected={selected.name}
            onSelect={setSelected}
          />
        )}

        <AddToCartForm product={product} />

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
    </div>
  );
}
