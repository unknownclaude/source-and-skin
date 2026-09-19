"use client";

import { shippingTerms } from "@/data/site";
import { formatPrice } from "@/lib/format";

/**
 * Progress toward free shipping.
 *
 * The gap between the entry product ($22) and the free-shipping threshold
 * ($45) is almost exactly one more item, so the single most useful thing the
 * bag can say is how far away it is. Saying "free shipping over $45" is a
 * policy; saying "$23 away" is an instruction.
 *
 * The bar is decorative — the sentence above it carries the whole meaning, so
 * a screen reader gets the number rather than a progressbar role it would have
 * to interpret. `aria-live="polite"` announces the new remainder when the bag
 * changes, without interrupting.
 */
export default function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const threshold = shippingTerms.freeThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const qualified = remaining === 0;
  const pct = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="border-b border-charcoal/10 px-6 py-4">
      <p aria-live="polite" className="text-xs leading-relaxed text-charcoal/70">
        {qualified ? (
          <>
            <span className="font-medium text-charcoal">Free standard shipping</span> applies to this
            order.
          </>
        ) : (
          <>
            <span className="font-medium text-charcoal">{formatPrice(remaining)} away</span> from
            free standard shipping within Australia.
          </>
        )}
      </p>

      <div aria-hidden className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-charcoal/10">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-editorial ${
            qualified ? "bg-olive" : "bg-charcoal/55"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
