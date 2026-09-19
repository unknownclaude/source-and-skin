import { NextResponse } from "next/server";

import { businessDetails } from "@/data/legal";
import { sendMail } from "@/lib/mail";

/**
 * Contact form endpoint.
 *
 * Validates server-side as well as in the browser — the client checks are for
 * the person filling the form in, not for anything arriving at this route.
 *
 * Returns 503 rather than 200 when email is not configured. That is the whole
 * point of this route existing: the form used to resolve to a success screen
 * with nothing behind it.
 */

const MAX = { name: 120, email: 200, topic: 60, message: 4000 };

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const topic = String(body.topic ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (
    !name ||
    name.length > MAX.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    email.length > MAX.email ||
    topic.length > MAX.topic ||
    message.length < 10 ||
    message.length > MAX.message
  ) {
    return NextResponse.json({ error: "Those details did not validate." }, { status: 400 });
  }

  const result = await sendMail({
    to: businessDetails.email,
    subject: `Contact form — ${topic || "Something else"}`,
    replyTo: email,
    text: [`From: ${name} <${email}>`, `Topic: ${topic || "—"}`, "", message].join("\n"),
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          result.reason === "unconfigured"
            ? "This form is not connected to an inbox yet."
            : "We could not send that just now.",
        // The client shows the address so the customer is never left with no
        // way through, whichever way this failed.
        fallbackEmail: businessDetails.email,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
