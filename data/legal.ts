/**
 * Legal pages, written against Australian law for a business trading from NSW.
 *
 * ⚠️  NOT LEGAL ADVICE. This was drafted to reflect the instruments listed
 * below and it needs review by an Australian lawyer before the store takes its
 * first order. The consequences of getting a returns policy or a privacy
 * statement wrong are regulatory, not cosmetic — the ACCC treats
 * misrepresenting consumer rights as a breach in its own right, and the OAIC
 * treats an inaccurate privacy policy as a breach of APP 1.
 *
 * Instruments this content is written against:
 *   - Australian Consumer Law (Schedule 2, Competition and Consumer Act 2010
 *     (Cth)) — consumer guarantees, misleading conduct, unfair contract terms,
 *     single pricing.
 *   - Competition and Consumer Regulations 2010 (Cth) reg 90 — the prescribed
 *     wording reproduced in `CONSUMER_GUARANTEES_TEXT`.
 *   - Privacy Act 1988 (Cth) and the Australian Privacy Principles, including
 *     the Notifiable Data Breaches scheme in Part IIIC.
 *   - Spam Act 2003 (Cth) — consent, sender identification, unsubscribe.
 *   - Electronic Transactions Act 1999 (Cth) and Electronic Transactions Act
 *     2000 (NSW) — when an electronic contract is formed.
 *   - Fair Trading Act 1987 (NSW) — NSW Fair Trading administers the ACL here.
 *   - Disability Discrimination Act 1992 (Cth) — the accessibility statement.
 *   - A New Tax System (Goods and Services Tax) Act 1999 (Cth) — the GST
 *     position in `businessDetails.gstRegistered`.
 *
 * Four things must never be edited out:
 *
 *   1. `CONSUMER_GUARANTEES_TEXT`. It is reproduced word for word from the
 *      regulation. Paraphrasing it is how a compliant statement becomes a
 *      non-compliant one — do not "improve" the wording.
 *   2. The distinction between a change-of-mind return (a courtesy this
 *      business chooses to offer, which may carry conditions) and a consumer
 *      guarantee claim (a legal right, which may not). Consumer guarantees
 *      cannot be excluded, restricted or modified by contract (ACL s 64), and
 *      wording that implies otherwise — "no refunds", "exchange only", "sale
 *      items final" — is itself a breach whether or not anyone relies on it.
 *   3. The GST statement. Charging or implying GST while unregistered is both
 *      a misleading representation and a tax problem; see `gstRegistered`.
 *   4. The cross-border disclosure list in the privacy policy. APP 8 requires
 *      customers to be told that their information goes overseas and where.
 *
 * Trading identity lives in `businessDetails` below. Fields the business does
 * not hold are null, and every clause that would use one is composed to read
 * correctly without it — so there are no placeholders to leak onto a live page.
 */

import { shippingTerms, site } from "./site";

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
 * `abn`, `address` and `phone` are all null, and every clause that would use
 * them is composed to read correctly without them rather than rendering a gap.
 * Set any of them here and the pages pick it up.
 *
 * On the ABN: GST cannot be registered for without one, and payment platforms
 * generally ask for one during merchant onboarding.
 *
 * On the address: this is an online-only business with no premises, and there
 * is no general requirement for an Australian online store to publish a street
 * address on its website. What IS required is a working way to reach the
 * trader, which the email address provides. A return address is given when a
 * return is authorised, so a returning customer always has one.
 *
 * On the phone: not required for an online store that answers by email, but it
 * IS required by reg 90 for anyone who publishes a warranty against defects.
 * This store deliberately publishes no such warranty — see `returns`.
 */
export const businessDetails = {
  legalName: "Source and Skin",
  abn: null as string | null,
  /** Street address, if the business ever publishes one. Null = online only. */
  address: null as string | null,
  /** Published contact phone number. Null = email only. */
  phone: null as string | null,
  email: site.email,
  state: "New South Wales",
  /**
   * GST registration.
   *
   * Registration is compulsory at $75,000 turnover in any 12-month period and
   * optional below it. While this is false the store must NOT charge GST, must
   * not describe prices as "GST inclusive", and cannot issue a tax invoice —
   * doing any of those while unregistered is a misleading representation under
   * ACL s 29 as well as a problem with the ATO. Flip this to true on the day
   * registration takes effect, not before, and re-read `terms` → "Prices".
   */
  gstRegistered: false,
  /** Turnover at which GST registration becomes compulsory, in AUD. */
  gstThreshold: 75000,
};

