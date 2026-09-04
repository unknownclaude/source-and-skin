"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type HeroProps = {
  eyebrow?: string;
  headline: string;
  supporting?: string;
  ctaLabel: string;
  ctaHref: string;
  /** Secondary, quieter action — reads as a link, not a button. */
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Three or four short proofs under the buttons. Omit to hide the row. */
  notes?: string[];
  /** Poster frame — also the entire image panel if the video is missing. */
  posterSrc: string;
  posterAlt: string;
  /** Omit or pass null to render the poster alone — no <video> element. */
  videoSrc?: string | null;
};

/**
 * Split hero: type on the left on a plain ground, photograph on the right.
 *
 * The earlier version laid the headline over a full-bleed frame behind a
 * charcoal scrim. Two things were wrong with it. A scrim heavy enough to make
 * white type legible also greys out the photograph, so the product was never
 * seen properly — and text sitting directly on an image is the single most
 * common tell of a template, which is the opposite of what this brand is
 * selling. Splitting them lets the type be set on cream at full contrast and
 * the photograph be shown at full strength, with neither compromised.
 *
 * The panels swap to stacked on mobile, image first: on a phone the picture is
 * what stops the scroll, and the type reads better on its own ground than as an
 * overlay on a portrait crop.
 *
 * TODO(video): drop a looping, muted, ~6-10s clip at /public/videos/hero.mp4
 * and point `site.heroVideo` at it. See public/videos/README.md for the brief.
 */
export default function Hero({
  eyebrow,
  headline,
  supporting,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  notes,
  posterSrc,
  posterAlt,
  videoSrc = null,
}: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  // One shared spring, staggered by index, so the column resolves as a unit.
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    // The navbar is fixed, so the section has to start below it — h-[4.5rem]
    // on mobile, h-20 from md up — and the panel height subtracts the same
    // amount so the hero still resolves to a bit under one screen.
    <section className="bg-cream pt-[4.5rem] md:pt-20">
      <div className="grid items-stretch md:min-h-[calc(90svh-5rem)] md:grid-cols-2">
        {/* ---- Image panel. Nothing is ever drawn on top of this. ---- */}
        <div className="relative order-1 aspect-[4/5] w-full overflow-hidden bg-cream-deep sm:aspect-[16/11] md:order-2 md:aspect-auto md:h-full">
          <Image
            src={posterSrc}
            alt={posterAlt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />

          {videoSrc && !reduceMotion && (
            <video
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterSrc}
              aria-hidden
              tabIndex={-1}
              onCanPlay={() => setVideoReady(true)}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}
        </div>

        {/* ---- Type panel ---- */}
        <div className="order-2 flex items-center px-6 py-16 sm:px-10 md:order-1 md:py-20 lg:px-16 xl:px-24">
          <div className="w-full max-w-xl">
            {eyebrow && (
              <motion.p className="eyebrow" {...rise(0.05)}>
                {eyebrow}
              </motion.p>
            )}

            <motion.h1 className="mt-6 font-serif text-display-lg" {...rise(0.14)}>
              {headline}
            </motion.h1>

            {supporting && (
              <motion.p
                className="mt-7 max-w-md text-base leading-relaxed text-charcoal/65 md:text-lg"
                {...rise(0.22)}
              >
                {supporting}
              </motion.p>
            )}

            <motion.div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" {...rise(0.3)}>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-3 rounded-full bg-charcoal px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-cream transition-transform duration-500 ease-editorial hover:-translate-y-0.5"
              >
                {ctaLabel}
                <span aria-hidden>&rarr;</span>
              </Link>

              {secondaryLabel && secondaryHref && (
                <Link
                  href={secondaryHref}
                  className="link-underline text-[0.72rem] uppercase tracking-[0.2em]"
                >
                  {secondaryLabel}
                </Link>
              )}
            </motion.div>

            {notes && notes.length > 0 && (
              <motion.ul
                className="mt-12 flex flex-wrap gap-x-7 gap-y-2 border-t border-charcoal/10 pt-7 text-[0.7rem] uppercase tracking-[0.14em] text-charcoal/45"
                {...rise(0.38)}
              >
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
