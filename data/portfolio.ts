/**
 * The IMS portfolio, as the company intro states it.
 *
 * This is the front of the materials section: the families IMS buys, blends
 * and supplies, grouped so that Ferro Alloys and Refractory metals read as
 * headings rather than tiles. The wording of each family is the intro's own.
 *
 * It sits over, not instead of, the 295-grade composition tables in
 * data/alloys.ts. Each family names the legacy categories whose tables belong
 * under it (`tables`), optionally filtered to a subset of grades. The tables
 * themselves are untouched — grade ids, anchors and slugs stay exactly as they
 * were, because they key the compare tray, saved list and RFQ lines.
 *
 * Images are slots. Up to four per family; frame 1 is the card at rest, the
 * rest cross-fade behind it. Families with no honest photograph yet carry an
 * empty list and the card shows a quiet panel rather than a picture of some
 * other metal. See docs/refocus-plan.md §6 for the shot list IMS is supplying.
 */

import { tungstenForms } from "./recovery";
import type { TungstenForm } from "@/types/content";

export type PortfolioGroupId = "nickel" | "ferro" | "steels-titanium" | "refractory";

export interface PortfolioGroup {
  id: PortfolioGroupId;
  name: string;
  /** One line under the heading on the portfolio page. */
  note?: string;
}

/**
 * A composition table that belongs under a family. `only` and `except` filter
 * by published grade name, for the two cases where a legacy category has to be
 * split — the four Maraging grades sit inside "Complex Nickel Alloys" in the
 * source tables.
 */
export interface TableRef {
  category: string;
  only?: string[];
  except?: string[];
}

export interface PortfolioFamily {
  slug: string;
  name: string;
  group: PortfolioGroupId;
  /** What IMS accepts, in one line. The intro's wording wherever it gives one. */
  accepts: string;
  /** Content threshold, only where the intro states one. */
  threshold?: string;
  /** Up to four photographs; frame 1 is the card at rest. */
  images: string[];
  /** Legacy composition tables shown on the family page, in order. */
  tables: TableRef[];
  /**
   * Related designations the site already listed, kept beside the family
   * until IMS confirms them. Rendered as a secondary line, never as families.
   */
  also?: string[];
  /** The intro's supporting line, where it has one beyond the name. */
  detail?: string;
  /** Specific physical forms accepted, each with its photograph, where IMS has published them. */
  forms?: TungstenForm[];
}

export const portfolioGroups: PortfolioGroup[] = [
  { id: "nickel", name: "Nickel & Superalloys" },
  /* Stainless sits with FeNiCr: the two go to the same buyers, and FeNiCr is
     in practice what blended stainless-bearing scrap becomes. Pending Q1 in
     docs/refocus-plan.md. */
  { id: "ferro", name: "Ferro Alloys & Stainless" },
  { id: "steels-titanium", name: "Steels & Titanium" },
  { id: "refractory", name: "Refractory & Rare Metals", note: "W, Mo, Nb, Ta and Hf — including off-grade units." },
];

export const MAX_FAMILY_IMAGES = 4;

const MARAGING = ["MARAGING 200", "MARAGING 250", "MARAGING 300", "MARAGING 350"];

