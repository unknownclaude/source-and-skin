import {
  enumerateSelections,
  getLiveOptions,
  unitPrice,
  type OptionSelection,
  type Product,
  type ProductOption,
} from "@/data/products";
import { findVariantId } from "@/data/variants";
import type { LiveCatalogue } from "@/lib/shopify";

/**
 * Where the static catalogue and the live store meet.
 *
 * Every function here takes `live` and tolerates it being null, which is the
 * state whenever Shopify is unreachable or the connection has not been set up.
 * In that state each one answers from `data/products.ts` and the site behaves
 * exactly as it did before there was a store to talk to.
 *
 * The division of labour is deliberate:
 *
 *   - **Copy, photography, options** are ours. Shopify has no opinion worth
 *     having about how a sponge is described, and its product descriptions
 *     are not the ones that took a week to write.
 *   - **Price and stock** are Shopify's. They are the two things that change
 *     without anybody editing a file, and Shopify is what will actually charge
 *     the customer. A price shown here that Shopify disagrees with is not a
 *     display bug, it is a misleading price under section 18 of the Australian
 *     Consumer Law — so where the two disagree, the one that can take money
 *     wins.
 */

export type Availability = "in-stock" | "sold-out" | "unknown";

/**
 * Every complete configuration consistent with what has been chosen so far.
 *
 * Partial selections are the normal case on a product page — somebody picks
 * "With handles" a few seconds before they pick a colour — and both the price
 * and the sold-out marks have to answer sensibly in between. An option not yet
 * answered simply does not constrain the set.
 *
 * `getLiveOptions` rather than `Object.keys(selection)` because a selection
 * can carry a value for an option that is no longer shown, and a stale answer
 * should not narrow anything.
 */
function matchingSelections(product: Product, selection: OptionSelection): OptionSelection[] {
  const answered = getLiveOptions(product, selection)
    .map((option) => option.id)
    .filter((id) => selection[id] !== undefined);

  if (!answered.length) return enumerateSelections(product);

  return enumerateSelections(product).filter((combination) =>
    answered.every((id) => combination[id] === undefined || combination[id] === selection[id])
  );
}

/** The live price for one exact configuration, when there is one. */
function variantPrice(
  product: Product,
  selection: OptionSelection,
  live: LiveCatalogue
): number | undefined {
  const variantId = findVariantId(product.slug, selection);
  return variantId ? live.variants[variantId]?.price : undefined;
}

/** Cheapest still-buyable configuration consistent with these choices. */
function cheapestLive(
  product: Product,
  selection: OptionSelection,
  live: LiveCatalogue
): number | undefined {
  const prices = matchingSelections(product, selection)
    .filter((combination) => availabilityFor(product, combination, live) !== "sold-out")
    .map((combination) => variantPrice(product, combination, live))
    .filter((price): price is number => price !== undefined);

  return prices.length ? Math.min(...prices) : undefined;
}

/**
 * What one configuration costs.
 *
 * Three answers, in order of how much they know:
 *
 *   1. Shopify's price for the exact variant, once enough has been chosen to
 *      identify one. This needs no arithmetic — the store's price for "The
 *      Season, with handles" is already $42, the upgrade included.
 *   2. The cheapest live price still consistent with the choices made so far.
 *      Choosing "With handles" moves the figure to $42 immediately, before a
 *      colour has been picked, which is what the static price did and what
 *      anybody watching the number expects.
 *   3. The static price, when there is no store to ask.
 */
export function priceFor(
  product: Product,
  selection: OptionSelection,
  live: LiveCatalogue | null
): number {
  if (live) {
    const exact = variantPrice(product, selection, live);
    if (exact !== undefined) return exact;

    const cheapest = cheapestLive(product, selection, live);
    if (cheapest !== undefined) return cheapest;
  }
  return unitPrice(product, selection);
}

/** The "from $X" figure on a card — cheapest configuration anyone can still buy. */
export function fromPriceFor(product: Product, live: LiveCatalogue | null): number {
  if (!live) return product.price;
  return cheapestLive(product, {}, live) ?? product.price;
}

/**
 * Whether one configuration can be bought.
 *
 * "unknown" is its own answer and is not the same as "in-stock". It means the
 * store was not reachable, and the UI should say nothing rather than claim
 * availability it cannot vouch for — an "In stock" badge that is really "we
 * did not check" is exactly the representation to avoid.
 */
export function availabilityFor(
  product: Product,
  selection: OptionSelection,
  live: LiveCatalogue | null
): Availability {
  if (!live) return "unknown";
  const variantId = findVariantId(product.slug, selection);
  if (!variantId) return "unknown";
  const variant = live.variants[variantId];
  if (!variant) return "unknown";
  return variant.availableForSale ? "in-stock" : "sold-out";
}

/** Whether anything at all in this product can still be bought. */
export function productAvailability(product: Product, live: LiveCatalogue | null): Availability {
  if (!live) return "unknown";
  const entry = live.products[product.slug];
  if (!entry) return "unknown";
  return entry.availableForSale ? "in-stock" : "sold-out";
}

/**
 * Whether choosing this option value can still lead to a purchasable variant.
 *
 * A colour is only sold out when *every* configuration containing it is sold
 * out. That distinction matters on the bundles: "Purple" may be gone as a
 * handled sponge and still available as a plain one, and greying out the
 * swatch under "Sponge style: Regular" would be turning away a sale we can
 * fill.
 */
export function optionValueAvailability(
  product: Product,
  option: ProductOption,
  value: string,
  selection: OptionSelection,
  live: LiveCatalogue | null
): Availability {
  if (!live) return "unknown";

  const candidates = matchingSelections(product, { ...selection, [option.id]: value });

  // A value that matches no combination is not offered under these choices;
  // saying "sold out" would be a lie about stock we do hold.
  if (!candidates.length) return "unknown";

  return candidates.some((c) => availabilityFor(product, c, live) === "in-stock")
    ? "in-stock"
    : "sold-out";
}
