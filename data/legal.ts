/**
 * Legal pages, written against Australian Consumer Law.
 *
 * ⚠️  NOT LEGAL ADVICE. This was drafted to reflect the ACL (Schedule 2 of the
 * Competition and Consumer Act 2010 (Cth)) and related Commonwealth law, and it
 * needs review by an Australian lawyer before the store takes its first order.
 * The consequences of getting a returns policy wrong here are regulatory, not
 * cosmetic — the ACCC treats misrepresenting consumer rights as a breach in its
 * own right.
 *
 * Two things must never be edited out:
 *
 *   1. The consumer guarantees statement in `returns`. Consumer guarantees
 *      cannot be excluded, restricted or modified by contract (ACL s 64).
 *      Wording that implies otherwise — "no refunds", "exchange only", "sale
 *      items final" — is itself a breach, regardless of whether anyone relies
 *      on it.
 *   2. The distinction between a change-of-mind return (a courtesy this
 *      business chooses to offer, which may carry conditions) and a consumer
 *      guarantee claim (a legal right, which may not).
 *
 * TODO(business): every {{PLACEHOLDER}} below needs the real value before
 * launch. An ABN in particular is relied on by both Shopify onboarding and the
 * terms of sale.
 */

import { site } from "./site";

export type LegalSection = {
  heading: string;
  /** Each string is a paragraph. */
  body?: string[];
  /** Rendered as a bulleted list beneath the paragraphs. */
  list?: string[];
  /** Set the section apart — used for rights that cannot be contracted away. */
  emphasis?: boolean;
};

export type LegalDocument = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  standfirst: string;
  updated: string;
  sections: LegalSection[];
};

/**
 * Trading identity.
 *
 * `abn` is null because the business does not hold one. Two practical
 * consequences worth re-checking with the lawyer before launch: GST cannot be
 * registered for without an ABN, and payment platforms generally ask for one
 * during merchant onboarding. Set it here and the terms page picks it up.
 */
export const businessDetails = {
  legalName: "Source and Skin",
  abn: null as string | null,
  address: "{{REGISTERED BUSINESS ADDRESS}}",
  email: site.email,
  state: "New South Wales",
};

const UPDATED = "4 September 2026";

/** Free shipping if delivery runs past this. An express warranty under ACL s 59. */
export const DELIVERY_PROMISE_DAYS = 30;

export const shipping: LegalDocument = {
  slug: "shipping",
  title: "Shipping & delivery",
  metaTitle: "Shipping & Delivery",
  metaDescription:
    "Dispatch times, delivery estimates, costs, and our promise to refund shipping on any order that takes longer than 30 days to arrive.",
  standfirst:
    "Where we send things, how long they take, and what happens when they take longer than they should.",
  updated: UPDATED,
  sections: [
    {
      heading: "Dispatch",
      body: [
        "Orders are packed and dispatched within two business days. Orders placed on a weekend or a public holiday are dispatched on the next business day. You will receive a dispatch notice with tracking as soon as your parcel leaves us.",
        "Everything ships in unbleached board and paper. No plastic tape, no window, no filler.",
      ],
    },
    {
      heading: "Where we ship",
      body: [
        "We ship anywhere in Australia, and internationally to most destinations. Delivery estimates below are from the date of dispatch, not the date you order, and they are estimates rather than guarantees — once a parcel is with the carrier its progress is outside our control.",
      ],
      list: [
        "Metropolitan Australia — 2 to 6 business days",
        "Regional and remote Australia — 4 to 12 business days",
        "New Zealand — 6 to 12 business days",
        "Rest of world — 10 to 25 business days",
      ],
    },
    {
      heading: "Cost",
      body: [
        "Standard shipping is free on Australian orders over $45. Below that it is a flat $9.95. Express shipping and international rates are calculated at checkout against your address, and shown in full before you pay.",
        "International orders may attract customs duties, import taxes or handling fees charged by the destination country. Those are set by that country, are not collected by us, and are the recipient's responsibility.",
      ],
    },
    {
      heading: "If your order takes more than 30 days",
      emphasis: true,
      body: [
        "If your parcel has not arrived within 30 days of dispatch, we will refund your shipping in full. You do not need to ask, argue, or prove anything — write to us with your order number and we will process it.",
        "This is a promise we are choosing to make, and it is an express warranty we are bound by. It sits on top of your rights under the Australian Consumer Law, and takes nothing away from them. If a delay means the goods are no longer of any use to you, you may have a right to cancel and be refunded in full — the shipping refund is not offered in place of that.",
      ],
    },
    {
      heading: "Lost, delayed, and damaged parcels",
      body: [
        "If tracking has not moved for seven days, or a parcel arrives damaged, write to us. We will chase the carrier, and where a parcel is lost or arrives unusable we will replace or refund it. We do not ask you to pursue the carrier yourself; our contract is with you.",
      ],
    },
    {
      heading: "Wrong address",
      body: [
        "We ship to the address you give us at checkout. If it is wrong, tell us before dispatch and we will correct it at no cost. Once a parcel has been dispatched to an incorrect address we cannot recall it, and the cost of reshipping is yours — though we will always try to help.",
      ],
    },
  ],
};

