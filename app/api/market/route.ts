import { NextResponse } from "next/server";
import {
  getMetals,
  getMetalsError,
  getMetalsHistory,
  getHistoryNote,
  isMetalsConfigured,
} from "@/lib/market/metals";
import { getRates } from "@/lib/market/rates";
import { supportedCurrencies } from "@/lib/market/config";

/**
 * Market data for the live prices widget.
 *
 * The whole point of this route is that the browser never sees a credential.
 * The client asks this endpoint; this endpoint holds the keys and talks to the
 * providers. Both feeds are cached in the modules behind it, so a busy page
 * costs the providers one request per cache window rather than one per visitor.
 *
 * The two feeds are independent on purpose. Currency rates need no key and so
 * work today; metals prices need one and stay dormant until it is supplied. A
 * missing metals key must not take the currency selector down with it.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const [metals, rates, history] = await Promise.all([getMetals(), getRates(), getMetalsHistory()]);

  return NextResponse.json(
    {
      metals: metals
        ? { base: metals.base, unit: metals.unit, quotes: metals.quotes, fetchedAt: metals.fetchedAt }
        : null,
      /* Distinguishes "no key configured" from "configured but the provider is
         down". The UI says nothing at all in the first case and reports a
         problem in the second, which are different situations for whoever is
         looking after the site. */
      metalsConfigured: isMetalsConfigured(),
      /* Why there are no metals, when a key is configured but nothing came
         back. Carries no credential — the key is redacted from any provider
         message and the request URL is never recorded. */
      metalsError: !metals && isMetalsConfigured() ? getMetalsError() : undefined,
      /* Whether the plan serves a series, which is what small charts would
         need. Reported either way so the choice between a ticker and charts
         rests on what the data supports. */
      history: history ?? undefined,
      historyNote: isMetalsConfigured() ? getHistoryNote() : undefined,
      rates: rates ? { base: rates.base, rates: rates.rates, fetchedAt: rates.fetchedAt } : null,
      currencies: supportedCurrencies,
    },
    {
      headers: {
        /* Short shared cache. The modules behind this hold their own longer
           TTLs; this just stops a burst of visitors each triggering a render. */
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
      },
    },
  );
}
