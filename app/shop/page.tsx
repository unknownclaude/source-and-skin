import type { Metadata } from "next";

import ProductComparison from "@/components/ProductComparison";
import SectionHeading from "@/components/SectionHeading";
import ShopGrid from "@/components/ShopGrid";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "African net sponges in two sizes, Salvadora persica miswak singly or in threes, and the bundle that pairs them.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop — Source and Skin",
    description:
      "African net sponges in two sizes, Salvadora persica miswak singly or in threes, and the bundle that pairs them.",
    url: "/shop",
  },
};

export default function ShopPage() {
  return (
    <div className="edge pb-section pt-36 md:pt-44">
      <SectionHeading
        as="h1"
        eyebrow="Everything we make"
        heading="The collection."
        standfirst="Two objects, and the bundles that pair them. If the bundles blur together, the table underneath says exactly what is in each box."
      />
      <ShopGrid products={products} />

      <div className="mt-section">
        <ProductComparison />
      </div>
    </div>
  );
}
