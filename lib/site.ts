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
  description:
    "IMS Metals & Alloys OÜ sources, processes and certifies metals, alloys and metal-bearing residues for the aerospace, oil & gas, industrial gas turbine and stainless steel industries.",
  locale: "en",
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
 * The legacy site made two incompatible claims — "over 15 years" (homepage,
 * About counter) and "over 30 years" (About body, About meta description, two
 * articles). IMS confirmed 15 on 2026-09-10, so the 30-year figure was wrong
 * wherever it appeared and is not carried over.
 */
export const experience: { years: number | null; verified: boolean } = {
  years: 15,
  verified: true,
};

/** Facts that appeared consistently across the audited legacy pages. */
export const companyFacts = {
  origin: "Eastern Europe",
  reach: "International network with joint partnerships",
  process: "Sorted, segregated, processed and certified before resale",
  outputGrades: ["Air-melt", "Vacuum grade"],
  sectors: [
    "Stainless Steel",
    "Oil & Gas",
    "Aerospace",
    "Automotive",
    "Medical",
    "Orthopedics",
    "Electric (car battery)",
    "Thermal Spray",
    "Electroplating",
    "Steel",
    "3D Additive Manufacturing",
  ],
  specialistMetals: [
    "Nickel",
    "Cobalt",
    "Titanium",
    "Molybdenum",
    "Niobium",
    "Tantalum",
    "Tungsten",
    "Zirconium",
    "Hafnium",
    "Rhenium",
  ],
  ferroAlloys: ["FeNiCr", "FeW", "FeMo", "FeNb", "FeTi"],
  preciousMetalsRecovered: ["Gold", "Platinum", "Rhenium"],
} as const;

export const routes = {
  home: "/",
  about: "/about",
  quality: "/about/quality-and-compliance",
  sustainability: "/about/sustainability",
  materials: "/materials",
  material: (slug: string) => `/materials/${slug}`,
  recycling: "/recycling",
  tungsten: "/recycling/tungsten",
  reverts: "/recycling/aerospace-reverts",
  industries: "/industries",
  industry: (slug: string) => `/industries/${slug}`,
  insights: "/insights",
  article: (slug: string) => `/insights/${slug}`,
  contact: "/contact",
  search: "/search",
} as const;
