import { anyPaymentMethodEnabled, paymentMethods } from "@/data/payments";

/**
 * The row of accepted payment methods.
 *
 * Two states, because there are two truths to tell.
 *
 * **Live** — the methods that work are listed plainly. Nothing else appears.
 *
 * **Preview** — while nothing in `data/payments.ts` is enabled, the same row is
 * rendered dimmed, behind a heading that says these are not available yet. A
 * shopper can see where the site is going without being told something false
 * about where it is, which is the whole difference between a preview and a
 * misleading representation.
 *
 * The marks are typographic on purpose. The obvious alternative is each
 * network's official artwork, and it is the right thing to ship eventually —
 * Visa and Mastercard both publish the files and the rules for using them, and
 * a shopper recognises the shapes faster than the words. But those files are
 * trademarks with licence conditions attached, and a hand-drawn approximation
 * of a trademark is worse than no logo at all: it is both an infringement and
 * visibly cheap. Letterspaced caps in the site's own type are neither, and
 * swapping them for licensed artwork later is one component.
 */
export default function PaymentMethods({ className = "" }: { className?: string }) {
  const live = anyPaymentMethodEnabled();
  const shown = live ? paymentMethods.filter((method) => method.enabled) : paymentMethods;

  return (
    <div className={className}>
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-charcoal/45">
        {live ? "We accept" : "Will accept once payments are switched on"}
      </p>

      <ul className={`mt-3 flex flex-wrap gap-1.5 ${live ? "" : "opacity-55"}`}>
        {shown.map((method) => (
          <li
            key={method.id}
            className="rounded-[0.2rem] border border-charcoal/20 px-2.5 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-charcoal/70"
          >
            {method.label}
          </li>
        ))}
      </ul>

      {!live && (
        <p className="mt-3 text-[0.72rem] leading-relaxed text-charcoal/50">
          None of these can be used yet. Nothing on this site can take a payment today.
        </p>
      )}
    </div>
  );
}
