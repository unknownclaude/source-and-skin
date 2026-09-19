"use client";

import { useEffect, useState } from "react";

import { estimateDelivery } from "@/lib/delivery";

/**
 * "Order today, estimated arrival Tue 24 – Fri 27 Sep."
 *
 * Computed after mount rather than during render, for two reasons that pull
 * the same way. The product pages are statically generated, so anything
 * computed at build time would show the build day's dates forever. And a date
 * derived from `new Date()` during render differs between the server's HTML
 * and the browser's first paint whenever the two straddle midnight, which is
 * a hydration mismatch.
 *
 * Rendering nothing until mounted costs one frame and removes both problems.
 * The reserved height stops the buy column jumping when it appears.
 */
export default function DeliveryEstimate() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(estimateDelivery().label);
  }, []);

  return (
    <p className="mt-5 min-h-5 text-xs leading-relaxed text-charcoal/60">
      {label && (
        <>
          Order today, estimated arrival{" "}
          <span className="text-charcoal/85">{label}</span> for metropolitan Australia. Estimate,
          not a guarantee — see{" "}
          <a href="/shipping" className="link-underline">
            shipping
          </a>
          .
        </>
      )}
    </p>
  );
}
