import { shopifyVariants } from "@/data/variants";

/**
 * The live connection to the Shopify store.
 *
 * Server-side only. The token is read from `SHOPIFY_STOREFRONT_TOKEN` —
 * deliberately not `NEXT_PUBLIC_` — so Next will not inline it into the
 * browser bundle. If this module is ever imported from a client component the
 * token reads as undefined and the fetch fails loudly, rather than shipping a
 * credential to every visitor.
 *
 * What this is for: the catalogue in `data/products.ts` holds the editorial
 * copy, which Shopify does not have and should not own. Shopify holds the two
 * facts that change without anybody editing a file — what a variant costs and
 * whether it is still in stock. Keeping each where it belongs is the whole
 * design. The alternative, one hardcoded price in two systems, agrees on the
 * day you set it up and quietly stops agreeing later, and the customer is the
 * one who finds out.
 *
 * Everything here fails soft. No token, no network, a malformed response, a
 * slow store: the site falls back to the static catalogue and carries on
 * exactly as it did before this file existed. A storefront that goes down
 * because its CMS did is a worse storefront.
 */

/**
 * Pinned rather than "latest". Shopify's Storefront API deprecates fields on a
 * published schedule, and a build that silently follows the newest version is
 * a build that breaks on someone else's release day.
 */
const API_VERSION = "2025-07";

/** How long a fetched catalogue is served before it is refreshed in the background. */
export const LIVE_CATALOGUE_TTL_SECONDS = 300;

/** Longer than a healthy response, shorter than anybody's patience. */
const TIMEOUT_MS = 5000;

export type LiveVariant = {
  /** AUD, from Shopify — this is what the customer is actually charged. */
  price: number;
  availableForSale: boolean;
};

export type LiveProduct = {
  /** True while any variant can still be bought. */
  availableForSale: boolean;
  /** Cheapest available variant, for a "from $X" label. */
  minPrice: number;
};

export type LiveCatalogue = {
  fetchedAt: string;
  /**
   * Keyed by numeric Shopify variant ID — the same IDs `data/variants.ts`
   * maps our slug-and-selection onto. Keying by ID rather than by option
   * names means this layer never has to re-derive which Shopify option
   * corresponds to which of ours; `findVariantId` already answers that, and
   * the coverage check already proves it answers correctly.
   */
  variants: Record<string, LiveVariant>;
  /** Keyed by our slug, not Shopify's handle. */
  products: Record<string, LiveProduct>;
};

const QUERY = `
  query Catalogue {
    products(first: 50) {
      nodes {
        handle
        availableForSale
        priceRange { minVariantPrice { amount } }
        variants(first: 100) {
          nodes {
            id
            availableForSale
            price { amount }
          }
        }
      }
    }
  }
`;

type StorefrontResponse = {
  data?: {
    products?: {
      nodes?: {
        handle?: string;
        availableForSale?: boolean;
        priceRange?: { minVariantPrice?: { amount?: string } };
        variants?: { nodes?: { id?: string; availableForSale?: boolean; price?: { amount?: string } }[] };
      }[];
    };
  };
  errors?: { message?: string }[];
};

export type ShopifyConnection =
  | { status: "unconfigured"; missing: string[] }
  | { status: "configured"; endpoint: string };

function endpointFor(domain: string): string {
  // A seam for pointing at a mock while testing the merge without a real
  // store. Unset in production, where the endpoint is derived from the domain.
  return (
    process.env.SHOPIFY_STOREFRONT_ENDPOINT ??
    `https://${domain}/api/${API_VERSION}/graphql.json`
  );
}

/** Whether the store can be read, and if not, precisely what is missing. */
export function shopifyConnection(): ShopifyConnection {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

  const missing: string[] = [];
  if (!domain) missing.push("NEXT_PUBLIC_SHOPIFY_DOMAIN");
  if (!token) missing.push("SHOPIFY_STOREFRONT_TOKEN");
  if (missing.length || !domain) return { status: "unconfigured", missing };

  return { status: "configured", endpoint: endpointFor(domain) };
}

/** Shopify's handle → our slug. Two of the seven differ. */
function slugForHandle(handle: string): string | undefined {
  for (const [slug, entry] of Object.entries(shopifyVariants)) {
    if (entry.handle === handle) return slug;
  }
  return undefined;
}

/** "gid://shopify/ProductVariant/54017648066860" → "54017648066860". */
function numericId(gid: string): string {
  return gid.slice(gid.lastIndexOf("/") + 1);
}

/**
 * Reads the store. Returns null on anything at all going wrong.
 *
 * Null is not an error state to handle upstream — it means "use the static
 * catalogue", which is always a valid answer. Callers should not branch on
 * why.
 */
export async function fetchLiveCatalogue(): Promise<LiveCatalogue | null> {
  const connection = shopifyConnection();
  if (connection.status !== "configured") return null;

  try {
    const response = await fetch(connection.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_TOKEN as string,
      },
      body: JSON.stringify({ query: QUERY }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Next caches this and refreshes it in the background, so pages stay
      // static and a visitor never waits on Shopify.
      next: { revalidate: LIVE_CATALOGUE_TTL_SECONDS, tags: ["shopify-catalogue"] },
    });

    if (!response.ok) {
      console.warn(`[shopify] ${response.status} from the Storefront API — using the static catalogue.`);
      return null;
    }

    const body = (await response.json()) as StorefrontResponse;
    if (body.errors?.length) {
      console.warn(`[shopify] Storefront API errors: ${body.errors.map((e) => e.message).join("; ")}`);
      return null;
    }

    const nodes = body.data?.products?.nodes;
    if (!Array.isArray(nodes)) {
      console.warn("[shopify] Unexpected response shape — using the static catalogue.");
      return null;
    }

    const variants: Record<string, LiveVariant> = {};
    const products: Record<string, LiveProduct> = {};

    for (const node of nodes) {
      if (!node?.handle) continue;
      const slug = slugForHandle(node.handle);
      // A product in Shopify we do not sell here is not an error — the store
      // may carry things the site does not list.
      if (!slug) continue;

      for (const variant of node.variants?.nodes ?? []) {
        if (!variant?.id) continue;
        const price = Number(variant.price?.amount);
        if (!Number.isFinite(price)) continue;
        variants[numericId(variant.id)] = {
          price,
          availableForSale: variant.availableForSale !== false,
        };
      }

      const minPrice = Number(node.priceRange?.minVariantPrice?.amount);
      products[slug] = {
        availableForSale: node.availableForSale !== false,
        minPrice: Number.isFinite(minPrice) ? minPrice : 0,
      };
    }

    if (Object.keys(variants).length === 0) {
      console.warn("[shopify] No matching variants in the response — using the static catalogue.");
      return null;
    }

    return { fetchedAt: new Date().toISOString(), variants, products };
  } catch (error) {
    // Includes the timeout. Deliberately swallowed: the site works without it.
    console.warn(
      `[shopify] Could not reach the Storefront API (${
        error instanceof Error ? error.message : "unknown error"
      }) — using the static catalogue.`
    );
    return null;
  }
}