const UPDATED = "19 September 2026";

/** Free shipping if delivery runs past this. An express warranty under ACL s 59. */
export const DELIVERY_PROMISE_DAYS = 30;

/** Days a change-of-mind return stays open. A courtesy, not a legal right. */
export const CHANGE_OF_MIND_DAYS = 30;

/**
 * The consumer guarantees statement, reproduced word for word.
 *
 * This is the wording prescribed by reg 90 of the Competition and Consumer
 * Regulations 2010 (Cth) for goods. It is quoted rather than paraphrased on
 * purpose: the prescribed form is what makes the statement compliant, and an
 * improved version of it is a non-compliant version of it. Reuse this constant
 * everywhere the statement appears so the two copies cannot drift.
 */
export const CONSUMER_GUARANTEES_TEXT =
  "Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable quality and the failure does not amount to a major failure.";

/** One-line GST position, used in the cart, the terms and the FAQ. */
export const gstStatement = businessDetails.gstRegistered
  ? "All prices are in Australian dollars and include GST."
  : `All prices are in Australian dollars. ${businessDetails.legalName} is not registered for GST, so no GST is charged on your order and no tax invoice is issued.`;

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
        `Orders are packed and dispatched within ${shippingTerms.dispatchDays} business days. Orders placed on a weekend or a public holiday are dispatched on the next business day. You will receive a dispatch notice with tracking as soon as your parcel leaves us.`,
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
        `Standard shipping is free on Australian orders over $${shippingTerms.freeThreshold}. Below that it is a flat $${shippingTerms.flatRate}. Express shipping and international rates are calculated at checkout against your address, and shown in full before you pay.`,
        gstStatement,
        "International orders may attract customs duties, import taxes or handling fees charged by the destination country. Those are set by that country, are not collected by us, and are the recipient's responsibility.",
      ],
    },
    {
      heading: `If your order takes more than ${DELIVERY_PROMISE_DAYS} days`,
      emphasis: true,
      body: [
        `If your parcel has not arrived within ${DELIVERY_PROMISE_DAYS} days of dispatch, we will refund your shipping in full. You do not need to ask, argue, or prove anything — write to us with your order number and we will process it.`,
        "This is a promise we are choosing to make, and it is an express warranty we are bound by under section 59 of the Australian Consumer Law. It sits on top of your rights under that law and takes nothing away from them. If a delay means the goods are no longer of any use to you, you may have a right to cancel and be refunded in full — the shipping refund is not offered in place of that.",
      ],
    },
    {
      heading: "Lost, delayed, and damaged parcels",
      body: [
        "If tracking has not moved for seven days, or a parcel arrives damaged, write to us. We will chase the carrier, and where a parcel is lost or arrives unusable we will replace or refund it. We do not ask you to pursue the carrier yourself; our contract is with you, and the risk of loss in transit is ours until the goods reach you.",
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
        CONSUMER_GUARANTEES_TEXT,
        "That statement is reproduced word for word from the Australian Consumer Law. Nothing on this page, in our terms of sale, or said by us in an email limits it. Section 64 of that law makes any term that tried to exclude, restrict or modify a consumer guarantee void to that extent — so even if we wrote one, it would not work.",
      ],
      list: [
        "A major failure is one where you would not have bought the item had you known about the problem, or the item is significantly different from its description, or is substantially unfit for its ordinary purpose and cannot easily be made fit, or is unsafe. Where the failure is major, the choice of a refund, a replacement, or compensation for the drop in value is yours, not ours.",
        "Where the failure is minor, we may choose to repair, replace, or refund. We will tell you which, and why.",
        "These rights apply regardless of any warranty period, and are not affected by a change-of-mind policy, a sale price, or how long ago you bought. There is no fixed expiry: a guarantee lasts as long as is reasonable for goods of that kind and price.",
        "You do not need the original packaging to make a consumer guarantee claim, and you do not need a receipt if you can show proof of purchase some other way — a bank statement, an order confirmation email, or our own record of your order.",
      ],
    },
    {
      heading: "We do not give a separate warranty against defects",
      body: [
        "Some businesses publish a manufacturer's warranty on top of the consumer guarantees. We do not, and we want to be plain about why rather than leave you wondering what is missing.",
        "A warranty against defects is a promise to repair or replace for a set period. Ours would be shorter and narrower than the protection the law already gives you on a $22 sponge, so it would add nothing except the impression that your rights end when it does. The consumer guarantees above are your protection, and they are stronger.",
        `The one promise we do add is on the shipping page: if a parcel takes more than ${DELIVERY_PROMISE_DAYS} days to arrive, we refund the shipping.`,
      ],
    },
    {
      heading: "Change of mind",
      body: [
        `Separately from your consumer guarantees, and entirely voluntarily, we accept change-of-mind returns within ${CHANGE_OF_MIND_DAYS} days of delivery. This is a courtesy rather than a legal right, so it carries conditions that a consumer guarantee claim does not.`,
      ],
      list: [
        "The item must be unused and in its original, unopened packaging.",
        "Write to us before sending anything back. We are an online business without a shopfront, so we will give you the return address when we authorise the return — a parcel sent to an address you found somewhere else may not reach us.",
        "Return postage for a change-of-mind return is yours to pay. We recommend a tracked service, since we can only refund what reaches us.",
        "We refund to the original payment method within five business days of receiving the return.",
        "For hygiene reasons we cannot accept a change-of-mind return on an opened miswak sleeve or a used net sponge. This exclusion applies only to change-of-mind returns. It does not apply, and we do not apply it, where an item is faulty, not as described, or otherwise fails a consumer guarantee.",
        "A bundle is returned as a bundle. We cannot take back one sponge from The Season and refund part of it, because the price you paid was the bundle price.",
      ],
    },
    {
      heading: "If something is wrong with your order",
      body: [
        `Write to us at ${site.email} with your order number and, where it helps, a photograph. You do not need to return an item before we assess a claim, and you will not be charged return postage on a faulty item.`,
        "We aim to respond within two business days. If we accept a consumer guarantee claim we will cover the cost of returning the item, and where a repair is not practical for goods of this kind — which, for a sponge or a cut root, it generally is not — we will replace or refund.",
        "If the wrong colour or the wrong configuration arrives, that is a failure to match the description you ordered against. Tell us and we will send the right one and cover the postage both ways.",
      ],
    },
    {
      heading: "What we will not do",
      body: [
        "We will not tell you that a sale item cannot be returned, that store credit is your only option, that you must return an item in its original packaging to claim a consumer guarantee, or that a guarantee has expired because a period we invented has passed. Each of those statements is unlawful in Australia, and we would rather you knew that than took our word for anything.",
      ],
    },
    {
      heading: "If you are not satisfied",
      body: [
        "If we cannot resolve a complaint between us, you can take it further at no cost. Nothing about doing so affects any other right you have, and we will not treat it as a reason to stop dealing with you.",
      ],
      list: [
        "NSW Fair Trading — the state body that administers the Australian Consumer Law where we trade. fairtrading.nsw.gov.au, or 13 32 20.",
        "The consumer affairs or fair trading body in your own state or territory, if you are not in NSW.",
        "The Australian Competition and Consumer Commission — accc.gov.au.",
        "The NSW Civil and Administrative Tribunal hears consumer claims, and you do not need a lawyer to bring one.",
      ],
    },
  ],
};

