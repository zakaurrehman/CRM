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
  quotes: MetalQuote[];
  fetchedAt: number;
}

let cache: MetalsPayload | null = null;
let inFlight: Promise<MetalsPayload | null> | null = null;

interface ProviderResponse {
  success?: boolean;
  rates?: Record<string, number>;
  /* Some plans return a parallel map of 24h changes. Absent on most, which is
     why `change` is optional all the way through to the UI. */
  change?: Record<string, number>;
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
  const symbols = trackedMetals.map((m) => m.symbol).join(",");

  const response = await fetch(endpointFor(provider, key, symbols), { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as ProviderResponse;
  if (data.success === false || !data.rates) return null;

  const quotes: MetalQuote[] = [];
  for (const metal of trackedMetals) {
    const rate = data.rates[metal.symbol];
    /* A provider that does not cover a metal omits it, or returns zero. Either
       way there is no price, so the row is dropped rather than shown empty. */
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) continue;

    quotes.push({
      symbol: metal.symbol,
      name: metal.name,
      category: metal.category,
      // The feed is inverted: rate is metal per unit of base currency.
      price: 1 / rate,
      change: typeof data.change?.[metal.symbol] === "number" ? data.change[metal.symbol] : undefined,
    });
  }

  if (quotes.length === 0) return null;
  return { base: BASE_CURRENCY, quotes, fetchedAt: Date.now() };
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
    } catch {
      return cache;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
