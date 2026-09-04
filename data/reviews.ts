/**
 * Customer reviews.
 *
 * These are shown as genuine customer testimony, so only real, attributable
 * feedback belongs here — never written-in copy. Two consequences worth knowing
 * before adding to this file:
 *
 *   1. A testimonial makes the brand responsible for the claim as if it had
 *      made it directly (FTC in the US, CMA/ASA in the UK). A review that
 *      asserts a specific cosmetic or health outcome needs evidence behind it.
 *   2. `image` must be a photograph you have the right to use, of a person who
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
  },
];

export function getReviewsFor(slug: string): Review[] {
  return reviews.filter((review) => review.product === slug);
}
