import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import { LiveCatalogueProvider } from "@/components/LiveCatalogueProvider";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/CartProvider";
import { site } from "@/data/site";
import { fetchLiveCatalogue } from "@/lib/shopify";

import "./globals.css";

/**
 * Display serif for headlines, neutral grotesk for everything else.
 * Swap `Playfair_Display` for a licensed face (Canela, Fraunces) by changing
 * only this block — the rest of the app reads the CSS variables.
 */
const display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — African Net Sponges & Miswak`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "African net sponge",
    "miswak",
    "Salvadora persica",
    "exfoliating sponge",
    "natural oral care",
    "sisal sponge",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — African Net Sponges & Miswak`,
    description: site.description,
    url: site.domain,
    locale: "en_AU",
    images: [
      {
        url: "/images/hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: `${site.name} — net sponge and miswak on a clay-toned ground`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — African Net Sponges & Miswak`,
    description: site.description,
    images: ["/images/hero-poster.jpg"],
  },
  robots: { index: true, follow: true },
};

/**
 * The live store is read once, here, and handed to every island below.
 *
 * It is fetched in the layout rather than per page so that the buy button, the
 * bag and the checkout page all quote prices from the same moment. The fetch
 * is cached and refreshed in the background, so pages stay static and no
 * visitor ever waits on Shopify; if it fails, `null` flows down and everything
 * falls back to the static catalogue.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const live = await fetchLiveCatalogue();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh bg-cream text-charcoal">
        <LiveCatalogueProvider value={live}>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-charcoal focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
            >
              Skip to content
            </a>
            <Analytics />
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
          </CartProvider>
        </LiveCatalogueProvider>
      </body>
    </html>
  );
}
