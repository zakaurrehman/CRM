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

/**
 * One fetch however many boards are on the page, and a way to force a fresh one.
 */
let shared: Promise<MarketPayload | null> | null = null;
let cached: MarketPayload | null = null;

function loadMarket(force = false): Promise<MarketPayload | null> {
  if (force) cached = null;
  if (cached) return Promise.resolve(cached);
  if (shared) return shared;
  shared = fetch("/api/market")
    .then((r) => (r.ok ? (r.json() as Promise<MarketPayload>) : null))
    .then((d) => {
      cached = d;
      return d;
    })
    .catch(() => null)
    .finally(() => {
      shared = null;
    });
  return shared;
}

const REFRESH_MS = 15 * 60 * 1000;

/**
 * Live metals prices and currency rates, as a board rather than a ticker.
 *
 * A scrolling ticker is a television idiom: it makes a reader wait for the
 * number they came for, and it needs a pause control because it never stops.
 * A board is read at a glance, scans properly on a phone, and has no motion to
 * manage — which is also why it needs no accessibility apparatus.
 *
 * Renders nothing when neither feed has data. Metals need a key and may be
 * unconfigured; rates need none, so in practice the rates half almost always
 * has something to show.
 */
export function MarketBoard({ className }: { className?: string }) {
  const p = useP();
  const { locale } = useI18n();
  const [data, setData] = useState<MarketPayload | null>(cached);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(cached ? "ready" : "loading");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (force = false) => {
    const d = await loadMarket(force);
    if (d) {
      setData(d);
      setStatus("ready");
    } else {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(() => load(true), REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  const tag = localeMeta[locale].tag;
  const rate = data?.rates?.rates?.[currency];

  const metals = useMemo(() => {
    if (!data?.metals) return [];
    return data.metals.quotes.map((q) => {
      /* Convert only when a rate exists. Showing a dollar figure under a
         non-dollar label would be worse than leaving the selector alone. */
      const value =
        currency === "USD" ? q.price : typeof rate === "number" && rate > 0 ? q.price * rate : null;
      return {
        ...q,
        display:
          value === null
            ? null
            : new Intl.NumberFormat(tag, {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
              }).format(value),
      };
    });
  }, [data, currency, rate, tag]);

  const rateRows = useMemo(() => {
    if (!data?.rates) return [];
    return data.currencies
      .filter((c) => c !== "USD" && typeof data.rates?.rates[c] === "number")
      .map((c) => ({ code: c, value: data.rates!.rates[c] }));
  }, [data]);

  if (status === "loading") {
    return (
      <div className={cn("animate-pulse", className)} aria-hidden>
        <div className="h-3 w-32 rounded bg-steel-200" />
        <div className="mt-5 grid grid-cols-2 gap-px bg-steel-200 sm:grid-cols-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-[4.5rem] bg-steel-50" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || !data) return null;
  const hasMetals = metals.length > 0;
  const hasRates = rateRows.length > 0;
  if (!hasMetals && !hasRates) return null;

  const stamp = data.metals?.fetchedAt ?? data.rates?.fetchedAt;
  const updated = stamp
    ? new Intl.DateTimeFormat(tag, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(stamp))
    : null;

  return (
    <section className={cn(className)} aria-labelledby="market-board">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2
          id="market-board"
          className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500"
        >
          {hasMetals ? p("Live metals prices") : p("Live exchange rates")}
        </h2>

        <div className="flex items-center gap-3">
          {updated ? (
            <time
              dateTime={new Date(stamp!).toISOString()}
              className="font-mono text-[0.6875rem] tabular-nums text-steel-500"
            >
              {updated}
            </time>
          ) : null}

          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            aria-label={p("Refresh prices")}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-steel-300 text-steel-500 transition-colors hover:border-brand-700 hover:text-brand-700 disabled:opacity-40"
          >
            <svg
              viewBox="0 0 14 14"
              aria-hidden
              className={cn("h-3 w-3", refreshing && "motion-safe:animate-spin")}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M12.5 7a5.5 5.5 0 1 1-1.6-3.9" />
              <path d="M12.6 1.4v3.2H9.4" />
            </svg>
          </button>

          {hasMetals && hasRates ? (
            <label className="inline-flex items-center gap-2">
              <span className="sr-only">{p("Display currency")}</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="h-8 rounded border border-steel-300 bg-white px-2 text-[0.8125rem] font-medium text-navy-900 transition-colors hover:border-brand-700 focus:border-brand-700"
              >
                {data.currencies.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>

      {hasMetals ? (
        /* Hairline grid: a 1px gap over a coloured parent would paint the empty
           cells of an incomplete last row, so each cell draws its own outline. */
        <ul className="grid-rule mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {metals.map((q) => {
            const cell = (
              <>
                <span className="block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-steel-500">
                  {p(q.name)}
                </span>
                <span className="mt-1.5 block tabular-nums text-[1.0625rem] font-semibold text-navy-900">
                  {q.display ?? "—"}
                </span>
                <span className="mt-0.5 block text-[0.6875rem] text-steel-500">{p("per tonne")}</span>
              </>
            );
            return (
              <li key={q.symbol} className="bg-white">
                {q.category ? (
                  <Link
                    href={"/materials/" + q.category}
                    className="block px-4 py-4 transition-colors hover:bg-steel-50"
                  >
                    {cell}
                  </Link>
                ) : (
                  <div className="px-4 py-4">{cell}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}

      {hasRates ? (
        <div className={cn("flex flex-wrap items-baseline gap-x-7 gap-y-2", hasMetals ? "mt-5" : "mt-5")}>
          {hasMetals ? (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-steel-500">
              {p("Exchange rates")}
            </span>
          ) : null}
          {rateRows.map((r) => (
            <span key={r.code} className="text-[0.8125rem] text-steel-600">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-steel-500">
                {"USD / " + r.code}
              </span>{" "}
              <span className="tabular-nums font-medium text-navy-900">
                {new Intl.NumberFormat(tag, { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(
                  r.value,
                )}
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
