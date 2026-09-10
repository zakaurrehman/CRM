import { NextResponse } from "next/server";
import { getMetals, isMetalsConfigured } from "@/lib/market/metals";
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
  const [metals, rates] = await Promise.all([getMetals(), getRates()]);

  return NextResponse.json(
    {
      metals: metals
        ? { base: metals.base, quotes: metals.quotes, fetchedAt: metals.fetchedAt }
        : null,
      /* Distinguishes "no key configured" from "configured but the provider is
         down". The UI says nothing at all in the first case and reports a
         problem in the second, which are different situations for whoever is
         looking after the site. */
      metalsConfigured: isMetalsConfigured(),
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
