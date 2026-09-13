/**
 * Offer / supply request model.
 *
 * Shared by the browser form and the API route so both enforce identical rules,
 * and deliberately free of server-only imports for the same reason lib/inquiry.ts
 * is — this module is bundled for the client.
 *
 * Two journeys, one form (IMS, 14 September 2026): someone selling material
 * to IMS and someone buying from IMS ask for different things — a seller has
 * an analysis and photographs, a buyer has a required chemistry and a
 * delivery point — so the direction is chosen first and the fields follow.
 * Both carry line items: a buyer pricing four grades wants four quantities
 * against four specifications, and flattening that into prose is what makes
 * the answer slow at the other end.
 */
import { acceptedForms } from "@/data/portfolio";
import { materialHref } from "./portfolio";

export type RfqDirection = "sell" | "buy";

export const rfqDirections: RfqDirection[] = ["sell", "buy"];

/** The radio labels, under "I want to:". */
export const rfqDirectionLabels: Record<RfqDirection, string> = {
  sell: "Sell material to IMS",
  buy: "Buy material from IMS",
};

export function isRfqDirection(value: unknown): value is RfqDirection {
  return value === "sell" || value === "buy";
}

/** The accepted forms, plus the honest answer for a lot that is several. */
export const rfqForms = [...acceptedForms.map((f) => f.name), "Mixed or other"] as const;

export const rfqUnits = ["kg", "tonnes", "lb", "pieces"] as const;

export interface RfqLine {
  /** Grade id when picked from the catalogue; blank when typed by hand. */
  gradeId?: string;
  material: string;
  /** One of rfqForms, or blank. */
  form: string;
  quantity: string;
  unit: string;
  /** Selling: the available analysis. Buying: the required chemistry or specification. */
  spec?: string;
}

/** What the server keeps about a file: enough for the email, never the bytes. */
export interface RfqAttachmentMeta {
  name: string;
  size: number;
  type: string;
}

export interface RfqPayload {
  direction: RfqDirection;
  name: string;
  company: string;
  email: string;
  phone?: string;
  /** Selling: where the material is. Buying: where it is to be delivered. */
  location?: string;
  lines: RfqLine[];
  message?: string;
  attachments?: RfqAttachmentMeta[];
}

/**
 * `lines` is excluded from the scalar half deliberately: it is a key of
 * RfqPayload, so leaving it in would intersect `string` with the per-line error
 * map and make the whole property unassignable.
 */
export type RfqFieldErrors = Partial<Record<Exclude<keyof RfqPayload, "lines" | "attachments">, string>> & {
  lines?: Record<number, Partial<Record<keyof RfqLine, string>>>;
  attachments?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MAX_LINES = 12;

/* ── Attachments ──────────────────────────────────────────────────────── */

/**
 * Limits, in one place for the form and the route.
 *
 * The total is set by the host: Vercel's serverless functions refuse request
 * bodies over 4.5 MB, so the form keeps a submission under 4 MB and reduces
 * photographs in the browser before sending (a phone photograph is 3–6 MB as
 * taken, ~300 KB at 1600px). Anything larger — a full inspection report, a
 * set of originals — goes by email, and the form says so.
 */
export const ATTACHMENT_LIMITS = {
  maxFiles: 8,
  maxFileBytes: 4 * 1024 * 1024,
  maxTotalBytes: 4 * 1024 * 1024,
} as const;

/** What IMS asked to receive: analyses and COAs, photographs, packing lists, specifications, spreadsheets, inspection reports. */
export const ATTACHMENT_TYPES: { ext: string; mime: string[] }[] = [
  { ext: "pdf", mime: ["application/pdf"] },
  { ext: "jpg", mime: ["image/jpeg"] },
  { ext: "jpeg", mime: ["image/jpeg"] },
  { ext: "png", mime: ["image/png"] },
  { ext: "webp", mime: ["image/webp"] },
  { ext: "xls", mime: ["application/vnd.ms-excel"] },
  { ext: "xlsx", mime: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] },
  { ext: "csv", mime: ["text/csv", "application/csv", "text/plain"] },
  { ext: "doc", mime: ["application/msword"] },
  { ext: "docx", mime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] },
];

/** For the file input's `accept`. */
export const ATTACHMENT_ACCEPT = ATTACHMENT_TYPES.map((t) => "." + t.ext).join(",");

/** For the hint under the input: "PDF, JPG, PNG, WebP, XLS, XLSX, CSV, DOC, DOCX". */
export const ATTACHMENT_FORMATS = "PDF, JPG, PNG, WebP, XLS, XLSX, CSV, DOC, DOCX";

export function isImageAttachment(type: string): boolean {
  return type === "image/jpeg" || type === "image/png" || type === "image/webp";
}

/**
 * Why a file cannot be attached, or null. Judged on the extension first —
 * browsers report the MIME type of a CSV or an old .xls inconsistently — and
 * on the MIME type only when the browser gives one that contradicts it.
 */
