import Link from "next/link";

import NewsletterForm from "@/components/NewsletterForm";
import { footerNav, site } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-charcoal/10 bg-cream-deep">
      <div className="edge py-section">
        <div className="grid gap-12 md:grid-cols-4 md:gap-10">
          <div className="md:col-span-1">
            <p className="font-serif text-xl">{site.name}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal/60">
              Two objects with long histories — a hand-knotted net sponge and a cut of arāk
              root — sourced from the places that have used them longest.
            </p>
          </div>

          {footerNav.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="eyebrow">{column.heading}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-charcoal/70 transition-colors hover:text-charcoal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="eyebrow">Elsewhere</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline text-sm text-charcoal/70 transition-colors hover:text-charcoal"
                >
                  Instagram {site.social.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline text-sm text-charcoal/70 transition-colors hover:text-charcoal"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-charcoal/10 pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-display-sm">Join the list</h2>
              <p className="mt-2 max-w-sm text-sm text-charcoal/60">
                Restocks, small-batch drops, and the occasional note on where things come from.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <p className="mt-14 text-xs text-charcoal/45">
          &copy; {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