export const privacy: LegalDocument = {
  slug: "privacy",
  title: "Privacy",
  metaTitle: "Privacy Policy",
  metaDescription:
    "What personal information Source and Skin collects, why, who it is shared with, where it goes overseas, and how to access, correct or delete it.",
  standfirst:
    "What we collect, why we collect it, where it goes, and how to get it back or have it deleted.",
  updated: UPDATED,
  sections: [
    {
      heading: "Who this policy is from",
      body: [
        `${businessDetails.legalName} is an online-only business trading from ${businessDetails.state}, Australia. This policy explains how we handle personal information, and it is written to meet Australian Privacy Principle 1 — which requires a clearly expressed, up-to-date policy and a way to complain about it.`,
        `You can reach us about anything on this page at ${businessDetails.email}.`,
      ],
    },
    {
      heading: "What we collect",
      body: ["We collect only what an order or an enquiry actually requires."],
      list: [
        "Order information — your name, delivery address, email address, and phone number where you give one.",
        "Payment information — handled entirely by our payment provider. Card numbers are entered on their systems, not ours. We never see or store a full card number.",
        "Correspondence — what you write to us, so we can answer it.",
        "Newsletter subscription — your email address, and only if you asked for it.",
        "Technical information your browser sends with every request, such as your IP address, which our host records in ordinary server logs.",
      ],
    },
    {
      heading: "Why we collect it",
      body: [
        "To take payment, pack a parcel, get it to you, answer your questions, meet our tax and business record-keeping obligations, and — if you asked for it — send you an occasional email.",
        "We do not sell personal information. We do not disclose it for anyone else's marketing. We do not use it to build a profile of you, and we do not make automated decisions about you.",
        "If we ever want to use your information for something not described here, we will ask you first.",
      ],
    },
    {
      heading: "Who we share it with, and where they are",
      emphasis: true,
      body: [
        "Only the parties needed to complete your order, and each receives the minimum required to do its part. Some of them store or process personal information outside Australia, which Australian Privacy Principle 8 requires us to tell you about plainly.",
      ],
      list: [
        "Our e-commerce platform, Shopify, which hosts the store and processes orders. Shopify is a Canadian company and stores data in Canada, the United States and the European Union.",
        "Our payment provider, which processes your card payment. Payment processing for Australian merchants generally involves servers in Australia and the United States.",
        "Our shipping carriers, who receive your name, delivery address and phone number in order to deliver the parcel. For Australian orders that is a domestic carrier; for international orders it is also the carrier in the destination country.",
        "Our email provider, if you are on the newsletter list, which may store subscriber addresses in the United States.",
        "Professional advisers, or a government agency or court, where the law requires us to disclose something. We will tell you if that happens unless we are prohibited from doing so.",
      ],
    },
    {
      heading: "Marketing email",
      body: [
        "We send marketing email only to people who have given us their address for that purpose, and we ask for that consent separately from any purchase — subscribing is never a condition of buying, and buying does not subscribe you.",
        `Every message identifies ${businessDetails.legalName} as the sender, gives a working way to contact us, and carries an unsubscribe link. We action unsubscribe requests within five working days, which is the limit the Spam Act 2003 (Cth) sets, and usually within one.`,
        "Transactional email — an order confirmation, a dispatch notice, a reply to your question — is not marketing and is sent whether or not you are on the list. You cannot unsubscribe from being told your parcel has shipped.",
      ],
    },
    {
      heading: "Cookies and analytics",
      body: [
        "This site currently sets no advertising cookies, no tracking pixels and no third-party analytics. What it stores in your browser is your shopping bag, kept in local storage so a refresh does not empty it. That never leaves your device and we cannot read it.",
        "Checkout is handled by our payment platform, which sets the cookies it needs to hold your session and process the payment.",
        "If we add analytics we will update this section before it goes live, not after. Australia does not require a cookie consent banner the way the European Union does, but if you are visiting from the EU or the UK we will ask before setting any non-essential cookie, and declining will not stop you shopping.",
      ],
    },
    {
      heading: "How we keep it, and for how long",
      body: [
        "We keep personal information only as long as we need it. Order records are held for seven years because tax law requires it. Correspondence is kept while it is useful to answer follow-up questions and deleted after that. A newsletter address is kept until you unsubscribe.",
        "We take reasonable steps to protect what we hold — the store runs over HTTPS, access is limited to the people who need it, and we do not keep card numbers at all, which is the single most effective security measure available to a business this size.",
      ],
    },
    {
      heading: "If there is a data breach",
      body: [
        "If personal information we hold is lost or accessed without authorisation, and that is likely to result in serious harm to you, we will notify you and the Office of the Australian Information Commissioner as soon as practicable. That is what the Notifiable Data Breaches scheme in Part IIIC of the Privacy Act 1988 (Cth) requires, and we will follow it regardless of whether the scheme currently binds a business our size.",
        "We will tell you what happened, what information was involved, and what you can do about it. We will not wait to find out whether we were required to tell you.",
      ],
    },
    {
      heading: "Access, correction, and deletion",
      body: [
        `You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it. Write to ${site.email} and we will respond within 30 days. There is no charge, and we will not ask you why.`,
        "We may need to keep some order records for as long as tax and business records law requires, even after a deletion request. If that applies we will tell you exactly what we are keeping and why, and delete everything else.",
      ],
    },
    {
      heading: "Complaints",
      body: [
        "If you think we have mishandled your personal information, tell us first — we would rather fix it, and we will respond within 30 days.",
        "If you are not satisfied with our response you can complain to the Office of the Australian Information Commissioner at oaic.gov.au, or on 1300 363 992. You do not need our permission and it costs nothing.",
      ],
    },
    {
      heading: "A note on scale",
      body: [
        "The Privacy Act 1988 (Cth) does not bind every Australian business. Businesses under an annual turnover threshold are outside parts of it unless an exception applies, and a store this size may well sit below that line today.",
        "We have written and follow this policy regardless. The exemption describes what a small business is permitted to do, not what we think is right, and it stops applying the moment we grow past it — at which point we would rather already be compliant than scrambling to become so.",
      ],
    },
  ],
};

