import { shippingTerms } from "@/data/site";
import { CHANGE_OF_MIND_DAYS } from "@/data/legal";

/**
 * Four short reassurances beside the buy button.
 *
 * Every line here is a representation under the Australian Consumer Law, so
 * every line is one this business can currently honour and every one is backed
 * by a policy page you can read. Nothing aspirational, nothing rounded up:
 *
 *   - the free-shipping threshold and the change-of-mind window are read from
 *     the same constants the policy pages publish, so they cannot drift;
 *   - "Ships from NSW" is where the parcels actually go out from;
 *   - "Plastic-free packaging" is stated on the shipping page and is true.
 *
 * Deliberately absent: card brand logos. Payments are not activated yet, and
 * showing the marks of methods that cannot currently be used would be a false
 * representation about the availability of a service. Add them the day
 * Shopify Payments goes live, not before.
 */
const CLAIMS = [
  { label: `Free AU shipping over $${shippingTerms.freeThreshold}`, href: "/shipping" },
  { label: `${CHANGE_OF_MIND_DAYS}-day change of mind`, href: "/returns" },
  { label: "Ships from NSW", href: "/shipping" },
  { label: "Plastic-free packaging", href: "/sourcing" },
];

export default function TrustRow() {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-charcoal/10 pt-6">
      {CLAIMS.map((claim) => (
        <li key={claim.label} className="flex items-start gap-2.5">
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="mt-[0.15em] h-3.5 w-3.5 shrink-0 text-olive"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8.5 6.2 11.7 13 4.9" />
          </svg>
          <a
            href={claim.href}
            className="text-[0.78rem] leading-snug text-charcoal/65 underline-offset-4 hover:text-charcoal hover:underline"
          >
            {claim.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
