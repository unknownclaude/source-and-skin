"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/components/CartProvider";
import { primaryNav, site } from "@/data/site";
import { cn } from "@/lib/format";

/**
 * Transparent over the hero, cream once the page scrolls.
 *
 * Routes other than the homepage have no full-bleed hero behind the nav, so
 * they start in the solid state — otherwise charcoal-on-cream links would be
 * asked to sit on nothing.
 */
export default function Navbar() {
  const pathname = usePathname();
  const isOverHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 48);
  });

  // Close the mobile sheet on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock the page behind the open mobile sheet.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || !isOverHero || menuOpen;

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-editorial",
          solid ? "text-charcoal" : "text-cream"
        )}
        initial={false}
      >
        {/* Background layer fades in rather than snapping, so the hero video
            keeps its full bleed until the reader actually starts moving. */}
        <motion.div
          aria-hidden
          className="absolute inset-0 border-b border-charcoal/10 bg-cream/95 backdrop-blur-sm"
          initial={false}
          animate={{ opacity: solid ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Legibility scrim while transparent over the video. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-charcoal/45 to-transparent transition-opacity duration-500",
            solid ? "opacity-0" : "opacity-100"
          )}
        />

        <nav aria-label="Primary" className="edge relative flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
          <Link
            href="/"
            className="font-serif text-[1.05rem] tracking-[0.02em] md:text-xl"
            aria-label={`${site.name} — home`}
          >
            {site.name}
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                  className={cn(
                    "link-underline text-[0.8rem] uppercase tracking-[0.16em]",
                    pathname.startsWith(link.href) && "opacity-60"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              className="group flex items-center gap-2 rounded-full px-2 py-2 text-[0.8rem] uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <BagIcon />
              <span aria-hidden className="tabular-nums">
                ({count})
              </span>
            </button>

            <button
              type="button"
              className="-mr-2 p-2 md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <div className="flex h-4 w-6 flex-col justify-between">
                <motion.span
                  className="block h-px w-full bg-current"
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7.5 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.span
                  className="block h-px w-full bg-current"
                  animate={{ opacity: menuOpen ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-px w-full bg-current"
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7.5 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              className="relative border-t border-charcoal/10 bg-cream text-charcoal md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="edge flex flex-col py-4">
                {primaryNav.map((link) => (
                  <li key={link.href} className="border-b border-charcoal/8 last:border-0">
                    <Link
                      href={link.href}
                      className="block py-4 font-serif text-2xl"
                      aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
    </>
  );
}

function BagIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-[1.15rem] w-[1.15rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M3.6 6.4h12.8l-1 10.2H4.6L3.6 6.4Z" strokeLinejoin="round" />
      <path d="M7.2 8.2V5.6a2.8 2.8 0 1 1 5.6 0v2.6" strokeLinecap="round" />
    </svg>
  );
}
