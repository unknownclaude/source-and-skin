import Link from "next/link";

import EditorialSection from "@/components/EditorialSection";
import Hero from "@/components/Hero";
import NewsletterForm from "@/components/NewsletterForm";
import ProductCard from "@/components/ProductCard";
import ProductSpotlight from "@/components/ProductSpotlight";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getFeaturedProducts } from "@/data/products";
import { shippingTerms, site } from "@/data/site";

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
        headline="Smoother skin. A cleaner mouth. Two objects, twice a day."
        supporting="A hand-knotted West African net sponge lifts away the dead skin and body oil a washcloth only moves around — including the middle of your back. A miswak stick cleans your mouth without a tube of anything."
        ctaLabel="Shop the collection"
        ctaHref="/shop"
        secondaryLabel="How it works"
        secondaryHref="/faq"
        notes={[
          `Free AU shipping over $${shippingTerms.freeThreshold}`,
          "Lasts a year",
          "Plastic-free packaging",
        ]}
        posterSrc="/images/editorial-ritual-in-use.jpg"
        posterAlt="A woman drawing a pink African net sponge across her back"
        videoSrc={site.heroVideo}
      />

      {/* ---- What it actually does ---- */}
      <section className="edge py-section">
        <SectionHeading
          eyebrow="Why it works"
          heading="Washing is not the same as exfoliating."
          standfirst="A washcloth wets the surface. An open mesh lifts what is sitting on it — which is most of the reason skin stays rough no matter how long the shower is."
        />

        <ul className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Lifts dead skin",
              body: "The weave is deliberately coarse. It takes off the layer of dead cells that dulls skin and leaves it feeling rough, in one pass rather than ten.",
            },
            {
              title: "Clears what is left behind",
              body: "Sweat, body oil and the residue of everything you put on your skin sit in places a flannel never properly reaches. The mesh takes them with it.",
            },
            {
              title: "Reaches your whole back",
              body: "Two feet of mesh, drawn shoulder to shoulder. The handled version pulls taut across the middle of your back — the one patch most people have never actually washed.",
            },
            {
              title: "Dries in hours",
              body: "An open weave holds almost no water, so it dries on a hook by the afternoon instead of staying damp between showers like a loofah.",
            },
            {
              title: "Cleans your mouth without paste",
              body: "Chewed into bristles, a miswak root is finer than nylon. It gets between teeth and along the gumline, and needs nothing else to work.",
            },
            {
              title: "Outlasts what it replaces",
              body: "A sponge runs a year or more. One stick runs three to four weeks. Neither needs charging, and nothing about either is disposable by design.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} as="li" delay={index * 0.06} className="border-t border-charcoal/15 pt-6">
              <h3 className="font-serif text-xl">{item.title}</h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-charcoal/65">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

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
        imageSrc="/images/the-full-ritual.jpg"
        imageAlt="Three miswak sticks, a rolled net sponge and a handled net sponge on marble"
        imageAspect="4/5"
        imageFirst
      />

      {/* ---- Secondary editorial band ----
           Type only. This used to be a headline laid over a graphic behind an
           85% charcoal scrim, which made the image pointless (you could barely
           see it) and the type cheap. A charcoal ground with nothing on it but
           the sentence is both quieter and more confident. */}
      <section className="bg-charcoal text-cream">
        <div className="edge py-section">
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <Reveal className="md:col-span-7">
              <p className="eyebrow !text-cream/50">The daily part</p>
              <h2 className="mt-6 font-serif text-display-lg">
                Four minutes, twice a day.
              </h2>
            </Reveal>

            <Reveal delay={0.12} className="md:col-span-5">
              <p className="text-base leading-relaxed text-cream/70 md:text-lg">
                Two minutes with a stick before the day starts. Two minutes with a sponge before it
                ends. Nothing to charge, nothing to squeeze, nothing that runs out mid-week — which
                is why it is one of the few routines people actually keep.
              </p>
              <Link
                href="/about"
                className="link-underline mt-8 inline-block text-[0.72rem] uppercase tracking-[0.2em]"
              >
                About us
              </Link>
            </Reveal>
          </div>
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
