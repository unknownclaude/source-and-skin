/**
 * Product catalogue — static for now.
 *
 * Shape note for whoever wires this to a backend: every field below maps
 * cleanly onto a Shopify product (`slug` → handle, `price` → variant price in
 * major units, `images` → media edges, the accordion copy → metafields). Keep
 * the `Product` type as the app-facing contract and add an adapter that returns
 * `Product[]` from the Storefront API — no component should need to change.
 *
 * Prices are stored in major currency units (USD). Format via
 * `formatPrice()` in `lib/format.ts`, never with raw string interpolation.
 */

export type ProductCategory = "sponge" | "miswak" | "bundle";

/**
 * A colour a product is stocked in.
 *
 * `swatch` is what the dot on the card renders, so a colourway can be listed
 * before its photography exists. `image` is optional for exactly that reason —
 * where it is absent the gallery falls back to the product's main shot, and the
 * swatch still tells the customer the colour is available.
 */
export type Colorway = {
  name: string;
  /** Hex for the selector dot. */
  swatch: string;
  /** 4:5 product shot in this colour. Omit until the photograph exists. */
  image?: string;
};

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  tagline: string;
  description: string;
  howToUse: string;
  materials: string;
  /** Hex, used as the full-bleed spotlight background on the homepage. */
  accentColor: string;
  /**
   * `main` is the packed/flat-lay shot; `alt` is the detail or in-use shot
   * revealed on hover. `gallery` drives the PDP thumbnail strip.
   *
   * TODO(photography): replace every `/images/placeholder-*.jpg` path with real
   * product photography. Keep the same aspect ratio (4:5 portrait) so the grid
   * does not need to be re-tuned.
   */
  images: { main: string; alt: string; gallery: string[] };
  /** Optional shipping copy override; falls back to `defaultShippingCopy`. */
  shipping?: string;
  /** Surfaced in the homepage featured row, in this order. */
  featured?: boolean;
  /** Stocked colours. Omit for products that ship in one colour only. */
  colorways?: Colorway[];
};

export const defaultShippingCopy =
  "Dispatched from our studio within two business days. Free standard shipping on orders over $45 within the US; flat $5 below that. International shipping is calculated at checkout and typically arrives within 7–14 business days. Everything ships in unbleached, plastic-free packaging.";

