/**
 * Request-for-quotation model.
 *
 * Shared by the browser form and the API route so both enforce identical rules,
 * and deliberately free of server-only imports for the same reason lib/inquiry.ts
 * is — this module is bundled for the client.
 *
 * An RFQ is not the general enquiry form with more boxes. It carries line items:
 * a buyer pricing four grades wants four quantities against four specifications,
 * and flattening that into a free-text message is what makes quoting slow and
 * error-prone at the other end.
 */
import { materialHref } from "./portfolio";

export const rfqDirections = [
  "I want to buy material from IMS",
  "I want to sell material to IMS",
  "Both — an exchange or toll arrangement",
] as const;

export const rfqConditions = [
  "Prime / new material",
  "Revert or production scrap",
  "End-of-life or teardown material",
  "Not yet determined",
] as const;

export const rfqUnits = ["kg", "tonnes", "lb", "pieces"] as const;

export const rfqTimescales = [
  "Urgent — within 2 weeks",
  "This month",
  "This quarter",
  "Planning / budgetary only",
] as const;

export interface RfqLine {
  /** Grade id when picked from the catalogue; blank when typed by hand. */
  gradeId?: string;
  material: string;
  quantity: string;
  unit: string;
  condition: string;
  note?: string;
}

export interface RfqPayload {
  name: string;
  company: string;
  email: string;
  phone?: string;
  country?: string;
  direction: string;
  timescale?: string;
  lines: RfqLine[];
  message?: string;
}

/**
 * `lines` is excluded from the scalar half deliberately: it is a key of
 * RfqPayload, so leaving it in would intersect `string` with the per-line error
 * map and make the whole property unassignable.
 */
export type RfqFieldErrors = Partial<Record<Exclude<keyof RfqPayload, "lines">, string>> & {
  lines?: Record<number, Partial<Record<keyof RfqLine, string>>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MAX_LINES = 12;

export function emptyLine(): RfqLine {
  return { material: "", quantity: "", unit: "kg", condition: rfqConditions[3], note: "" };
}

/** Shared by the client form and the API route so both enforce the same rules. */
export function validateRfq(input: Partial<RfqPayload>): RfqFieldErrors {
  const errors: RfqFieldErrors = {};

  if (!input.name?.trim()) errors.name = "Please enter your name.";
  else if (input.name.trim().length > 120) errors.name = "Please keep this under 120 characters.";

  if (!input.company?.trim()) errors.company = "Please enter your company.";
  else if (input.company.trim().length > 160) errors.company = "Please keep this under 160 characters.";

  if (!input.email?.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(input.email.trim())) errors.email = "Please enter a valid email address.";

  if (!input.direction?.trim()) errors.direction = "Please tell us which way round this is.";
  else if (!rfqDirections.includes(input.direction as (typeof rfqDirections)[number]))
    errors.direction = "Please choose one of the listed options.";

  if (input.phone && input.phone.length > 40) errors.phone = "Please keep this under 40 characters.";
  if (input.country && input.country.length > 80) errors.country = "Please keep this under 80 characters.";
  if (input.message && input.message.length > 4000) errors.message = "Please keep this under 4000 characters.";

  const lines = input.lines ?? [];
  if (lines.length === 0) {
    errors.lines = { 0: { material: "Add at least one material." } };
  } else if (lines.length > MAX_LINES) {
    errors.lines = { 0: { material: `Please keep this to ${MAX_LINES} lines or fewer.` } };
  } else {
    const lineErrors: Record<number, Partial<Record<keyof RfqLine, string>>> = {};
    lines.forEach((line, i) => {
      const e: Partial<Record<keyof RfqLine, string>> = {};
      if (!line.material?.trim()) e.material = "Name the material or grade.";
      else if (line.material.length > 200) e.material = "Please keep this under 200 characters.";
      if (line.quantity && line.quantity.length > 60) e.quantity = "Please keep this under 60 characters.";
      if (line.note && line.note.length > 500) e.note = "Please keep this under 500 characters.";
      if (line.unit && !rfqUnits.includes(line.unit as (typeof rfqUnits)[number])) e.unit = "Unrecognised unit.";
      if (Object.keys(e).length) lineErrors[i] = e;
    });
    if (Object.keys(lineErrors).length) errors.lines = lineErrors;
  }

  return errors;
}

export function hasRfqErrors(errors: RfqFieldErrors): boolean {
  const { lines, ...rest } = errors;
  return Object.keys(rest).length > 0 || Boolean(lines && Object.keys(lines).length > 0);
}

/** Renders an RFQ as the plain-text body of the notification email. */
export function formatRfqText(payload: RfqPayload): string {
  const out: string[] = [
    "QUOTATION REQUEST",
    "",
    `Name:      ${payload.name}`,
    `Company:   ${payload.company}`,
    `Email:     ${payload.email}`,
  ];
  if (payload.phone) out.push(`Phone:     ${payload.phone}`);
  if (payload.country) out.push(`Country:   ${payload.country}`);
  out.push(`Direction: ${payload.direction}`);
  if (payload.timescale) out.push(`Timescale: ${payload.timescale}`);
  out.push("", `MATERIALS (${payload.lines.length})`, "");

  payload.lines.forEach((line, i) => {
    const qty = line.quantity ? `${line.quantity} ${line.unit}` : "quantity not stated";
    out.push(`${i + 1}. ${line.material}`);
    out.push(`   ${qty} · ${line.condition}`);
    if (line.note) out.push(`   Note: ${line.note}`);
    if (line.gradeId) out.push(`   Catalogue: https://ims-metals.com${materialHref(line.gradeId.split(":")[0])}`);
    out.push("");
  });

  if (payload.message) out.push("ADDITIONAL DETAIL", "", payload.message, "");
  return out.join("\n");
}
