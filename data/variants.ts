/**
 * Shopify variant IDs, keyed by our slug and the customer's selection.
 *
 * This is the bridge between a configured cart line here and a line Shopify
 * can actually charge for. Shopify creates one variant per option combination,
 * so "The Season, with handles, purple" is a different numeric ID from "The
 * Season, regular, purple" — 65 of them across seven products.
 *
 * Why the IDs live in the repo rather than being fetched:
 *
 *   - the checkout permalink is built in the browser, at the moment someone
 *     clicks, and a network round trip there is a spinner between intent and
 *     payment — the worst possible place to put one;
 *   - a fetch that fails takes the checkout down with it, whereas a static map
 *     cannot fail;
 *   - the IDs are stable. Shopify keeps a variant's ID through price, title,
 *     inventory and image changes. It changes only if the variant is deleted
 *     and recreated, which is a thing you do deliberately.
 *
 * The cost is that this file has to be re-synced when the catalogue's *shape*
 * changes — a new colour, a new bundle, a product rebuilt from scratch.
 * `npm run check:variants` proves the map still covers every combination the
 * site can put in a bag, and fails the build rather than letting a customer
 * reach a checkout button that silently refuses.
 *
 * The `handle` on each entry is Shopify's slug, which is not always ours
 * (`ritual-bundle` here is `the-ritual-bundle` there). Nothing reads it today;
 * it is what a future Storefront API adapter will match on, and it is how you
 * find the product in the admin when a number below looks wrong.
 */

export type ProductVariants = {
  /** Shopify's product handle. Ours is the object key. */
  handle: string;
  /**
   * How the lookup key is assembled, one entry per Shopify option, in
   * Shopify's own order.
   *
   * Each entry lists the option ids in `data/products.ts` that can supply that
   * value — plural because a bundle's colour arrives under `sponge-colour` or
   * `handled-sponge-colour` depending on the style chosen, while Shopify sees
   * one "Sponge colour" option either way. The first id present wins.
   *
   * An empty array is a product with a single variant and nothing to choose.
   */
  options: string[][];
  /** Selection values joined by " / " → numeric variant ID. */
  ids: Record<string, string>;
};

/** Separator between option values in a lookup key — Shopify's own. */
export const VARIANT_KEY_SEPARATOR = " / ";

export const shopifyVariants: Record<string, ProductVariants> = {
  "african-net-sponge-regular": {
    handle: "african-net-sponge-regular",
    options: [["colour"]],
    ids: {
      White: "54017648066860",
      Red: "54017648099628",
      Blue: "54017648132396",
      Pink: "54017648165164",
      Yellow: "54017648197932",
      Purple: "54017648230700",
    },
  },

  "african-net-sponge-handle": {
    handle: "african-net-sponge-with-handle",
    options: [["colour"]],
    ids: {
      Black: "54017648722220",
      Blue: "54017648754988",
      Pink: "54017648787756",
      Purple: "54017648820524",
      White: "54017648853292",
    },
  },

  "miswak-stick-single": {
    handle: "miswak-stick-single",
    options: [],
    ids: { "": "54017803813164" },
  },

  "miswak-stick-3-pack": {
    handle: "miswak-stick-3-pack",
    options: [],
    ids: { "": "54017804304684" },
  },

  "ritual-bundle": {
    handle: "the-ritual-bundle",
    options: [["sponge-style"], ["sponge-colour", "handled-sponge-colour"]],
    ids: {
      "Regular / White": "54017806139692",
      "Regular / Red": "54017806172460",
      "Regular / Blue": "54017806205228",
      "Regular / Pink": "54017806237996",
      "Regular / Yellow": "54017806270764",
      "Regular / Purple": "54017806303532",
      "With handles / Black": "54092375654700",
      "With handles / Blue": "54092375687468",
      "With handles / Pink": "54092375720236",
      "With handles / Purple": "54092375753004",
      "With handles / White": "54092375785772",
    },
  },

  "the-season": {
    handle: "the-season",
    options: [["sponge-style"], ["sponge-colour", "handled-sponge-colour"]],
    ids: {
      "Regular / White": "54017804894508",
      "Regular / Red": "54017804927276",
      "Regular / Blue": "54017804960044",
      "Regular / Pink": "54017804992812",
      "Regular / Yellow": "54017805025580",
      "Regular / Purple": "54017805058348",
      "With handles / Black": "54092376080684",
      "With handles / Blue": "54092376113452",
      "With handles / Pink": "54092376146220",
      "With handles / Purple": "54092376178988",
      "With handles / White": "54092376211756",
    },
  },

  "the-full-ritual": {
    handle: "the-full-ritual",
    options: [["colour"], ["handled-colour"]],
    ids: {
      "White / Black": "54017807089964",
      "White / Blue": "54092376506668",
      "White / Pink": "54092376539436",
      "White / Purple": "54092376572204",
      "White / White": "54092376604972",
      "Red / Black": "54092376637740",
      "Red / Blue": "54092376670508",
      "Red / Pink": "54092376703276",
      "Red / Purple": "54092376736044",
      "Red / White": "54092376768812",
      "Blue / Black": "54092376801580",
      "Blue / Blue": "54092376834348",
      "Blue / Pink": "54092376867116",
      "Blue / Purple": "54092376899884",
      "Blue / White": "54092376932652",
      "Pink / Black": "54092376965420",
      "Pink / Blue": "54092376998188",
      "Pink / Pink": "54092377030956",
      "Pink / Purple": "54092377063724",
      "Pink / White": "54092377096492",
      "Yellow / Black": "54092377129260",
      "Yellow / Blue": "54092377162028",
      "Yellow / Pink": "54092377194796",
      "Yellow / Purple": "54092377227564",
      "Yellow / White": "54092377260332",
      "Purple / Black": "54092377293100",
      "Purple / Blue": "54092377325868",
      "Purple / Pink": "54092377358636",
      "Purple / Purple": "54092377391404",
      "Purple / White": "54092377424172",
    },
  },
};

/**
 * The numeric Shopify variant ID for a slug and a set of choices, or null.
 *
 * Null is a real answer, not an error to swallow: it means this exact
 * combination has no variant, and the caller's job is to refuse the whole
 * checkout rather than quietly drop the line. A customer who pays for four
 * items and receives three is a worse outcome than a button that says it
 * cannot continue.
 */
export function findVariantId(
  slug: string,
  selection: Record<string, string> = {}
): string | null {
  const entry = shopifyVariants[slug];
  if (!entry) return null;

  const parts: string[] = [];
  for (const candidates of entry.options) {
    const id = candidates.find((option) => selection[option]);
    if (!id) return null;
    parts.push(selection[id]);
  }

  return entry.ids[parts.join(VARIANT_KEY_SEPARATOR)] ?? null;
}
