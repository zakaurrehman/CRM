"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useP } from "@/lib/i18n/phrases/client";
import { useI18n } from "@/lib/i18n/provider";
import { localeMeta } from "@/lib/i18n/config";
import { toFxPair, pairChange, FX_FRACTION_DIGITS, PEGGED_TO_BASE } from "@/lib/market/config";
import { cn } from "@/lib/utils";
import { getCachedMarket, loadMarket, subscribeMarket } from "@/lib/market/feed-client";

/**
 * Live metals prices and currency rates, as a board rather than a ticker.
 *
 * A scrolling ticker is a television idiom: it makes a reader wait for the
 * number they came for, and it needs a pause control because it never stops.
 * A board is read at a glance, scans properly on a phone, and has no motion to
 * manage.
 *
 * What makes it feel live is a separate question, and the answer has to be
 * honest. Movement arrows appear only where a provider reported real movement;
 * a decorative arrow would be inventing a market. Around that, three things
 * say "live" truthfully: a badge with a pulse, a relative time that ticks
 * ("3 min ago"), and a wash across the cells when a refresh lands — the last
 * being the visible form of "we just checked", which is true every fifteen
 * minutes whether or not anything moved. A price that does move flashes in its
 * direction.
 *
 * Renders nothing when neither feed has data. Metals need a key and may be
 * unconfigured; rates need none, so in practice the rates half almost always
 * has something to show.
 */

/** The wash lasts this long; matches the keyframe duration in globals.css. */
const ARRIVE_MS = 900;
/** How long a moved price keeps its colour before settling back to white. */
const MOVE_MS = 1400;
/** Relative time re-renders on this cadence. Minute resolution needs no more. */
const TICK_MS = 30 * 1000;

/**
 * An arrow and a percentage, coloured by direction, or a neutral figure when the
 * movement is exactly nil. The arrow is drawn and hidden from assistive
 * technology; the sign is read out instead.
 */
function Movement({ value, tag, className }: { value: number; tag: string; className?: string }) {
  const pct = new Intl.NumberFormat(tag, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "never",
  }).format(Math.abs(value));

  if (value === 0) {
    return (
      <span className={cn("tabular-nums font-medium text-steel-400", className)}>
        <span className="sr-only">±</span>
        {pct}
      </span>
    );
  }

  const up = value > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 tabular-nums font-semibold",
        up ? "text-success-300" : "text-danger-300",
        className,
      )}
    >
      <svg viewBox="0 0 8 6" aria-hidden className="h-1.5 w-2 shrink-0" fill="currentColor">
        {up ? <path d="M4 0l4 6H0z" /> : <path d="M4 6L0 0h8z" />}
      </svg>
      <span className="sr-only">{up ? "+" : "−"}</span>
      {pct}
    </span>
  );
}

/** Re-renders on a timer so "3 min ago" stays true. */
function useNow(everyMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(timer);
  }, [everyMs]);
  return now;
}

