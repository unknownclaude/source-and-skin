import Link from "next/link";

import Reveal from "@/components/Reveal";
import type { LegalDocument } from "@/data/legal";
import { legalDocuments } from "@/data/legal";

/**
 * Shared layout for the policy pages.
 *
 * Sections marked `emphasis` carry rights the customer cannot be contracted out
 * of. They are set apart deliberately — a consumer guarantee buried in identical
 * body copy is technically disclosed and practically hidden, and the ACCC reads
 * prominence as part of whether a disclosure was made at all.
 */
export default function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <div className="edge pb-section pt-36 md:pt-44">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="eyebrow">Policies</p>
          <h1 className="mt-5 font-serif text-display-lg">{doc.title}</h1>
          <p className="mt-6 text-base leading-relaxed text-charcoal/65 md:text-lg">
            {doc.standfirst}
          </p>
          <p className="mt-6 text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/45">
            Last updated {doc.updated}
          </p>
        </Reveal>

        <div className="mt-16 space-y-14">
          {doc.sections.map((section, index) => (
            <Reveal as="section" key={section.heading} delay={Math.min(index, 4) * 0.05}>
              <div
                className={
                  section.emphasis
                    ? "border-l-2 border-clay bg-cream-deep/60 py-7 pl-6 pr-5 md:pl-8"
                    : undefined
                }
              >
                <h2 className="font-serif text-display-sm">{section.heading}</h2>

                {section.body?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-5 text-base leading-relaxed text-charcoal/75"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.list && (
                  <ul className="mt-5 space-y-3">
                    {section.list.map((item) => (
                      <li
                        key={item.slice(0, 40)}
                        className="relative pl-6 text-base leading-relaxed text-charcoal/75"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-[0.7em] h-px w-3 bg-charcoal/30"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <nav aria-label="Other policies" className="mt-20 border-t border-charcoal/12 pt-8">
            <h2 className="eyebrow">Other policies</h2>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {legalDocuments
                .filter((other) => other.slug !== doc.slug)
                .map((other) => (
                  <li key={other.slug}>
                    <Link href={`/${other.slug}`} className="link-underline text-sm text-charcoal/70">
                      {other.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </Reveal>
      </div>
    </div>
  );
}
