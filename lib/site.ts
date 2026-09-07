/**
 * Single source of truth for company facts.
 *
 * Anything sourced from the legacy site is marked `verified: true` only when it
 * appeared consistently across the audited pages. Contradictory or placeholder
 * values are held here as `null` with a note, so that no unverified claim can
 * leak into the UI. See /docs/content-verification.md for the open items.
 */

export const site = {
  name: "IMS Metals & Alloys",
  legalName: "IMS Metals & Alloys OÜ",
  shortName: "IMS",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ims-metals.com",
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
   * VERIFY — the legacy contact page publishes "+123-456-7890", a Forminator
   * demo placeholder. No telephone number is displayed until the real one is
   * supplied. Set this string to publish it site-wide.
   */
  phone: null as string | null,
  /**
   * VERIFY — the only social link on the legacy site points at a personal
   * LinkedIn profile rather than a company page. Left empty pending a company
   * profile URL.
   */
  social: [] as { label: string; href: string }[],
} as const;

/**
 * VERIFY — the legacy site makes two incompatible claims:
 *   "over 15 years of experience"  (homepage body copy, About counter widget)
 *   "over 30 years of experience"  (About body copy, About meta description, two articles)
 * No number is rendered anywhere until this is settled. Set `years` to publish.
 */
export const experience: { years: number | null; verified: boolean } = {
  years: null,
  verified: false,
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
