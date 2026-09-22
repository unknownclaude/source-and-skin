import type { HydratedLine } from "@/components/CartProvider";
import { anyPaymentMethodEnabled } from "@/data/payments";
import { describeSelection, enumerateSelections, products } from "@/data/products";
import { findVariantId } from "@/data/variants";
import { withAttribution } from "@/lib/attribution";

/**
 * The handoff from this site's bag to a checkout that can take money.
 *
 * A cart permalink is the whole mechanism — no Storefront API, no tokens, no
 * secrets in the bundle:
 *
 *   https://SHOP.myshopify.com/cart/VARIANT_ID:QTY,VARIANT_ID:QTY
 *
 * Shopify builds a cart from that URL and runs its own hosted checkout, which
 * is the point: card numbers are typed on Shopify's domain, under Shopify's
 * PCI compliance, and never touch this application. There is nothing here to
 * breach.
 *
 * Three things have to be true before the button can be live, and this module
 * reports which one is missing rather than returning a bare null:
 *
 *   1. `NEXT_PUBLIC_SHOPIFY_DOMAIN` is set — where to send them.
 *   2. At least one method in `data/payments.ts` is enabled — meaning money
 *      can actually change hands at the other end. A Shopify store without
 *      Shopify Payments activated still *renders* a checkout; it just cannot
 *      complete one, and sending a customer into that is worse than a button
 *      that says it is not ready.
 *   3. Every line maps to a variant ID (`data/variants.ts`).
 *
 * `withAttribution` is applied last, and is the reason a separate module
 * exists for this at all. Shopify starts a fresh session at that URL and reads
 * the campaign from the query string; without it, every order arrives
 * attributed to a referral from our own domain and the ad that paid for the
 * sale disappears from the report. See lib/attribution.ts.
 */

export type CheckoutState =
  /** Nothing in the bag. */
  | { status: "empty" }
  /** No `NEXT_PUBLIC_SHOPIFY_DOMAIN`. Nowhere to send anyone. */
  | { status: "not-configured" }
  /** Destination known, but no payment method can take money yet. */
  | { status: "no-payment-methods" }
  /**
   * A line has no Shopify variant. Carries the human description of each
   * offending line, because the alternative — dropping it from the URL — bills
   * someone for three items and ships them two.
   */
  | { status: "unmapped"; lines: string[] }
  /** Good to go. */
  | { status: "ready"; url: string };

function shopDomain(): string | undefined {
  return process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
}

/** True when a destination exists and something there can take a payment. */
export function isCheckoutLive(): boolean {
  return Boolean(shopDomain()) && anyPaymentMethodEnabled();
}

/**
 * Where the bag stands: either a URL to send someone to, or exactly why not.
 *
 * The caller is expected to render the reason. A checkout button that is
 * simply disabled, with no explanation, reads as a broken site; one that says
 * "payments are being activated — nothing can be charged yet" reads as an
 * honest one, and the customer comes back.
 */
export function checkoutState(lines: HydratedLine[]): CheckoutState {
  if (lines.length === 0) return { status: "empty" };

  const domain = shopDomain();
  if (!domain) return { status: "not-configured" };
  if (!anyPaymentMethodEnabled()) return { status: "no-payment-methods" };

  const parts: string[] = [];
  const unmapped: string[] = [];

  for (const line of lines) {
    const variantId = findVariantId(line.slug, line.selection);
    if (!variantId) {
      unmapped.push(
        line.selectionLabel ? `${line.product.name} (${line.selectionLabel})` : line.product.name
      );
      continue;
    }
    parts.push(`${variantId}:${line.quantity}`);
  }

  if (unmapped.length) return { status: "unmapped", lines: unmapped };

  return { status: "ready", url: withAttribution(`https://${domain}/cart/${parts.join(",")}`) };
}

/* -------------------------------------------------------------------------
 * Coverage
 *
 * Every combination this site can put in a bag needs a variant on the other
 * side. Adding a seventh sponge colour to `data/products.ts` is a one-line
 * change that silently creates six unsellable bundle configurations, and the
 * failure surfaces at the checkout button — after the customer has chosen.
 *
 * So the catalogue is enumerated and checked against the map, and the result
 * is shown on the checkout page's setup panel while payments are off. It is a
 * warning rather than a build failure on purpose: a missing variant should
 * stop that one line being sold, not stop the site from deploying.
 * ---------------------------------------------------------------------- */

export type VariantCoverage = {
  /** Combinations the site can produce. */
  total: number;
  /** Those with a Shopify variant behind them. */
  mapped: number;
  /** Human descriptions of the ones without. */
  missing: string[];
};

export function variantCoverage(): VariantCoverage {
  let total = 0;
  const missing: string[] = [];

  for (const product of products) {
    for (const selection of enumerateSelections(product)) {
      total += 1;
      if (findVariantId(product.slug, selection)) continue;
      const label = describeSelection(product, selection);
      missing.push(label ? `${product.name} — ${label}` : product.name);
    }
  }

  return { total, mapped: total - missing.length, missing };
}
