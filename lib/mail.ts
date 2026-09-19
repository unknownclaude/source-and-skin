/**
 * Outbound email, via Resend.
 *
 * One provider, chosen and wired rather than abstracted over: an interface
 * with a single implementation is a guess about the second one. Swapping to
 * Postmark or SES means rewriting `send` and nothing else.
 *
 * The important behaviour is what happens when it is NOT configured. It
 * reports that it is unconfigured, and the caller surfaces that to the
 * customer. It must never resolve as if a message was sent, because the
 * failure mode of a contact form that lies is the worst one available: the
 * customer believes they have reached you, stops trying, and waits for an
 * answer that is never coming. A visible error sends them to the email
 * address instead, and they get their answer.
 */

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "provider-error"; detail?: string };

const ENDPOINT = "https://api.resend.com/emails";

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL);
}

export async function sendMail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  if (!isMailConfigured()) return { ok: false, reason: "unconfigured" };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      // The provider's body can quote the submitted address back; it is logged
      // for the operator but never returned to the browser.
      const detail = await response.text().catch(() => "");
      console.error("[mail] provider rejected the send", response.status, detail.slice(0, 500));
      return { ok: false, reason: "provider-error" };
    }

    return { ok: true };
  } catch (error) {
    console.error("[mail] send threw", error);
    return { ok: false, reason: "provider-error" };
  }
}
