"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import CartCrossSell from "@/components/CartCrossSell";
import { useCart } from "@/components/CartProvider";
import FreeShippingMeter from "@/components/FreeShippingMeter";
import { gstStatement } from "@/data/legal";
import { shippingTerms } from "@/data/site";
import { formatPrice } from "@/lib/format";

/**
 * Slide-over bag.
 *
 * It ends at a link to /checkout rather than at a payment button. The bag is
 * for changing your mind about what is in it; the decision to spend money
 * belongs on a page big enough to show the total with shipping in it, the
 * terms being agreed to, and who ends up handling the card. That page also
 * explains itself when payments are not live yet, so this button always has
 * somewhere real to go.
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
                <FreeShippingMeter subtotal={subtotal} />

                <ul className="flex-1 divide-y divide-charcoal/10 overflow-y-auto px-6">
                  {lines.map((line) => (
                    <li key={line.key} className="flex gap-4 py-5">
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 shrink-0 overflow-hidden bg-sand"
                      >
                        <Image
                          src={line.image}
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
                          {line.selectionLabel && (
                            <p className="mt-1 text-[0.78rem] uppercase tracking-[0.12em] text-charcoal/50">
                              {line.selectionLabel}
                            </p>
                          )}
                          <p className="mt-1 text-sm text-charcoal/60">
                            {formatPrice(line.unitPrice)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-charcoal/20">
                            <button
                              type="button"
                              onClick={() => setQuantity(line.key, line.quantity - 1)}
                              className="px-2.5 py-1 text-sm transition-colors hover:bg-charcoal/5"
                              aria-label={`Decrease quantity of ${line.product.name}${line.selectionLabel ? `, ${line.selectionLabel}` : ""}`}
                            >
                              &minus;
                            </button>
                            <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(line.key, line.quantity + 1)}
                              className="px-2.5 py-1 text-sm transition-colors hover:bg-charcoal/5"
                              aria-label={`Increase quantity of ${line.product.name}${line.selectionLabel ? `, ${line.selectionLabel}` : ""}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(line.key)}
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

                <CartCrossSell />

                <footer className="border-t border-charcoal/10 px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.75rem] uppercase tracking-[0.18em] text-charcoal/60">
                      Subtotal
                    </span>
                    <span className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/55">
                    {`${gstStatement} Free Australian shipping over $${shippingTerms.freeThreshold}.`}
                  </p>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-6 block rounded-full bg-charcoal py-4 text-center text-[0.72rem] uppercase tracking-[0.18em] text-cream transition-all duration-500 ease-editorial hover:-translate-y-0.5"
                  >
                    Review and check out
                  </Link>
                  <p className="mt-3 text-center text-[0.7rem] text-charcoal/45">
                    Shipping and your total are shown on the next page. Nothing is charged there.
                  </p>
                </footer>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
