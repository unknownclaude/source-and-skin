import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { privacy } from "@/data/legal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: privacy.metaTitle,
  description: privacy.metaDescription,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `${privacy.metaTitle} — ${site.name}`,
    description: privacy.metaDescription,
    url: "/privacy",
  },
};

export default function Page() {
  return <LegalPage doc={privacy} />;
}