export function attachmentProblem(file: { name: string; size: number; type: string }): string | null {
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  const known = ATTACHMENT_TYPES.find((t) => t.ext === ext);
  if (!known) return "This file type is not accepted.";
  if (file.type && !known.mime.includes(file.type) && !(ext === "csv" && file.type.startsWith("text/"))) {
    return "This file type is not accepted.";
  }
  if (file.size === 0) return "This file is empty.";
  if (file.size > ATTACHMENT_LIMITS.maxFileBytes) return "This file is larger than the limit.";
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Validation ───────────────────────────────────────────────────────── */

export function emptyLine(): RfqLine {
  return { material: "", form: "", quantity: "", unit: "kg", spec: "" };
}

/** Shared by the client form and the API route so both enforce the same rules. */
export function validateRfq(input: Partial<RfqPayload>): RfqFieldErrors {
  const errors: RfqFieldErrors = {};

  if (!isRfqDirection(input.direction)) errors.direction = "Please tell us whether you are selling or buying.";

  if (!input.name?.trim()) errors.name = "Please enter your name.";
  else if (input.name.trim().length > 120) errors.name = "Please keep this under 120 characters.";

  if (!input.company?.trim()) errors.company = "Please enter your company.";
  else if (input.company.trim().length > 160) errors.company = "Please keep this under 160 characters.";

  if (!input.email?.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(input.email.trim())) errors.email = "Please enter a valid email address.";

  if (input.phone && input.phone.length > 40) errors.phone = "Please keep this under 40 characters.";
  if (input.location && input.location.length > 120) errors.location = "Please keep this under 120 characters.";
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
      if (line.form && !rfqForms.includes(line.form as (typeof rfqForms)[number])) e.form = "Please choose one of the listed forms.";
      if (line.quantity && line.quantity.length > 60) e.quantity = "Please keep this under 60 characters.";
      if (line.spec && line.spec.length > 500) e.spec = "Please keep this under 500 characters.";
      if (line.unit && !rfqUnits.includes(line.unit as (typeof rfqUnits)[number])) e.unit = "Unrecognised unit.";
      if (Object.keys(e).length) lineErrors[i] = e;
    });
    if (Object.keys(lineErrors).length) errors.lines = lineErrors;
  }

  const files = input.attachments ?? [];
  if (files.length > ATTACHMENT_LIMITS.maxFiles) errors.attachments = "Too many files attached.";
  else if (files.reduce((n, f) => n + f.size, 0) > ATTACHMENT_LIMITS.maxTotalBytes) errors.attachments = "The attachments are larger than the limit together.";
  else {
    const bad = files.map(attachmentProblem).find((problem) => problem !== null);
    if (bad) errors.attachments = bad;
  }

  return errors;
}

export function hasRfqErrors(errors: RfqFieldErrors): boolean {
  const { lines, ...rest } = errors;
  return Object.keys(rest).length > 0 || Boolean(lines && Object.keys(lines).length > 0);
}

/* ── Rendering ────────────────────────────────────────────────────────── */

export function rfqSubject(payload: RfqPayload): string {
  const count = payload.lines.length;
  const what = `${count} material${count === 1 ? "" : "s"}`;
  return payload.direction === "sell"
    ? `Material offered: ${what} — ${payload.company}`
    : `Supply requested: ${what} — ${payload.company}`;
}

/** Renders an offer or request as the plain-text body of the notification email. */
export function formatRfqText(payload: RfqPayload): string {
  const selling = payload.direction === "sell";
  const out: string[] = [
    selling ? "MATERIAL OFFERED TO IMS" : "SUPPLY REQUESTED FROM IMS",
    "",
    `Name:      ${payload.name}`,
    `Company:   ${payload.company}`,
    `Email:     ${payload.email}`,
  ];
  if (payload.phone) out.push(`Phone:     ${payload.phone}`);
  if (payload.location) out.push(`${selling ? "Material at" : "Deliver to"}: ${payload.location}`);
  out.push("", `MATERIALS (${payload.lines.length})`, "");

  payload.lines.forEach((line, i) => {
    const qty = line.quantity ? `${line.quantity} ${line.unit}` : "quantity not stated";
    out.push(`${i + 1}. ${line.material}`);
    out.push(`   ${qty}${line.form ? ` · ${line.form}` : ""}`);
    if (line.spec) out.push(`   ${selling ? "Analysis" : "Required"}: ${line.spec}`);
    if (line.gradeId) out.push(`   Catalogue: https://ims-metals.com${materialHref(line.gradeId.split(":")[0])}`);
    out.push("");
  });

  if (payload.message) out.push("ADDITIONAL DETAIL", "", payload.message, "");

  if (payload.attachments?.length) {
    out.push(`ATTACHMENTS (${payload.attachments.length})`, "");
    for (const f of payload.attachments) out.push(`- ${f.name} (${formatBytes(f.size)})`);
    out.push("");
  }
  return out.join("\n");
}
