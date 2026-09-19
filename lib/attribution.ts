/**
 * First-touch attribution, carried across to the Shopify checkout.
 *
 * The problem this solves is specific to running the storefront on one domain
 * and checkout on another. A customer arrives from an Instagram ad with
 * `?utm_source=instagram` in the URL, browses here, then hands off to Shopify.
 * Shopify starts watching at the handoff, sees the referrer as *this site*,
 * and files the order as a self-referral or as direct. The ad that actually
 * paid for the sale disappears from the report.
 *
 * So the campaign is captured on the first page of the visit, kept, and put
 * back on the checkout URL at the handoff, where Shopify reads it as the
 * session's source.
 *
 * First touch wins, deliberately. Someone who arrives from an ad, leaves, and
 * comes back by typing the address has still been brought here by the ad; if
 * last touch overwrote it, every campaign would quietly lose credit to
 * "direct" and the numbers would argue for spending nothing.
 */

const STORAGE_KEY = "source-and-skin:attribution";

/** The parameters Shopify reads on a checkout URL. */
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type Attribution = {
  params: Record<string, string>;
  /** Referring host on first landing, when there was one and it was not us. */
  referrer?: string;
  /** ISO timestamp of the first landing. */
  capturedAt: string;
};

function read(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution;
    return parsed && typeof parsed === "object" && parsed.params ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Records the campaign on first landing. Safe to call on every page.
 *
 * Does nothing if something is already stored, which is what makes it first
 * touch rather than last.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  if (read()) return;

  const url = new URL(window.location.href);
  const params: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) params[key] = value.slice(0, 200);
  }

  let referrer: string | undefined;
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      // Our own pages are not a traffic source; recording them is the exact
      // self-referral noise this file exists to prevent.
      if (host && host !== window.location.hostname) referrer = host;
    }
  } catch {
    // An opaque or malformed referrer is simply not recorded.
  }

  // A visit with neither a campaign nor an external referrer is direct, and
  // storing an empty record would only lock in "direct" against a later ad
  // click in the same browser.
  if (Object.keys(params).length === 0 && !referrer) return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ params, referrer, capturedAt: new Date().toISOString() } satisfies Attribution)
    );
  } catch {
    // Private mode or a full quota: attribution is lost, the sale is not.
  }
}

/**
 * Appends the stored campaign to a checkout URL.
 *
 * Any `utm_*` already on the URL wins — an explicitly tagged checkout link is
 * a deliberate act and should not be overwritten by a months-old first touch.
 *
 * Where there was a referrer but no campaign, it is passed as `utm_source`
 * with `utm_medium=referral`, which is how Shopify's reporting expects to
 * receive it.
 */
export function withAttribution(checkoutUrl: string): string {
  if (typeof window === "undefined") return checkoutUrl;

  const stored = read();
  if (!stored) return checkoutUrl;

  try {
    const url = new URL(checkoutUrl, window.location.origin);

    for (const [key, value] of Object.entries(stored.params)) {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    }

    if (!url.searchParams.has("utm_source") && stored.referrer) {
      url.searchParams.set("utm_source", stored.referrer);
      url.searchParams.set("utm_medium", "referral");
    }

    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/** For a debug view, or to attach to a support enquiry. */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  return read();
}
