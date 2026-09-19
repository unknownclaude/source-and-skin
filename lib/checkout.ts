import type { HydratedLine } from "@/components/CartProvider";
import { withAttribution } from "@/lib/attribution";

/**
 * The handoff to Shopify checkout.
 *
 * A cart permalink is the simplest route off this site and into a real
 * checkout — no Storefront API, no tokens:
 *
 *   https://SHOP.myshopify.com/cart/VARIANT_ID:QTY,VARIANT_ID:QTY
 *
 * Two things have to be true before it works, and exactly one of them is code:
 *
 *   1. NEXT_PUBLIC_SHOPIFY_DOMAIN has to be set.
 *   2. Every product/option combination needs its Shopify variant ID. The
 *      catalogue has options but no variant IDs, so `variantIdFor` is the one
 *      function left to fill in — map a slug plus a selection onto the numeric
 *      ID Shopify generated for that variant. Until it returns something this
 *      builder returns null, and the cart keeps saying checkout is not live
 *      rather than sending anyone to a broken URL.
 *
 * `withAttribution` is applied last and is the reason this file exists at all.
 * Shopify starts a new session at this URL and reads the campaign from it; if
 * the UTMs are not carried over, every order arrives attributed to a referral
 * from our own domain. See lib/attribution.ts.
 */

/**
 * TODO(shopify): return the numeric variant ID for a configured line.
 *
 * Shopify creates one variant per option combination, so a bundle with a
 * style and a colour has as many variants as combinations. Fetch them once
 * with `productVariants` and keep the map beside the catalogue.
 */
function variantIdFor(_line: HydratedLine): string | null {
  return null;
}

export function isCheckoutConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN);
}

/** The checkout URL for a bag, or null when the handoff is not ready. */
export function buildCheckoutUrl(lines: HydratedLine[]): string | null {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  if (!domain || lines.length === 0) return null;

  const parts: string[] = [];
  for (const line of lines) {
    const variantId = variantIdFor(line);
    // One unmapped line would silently drop an item from the order, so the
    // whole handoff is refused instead.
    if (!variantId) return null;
    parts.push(`${variantId}:${line.quantity}`);
  }

  return withAttribution(`https://${domain}/cart/${parts.join(",")}`);
}
