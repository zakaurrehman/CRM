import { NextResponse } from "next/server";
import { validateInquiry, type InquiryPayload } from "@/lib/inquiry";
import { deliverInquiry } from "@/lib/inquiry-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Fixed-window rate limit, per instance.
 *
 * Enough to stop a script hammering the endpoint from one address. A multi-region
 * deployment should move this to shared storage; the window is deliberately small
 * so the in-memory map cannot grow unbounded.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep of expired entries.
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

  // Honeypot: a real user never fills a field that is hidden from them.
  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const payload: InquiryPayload = {
    name: str(body.name),
    company: str(body.company),
    email: str(body.email),
    phone: str(body.phone),
    country: str(body.country),
    requirementType: str(body.requirementType),
    material: str(body.material),
    industry: str(body.industry),
    quantity: str(body.quantity),
    message: str(body.message),
  };

  const errors = validateInquiry(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const result = await deliverInquiry(payload);

  if (!result.ok) {
    const unconfigured = result.reason === "unconfigured";
    return NextResponse.json(
      {
        ok: false,
        error: unconfigured
          ? "The inquiry form is not connected yet. Please email us directly and we will pick it up straight away."
          : "We could not send your inquiry just now. Please try again, or email us directly.",
        fallbackToEmail: true,
      },
      { status: unconfigured ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
