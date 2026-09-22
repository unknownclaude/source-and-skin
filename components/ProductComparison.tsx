import Link from "next/link";

import Reveal from "@/components/Reveal";
import { getProduct } from "@/data/products";
import { fromPriceFor } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { fetchLiveCatalogue } from "@/lib/shopify";

/**
 * What is actually in each box.
 *
 * Seven products, three of which are bundles that overlap, is genuinely hard
 * to hold in your head from the shop grid alone — the FAQ answers it in a
 * paragraph, which is a paragraph longer than it should take. This puts the
 * contents side by side so the differences are visible rather than described.
 *
 * Contents are written out per row rather than derived from the catalogue.
 * They could be inferred from `materials`, but that field is prose meant to be
 * read, and parsing prose to build a table is how a table ends up quietly
 * wrong. If the contents of a bundle change, change them here too — the
 * `getProduct` lookup means the name and price cannot drift, which is the part
 * that would actually mislead.
 */
const ROWS = [
  {
    slug: "miswak-stick-single",
    sponges: "—",
    handled: "—",
    sticks: "1",
    lasts: "3–4 weeks",
    bestFor: "Trying miswak before committing",
  },
  {
    slug: "miswak-stick-3-pack",
    sponges: "—",
    handled: "—",
    sticks: "3",
    lasts: "About 3 months",
    bestFor: "Miswak only, at the lowest per-stick price",
  },
  {
    slug: "african-net-sponge-regular",
    sponges: "1",
    handled: "—",
    sticks: "—",
    lasts: "A year or more",
    bestFor: "Exfoliating, if you can reach your own back",
  },
  {
    slug: "african-net-sponge-handle",
    sponges: "—",
    handled: "1",
    sticks: "—",
    lasts: "A year or more",
    bestFor: "Reaching the middle of your back",
  },
  {
    slug: "ritual-bundle",
    sponges: "1",
    handled: "or 1",
    sticks: "1",
    lasts: "A month of miswak",
    bestFor: "Trying both for the least money",
  },
  {
    slug: "the-season",
    sponges: "1",
    handled: "or 1",
    sticks: "3",
    lasts: "A season of miswak",
    bestFor: "Where most people start",
    highlight: true,
  },
  {
    slug: "the-full-ritual",
    sponges: "1",
    handled: "1",
    sticks: "3",
    lasts: "A season of miswak",
    bestFor: "Everything, nothing left to work out",
  },
];

const COLUMNS = [
  { key: "sponges", label: "Net sponge" },
  { key: "handled", label: "With handles" },
  { key: "sticks", label: "Miswak" },
  { key: "lasts", label: "Lasts" },
  { key: "bestFor", label: "Best for" },
] as const;

export default async function ProductComparison() {
  // Cached by Next, so this is the same read the layout already made.
  const live = await fetchLiveCatalogue();
  const rows = ROWS.map((row) => ({ ...row, product: getProduct(row.slug) })).filter(
    (row) => row.product
  );

  return (
    <section className="border-t border-charcoal/12 pt-section" aria-labelledby="compare-heading">
      <Reveal>
        <p className="eyebrow">Which one</p>
        <h2 id="compare-heading" className="mt-5 font-serif text-display-sm">
          What is in each box.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/65">
          The bundles overlap on purpose — they are the same two objects in different quantities.
          &ldquo;or 1&rdquo; means you choose which sponge goes in when you order.
        </p>
      </Reveal>

      {/* One table, scrolled horizontally on small screens rather than
          collapsed into cards: the whole value of a comparison is seeing the
          rows against each other, and cards destroy exactly that. */}
      <Reveal delay={0.1}>
        <div className="mt-10 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">
              Contents, expected life and intended use of each product
            </caption>
            <thead>
              <tr className="border-b border-charcoal/20">
                <th scope="col" className="py-3 pr-4 text-[0.7rem] uppercase tracking-[0.14em] text-charcoal/50">
                  Product
                </th>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="py-3 pr-4 text-[0.7rem] uppercase tracking-[0.14em] text-charcoal/50"
                  >
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="py-3 text-right text-[0.7rem] uppercase tracking-[0.14em] text-charcoal/50">
                  Price
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.slug}
                  className={`border-b border-charcoal/10 ${row.highlight ? "bg-cream-deep/60" : ""}`}
                >
                  <th scope="row" className="py-4 pr-4 font-normal">
                    <Link
                      href={`/products/${row.slug}`}
                      className="font-serif text-[0.98rem] leading-snug hover:opacity-70"
                    >
                      {row.product!.name}
                    </Link>
                    {row.highlight && (
                      <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.14em] text-clay">
                        Most popular
                      </span>
                    )}
                  </th>

                  {COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      className="py-4 pr-4 align-top text-[0.86rem] leading-snug text-charcoal/70"
                    >
                      {row[column.key]}
                    </td>
                  ))}

                  <td className="py-4 text-right align-top text-[0.86rem] tabular-nums">
                    {formatPrice(fromPriceFor(row.product!, live))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
