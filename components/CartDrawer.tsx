"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

/**
 * Slide-over bag.
 *
 * Checkout is intentionally inert — the button explains itself rather than
 * pretending to take payment. See README → "Wiring up real checkout" for where
 * a Shopify or Stripe handoff plugs in.
 */
export default function CartDrawer() {
  const { lines, subtotal, isOpen, closeCart, setQuantity, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    // Move focus into the panel, and keep Tab inside it while it is open.
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCart();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping bag">
          <motion.button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 h-full w-full cursor-default bg-charcoal/35"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />

          <motion.div
            ref={panelRef}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
              <h2 className="font-serif text-xl">Your bag</h2>
              <button
                type="button"
                onClick={closeCart}
                data-autofocus
                className="text-[0.75rem] uppercase tracking-[0.18em] text-charcoal/60 transition-colors hover:text-charcoal"
              >
                Close
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="font-serif text-2xl">Nothing here yet.</p>
                <p className="max-w-xs text-sm leading-relaxed text-charcoal/65">
                  Two objects, one daily ritual. Start with the bundle if you are not sure.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-charcoal px-7 py-3 text-[0.72rem] uppercase tracking-[0.18em] text-cream transition-opacity hover:opacity-85"
                >
                  Shop the collection
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-charcoal/10 overflow-y-auto px-6">
                  {lines.map((line) => (
                    <li key={line.slug} className="flex gap-4 py-5">
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 shrink-0 overflow-hidden bg-sand"
                      >
                        <Image
                          src={line.product.images.main}
                          alt={line.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/products/${line.slug}`}
                            onClick={closeCart}
                            className="font-serif text-base leading-snug hover:opacity-70"
                          >
                            {line.product.name}
                          </Link>
                          <p className="mt-1 text-sm text-charcoal/60">
                            {formatPrice(line.product.price)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-charcoal/20">
                            <button
                              type="button"
                              onClick={() => setQuantity(line.slug, line.quantity - 1)}
                              className="px-2.5 py-1 text-sm transition-colors hover:bg-charcoal/5"
                              aria-label={`Decrease quantity of ${line.product.name}`}
                            >
                              &minus;
                            </button>
                            <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(line.slug, line.quantity + 1)}
                              className="px-2.5 py-1 text-sm transition-colors hover:bg-charcoal/5"
                              aria-label={`Increase quantity of ${line.product.name}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(line.slug)}
                            className="text-[0.7rem] uppercase tracking-[0.16em] text-charcoal/50 underline-offset-4 transition-colors hover:text-charcoal hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm tabular-nums">{formatPrice(line.lineTotal)}</p>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-charcoal/10 px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.75rem] uppercase tracking-[0.18em] text-charcoal/60">
                      Subtotal
                    </span>
                    <span className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/55">
                    All prices in AUD. Shipping and taxes calculated at checkout. Free
                    Australian shipping over $45.
                  </p>
                  <button
                    type="button"
                    disabled
                    className="mt-5 w-full cursor-not-allowed rounded-full bg-charcoal py-4 text-[0.72rem] uppercase tracking-[0.18em] text-cream opacity-45"
                  >
                    Checkout — coming soon
                  </button>
                </footer>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