export const returns: LegalDocument = {
  slug: "returns",
  title: "Returns & refunds",
  metaTitle: "Returns & Refunds",
  metaDescription:
    "Your consumer guarantees under Australian Consumer Law, our 30-day change-of-mind policy, and how to make a claim.",
  standfirst:
    "Your rights under Australian Consumer Law come first. Our own returns policy sits on top of them and takes nothing away.",
  updated: UPDATED,
  sections: [
    {
      heading: "Your consumer guarantees",
      emphasis: true,
      body: [
        "Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. Nothing on this page, in our terms, or said by us limits those guarantees in any way.",
        "You are entitled to a replacement or refund for a major failure, and to compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if they fail to be of acceptable quality and the failure does not amount to a major failure.",
      ],
      list: [
        "A major failure is one where you would not have bought the item had you known about the problem, or the item is significantly different from its description, or is substantially unfit for its ordinary purpose and cannot easily be made fit, or is unsafe. Where the failure is major, the choice of a refund, a replacement, or compensation for the drop in value is yours, not ours.",
        "Where the failure is minor, we may choose to repair, replace, or refund. We will tell you which, and why.",
        "These rights apply regardless of any warranty period, and are not affected by a change-of-mind policy, a sale price, or how long ago you bought.",
      ],
    },
    {
      heading: "Change of mind",
      body: [
        "Separately from your consumer guarantees, and entirely voluntarily, we accept change-of-mind returns within 30 days of delivery. This is a courtesy rather than a legal right, so it carries conditions that a consumer guarantee claim does not.",
      ],
      list: [
        "The item must be unused and in its original, unopened packaging.",
        "Return postage for a change-of-mind return is yours to pay. We recommend a tracked service, since we can only refund what reaches us.",
        "We refund to the original payment method within five business days of receiving the return.",
        "For hygiene reasons we cannot accept a change-of-mind return on an opened miswak sleeve or a used net sponge. This exclusion applies only to change-of-mind returns. It does not apply, and we do not apply it, where an item is faulty, not as described, or otherwise fails a consumer guarantee.",
      ],
    },
    {
      heading: "If something is wrong with your order",
      body: [
        "Write to us at " +
          site.email +
          " with your order number and, where it helps, a photograph. You do not need to return an item before we assess a claim, and you will not be charged return postage on a faulty item.",
        "We aim to respond within two business days. If we accept a consumer guarantee claim we will cover the cost of returning the item, and where a repair is not practical for goods of this kind — which, for a sponge or a cut root, it generally is not — we will replace or refund.",
      ],
    },
    {
      heading: "What we will not do",
      body: [
        "We will not tell you that a sale item cannot be returned, that store credit is your only option, or that a consumer guarantee has expired because a period we invented has passed. Those statements are unlawful in Australia, and we would rather you knew that than took our word for anything.",
      ],
    },
    {
      heading: "If you are not satisfied",
      body: [
        "If we cannot resolve a complaint between us, you can contact the Australian Competition and Consumer Commission, or the consumer affairs or fair trading body in your state or territory. Doing so does not affect any other right you have.",
      ],
    },
  ],
};

