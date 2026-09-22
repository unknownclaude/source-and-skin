"use client";

import Link from "next/link";
import { useState } from "react";

import { site } from "@/data/site";

type Status = "idle" | "submitting" | "success" | "error";

const TOPICS = ["An order", "Sourcing question", "Wholesale", "Something else"];

/**
 * Contact form.
 *
 * Posts to /api/contact, which sends the message and returns 503 if it cannot.
 * When that happens the customer is shown the email address rather than a
 * success screen — a form that claims to have delivered a message it dropped
 * is worse than no form, because the person stops trying and waits.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Let us know who you are.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) nextErrors.email = "We need a valid email to reply to.";
    if (message.length < 10) nextErrors.message = "A little more detail helps us answer properly.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setFailure(null);

    // Captured before the await: React clears the pooled event's target, and
    // reset() on a null form throws after the network round-trip.
    const formElement = event.currentTarget;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          topic: String(form.get("topic") ?? ""),
          message,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setFailure(data.error ?? "We could not send that just now.");
        setStatus("error");
        return;
      }

      setStatus("success");
      formElement.reset();
    } catch {
      setFailure("We could not reach the server.");
      setStatus("error");
    }
  }

  const fieldClass =
    "w-full border-b border-charcoal/25 bg-transparent py-3 text-base outline-none transition-colors placeholder:text-charcoal/35 focus:border-charcoal";

  if (status === "success") {
    return (
      <div role="status" className="border border-charcoal/15 p-10">
        <h2 className="font-serif text-display-sm">Thank you — that reached us.</h2>
        <p className="mt-4 text-base leading-relaxed text-charcoal/65">
          We answer everything ourselves, usually within two business days. If it is about an order
          already placed, include the order number in your reply and it will move faster.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-underline mt-8 text-[0.72rem] uppercase tracking-[0.2em]"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div>
        <label htmlFor="name" className="eyebrow block">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${fieldClass} mt-3`}
          placeholder="Your name"
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-sm text-clay">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="eyebrow block">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${fieldClass} mt-3`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-clay">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="topic" className="eyebrow block">
          Topic
        </label>
        <select id="topic" name="topic" className={`${fieldClass} mt-3 cursor-pointer`} defaultValue={TOPICS[0]}>
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} mt-3 resize-y`}
          placeholder="How can we help?"
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-sm text-clay">
            {errors.message}
          </p>
        )}
      </div>

      {/* Collection notice. Australian Privacy Principle 5 requires the
          person to be told, at or before the point of collection, who is
          collecting their information and what it will be used for — a link to
          the policy elsewhere on the site is not the same thing as telling
          them here, while they are typing it in. */}
      <p className="max-w-prose text-xs leading-relaxed text-charcoal/55">
        {site.name} collects your name, email address and message so we can answer you, and for no
        other purpose. We do not run a mailing list and will not add you to one, and we will not pass
        what you write to anyone else. Correspondence is deleted once it is no longer useful. You
        can ask us what we hold about you, or ask us to correct or delete it, at any time — see our{" "}
        <Link href="/privacy" className="link-underline">
          privacy policy
        </Link>
        .
      </p>

      {failure && (
        <div role="alert" className="border-l-2 border-clay bg-cream-deep/60 py-4 pl-5 pr-4">
          <p className="text-sm leading-relaxed text-charcoal/80">
            {failure} Please email us directly at{" "}
            <a href={`mailto:${site.email}`} className="link-underline">
              {site.email}
            </a>{" "}
            and we will answer within two business days.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-charcoal px-9 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-cream transition-transform duration-500 ease-editorial hover:-translate-y-0.5 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
