import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import EditorialSection from "@/components/EditorialSection";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why two objects and not twenty. The thinking behind Source and Skin — net sponges, miswak, and a short list held on purpose.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${site.name}`,
    description: "Why two objects and not twenty.",
    url: "/about",
  },
};

const principles = [
  {
    title: "Old before new",
    body: "If a thing has been in continuous use for a thousand years, the burden of proof sits with whatever wants to replace it — not the other way round.",
  },
  {
    title: "Short list, held",
    body: "Five products. We would rather answer for each of them than carry a catalogue we cannot vouch for.",
  },
  {
    title: "Nothing decorative",
    body: "No fragrance, no dye, no packaging that exists to be photographed. What arrives is the object and the box it travelled in.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="edge pb-20 pt-36 md:pt-44">
        <SectionHeading
          as="h1"
          eyebrow="About"
          heading="Two objects, held to a short list."
          standfirst="We started with a question that turned out to be harder than it sounded: what do you actually use every single day, and where did it come from?"
        />
      </div>

      <div className="edge">
        <Reveal>
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-sand">
            <Image
              src="/images/placeholder-about-portrait.jpg"
              alt="A net sponge resting on warm stone, lit from one side"
              fill
              priority
              sizes="94vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <EditorialSection
        eyebrow="How it started"
        heading="A washcloth that never dried."
        body={[
          "The honest version: one of us grew up with a net sponge hanging over the shower rail and did not think about it once until moving away and trying to replace it. Nothing did. Loofahs went soft and mouldy. Washcloths stayed damp for days. The plastic puffs shed.",
          "The sponge was never a wellness product where it came from. It was the obvious tool — cheap, hard-wearing, sold in every market from Accra to Lagos, and gone from most Western bathrooms for no better reason than that nobody exported it properly.",
          "Miswak arrived the same way, from the other direction. A friend handed one over with no instructions beyond chew this end. It took a week to stop feeling absurd and about a month to stop wanting a plastic brush.",
        ]}
        imageSrc="/images/placeholder-lifestyle-bath.jpg"
        imageAlt="A softly lit bathroom shelf with a net sponge hanging to dry"
      />

      <section className="bg-cream-deep" aria-labelledby="principles-heading">
        <div className="edge py-section">
          <Reveal>
            <p className="eyebrow">What we hold to</p>
            <h2 id="principles-heading" className="mt-5 max-w-2xl font-serif text-display-md">
              Three rules, and no others.
            </h2>
          </Reveal>

          <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {principles.map((principle, index) => (
              <Reveal as="li" key={principle.title} delay={index * 0.1}>
                <p className="font-serif text-2xl text-charcoal/25 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 font-serif text-display-sm">{principle.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-charcoal/65">{principle.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="edge py-section">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-display-md">Start where most people start.</h2>
          <p className="mt-6 text-base leading-relaxed text-charcoal/65">
            The Season is one sponge and three sticks — a year of one, a season of the other,
            priced below the sum of its parts.
          </p>
          <Link
            href="/products/the-season"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-charcoal px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-cream transition-transform duration-500 ease-editorial hover:-translate-y-0.5"
          >
            Shop The Season
            <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
