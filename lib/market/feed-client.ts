/**
 * One market feed, shared by every component that shows it.
 *
 * Three things now render these numbers — the metals ticker, the rates ticker
 * and the price board — and each used to keep its own copy of the fetch. That
 * meant three calls to a rate-limited endpoint, three timers, and three
 * timestamps that could disagree: refreshing the board left the bars above it
 * quoting older prices, which is worse than offering no refresh at all.
 *
 * So the payload lives here instead. Subscribers share one request, one timer
 * and one result, and a refresh anywhere updates everything at once.
 */
import type { Currency } from "@/lib/market/config";

export interface Quote {
  symbol: string;
  name: string;
  element: string;
  category?: string;
  price: number;
  change?: number;
}

export interface MarketPayload {
  metals: { base: string; quotes: Quote[]; fetchedAt: number } | null;
  metalsConfigured: boolean;
  rates: { base: string; rates: Record<string, number>; fetchedAt: number } | null;
  currencies: readonly Currency[];
}

/** Prices this stale are still worth showing; the timestamp says how old. */
export const MARKET_REFRESH_MS = 15 * 60 * 1000;

type Listener = (payload: MarketPayload | null) => void;

const listeners = new Set<Listener>();
let cached: MarketPayload | null = null;
let inFlight: Promise<MarketPayload | null> | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

export function getCachedMarket(): MarketPayload | null {
  return cached;
}

/**
 * Fetch the feed, or join a request already in flight.
 *
 * `force` discards the cached payload first, which is what the refresh controls
 * do. Returns null when the route fails; callers treat that as "nothing to
 * show" rather than substituting a previous value, because a stale price
 * presented as current is the one outcome worth avoiding.
 */
export function loadMarket(force = false): Promise<MarketPayload | null> {
  if (force) cached = null;
  if (cached) return Promise.resolve(cached);
  if (inFlight) return inFlight;

  inFlight = fetch("/api/market")
    .then((r) => (r.ok ? (r.json() as Promise<MarketPayload>) : null))
    .then((payload) => {
      cached = payload;
      for (const listener of listeners) listener(payload);
      return payload;
    })
    .catch(() => null)
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/**
 * Listen for new payloads. The polling timer runs only while something is
 * listening, so a page without a market component does no background work.
 */
export function subscribeMarket(listener: Listener): () => void {
  listeners.add(listener);
  if (!timer) timer = setInterval(() => void loadMarket(true), MARKET_REFRESH_MS);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
