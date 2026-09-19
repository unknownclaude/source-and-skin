"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { site } from "@/data/site";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Newsletter capture.
 *
 * There is no backend yet, so this validates and then reports success without
 * sending anything. Swap `fakeSubscribe` for a POST to /api/subscribe (or a
 * Klaviyo / Mailchimp / ConvertKit endpoint) — the surrounding state machine
 * already handles pending, success and failure.
 *
 * The consent box is not decoration. The Spam Act 2003 (Cth) requires consent
 * before a commercial electronic message is sent, that every message identify
 * the sender, and that unsubscribe requests be honoured within five working
 * days. An unticked box the subscriber has to tick is the cleanest evidence
 * that consent was given, which matters because the burden of proving it sits
 * on the sender. It starts unticked — a pre-ticked box is not consent.
 *
 * Whatever replaces `fakeSubscribe` MUST record the consent alongside the
 * address: the timestamp, and that it came from this form. An address without
 * a consent record is an address you cannot lawfully mail.
 */
/**
 * Posts to /api/subscribe, which records the address and the consent.
 *
 * Throws with a readable message on failure — including the 503 the route
 * returns when no list is connected — so the caller can tell the subscriber
 * the truth instead of showing them a success line for a subscription that
 * did not happen.
 */
async function subscribe(email: string, consent: boolean): Promise<void> {
  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, consent }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "We could not add you just now.");
  }
}

export default function NewsletterForm({ inverted = false }: { inverted?: boolean }) {
  const inputId = useId();
  const consentId = `${inputId}-consent`;
  const [email, setEmail] = useState("");
  const [consented, setConsented] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setStatus("error");
      setMessage("That email address does not look quite right.");
      return;
    }

    if (!consented) {
      setStatus("error");
      setMessage("Tick the box to confirm you would like these emails.");
      return;
    }

    setStatus("submitting");
    try {
      await subscribe(trimmed, consented);
      setStatus("success");
      setMessage("You are on the list. Look out for the first note.");
      setEmail("");
      setConsented(false);
    } catch (error) {
      setStatus("error");
      setMessage(
        `${error instanceof Error ? error.message : "Something went wrong."} Email ${site.email} and we will add you by hand.`
      );
    }
  }

  const borderTone = inverted ? "border-cream/30" : "border-charcoal/25";
  const placeholderTone = inverted ? "placeholder:text-cream/40" : "placeholder:text-charcoal/35";

  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg" noValidate>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>

      <div className={`flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-end ${borderTone}`}>
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="you@example.com"
          aria-invalid={status === "error"}
          aria-describedby={message ? `${inputId}-message` : undefined}
          className={`w-full bg-transparent py-2 text-base outline-none ${placeholderTone}`}
        />

        <button
          type="submit"
          disabled={status === "submitting"}
          className={`shrink-0 whitespace-nowrap rounded-full px-7 py-3 text-[0.7rem] uppercase tracking-[0.18em] transition-opacity hover:opacity-80 disabled:opacity-50 ${
            inverted ? "bg-cream text-charcoal" : "bg-charcoal text-cream"
          }`}
        >
          {status === "submitting" ? "Joining…" : "Join"}
        </button>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <input
          id={consentId}
          type="checkbox"
          checked={consented}
          onChange={(event) => {
            setConsented(event.target.checked);
            if (status !== "idle") setStatus("idle");
          }}
          className={`mt-0.5 h-4 w-4 shrink-0 ${inverted ? "accent-cream" : "accent-charcoal"}`}
        />
        <label
          htmlFor={consentId}
          className={`text-xs leading-relaxed ${inverted ? "text-cream/65" : "text-charcoal/60"}`}
        >
          Yes, email me occasional notes and restock notices from {site.name}. No more than twice a
          month, and you can unsubscribe from any message —{" "}
          <Link href="/privacy" className="link-underline">
            how we handle your address
          </Link>
          .
        </label>
      </div>

      {/* Announced to screen readers without stealing focus. */}
      <p
        id={`${inputId}-message`}
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${
          status === "error"
            ? inverted
              ? "text-terracotta"
              : "text-clay"
            : inverted
              ? "text-cream/70"
              : "text-charcoal/60"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
