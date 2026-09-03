"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const TOPICS = ["An order", "Sourcing question", "Wholesale", "Something else"];

/**
 * Contact form.
 *
 * Client-side validation only — there is no inbox behind it yet. Point
 * `submit` at /api/contact (or Formspree / Resend) and the states below carry
 * over unchanged.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("success");
    event.currentTarget.reset();
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
