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
 */

export type Review = {
  author: string;
  /** Verbatim. Do not paraphrase or tidy a customer's words. */
  quote: string;
  /** Slug of the product being reviewed. */
  product: string;
  rating: 1 | 2 | 3 | 4 | 5;
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

export const reviews: Review[] = [
  {
    author: "Lily Ramano",
    quote:
      "The Ritual Bundle has turned my teeth from yellow to white and my skin from bumpy to smooth.",
    product: "ritual-bundle",
    rating: 5,
    image: "/images/review-lily.jpg",
    imageAlt: "A customer rinsing with an African net sponge across her shoulders",
    // Whitening teeth and changing skin texture are both specific outcome
    // claims, and neither is substantiated. Flagged rather than reworded —
    // the words are hers. Pull this review if evidence is not obtained.
    outcomeClaim: true,
  },
];

export function getReviewsFor(slug: string): Review[] {
  return reviews.filter((review) => review.product === slug);
}
