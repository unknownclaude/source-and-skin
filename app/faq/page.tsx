import type { Metadata } from "next";
import Link from "next/link";

import Accordion from "@/components/Accordion";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "How to use a net sponge and a miswak, how long each lasts, shipping and returns — the questions we actually get asked.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `FAQ — ${site.name}`,
    description: "Using, caring for, and replacing net sponges and miswak.",
    url: "/faq",
  },
};

const groups = [
  {
    heading: "Using them",
    items: [
      {
        title: "How do I use an African net sponge?",
        content:
          "Wet it, wring once, and work soap through the mesh until it lathers — a pea-sized amount is plenty. Move in long strokes toward the heart. Rinse, wring, and hang it to dry; it should be dry within a few hours, which is the whole advantage over a washcloth.",
      },
      {
        title: "The sponge feels rough. Is that right?",
        content:
          "Yes. It arrives stiff and softens noticeably after the first two or three washes without losing its structure. If it feels genuinely abrasive rather than brisk, use less pressure — the mesh does the work, not your arm.",
      },
      {
        title: "How do I use a miswak?",
        content:
          "Peel or trim about half an inch of bark from one end, then chew that end until the fibres splay into a soft brush — a minute or two. Brush without toothpaste in small vertical strokes for two minutes. Snip the used tip off every few days to expose fresh fibre.",
      },
      {
        title: "What does miswak taste like?",
        content:
          "Sharp and faintly peppery — most people land on horseradish or mustard greens. It fades within a few days of regular use. That flavour is the plant itself; nothing has been added.",
      },
      {
        title: "Can I use miswak with toothpaste?",
        content:
          "You can, though it rather defeats the point. The fibres carry the plant's own cleaning compounds and work dry. If you are transitioning from a plastic brush, using both for a couple of weeks is a reasonable way to do it.",
      },
    ],
  },
  {
    heading: "Care and replacement",
    items: [
      {
        title: "How long does a net sponge last?",
        content:
          "A year or more of daily use. Replace it when the mesh stops springing back or starts to smell after drying — both mean the weave has gone slack. Machine-wash on cold every few weeks to push that date out.",
      },
      {
        title: "How long does one miswak stick last?",
        content:
          "Three to four weeks for most people, assuming you trim the tip every few days. The 3-pack is roughly a season.",
      },
      {
        title: "How should I store an unused miswak?",
        content:
          "Sealed, in the sleeve it arrived in, somewhere out of direct sun. The one in use should stand bristle-up in a dry glass — never in a closed container, where it cannot breathe. If a stick dries out, soak the tip for ten minutes before chewing.",
      },
      {
        title: "Are these compostable?",
        content:
          "The miswak is — it is a root and nothing else, so it goes in the green bin. The net sponge is nylon and is not compostable; it is built to last a year rather than to disappear. Our packaging is unbleached board and paper throughout.",
      },
    ],
  },
  {
    heading: "Orders",
    items: [
      {
        title: "When will my order ship?",
        content:
          "Within two business days of ordering. US orders over $45 ship free; below that it is a flat $5. International shipping is calculated at checkout and typically arrives in 7–14 business days.",
      },
      {
        title: "What is your returns policy?",
        content:
          "Unopened items can be returned within 30 days for a full refund — write to us and we will send instructions. For hygiene reasons we cannot take back opened miswak sleeves or used sponges, but if something arrives damaged or not as described, tell us and we will replace it.",
      },
      {
        title: "Do you sell wholesale?",
        content:
          "Yes, for shops and studios. Write to us with a little about where you are and what you are looking for, and we will send terms and a line sheet.",
      },
    ],
  },
];

export default function FaqPage() {
  // FAQPage schema, built from the same source as the visible copy so the two
  // cannot drift apart.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.title,
        acceptedAnswer: { "@type": "Answer", text: item.content },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="edge pb-section pt-36 md:pt-44">
        <SectionHeading
          as="h1"
          eyebrow="FAQ"
          heading="Questions we actually get."
          standfirst="Mostly about the first week — the sponge feeling stiff, the miswak tasting strange. Both settle."
        />

        <div className="mt-16 space-y-16">
          {groups.map((group, index) => (
            <Reveal key={group.heading} delay={index * 0.06}>
              <section aria-labelledby={`faq-${index}`}>
                <h2 id={`faq-${index}`} className="mb-6 font-serif text-display-sm">
                  {group.heading}
                </h2>
                <Accordion items={group.items} />
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-16 max-w-md text-base leading-relaxed text-charcoal/65">
            Not covered here?{" "}
            <Link href="/contact" className="link-underline">
              Write to us
            </Link>{" "}
            — the same two people who pack the boxes answer the email.
          </p>
        </Reveal>
      </div>
    </>
  );
}
