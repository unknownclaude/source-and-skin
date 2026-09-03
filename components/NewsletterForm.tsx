"use client";

import { useId, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Newsletter capture.
 *
 * There is no backend yet, so this validates and then reports success without
 * sending anything. Swap `fakeSubscribe` for a POST to /api/subscribe (or a
 * Klaviyo / Mailchimp / ConvertKit endpoint) — the surrounding state machine
 * already handles pending, success and failure.
 */
async function fakeSubscribe(email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (!email) throw new Error("Missing email");
}

export default function NewsletterForm({ inverted = false }: { inverted?: boolean }) {
  const inputId = useId();
  const [email, setEmail] = useState("");
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

    setStatus("submitting");
    try {
      await fakeSubscribe(trimmed);
      setStatus("success");
      setMessage("You are on the list. Look out for the first note.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again in a moment.");
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
