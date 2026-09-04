import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/Reveal";

type EditorialSectionProps = {
  eyebrow?: string;
  heading: string;
  /** Each string renders as its own paragraph. */
  body: string[];
  linkHref?: string;
  linkLabel?: string;
  imageSrc: string;
  imageAlt: string;
  /** Shape of the image slot. Portrait suits figure/in-use shots. */
  imageAspect?: keyof typeof ASPECTS;
  /** Puts the image first on desktop. */
  imageFirst?: boolean;
  /** Cream on charcoal instead of the default charcoal on cream. */
  inverted?: boolean;
};

/**
 * Tailwind needs whole class names at build time, so the aspect options are a
 * lookup rather than an interpolated string.
 */
const ASPECTS = {
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
} as const;

/** Two-column story block: copy on one side, a single large image on the other. */
export default function EditorialSection({
  eyebrow,
  heading,
  body,
  linkHref,
  linkLabel,
  imageSrc,
  imageAlt,
  imageAspect = "4/3",
  imageFirst = false,
  inverted = false,
}: EditorialSectionProps) {
  return (
    <section className={inverted ? "bg-charcoal text-cream" : "bg-cream text-charcoal"}>
      <div className="edge grid items-center gap-12 py-section md:grid-cols-2 md:gap-20">
        <Reveal className={imageFirst ? "md:order-2" : undefined}>
          <div className="max-w-editorial">
            {eyebrow && (
              <p className={`eyebrow ${inverted ? "!text-cream/55" : ""}`}>{eyebrow}</p>
            )}
            <h2 className="mt-5 font-serif text-display-md">{heading}</h2>
            <div className={`mt-7 space-y-5 text-base leading-relaxed ${inverted ? "text-cream/75" : "text-charcoal/70"}`}>
              {body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            {linkHref && linkLabel && (
              <Link
                href={linkHref}
                className="link-underline mt-9 inline-block text-[0.72rem] uppercase tracking-[0.2em]"
              >
                {linkLabel}
              </Link>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className={imageFirst ? "md:order-1" : undefined}>
          <div className={`relative w-full overflow-hidden bg-cream ${ASPECTS[imageAspect]}`}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 48vw, 92vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
