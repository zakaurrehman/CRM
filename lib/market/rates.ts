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

/* ----------------------------------------------------------------- movement */

/**
 * Day-over-day change per currency, as a fraction in the feed's own direction
 * (units per one USD): 0.0031 means a dollar buys 0.31% more of it than it did
 * the previous business day.
 *
 * The rates themselves come from exchangerate-api, which serves no history on
 * its free tier. The European Central Bank's reference rates do, keylessly, via
 * Frankfurter, so the movement comes from there. Mixing a level from one source
 * with a change from another is acceptable here because the change is a ratio
 * computed entirely within the ECB series — both ends of it are the same source
 * on consecutive business days — and both sources are mid-market rates for the
 * same instrument. What must not happen is comparing today from one source
 * against yesterday from another, which would invent movement out of the
 * difference between two providers' rounding.
 *
 * "Consecutive business days" rather than "today and yesterday": the ECB
 * publishes once a day at about 16:00 CET, so the latest available date is
 * often yesterday, and a weekend has no dates at all. A short range is asked
 * for and the last two dates in it are compared.
 *
 * AED is not in the ECB set. It is pegged to the dollar (3.6725 since 1997), so
 * its day change is genuinely nil; the board says so rather than leaving a gap.
 */
let changeCache: { at: number; change: Record<string, number>; asOf: string } | null = null;
let changeNote: string | null = null;

export function getRatesChangeNote(): string | null {
  return changeNote;
}

export async function getRatesChange(): Promise<{ change: Record<string, number>; asOf: string } | null> {
  if (changeCache && Date.now() - changeCache.at < RATES_TTL_MS) {
    return { change: changeCache.change, asOf: changeCache.asOf };
  }

  const wanted = supportedCurrencies.filter((c) => c !== BASE_CURRENCY);
  const day = (ago: number) => new Date(Date.now() - ago * 86400000).toISOString().slice(0, 10);

  try {
    /* A week back is enough to guarantee two business days, including over a
       long weekend; the response is tiny either way. */
    const url =
      `https://api.frankfurter.app/${day(7)}..${day(0)}` +
      `?from=${BASE_CURRENCY}&to=${wanted.join(",")}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      changeNote = `ECB range HTTP ${response.status}`;
      return null;
    }
    const body = (await response.json()) as { rates?: Record<string, Record<string, number>> };
    const dates = Object.keys(body.rates ?? {}).sort();
    if (dates.length < 2) {
      changeNote = `ECB range returned ${dates.length} date(s); two are needed`;
      return null;
    }
    const [prevDate, lastDate] = dates.slice(-2);
    const prev = body.rates![prevDate];
    const last = body.rates![lastDate];

    const change: Record<string, number> = {};
    for (const code of wanted) {
      const a = prev[code];
      const b = last[code];
      if (typeof a === "number" && a > 0 && typeof b === "number" && b > 0) change[code] = b / a - 1;
    }
    if (Object.keys(change).length === 0) {
      changeNote = "ECB range carried none of the wanted currencies";
      return null;
    }

    changeNote = `ECB ${prevDate} → ${lastDate}: ${Object.keys(change).length} of ${wanted.length} currencies`;
    changeCache = { at: Date.now(), change, asOf: lastDate };
    return { change, asOf: lastDate };
  } catch (e) {
    changeNote = e instanceof Error ? e.message : String(e);
    return changeCache ? { change: changeCache.change, asOf: changeCache.asOf } : null;
  }
}
