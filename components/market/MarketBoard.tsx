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
  element: string;
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
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="grid-rule mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-[5.5rem] bg-navy-950" />
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
          className="flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-brand-300"
        >
          {/* A quiet pulse says "live" in a way a timestamp alone does not.
              Held still under reduced motion, where it is simply a dot. */}
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success-500" />
          </span>
          {hasMetals ? p("Live metals prices") : p("Live exchange rates")}
        </h2>

        <div className="flex items-center gap-3">
          {updated ? (
            <time
              dateTime={new Date(stamp!).toISOString()}
              className="font-mono text-[0.6875rem] tabular-nums text-steel-400"
            >
              {updated}
            </time>
          ) : null}

          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            aria-label={p("Refresh prices")}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25 text-steel-300 transition-colors hover:border-white/60 hover:text-white disabled:opacity-40"
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
                className="h-8 rounded border border-white/25 bg-navy-900 px-2 text-[0.8125rem] font-medium text-white transition-colors hover:border-white/60 focus:border-white/60"
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
           cells of an incomplete last row, so each cell draws its own outline
           and the parent stays unpainted. */
        <ul className="grid-rule mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {metals.map((q) => {
            const cell = (
              <>
                {/* The element as a watermark. It is the site's own language —
                    the specimen cards do the same — and it gives a grid of
                    numbers something to look at besides numbers. */}
                <span
                  aria-hidden
                  data-decorative
                  className="pointer-events-none absolute end-3 top-2 select-none font-display text-[2.5rem] font-bold leading-none text-white/[0.07]"
                >
                  {q.element}
                </span>

                <span className="relative block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-brand-300">
                  {p(q.name)}
                </span>
                <span className="relative mt-2 block tabular-nums text-[1.125rem] font-semibold text-white">
                  {q.display ?? "—"}
                </span>
              </>
            );
            return (
              <li key={q.symbol} className="relative isolate overflow-hidden bg-navy-950">
                {q.category ? (
                  <Link
                    href={"/materials/" + q.category}
                    className="block px-4 py-5 transition-colors hover:bg-navy-900"
                  >
                    {cell}
                  </Link>
                ) : (
                  <div className="px-4 py-5">{cell}</div>
                )}
              </li>
            );
          })}

          {/* Says the unit once instead of nine times, and fills the cell that
              nine metals leave over in a five-column grid. Shown at every width:
              on a phone this is the only place the unit appears. */}
          <li className="bg-navy-950 px-4 py-5">
            <span className="block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-steel-400">
              {p("Unit")}
            </span>
            <span className="mt-2 block text-[0.8125rem] leading-snug text-steel-400">
              {p("All prices per tonne")}
            </span>
          </li>
        </ul>
      ) : null}

      {hasRates ? (
        <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2">
          {/* "USD" once, as the base, rather than repeated in front of every
              pair. Each rate is then just a currency and a number. */}
          <span className="me-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-steel-400">
            {hasMetals ? p("Exchange rates") : null} {"1 USD ="}
          </span>
          {rateRows.map((r) => (
            <span
              key={r.code}
              className="inline-flex items-baseline gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1"
            >
              <span className="tabular-nums text-[0.8125rem] font-semibold text-white">
                {new Intl.NumberFormat(tag, { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(
                  r.value,
                )}
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-steel-400">
                {r.code}
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
