import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { returns } from "@/data/legal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: returns.metaTitle,
  description: returns.metaDescription,
  alternates: { canonical: "/returns" },
  openGraph: {
    title: `${returns.metaTitle} — ${site.name}`,
    description: returns.metaDescription,
    url: "/returns",
  },
};

export default function Page() {
  return <LegalPage doc={returns} />;
}
