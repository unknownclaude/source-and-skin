import type { MetadataRoute } from "next";

import { legalDocuments } from "@/data/legal";
import { products } from "@/data/products";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // The policy routes are derived, not listed: a legal page that exists but is
  // not in the sitemap is a page nobody can find when they go looking for their
  // rights, and hand-maintained lists are exactly how that happens.
  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/sourcing",
    "/contact",
    "/faq",
    ...legalDocuments.map((doc) => `/${doc.slug}`),
  ].map((route) => ({
    url: `${site.domain}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const productRoutes = products.map((product) => ({
    url: `${site.domain}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
