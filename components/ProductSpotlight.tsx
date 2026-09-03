"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import type { Product } from "@/data/products";
import { formatPrice, readableTextOn } from "@/lib/format";

type ProductSpotlightProps = {
  product: Product;
  /** Flips the image to the right on odd rows, mirroring the reference layout. */
  reversed?: boolean;
};

/**
 * Full-width product block on a solid accent ground.
 *
 * The image has two states — the packed shot and the detail shot. Hover swaps
 * them on pointer devices; on touch, where hover does not exist, an explicit
 * toggle button does the same job. Text colour is derived from the accent so
 * contrast holds if the palette grows.
 */
export default function ProductSpotlight({ product, reversed = false }: ProductSpotlightProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const textColor = readableTextOn(product.accentColor);
  const isLightText = textColor === "#F5F1EA";

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: product.accentColor, color: textColor }}
      aria-labelledby={`spotlight-${product.slug}`}
    >
      <div
        className={`edge grid items-center gap-10 py-section md:grid-cols-2 md:gap-16 ${
          reversed ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <Image
              src={product.images.main}
              alt={`${product.name}, packed`}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className={`object-cover transition-opacity duration-[900ms] ease-editorial ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src={product.images.alt}
              alt={`${product.name}, in detail`}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className={`object-cover transition-opacity duration-[900ms] ease-editorial ${
                open ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Touch devices get an explicit control for the same state. */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-pressed={open}
            className={`mx-auto mt-5 flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.18em] transition-opacity hover:opacity-70 md:hidden ${
              isLightText ? "border-cream/40" : "border-charcoal/25"
            }`}
          >
            {open ? "See it packed" : "See the detail"}
          </button>
        </motion.div>

        <motion.div
          className={reversed ? "md:pr-8" : "md:pl-8"}
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

          <p className="mt-8 font-serif text-2xl tabular-nums">{formatPrice(product.price)}</p>

          <Link
            href={`/products/${product.slug}`}
            className={`mt-8 inline-flex items-center gap-3 rounded-full px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] transition-transform duration-500 ease-editorial hover:-translate-y-0.5 ${
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
