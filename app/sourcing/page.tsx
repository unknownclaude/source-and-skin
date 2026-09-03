import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import EditorialSection from "@/components/EditorialSection";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Where the net sponges and the miswak come from — West African markets and the arāk belt — and how we buy them.",
  alternates: { canonical: "/sourcing" },
  openGraph: {
    title: `Sourcing — ${site.name}`,
    description: "West African net sponges, Salvadora persica miswak, and how we buy both.",
    url: "/sourcing",
  },
};

const commitments = [
  {
    title: "Bought direct",
    body: "No trading desks between us and the people cutting and knotting. Fewer hands means we can answer questions about any batch we have sold.",
  },
  {
    title: "Small orders, often",
    body: "We buy in quantities we can sell within a season. Miswak in particular loses its character sitting in a warehouse — freshness is a sourcing decision, not a marketing one.",
  },
  {
    title: "Paid on collection",
    body: "Suppliers are paid when goods are collected, not sixty or ninety days later. It costs us working capital. It is also the single thing suppliers mention first.",
  },
];

export default function SourcingPage() {
  return (
    <>
      <div className="edge pb-20 pt-36 md:pt-44">
        <SectionHeading
          as="h1"
          eyebrow="Sourcing"
          heading="Two regions, two very old trades."
          standfirst="Neither of these objects was invented recently, and neither was invented by us. Here is where they come from and how they reach you."
        />
      </div>

      <div className="edge">
        <Reveal>
          <div className="relative aspect-[16/11] w-full overflow-hidden bg-cream-deep">
            <Image
              src="/images/placeholder-sourcing-map.jpg"
              alt="A schematic map marking the West African sponge trade and the arāk belt of the arid subtropics"
              fill
              priority
              sizes="94vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <EditorialSection
        eyebrow="The sponge — West Africa"
        heading="Knotted by hand, sold by the metre."
        body={[
          "The African net sponge — sapo, snet, or simply the net, depending on who you ask — is a length of nylon mesh knotted into a continuous tube. It is made across West Africa, most visibly in Ghana and Nigeria, where it has been a market staple for decades.",
          "The material is unromantic and that is the point: nylon does not hold water, does not host mould the way natural loofah does, and survives a year of daily use and the occasional machine wash. The craft is in the knotting — tension consistent enough that the tube keeps its spring but open enough to dry by morning.",
          "We buy from cooperatives that were making these long before anyone outside the region was buying them, in undyed, unbleached mesh. The sponge you receive is the sponge sold in the market, not a version reformulated for export.",
        ]}
        imageSrc="/images/placeholder-texture-fiber.jpg"
        imageAlt="Close detail of the open nylon weave of an African net sponge"
      />

      <EditorialSection
        eyebrow="The miswak — the arāk belt"
        heading="A root that has been a toothbrush for a thousand years."
        body={[
          "Miswak is cut from Salvadora persica — the arāk tree — which grows across the arid belt running from the Sahel through the Horn of Africa to the Arabian Peninsula and into South Asia. Its use as a tooth-cleaning stick is documented across that whole range and across most of recorded history in it.",
          "Roots are cut, trimmed to length, air-dried and sealed. That last step matters more than it sounds: a stick that dries out frays instead of splaying into bristles, which is why ours are vacuum-sealed individually rather than bundled loose in a sleeve.",
          "We do not make health claims about it. The plant has been studied and the literature is genuinely interesting, but what we sell is a root, not a treatment — and the reason to use one is that it works, costs little and produces no waste.",
        ]}
        imageSrc="/images/placeholder-texture-bark.jpg"
        imageAlt="Close detail of the fibrous bark of a Salvadora persica root"
        imageFirst
      />

      <section className="bg-charcoal text-cream" aria-labelledby="commitments-heading">
        <div className="edge py-section">
          <Reveal>
            <p className="eyebrow !text-cream/55">How we buy</p>
            <h2 id="commitments-heading" className="mt-5 max-w-2xl font-serif text-display-md">
              Three commitments we can be held to.
            </h2>
          </Reveal>

          <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {commitments.map((commitment, index) => (
              <Reveal as="li" key={commitment.title} delay={index * 0.1}>
                <h3 className="font-serif text-display-sm">{commitment.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-cream/70">{commitment.body}</p>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <p className="mt-16 max-w-xl text-sm leading-relaxed text-cream/55">
              Want the specifics on a particular batch — where it was cut, when it landed, who we
              bought it from? Ask us. We would rather answer than publish a certificate nobody
              reads.
            </p>
            <Link
              href="/contact"
              className="link-underline mt-6 inline-block text-[0.72rem] uppercase tracking-[0.2em]"
            >
              Get in touch
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