export const terms: LegalDocument = {
  slug: "terms",
  title: "Terms of sale",
  metaTitle: "Terms of Sale",
  metaDescription:
    "The terms on which Source and Skin sells goods, including prices, GST, orders, delivery, and your rights under Australian Consumer Law.",
  standfirst:
    "The terms you are agreeing to when you order. Written to be read, not to be survived.",
  updated: UPDATED,
  sections: [
    {
      heading: "Who you are dealing with",
      body: [
        `This store is operated by ${businessDetails.legalName}${
          businessDetails.abn ? `, ABN ${businessDetails.abn}` : ""
        }, an online business based in ${businessDetails.state}, Australia${
          businessDetails.address ? `, at ${businessDetails.address}` : ""
        }.`,
        `We do not operate a shopfront. The fastest way to reach us is ${businessDetails.email}, and we answer everything ourselves — usually within two business days.`,
      ],
    },
    {
      heading: "Prices and GST",
      body: [
        gstStatement,
        businessDetails.gstRegistered
          ? "The price shown against a product is the total price for that product, including GST. Shipping is shown separately and calculated at checkout before you pay."
          : `Registration for GST becomes compulsory once turnover reaches $${businessDetails.gstThreshold.toLocaleString("en-AU")} in a 12-month period. We are below that. If that changes, prices displayed on this site will include GST from the date registration takes effect and this page will say so.`,
        "The price shown against a product is the total price you pay for that product — there are no fees added later. Shipping is shown separately and in full at checkout before you pay, as our shipping page sets out.",
        "Where a product can be configured, the price updates as you choose. A bundle with the handled sponge costs more than the same bundle with the plain one, and the price on the button is always the price of what you have actually selected.",
        "We may change prices at any time, but never after you have placed an order. The price you paid is the price.",
      ],
    },
    {
      heading: "Orders and when the contract is formed",
      body: [
        "Placing an order is an offer to buy. Our acceptance happens when we dispatch the goods, not when you click the button and not when you receive an order confirmation — the confirmation tells you what you asked for, it is not us agreeing to supply it.",
        "This matters in one direction only: it lets us correct an obvious error — a price that published wrong, an item that sold out between your order and our packing bench — rather than being bound to it. If that happens we will tell you promptly and refund you in full. We will not substitute a different item, colour or configuration without asking you first.",
        "Contracts formed this way are valid under the Electronic Transactions Act 1999 (Cth) and the Electronic Transactions Act 2000 (NSW). Your click is your signature.",
      ],
    },
    {
      heading: "Choosing colours and configurations",
      body: [
        "Several products let you choose a colour, and the bundles let you choose whether the sponge is the plain one or the handled one. Those choices are part of your order and are shown on the product page, in your bag and on your order confirmation. Check them before you pay.",
        "Screens differ, and a photograph of a dyed net cannot be an exact colour match. A colour that reads slightly differently in your bathroom than on your screen is not a fault. Sending you a colour other than the one you selected is, and we will fix it at our cost.",
      ],
    },
    {
      heading: "Payment",
      body: [
        "Payment is taken at checkout through our payment provider. We do not store your card details and never see your full card number.",
      ],
    },
    {
      heading: "Delivery",
      body: [
        `Dispatch times, delivery estimates, and costs are set out on our shipping page, which forms part of these terms. That page also carries our promise to refund shipping on any order that takes more than ${DELIVERY_PROMISE_DAYS} days to arrive.`,
        "Risk in the goods passes to you on delivery, not on dispatch. If a parcel is lost or damaged in transit, that is ours to resolve.",
      ],
    },
    {
      heading: "Your rights under Australian Consumer Law",
      emphasis: true,
      body: [
        CONSUMER_GUARANTEES_TEXT,
        "Nothing in these terms excludes, restricts or modifies those guarantees, and any part of these terms that purported to do so would have no effect to that extent under section 64 of the Australian Consumer Law.",
        "Where we are permitted to limit our liability, and to the extent the law allows it, our liability for a failure to comply with a consumer guarantee is limited to replacing the goods, supplying equivalent goods, or refunding the price. This limitation does not apply where it would be unfair or unreasonable for us to rely on it, and it does not affect your rights in respect of a major failure.",
        "Our returns page explains how to make a claim and who to go to if you are not happy with our answer.",
      ],
    },
    {
      heading: "Unfair contract terms",
      body: [
        "This is a standard form consumer contract — we wrote it and you cannot negotiate it — which puts it under the unfair contract terms provisions in Part 2-3 of the Australian Consumer Law. A term is unfair if it creates a significant imbalance in the parties' rights, is not reasonably necessary to protect our legitimate interests, and would cause you detriment if relied on. An unfair term is void.",
        "We have written these terms to avoid such a term, and if one has slipped through we will not rely on it. If you think a term here is unfair, tell us and we will look at it properly rather than defend it.",
      ],
    },
    {
      heading: "What we claim about our products",
      body: [
        "We describe what these objects physically do — a coarse mesh lifts dead skin, a chewed root has fine fibres that get between teeth. Those are descriptions, and we stand behind them.",
        "We do not claim that anything we sell treats, cures or prevents any medical or dental condition. Nothing here is a therapeutic good, nothing here is a substitute for seeing a doctor or a dentist, and a customer's individual experience is their experience rather than a result we are promising you.",
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
        `These terms are governed by the law of ${businessDetails.state}, Australia. Nothing in this clause prevents you from bringing a claim in the courts or tribunals of the state or territory where you live, and nothing in it limits any right you have under the Australian Consumer Law.`,
      ],
    },
    {
      heading: "Changes",
      body: [
        "We may update these terms. A change applies only to orders placed after it is published — the version that governs your order is the one that was on this page when you placed it, and the date at the top tells you when it last changed.",
      ],
    },
  ],
};

