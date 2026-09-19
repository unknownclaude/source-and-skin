import { shippingTerms } from "@/data/site";

/**
 * Estimated delivery window for an order placed now.
 *
 * "Arrives Tue 24 – Fri 27 Sep" answers the question a shipping policy makes
 * you work for. It is built from the same numbers the shipping page publishes:
 * dispatch within `dispatchDays` business days, then the metropolitan transit
 * range. Change the policy and this moves with it.
 *
 * Two deliberate constraints:
 *
 *   1. Business days only. Ordering on a Friday evening does not mean packed
 *      on Saturday, and a range that assumed it would be wrong by two days
 *      every weekend.
 *   2. It is an estimate and must be labelled as one wherever it is shown.
 *      Under the Australian Consumer Law a delivery representation needs a
 *      reasonable basis; these ranges come from the carrier's own published
 *      times, and the shipping page carries the promise that backs them up —
 *      if it takes more than 30 days we refund the shipping.
 *
 * Public holidays are not modelled. That would need a NSW holiday calendar
 * kept up to date, and being a day optimistic twice a year is a smaller error
 * than a stale calendar nobody maintains.
 */

/** Metropolitan Australia, from the shipping page's published range. */
const TRANSIT_DAYS_MIN = 2;
const TRANSIT_DAYS_MAX = 6;

function addBusinessDays(from: Date, days: number): Date {
  const date = new Date(from);
  let remaining = days;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return date;
}

const formatter = new Intl.DateTimeFormat("en-AU", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export type DeliveryEstimate = { earliest: Date; latest: Date; label: string };

/**
 * @param now Injectable so this can be tested, and so a server render and a
 *            client render can be handed the same instant rather than
 *            disagreeing across midnight.
 */
export function estimateDelivery(now: Date = new Date()): DeliveryEstimate {
  const dispatched = addBusinessDays(now, shippingTerms.dispatchDays);
  const earliest = addBusinessDays(dispatched, TRANSIT_DAYS_MIN);
  const latest = addBusinessDays(dispatched, TRANSIT_DAYS_MAX);

  return {
    earliest,
    latest,
    label: `${formatter.format(earliest)} – ${formatter.format(latest)}`,
  };
}
