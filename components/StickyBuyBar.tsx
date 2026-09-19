"use client";

import { useEffect, useRef, useState } from "react";

import {
  isSelectionComplete,
  missingOptions,
  unitPrice,
  type OptionSelection,
  type Product,
} from "@/data/products";
import { formatPrice } from "@/lib/format";

/**
 * Mobile-only buy bar that appears once the real one scrolls away.
 *
 * On a phone the product page runs several screens — options, benefits, four
 * accordions, reviews, related products — and the only way to buy sits near
 * the top. Somebody who reads to the bottom and decides has to scroll back up
 * to act on it, and a proportion of them simply do not.
 *
 * It mirrors the main form rather than replacing it: same selection, same
 * completeness rule, same price. When the product is not yet configured the
 * bar scrolls back to the unanswered question instead of adding something
 * half-specified — on a small screen the picker is usually off-screen, so
 * moving the eye to it is the useful response to a blocked tap.
 *
 * Hidden from assistive technology while off-screen, and `md:hidden` because
 * the desktop buy column is already sticky.
 */
export default function StickyBuyBar({
  product,
  selection,
  onMissing,
  onAdd,
  /** The element whose disappearance reveals the bar — the real buy form. */
  watchRef,
}: {
  product: Product;
  selection: OptionSelection;
  onMissing: (optionIds: string[]) => void;
  onAdd: () => void;
  watchRef: React.RefObject<HTMLElement>;
}) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = watchRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show only once the real button has left upward — not when the page
        // first loads with it below the fold, and not on the way back down.
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchRef]);

  const complete = isSelectionComplete(product, selection);
  const price = unitPrice(product, selection);

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-cream/95 px-4 py-3 backdrop-blur-sm transition-transform duration-500 ease-editorial md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-sm leading-tight">{product.name}</p>
          <p className="text-xs tabular-nums text-charcoal/60">{formatPrice(price)}</p>
        </div>

        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() => {
            if (!complete) {
              const outstanding = missingOptions(product, selection);
              onMissing(outstanding.map((option) => option.id));
              // Put the unanswered question back on screen — on a phone it is
              // almost certainly scrolled out of view.
              watchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              return;
            }
            onAdd();
          }}
          className={`shrink-0 rounded-full px-6 py-3.5 text-[0.7rem] uppercase tracking-[0.18em] transition-colors ${
            complete ? "bg-charcoal text-cream" : "bg-charcoal/30 text-cream"
          }`}
        >
          {complete ? "Add to bag" : "Choose options"}
        </button>
      </div>
    </div>
  );
}
