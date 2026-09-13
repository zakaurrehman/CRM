/**
 * Inquiry delivery. Server-only — imported by the API routes, never by a client
 * component. It pulls in Node built-ins through nodemailer, which would fail to
 * bundle for the browser.
 */
import { contact } from "./site";
import type { InquiryPayload } from "./inquiry";
import { formatRfqText, rfqSubject, type RfqPayload } from "./rfq";

function renderPlainText(payload: InquiryPayload): string {
  const line = (label: string, value?: string) => (value?.trim() ? `${label}: ${value.trim()}\n` : "");
  return (
    "New message from ims-metals.com\n\n" +
    line("Name", payload.name) +
    line("Company", payload.company) +
    line("Email", payload.email) +
    "\nMessage:\n" +
    payload.message.trim() +
    "\n"
  );
}

export type DeliveryResult = { ok: true } | { ok: false; reason: "unconfigured" | "failed" };

/** A file that travels with the message: the bytes, read once by the route. */
export interface OutboundAttachment {
  filename: string;
  contentType: string;
  content: Buffer;
}

/**
 * One outbound message, whichever form produced it.
 *
 * The three transports below are the same work for a message and for an
 * offer or supply request, so they take a rendered message rather than
 * knowing about either payload shape.
 */
export interface OutboundMessage {
  /** Distinguishes the two in logs and in the webhook body. */
  kind: "inquiry" | "rfq";
  subject: string;
  text: string;
  replyTo: string;
  /** The structured payload, for webhook consumers that want fields not prose. */
  data: Record<string, unknown>;
  attachments?: OutboundAttachment[];
}

/**
 * Delivers a message.
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
 * Attachments ride along on every transport: as mail attachments over SMTP
 * and Resend, and base64-encoded in the webhook body. Nothing is stored
 * here — the message is the only copy the site makes.
 *
 * With none set the caller is told the form is unconfigured, so the UI can fall
 * back to a prefilled mailto rather than silently dropping an enquiry.
 */
export async function deliverMessage(message: OutboundMessage): Promise<DeliveryResult> {
  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const to = process.env.INQUIRY_TO_EMAIL ?? contact.email;
  const attachments = message.attachments ?? [];

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
        attachments: attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })),
      });
      return { ok: true };
    }

    if (webhook) {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...message.data,
          kind: message.kind,
          receivedAt: new Date().toISOString(),
          attachments: attachments.map((a) => ({
            filename: a.filename,
            contentType: a.contentType,
            size: a.content.length,
            content: a.content.toString("base64"),
          })),
        }),
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
          attachments: attachments.map((a) => ({ filename: a.filename, content: a.content.toString("base64") })),
        }),
      });
      return response.ok ? { ok: true } : { ok: false, reason: "failed" };
    }

    if (process.env.NODE_ENV !== "production") {
      const files = attachments.map((a) => `${a.filename} (${a.content.length} bytes)`).join(", ");
      console.info(`[${message.kind}] No transport configured; message:\n${message.text}${files ? `\n[attachments] ${files}` : ""}`);
      return { ok: true };
    }

    return { ok: false, reason: "unconfigured" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

/** Contact-page message. Renders the payload, then hands it to the shared transports. */
export async function deliverInquiry(payload: InquiryPayload): Promise<DeliveryResult> {
  return deliverMessage({
    kind: "inquiry",
    subject: `Message from ${payload.company}`,
    text: renderPlainText(payload),
    replyTo: payload.email,
    data: payload as unknown as Record<string, unknown>,
  });
}

/** Offer or supply request. The line items are already rendered by formatRfqText. */
export async function deliverRfq(payload: RfqPayload, attachments: OutboundAttachment[] = []): Promise<DeliveryResult> {
  return deliverMessage({
    kind: "rfq",
    subject: rfqSubject(payload),
    text: formatRfqText(payload),
    replyTo: payload.email,
    data: payload as unknown as Record<string, unknown>,
    attachments,
  });
}
