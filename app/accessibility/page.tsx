import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { accessibility } from "@/data/legal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: accessibility.metaTitle,
  description: accessibility.metaDescription,
  alternates: { canonical: "/accessibility" },
  openGraph: {
    title: `${accessibility.metaTitle} — ${site.name}`,
    description: accessibility.metaDescription,
    url: "/accessibility",
  },
};

export default function Page() {
  return <LegalPage doc={accessibility} />;
}
