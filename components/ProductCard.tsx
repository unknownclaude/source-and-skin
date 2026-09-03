"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: Product;
  /** `From $14.00` on grid cards; exact price when the variant is unambiguous. */
  showFromPrefix?: boolean;
  priority?: boolean;
  index?: number;
};

/**
 * Grid card with a hover crossfade to the second image.
 *
 * The whole card is one link — the image swap is decorative, so the alternate
 * shot is marked `aria-hidden` and the accessible name stays the product name.
 * Focus triggers the same swap so keyboard users see what mouse users see.
 */
export default function ProductCard({
  product,
  showFromPrefix = true,
  priority = false,
  index = 0,
}: ProductCardProps) {
  const [active, setActive] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        <div
          className="relative aspect-[4/5] w-full overflow-hidden"
          style={{ backgroundColor: product.accentColor }}
        >
          <Image
            src={product.images.main}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className={`object-cover transition-[opacity,transform] duration-[900ms] ease-editorial ${
              active ? "scale-[1.03] opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <Image
            src={product.images.alt}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className={`object-cover transition-[opacity,transform] duration-[900ms] ease-editorial ${
              active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
            }`}
          />
        </div>

        <div className="flex items-baseline justify-between gap-4 pt-4">
          <h3 className="font-serif text-lg leading-snug">{product.name}</h3>
          <p className="shrink-0 text-sm tabular-nums text-charcoal/70">
            {showFromPrefix && <span className="text-charcoal/45">From </span>}
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="pt-1 text-sm leading-relaxed text-charcoal/55">{product.tagline}</p>
      </Link>
    </motion.article>
  );
}
