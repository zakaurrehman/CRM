/**
 * Inquiry delivery. Server-only — imported by the API route, never by a client
 * component. It pulls in Node built-ins through nodemailer, which would fail to
 * bundle for the browser.
 */
import { contact } from "./site";
import type { InquiryPayload } from "./inquiry";
import { formatRfqText, type RfqPayload } from "./rfq";

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
 * One outbound message, whichever form produced it.
 *
 * The three transports below are the same work for an enquiry and for a
 * quotation request, so they take a rendered message rather than knowing about
 * either payload shape.
 */
export interface OutboundMessage {
  /** Distinguishes the two in logs and in the webhook body. */
  kind: "inquiry" | "rfq";
  subject: string;
  text: string;
  replyTo: string;
  /** The structured payload, for webhook consumers that want fields not prose. */
  data: Record<string, unknown>;
}

/**
 * Delivers an inquiry.
 *
 * Three transports, tried in order, all configured through server-side
 * environment variables so no credential ever reaches the browser:
 *
 *   INQUIRY_WEBHOOK_URL - POSTs the JSON payload (CRM, Zapier, Make, etc.)
 *   SMTP_HOST + SMTP_USER + SMTP_PASSWORD - sends through an existing mailbox
 *   RESEND_API_KEY      - sends via the Resend HTTP API
 *
 * SMTP is usually the shortest path for a company that already runs its own
 * domain mail: no new account, no new service, and the message leaves from an
 * address the recipient already trusts.
 *
 * With none set the caller is told the form is unconfigured, so the UI can fall
 * back to a prefilled mailto rather than silently dropping an enquiry.
 */
export async function deliverMessage(message: OutboundMessage): Promise<DeliveryResult> {
  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const to = process.env.INQUIRY_TO_EMAIL ?? contact.email;

  try {
    if (smtpHost) {
      // Imported lazily so the dependency is only loaded when SMTP is in use.
      const nodemailer = (await import("nodemailer")).default;
      const port = Number(process.env.SMTP_PORT ?? 587);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        // 465 is implicit TLS; 587 and 25 upgrade with STARTTLS.
        secure: port === 465,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
          : undefined,
      });
      await transporter.sendMail({
        from: process.env.INQUIRY_FROM_EMAIL ?? process.env.SMTP_USER ?? to,
        to,
        replyTo: message.replyTo,
        subject: message.subject,
        text: message.text,
      });
      return { ok: true };
    }

    if (webhook) {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...message.data, kind: message.kind, receivedAt: new Date().toISOString() }),
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
          reply_to: message.replyTo,
          subject: message.subject,
          text: message.text,
        }),
      });
      return response.ok ? { ok: true } : { ok: false, reason: "failed" };
    }

    if (process.env.NODE_ENV !== "production") {
      console.info(`[${message.kind}] No transport configured; message:\n${message.text}`);
      return { ok: true };
    }

    return { ok: false, reason: "unconfigured" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

/** Inquiry form. Renders the payload, then hands it to the shared transports. */
export async function deliverInquiry(payload: InquiryPayload): Promise<DeliveryResult> {
  return deliverMessage({
    kind: "inquiry",
    subject: `Inquiry: ${payload.requirementType} — ${payload.company}`,
    text: renderPlainText(payload),
    replyTo: payload.email,
    data: payload as unknown as Record<string, unknown>,
  });
}

/** Quotation request. The line items are already rendered by formatRfqText. */
export async function deliverRfq(payload: RfqPayload): Promise<DeliveryResult> {
  const count = payload.lines.length;
  return deliverMessage({
    kind: "rfq",
    subject: `RFQ: ${count} material${count === 1 ? "" : "s"} — ${payload.company}`,
    text: formatRfqText(payload),
    replyTo: payload.email,
    data: payload as unknown as Record<string, unknown>,
  });
}
