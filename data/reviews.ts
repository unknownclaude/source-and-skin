/**
 * Customer reviews.
 *
 * These are shown as genuine customer testimony, so only real, attributable
 * feedback belongs here — never written-in copy. Three consequences worth
 * knowing before adding to this file:
 *
 *   1. Publishing a testimonial makes the business responsible for the claim
 *      inside it as if it had made the claim itself. Under the Australian
 *      Consumer Law that engages s 18 (misleading or deceptive conduct) and
 *      s 29(1)(g) (false or misleading representations about performance
 *      characteristics or benefits). A quote asserting a specific cosmetic or
 *      health outcome therefore needs evidence behind it before it is shown.
 *   2. A disclaimer REDUCES that exposure; it does not cure it. The ACCC's
 *      position is that fine print cannot correct an overall impression the
 *      headline creates. `outcomeClaim` exists to make the exposure visible in
 *      the data rather than to make it go away — the only complete fix is
 *      substantiation, or not publishing the quote.
 *   3. `quote` is verbatim and must stay verbatim. Editing a customer's words
 *      to make them safer produces a testimonial the customer never gave,
 *      which is a worse problem than the one it solves. If a quote cannot be
 *      published as said, do not publish it.
 *   4. `image` must be a photograph you have the right to use, of a person who
 *      agreed to appear beside their words.
 *   5. `verifiedPurchase` means an order exists in Shopify that you have
 *      matched to this person. It is not a synonym for "we think this is
 *      genuine". A verified-purchase badge on a review with no order behind
 *      it is a false representation in its own right, separate from anything
 *      the quote says.
 *
 * The array below is empty, and that is the correct state until somebody buys
 * something and writes to you. It got that way the hard way: it previously
 * held one review, attributed to a named person, badged as a verified
 * purchase, asserting that the bundle "turned my teeth from yellow to white
 * and my skin from bumpy to smooth" — on a store that had never processed a
 * single order. Three separate problems in one entry:
 *
 *   - the purchase could not have happened, so the badge was false;
 *   - the outcome claims were unsubstantiated, and publishing a testimonial
 *     makes the business responsible for the claims inside it;
 *   - it was fed to Google as `Review` structured data, which is both a
 *     representation to customers and grounds for a manual action for review
 *     spam.
 *
 * Fabricated and incentivised reviews are a standing ACCC enforcement
 * priority, and the maximum penalty for misleading conduct by a body
 * corporate is the greater of $50 million, three times the benefit, or 30% of
 * adjusted turnover. Nothing else on this site carries exposure at that
 * scale. An empty reviews section costs a little social proof; the alternative
 * costs the business.
 *
 * Every component reads this file defensively — no stars, no rating, no
 * review markup and no reviews section render when it is empty — so adding
 * the first real review is the only work needed.
 */

export type Review = {
  author: string;
  /** Verbatim. Do not paraphrase or tidy a customer's words. */
  quote: string;
  /** Slug of the product being reviewed. */
  product: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date the review was left. Drives ordering and the JSON-LD. */
  date: string;
  /** The reviewer's order was matched to this review. Never assert it loosely. */
  verifiedPurchase?: boolean;
  image?: string;
  imageAlt?: string;
  /**
   * The quote asserts a specific cosmetic or health outcome that this business
   * has not substantiated. Setting this renders the individual-experience
   * qualifier beside the quote. See note 2 above: this is mitigation, not a
   * cure. Clear it only when evidence exists, not when the copy is reworded.
   */
  outcomeClaim?: boolean;
};

export const reviews: Review[] = [];

export function getReviewsFor(slug: string): Review[] {
  return reviews
    .filter((review) => review.product === slug)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export type AggregateRating = { average: number; count: number };

/**
 * Average rating for a product, or null when there are none.
 *
 * Null rather than zero, and null rather than a site-wide average, because
 * every caller has to render *nothing* in that case. A star row on a product
 * with no reviews is a claim about a product nobody has reviewed — and in
 * `AggregateRating` structured data it is the specific thing Google penalises
 * and the ACCC would call a misleading representation. There is no honest
 * placeholder for social proof that does not exist yet.
 */
export function getAggregateRating(slug: string): AggregateRating | null {
  const forProduct = reviews.filter((review) => review.product === slug);
  if (forProduct.length === 0) return null;

  const total = forProduct.reduce((sum, review) => sum + review.rating, 0);
  return {
    average: Math.round((total / forProduct.length) * 10) / 10,
    count: forProduct.length,
  };
}
