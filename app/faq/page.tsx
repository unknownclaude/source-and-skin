import type { Metadata } from "next";
import Link from "next/link";

import Accordion from "@/components/Accordion";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { shippingTerms, site } from "@/data/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "What a net sponge and a miswak actually do, how to use them, how long each lasts, and how shipping and returns work under Australian Consumer Law.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `FAQ — ${site.name}`,
    description: "Using, caring for, and replacing net sponges and miswak.",
    url: "/faq",
  },
};

const groups = [
  {
    heading: "Results",
    items: [
      {
        title: "What will I actually notice?",
        content:
          "Smoother skin, immediately. The first wash takes off a layer of dead cells that a washcloth leaves behind, and most people feel the difference the moment they towel off. Whether skin looks brighter as well depends on how much build-up there was to start with — the change is usually more obvious on shoulders, upper arms and back than anywhere else.",
      },
      {
        title: "Will it help with rough, bumpy skin on my arms or thighs?",
        content:
          "Regular mechanical exfoliation is the standard advice for skin that feels rough or bumpy to the touch, and a net sponge is a straightforward way to do it — two or three times a week rather than daily, with light pressure. It is not a treatment for a skin condition, and we do not sell it as one. If something is painful, spreading, or not shifting, that is a question for a GP or a dermatologist rather than a sponge.",
      },
      {
        title: "My back is the problem area. Does this reach it?",
        content:
          "That is the main reason people buy one. The regular sponge is about 27 inches relaxed, long enough to hold at both ends and draw shoulder to shoulder. If you have limited shoulder mobility, or you want to pull it taut across the middle of your back without gripping wet mesh, buy the handled version — the cords do the work.",
      },
      {
        title: "How often should I use it?",
        content:
          "Daily is fine for most people on most of the body, with a lighter hand on the chest and anywhere thin-skinned. Two or three times a week is plenty if your skin is dry or reactive, or if you are also using an acid or retinoid — in that case do not do both on the same day.",
      },
      {
        title: "Can I use it on my face?",
        content:
          "No. The weave is built for the body and is too coarse for facial skin.",
      },
      {
        title: "Will the miswak whiten my teeth?",
        content:
          "It cleans mechanically, the same way any brush does, so it lifts surface staining from tea, coffee and tobacco as you use it. That is not the same as bleaching, and we make no claim that it changes the underlying colour of your teeth. It is also not a replacement for seeing a dentist.",
      },
      {
        title: "Does it help with bad breath?",
        content:
          "Most breath complaints come from bacteria and debris left between teeth and on the tongue. A miswak's fibres are finer than nylon bristles and get into those gaps, so the same thing applies as with any thorough brushing — it helps because it cleans. Persistent bad breath despite good cleaning is worth raising with a dentist.",
      },
    ],
  },
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
          "Yes. It arrives stiff and softens noticeably after the first two or three washes without losing its structure. If it feels genuinely abrasive rather than brisk, use less pressure — the mesh does the work, not your arm. Skin should feel clean afterwards, never raw or stinging.",
      },
      {
        title: "Which sponge should I buy — with handles or without?",
        content:
          "Without, if you want one sponge for everything and are happy holding it at both ends. With, if reaching the middle of your back is the reason you are here, or if wet mesh is awkward to grip. People who own both tend to use the handled one for the back and the plain one everywhere else, which is what The Full Ritual is.",
      },
      {
        title: "Does it work with bar soap, or do I need body wash?",
        content:
          "Bar soap, if anything, works better — rub the bar straight into the mesh. The open weave turns a very small amount of either into a lot of lather, which is one of the quieter savings of owning one.",
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
          "You can, though it rather defeats the point. The fibres carry the plant's own cleaning compounds and work dry. If you are transitioning from a plastic brush, using both for a couple of weeks is a reasonable way to do it. If your dentist has you on a specific fluoride regimen, keep following it — a miswak is a brush, not a substitute for their advice.",
      },
      {
        title: "Can children use these?",
        content:
          "The sponge, yes, with a light hand. The miswak involves chewing a piece of root and snipping the tip, so it is not suitable for small children unsupervised — and anyone with a nut, pollen or plant allergy should check the ingredient (Salvadora persica, and nothing else) before using it.",
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
        title: "How do I keep it from going smelly?",
        content:
          "Hang it somewhere with air on both sides rather than leaving it flat in the tray, and give it a cold machine wash every few weeks in a laundry bag. An open net dries in a few hours, so it rarely stays damp long enough to sour — that is the main thing it has over a loofah or a sponge.",
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
    heading: "Choosing and buying",
    items: [
      {
        title: "What is the difference between The Season and The Full Ritual?",
        content:
          "The Season is one net sponge and three miswak sticks — the ritual in the quantities it is actually used in, and where most people start. The Full Ritual adds the handled sponge, so you have one for your back and one for everywhere else. The Ritual Bundle is the smaller version of The Season: one sponge, one stick.",
      },
      {
        title: "Do the colours behave differently?",
        content:
          "No. Every net sponge is the same weave and the same nylon; the colour is only the colour. Buy whichever you would rather look at, or pick different ones per person so nobody argues about whose is whose.",
      },
      {
        title: "Do you restock sold-out colours?",
        content:
          "Yes, though not always quickly — we buy in small runs. Join the list and we send restock notices before they go public.",
      },
    ],
  },
  {
    heading: "Orders",
    items: [
      {
        title: "When will my order ship?",
        content:
          `Within ${shippingTerms.dispatchDays} business days of ordering. Australian orders over $${shippingTerms.freeThreshold} ship free; below that it is a flat $${shippingTerms.flatRate}. International shipping is calculated at checkout. If a parcel takes more than 30 days to reach you, we refund the shipping in full.`,
      },
      {
        title: "Where do you ship?",
        content:
          "Across Australia, and internationally where the carrier will take the parcel. Overseas orders can be held by customs and any duty is payable by you — we cannot calculate that in advance, because it depends on where you are.",
      },
      {
        title: "What is your returns policy?",
        content:
          "Our goods come with guarantees that cannot be excluded under the Australian Consumer Law — if something is faulty or not as described you are entitled to a repair, replacement or refund, and for a major failure the choice is yours. Separately, we accept change-of-mind returns on unopened items within 30 days. The full policy is on our returns page.",
      },
      {
        title: "Can I return a sponge I have already used?",
        content:
          "Not for change of mind — for hygiene reasons that only covers unopened items. It does not affect your consumer guarantee rights: if the sponge is faulty, falls apart, or is not what was described, write to us regardless of whether it has been used.",
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
          standfirst="What these actually do, how to use them, and what happens in the first week — the sponge feels stiff, the miswak tastes strange. Both settle."
        />

        <div className="mt-16 space-y-16">
          {groups.map((group, index) => (
            <Reveal key={group.heading} delay={index * 0.06}>
              <section aria-labelledby={`faq-${index}`}>
                <h2 id={`faq-${index}`} className="mb-6 font-serif text-display-sm">
                  {group.heading}
                </h2>
                {/* Open the first answer of the first group so the page does
                    not present as a column of empty rows. */}
                <Accordion items={group.items} defaultOpenIndex={index === 0 ? 0 : null} />
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
