"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { validateInquiry, type FieldErrors } from "@/lib/inquiry";
import { ButtonEl } from "@/components/ui/Button";
import { contact, routes } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useP } from "@/lib/i18n/phrases/client";

type Status = "idle" | "submitting" | "sent" | "error";

const inputBase =
  "h-12 w-full rounded border bg-white px-3.5 text-[0.9375rem] text-navy-900 transition-colors " +
  "placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700";

/**
 * The contact page's message form: name, company, email, message.
 *
 * Nothing about material here (IMS, 14 September 2026) — an offer or a
 * supply request goes through the form built for it, with line items and
 * attachments. This is for everything else.
 *
 * Validation runs client-side for immediate feedback and again on the server,
 * which is the copy that actually gates delivery. Errors are announced through
 * a live region and each field is wired to its message with aria-describedby.
 */
export function InquiryForm() {
  const p = useP();
  const id = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fallbackHref, setFallbackHref] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const field = (name: string) => `${id}-${name}`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;

    const clientErrors = validateInquiry(data);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      const firstKey = Object.keys(clientErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setFormError(null);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { ok: boolean; errors?: FieldErrors; error?: string };

      if (result.ok) {
        setStatus("sent");
        formRef.current?.reset();
        return;
      }

      if (result.errors) {
        setErrors(result.errors);
        setStatus("idle");
        return;
      }

      setFormError(result.error ?? p("Something went wrong. Please try again."));
      setFallbackHref(composeMailto(data));
      setStatus("error");
    } catch {
      setFormError(p("We could not reach the server. Please check your connection and try again."));
      setFallbackHref(composeMailto(data));
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border-t-2 border-success-500 bg-success-50 p-8">
        <h2 className="font-display text-2xl font-medium text-navy-900">{p("Message received")}</h2>
        <p className="mt-3 text-base leading-relaxed text-steel-700">
          {p("Thank you — your message is with our team, and we will reply by email.")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex h-11 items-center rounded border border-steel-300 bg-white px-5 text-[0.9375rem] font-medium text-navy-900 transition-colors hover:border-brand-700 hover:text-brand-700"
        >
          {p("Send another message")}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Honeypot. Hidden by clipping rather than by parking it at left:-9999px:
          a physical offset extends the scrollable area on whichever side is
          "behind" the reading direction, which gave every RTL page a 9999px
          horizontal scroll. */}
      <div aria-hidden className="sr-only">
        <label htmlFor={field("website")}>{p("Website")}</label>
        <input id={field("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="assertive" className="sr-only">
        {formError ?? (Object.keys(errors).length > 0 ? p("The form has errors. Please review the fields.") : "")}
      </div>

      {formError ? (
        <div className="border-s-2 border-danger-500 bg-danger-50 p-5">
          <p className="text-[0.9375rem] text-navy-900">{formError}</p>
          <a
            href={fallbackHref ?? "mailto:" + contact.email}
            className="mt-2 inline-block text-[0.9375rem] font-medium text-brand-700 underline underline-offset-4"
          >
            {p("Send it by email instead — your details are already filled in")}
          </a>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={field("name")} name="name" label={p("Name")} required error={errors.name} autoComplete="name" />
        <Field id={field("company")} name="company" label={p("Company")} required error={errors.company} autoComplete="organization" />
        <div className="sm:col-span-2">
          <Field id={field("email")} name="email" label={p("Email")} type="email" required error={errors.email} autoComplete="email" />
        </div>
      </div>

      <div>
        <label htmlFor={field("message")} className="block text-[0.9375rem] font-medium text-navy-900">
          {p("Message")} <span className="text-danger-500">*</span>
        </label>
        <textarea
          id={field("message")}
          name="message"
          rows={6}
          required
          placeholder={p("How can we help?")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? field("message") + "-error" : undefined}
          className={cn(
            "mt-2 w-full rounded border bg-white p-3.5 text-[0.9375rem] leading-relaxed text-navy-900 transition-colors placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700",
            errors.message ? "border-danger-500" : "border-steel-300",
          )}
        />
        {errors.message ? (
          <p id={field("message") + "-error"} className="mt-2 text-[0.8125rem] text-danger-600">
            {p(errors.message)}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 border-t border-steel-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] text-steel-500">
          <span className="text-danger-500">*</span> {p("Required. We use your details only to reply to this message.")}{" "}
          <Link href={routes.privacy} className="underline underline-offset-2 hover:text-brand-700">
            {p("Privacy policy")}
          </Link>
        </p>
        <ButtonEl type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? p("Sending…") : p("Send message")}
        </ButtonEl>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
  error,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}) {
  const p = useP();
  return (
    <div>
      <label htmlFor={id} className="block text-[0.9375rem] font-medium text-navy-900">
        {label} {required ? <span className="text-danger-500">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? id + "-error" : undefined}
        className={cn(inputBase, "mt-2", error ? "border-danger-500" : "border-steel-300")}
      />
      {error ? (
        <p id={id + "-error"} className="mt-2 text-[0.8125rem] text-danger-600">
          {p(error)}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Builds a mailto containing everything the visitor typed.
 *
 * If delivery fails, the worst outcome is making someone re-enter a message.
 * This hands them a pre-composed one instead, so the fallback costs one click.
 */
function composeMailto(data: Record<string, string>): string {
  const line = (label: string, value?: string) =>
    value?.trim() ? `${label}: ${value.trim()}\n` : "";
  const body =
    line("Name", data.name) +
    line("Company", data.company) +
    line("Email", data.email) +
    `\n${(data.message ?? "").trim()}\n`;
  const subject = "Message" + (data.company ? " — " + data.company : "");
  return (
    "mailto:" + contact.email +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body)
  );
}
