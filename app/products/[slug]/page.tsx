import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import Reveal from "@/components/Reveal";
import Reviews from "@/components/Reviews";
import { getProduct, getRelatedProducts, products } from "@/data/products";
import { getReviewsFor } from "@/data/reviews";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";

type PageProps = { params: { slug: string } };

/** Statically renders every product at build time. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — ${site.name}`,
      description: product.tagline,
      url: `/products/${product.slug}`,
      images: [{ url: product.images.main, width: 1200, height: 1500, alt: product.name }],
    },
  };
}

export default function ProductPage({ params }: PageProps) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug);
  const productReviews = getReviewsFor(product.slug);

  // Product schema so the PDP is eligible for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.gallery.map((path) => `${site.domain}${path}`),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site.domain}/products/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from our own static catalogue — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="edge pb-section pt-32 md:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/45">
            <li>
              <Link href="/shop" className="transition-colors hover:text-charcoal">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-charcoal/70">
              {product.name}
            </li>
          </ol>
        </nav>

        <ProductDetail product={product} />
      </div>

      <Reviews reviews={productReviews} />

      <section className="border-t border-charcoal/10 bg-cream-deep" aria-labelledby="related-heading">
        <div className="edge py-section">
          <Reveal>
            <p className="eyebrow">Keep going</p>
            <h2 id="related-heading" className="mt-5 font-serif text-display-sm">
              You may also like
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <ProductCard key={item.slug} product={item} index={index} showFromPrefix={false} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
