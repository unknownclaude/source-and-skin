import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about an order, a batch, or wholesale. We answer everything ourselves, usually within two business days.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${site.name}`,
    description: "Questions about an order, a batch, or wholesale.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="edge pb-section pt-36 md:pt-44">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        heading="Talk to us."
        standfirst="There is no support desk and no ticket queue. Messages reach the same two people who pack the boxes."
      />

      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <Reveal>
          <div className="space-y-10">
            <div>
              <h2 className="eyebrow">Email</h2>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-3 block font-serif text-xl"
              >
                {site.email}
              </a>
            </div>

            <div>
              <h2 className="eyebrow">Instagram</h2>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline mt-3 block font-serif text-xl"
              >
                {site.social.instagramHandle}
              </a>
            </div>

            <div>
              <h2 className="eyebrow">Response time</h2>
              <p className="mt-3 max-w-xs text-base leading-relaxed text-charcoal/65">
                Two business days, most of the time same day. We are a small operation in one time
                zone, so overnight replies are luck rather than policy.
              </p>
            </div>

            <div>
              <h2 className="eyebrow">Before you write</h2>
              <p className="mt-3 max-w-xs text-base leading-relaxed text-charcoal/65">
                Shipping, returns and how-to questions are answered on the{" "}
                <Link href="/faq" className="link-underline">
                  FAQ
                </Link>
                . Anything not covered there, send it over.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
