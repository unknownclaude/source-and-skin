"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import type { Product } from "@/data/products";
import { formatPrice, readableTextOn } from "@/lib/format";
import { useLiveCatalogue } from "@/components/LiveCatalogueProvider";
import { fromPriceFor } from "@/lib/catalogue";

type ProductSpotlightProps = {
  product: Product;
  /** Flips the image to the right on odd rows, mirroring the reference layout. */
  reversed?: boolean;
};

/**
 * Full-width product block on a solid accent ground.
 *
 * The photograph bleeds to the edge of the viewport and fills the full height
 * of the block. It used to be capped at `max-w-lg` and centred inside its
 * column, which put a 512px image in the middle of a 1440px band of flat
 * colour — the product ended up as a small tile surrounded by paint, and three
 * of these stacked made the homepage read as mostly empty. A photograph given
 * half the screen is the whole point of a spotlight.
 *
 * The image has two states — the packed shot and the detail shot. Hover swaps
 * them on pointer devices; on touch, where hover does not exist, an explicit
 * toggle does the same job. Text colour is derived from the accent so contrast
 * holds if the palette grows.
 */
export default function ProductSpotlight({ product, reversed = false }: ProductSpotlightProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const live = useLiveCatalogue();
  const textColor = readableTextOn(product.accentColor);
  const isLightText = textColor === "#F5F1EA";

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: product.accentColor, color: textColor }}
      aria-labelledby={`spotlight-${product.slug}`}
    >
      <div
        className={`grid items-stretch md:grid-cols-2 ${
          reversed ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <motion.div
          className="relative aspect-[4/5] w-full sm:aspect-[16/11] md:aspect-auto md:min-h-[34rem] lg:min-h-[40rem]"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Image
            src={product.images.main}
            alt={`${product.name}, packed`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-[900ms] ease-editorial ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src={product.images.alt}
            alt={`${product.name}, in detail`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-[900ms] ease-editorial ${
              open ? "opacity-100" : "opacity-0"
            }`}
          />
        </motion.div>

        <motion.div
          className={`flex flex-col justify-center px-gutter py-section ${
            reversed ? "md:pr-gutter md:pl-12 lg:pl-20" : "md:pl-gutter md:pr-12 lg:pr-20"
          }`}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-eyebrow uppercase tracking-[0.22em]"
            style={{ color: textColor, opacity: 0.65 }}
          >
            {product.category === "bundle" ? "The set" : product.category === "sponge" ? "For the body" : "For the mouth"}
          </p>

          <h2 id={`spotlight-${product.slug}`} className="mt-5 font-serif text-display-md">
            {product.name}
          </h2>

          <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ opacity: 0.85 }}>
            {product.tagline}
          </p>

          <p className="mt-8 font-serif text-2xl tabular-nums">{formatPrice(fromPriceFor(product, live))}</p>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-pressed={open}
            className={`mt-6 self-start text-[0.68rem] uppercase tracking-[0.18em] underline underline-offset-4 transition-opacity hover:opacity-70 md:hidden ${
              isLightText ? "text-cream/75" : "text-charcoal/65"
            }`}
          >
            {open ? "See it packed" : "See the detail"}
          </button>

          <Link
            href={`/products/${product.slug}`}
            className={`mt-8 inline-flex w-fit items-center gap-3 rounded-full px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] transition-transform duration-500 ease-editorial hover:-translate-y-0.5 ${
              isLightText ? "bg-cream text-charcoal" : "bg-charcoal text-cream"
            }`}
          >
            Click to shop
            <span aria-hidden>&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
