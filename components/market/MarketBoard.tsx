"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useP } from "@/lib/i18n/phrases/client";
import { useI18n } from "@/lib/i18n/provider";
import { localeMeta } from "@/lib/i18n/config";
import { toFxPair, FX_FRACTION_DIGITS } from "@/lib/market/config";
import { cn } from "@/lib/utils";
import { getCachedMarket, loadMarket, subscribeMarket } from "@/lib/market/feed-client";

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
  const [data, setData] = useState(getCachedMarket);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    getCachedMarket() ? "ready" : "loading",
  );
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (force = false) => {
    const d = await loadMarket(force);
    setStatus(d ? "ready" : "error");
  }, []);

  useEffect(() => {
    /* The store pushes each new payload; this only has to ask for the first
       one and follow the status. */
    const unsubscribe = subscribeMarket((payload) => {
      setData(payload);
      setStatus(payload ? "ready" : "error");
    });
    void load();
    return unsubscribe;
  }, [load]);

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  const tag = localeMeta[locale].tag;

  /* Dollars only, on IMS's instruction. The trade happens in dollars and a
     converted figure invites someone to quote off it. */
  const metals = useMemo(() => {
    if (!data?.metals) return [];
    return data.metals.quotes.map((q) => ({
      ...q,
      /* A plain number. The currency is stated once in the heading, which is
         what lets nine of these sit on one line. */
      display: new Intl.NumberFormat(tag, { maximumFractionDigits: 0 }).format(q.price),
    }));
  }, [data, tag]);

  const rateRows = useMemo(() => {
    if (!data?.rates) return [];
    return data.currencies
      .filter((c) => c !== "USD" && typeof data.rates?.rates[c] === "number")
      .map((c) => toFxPair(c, data.rates!.rates[c]))
      .filter((pair): pair is NonNullable<typeof pair> => pair !== null);
  }, [data]);

  if (status === "loading") {
    return (
      <div className={cn("animate-pulse", className)} aria-hidden>
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="grid-rule mt-3 grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-[3.25rem] bg-navy-950" />
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
          {hasMetals ? p("Live metals prices") : p("Live FX rates")}
          {/* Said once, in the heading, rather than nine times in the grid:
              "US$" in front of every price and a whole cell spent on the unit
              are what made the strip two rows deep. */}
          {hasMetals ? (
            <span className="text-steel-400">
              <span aria-hidden>{" · "}</span>
              {p("USD / tonne")}
            </span>
          ) : null}
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

        </div>
      </div>

      {hasMetals ? (
        /* Hairline grid: a 1px gap over a coloured parent would paint the empty
           cells of an incomplete last row, so each cell draws its own outline
           and the parent stays unpainted. */
        <ul className="grid-rule mt-3 grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
          {metals.map((q) => {
            const cell = (
              <>
                <span className="relative block truncate font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-brand-300">
                  {p(q.name)}
                </span>
                <span className="relative mt-1 flex items-baseline gap-2">
                  <span className="tabular-nums text-[0.9375rem] font-semibold text-white">
                    {q.display ?? "—"}
                  </span>

                  {/* Only when the provider gave real movement. No data, no
                      arrow — a decorative one would be inventing a market. */}
                  {typeof q.change === "number" ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 tabular-nums text-[0.6875rem] font-semibold",
                        q.change >= 0 ? "text-success-300" : "text-danger-300",
                      )}
                    >
                      <svg viewBox="0 0 8 6" aria-hidden className="h-1.5 w-2" fill="currentColor">
                        {q.change >= 0 ? <path d="M4 0l4 6H0z" /> : <path d="M4 6L0 0h8z" />}
                      </svg>
                      {new Intl.NumberFormat(tag, {
                        style: "percent",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        signDisplay: "never",
                      }).format(Math.abs(q.change))}
                    </span>
                  ) : null}
                </span>
              </>
            );
            return (
              <li key={q.symbol} className="relative isolate overflow-hidden bg-navy-950">
                {q.category ? (
                  <Link
                    href={"/materials/" + q.category}
                    className="block px-3 py-2.5 transition-colors hover:bg-navy-900"
                  >
                    {cell}
                  </Link>
                ) : (
                  <div className="px-3 py-2.5">{cell}</div>
                )}
              </li>
            );
          })}

        </ul>
      ) : null}

      {hasRates ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {/* No "1 USD =" lead-in: a pair written EUR/USD already says which
              way round it is, and saying it twice would contradict the pairs
              that lead with the dollar. */}
          {hasMetals ? (
            <span className="me-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-steel-400">
              {p("FX rates")}
            </span>
          ) : null}
          {rateRows.map((r) => (
            <span
              key={r.code}
              className="inline-flex items-baseline gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1"
            >
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-steel-400">
                {r.label}
              </span>
              <span className="tabular-nums text-[0.8125rem] font-semibold text-white">
                {new Intl.NumberFormat(tag, {
                  minimumFractionDigits: FX_FRACTION_DIGITS,
                  maximumFractionDigits: FX_FRACTION_DIGITS,
                }).format(r.value)}
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
