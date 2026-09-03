"use client";

import { useMemo, useState } from "react";

import ProductCard from "@/components/ProductCard";
import { categoryLabels, type Product, type ProductCategory } from "@/data/products";

type Filter = ProductCategory | "all";
type Sort = "featured" | "price-asc" | "price-desc";

const FILTERS: Filter[] = ["all", "sponge", "miswak", "bundle"];

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

/**
 * Filter + sort bar over the product grid.
 *
 * State lives in the component rather than the URL — with five products a
 * shareable filtered URL buys nothing. If the catalogue grows, lift this into
 * `useSearchParams` so `/shop?category=miswak` becomes linkable.
 */
export default function ShopGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    const filtered =
      filter === "all" ? products : products.filter((product) => product.category === filter);

    if (sort === "featured") return filtered;
    return [...filtered].sort((a, b) =>
      sort === "price-asc" ? a.price - b.price : b.price - a.price
    );
  }, [products, filter, sort]);

  return (
    <>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-y border-charcoal/12 py-4">
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by category">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`rounded-full px-4 py-2 text-[0.72rem] uppercase tracking-[0.16em] transition-colors ${
                filter === value
                  ? "bg-charcoal text-cream"
                  : "text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal"
              }`}
            >
              {categoryLabels[value]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="shop-sort"
            className="text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/50"
          >
            Sort
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="cursor-pointer border-b border-charcoal/25 bg-transparent py-1.5 pr-6 text-sm outline-none"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-charcoal/50" aria-live="polite">
        {visible.length} {visible.length === 1 ? "product" : "products"}
      </p>

      <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product, index) => (
          <ProductCard
            key={product.slug}
            product={product}
            index={index}
            priority={index < 3}
            showFromPrefix={false}
          />
        ))}
      </div>
    </>
  );
}
