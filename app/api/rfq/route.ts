import { NextResponse } from "next/server";
import { validateRfq, hasRfqErrors, MAX_LINES, type RfqLine, type RfqPayload } from "@/lib/rfq";
import { deliverRfq } from "@/lib/inquiry-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Quotation requests.
 *
 * Same shape as the inquiry endpoint — rate limit, honeypot, revalidate
 * server-side, deliver through whichever transport is configured — because a
 * public write endpoint gets the same treatment whatever it is called.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 500) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

const str = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  if (str(body.website)) return NextResponse.json({ ok: true });

  /* Rebuilt field by field rather than trusting the body: the line items are
     the part a caller could use to smuggle unbounded content into an email. */
  const rawLines = Array.isArray(body.lines) ? body.lines.slice(0, MAX_LINES) : [];
  const lines: RfqLine[] = rawLines.map((raw) => {
    const line = (raw ?? {}) as Record<string, unknown>;
    return {
      gradeId: str(line.gradeId) || undefined,
      material: str(line.material),
      quantity: str(line.quantity),
      unit: str(line.unit) || "kg",
      condition: str(line.condition),
      note: str(line.note) || undefined,
    };
  });

  const payload: RfqPayload = {
    name: str(body.name),
    company: str(body.company),
    email: str(body.email),
    phone: str(body.phone) || undefined,
    country: str(body.country) || undefined,
    direction: str(body.direction),
    timescale: str(body.timescale) || undefined,
    lines,
    message: str(body.message) || undefined,
  };

  const errors = validateRfq(payload);
  if (hasRfqErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const result = await deliverRfq(payload);

  if (!result.ok) {
    const unconfigured = result.reason === "unconfigured";
    return NextResponse.json(
      {
        ok: false,
        error: unconfigured
          ? "The quotation form is not connected yet. Please email us directly and we will pick it up straight away."
          : "We could not send your request just now. Please try again, or email us directly.",
        fallbackToEmail: true,
      },
      { status: unconfigured ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
