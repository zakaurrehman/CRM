/**
 * The general message from the contact page.
 *
 * Shared between the browser form and the API route, so both enforce exactly
 * the same rules. Deliberately free of server-only imports: this module is
 * bundled for the client, and anything Node-specific here would break the build.
 * Delivery lives in lib/inquiry-delivery.ts.
 *
 * Four fields (IMS, 14 September 2026). Material, quantity, industry and the
 * rest belong to the offer and supply forms, which ask for them properly;
 * this is for anything else, and for people who would rather write.
 */
export interface InquiryPayload {
  name: string;
  company: string;
  email: string;
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

  if (!input.message?.trim()) errors.message = "Please tell us how we can help.";
  else if (input.message.trim().length < 10) errors.message = "Please add a little more detail.";
  else if (input.message.trim().length > 4000) errors.message = "Please keep this under 4000 characters.";

  return errors;
}
