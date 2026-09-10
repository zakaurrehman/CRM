import "server-only";
import { BASE_CURRENCY, METALS_TTL_MS, trackedMetals } from "./config";

/** Whether a metals feed is configured at all. Server-side only. */
export function isMetalsConfigured(): boolean {
  return Boolean(process.env.METALS_API_KEY);
}

/**
 * Metals prices, fetched server-side and cached.
 *
 * METALS_API_KEY is read here and nowhere else. This module is marked
 * server-only, so importing it from a client component is a build error rather
 * than a leaked key.
 *
 * The provider is chosen by METALS_API_PROVIDER because the key was supplied
 * without naming its service. The two common ones share a response shape —
 * `{ success, base, rates: { XNI: 0.0000642 } }` — where the rate is inverted:
 * it says how many units of the metal one unit of base currency buys, so the
 * price per unit is 1/rate. They differ in the query parameter names, which is
 * all the adapters below actually encode.
 *
 * If the shape turns out to differ, this is the one file to change.
 */

export interface MetalQuote {
  symbol: string;
  name: string;
  category?: string;
  /** Price per troy ounce or per tonne, in the base currency, as the provider reports it. */
  price: number;
  /** Fractional change since the previous close, when the provider supplies it. */
  change?: number;
}

export interface MetalsPayload {
  base: string;
  /** What the prices are per, as the provider reports it. */
  unit?: string;
  quotes: MetalQuote[];
  fetchedAt: number;
}

let cache: MetalsPayload | null = null;
let inFlight: Promise<MetalsPayload | null> | null = null;

/**
 * Why the last fetch produced nothing, for diagnosis.
 *
 * Never contains the key. The request URL is never recorded, and any substring
 * matching the key is redacted from provider messages before it is stored.
 */
let lastError: string | null = null;

export function getMetalsError(): string | null {
  return lastError;
}

/** Removes the key from any text before it can leave the server. */
function redact(text: string): string {
  const key = process.env.METALS_API_KEY;
  const safe = text.slice(0, 300);
  return key ? safe.split(key).join("[key]") : safe;
}

interface ProviderResponse {
  success?: boolean;
  /** The quote unit the provider applied, when it reports one. */
  unit?: string;
  rates?: Record<string, number>;
  /* Both providers report failures in an `error` object rather than an HTTP
     status, so a 200 can still be a rejection. */
  error?: { code?: number; type?: string; info?: string; message?: string };
  /* Some plans return a parallel map of 24h changes. Absent on most, which is
     why `change` is optional all the way through to the UI. */
  change?: Record<string, number>;
}

function symbolsEndpointFor(provider: string, key: string): string {
  switch (provider) {
    case "metalpriceapi":
      return `https://api.metalpriceapi.com/v1/symbols?api_key=${encodeURIComponent(key)}`;
    case "metals-api":
    default:
      return `https://metals-api.com/api/symbols?access_key=${encodeURIComponent(key)}`;
  }
}

/**
 * Symbols this key can actually see, cached for a day.
 *
 * Coverage changes when a plan changes, not minute to minute, so this is worth
 * asking once. Null means the question could not be answered, and the caller
 * then requests its full wanted list — no worse than before this existed.
 */
let symbolCache: { at: number; symbols: Set<string> } | null = null;
const SYMBOLS_TTL_MS = 24 * 60 * 60 * 1000;

let symbolsNote = "not attempted";

async function supportedSymbols(provider: string, key: string): Promise<Set<string> | null> {
  if (symbolCache && Date.now() - symbolCache.at < SYMBOLS_TTL_MS) return symbolCache.symbols;
  try {
    const response = await fetch(symbolsEndpointFor(provider, key), { cache: "no-store" });
    if (!response.ok) { symbolsNote = `symbols endpoint HTTP ${response.status}`; return null; }
    const body = (await response.json()) as { data?: unknown; symbols?: unknown; success?: boolean };
    // Same envelope as the rates endpoint.
    const inner = (body.data && typeof body.data === "object" ? body.data : body) as Record<string, unknown>;

    /* The codes arrive as the payload's own keys — AAAU, ADA, AED, ALU … — not
       under a "symbols" property. Both shapes are handled because the other
       provider does nest them. */
    const nested = inner.symbols as Record<string, string> | string[] | undefined;
    const raw = nested ?? inner;
    const codes = Array.isArray(raw) ? raw : Object.keys(raw);
    // Drop the envelope's own bookkeeping fields.
    const symbols = new Set(codes.filter((c) => !["success", "timestamp", "base", "date", "unit"].includes(c)));
    if (symbols.size === 0) { symbolsNote = "symbols endpoint gave no codes"; return null; }
    if (symbols.size === 0) return null;
    symbolsNote = `${symbols.size} symbols known`;
    symbolCache = { at: Date.now(), symbols };
    return symbols;
  } catch (e) {
    symbolsNote = `symbols endpoint threw: ${e instanceof Error ? e.message : String(e)}`;
    return null;
  }
}

function endpointFor(provider: string, key: string, symbols: string): string {
  const list = encodeURIComponent(symbols);
  switch (provider) {
    case "metalpriceapi":
      return `https://api.metalpriceapi.com/v1/latest?api_key=${encodeURIComponent(key)}&base=${BASE_CURRENCY}&currencies=${list}`;
    case "metals-api":
    default:
      return `https://metals-api.com/api/latest?access_key=${encodeURIComponent(key)}&base=${BASE_CURRENCY}&symbols=${list}`;
  }
}

