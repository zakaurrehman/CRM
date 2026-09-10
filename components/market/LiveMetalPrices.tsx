"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useP } from "@/lib/i18n/phrases/client";
import { useI18n } from "@/lib/i18n/provider";
import { localeMeta } from "@/lib/i18n/config";
import type { Currency } from "@/lib/market/config";
import { cn } from "@/lib/utils";

interface Quote {
  symbol: string;
  name: string;
  category?: string;
  price: number;
  change?: number;
}

interface MarketPayload {
  metals: { base: string; quotes: Quote[]; fetchedAt: number } | null;
  metalsConfigured: boolean;
  rates: { base: string; rates: Record<string, number>; fetchedAt: number } | null;
  currencies: readonly Currency[];
}

const REFRESH_MS = 15 * 60 * 1000;

/**
 * Live metals prices, with a currency selector.
 *
 * Renders nothing at all when there is no price feed — no key configured, or
 * the provider is unreachable and nothing was cached. A widget showing dashes
 * is worse than no widget on a supplier's homepage, and the brief is explicit
 * that prices are never invented. The one exception is a configured feed that
 * has failed, which says so, because that is a fault somebody should fix.
 *
 * Only this component talks to /api/market. It never sees a credential: the
 * route holds the keys and returns numbers.
 */
export function LiveMetalPrices({ className }: { className?: string }) {
  const p = useP();
  const { locale } = useI18n();
  const [data, setData] = useState<MarketPayload | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [currency, setCurrency] = useState<Currency>("USD");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/market");
      if (!response.ok) throw new Error(String(response.status));
      setData((await response.json()) as MarketPayload);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const rate = data?.rates?.rates?.[currency];
  const tag = localeMeta[locale].tag;

  /** Price in the selected currency, or null when there is no rate to use. */
  const convert = useCallback(
    (usd: number): number | null => {
      if (currency === "USD") return usd;
      return typeof rate === "number" && rate > 0 ? usd * rate : null;
    },
    [currency, rate],
  );

  const formatted = useMemo(() => {
    if (!data?.metals) return [];
    return data.metals.quotes.map((quote) => {
      const value = convert(quote.price);
      return {
        ...quote,
        display:
          value === null
            ? null
            : new Intl.NumberFormat(tag, {
                style: "currency",
                currency,
                maximumFractionDigits: value >= 100 ? 0 : 2,
              }).format(value),
      };
    });
  }, [data, convert, currency, tag]);

  // Nothing configured, or nothing usable came back: say nothing.
  if (status === "loading") {
    return (
      <div className={cn("animate-pulse", className)} aria-hidden>
        <div className="h-4 w-40 rounded bg-steel-200" />
        <div className="mt-4 space-y-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-8 rounded bg-steel-100" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || !data) return null;

  /* Nothing to show only when both feeds are empty. Metals need a key and may
     not be configured; rates need none and almost always are — so hiding the
     rates because the metals key is absent hid a working feature behind a
     missing one. */
  const hasMetals = Boolean(data.metals);
  const hasRates = Boolean(data.rates);
  if (!hasMetals && !hasRates) return null;

  const stamp = data.metals?.fetchedAt ?? data.rates?.fetchedAt ?? Date.now();
  const updated = new Intl.DateTimeFormat(tag, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(stamp));

  /* One unit of USD in each currency. Shown when there are no metals rows, so
     the panel still carries live market data rather than an apology. */
  const rateRows = hasRates
    ? data.currencies
        .filter((code) => code !== "USD" && typeof data.rates?.rates[code] === "number")
        .map((code) => ({ code, value: data.rates!.rates[code] }))
    : [];

  return (
    <section className={cn("rounded-md border border-steel-200 bg-white", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-steel-200 px-5 py-4">
        <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.13em] text-steel-500">
          {hasMetals ? p("Live metals prices") : p("Live exchange rates")}
        </h2>

        {hasMetals ? (
        <label className="inline-flex items-center gap-2">
          <span className="sr-only">{p("Display currency")}</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            /* Disabled rather than hidden when rates are unavailable: the
               control staying put explains why prices are dollars only. */
            disabled={!data.rates}
            className="h-8 rounded border border-steel-300 bg-white px-2 text-[0.8125rem] font-medium text-navy-900 transition-colors hover:border-brand-700 focus:border-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {data.currencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        ) : null}
      </header>

      {!hasMetals ? (
        <ul className="divide-y divide-steel-100">
          {rateRows.map((row) => (
            <li key={row.code} className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-[0.9375rem] font-medium text-navy-900">
                {"USD / " + row.code}
              </span>
              <span className="tabular-nums text-[0.9375rem] text-navy-900">
                {new Intl.NumberFormat(tag, { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(row.value)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="divide-y divide-steel-100">
        {formatted.map((quote) => (
          <li key={quote.symbol} className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-[0.9375rem] font-medium text-navy-900">
              {quote.category ? (
                <Link
                  href={"/materials/" + quote.category}
                  className="transition-colors hover:text-brand-700"
                >
                  {p(quote.name)}
                </Link>
              ) : (
                p(quote.name)
              )}
            </span>

            <span className="flex items-center gap-3">
              <span className="tabular-nums text-[0.9375rem] text-navy-900">
                {quote.display ?? "—"}
                <span className="ms-1 text-[0.75rem] text-steel-500">{p("/ MT")}</span>
              </span>

              {typeof quote.change === "number" ? (
                <span
                  className={cn(
                    "inline-flex min-w-[4.25rem] justify-end tabular-nums text-[0.8125rem] font-medium",
                    quote.change >= 0 ? "text-success-600" : "text-danger-600",
                  )}
                >
                  {/* The arrow carries the direction visually; the sign carries
                      it for anyone who cannot see colour. */}
                  {quote.change >= 0 ? "▲" : "▼"}{" "}
                  {new Intl.NumberFormat(tag, {
                    style: "percent",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    signDisplay: "never",
                  }).format(Math.abs(quote.change))}
                </span>
              ) : (
                <span aria-hidden className="min-w-[4.25rem]" />
              )}
            </span>
          </li>
        ))}
      </ul>

      <footer className="border-t border-steel-200 px-5 py-3">
        <p className="text-[0.75rem] text-steel-500">
          {p("Market data, last updated {when}", { when: updated })}
          {hasMetals && currency !== "USD" && !hasRates
            ? ` · ${p("Shown in USD — conversion unavailable")}`
            : ""}
          {!hasMetals && data.metalsConfigured
            ? ` · ${p("Metals prices are temporarily unavailable.")}`
            : ""}
        </p>
      </footer>
    </section>
  );
}
