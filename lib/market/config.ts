/**
 * Live market data configuration.
 *
 * Two independent feeds, deliberately kept separate so one being unconfigured
 * never takes the other down:
 *
 *   - metals prices, which need METALS_API_KEY
 *   - currency rates, which do not need a key at all
 *
 * Nothing here is imported by client code. The API key is read in
 * lib/market/metals.ts, which only ever runs on the server.
 */

/**
 * The metals IMS actually trades, with the symbols the price APIs use.
 *
 * Coverage varies by provider — most cover the LME base metals well, and
 * titanium, tungsten and molybdenum patchily. Anything a provider does not
 * return is simply omitted from the response rather than guessed at, so the
 * widget shows fewer rows rather than invented numbers.
 */
export interface MetalSpec {
  /** Provider symbol, e.g. XNI for nickel. */
  symbol: string;
  /** English name, translated at render through the phrase table. */
  name: string;
  /** Slug of the alloy category this metal leads, for linking through. */
  category?: string;
}

export const trackedMetals: MetalSpec[] = [
  { symbol: "XNI", name: "Nickel", category: "nickel-alloys" },
  { symbol: "XCO", name: "Cobalt", category: "cobalt-alloys" },
  { symbol: "XCU", name: "Copper", category: "copper-nickel-alloys" },
  { symbol: "XAL", name: "Aluminium" },
  { symbol: "XZN", name: "Zinc" },
  { symbol: "XSN", name: "Tin" },
  { symbol: "TITANIUM", name: "Titanium", category: "titanium-alloys" },
  { symbol: "MOLYBDENUM", name: "Molybdenum" },
];

/**
 * Currencies offered in the selector.
 *
 * Matches the set already used in the IMS webapp's exchange-rate hook, so the
 * two surfaces offer the same choices rather than diverging.
 */
export const supportedCurrencies = ["USD", "EUR", "ILS", "GBP", "RUB", "AED", "CNY"] as const;
export type Currency = (typeof supportedCurrencies)[number];

export const BASE_CURRENCY: Currency = "USD";

/** Symbols for display. Falls back to the ISO code where there is no glyph. */
export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  ILS: "₪",
  GBP: "£",
  RUB: "₽",
  AED: "AED",
  CNY: "¥",
};

/**
 * How long a fetched quote is served before going upstream again.
 *
 * Metals move continuously but this is a shop window, not a trading screen —
 * fifteen minutes is current enough to be honest and keeps the site well inside
 * any provider's request allowance no matter how much traffic arrives. Rates
 * move far more slowly, so they are held for an hour, matching the half-hour
 * refresh the existing webapp hook uses without hammering a free endpoint.
 */
export const METALS_TTL_MS = 15 * 60 * 1000;
export const RATES_TTL_MS = 60 * 60 * 1000;

/* isMetalsConfigured lives in metals.ts, not here. This module is imported by
   the client widget for its currency list, and a module the browser can import
   should not read process.env at all — even for a value Next would replace
   with undefined. Keeping the boundary obvious is worth more than the one
   shared line. */
