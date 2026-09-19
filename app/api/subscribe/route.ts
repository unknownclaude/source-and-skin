import { NextResponse } from "next/server";

import { businessDetails } from "@/data/legal";
import { sendMail } from "@/lib/mail";

/**
 * Newsletter subscription endpoint.
 *
 * Until a real list provider is connected this forwards the address to the
 * business inbox, which is honest — someone receives it and can add it — and
 * returns 503 when even that is unavailable rather than pretending.
 *
 * `consent` is required and recorded with a timestamp. Under the Spam Act 2003
 * (Cth) the burden of proving consent sits on the sender, so an address
 * without a consent record is an address that cannot lawfully be mailed.
 * Whatever list provider replaces this must carry that record across; do not
 * import bare addresses into it.
 */

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const email = String(body.email ?? "").trim();
  const consent = body.consent === true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "That email address did not validate." }, { status: 400 });
  }

  if (!consent) {
    return NextResponse.json({ error: "Consent is required to subscribe." }, { status: 400 });
  }

  const consentedAt = new Date().toISOString();
  const result = await sendMail({
    to: businessDetails.email,
    subject: "Newsletter subscription",
    text: [
      `Address: ${email}`,
      `Consent given: yes`,
      `Timestamp: ${consentedAt}`,
      `Source: newsletter form on the website`,
    ].join("\n"),
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          result.reason === "unconfigured"
            ? "The list is not connected yet."
            : "We could not add you just now.",
        fallbackEmail: businessDetails.email,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
