import type { Metadata } from "next";
import Link from "next/link";

import CheckoutReview from "@/components/CheckoutReview";
import { variantCoverage } from "@/lib/checkout";

/**
 * Checkout review.
 *
 * `noindex` is not optional. A checkout page in a search index is a page
 * Google will send a stranger to with someone else's bag state in mind, and it
 * competes with the product pages for the queries that actually sell. It is
 * also left out of the sitemap for the same reason.
 *
 * The page itself is a server component so the variant coverage is computed
 * once at build time rather than in every browser; everything that depends on
 * the bag lives in the client island below it.
 */
export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order before payment.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  const coverage = variantCoverage();

  return (
    <div className="edge pb-section pt-32 md:pt-40">
      <nav aria-label="Breadcrumb" className="mb-10">
        <ol className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/45">
          <li>
            <Link href="/shop" className="transition-colors hover:text-charcoal">
              Shop
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-charcoal/70">
            Checkout
          </li>
        </ol>
      </nav>

      <header className="max-w-2xl">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-5 font-serif text-display-md">Review your order.</h1>
        <p className="mt-6 text-base leading-relaxed text-charcoal/65 md:text-lg">
          Everything below, at the price you will actually pay — shipping included, no fees added
          later. Nothing is charged on this page.
        </p>
      </header>

      <div className="mt-14">
        <CheckoutReview coverage={coverage} />
      </div>
    </div>
  );
}
