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
  /** Poster frame — also the entire hero if the video is missing or refused. */
  posterSrc: string;
  posterAlt: string;
  /** Omit or pass null to render the poster alone — no <video> element. */
  videoSrc?: string | null;
};

/**
 * Full-bleed hero.
 *
 * The video is progressive enhancement: the poster image is always rendered
 * underneath, so a missing file, a blocked autoplay, a reduced-motion
 * preference or a slow connection all degrade to a still frame rather than a
 * black rectangle.
 *
 * TODO(video): drop a looping, muted, ~6–10s clip at /public/videos/hero.mp4
 * and point `site.heroVideo` at it. See public/videos/README.md for the brief.
 */
export default function Hero({
  eyebrow,
  headline,
  supporting,
  ctaLabel,
  ctaHref,
  posterSrc,
  posterAlt,
  videoSrc = null,
}: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-charcoal md:min-h-[92svh]">
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        sizes="100vw"
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

      {/* Keeps the headline legible over whatever frame is underneath —
          heavier at the bottom where the type sits, especially on mobile. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/25 to-charcoal/15 md:from-charcoal/65 md:via-charcoal/12 md:to-charcoal/20"
      />

      <div className="edge relative z-10 pb-16 pt-32 md:pb-24">
        <div className="max-w-3xl text-cream">
          {eyebrow && (
            <motion.p
              className="eyebrow !text-cream/70"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            className="mt-5 font-serif text-display-xl"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {headline}
          </motion.h1>

          {supporting && (
            <motion.p
              className="mt-6 max-w-md text-base leading-relaxed text-cream/80 md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {supporting}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={ctaHref}
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-cream px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-charcoal transition-transform duration-500 ease-editorial hover:-translate-y-0.5"
            >
              {ctaLabel}
              <span aria-hidden>&rarr;</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
