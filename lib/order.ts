import { shippingTerms } from "@/data/site";

/**
 * What the order comes to, worked out before the customer leaves the site.
 *
 * The standard alternative is "shipping calculated at checkout", and it is the
 * single most reliable way to lose an order at the last step: the customer has
 * decided to spend $27, clicks through, and is shown $36.95 by a different
 * website with a different logo on it. Under section 48 of the Australian
 * Consumer Law a price representation has to include the single total price
 * where one can be stated, and here it can be — the shipping rule is two
 * numbers published on our own shipping page.
 *
 * So the total is stated up front, and labelled precisely:
 *
 *   - **Australian delivery.** Free at or above the threshold, flat rate
 *     below it. This is exact, not an estimate, and Shopify is configured to
 *     charge the same two numbers.
 *   - **Everywhere else.** A flat rate to every destination, which is how the
 *     store is configured, so this is exact too. Import duties are not in it
 *     and cannot be: they are levied by the destination country, not charged
 *     by us, and the checkout page says so beside the figure.
 *
 * `shippingTerms` is the same source the shipping page, the cart meter, the
 * product copy and the FAQ read from, so these figures cannot drift apart from
 * the published policy.
 */

export type OrderTotals = {
  subtotal: number;
  /** AUD. */
  shipping: number;
  /** True when this order has crossed the free-shipping threshold. */
  freeShipping: boolean;
  /** What the customer pays us. */
  total: number;
  /** How far off the free-shipping threshold this order is. 0 once qualified. */
  remainingForFreeShipping: number;
};

export type Destination = "australia" | "elsewhere";

export function orderTotals(subtotal: number, destination: Destination = "australia"): OrderTotals {
  const remainingForFreeShipping = Math.max(0, shippingTerms.freeThreshold - subtotal);

  if (destination !== "australia") {
    // One flat rate everywhere, matching both international zones in Shopify.
    // The free-shipping threshold is an Australian offer and is not extended
    // here, which is why `freeShipping` stays false however large the order.
    const shipping = shippingTerms.internationalFlatRate;
    return {
      subtotal,
      shipping,
      freeShipping: false,
      total: subtotal + shipping,
      remainingForFreeShipping,
    };
  }

  const freeShipping = subtotal >= shippingTerms.freeThreshold;
  const shipping = freeShipping ? 0 : shippingTerms.flatRate;

  return {
    subtotal,
    shipping,
    freeShipping,
    total: subtotal + shipping,
    remainingForFreeShipping,
  };
}