export const products: Product[] = [
  {
    slug: "african-net-sponge-regular",
    name: "African Net Sponge — Regular",
    category: "sponge",
    price: 14,
    tagline: "The authentic West African exfoliant that reaches everywhere.",
    description:
      "A hand-knotted mesh sponge in the West African tradition — long enough to reach the whole back, open enough to dry in hours rather than days. The weave is deliberately coarse: it lifts dead skin, breaks down body oil and turns a pea-sized amount of soap into a full lather. It arrives stiff, softens after the first wash, and keeps its structure for a year or more of daily use.",
    howToUse:
      "Wet the sponge under warm water and wring once. Work soap through the mesh until it lathers, then move in long strokes toward the heart — ankles up, wrists in. Rinse the sponge, wring it out and hang it to dry; the open weave does the rest. Machine-wash on cold every few weeks and replace when the mesh loses its spring.",
    materials:
      "100% nylon mesh, knotted by hand into a single continuous tube. Undyed and unbleached. Roughly 27\" × 11\" relaxed. Contains no rubber, latex or foam.",
    accentColor: "#C57A54",
    images: {
      main: "/images/sponge-red.jpg",
      alt: "/images/sponge-pink.jpg",
      gallery: [
        "/images/sponge-red.jpg",
        "/images/sponge-blue.jpg",
        "/images/sponge-yellow.jpg",
        "/images/sponge-white-roll.jpg",
      ],
    },
    featured: true,
    colorways: [
      { name: "White", swatch: "#F2EFE9", image: "/images/sponge-white.jpg" },
      { name: "Red", swatch: "#C4231F", image: "/images/sponge-red.jpg" },
      { name: "Blue", swatch: "#2F6DA8", image: "/images/sponge-blue.jpg" },
      { name: "Pink", swatch: "#E45C9C", image: "/images/sponge-pink.jpg" },
      { name: "Yellow", swatch: "#E0A83C", image: "/images/sponge-yellow.jpg" },
      { name: "Purple", swatch: "#7E4C93", image: "/images/sponge-purple.jpg" },
    ],
  },
  {
    slug: "african-net-sponge-handle",
    name: "African Net Sponge with Handle",
    category: "sponge",
    price: 18,
    tagline: "The authentic weave, with a braided handle at each end.",
    description:
      "The same hand-knotted mesh with a braided cord stitched to each end. The handles are the whole point: they let you pull the sponge taut across your own back in one motion, at whatever tension you want, without the mesh slipping out of a soapy grip. Chosen most often by anyone who has spent years fighting to reach between their shoulder blades.",
    howToUse:
      "Wet the sponge and work soap through the mesh. Take a handle in each hand, pass it behind your back and pull alternately — the cord takes the strain, so the mesh stays flat against the skin instead of bunching. Rinse, wring, and hang it by one of the handles to dry.",
    materials:
      "100% nylon mesh, hand-knotted, with a braided polyester cord handle stitched at each end. Roughly 33\" × 11\" relaxed, plus handles. No rubber, latex or foam.",
    accentColor: "#8C4A3B",
    images: {
      main: "/images/sponge-handle-purple.jpg",
      alt: "/images/sponge-handle-blue.jpg",
      gallery: [
        "/images/sponge-handle-purple.jpg",
        "/images/sponge-handle-blue.jpg",
        "/images/sponge-handle-pink.jpg",
        "/images/sponge-handle-black.jpg",
      ],
    },
    colorways: [
      { name: "Black", swatch: "#241F1E", image: "/images/sponge-handle-black.jpg" },
      { name: "Blue", swatch: "#1F4F86", image: "/images/sponge-handle-blue.jpg" },
      { name: "Pink", swatch: "#F09099", image: "/images/sponge-handle-pink.jpg" },
      { name: "Purple", swatch: "#8F5F90", image: "/images/sponge-handle-purple.jpg" },
      { name: "White", swatch: "#F2EDDB", image: "/images/sponge-handle-white.jpg" },
    ],
  },
  {
    slug: "miswak-stick-single",
    name: "Miswak Stick — Single",
    category: "miswak",
    price: 9,
    tagline: "An authentic toothbrush that grows on a tree.",
    description:
      "A cut root of Salvadora persica — the arāk tree — used for oral care across East Africa, the Arabian Peninsula and South Asia for well over a thousand years. Peel back an inch of bark, chew until the fibres splay into bristles, and you have a brush that carries its own cleaning compounds. It tastes faintly of horseradish and mustard the first time. That is the plant, not a flaw.",
    howToUse:
      "Trim or peel about half an inch of bark from one end. Chew that end gently until the fibres separate into a soft brush — a minute or two. Brush without toothpaste, in small vertical strokes, for two minutes. Rinse the bristles, and snip off the used tip every few days to expose fresh fibre. One stick lasts most people three to four weeks.",
    materials:
      "A single root of Salvadora persica, air-dried and vacuum-sealed to hold its moisture. Approximately 6\" long, ½\" diameter. Nothing added: no flavouring, no preservative, no wax.",
    accentColor: "#6B7259",
    images: {
      main: "/images/placeholder-miswak-single.jpg",
      alt: "/images/placeholder-miswak-single-alt.jpg",
      gallery: [
        "/images/placeholder-miswak-single.jpg",
        "/images/placeholder-miswak-single-alt.jpg",
        "/images/placeholder-texture-bark.jpg",
        "/images/placeholder-lifestyle-counter.jpg",
      ],
    },
    featured: true,
  },
  {
    slug: "miswak-stick-3-pack",
    name: "Miswak Stick — 3-Pack",
    category: "miswak",
    price: 22,
    tagline: "A season of authentic sticks, sealed one at a time.",
    description:
      "Three sticks, each vacuum-sealed on its own so the two you are not using keep their moisture. A dried-out miswak frays instead of splaying and loses most of what makes it worth using — sealing individually is the whole point of buying in threes. Roughly three months of daily use, and the per-stick price is the lowest we offer outside the bundle.",
    howToUse:
      "Open one sleeve at a time and leave the others sealed. Peel, chew and brush as with the single stick; store the one in use bristle-up in a dry glass, never in a closed container where it cannot breathe. If a stick does dry out, soak the tip in water for ten minutes before chewing.",
    materials:
      "Three roots of Salvadora persica, air-dried, individually vacuum-sealed. Approximately 6\" long each. No flavouring, preservative or wax.",
    accentColor: "#C57A54",
    images: {
      main: "/images/placeholder-miswak-3pack.jpg",
      alt: "/images/placeholder-miswak-3pack-alt.jpg",
      gallery: [
        "/images/placeholder-miswak-3pack.jpg",
        "/images/placeholder-miswak-3pack-alt.jpg",
        "/images/placeholder-texture-bark.jpg",
        "/images/placeholder-lifestyle-counter.jpg",
      ],
    },
  },
  {
    slug: "ritual-bundle",
    name: "The Ritual Bundle",
    category: "bundle",
    price: 28,
    tagline: "Both ends of an authentic daily ritual, in one box.",
    description:
      "One regular net sponge and three miswak sticks — the morning and the evening, packed together and priced below the sum of its parts. This is how most people start with us, and how nearly everyone ends up: the two objects share a logic, which is that the simplest tool tends to be the one that has already been in use for centuries.",
    howToUse:
      "Follow each product's own ritual. In practice most people land on the same rhythm: miswak first thing and last thing, sponge in the shower between. Keep the sponge on a hook and the sticks in a dry glass, both within arm's reach — the ritual survives on convenience more than on intention.",
    materials:
      "One hand-knotted nylon net sponge (27\" × 11\") and three individually sealed Salvadora persica roots (6\" each). Packed in an unbleached board box with no plastic window, tape or filler.",
    accentColor: "#8C4A3B",
    images: {
      main: "/images/placeholder-ritual-bundle.jpg",
      alt: "/images/placeholder-ritual-bundle-alt.jpg",
      gallery: [
        "/images/placeholder-ritual-bundle.jpg",
        "/images/placeholder-ritual-bundle-alt.jpg",
        "/images/placeholder-texture-fiber.jpg",
        "/images/placeholder-lifestyle-bath.jpg",
      ],
    },
    featured: true,
  },
];

export const categoryLabels: Record<ProductCategory | "all", string> = {
  all: "Everything",
  sponge: "Sponges",
  miswak: "Miswak",
  bundle: "Bundles",
};

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

/**
 * Related products for the PDP. Prefers a different category so the row reads
 * as a cross-sell rather than a list of near-identical variants, then backfills
 * from whatever is left.
 */
export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const current = getProduct(slug);
  if (!current) return products.slice(0, limit);

  const others = products.filter((product) => product.slug !== slug);
  const differentCategory = others.filter((p) => p.category !== current.category);
  const sameCategory = others.filter((p) => p.category === current.category);

  return [...differentCategory, ...sameCategory].slice(0, limit);
}

/** Lowest price in the catalogue slice — drives the "From $XX.XX" card label. */
export function getPriceFrom(category?: ProductCategory): number {
  const pool = category ? products.filter((p) => p.category === category) : products;
  return Math.min(...pool.map((p) => p.price));
}
