/**
 * Single source of truth for brand-level content.
 *
 * Everything a rebrand touches lives here — the name, the tagline, the nav and
 * the social handles. No component hardcodes the brand name; they all read it
 * from this file, so a rename is a one-line change.
 */

/** Used when nothing else says otherwise — the intended production domain. */
const FALLBACK_DOMAIN = "https://sourceandskin.com";

/**
 * The canonical origin, worked out at build time.
 *
 * This one string drives `metadataBase`, every canonical link, the Open Graph
 * URLs, the sitemap and the image URLs in the product JSON-LD. Hardcoding it
 * means a preview deployment publishes canonicals pointing at a domain it is
 * not served from, which tells Google the preview is a duplicate of a site
 * that may not exist yet — the classic way to launch with the wrong pages
 * indexed.
 *
 * Resolution order:
 *
 *   1. `NEXT_PUBLIC_SITE_URL` — set this to the real domain in production.
 *   2. `NEXT_PUBLIC_VERCEL_URL` — the deployment's own hostname, which Vercel
 *      injects. Correct by construction on a preview, and a sane default on
 *      a production deployment that has no custom domain yet.
 *   3. The fallback above.
 *
 * A value that will not parse as a URL is discarded rather than crashing the
 * build inside `new URL(...)`, which is where it would otherwise surface with
 * no indication of which variable was wrong.
 */
function resolveDomain(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL,
    FALLBACK_DOMAIN,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const withProtocol = /^https?:\/\//.test(candidate) ? candidate : `https://${candidate}`;
    try {
      // Normalised so nothing downstream produces a double slash.
      return new URL(withProtocol).origin;
    } catch {
      console.warn(`[site] Ignoring unparseable site URL: ${candidate}`);
    }
  }

  return FALLBACK_DOMAIN;
}

/**
 * Whether this deployment should be in search results.
 *
 * False on a Vercel preview, which is the deployment nobody means to publish
 * and the one most likely to end up indexed. Where `VERCEL_ENV` is absent the
 * answer is true, because a host that is not Vercel is presumed to be the real
 * one — a self-hosted staging environment should set `NEXT_PUBLIC_SITE_URL`
 * and be excluded some other way.
 */
export const isIndexable =
  !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

export const site = {
  name: "Source and Skin",
  /** Short form used where the full name would crowd the layout (e.g. mobile nav). */
  shortName: "S&S",
  domain: resolveDomain(),
  tagline: "Rooted in ritual, made for the everyday.",
  description:
    "African net sponges and Salvadora persica miswak, sourced from the regions that have used them for generations. Two objects, one daily ritual.",
  email: "hello@sourceandskin.com",
  /**
   * Hero video. `null` renders the poster image alone — which is the correct
   * state until a real clip exists, since pointing at a missing file would 404
   * on every homepage load. Set this to "/videos/hero.mp4" once the file is in
   * place; see public/videos/README.md for the encoding brief.
   */
  heroVideo: null as string | null,
  social: {
    instagram: "https://instagram.com/sourceandskin",
    instagramHandle: "@sourceandskin",
  },
} as const;

/**
 * Shipping terms, in one place.
 *
 * These numbers are a representation to the customer under the Australian
 * Consumer Law, so the buy box, the cart, the FAQ, the product copy and the
 * shipping policy all have to agree. They did not: the threshold was written
 * as $45 in the policy and the cart and $40 in the FAQ and the product copy.
 * Everything now reads from here — change the number once.
 */
export const shippingTerms = {
  /** Order value (AUD) at or above which standard AU shipping is free. */
  freeThreshold: 45,
  /** Flat standard AU rate (AUD) below the threshold. */
  flatRate: 9.95,
  /** Business days from order to dispatch. */
  dispatchDays: 2,
  /** Flat rate (AUD) to every destination outside Australia. */
  internationalFlatRate: 20,
} as const;

/**
 * ⚠️ Shopify has to agree with the two numbers above.
 *
 * The checkout page quotes a total with shipping in it, and Shopify is what
 * actually charges for the shipping. When they disagree the customer is shown
 * one price and billed another, which is a misleading price representation
 * under section 18 of the Australian Consumer Law — not a display bug. They
 * did disagree once: the site promised $9.95 and free over $45 while Shopify
 * charged $11.00 and free over $100.
 *
 * Changing any number above therefore means changing the General delivery
 * profile in Shopify admin too. It is currently set up as:
 *
 *   Domestic (AU)     Standard   $9.95   order total $44.99 or less
 *                     Standard   $0.00   order total $45.00 or more
 *                     Express   $15.00   always offered
 *   International     Standard  $20.00   27 named countries
 *   Rest of world     Standard  $20.00   everywhere else
 *
 * The two domestic Standard rates carry complementary conditions, so exactly
 * one is ever offered. Express is the customer's own upgrade rather than
 * something this site quotes. The two international zones charge the same
 * flat rate, which is what lets the checkout page state a real total for an
 * overseas order instead of deferring to "calculated at checkout".
 */

export type NavLink = { href: string; label: string };

export const primaryNav: NavLink[] = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/sourcing", label: "Sourcing" },
  { href: "/contact", label: "Contact" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Information",
    links: [
      { href: "/about", label: "About" },
      { href: "/sourcing", label: "Sourcing" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { href: "/shipping", label: "Shipping & delivery" },
      { href: "/returns", label: "Returns & refunds" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms of sale" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/products/african-net-sponge-regular", label: "Net Sponge — Regular" },
      { href: "/products/african-net-sponge-handle", label: "Net Sponge with Handle" },
      { href: "/products/miswak-stick-single", label: "Miswak — Single" },
      { href: "/products/the-season", label: "The Season" },
      { href: "/products/the-full-ritual", label: "The Full Ritual" },
    ],
  },
];
