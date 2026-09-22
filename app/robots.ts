import type { MetadataRoute } from "next";

import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /checkout is a working surface, not a landing page: it has no content of
    // its own until someone has a bag, and indexing it would put an empty
    // order summary in front of a search result that should have gone to a
    // product. It is also left out of the sitemap for the same reason.
    rules: { userAgent: "*", allow: "/", disallow: ["/checkout"] },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
