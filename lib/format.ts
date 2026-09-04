/**
 * Currency formatting. Single place to change when a second currency lands.
 *
 * en-AU renders AUD as "$14.00" rather than "A$14.00" — the plain form reads
 * better in a price grid, and the store states the currency explicitly in the
 * cart and the terms of sale instead of repeating a prefix on every figure.
 */
const formatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 2,
});

export function formatPrice(amount: number): string {
  return formatter.format(amount);
}

/** Joins class names, dropping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Chooses charcoal or cream text for a given accent background.
 * Uses the WCAG relative-luminance formula so the accent palette can grow
 * without anyone hand-checking contrast.
 */
export function readableTextOn(hex: string): "#1E1B16" | "#F5F1EA" {
  const clean = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255);
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  // Contrast against cream vs against charcoal; pick the higher.
  const contrastWithCream = (1.05) / (luminance + 0.05);
  const contrastWithCharcoal = (luminance + 0.05) / 0.062;
  return contrastWithCream >= contrastWithCharcoal ? "#F5F1EA" : "#1E1B16";
}