export function MarketBoard({ className }: { className?: string }) {
  const p = useP();
  const { locale } = useI18n();
  const [data, setData] = useState(getCachedMarket);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    getCachedMarket() ? "ready" : "loading",
  );
  const [refreshing, setRefreshing] = useState(false);
  const now = useNow(TICK_MS);

  /* The wash: true for ARRIVE_MS after a payload lands. The first payload is
     skipped — it arrives as the skeleton gives way to content, and a flash on
     top of that swap reads as a glitch rather than a signal. */
  const [arrived, setArrived] = useState(false);
  const seen = useRef(false);

  /* Which prices moved on the latest payload, and which way. Cleared after
     MOVE_MS. Keyed by the same key the cells use. */
  const [moved, setMoved] = useState<Record<string, "up" | "down">>({});
  const previous = useRef<Record<string, number>>({});

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

  useEffect(() => {
    if (!data) return;

    /* Compare every figure against the last payload's. Metals by symbol, rates
       by currency; both live in one map because the cells only need a key. */
    const current: Record<string, number> = {};
    for (const q of data.metals?.quotes ?? []) current["m:" + q.symbol] = q.price;
    for (const [code, value] of Object.entries(data.rates?.rates ?? {})) current["r:" + code] = value;

    /* The store only pushes after a real fetch, so every payload after the
       first is a genuine "we just checked" and gets the wash — whether or not
       the server had anything newer to give. Movement is a separate question,
       answered by comparing the figures themselves. */
    if (seen.current) {
      const changes: Record<string, "up" | "down"> = {};
      for (const [key, value] of Object.entries(current)) {
        const before = previous.current[key];
        if (typeof before === "number" && before !== value) changes[key] = value > before ? "up" : "down";
      }
      setArrived(true);
      setMoved(changes);
      const a = setTimeout(() => setArrived(false), ARRIVE_MS);
      const b = setTimeout(() => setMoved({}), MOVE_MS);
      previous.current = current;
      return () => {
        clearTimeout(a);
        clearTimeout(b);
      };
    }

    seen.current = true;
    previous.current = current;
  }, [data]);

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
    const feedChange = data.rates.change ?? {};
    return data.currencies
      .filter((c) => c !== "USD" && typeof data.rates?.rates[c] === "number")
      .map((c) => {
        const pair = toFxPair(c, data.rates!.rates[c]);
        if (!pair) return null;
        /* The feed's change is in the feed's direction; a pair that inverts it
           moves the other way, and pairChange does that arithmetic exactly. */
        const change = typeof feedChange[c] === "number" ? pairChange(c, feedChange[c]) : undefined;
        return { ...pair, change, pegged: PEGGED_TO_BASE.has(c) };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
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

  /* "3 min ago", in the reader's language, from Intl rather than a phrase
     table. Under a minute it says "now". */
  const ago = (() => {
    if (!stamp) return null;
    const rtf = new Intl.RelativeTimeFormat(tag, { numeric: "auto", style: "short" });
    const seconds = Math.max(0, Math.round((now - stamp) / 1000));
    if (seconds < 45) return rtf.format(0, "second");
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return rtf.format(-minutes, "minute");
    return rtf.format(-Math.round(minutes / 60), "hour");
  })();

  return (
    <section className={cn(className)} aria-labelledby="market-board">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2
          id="market-board"
          className="flex flex-wrap items-center gap-x-2.5 gap-y-1 label text-brand-300"
        >
          {/* The badge. A pulse says "live" in a way a timestamp alone does
              not; held still under reduced motion, where it is simply a dot. */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success-300/30 bg-success-300/10 px-2 py-0.5 text-[0.625rem] font-semibold tracking-[0.16em] text-success-300">
            <span aria-hidden className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success-300 opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success-300" />
            </span>
            {p("Live")}
          </span>

          {hasMetals ? p("Metals prices") : p("FX rates")}

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
            <span className="font-mono text-[0.6875rem] tabular-nums text-steel-400">
              <time dateTime={new Date(stamp!).toISOString()}>{updated}</time>
              {ago ? (
                <>
                  <span aria-hidden>{" · "}</span>
                  <span className="text-steel-300">{ago}</span>
                </>
              ) : null}
            </span>
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
            const move = moved["m:" + q.symbol];
            const cell = (
              <>
                <span className="relative block truncate font-mono text-[0.625rem] uppercase tracking-[0.1em] text-brand-300">
                  {p(q.name)}
                </span>
                <span className="relative mt-1 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "tabular-nums text-[0.9375rem] font-semibold text-white",
                      move === "up" && "market-up",
                      move === "down" && "market-down",
                    )}
                  >
                    {q.display ?? "—"}
                  </span>

                  {/* Only when the provider gave real movement. No data, no
                      arrow — a decorative one would be inventing a market. */}
                  {typeof q.change === "number" ? (
                    <Movement value={q.change} tag={tag} className="text-[0.6875rem]" />
                  ) : null}
                </span>
              </>
            );
            return (
              <li
                key={q.symbol}
                className={cn("relative isolate overflow-hidden bg-navy-950", arrived && "market-arrive")}
              >
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
            <span className="me-1 label text-[0.625rem] text-steel-400">
              {p("FX rates")}
            </span>
          ) : null}
          {rateRows.map((r) => {
            const move = moved["r:" + r.code];
            return (
              <span
                key={r.code}
                className={cn(
                  "inline-flex items-baseline gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1",
                  arrived && "market-arrive",
                )}
              >
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-steel-400">
                  {r.label}
                </span>
                <span
                  className={cn(
                    "tabular-nums text-[0.8125rem] font-semibold text-white",
                    move === "up" && "market-up",
                    move === "down" && "market-down",
                  )}
                >
                  {new Intl.NumberFormat(tag, {
                    minimumFractionDigits: FX_FRACTION_DIGITS,
                    maximumFractionDigits: FX_FRACTION_DIGITS,
                  }).format(r.value)}
                </span>
                {typeof r.change === "number" ? (
                  <Movement value={r.change} tag={tag} className="text-[0.625rem]" />
                ) : r.pegged ? (
                  /* AED is fixed to the dollar, so there is genuinely nothing to
                     report; saying so is better than a gap beside four arrows. */
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-steel-400">
                    {p("pegged")}
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