export const accessibility: LegalDocument = {
  slug: "accessibility",
  title: "Accessibility",
  metaTitle: "Accessibility Statement",
  metaDescription:
    "How this site is built to be usable with a keyboard, a screen reader or reduced motion, the standard we hold it to, and how to tell us when it fails.",
  standfirst:
    "What we have done to make this site usable however you browse, where we know it falls short, and how to tell us when it does.",
  updated: UPDATED,
  sections: [
    {
      heading: "The standard we hold this site to",
      body: [
        "We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. That is the benchmark the Australian Human Rights Commission points to, and providing a website that a person cannot use because of a disability can be unlawful discrimination under the Disability Discrimination Act 1992 (Cth).",
        "We are a two-person business and we have not had this site independently audited. We are telling you what we have built and tested rather than claiming a certification we do not hold.",
      ],
    },
    {
      heading: "What we have built in",
      list: [
        "Every page works with a keyboard alone. Focus is always visible, and a skip link takes you straight past the navigation to the main content.",
        "Headings, landmarks and lists are marked up as what they are, so a screen reader can navigate the page by structure rather than by reading it end to end.",
        "Colour choices are checked for contrast, and colour is never the only way information is conveyed — a selected option is outlined as well as filled.",
        "Option pickers are real radio groups with accessible names, so choosing a sponge colour is announced rather than silent.",
        "Every photograph carries alternative text, and images that are decoration are marked as decoration so a screen reader skips them instead of reading a filename.",
        "If your system is set to reduce motion, animations do not run — content appears in its final state rather than being hidden behind a transition that never plays.",
        "Text resizes and reflows without breaking the layout, and the site works at phone width without horizontal scrolling.",
      ],
    },
    {
      heading: "Where we know it falls short",
      body: [
        "Checkout is handled by our payment platform and its accessibility is theirs rather than ours. We have chosen a mainstream provider partly for that reason, but we do not control it.",
        "We have not tested with every combination of screen reader and browser. If yours is one we have missed, we would rather hear about it than assume.",
      ],
    },
    {
      heading: "Tell us when it fails",
      body: [
        `If any part of this site is hard or impossible for you to use, write to ${site.email} and tell us what happened and what you were using. We will reply within two business days and fix what we can.`,
        "If you cannot use the site to order and would rather do it by email, say so and we will take the order that way. You will not pay more for it.",
      ],
    },
  ],
};

export const legalDocuments: LegalDocument[] = [
  shipping,
  returns,
  privacy,
  terms,
  accessibility,
];
