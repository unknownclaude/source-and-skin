import type { MetadataRoute } from "next";

import { isIndexable, site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // A preview deployment is excluded wholesale. Everywhere else, /checkout
    // is the only exclusion: it is a working surface rather than a landing
    // page, it has no content of its own until someone has a bag, and
    // indexing it would put an empty order summary in front of a search
    // result that should have gone to a product. It is left out of the
    // sitemap for the same reason.
    rules: isIndexable
      ? { userAgent: "*", allow: "/", disallow: ["/checkout"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
