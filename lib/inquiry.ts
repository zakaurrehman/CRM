import { contact } from "./site";

export const requirementTypes = [
  "Supply material to us",
  "Sell or recycle material with IMS",
  "Aerospace revert programme",
  "Technical or specification question",
  "Other enquiry",
] as const;

export const industryOptions = [
  "Aerospace",
  "Oil & Gas / Petrochemical",
  "Industrial Gas Turbine",
  "Stainless Steel",
  "Automotive",
  "Medical / Orthopaedics",
  "Additive Manufacturing",
  "Thermal Spray / Electroplating",
  "Other",
] as const;

export interface InquiryPayload {
  name: string;
  company: string;
  email: string;
  phone?: string;
  country?: string;
  requirementType: string;
  material?: string;
  industry?: string;
  quantity?: string;
  message: string;
}

export type FieldErrors = Partial<Record<keyof InquiryPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the client form and the API route so both enforce the same rules. */
export function validateInquiry(input: Partial<InquiryPayload>): FieldErrors {
  const errors: FieldErrors = {};

  if (!input.name?.trim()) errors.name = "Please enter your name.";
  else if (input.name.trim().length > 120) errors.name = "Please keep this under 120 characters.";

  if (!input.company?.trim()) errors.company = "Please enter your company.";
  else if (input.company.trim().length > 160) errors.company = "Please keep this under 160 characters.";

  if (!input.email?.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(input.email.trim())) errors.email = "Please enter a valid email address.";

  if (!input.requirementType?.trim()) errors.requirementType = "Please choose what you need.";
  else if (!requirementTypes.includes(input.requirementType as (typeof requirementTypes)[number]))
    errors.requirementType = "Please choose one of the listed options.";

  if (!input.message?.trim()) errors.message = "Please tell us about your requirement.";
  else if (input.message.trim().length < 10) errors.message = "Please add a little more detail.";
  else if (input.message.trim().length > 4000) errors.message = "Please keep this under 4000 characters.";

  if (input.phone && input.phone.length > 40) errors.phone = "Please keep this under 40 characters.";
  if (input.country && input.country.length > 80) errors.country = "Please keep this under 80 characters.";
  if (input.material && input.material.length > 200) errors.material = "Please keep this under 200 characters.";
  if (input.quantity && input.quantity.length > 120) errors.quantity = "Please keep this under 120 characters.";

  return errors;
}

function renderPlainText(payload: InquiryPayload): string {
  const line = (label: string, value?: string) => (value?.trim() ? `${label}: ${value.trim()}\n` : "");
  return (
    "New inquiry from ims-metals.com\n\n" +
    line("Name", payload.name) +
    line("Company", payload.company) +
    line("Email", payload.email) +
    line("Phone", payload.phone) +
    line("Country", payload.country) +
    line("Requirement", payload.requirementType) +
    line("Industry", payload.industry) +
    line("Material / alloy", payload.material) +
    line("Quantity", payload.quantity) +
    "\nMessage:\n" +
    payload.message.trim() +
    "\n"
  );
}

export type DeliveryResult = { ok: true } | { ok: false; reason: "unconfigured" | "failed" };

/**
 * Delivers an inquiry without pulling in a mail dependency.
 *
 * Two transports are supported, both configured entirely through server-side
 * environment variables so no key is ever exposed to the browser:
 *   INQUIRY_WEBHOOK_URL - POSTs the JSON payload (CRM, Zapier, Make, etc.)
 *   RESEND_API_KEY      - sends via the Resend HTTP API
 * With neither set the caller is told the form is unconfigured, so the UI can
 * fall back to a direct mailto rather than silently dropping an enquiry.
 */
export async function deliverInquiry(payload: InquiryPayload): Promise<DeliveryResult> {
  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL ?? contact.email;

  try {
    if (webhook) {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
      });
      return response.ok ? { ok: true } : { ok: false, reason: "failed" };
    }

    if (resendKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.INQUIRY_FROM_EMAIL ?? "website@ims-metals.com",
          to: [to],
          reply_to: payload.email,
          subject: `Inquiry: ${payload.requirementType} — ${payload.company}`,
          text: renderPlainText(payload),
        }),
      });
      return response.ok ? { ok: true } : { ok: false, reason: "failed" };
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[inquiry] No transport configured; payload:\n" + renderPlainText(payload));
      return { ok: true };
    }

    return { ok: false, reason: "unconfigured" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
