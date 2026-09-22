"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/CartProvider";
import DeliveryEstimate from "@/components/DeliveryEstimate";
import { useLiveCatalogue } from "@/components/LiveCatalogueProvider";
import PaymentMethods from "@/components/PaymentMethods";
import { CHANGE_OF_MIND_DAYS, DELIVERY_PROMISE_DAYS, gstStatement } from "@/data/legal";
import { anyPaymentMethodEnabled, paymentProvider } from "@/data/payments";
import { shippingTerms, site } from "@/data/site";
import { availabilityFor } from "@/lib/catalogue";
import { checkoutState, type VariantCoverage } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { orderTotals, type Destination } from "@/lib/order";

/**
 * The last screen before money.
 *
 * It exists because the alternative — a checkout button in the slide-over bag
 * that throws you straight onto another company's domain — asks for a card
 * about four seconds after the customer last saw a price. This page puts the
 * order, the total including shipping, the terms and the security statement in
 * one place, at full size, and only then offers the button.
 *
 * Nothing here takes a payment, and nothing here ever will. Card details are
 * entered on Shopify's hosted checkout, which is the entire reason this site
 * can be a static front end with no PCI surface: there is no card number in
 * this application to leak. What this page does is make the handover
 * deliberate and explained, rather than a surprise change of address bar.
 */
