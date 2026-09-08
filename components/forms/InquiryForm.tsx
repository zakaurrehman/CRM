"use client";

import { useId, useRef, useState } from "react";
import { industryOptions, requirementTypes, validateInquiry, type FieldErrors } from "@/lib/inquiry";
import { ButtonEl } from "@/components/ui/Button";
import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "sent" | "error";

const inputBase =
  "h-12 w-full rounded border bg-white px-3.5 text-[0.9375rem] text-navy-900 transition-colors " +
  "placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700";

/**
 * Inquiry form.
 *
 * Validation runs client-side for immediate feedback and again on the server,
 * which is the copy that actually gates delivery. Errors are announced through
 * a live region and each field is wired to its message with aria-describedby.
 */
export function InquiryForm({ materialNames = [] }: { materialNames?: string[] }) {
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

      setFormError(result.error ?? "Something went wrong. Please try again.");
      setFallbackHref(composeMailto(data));
      setStatus("error");
    } catch {
      setFormError("We could not reach the server. Please check your connection and try again.");
      setFallbackHref(composeMailto(data));
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border-t-2 border-success-500 bg-success-50 p-8">
        <h2 className="font-display text-2xl font-semibold text-navy-900">Inquiry received</h2>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-steel-700">
          Thank you &mdash; your inquiry is with our team. We will come back to you with a route for your
          material.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex h-11 items-center rounded border border-steel-300 bg-white px-5 text-[0.9375rem] font-medium text-navy-900 transition-colors hover:border-brand-700 hover:text-brand-700"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Honeypot: visually and programmatically hidden from real users. */}
      <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0" style={{ left: "-9999px" }}>
        <label htmlFor={field("website")}>Website</label>
        <input id={field("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="assertive" className="sr-only">
        {formError ?? (Object.keys(errors).length > 0 ? "The form has errors. Please review the fields." : "")}
      </div>

      {formError ? (
        <div className="border-l-2 border-danger-500 bg-danger-50 p-5">
          <p className="text-[0.9375rem] text-navy-900">{formError}</p>
          <a
            href={fallbackHref ?? "mailto:" + contact.email}
            className="mt-2 inline-block text-[0.9375rem] font-medium text-brand-700 underline underline-offset-4"
          >
            Send it by email instead &mdash; your details are already filled in
          </a>
        </div>
      ) : null}

      <fieldset className="space-y-6">
        <legend className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
          Your details
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={field("name")} name="name" label="Name" required error={errors.name} autoComplete="name" />
          <Field
            id={field("company")}
            name="company"
            label="Company"
            required
            error={errors.company}
            autoComplete="organization"
          />
          <Field
            id={field("email")}
            name="email"
            label="Email"
            type="email"
            required
            error={errors.email}
            autoComplete="email"
          />
          <Field
            id={field("phone")}
            name="phone"
            label="Phone"
            type="tel"
            error={errors.phone}
            autoComplete="tel"
            hint="Optional"
          />
          <div className="sm:col-span-2 sm:max-w-xs">
            <Field
              id={field("country")}
              name="country"
              label="Country"
              error={errors.country}
              autoComplete="country-name"
              hint="Optional"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6 border-t border-steel-200 pt-6">
        <legend className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
          Your requirement
        </legend>

        <div>
          <label htmlFor={field("requirementType")} className="block text-[0.9375rem] font-medium text-navy-900">
            What do you need? <span className="text-danger-500">*</span>
          </label>
          <select
            id={field("requirementType")}
            name="requirementType"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.requirementType)}
            aria-describedby={errors.requirementType ? field("requirementType") + "-error" : undefined}
            className={cn(inputBase, "mt-2", errors.requirementType ? "border-danger-500" : "border-steel-300")}
          >
            <option value="" disabled>
              Select an option
            </option>
            {requirementTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.requirementType ? (
            <p id={field("requirementType") + "-error"} className="mt-2 text-[0.8125rem] text-danger-600">
              {errors.requirementType}
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={field("material")} className="block text-[0.9375rem] font-medium text-navy-900">
              Material or alloy <span className="font-normal text-steel-500">(optional)</span>
            </label>
            <input
              id={field("material")}
              name="material"
              type="text"
              list={field("materials-list")}
              placeholder="e.g. Inconel 718, EAF dust, tungsten carbide"
              aria-invalid={Boolean(errors.material)}
              className={cn(inputBase, "mt-2", errors.material ? "border-danger-500" : "border-steel-300")}
            />
            <datalist id={field("materials-list")}>
              {materialNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor={field("industry")} className="block text-[0.9375rem] font-medium text-navy-900">
              Industry <span className="font-normal text-steel-500">(optional)</span>
            </label>
            <select
              id={field("industry")}
              name="industry"
              defaultValue=""
              className={cn(inputBase, "mt-2 border-steel-300")}
            >
              <option value="">Select an industry</option>
              {industryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:max-w-xs">
            <Field
              id={field("quantity")}
              name="quantity"
              label="Quantity"
              error={errors.quantity}
              hint="Optional — e.g. 20 t per month"
            />
          </div>
        </div>

        <div>
          <label htmlFor={field("message")} className="block text-[0.9375rem] font-medium text-navy-900">
            Tell us about your requirement <span className="text-danger-500">*</span>
          </label>
          <textarea
            id={field("message")}
            name="message"
            rows={6}
            required
            placeholder="Specification, form, volume, timing — whatever is relevant."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? field("message") + "-error" : field("message") + "-hint"}
            className={cn(
              "w-full rounded border bg-white p-3.5 text-[0.9375rem] leading-relaxed text-navy-900 transition-colors placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700",
              "mt-2",
              errors.message ? "border-danger-500" : "border-steel-300",
            )}
          />
          {errors.message ? (
            <p id={field("message") + "-error"} className="mt-2 text-[0.8125rem] text-danger-600">
              {errors.message}
            </p>
          ) : (
            <p id={field("message") + "-hint"} className="mt-2 text-[0.8125rem] text-steel-500">
              Have a material analysis or specification sheet? Email it to{" "}
              <a href={"mailto:" + contact.email} className="underline underline-offset-2 hover:text-brand-700">
                {contact.email}
              </a>{" "}
              and reference your company name.
            </p>
          )}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-steel-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] text-steel-500">
          <span className="text-danger-500">*</span> Required. We use your details only to respond to this
          inquiry.
        </p>
        <ButtonEl type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send inquiry"}
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
  hint,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.9375rem] font-medium text-navy-900">
        {label}{" "}
        {required ? (
          <span className="text-danger-500">*</span>
        ) : hint ? (
          <span className="font-normal text-steel-500">({hint.toLowerCase()})</span>
        ) : null}
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
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Builds a mailto containing everything the visitor typed.
 *
 * If delivery fails, the worst outcome is making someone re-enter a long
 * technical enquiry. This hands them a pre-composed message instead, so the
 * fallback costs them one click rather than five minutes.
 */
function composeMailto(data: Record<string, string>): string {
  const line = (label: string, value?: string) =>
    value?.trim() ? `${label}: ${value.trim()}\n` : "";
  const body =
    line("Name", data.name) +
    line("Company", data.company) +
    line("Email", data.email) +
    line("Phone", data.phone) +
    line("Country", data.country) +
    line("Requirement", data.requirementType) +
    line("Industry", data.industry) +
    line("Material / alloy", data.material) +
    line("Quantity", data.quantity) +
    `\n${(data.message ?? "").trim()}\n`;
  const subject = "Inquiry: " + (data.requirementType || "Materials") + (data.company ? " — " + data.company : "");
  return (
    "mailto:" + contact.email +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body)
  );
}