async function fetchQuotes(): Promise<MetalsPayload | null> {
  const key = process.env.METALS_API_KEY;
  if (!key) return null;

  const provider = process.env.METALS_API_PROVIDER || "metals-api";

  /* One unrecognised symbol rejects the entire request, so ask what exists
     before asking for prices. When the list cannot be fetched, fall back to
     requesting everything — which is what happened before, and no worse. */
  const available = await supportedSymbols(provider, key);

  /* Take the first candidate the provider confirms. Without a list there is
     nothing to check against, so only the first candidate is tried — better a
     short request that succeeds than a long one rejected outright. */
  const wanted = trackedMetals
    .map((m) => ({
      spec: m,
      symbol: available ? m.symbols.find((s) => available.has(s)) : m.symbols[0],
    }))
    .filter((x): x is { spec: (typeof trackedMetals)[number]; symbol: string } => Boolean(x.symbol));

  if (wanted.length === 0) {
    lastError = redact(
      `${provider} supports none of the tracked metals. Tried: ${trackedMetals.flatMap((m) => m.symbols).join(", ")}. ` +
        `Provider offers ${available ? available.size : 0} symbols.`,
    );
    return null;
  }

  const symbols = wanted.map((w) => w.symbol).join(",");

  const response = await fetch(endpointFor(provider, key, symbols), { cache: "no-store" });
  if (!response.ok) {
    lastError = redact(`${provider} returned HTTP ${response.status} ${response.statusText}`);
    return null;
  }

  const body = (await response.json()) as ProviderResponse & { data?: ProviderResponse };

  /* Some deployments wrap the whole payload in a "data" envelope, so both the
     rates and the error object sit a level down. Unwrap before anything else,
     or a rejection reads as "no rates" and the reason never surfaces. */
  const data: ProviderResponse = body.data && typeof body.data === "object" ? body.data : body;

  if (data.success === false || data.error) {
    const e = data.error;
    lastError = redact(
      `${provider} rejected the request` +
        (e?.type ? `: ${e.type}` : "") +
        (e?.info || e?.message ? ` — ${e.info || e.message}` : "") +
        (e?.code ? ` (code ${e.code})` : "") +
        ` [discovery: ${symbolsNote}; asked for: ${symbols}]`,
    );
    return null;
  }

  if (!data.rates) {
    /* Report the shape, not just the top-level keys. "Keys present: data" says
       the adapter is wrong without saying what to change it to; two levels and a
       short sample is enough to write the right one. */
    const shape = (obj: unknown, depth = 0): string => {
      if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
      if (Array.isArray(obj)) return `[${obj.length} items] ${depth < 2 ? shape(obj[0], depth + 1) : ""}`;
      const entries = Object.entries(obj as Record<string, unknown>).slice(0, 8);
      return "{" + entries.map(([k, v]) => k + ": " + (depth < 2 ? shape(v, depth + 1) : typeof v)).join(", ") + "}";
    };
    lastError = redact(`${provider} returned no "rates" key. Response shape: ${shape(data)}`);
    return null;
  }

  const quotes: MetalQuote[] = [];
  for (const { spec, symbol } of wanted) {
    const rate = data.rates[symbol];
    /* A provider that does not cover a metal omits it, or returns zero. Either
       way there is no price, so the row is dropped rather than shown empty. */
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) continue;

    quotes.push({
      symbol,
      name: spec.name,
      category: spec.category,
      // The feed is inverted: rate is metal per unit of base currency.
      price: 1 / rate,
      change: typeof data.change?.[symbol] === "number" ? data.change[symbol] : undefined,
    });
  }

  /*
   * Plausibility guard.
   *
   * The feed returns numbers but not, reliably, the unit they are in: asking
   * for metric tonnes is rejected on this plan, and the values that come back
   * put nickel at 0.52 when LME nickel trades around $15,000 a tonne. Some
   * reconcile as troy ounces and others are half again too high, so the unit
   * cannot be inferred from the data either.
   *
   * Rather than publish figures labelled "/ MT" that are not per tonne, they
   * are rejected outright. A wrong price on a metals trading site is worse
   * than no price, and this is the one thing the brief was explicit about.
   */
  const implausible = quotes.filter((q) => q.price < 200);
  if (implausible.length > 0) {
    lastError = redact(
      `${provider} returned values that are not prices per tonne — ` +
        implausible.slice(0, 4).map((q) => `${q.name} ${q.price.toFixed(2)}`).join(", ") +
        `. The unit=mt parameter is rejected on this plan, so the quote unit needs confirming with the provider.`,
    );
    return null;
  }

  if (quotes.length === 0) {
    /* The commonest real cause: the plan covers precious metals but not the
       industrial ones IMS actually trades. Naming what did come back makes that
       obvious at a glance. */
    lastError = redact(
      `${provider} covered none of the requested symbols. Asked for: ${symbols}. Returned: ${Object.keys(data.rates).join(", ") || "nothing"}`,
    );
    return null;
  }

  lastError = null;
  return { base: BASE_CURRENCY, quotes, fetchedAt: Date.now(), unit: data.unit };
}

/**
 * Current metals prices.
 *
 * Returns null when there is no key, when the provider fails, or when nothing
 * usable came back. The caller renders nothing in that case — an empty widget
 * is better than a widget full of guesses, and the brief is explicit that
 * prices are never to be invented.
 */
export async function getMetals(): Promise<MetalsPayload | null> {
  if (!isMetalsConfigured()) return null;
  if (cache && Date.now() - cache.fetchedAt < METALS_TTL_MS) return cache;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const fresh = await fetchQuotes();
      if (fresh) {
        cache = fresh;
        return fresh;
      }
      /* Serving a stale quote is defensible where serving an invented one is
         not: it was real, and the response carries the timestamp so the UI can
         say how old it is. */
      return cache;
    } catch (e) {
      lastError = redact(e instanceof Error ? e.message : String(e));
      return cache;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
