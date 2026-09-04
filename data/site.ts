/**
 * Single source of truth for brand-level content.
 *
 * Everything a rebrand touches lives here — the name, the tagline, the nav and
 * the social handles. No component hardcodes the brand name; they all read it
 * from this file, so a rename is a one-line change.
 */

export const site = {
  name: "Source and Skin",
  /** Short form used where the full name would crowd the layout (e.g. mobile nav). */
  shortName: "S&S",
  domain: "https://sourceandskin.com",
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
} as const;

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
