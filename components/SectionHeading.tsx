import Reveal from "@/components/Reveal";

/** Shared page/section header: eyebrow, serif heading, optional standfirst. */
export default function SectionHeading({
  eyebrow,
  heading,
  standfirst,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  heading: string;
  standfirst?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="mt-5 font-serif text-display-lg">{heading}</Tag>
      {standfirst && (
        <p className="mt-6 text-base leading-relaxed text-charcoal/65 md:text-lg">{standfirst}</p>
      )}
    </Reveal>
  );
}
