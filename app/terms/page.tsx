import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { terms } from "@/data/legal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: terms.metaTitle,
  description: terms.metaDescription,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `${terms.metaTitle} — ${site.name}`,
    description: terms.metaDescription,
    url: "/terms",
  },
};

export default function Page() {
  return <LegalPage doc={terms} />;
}
