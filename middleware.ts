import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/lib/i18n/config";

/**
 * Puts the chosen language where the server can see it.
 *
 * The site's problem was that i18n lived only in a React context: 42 of the
 * components are server components, so they could not read it, and changing
 * language translated the navigation and nothing else.
 *
 * The locale now travels as a request header, which every server component and
 * every `generateMetadata` can read. URLs are unchanged — one canonical path per
 * page in all five languages — which keeps the legacy 301 map, the sitemap and
 * all 150-odd internal links exactly as they are. The trade is that pages render
 * per request rather than being served static, and that search engines (which do
 * not carry cookies) index the English text. See docs item 21 for when localised
 * routes would be worth the churn instead.
 */
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie) ? cookie : DEFAULT_LOCALE;

  const headers = new Headers(request.headers);
  headers.set("x-ims-locale", locale);

  const response = NextResponse.next({ request: { headers } });
  // Caches must not serve one language's HTML to a reader who chose another.
  response.headers.set("Vary", "Cookie");
  return response;
}

export const config = {
  // Skip anything that has no language: assets, API routes and metadata files.
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)"],
};
