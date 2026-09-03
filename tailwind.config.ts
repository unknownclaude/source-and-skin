import type { Config } from "tailwindcss";

/**
 * Source and Skin — design tokens.
 * The palette is intentionally small: a warm neutral base plus three muted
 * accents that rotate as full-bleed background blocks behind product shots.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F1EA",
        "cream-deep": "#EBE4D8",
        charcoal: "#1E1B16",
        terracotta: "#C57A54",
        olive: "#6B7259",
        clay: "#8C4A3B",
        sand: "#D8CFC0",
      },
      fontFamily: {
        // Wired to next/font in app/layout.tsx — see the CSS variables there.
        serif: ["var(--font-display)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 7vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4.25rem)", { lineHeight: "1.06", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3.4vw, 3rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.35rem, 2.2vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      maxWidth: {
        edge: "94rem",
        editorial: "38rem",
      },
      spacing: {
        section: "clamp(4.5rem, 9vw, 9rem)",
        gutter: "clamp(1.25rem, 4vw, 3.5rem)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "marquee-drift": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "marquee-drift": "marquee-drift 38s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
