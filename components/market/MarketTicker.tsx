"use client";

import { useEffect, useMemo, useState } from "react";
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
 * One fetch for however many tickers are on the page.
 *
 * Two bars mounting at once would otherwise each hit the route. The promise is
 * shared at module scope so the second caller joins the first, and the result
 * is kept so a remount does not refetch.
 */
let shared: Promise<MarketPayload | null> | null = null;
let cached: MarketPayload | null = null;

function loadMarket(): Promise<MarketPayload | null> {
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
 * A continuously scrolling market bar, in the manner of a trading ticker.
 *
 * Two of these sit either side of the welcome band: metals above, currency
 * rates below. Each renders nothing at all when its feed has no data, so the
 * metals bar stays absent until METALS_API_KEY exists rather than scrolling an
 * empty strip.
 *
 * Motion that never stops is the thing to be careful with here. It pauses on
 * hover and on keyboard focus, it holds still entirely under reduced motion,
 * and it carries a pause control — content that moves on a timer for longer
 * than five seconds needs a way to stop it, and a ticker runs indefinitely.
 */
export function MarketTicker({
  feed,
  tone = "light",
  className,
}: {
  feed: "metals" | "rates";
  /* The two bars sit together, so one is a shade darker than the other. Without
     that they read as a single block of scrolling numbers. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const p = useP();
  const { locale } = useI18n();
  const [data, setData] = useState<MarketPayload | null>(cached);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let alive = true;
    const run = () => loadMarket().then((d) => { if (alive) setData(d); });
    run();
    const timer = setInterval(() => {
      cached = null;
      run();
    }, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  /* Manual refresh. Clears the shared result so both bars refetch together —
     they come from one call, and refreshing one while the other stayed stale
     would be worse than not offering it. */
  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    cached = null;
    const fresh = await loadMarket();
    setData(fresh);
    setRefreshing(false);
  };

  const tag = localeMeta[locale].tag;

  const items = useMemo(() => {
    if (!data) return [];

    if (feed === "metals") {
      if (!data.metals) return [];
      return data.metals.quotes.map((q) => ({
        key: q.symbol,
        label: p(q.name),
        value: new Intl.NumberFormat(tag, {
          style: "currency",
          currency: data.metals!.base,
          maximumFractionDigits: q.price >= 100 ? 0 : 2,
        }).format(q.price),
        unit: p("/ MT"),
        change: q.change,
      }));
    }

    if (!data.rates) return [];
    return data.currencies
      .filter((c) => c !== "USD" && typeof data.rates?.rates[c] === "number")
      .map((c) => ({
        key: c,
        label: `USD / ${c}`,
        value: new Intl.NumberFormat(tag, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        }).format(data.rates!.rates[c]),
        unit: "",
        change: undefined as number | undefined,
      }));
  }, [data, feed, p, tag]);

  if (items.length === 0) return null;

  const heading = feed === "metals" ? p("Metals") : p("Exchange rates");
  const dark = tone === "dark";

  const stamp = feed === "metals" ? data?.metals?.fetchedAt : data?.rates?.fetchedAt;
  const updated = stamp
    ? new Intl.DateTimeFormat(tag, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(
        new Date(stamp),
      )
    : null;

  /* The list is rendered twice. The animation travels exactly half the track,
     so the second copy is in the first one's place when it restarts and the
     loop has no seam. */
  const track = [...items, ...items];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        dark ? "on-dark border-b border-white/10 bg-navy-950" : "border-b border-steel-200 bg-white",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex items-stretch">
        {/* Fixed label. Sits outside the moving track so the bar always says
            what it is, whatever has scrolled past. */}
        <div
          className={cn(
            "z-10 flex shrink-0 items-center gap-2.5 px-4 sm:px-5",
            dark ? "border-e border-white/10 bg-navy-900" : "border-e border-steel-200 bg-steel-50",
          )}
        >
          <span
            className={cn(
              "font-mono text-[0.625rem] uppercase tracking-[0.14em]",
              dark ? "text-brand-300" : "text-steel-500",
            )}
          >
            {heading}
          </span>

          {/* When the figures are from. Hidden on the narrowest screens, where
              the bar has no room for it and the numbers matter more. */}
          {updated ? (
            <time
              dateTime={new Date(stamp!).toISOString()}
              className={cn(
                "hidden whitespace-nowrap font-mono text-[0.625rem] tabular-nums lg:inline",
                dark ? "text-steel-400" : "text-steel-500",
              )}
            >
              {updated}
            </time>
          ) : null}

          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            aria-label={p("Refresh prices")}
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors disabled:opacity-40",
              dark
                ? "border-white/25 text-steel-300 hover:border-white/60 hover:text-white"
                : "border-steel-300 text-steel-500 hover:border-brand-700 hover:text-brand-700",
            )}
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

          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? p("Resume the ticker") : p("Pause the ticker")}
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
              dark
                ? "border-white/25 text-steel-300 hover:border-white/60 hover:text-white"
                : "border-steel-300 text-steel-500 hover:border-brand-700 hover:text-brand-700",
            )}
          >
            <svg viewBox="0 0 12 12" aria-hidden className="h-2.5 w-2.5" fill="currentColor">
              {paused ? <path d="M3 1.5v9l7-4.5z" /> : <path d="M3 1.5h2.2v9H3zM6.8 1.5H9v9H6.8z" />}
            </svg>
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden py-3">
          <ul
            className={cn("ticker-track flex w-max items-center", (paused || reduced) && "is-paused")}
            /* Longer lists take proportionally longer, so the words move at one
               speed no matter how many there are. */
            style={{ animationDuration: `${Math.max(18, items.length * 5)}s` }}
          >
            {track.map((item, i) => (
              <li
                key={item.key + "-" + i}
                /* The duplicate half is decorative: a screen reader should hear
                   the list once, not twice. */
                aria-hidden={i >= items.length}
                className="flex items-baseline gap-2 whitespace-nowrap px-6"
              >
                <span
                  className={cn(
                    "text-[0.75rem] font-medium uppercase tracking-[0.06em]",
                    dark ? "text-steel-400" : "text-steel-500",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "tabular-nums text-[0.875rem] font-semibold",
                    dark ? "text-white" : "text-navy-900",
                  )}
                >
                  {item.value}
                  {item.unit ? (
                    <span
                      className={cn(
                        "ms-1 text-[0.6875rem] font-normal",
                        dark ? "text-steel-400" : "text-steel-500",
                      )}
                    >
                      {item.unit}
                    </span>
                  ) : null}
                </span>
                {typeof item.change === "number" ? (
                  <span
                    className={cn(
                      "tabular-nums text-[0.75rem] font-medium",
                      item.change >= 0
                        ? dark ? "text-success-500" : "text-success-600"
                        : dark ? "text-danger-500" : "text-danger-600",
                    )}
                  >
                    {item.change >= 0 ? "▲" : "▼"}{" "}
                    {new Intl.NumberFormat(tag, {
                      style: "percent",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      signDisplay: "never",
                    }).format(Math.abs(item.change))}
                  </span>
                ) : null}
                {/* Drawn, not typed. A "·" is text, so a contrast checker
                    holds it to 4.5:1 and a separator that subtle can never
                    meet it. A shape carries the same meaning and is exempt. */}
                <span
                  aria-hidden
                  className={cn("ms-6 h-1 w-1 shrink-0 self-center rounded-full", dark ? "bg-white/25" : "bg-steel-300")}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
