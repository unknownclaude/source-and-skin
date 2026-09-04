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

import { shippingTerms } from "@/data/site";

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
   * Every product now leads on its own photograph — no two share a `main`,
   * because a bundle showing the wrong contents is worse than no photograph at
   * all. Keep it that way: the 4:5 ratio is assumed by the grid, and the frame
   * must show what the name promises (The Season shows three sticks because it
   * ships three).
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
  /**
   * What it does for the person buying it, in three or four lines.
   *
   * Kept separate from `description` because it is answering a different
   * question. The description explains what the object is; this answers "what
   * changes if I buy it", which is what a customer scanning a page actually
   * wants, and it is the first block of text on the PDP for that reason.
   *
   * Claims here are mechanical and observable — what the weave or the fibre
   * physically does. Nothing on this site claims to treat a condition: under
   * the Australian Consumer Law every representation needs a reasonable basis,
   * and a therapeutic claim would put these products under the Therapeutic
   * Goods Act as well. "Lifts away dead skin" is a description. "Clears acne"
   * would not be — do not let one drift into the other.
   */
  benefits?: string[];
};

export const defaultShippingCopy =
  `Dispatched from our studio within ${shippingTerms.dispatchDays} business days. Free standard shipping on Australian orders over $${shippingTerms.freeThreshold}; flat $${shippingTerms.flatRate} below that. International shipping is calculated at checkout. If your order takes more than 30 days to arrive we refund the shipping — see our shipping page. Everything ships in unbleached, plastic-free packaging.`;

