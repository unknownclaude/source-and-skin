/**
 * What the checkout accepts, and who processes it.
 *
 * This file is a set of representations to the customer, not decoration. Under
 * section 18 and section 29(1)(m) of the Australian Consumer Law, showing a
 * payment mark for a method that cannot actually be used at the checkout is a
 * misleading representation about the availability of a service — and it is
 * made at the exact moment someone decides whether to buy, which is what makes
 * it matter rather than being a technicality.
 *
 * So the rule for editing this file is one line long:
 *
 *   Turn `enabled` on the day the method works at checkout. Not before.
 *
 * Every method is off today because payments are not activated. The site says
 * so in as many words rather than showing a row of card logos it cannot honour
 * — see `components/PaymentMethods.tsx`, which renders this list as a labelled
 * preview while nothing is live and as a plain accepted-here row once
 * something is.
 */

export type PaymentMethod = {
  id: string;
  /** What the customer calls it. */
  label: string;
  /** Who has to be set up before `enabled` can be true. */
  requires: string;
  /**
   * True only when a customer can complete a payment with it today.
   * See the rule above.
   */
  enabled: boolean;
};

/**
 * Ordered by how Australian shoppers actually pay: cards first, then the
 * wallets that skip typing a card number on a phone, then the rest.
 *
 * Deliberately absent: buy-now-pay-later. Afterpay and Zip are credit, and
 * since the Treasury Laws Amendment (Responsible Buy Now Pay Later and Other
 * Measures) Act 2024 they sit inside the National Credit Code — the provider
 * carries the licence, but the merchant carries the advertising. Offering it
 * would mean getting the disclosure right rather than dropping a badge in a
 * row, and it is not a thing to switch on casually on a $27 order.
 */
export const paymentMethods: PaymentMethod[] = [
  { id: "visa", label: "Visa", requires: "Shopify Payments", enabled: false },
  { id: "mastercard", label: "Mastercard", requires: "Shopify Payments", enabled: false },
  { id: "amex", label: "American Express", requires: "Shopify Payments", enabled: false },
  { id: "apple-pay", label: "Apple Pay", requires: "Shopify Payments", enabled: false },
  { id: "google-pay", label: "Google Pay", requires: "Shopify Payments", enabled: false },
  { id: "shop-pay", label: "Shop Pay", requires: "Shopify Payments", enabled: false },
  { id: "paypal", label: "PayPal", requires: "a PayPal business account", enabled: false },
];

export const enabledPaymentMethods = (): PaymentMethod[] =>
  paymentMethods.filter((method) => method.enabled);

/** True once at least one method can actually take money. */
export const anyPaymentMethodEnabled = (): boolean => paymentMethods.some((m) => m.enabled);

/**
 * The processor, described once.
 *
 * These three sentences appear beside the pay button, and they have to match
 * what the privacy policy says under "Who we share it with" and "Sending
 * information overseas" — the policy is the formal disclosure required by
 * APP 5 and APP 8, and this is the same disclosure where someone will actually
 * read it. Change one and change the other.
 */
export const paymentProvider = {
  name: "Shopify",
  /** Plain-language statement of who handles the card number. */
  cardHandling:
    "Card details are entered on Shopify's checkout, not on this site. We never see, receive or store a card number.",
  /** Plain-language statement of where the data goes. Mirrors the privacy policy. */
  dataLocation:
    "Shopify is a Canadian company and stores order data in Canada, the United States and the European Union.",
  /** What the customer's browser is protected by in transit. */
  transport: "Every page here and the checkout itself run over an encrypted HTTPS connection.",
} as const;
