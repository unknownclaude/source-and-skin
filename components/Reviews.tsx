import Image from "next/image";

import Reveal from "@/components/Reveal";
import type { Review } from "@/data/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <p className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden className={i < rating ? "text-charcoal" : "text-charcoal/20"}>
          ★
        </span>
      ))}
    </p>
  );
}

/** Customer testimony. Renders nothing when a product has no reviews yet. */
export default function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-cream" aria-labelledby="reviews-heading">
      <div className="edge py-section">
        <Reveal>
          <p className="eyebrow">In their words</p>
          <h2 id="reviews-heading" className="mt-5 font-serif text-display-sm">
            What people say
          </h2>
        </Reveal>

        <ul className="mt-14 space-y-16">
          {reviews.map((review, index) => (
            <Reveal as="li" key={review.author} delay={index * 0.08}>
              <figure className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                {review.image && (
                  <div className="relative aspect-square w-full overflow-hidden bg-sand">
                    <Image
                      src={review.image}
                      alt={review.imageAlt ?? ""}
                      fill
                      sizes="(min-width: 768px) 46vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <Stars rating={review.rating} />
                  <blockquote className="mt-6 font-serif text-display-sm leading-tight">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 text-[0.75rem] uppercase tracking-[0.18em] text-charcoal/55">
                    {review.author}
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