export default function CheckoutReview({ coverage }: { coverage: VariantCoverage }) {
  const { lines, subtotal, hydrated, setQuantity, remove } = useCart();
  const stock = useLiveCatalogue();
  const [destination, setDestination] = useState<Destination>("australia");
  const [accepted, setAccepted] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const state = checkoutState(lines);
  const totals = orderTotals(subtotal, destination);

  // A bag can sit in localStorage for weeks. Something in it selling out
  // between then and now is the one failure this page can still catch, and
  // catching it here costs a click where catching it after payment costs a
  // refund, an apology and the customer.
  const soldOut = new Set(
    lines
      .filter((line) => availabilityFor(line.product, line.selection, stock) === "sold-out")
      .map((line) => line.key)
  );

  const live = state.status === "ready" && soldOut.size === 0;

  // Held back until localStorage has been read, so nobody is told their bag is
  // empty for one frame while standing at the payment step.
  if (!hydrated) {
    return <div className="min-h-[50vh]" aria-hidden />;
  }

  if (lines.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-start justify-center gap-6 border-t border-charcoal/10 pt-12">
        <p className="font-serif text-display-sm">There is nothing in your bag.</p>
        <p className="max-w-md text-[0.95rem] leading-relaxed text-charcoal/65">
          Add something and this page will show you the full cost of it — including shipping —
          before you are asked for anything.
        </p>
        <Link
          href="/shop"
          className="rounded-full bg-charcoal px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-cream transition-opacity hover:opacity-85"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-x-16 gap-y-14 border-t border-charcoal/10 pt-12 lg:grid-cols-12">
      {/* ---------------------------------------------------------------
          What is being bought
          --------------------------------------------------------------- */}
      <div className="lg:col-span-7">
        <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-charcoal/45">Your order</h2>

        <ul className="mt-6 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-5 py-6">
              <Link
                href={`/products/${line.slug}`}
                className="relative h-32 w-[6.5rem] shrink-0 overflow-hidden bg-sand"
              >
                <Image
                  src={line.image}
                  alt={line.product.name}
                  fill
                  sizes="104px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <Link
                    href={`/products/${line.slug}`}
                    className="font-serif text-lg leading-snug hover:opacity-70"
                  >
                    {line.product.name}
                  </Link>
                  {line.selectionLabel && (
                    <p className="mt-1.5 text-[0.78rem] uppercase tracking-[0.12em] text-charcoal/55">
                      {line.selectionLabel}
                    </p>
                  )}
                  <p className="mt-1.5 text-sm text-charcoal/55">
                    {formatPrice(line.unitPrice)} each
                  </p>
                  {soldOut.has(line.key) && (
                    <p role="alert" className="mt-2 text-[0.8rem] leading-relaxed text-clay">
                      Sold out since you added it. Remove it to carry on, or email us — we will
                      tell you when it is back.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex items-center border border-charcoal/20">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity - 1)}
                      className="px-3 py-1.5 text-sm transition-colors hover:bg-charcoal/5"
                      aria-label={`Decrease quantity of ${line.product.name}${line.selectionLabel ? `, ${line.selectionLabel}` : ""}`}
                    >
                      &minus;
                    </button>
                    <span className="min-w-9 text-center text-sm tabular-nums" aria-live="polite">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity + 1)}
                      className="px-3 py-1.5 text-sm transition-colors hover:bg-charcoal/5"
                      aria-label={`Increase quantity of ${line.product.name}${line.selectionLabel ? `, ${line.selectionLabel}` : ""}`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(line.key)}
                    className="text-[0.7rem] uppercase tracking-[0.16em] text-charcoal/50 underline-offset-4 transition-colors hover:text-charcoal hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="shrink-0 font-serif text-lg tabular-nums">
                {formatPrice(line.lineTotal)}
              </p>
            </li>
          ))}
        </ul>

      </div>

      {/* ---------------------------------------------------------------
          What it costs, and the button.

          Second in the source, and on a phone that is exactly where it
          belongs: the total and the pay button come straight after the items,
          not after two screens of delivery copy. On a wide screen it spans
          both rows of the left-hand column and sticks, so it stays in view
          while the rest is read.
          --------------------------------------------------------------- */}
      <div className="lg:col-span-5 lg:row-span-2">
        <div className="lg:sticky lg:top-28">
          <div className="border border-charcoal/15 bg-cream-deep/60 p-7">
            <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-charcoal/45">
              Order summary
            </h2>

            {/* Destination, because the shipping line is only knowable for one
                of the two answers. Guessing an international rate here would
                put a number on the page that the checkout then contradicts. */}
            <fieldset className="mt-6">
              <legend className="text-[0.7rem] uppercase tracking-[0.14em] text-charcoal/50">
                Delivering to
              </legend>
              <div className="mt-2.5 flex gap-2">
                {(
                  [
                    { id: "australia", label: "Australia" },
                    { id: "elsewhere", label: "Outside Australia" },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.id}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.12em] transition-colors ${
                      destination === option.id
                        ? "border-charcoal bg-charcoal text-cream"
                        : "border-charcoal/25 text-charcoal/65 hover:border-charcoal/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="destination"
                      value={option.id}
                      checked={destination === option.id}
                      onChange={() => setDestination(option.id)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <dl className="mt-7 space-y-3 border-t border-charcoal/12 pt-6 text-sm">
              <div className="flex items-baseline justify-between">
                <dt className="text-charcoal/65">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-charcoal/65">Shipping</dt>
                <dd className="tabular-nums">
                  {totals.freeShipping ? "Free" : formatPrice(totals.shipping)}
                </dd>
              </div>
            </dl>

            {/* "Total" is a word with a legal meaning on a price: section 48
                of the Australian Consumer Law wants the single figure someone
                will actually pay, and this is it — shipping included, for both
                destinations, because the store charges one flat rate outside
                Australia rather than quoting per address. The only thing not
                in it is import duty, which is levied by the destination
                country rather than charged by us, and which is called out
                directly underneath. */}
            <div className="mt-5 flex items-baseline justify-between border-t border-charcoal/12 pt-5">
              <span className="text-[0.75rem] uppercase tracking-[0.18em] text-charcoal/60">
                Total
              </span>
              <span className="font-serif text-3xl tabular-nums">
                {formatPrice(totals.total)}
              </span>
            </div>

            <p className="mt-2.5 text-xs leading-relaxed text-charcoal/55">
              {gstStatement}
              {destination === "australia" && !totals.freeShipping && (
                <>
                  {" "}
                  {formatPrice(totals.remainingForFreeShipping)} more in goods and shipping is free.
                </>
              )}
              {destination !== "australia" && (
                <>
                  {" "}
                  Your country may charge import duty or GST on arrival. That is set and collected
                  by them, not by us, and is not included above.
                </>
              )}
            </p>

            {/* Agreement is an act, not a footer link. A box the customer has
                to find and tick ("clickwrap") is the form Australian courts
                have been willing to enforce; terms merely linked at the bottom
                of a page ("browsewrap") are far weaker, because nothing shows
                the buyer ever saw them. It starts unticked on purpose — a
                pre-ticked box is not consent to anything.

                It sits here rather than in the slide-over bag because this is
                the step where the order is actually committed. */}
            <div className="mt-7 flex items-start gap-3 border-t border-charcoal/12 pt-6">
              <input
                id="accept-terms"
                type="checkbox"
                checked={accepted}
                onChange={(event) => {
                  setAccepted(event.target.checked);
                  if (event.target.checked) setBlocked(false);
                }}
                className="mt-0.5 h-4 w-4 shrink-0 accent-charcoal"
              />
              <label htmlFor="accept-terms" className="text-xs leading-relaxed text-charcoal/70">
                I have read and agree to the{" "}
                <Link href="/terms" className="link-underline">
                  Terms of sale
                </Link>
                ,{" "}
                <Link href="/returns" className="link-underline">
                  Returns &amp; refunds
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="link-underline">
                  Privacy policy
                </Link>
                . My rights under the Australian Consumer Law are not affected by agreeing.
              </label>
            </div>

            {live ? (
              <a
                href={state.status === "ready" ? state.url : "#"}
                onClick={(event) => {
                  if (!accepted) {
                    event.preventDefault();
                    setBlocked(true);
                  }
                }}
                aria-describedby={blocked ? "checkout-blocked" : "checkout-note"}
                className={`mt-6 block rounded-full py-4 text-center text-[0.72rem] uppercase tracking-[0.18em] transition-all duration-500 ease-editorial ${
                  accepted
                    ? "bg-charcoal text-cream hover:-translate-y-0.5"
                    : "bg-charcoal/25 text-cream"
                }`}
              >
                Pay securely — {formatPrice(totals.total)}
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-describedby="checkout-note"
                className="mt-6 w-full cursor-not-allowed rounded-full bg-charcoal py-4 text-[0.72rem] uppercase tracking-[0.18em] text-cream opacity-40"
              >
                {soldOut.size > 0
                  ? "Remove the sold-out item to continue"
                  : state.status === "unmapped"
                    ? "One item cannot be ordered"
                    : "Payments are not live yet"}
              </button>
            )}

            {blocked && !accepted && (
              <p id="checkout-blocked" role="alert" className="mt-3 text-center text-sm text-clay">
                Tick the box to agree to the terms before paying.
              </p>
            )}

            <p id="checkout-note" className="mt-3 text-center text-[0.72rem] leading-relaxed text-charcoal/50">
              {state.status === "ready" &&
                soldOut.size === 0 &&
                `You will be taken to ${paymentProvider.name}'s secure checkout to pay.`}
              {state.status === "ready" &&
                soldOut.size > 0 &&
                "One of these is no longer in stock. Everything else in the bag is fine."}
              {(state.status === "not-configured" || state.status === "no-payment-methods") &&
                "Nothing on this site can take a payment yet. Your bag is saved in this browser."}
              {state.status === "unmapped" &&
                `We cannot send ${state.lines.join(" or ")} to checkout. Remove it, or email us and we will take the order directly.`}
            </p>

            {!live && (
              <p className="mt-4 text-center text-[0.72rem] leading-relaxed text-charcoal/55">
                Want one of these now? Email{" "}
                <a href={`mailto:${site.email}`} className="link-underline">
                  {site.email}
                </a>{" "}
                and we will take the order and invoice you directly.
              </p>
            )}
          </div>

          {/* Security. Three sentences, each of which is either true today or
              not printed. They match the privacy policy word for intent — that
              page is the formal APP 5 / APP 8 disclosure, this is the same
              disclosure where someone actually reads it. */}
          <section className="mt-7 border border-charcoal/12 p-6" aria-labelledby="checkout-security">
            <div className="flex items-center gap-2.5">
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 shrink-0 text-olive"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="7" width="10" height="7" rx="1.2" />
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
              </svg>
              <h2
                id="checkout-security"
                className="text-[0.7rem] uppercase tracking-[0.2em] text-charcoal/50"
              >
                How your payment is handled
              </h2>
            </div>

            <ul className="mt-4 space-y-2.5 text-[0.8rem] leading-relaxed text-charcoal/65">
              <li>{paymentProvider.cardHandling}</li>
              <li>{paymentProvider.transport}</li>
              <li>
                {paymentProvider.dataLocation}{" "}
                <Link href="/privacy" className="link-underline">
                  What we collect and why
                </Link>
                .
              </li>
            </ul>

            <PaymentMethods className="mt-6 border-t border-charcoal/12 pt-6" />
          </section>

          <p className="mt-6 text-[0.78rem] leading-relaxed text-charcoal/55">
            Our goods come with guarantees that cannot be excluded under the Australian Consumer
            Law, and we take change-of-mind returns for {CHANGE_OF_MIND_DAYS} days on top of that.{" "}
            <Link href="/returns" className="link-underline">
              Returns &amp; refunds
            </Link>
            .
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------
          How it gets there, and what happens after the button
          --------------------------------------------------------------- */}
      <div className="lg:col-span-7">
        {/* Delivery. The estimate mounts client-side — see DeliveryEstimate. */}
        <section aria-labelledby="checkout-delivery">
          <h2
            id="checkout-delivery"
            className="text-[0.7rem] uppercase tracking-[0.2em] text-charcoal/45"
          >
            Delivery
          </h2>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-charcoal/70">
            Packed and dispatched from New South Wales within {shippingTerms.dispatchDays} business
            days, in unbleached, plastic-free packaging. Your address is collected on the next
            screen.
          </p>
          <DeliveryEstimate />
          <p className="mt-3 text-xs leading-relaxed text-charcoal/55">
            If an order takes more than {DELIVERY_PROMISE_DAYS} days to arrive we refund the
            shipping — see{" "}
            <Link href="/shipping" className="link-underline">
              shipping &amp; delivery
            </Link>
            .
          </p>
        </section>

        {/* The handover, described before it happens. A customer who is not
            expecting the domain to change reads it as having been redirected
            somewhere they did not choose, and that is when people abandon. */}
        <section className="mt-12" aria-labelledby="checkout-steps">
          <h2
            id="checkout-steps"
            className="text-[0.7rem] uppercase tracking-[0.2em] text-charcoal/45"
          >
            What happens next
          </h2>
          <ol className="mt-6 space-y-5">
            {[
              {
                title: "You check this page",
                body: "Everything above is what we will pack, at the price you will pay. Nothing has been charged and nothing is held.",
              },
              {
                title: `You pay on ${paymentProvider.name}'s checkout`,
                body: `The button hands you to ${paymentProvider.name}, where you enter your address and payment details. The name in the address bar changes, and that is meant to happen — it is why we never see a card number.`,
              },
              {
                title: "We pack it and send you tracking",
                body: `You get an order confirmation by email straight away, then a dispatch notice with a tracking number within ${shippingTerms.dispatchDays} business days.`,
              },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-5">
                <span className="mt-0.5 shrink-0 font-serif text-lg tabular-nums text-charcoal/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-base">{step.title}</h3>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-charcoal/65">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* ---------------------------------------------------------------
          Store setup. Renders only while checkout cannot take money, and
          disappears on its own the moment it can — there is no flag to
          remember to turn off.
          --------------------------------------------------------------- */}
      {!live && (
        <section
          className="border border-dashed border-charcoal/25 p-7 lg:col-span-12"
          aria-labelledby="checkout-setup"
        >
          <h2 id="checkout-setup" className="font-serif text-lg">
            Store setup — what is connected
          </h2>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-charcoal/55">
            The first three are what stand between this button and a payment. This panel is only
            rendered while checkout cannot take money, so it removes itself.
          </p>

          <ul className="mt-6 space-y-4">
            {[
              {
                done: Boolean(process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN),
                title: "A checkout to hand off to",
                body: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
                  ? `Set to ${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}.`
                  : "Set NEXT_PUBLIC_SHOPIFY_DOMAIN to the store's myshopify.com domain (or a custom checkout domain).",
              },
              {
                done: anyPaymentMethodEnabled(),
                title: "A payment method that works",
                body: anyPaymentMethodEnabled()
                  ? "At least one method in data/payments.ts is enabled."
                  : "Activate Shopify Payments — it needs bank details and ID — then set that method to enabled: true in data/payments.ts. Nothing is claimed on the site until you do.",
              },
              {
                done: coverage.missing.length === 0,
                title: `Every configuration mapped to a variant — ${coverage.mapped}/${coverage.total}`,
                body:
                  coverage.missing.length === 0
                    ? "Every combination this site can put in a bag has a Shopify variant behind it."
                    : `No variant for: ${coverage.missing.slice(0, 6).join("; ")}${coverage.missing.length > 6 ? `, and ${coverage.missing.length - 6} more` : ""}. Add them in Shopify and record the IDs in data/variants.ts.`,
              },
              {
                done: stock !== null,
                title: "Live prices and stock",
                body:
                  stock !== null
                    ? `Reading from Shopify. Last checked ${new Date(stock.fetchedAt).toLocaleString("en-AU")}.`
                    : "Not connected — prices and availability come from data/products.ts. Create a Storefront API token in Shopify admin and set SHOPIFY_STOREFRONT_TOKEN. Checkout works without this; what it buys you is that a sold-out colour stops being sellable here.",
              },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.6rem] ${
                    item.done ? "bg-olive text-cream" : "border border-charcoal/30 text-charcoal/40"
                  }`}
                >
                  {item.done ? "✓" : ""}
                </span>
                <div>
                  <h3 className="text-[0.85rem] font-medium">
                    {item.title}
                    <span className="sr-only">{item.done ? " — done" : " — outstanding"}</span>
                  </h3>
                  <p className="mt-1 text-[0.82rem] leading-relaxed text-charcoal/60">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