export const privacy: LegalDocument = {
  slug: "privacy",
  title: "Privacy",
  metaTitle: "Privacy Policy",
  metaDescription:
    "What personal information Source and Skin collects, why, who it is shared with, and how to access or correct it.",
  standfirst:
    "What we collect, why we collect it, and how to get it back or have it deleted.",
  updated: UPDATED,
  sections: [
    {
      heading: "What we collect",
      body: [
        "We collect only what an order or an enquiry actually requires.",
      ],
      list: [
        "Order information — your name, delivery address, email address, and phone number where you give one.",
        "Payment information — handled entirely by our payment provider. We never see or store your full card number.",
        "Correspondence — what you write to us, so we can answer it.",
        "Newsletter subscription — your email address, and only if you give it.",
        "Site usage — aggregate, non-identifying information about which pages are visited.",
      ],
    },
    {
      heading: "Why we collect it",
      body: [
        "To take payment, pack a parcel, get it to you, answer your questions, and — if you asked for it — send you an occasional email. We do not sell personal information, and we do not disclose it for anyone else's marketing.",
      ],
    },
    {
      heading: "Who we share it with",
      body: [
        "Only the parties needed to complete your order: our payment provider, our shipping carrier, and the platform that hosts this store. Each receives the minimum required to do its part.",
        "Some of these providers store or process information outside Australia. Where that happens we take reasonable steps to ensure they handle your information consistently with the Australian Privacy Principles.",
      ],
    },
    {
      heading: "Marketing email",
      body: [
        "We send marketing email only to people who asked for it. Every message identifies us and carries a working unsubscribe link, which we action promptly. This is what the Spam Act 2003 (Cth) requires, and it is also simply how we would want to be treated.",
      ],
    },
    {
      heading: "Cookies and analytics",
      body: [
        "This site uses cookies necessary for the shop to work — remembering what is in your cart, and keeping you signed in through checkout. We may also use privacy-respecting analytics to understand which pages are read.",
        "Australia does not require a cookie consent banner in the way the European Union does, but if you are visiting from the EU or the UK we will ask for consent before setting any non-essential cookie, and you can decline without losing the ability to shop.",
      ],
    },
    {
      heading: "Access, correction, and deletion",
      body: [
        "You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it. Write to " +
          site.email +
          " and we will respond within 30 days. There is no charge.",
        "We may need to keep some order records for as long as tax and business records law requires, even after a deletion request. If that applies we will tell you what we are keeping and why.",
      ],
    },
    {
      heading: "Complaints",
      body: [
        "If you think we have mishandled your personal information, tell us first — we would rather fix it. If you are not satisfied with our response you can complain to the Office of the Australian Information Commissioner at oaic.gov.au.",
      ],
    },
    {
      heading: "A note on scale",
      body: [
        "Businesses under a certain annual turnover are not always bound by the Privacy Act 1988 (Cth). We have written and follow this policy regardless of whether that exemption currently applies to us, because the exemption describes what we are permitted to do rather than what we think is right.",
      ],
    },
  ],
};

export const terms: LegalDocument = {
  slug: "terms",
  title: "Terms of sale",
  metaTitle: "Terms of Sale",
  metaDescription:
    "The terms on which Source and Skin sells goods, including prices, orders, delivery, and your rights under Australian Consumer Law.",
  standfirst:
    "The terms you are agreeing to when you order. Written to be read, not to be survived.",
  updated: UPDATED,
  sections: [
    {
      heading: "Who you are dealing with",
      body: [
        `This store is operated by ${businessDetails.legalName}${
          businessDetails.abn ? `, ABN ${businessDetails.abn},` : ","
        } of ${businessDetails.address}. You can reach us at ${businessDetails.email}.`,
      ],
    },
    {
      heading: "Prices",
      body: [
        "Prices are shown in Australian dollars (AUD) and are inclusive of GST where GST applies to the sale. Shipping is shown separately and calculated at checkout before you pay.",
        "We may change prices at any time, but never after you have placed an order. The price you paid is the price.",
      ],
    },
    {
      heading: "Orders",
      body: [
        "Placing an order is an offer to buy. Our acceptance happens when we dispatch the goods, not when you receive an order confirmation.",
        "Occasionally we may be unable to accept an order — an item sells out between your order and our packing bench, or an address is undeliverable. If that happens we will tell you promptly and refund you in full. We will not substitute a different item without asking you first.",
      ],
    },
    {
      heading: "Payment",
      body: [
        "Payment is taken at checkout through our payment provider. We do not store your card details.",
      ],
    },
    {
      heading: "Delivery",
      body: [
        "Dispatch times, delivery estimates, and costs are set out on our shipping page, which forms part of these terms. That page also carries our promise to refund shipping on any order that takes more than 30 days to arrive.",
      ],
    },
    {
      heading: "Your rights under Australian Consumer Law",
      emphasis: true,
      body: [
        "Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. Nothing in these terms excludes, restricts or modifies those guarantees, and any part of these terms that purported to do so would have no effect to that extent.",
        "Where we are permitted to limit our liability, and to the extent the law allows it, our liability for a failure to comply with a consumer guarantee is limited to replacing the goods, supplying equivalent goods, or refunding the price. This limitation does not apply where it would be unfair or unreasonable for us to rely on it, and it does not affect your rights in respect of a major failure.",
      ],
    },
    {
      heading: "Using this site",
      body: [
        "The text, photographs and design on this site belong to us. You are welcome to link to it, quote it with attribution, and share it. You may not reproduce it commercially or present it as your own.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        `These terms are governed by the law of ${businessDetails.state}, Australia. Nothing in this clause prevents you from bringing a claim in the courts or tribunals of the state or territory where you live.`,
      ],
    },
    {
      heading: "Changes",
      body: [
        "We may update these terms. The version that applies to your order is the one published when you placed it, and the date at the top of this page tells you when it last changed.",
      ],
    },
  ],
};

export const legalDocuments: LegalDocument[] = [shipping, returns, privacy, terms];

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.slug === slug);
}
