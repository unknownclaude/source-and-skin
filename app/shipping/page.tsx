import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { shipping } from "@/data/legal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: shipping.metaTitle,
  description: shipping.metaDescription,
  alternates: { canonical: "/shipping" },
  openGraph: {
    title: `${shipping.metaTitle} — ${site.name}`,
    description: shipping.metaDescription,
    url: "/shipping",
  },
};

export default function Page() {
  return <LegalPage doc={shipping} />;
}
