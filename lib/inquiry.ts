
/**
 * Shared between the browser form and the API route, so both enforce exactly
 * the same rules. Deliberately free of server-only imports: this module is
 * bundled for the client, and anything Node-specific here would break the build.
 * Delivery lives in lib/inquiry-delivery.ts.
 */
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

