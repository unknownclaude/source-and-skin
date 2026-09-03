import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="edge flex min-h-[70svh] flex-col items-center justify-center py-section text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 max-w-xl font-serif text-display-lg">
        This one has gone the way of the plastic puff.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/65">
        The page you were looking for is not here. The collection is only five things, so it should
        not take long to find what you were after.
      </p>
      <Link
        href="/shop"
        className="mt-9 inline-flex items-center gap-3 rounded-full bg-charcoal px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-cream transition-transform duration-500 ease-editorial hover:-translate-y-0.5"
      >
        Back to the shop
        <span aria-hidden>&rarr;</span>
      </Link>
    </div>
  );
}
