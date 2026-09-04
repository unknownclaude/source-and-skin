/**
 * Product catalogue — static for now.
 *
 * Shape note for whoever wires this to a backend: every field below maps
 * cleanly onto a Shopify product (`slug` → handle, `price` → variant price in
 * major units, `images` → media edges, the accordion copy → metafields). Keep
 * the `Product` type as the app-facing contract and add an adapter that returns
 * `Product[]` from the Storefront API — no component should need to change.
 *
 * Prices are stored in major currency units (AUD). Format via
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
  /** Surfaced in the homepage featured row. */
  featured?: boolean;
  /**
   * Position within the featured row. Lower sorts first, so the hero does not
   * depend on where a product happens to sit in the array.
   */
  featuredRank?: number;
  /** Stocked colours. Omit for products that ship in one colour only. */
  colorways?: Colorway[];
};

export const defaultShippingCopy =
  "Dispatched from our studio within two business days. Free standard shipping on Australian orders over $40; flat $9.95 below that. International shipping is calculated at checkout. If your order takes more than 30 days to arrive we refund the shipping — see our shipping page. Everything ships in unbleached, plastic-free packaging.";

export const products: Product[] = [
  {
    slug: "african-net-sponge-regular",
    name: "African Net Sponge — Regular",
    category: "sponge",
    price: 22,
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
    featuredRank: 2,
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
    price: 28,
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
    price: 8,
    tagline: "An authentic toothbrush that grows on a tree.",
    description:
      "A cut root of Salvadora persica — the arāk tree — used for oral care across East Africa, the Arabian Peninsula and South Asia for well over a thousand years. Peel back an inch of bark, chew until the fibres splay into bristles, and you have a brush that carries its own cleaning compounds. It tastes faintly of horseradish and mustard the first time. That is the plant, not a flaw.",
    howToUse:
      "Trim or peel about half an inch of bark from one end. Chew that end gently until the fibres separate into a soft brush — a minute or two. Brush without toothpaste, in small vertical strokes, for two minutes. Rinse the bristles, and snip off the used tip every few days to expose fresh fibre. One stick lasts most people three to four weeks.",
    materials:
      "A single root of Salvadora persica, air-dried and vacuum-sealed to hold its moisture. Approximately 6\" long, ½\" diameter. Nothing added: no flavouring, no preservative, no wax.",
    accentColor: "#6B7259",
    images: {
      main: "/images/miswak-single.jpg",
      alt: "/images/ritual-bundle.jpg",
      gallery: [
        "/images/miswak-single.jpg",
        "/images/ritual-bundle.jpg",
        "/images/lifestyle-counter.jpg",
        "/images/placeholder-texture-bark.jpg",
      ],
    },
    featured: true,
    featuredRank: 3,
  },
  {
    slug: "miswak-stick-3-pack",
    name: "Miswak Stick — 3-Pack",
    category: "miswak",
    price: 20,
    tagline: "A season of authentic sticks, sealed one at a time.",
    description:
      "Three sticks, each vacuum-sealed on its own so the two you are not using keep their moisture. A dried-out miswak frays instead of splaying and loses most of what makes it worth using — sealing individually is the whole point of buying in threes. Roughly three months of daily use, and the per-stick price is the lowest we offer outside the bundle.",
    howToUse:
      "Open one sleeve at a time and leave the others sealed. Peel, chew and brush as with the single stick; store the one in use bristle-up in a dry glass, never in a closed container where it cannot breathe. If a stick does dry out, soak the tip in water for ten minutes before chewing.",
    materials:
      "Three roots of Salvadora persica, air-dried, individually vacuum-sealed. Approximately 6\" long each. No flavouring, preservative or wax.",
    accentColor: "#C57A54",
    // TODO(photography): the only miswak shot in hand is a single stick, so the
    // 3-pack currently shows one. A composite of three copies was tried and
    // discarded — repeated grain reads as fake. This needs a genuine
    // three-stick flat-lay before launch; the card says 3-Pack and the
    // photograph should agree with it.
    images: {
      main: "/images/miswak-single.jpg",
      alt: "/images/lifestyle-counter.jpg",
      gallery: [
        "/images/miswak-single.jpg",
        "/images/lifestyle-counter.jpg",
        "/images/ritual-bundle.jpg",
        "/images/placeholder-texture-bark.jpg",
      ],
    },
  },
  {
    slug: "ritual-bundle",
    name: "The Ritual Bundle",
    category: "bundle",
    price: 27,
    tagline: "The smallest complete version of an authentic ritual.",
    description:
      "One hand-knotted net sponge and one Salvadora persica stick — the smallest complete version of the ritual, for anyone who wants to try both before committing to either. A month of miswak, a year of sponge. If you already know you want this, The Season gives you three months of miswak for $9 more.",
    howToUse:
      "Follow each product's own ritual. In practice most people land on the same rhythm: miswak first thing and last thing, sponge in the shower between. Keep the sponge on a hook and the sticks in a dry glass, both within arm's reach — the ritual survives on convenience more than on intention.",
    materials:
      "One hand-knotted nylon net sponge (27\" × 11\") and one vacuum-sealed Salvadora persica root (6\"). Packed in an unbleached board box with no plastic window, tape or filler.",
    accentColor: "#8C4A3B",
    images: {
      main: "/images/ritual-bundle.jpg",
      alt: "/images/lifestyle-counter.jpg",
      gallery: [
        "/images/ritual-bundle.jpg",
        "/images/lifestyle-counter.jpg",
        "/images/miswak-single.jpg",
        "/images/sponge-white-roll.jpg",
      ],
    },
  },
  {
    // The hero. Highest contribution of any product a first-time customer is
    // realistically going to buy, and the composition needs no explaining:
    // one sponge, three months of miswak.
    slug: "the-season",
    name: "The Season",
    category: "bundle",
    price: 36,
    tagline: "One sponge, three months of authentic miswak.",
    description:
      "A hand-knotted African net sponge and three individually sealed Salvadora persica sticks — the two objects that make up the ritual, in the quantities they are actually used in. The sponge lasts a year. Three sticks last a season. Buy this once and both ends of your day are handled until autumn. This is where most people start, and it is priced accordingly: $6 less than buying the same things separately.",
    howToUse:
      "Follow each product's own ritual. In practice most people land on the same rhythm: miswak first thing and last thing, sponge in the shower between. Keep the sponge on a hook and the sticks in a dry glass, both within arm's reach — the ritual survives on convenience more than on intention.",
    materials:
      "One hand-knotted nylon net sponge (27\" × 11\") and three individually sealed Salvadora persica roots (6\" each). Packed in an unbleached board box with no plastic window, tape or filler.",
    accentColor: "#6B7259",
    // TODO(photography): this is the hero product and it has no photograph of
    // its own — currently borrowing the one-sponge-one-stick bundle shot. A
    // frame with three sticks beside the sponge is the highest-value photo
    // still missing from the catalogue.
    images: {
      main: "/images/ritual-bundle.jpg",
      alt: "/images/lifestyle-counter.jpg",
      gallery: [
        "/images/ritual-bundle.jpg",
        "/images/lifestyle-counter.jpg",
        "/images/miswak-single.jpg",
        "/images/sponge-red.jpg",
      ],
    },
    featured: true,
    featuredRank: 1,
  },
  {
    slug: "the-full-ritual",
    name: "The Full Ritual",
    category: "bundle",
    price: 58,
    tagline: "Every authentic object we make, in one box.",
    description:
      "Both sponges and a season of miswak. The plain net sponge for everyday washing, the handled one for reaching between your own shoulder blades, and three individually sealed Salvadora persica sticks for three months of mornings. The two sponges are not a duplicate — they do different jobs. The handled sponge is pulled taut across the back with a cord in each hand; the plain one is worked by hand everywhere else. $12 less than buying the three separately.",
    howToUse:
      "Hang both sponges where they can dry — the handled one by a cord, the plain one over a rail. Keep the sticks in a dry glass. Use the handled sponge for your back and the plain one for everything else; most people who own both stop thinking about which is which within a week.",
    materials:
      "One hand-knotted nylon net sponge (27\" × 11\"), one net sponge with braided cord handles (33\" × 11\"), and three individually sealed Salvadora persica roots (6\" each). Packed in an unbleached board box with no plastic window, tape or filler.",
    accentColor: "#8C4A3B",
    // TODO(photography): needs a frame with both sponges and three sticks.
    images: {
      main: "/images/ritual-bundle.jpg",
      alt: "/images/sponge-handle-purple.jpg",
      gallery: [
        "/images/ritual-bundle.jpg",
        "/images/sponge-handle-purple.jpg",
        "/images/sponge-red.jpg",
        "/images/miswak-single.jpg",
      ],
    },
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
  return products
    .filter((product) => product.featured)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));
}

/** The product the homepage leads on. */
export function getHeroProduct(): Product {
  return getFeaturedProducts()[0];
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
