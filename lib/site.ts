/**
 * Single source of truth for company facts.
 *
 * Anything sourced from the legacy site is marked `verified: true` only when it
 * appeared consistently across the audited pages. Contradictory or placeholder
 * values are held here as `null` with a note, so that no unverified claim can
 * leak into the UI. See /docs/content-verification.md for the open items.
 */

const PRODUCTION_URL = "https://ims-metals.com";

/**
 * Resolves the canonical origin, tolerating anything the deploy environment
 * might supply.
 *
 * Next inlines `NEXT_PUBLIC_*` at build time and substitutes an empty string
 * when the variable is absent from the build environment, so `??` is not enough
 * — `new URL("")` throws and takes the whole build down. This normalises the
 * value, adds a missing protocol, drops a trailing slash, and falls back to the
 * production origin if what it is given cannot be parsed.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return PRODUCTION_URL;

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return PRODUCTION_URL;
  }
}

export const site = {
  name: "IMS Metals & Alloys",
  legalName: "IMS Metals & Alloys OÜ",
  shortName: "IMS",
  url: resolveSiteUrl(),
  tagline: "Turning complex scrap into opportunity",
  description:
    "IMS Metals & Alloys OÜ is a specialised recycler and supplier to the global nickel refinery, stainless steel, superalloy, titanium and refractory metals industries, blending complex scrap streams into high-value Ni-based blends.",
  locale: "en",
} as const;

/** From the company letterhead. */
export const registration = {
  number: "17031890",
  eori: "EE17031890",
} as const;

export const contact = {
  email: "info@ims-metals.com",
  address: {
    street: "Jõe tn 4C",
    city: "Tallinn",
    postalCode: "10151",
    country: "Estonia",
    countryCode: "EE",
  },
  /**
   * Deliberately null. IMS confirmed a number on 2026-09-10 and then asked on
   * 2026-09-11 that it never be shown, so nothing publishes it: no header,
   * footer, contact page, mobile menu or Organization schema.
   *
   * Reachability is via WhatsApp instead — see `whatsapp` below, which is a
   * link target, not display text. Setting this string would put the number
   * back on every page at once, which is exactly what was asked against.
   */
  phone: null as string | null,
  /**
   * Social profiles shown in the footer.
   *
   * `isCompanyProfile` gates inclusion in the Organization `sameAs` structured
   * data. That field asserts "these profiles are this organisation", so listing
   * an individual's profile there tells search engines the company and the
   * person are one entity. The link is still displayed either way — this only
   * governs what is claimed in machine-readable markup.
   */
  social: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sharon-bashan-355a1272/",
      icon: "linkedin",
      // Personal profile, supplied by IMS. Flip to true once a company page exists.
      isCompanyProfile: false,
    },
  ] as { label: string; href: string; icon: "linkedin"; isCompanyProfile: boolean }[],

  /**
   * WhatsApp business number, supplied by IMS: +972 54-907-0254.
   * Stored as digits only in international format, which is what wa.me expects.
   *
   * Note this is deliberately separate from `phone` above. Publishing a number
   * as the company's general telephone — in the header, footer and Organization
   * schema — is a wider commitment than making it reachable on WhatsApp, so it
   * is not assumed. Set `phone` as well if it should be shown as both.
   */
  whatsapp: "972549070254" as string | null,

  /** Prefilled into the WhatsApp thread so an enquiry opens with context. */
  whatsappMessage: "Hello IMS — I have a materials enquiry.",
} as const;

/**
 * The previous website's self-description — "15 years", the sectors list,
 * "sorted, segregated, processed and certified", the metallurgical
 * laboratory — is not carried on the site any more. The company intro of
 * September 2026 is the source now (data/portfolio.ts); the open questions
 * on what to keep from the old copy are in docs/refocus-plan.md §8.
 */

export const routes = {
  home: "/",
  about: "/about",
  whatWeDo: "/what-we-do",
  /** Labelled "Portfolio" in the interface; the path is kept for its search rankings. */
  materials: "/materials",
  family: (slug: string) => `/materials/${slug}`,
  /** Legacy composition tables the portfolio does not claim. Same path shape as always. */
  reference: (slug: string) => `/materials/${slug}`,
  finder: "/materials/finder",
  compare: "/materials/compare",
  rfq: "/rfq",
  insights: "/insights",
  article: (slug: string) => `/insights/${slug}`,
  contact: "/contact",
  search: "/search",
} as const;
