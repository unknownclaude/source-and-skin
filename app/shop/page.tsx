import type { Metadata } from "next";

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
        standfirst="Five things. Two of them are the same thing in a different size, and one is the other two together."
      />
      <ShopGrid products={products} />
    </div>
  );
}
