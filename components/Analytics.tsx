"use client";

import Script from "next/script";
import { useEffect } from "react";

import { captureAttribution } from "@/lib/attribution";

/**
 * Site analytics, plus first-touch attribution capture.
 *
 * Plausible rather than GA4, for reasons that are partly legal: it sets no
 * cookies and stores no personal information, which is what lets the privacy
 * policy say this site runs no tracking cookies and lets the EU/UK sentence in
 * that policy stay true without a consent banner. If you swap this for GA4,
 * the cookies section of the privacy policy has to change on the same day.
 *
 * Nothing renders unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, so the site runs
 * unmeasured rather than broken until you have an account.
 *
 * The attribution capture runs regardless of whether analytics is configured.
 * It is what puts the real traffic source on the Shopify checkout URL, and
 * Shopify's own reports depend on it whether or not anything else is watching.
 */
export default function Analytics() {
  useEffect(() => {
    captureAttribution();
  }, []);

  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
