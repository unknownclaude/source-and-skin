"use client";

import { createContext, useContext } from "react";

import type { LiveCatalogue } from "@/lib/shopify";

/**
 * Carries the live store data from the server into the client islands.
 *
 * Fetched once in the root layout and handed down, rather than fetched by the
 * components that need it. Two reasons: the browser never talks to Shopify, so
 * the Storefront token stays on the server; and every part of the page quotes
 * the same prices from the same moment, instead of the buy button and the cart
 * disagreeing because they asked a minute apart.
 *
 * Null means the store was not reachable or is not configured. Consumers read
 * that as "use the static catalogue" — see lib/catalogue.ts.
 */
const LiveCatalogueContext = createContext<LiveCatalogue | null>(null);

export function LiveCatalogueProvider({
  value,
  children,
}: {
  value: LiveCatalogue | null;
  children: React.ReactNode;
}) {
  return <LiveCatalogueContext.Provider value={value}>{children}</LiveCatalogueContext.Provider>;
}

export function useLiveCatalogue(): LiveCatalogue | null {
  return useContext(LiveCatalogueContext);
}