export const products: Product[] = [
  {
    slug: "african-net-sponge-regular",
    name: "African Net Sponge — Regular",
    category: "sponge",
    price: 22,
    tagline: "The authentic West African exfoliant, for skin that feels smooth everywhere.",
    description:
      "Dead skin, sweat and body oil build up faster than a washcloth can lift them. That is usually why skin stays rough or looks dull no matter how long you spend under the water — the shower is rinsing the surface, not clearing it. The open West African weave is coarse enough to lift that layer away in a single pass and long enough to draw across the middle of your back, which is exactly where it collects and exactly where your hands do not reach. Skin feels smoother the first time you use it. A pea of soap lathers further than a palmful ever did. It arrives stiff, softens after two or three washes, and holds its structure for a year or more.",
    benefits: [
      "Exfoliates the whole body — lifts away dead skin instead of pushing it around",
      "Long enough to reach the middle of your back, shoulder blade to shoulder blade",
      "Clears the sweat, oil and product residue a washcloth leaves behind",
      "Dries in hours on a hook, so it never turns sour the way a loofah does",
    ],
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
    tagline: "The authentic weave, with handles that get to the part of your back you never reach.",
    description:
      "There is a patch between the shoulder blades that most people have never properly washed. It is also the patch that stays congested, because that is where sweat sits under a shirt all day and where nothing ever lifts it off. This is the same hand-knotted mesh with a braided cord stitched to each end, so you can pull it taut across your own back in one motion — at whatever pressure you want, without the mesh slipping out of a soapy grip. If you have spent years contorting to reach the middle of your back, this is the version to buy.",
    benefits: [
      "Reaches the middle of the back properly — the one place congestion collects",
      "Cord in each hand means you set the pressure, and the mesh cannot slip",
      "Same coarse weave: lifts dead skin, sweat and oil rather than smearing them",
      "Hangs by a handle and dries in hours",
    ],
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
    tagline: "An authentic toothbrush that cleans without paste, plastic or power.",
    description:
      "A cut root of Salvadora persica — the arāk tree — used for oral care across East Africa, the Arabian Peninsula and South Asia for well over a thousand years. Chew one end until the fibres splay into bristles and you have a brush that is finer and softer than nylon, gets between teeth rather than skating over them, and leaves your mouth clean without a tube of anything. It goes in a bag without a charger, a case or a leaking cap. It tastes faintly of horseradish and mustard the first few days. That is the plant, not a flaw.",
    benefits: [
      "Fine natural bristles reach between teeth and along the gumline",
      "Cleans and freshens without toothpaste — nothing added, nothing to pack",
      "One stick replaces a plastic brush head every three to four weeks",
      "Travels anywhere: no charger, no case, nothing to leak",
    ],
    howToUse:
      "Trim or peel about half an inch of bark from one end. Chew that end gently until the fibres separate into a soft brush — a minute or two. Brush without toothpaste, in small vertical strokes, for two minutes. Rinse the bristles, and snip off the used tip every few days to expose fresh fibre. One stick lasts most people three to four weeks.",
    materials:
      "A single root of Salvadora persica, air-dried and vacuum-sealed to hold its moisture. Approximately 6\" long, ½\" diameter. Nothing added: no flavouring, no preservative, no wax.",
    accentColor: "#6B7259",
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
    featured: true,
    featuredRank: 3,
  },
  {
    slug: "miswak-stick-3-pack",
    name: "Miswak Stick — 3-Pack",
    category: "miswak",
    price: 20,
    tagline: "Three authentic sticks, sealed one at a time — a season of clean mornings.",
    description:
      "Three sticks, each vacuum-sealed on its own so the two you are not using keep their moisture. That matters more than it sounds: a dried-out miswak frays into splinters instead of splaying into bristles, and loses most of what makes it worth using. Sealing individually is the whole reason to buy in threes. Roughly three months of daily use, and the lowest per-stick price we offer outside a bundle.",
    benefits: [
      "Three months of daily use — replace the tip, not the whole habit",
      "Individually sealed, so stick two and three are as soft as the first",
      "Cheapest way to buy miswak on its own",
      "Nothing to run out of at the wrong moment",
    ],
    howToUse:
      "Open one sleeve at a time and leave the others sealed. Peel, chew and brush as with the single stick; store the one in use bristle-up in a dry glass, never in a closed container where it cannot breathe. If a stick does dry out, soak the tip in water for ten minutes before chewing.",
    materials:
      "Three roots of Salvadora persica, air-dried, individually vacuum-sealed. Approximately 6\" long each. No flavouring, preservative or wax.",
    accentColor: "#C57A54",
    images: {
      main: "/images/miswak-3-pack.jpg",
      alt: "/images/miswak-single.jpg",
      gallery: [
        "/images/miswak-3-pack.jpg",
        "/images/miswak-single.jpg",
        "/images/lifestyle-counter.jpg",
        "/images/placeholder-texture-bark.jpg",
      ],
    },
  },
  {
    slug: "ritual-bundle",
    name: "The Ritual Bundle",
    category: "bundle",
    price: 27,
    tagline: "The smallest complete version of an authentic ritual — one sponge, one stick.",
    description:
      "One hand-knotted net sponge and one Salvadora persica stick: smoother skin at one end of the day, a cleaner mouth at the other, for anyone who wants to try both before committing to either. A month of miswak, a year of sponge. If you already know you want this, The Season gives you three months of miswak for $9 more.",
    benefits: [
      "Both halves of the ritual, at the smallest size worth buying",
      "Exfoliates the body; cleans the mouth without paste",
      "A month of miswak and a year of sponge",
      "Cheaper than buying the two separately",
    ],
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
    tagline: "One authentic sponge, three months of miswak — the whole ritual, sorted.",
    description:
      "A hand-knotted African net sponge and three individually sealed Salvadora persica sticks: the two objects that make up the ritual, in the quantities they are actually used in. Smoother skin from the first shower, a mouth that feels properly clean without a tube of anything, and neither running out until autumn. The sponge lasts a year. Three sticks last a season. This is where most people start, and it is priced accordingly — $6 less than buying the same things separately.",
    benefits: [
      "Exfoliates head to toe, including the back you cannot reach with your hands",
      "Three months of miswak, each stick sealed until the day you open it",
      "Both ends of the day handled until autumn — nothing to reorder",
      "$6 less than buying the sponge and the sticks separately",
    ],
    howToUse:
      "Follow each product's own ritual. In practice most people land on the same rhythm: miswak first thing and last thing, sponge in the shower between. Keep the sponge on a hook and the sticks in a dry glass, both within arm's reach — the ritual survives on convenience more than on intention.",
    materials:
      "One hand-knotted nylon net sponge (27\" × 11\") and three individually sealed Salvadora persica roots (6\" each). Packed in an unbleached board box with no plastic window, tape or filler.",
    accentColor: "#6B7259",
    images: {
      main: "/images/the-season.jpg",
      alt: "/images/miswak-3-pack.jpg",
      gallery: [
        "/images/the-season.jpg",
        "/images/miswak-3-pack.jpg",
        "/images/sponge-red.jpg",
        "/images/lifestyle-counter.jpg",
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
      "Both sponges and a season of miswak. The plain net sponge for everyday washing, the handled one for pulling taut across the middle of your back, and three individually sealed Salvadora persica sticks for three months of mornings. The two sponges are not a duplicate — they do different jobs. One is worked by hand everywhere you can reach; the other goes where you cannot. $12 less than buying the three separately.",
    benefits: [
      "Nowhere on your body goes unexfoliated — the handled sponge covers the back",
      "Three months of miswak, individually sealed",
      "The complete range, so nothing is left to work out later",
      "$12 less than buying the three separately",
    ],
    howToUse:
      "Hang both sponges where they can dry — the handled one by a cord, the plain one over a rail. Keep the sticks in a dry glass. Use the handled sponge for your back and the plain one for everything else; most people who own both stop thinking about which is which within a week.",
    materials:
      "One hand-knotted nylon net sponge (27\" × 11\"), one net sponge with braided cord handles (33\" × 11\"), and three individually sealed Salvadora persica roots (6\" each). Packed in an unbleached board box with no plastic window, tape or filler.",
    accentColor: "#8C4A3B",
    images: {
      main: "/images/the-full-ritual.jpg",
      alt: "/images/sponge-handle-black.jpg",
      gallery: [
        "/images/the-full-ritual.jpg",
        "/images/sponge-handle-black.jpg",
        "/images/sponge-red.jpg",
        "/images/miswak-3-pack.jpg",
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
