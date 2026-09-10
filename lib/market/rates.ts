import "server-only";
import { BASE_CURRENCY, RATES_TTL_MS, supportedCurrencies, type Currency } from "./config";

/**
 * Currency rates, fetched server-side and cached.
 *
 * The IMS webapp already uses exchangerate-api.com, which needs no key, so the
 * same source is used here rather than introducing a second one that would
 * disagree with it. The difference is that this runs on the server and caches:
 * the existing hook fetches from every visitor's browser on a thirty-minute
 * timer, which is a request per visitor per half hour for data that is
 * identical for everyone.
 *
 * If OPENEXCHANGERATES_APP_ID is set it takes precedence, since a paid feed is
 * presumably there because it is wanted. It is read only here, on the server,
 * and never sent to the browser.
 */

interface RatesPayload {
  base: Currency;
  rates: Record<string, number>;
  fetchedAt: number;
  source: "openexchangerates" | "exchangerate-api";
}

let cache: RatesPayload | null = null;
let inFlight: Promise<RatesPayload | null> | null = null;

async function fetchOpenExchangeRates(appId: string): Promise<RatesPayload | null> {
  const symbols = supportedCurrencies.filter((c) => c !== BASE_CURRENCY).join(",");
  const url =
    `https://openexchangerates.org/api/latest.json?app_id=${encodeURIComponent(appId)}` +
    `&base=${BASE_CURRENCY}&symbols=${symbols}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as { rates?: Record<string, number> };
  if (!data.rates) return null;

  return {
    base: BASE_CURRENCY,
    rates: { [BASE_CURRENCY]: 1, ...data.rates },
    fetchedAt: Date.now(),
    source: "openexchangerates",
  };
}

async function fetchExchangeRateApi(): Promise<RatesPayload | null> {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;

  const data = (await response.json()) as { rates?: Record<string, number> };
  if (!data.rates) return null;

  /* Keep only what the selector offers. The endpoint returns a hundred and
     sixty currencies and there is no reason to ship the rest to the browser. */
  const rates: Record<string, number> = { [BASE_CURRENCY]: 1 };
  for (const code of supportedCurrencies) {
    const value = data.rates[code];
    if (typeof value === "number" && Number.isFinite(value)) rates[code] = value;
  }

  return { base: BASE_CURRENCY, rates, fetchedAt: Date.now(), source: "exchangerate-api" };
}

/**
 * Current rates, or null if both sources fail.
 *
 * Null means "we do not know", and the caller shows prices in USD only rather
 * than converting with a stale or invented number.
 */
export async function getRates(): Promise<RatesPayload | null> {
  if (cache && Date.now() - cache.fetchedAt < RATES_TTL_MS) return cache;

  // Collapse concurrent requests onto one upstream call.
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const appId = process.env.OPENEXCHANGERATES_APP_ID;
      const fresh = appId ? await fetchOpenExchangeRates(appId) : await fetchExchangeRateApi();
      if (fresh) {
        cache = fresh;
        return fresh;
      }
      /* Upstream failed. A cached payload past its TTL is still far better than
         nothing — rates do not move enough in an hour to mislead anyone, and the
         response carries fetchedAt so the age is visible. */
      return cache;
    } catch {
      return cache;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
