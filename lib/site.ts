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
  /**
   * The company description, in IMS's words of 14 September 2026, used once
   * per context: the site metadata, the Organization schema and the What we
   * do page. IMS owns no plant or laboratory; it works through a network of
   * them, and every description on the site says so.
   */
  description:
    "IMS Metals & Alloys is a specialist metals recovery and supply company serving the global nickel refining, stainless steel, superalloy, titanium and refractory-metals industries. Through an international network of specialist processing facilities and laboratories, we develop and manage tailored recovery, processing and blending routes for complex, mixed and off-spec materials.",
  /** The one-line version, for the footer. */
  shortDescription:
    "A specialist metals recovery and supply company, working through an international network of processing facilities and laboratories.",
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

  /**
   * A named commercial contact for the contact page, when IMS supplies one
   * (suggested by IMS on 14 September 2026, name not yet given). Null hides
   * the block; nothing is invented. `email` here is that person's address,
   * shown beside the general one.
   */
  commercialContact: null as { name: string; role: string; email: string } | null,
} as const;

/**
 * Data protection. The controller is the registered company; the address for
 * data-protection matters is the general one until IMS names another.
 */
export const dataProtection = {
  controller: "IMS Metals & Alloys OÜ",
  email: "info@ims-metals.com",
  /** Estonia's supervisory authority. */
  authority: { name: "Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon)", url: "https://www.aki.ee/en" },
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
  offer: "/rfq?direction=sell",
  supply: "/rfq?direction=buy",
  intermediates: "/materials/powders-oxides-intermediates",
  /* Offline since 14 September 2026 — the three 2024 articles described the
     previous business. next.config.ts sends the paths home until new
     articles are written; the data and pages stay in place for that. */
  insights: "/insights",
  article: (slug: string) => `/insights/${slug}`,
  contact: "/contact",
  privacy: "/privacy",
  legal: "/legal",
  search: "/search",
} as const;
