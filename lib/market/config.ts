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
  /**
   * Codes to try, most likely first.
   *
   * These services do not agree on naming — one publishes ALU where another
   * has XAL — and asking for a code a provider does not know rejects the whole
   * request, not just that line. Listing candidates and taking whichever is
   * confirmed avoids having to know which convention is in play.
   */
  symbols: string[];
  /** English name, translated at render through the phrase table. */
  name: string;
  /** Slug of the alloy category this metal leads, for linking through. */
  category?: string;
  /** Element symbol, shown as a watermark on the board. Steel scrap takes Fe. */
  element: string;
}

export const trackedMetals: MetalSpec[] = [
  { symbols: ["LME-NI", "NICKEL", "XNI"], element: "Ni", name: "Nickel", category: "nickel-alloys" },
  { symbols: ["LCO", "COBALT", "XCO"], element: "Co", name: "Cobalt", category: "cobalt-alloys" },
  { symbols: ["LME-XCU", "COPPER", "XCU"], element: "Cu", name: "Copper", category: "copper-nickel-alloys" },
  { symbols: ["LME-ALU", "ALU", "ALUMINIUM"], element: "Al", name: "Aluminium" },
  { symbols: ["LME-ZNC", "ZINC", "XZN"], element: "Zn", name: "Zinc" },
  { symbols: ["LME-TIN", "TIN", "XSN"], element: "Sn", name: "Tin" },
  { symbols: ["LME-LEAD", "LEAD", "XPB"], element: "Pb", name: "Lead" },
  { symbols: ["MO", "MOLYBDENUM"], element: "Mo", name: "Molybdenum" },
  { symbols: ["STEEL-SC"], element: "Fe", name: "Steel scrap" },

  /*
   * Not listed:
   *
   * Titanium — the feed does not carry it, and IMS trades it. Worth raising
   * with the provider rather than quietly leaving a gap.
   *
   * Tungsten — carried, but at $11.12 a troy ounce it works out at $357,000 a
   * tonne, against a market of roughly $30,000-45,000 for tungsten metal. Every
   * other symbol reconciles on the same factor, so this one is either a
   * different product or bad data, and it is left out until that is known.
   */
];

/**
 * Currencies offered in the selector.
 *
 * Matches the set already used in the IMS webapp's exchange-rate hook, so the
 * two surfaces offer the same choices rather than diverging.
 */
/*
 * No RUB. Removed on IMS's instruction (10 Sep 2026): quoting in roubles
 * carries sanctions exposure they do not want, and it is a KYC question they
 * would rather not invite. It is dropped from the supported list rather than
 * hidden in the interface, so it is not reachable through the API either.
 */
export const supportedCurrencies = ["USD", "EUR", "ILS", "GBP", "AED", "CNY"] as const;
export type Currency = (typeof supportedCurrencies)[number];

export const BASE_CURRENCY: Currency = "USD";

/** Symbols for display. Falls back to the ISO code where there is no glyph. */
export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  ILS: "₪",
  GBP: "£",
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

/**
 * Troy ounces in a tonne.
 *
 * The feed quotes per troy ounce even for base metals. Steel scrap pins it:
 * 0.010871 a troy ounce is $350 a tonne, which is what HMS scrap costs.
 */
export const TROY_OUNCES_PER_TONNE = 32150.7466;
export const RATES_TTL_MS = 60 * 60 * 1000;

/* ------------------------------------------------------------ currency pairs */

/**
 * Market precedence for deciding which side of a pair is the base.
 *
 * This ordering is a market convention, not a preference: the currency higher
 * in the list is always quoted as the base. Anything absent ranks below USD.
 */
const PAIR_PRECEDENCE = ["EUR", "GBP", "AUD", "NZD", "USD"];

export interface FxPair {
  /** The currency in the pair that is not the base of the feed. */
  code: Currency;
  /** How the pair is written, e.g. "EUR/USD" or "USD/ILS". */
  label: string;
  /** Units of the second currency per one unit of the first. */
  value: number;
}

/**
 * Turn a feed rate — always "units per one USD" — into a quoted pair.
 *
 * EUR and GBP outrank the dollar, so their rate is inverted and the pair is
 * written the other way round: a feed value of 0.861 becomes EUR/USD 1.1614.
 * Everything else keeps the feed's direction, so 3.04 becomes USD/ILS 3.0400.
 */
export function toFxPair(code: Currency, perBase: number): FxPair | null {
  if (!Number.isFinite(perBase) || perBase <= 0) return null;
  const rank = (c: string) => {
    const i = PAIR_PRECEDENCE.indexOf(c);
    return i === -1 ? PAIR_PRECEDENCE.length : i;
  };
  return rank(code) < rank(BASE_CURRENCY)
    ? { code, label: `${code}/${BASE_CURRENCY}`, value: 1 / perBase }
    : { code, label: `${BASE_CURRENCY}/${code}`, value: perBase };
}

/** Four decimals is how majors are quoted, and it is what makes a rate look live. */
export const FX_FRACTION_DIGITS = 4;

/* isMetalsConfigured lives in metals.ts, not here. This module is imported by
   the client widget for its currency list, and a module the browser can import
   should not read process.env at all — even for a value Next would replace
   with undefined. Keeping the boundary obvious is worth more than the one
   shared line. */
