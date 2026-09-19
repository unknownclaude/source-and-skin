/**
 * Star row.
 *
 * Renders in half-star increments by clipping a filled row over an empty one,
 * because a 4.5 shown as 5 overstates and shown as 4 understates. The visual
 * stars are hidden from assistive tech and the real value is given as text, so
 * a screen reader hears "4.5 out of 5, 12 reviews" rather than ten glyphs.
 */
export default function StarRating({
  rating,
  count,
  size = "sm",
  className = "",
}: {
  rating: number;
  /** Shown beside the stars when given. */
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const glyph = size === "md" ? "text-base" : "text-[0.8rem]";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`relative inline-block ${glyph} leading-none`} aria-hidden>
        <span className="text-charcoal/20">★★★★★</span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-charcoal"
          style={{ width: `${pct}%` }}
        >
          ★★★★★
        </span>
      </span>
      <span className="sr-only">
        {rating} out of 5
        {typeof count === "number" ? `, ${count} ${count === 1 ? "review" : "reviews"}` : ""}
      </span>
      {typeof count === "number" && (
        <span aria-hidden className="text-[0.75rem] tabular-nums text-charcoal/55">
          ({count})
        </span>
      )}
    </span>
  );
}
