import Image from "next/image";
import Link from "next/link";

import EditorialSection from "@/components/EditorialSection";
import Hero from "@/components/Hero";
import NewsletterForm from "@/components/NewsletterForm";
import ProductCard from "@/components/ProductCard";
import ProductSpotlight from "@/components/ProductSpotlight";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getFeaturedProducts } from "@/data/products";
import { site } from "@/data/site";

export const metadata = {
  title: `${site.name} — African Net Sponges & Miswak`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <Hero
        eyebrow="Body & mouth"
        headline={site.tagline}
        supporting="African net sponges and Salvadora persica miswak — two objects that have outlasted every trend sent to replace them."
        ctaLabel="Shop the collection"
        ctaHref="/shop"
        posterSrc="/images/hero-poster.jpg"
        posterAlt="A net sponge and two miswak sticks resting on a deep clay ground"
        videoSrc={site.heroVideo}
      />

      {/* ---- Featured grid ---- */}
      <section className="edge py-section" aria-labelledby="featured-heading">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The collection"
            heading="Three things, and nothing else."
            standfirst="We make what we would use twice a day. That leaves a short list."
          />
          <Reveal delay={0.15}>
            <Link
              href="/shop"
              className="link-underline whitespace-nowrap text-[0.72rem] uppercase tracking-[0.2em]"
            >
              View all
            </Link>
          </Reveal>
        </div>
        <h2 id="featured-heading" className="sr-only">
          Featured products
        </h2>

        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} priority={index === 0} />
          ))}
        </div>
      </section>

      {/* ---- Accent-block product spotlights ---- */}
      {featured.map((product, index) => (
        <ProductSpotlight key={product.slug} product={product} reversed={index % 2 === 1} />
      ))}

      {/* ---- Story ---- */}
      <EditorialSection
        eyebrow="Our sourcing"
        heading="Where tradition meets ritual."
        body={[
          "The net sponge is West African by origin — a length of knotted mesh that hangs on a hook, dries in an afternoon and outlasts a drawer of washcloths. It has been made and sold in the markets of Ghana and Nigeria for decades, long before anyone called it exfoliation.",
          "Miswak is older still. Cut from the roots of Salvadora persica, the arāk tree of the arid belt running from the Sahel to the Arabian Peninsula, it has been chewed into a brush for well over a thousand years — a toothbrush that needs no paste, no plastic and no power.",
          "We buy both from the regions that have used them longest, in quantities small enough that we know who cut them. Nothing here was invented in a lab or a boardroom.",
        ]}
        linkHref="/sourcing"
        linkLabel="Read about sourcing"
        imageSrc="/images/editorial-ritual-in-use.jpg"
        imageAlt="A woman drawing an African net sponge across her shoulders"
        imageAspect="4/5"
        imageFirst
      />

      {/* ---- Secondary editorial band ---- */}
      <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden bg-charcoal">
        <Image
          src="/images/placeholder-editorial-ritual.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* Weighted to the left, where the copy sits, so the image stays visible. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/60 to-charcoal/20"
        />

        <div className="edge relative z-10 py-section text-cream">
          <Reveal>
            <h2 className="max-w-4xl font-serif text-display-lg">
              Not just skincare &amp; oral care — a daily ritual.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
              Four minutes, twice a day, with objects that ask nothing of you but attention.
              That is the whole proposition. It is also, we think, the point.
            </p>
            <Link
              href="/about"
              className="link-underline mt-9 inline-block text-[0.72rem] uppercase tracking-[0.2em]"
            >
              About us
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- Newsletter ---- */}
      <section className="edge py-section" aria-labelledby="newsletter-heading">
        <div className="grid gap-10 md:grid-cols-2 md:items-end md:gap-20">
          <Reveal>
            <p className="eyebrow">Stay close</p>
            <h2 id="newsletter-heading" className="mt-5 font-serif text-display-md">
              Join the list.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/65">
              Early access to small-batch drops, restock notices before they go public, and short
              notes on the places these things come from. No more than twice a month.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="md:justify-self-end md:w-full">
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