export const portfolioFamilies: PortfolioFamily[] = [
  /* ── Nickel & Superalloys ─────────────────────────────────────────────── */
  {
    slug: "high-nickel-alloys",
    name: "High Nickel Alloys",
    group: "nickel",
    accepts: "Inconel, Hastelloy, Incoloy and Nimonic types.",
    images: ["/images/hero/turnings.jpg"],
    tables: [{ category: "nickel-alloys" }],
  },
  {
    slug: "superalloys",
    name: "Superalloys",
    group: "nickel",
    accepts: "718, 625, 713, Waspaloy, Hastelloy-types, Rene's, offgrade / mixes.",
    images: ["/images/turbine/turbine-manufacturing.jpg"],
    tables: [{ category: "complex-nickel-alloys", except: MARAGING }],
  },
  {
    slug: "cobalt-alloys",
    name: "Cobalt Based Alloys",
    group: "nickel",
    accepts: "Stellite, MAR-M and Umco types.",
    images: [],
    tables: [{ category: "cobalt-alloys" }],
  },

  /* ── Ferro Alloys ─────────────────────────────────────────────────────── */
  {
    slug: "fenicr",
    name: "FeNiCr",
    group: "ferro",
    accepts: "Ferro-nickel-chrome units for refiners, alloy producers and the stainless-steel sector.",
    images: [],
    tables: [],
    also: ["FeW", "FeMo", "FeNb", "FeTi"],
  },
  {
    slug: "stainless-steel",
    name: "Stainless Steel",
    group: "ferro",
    accepts: "Austenitic, duplex and precipitation-hardening grades — 304, 316, Duplex, 17-4 PH.",
    images: ["/images/metals/stamped-components.jpg"],
    tables: [{ category: "stainless-steel" }],
  },

  /* ── Steels & Titanium ────────────────────────────────────────────────── */
  {
    slug: "hss-tool-steel",
    name: "HSS & Tool Steel",
    group: "steels-titanium",
    accepts: "M- and T-series high speed steels; D- and H-series tool steels.",
    images: ["/images/tungsten/drills-end-mills.jpg"],
    tables: [{ category: "high-speed-steels" }, { category: "tool-steels" }],
  },
  {
    slug: "maraging-steel",
    name: "Maraging Steel",
    group: "steels-titanium",
    accepts: "Maraging 200, 250, 300 and 350.",
    images: [],
    tables: [{ category: "complex-nickel-alloys", only: MARAGING }],
  },
  {
    slug: "titanium",
    name: "Titanium",
    group: "steels-titanium",
    accepts: "Ti-6/4, CP Ti, 3D powder.",
    images: [],
    tables: [{ category: "titanium-alloys" }],
  },

  /* ── Refractory & Rare Metals ─────────────────────────────────────────── */
  {
    slug: "tungsten-moly",
    name: "Tungsten & Moly",
    group: "refractory",
    threshold: "8%+",
    accepts: "Incl. offgrade and units containing 8%+ content.",
    detail: "Carbide, Densalloy, CP-W, heavy metals, swarf, sludge and crucibles.",
    images: [
      "/images/tungsten/densalloy.jpg",
      "/images/tungsten/cc-inserts.jpg",
      "/images/tungsten/swarf.jpg",
      "/images/tungsten/w-crucibles.jpg",
    ],
    tables: [{ category: "tungsten-alloys" }],
    forms: tungstenForms,
  },
  {
    slug: "niobium",
    name: "Niobium",
    group: "refractory",
    threshold: "10%+",
    accepts: "Units containing 10%+ niobium, including off-grade.",
    images: [],
    tables: [],
  },
  {
    slug: "tantalum",
    name: "Tantalum",
    group: "refractory",
    threshold: "10%+",
    accepts: "Units containing 10%+ tantalum, including off-grade.",
    images: [],
    tables: [],
  },
  {
    slug: "hafnium",
    name: "Hafnium & Ni-Hf master alloys",
    group: "refractory",
    accepts: "Hafnium and nickel-hafnium master alloys.",
    detail: "An expanding capability, alongside advanced master alloys.",
    images: [],
    tables: [],
  },
];

/** The six physical forms IMS accepts, in the intro's order. */
export const acceptedForms = ["Solids", "Turnings", "Runnings", "Grindings", "3D Powders", "Dusts"] as const;

/** Who IMS supplies, in the intro's order. */
export const customerSectors = [
  "Nickel refineries",
  "Stainless steel mills",
  "Superalloy producers",
  "Titanium industry",
  "Refractory metals industry",
] as const;

/** The intro's "Our Advantage", verbatim. */
export const advantages = [
  "Customised blends that preserve Ni value",
  "Proven track record with global refineries and alloy producers",
  "Expertise in managing complex scrap streams and off-spec grades",
  "Specialised capability in handling off-grade refractory metals — W, Mo, Nb and Ta",
  "Expanding capabilities in Hafnium and advanced master alloys",
] as const;
