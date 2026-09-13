import { tungstenForms } from "./recovery";
import type { TungstenForm } from "@/types/content";

/**
 * The IMS portfolio, as the company intro states it, with Sharoon's
 * adjustments of 12 September 2026.
 *
 * Three parts:
 *
 * 1. Fourteen materials, one card each — no group headings at first
 *    glance. Superalloys lead: Ni-based blends are the core of the business.
 *    Each carries a symbol (Ti, Hf, W…) or the trade shorthand where it is an
 *    alloy (HSS, 18Ni), then its name. Groups organise the menu and footer.
 * 2. Ferroalloys — the five the previous website listed, as one card.
 * 3. Powders, oxides and intermediates — the refining and tool-making
 *    intermediate products IMS takes, grouped by metal, with their formulas.
 *    ("Intermediates", not "intermediaries": the latter are middlemen.)
 *
 * Naming follows one rule: elements are named as elements (Titanium,
 * Tungsten), alloy families as plural nouns with hyphenated compounds
 * (High-Nickel Alloys, High-Speed & Tool Steels).
 *
 * This sits over, not instead of, the 295-grade composition tables in
 * data/alloys.ts. Each material names the legacy categories whose tables
 * belong under it (`tables`), optionally filtered to a subset of grades. The
 * tables themselves are untouched — grade ids, anchors and slugs stay exactly
 * as they were, because they key the compare tray, saved list and RFQ lines.
 *
 * Images are slots. Up to four per material; frame 1 is the card at rest, the
 * rest cross-fade behind it. Materials with no honest photograph yet carry an
 * empty list and the card shows a quiet slot rather than a picture of some
 * other metal. See docs/refocus-plan.md for the shot list IMS is supplying.
 */

export type PortfolioGroupId = "alloys" | "metals";

export interface PortfolioGroup {
  id: PortfolioGroupId;
  name: string;
}

/**
 * A composition table that belongs under a material. `only` and `except`
 * filter by published grade name, for the one case where a legacy category
 * has to be split — the four Maraging grades sit inside "Complex Nickel
 * Alloys" in the source tables.
 */
export interface TableRef {
  category: string;
  only?: string[];
  except?: string[];
}

export interface PortfolioFamily {
  slug: string;
  name: string;
  /**
   * The element symbol, or the trade shorthand for an alloy family. Set
   * large on the card, before the name — "Ti · Titanium" — as IMS asked.
   */
  symbol: string;
  group: PortfolioGroupId;
  /** What IMS accepts, in one line. The intro's wording wherever it gives one. */
  accepts: string;
  /** Content threshold, only where the intro states one. */
  threshold?: string;
  /** Up to four photographs; frame 1 is the card at rest. */
  images: string[];
  /** Legacy composition tables shown on the material page, in order. */
  tables: TableRef[];
  /** The intro's supporting line, where it has one beyond the name. */
  detail?: string;
  /**
   * The scrap categories accepted, as the refractory-metal trade names them
   * — listed on the material page. Proposed from the trade's standard
   * categories at IMS's request (12 Sept: "Mo VQ, Mo air-melt, MoTi, master
   * alloys, off-spec Mo scrap with contamination — valid for all the
   * refractory metals"); IMS strikes any it does not buy.
   */
  accepted?: { term: string; note?: string }[];
  /** Specific physical forms accepted, each with its photograph, where IMS has published them. */
  forms?: TungstenForm[];
}

export const portfolioGroups: PortfolioGroup[] = [
  /* Titanium sits with the alloy families, under cobalt, on IMS's word
     (13 September 2026): it is bought and blended as Ti-6/4 and CP alloy,
     alongside the superalloys, rather than as a refractory unit. */
  { id: "alloys", name: "Nickel, Cobalt, Titanium & Steels" },
  /* Zirconium and hafnium are reactive metals; W, Mo, Nb and Ta refractory. */
  { id: "metals", name: "Reactive & Refractory Metals" },
];

export const MAX_FAMILY_IMAGES = 4;

const MARAGING = ["MARAGING 200", "MARAGING 250", "MARAGING 300", "MARAGING 350"];

/** Superalloys first; then the nickel, cobalt, titanium and steel families; then the reactive and refractory metals. */
export const portfolioFamilies: PortfolioFamily[] = [
  {
    slug: "superalloys",
    name: "Superalloys",
    symbol: "Ni",
    group: "alloys",
    accepts: "718, 625, 713, Waspaloy, Hastelloy types, René alloys, off-grade and mixes.",
    images: ["/images/turbine/turbine-manufacturing.jpg"],
    tables: [{ category: "complex-nickel-alloys", except: MARAGING }],
  },
  {
    slug: "high-nickel-alloys",
    name: "High-Nickel Alloys",
    symbol: "Ni",
    group: "alloys",
    accepts: "Inconel, Hastelloy, Incoloy and Nimonic types.",
    images: ["/images/hero/turnings.jpg"],
    tables: [{ category: "nickel-alloys" }],
  },
  {
    slug: "cobalt-alloys",
    name: "Cobalt-Based Alloys",
    symbol: "Co",
    group: "alloys",
    accepts: "Stellite, MAR-M and Umco types.",
    images: [],
    tables: [{ category: "cobalt-alloys" }],
  },
  {
    slug: "titanium",
    name: "Titanium",
    symbol: "Ti",
    group: "alloys",
    accepts: "Ti-6/4, CP Ti, 3D powder.",
    images: [],
    tables: [{ category: "titanium-alloys" }],
  },
  {
    /* "18Ni" is the standard designation of the maraging family — 18Ni(200),
       18Ni(250) and so on — so it is the shorthand a buyer already uses. */
    slug: "maraging-steel",
    name: "Maraging Steels",
    symbol: "18Ni",
    group: "alloys",
    accepts: "Maraging 200, 250, 300 and 350.",
    images: [],
    tables: [{ category: "complex-nickel-alloys", only: MARAGING }],
  },
  {
    slug: "stainless-steel",
    name: "Stainless Steels",
    symbol: "SS",
    group: "alloys",
    accepts: "Austenitic, duplex and precipitation-hardening grades — 304, 316, Duplex, 17-4 PH.",
    images: ["/images/metals/stamped-components.jpg"],
    tables: [{ category: "stainless-steel" }],
  },
  {
    slug: "hss-tool-steel",
    name: "High-Speed & Tool Steels",
    symbol: "HSS",
    group: "alloys",
    accepts: "M- and T-series high speed steels; D- and H-series tool steels.",
    images: ["/images/tungsten/drills-end-mills.jpg"],
    tables: [{ category: "high-speed-steels" }, { category: "tool-steels" }],
  },
  {
    /* Both sides of the family: cupro-nickels (copper base — Kunifer, 70/30)
       and the Monels (nickel base). The trade buys them together, and the
       two legacy tables were sitting in the reference pile until IMS asked
       for the field on 12 September. */
    slug: "cu-ni-alloys",
    name: "Copper-Nickel Alloys",
    symbol: "CuNi",
    group: "alloys",
    accepts: "Cupro-nickels and nickel silvers — 70/30, 90/10, Kunifer — and Monel nickel-copper types.",
    images: [],
    tables: [{ category: "copper-nickel-alloys" }, { category: "nickel-copper" }],
  },
  {
    /* Added at IMS's request, 13 September 2026. The six grades in the
       legacy zirconium table — C.P., Zr-Nb and the Zircaloy types — move
       out of the reference pile onto this page. */
    slug: "zirconium",
    name: "Zirconium",
    symbol: "Zr",
    group: "metals",
    accepts: "Commercially pure zirconium, Zr-Nb and Zircaloy types, including off-grade.",
    accepted: [
      { term: "Zr VQ", note: "vacuum quality" },
      { term: "Zircaloy types" },
      { term: "Zr-Nb alloys" },
      { term: "Zr sponge and crystal bar" },
      { term: "Master alloys" },
      { term: "Off-spec Zr scrap with contamination" },
    ],
    images: [],
    tables: [{ category: "zirconium-alloys" }],
  },
  {
    slug: "hafnium",
    name: "Hafnium & Ni-Hf",
    symbol: "Hf",
    group: "metals",
    accepts: "Hafnium and nickel-hafnium master alloys.",
    detail: "An expanding capability, alongside advanced master alloys.",
    accepted: [
      { term: "Hf VQ", note: "vacuum quality" },
      { term: "Hf crystal bar and sponge" },
      { term: "Ni-Hf and other master alloys" },
      { term: "Hf-Zr and C-103 alloys" },
      { term: "Off-spec Hf scrap with contamination" },
    ],
    images: [],
    tables: [],
  },
  {
    slug: "tungsten",
    name: "Tungsten",
    symbol: "W",
    group: "metals",
    threshold: "≥8%",
    accepts: "Units containing ≥8% tungsten, including off-grade.",
    detail: "Carbide, Densalloy, CP-W, heavy metals, swarf, sludge and crucibles.",
    accepted: [
      { term: "W VQ", note: "vacuum quality" },
      { term: "W air-melt" },
      { term: "Tungsten carbide, Densalloy, CP-W and heavy metals" },
      { term: "W-Re, W-Cu and W-La alloys" },
      { term: "Master alloys" },
      { term: "Off-spec W scrap with contamination" },
    ],
    images: [
      "/images/portfolio/tungsten-vac.jpg",
      "/images/tungsten/densalloy.jpg",
      "/images/portfolio/tungsten-sinter-boats.jpg",
      "/images/tungsten/cc-inserts.jpg",
    ],
    tables: [{ category: "tungsten-alloys" }],
    forms: tungstenForms,
  },
  {
    slug: "molybdenum",
    name: "Molybdenum",
    symbol: "Mo",
    group: "metals",
    threshold: "≥8%",
    accepts: "Units containing ≥8% molybdenum, including off-grade.",
    accepted: [
      { term: "Mo VQ", note: "vacuum quality" },
      { term: "Mo air-melt" },
      { term: "MoTi and other master alloys" },
      { term: "TZM, Mo-Re, Mo-Cu and Mo-La alloys" },
      { term: "Off-spec Mo scrap with contamination" },
    ],
    /* IMS material, September 2026. The supplied files carried internal lot
       numbers burned into a corner; those are cropped out here — the
       originals are untouched in public/images/Mo/. */
    images: [
      "/images/portfolio/molybdenum-1.jpg",
      "/images/portfolio/molybdenum-2.jpg",
      "/images/portfolio/molybdenum-3.jpg",
    ],
    tables: [],
  },
  {
    slug: "niobium",
    name: "Niobium",
    symbol: "Nb",
    group: "metals",
    threshold: "≥10%",
    accepts: "Units containing ≥10% niobium, including off-grade.",
    accepted: [
      { term: "Nb VQ", note: "vacuum quality" },
      { term: "NbTi", note: "superconductor scrap" },
      { term: "NiNb and other master alloys" },
      { term: "Nb-Zr, C-103 and other Nb alloys" },
      { term: "Off-spec Nb scrap with contamination" },
    ],
    images: ["/images/portfolio/niobium-1.jpg", "/images/portfolio/niobium-2.jpg"],
    tables: [],
  },
  {
    slug: "tantalum",
    name: "Tantalum",
    symbol: "Ta",
    group: "metals",
    threshold: "≥10%",
    accepts: "Units containing ≥10% tantalum, including off-grade.",
    accepted: [
      { term: "Ta VQ", note: "vacuum quality" },
      { term: "Ta-W alloys", note: "Ta-2.5W, Ta-10W" },
      { term: "Capacitor and sputter-target scrap" },
      { term: "Master alloys" },
      { term: "Off-spec Ta scrap with contamination" },
    ],
    images: [],
    tables: [],
  },
];

/**
 * Ferro alloys as a card in the same grid as the metals.
 *
 * Kept out of `portfolioFamilies` because it is not one material with one
 * table — it is five designations with their own page, written by hand at
 * app/materials/ferro-alloys. It is shaped like a family so the grid can
 * render it with the same card as everything else: IMS asked for each
 * material separate, and a section of its own would have made it the
 * exception.
 */
export const ferroAlloysCard: PortfolioFamily = {
  slug: "ferro-alloys",
  name: "Ferroalloys",
  symbol: "Fe",
  group: "alloys",
  accepts: "FeNiCr, FeW, FeMo, FeNb and FeTi — all sizes, packings and specifications.",
  images: [],
  tables: [],
};

/* ── Ferro alloys ─────────────────────────────────────────────────────── */

export interface FerroAlloy {
  /** The formula, which is also how the trade names it. */
  mark: string;
  name: string;
}

/**
 * The five the previous website listed, restored as a section at IMS's
 * request. FeNiCr is the intro's item; the other four are carried from the
 * old site's "full range of ferro-alloys, available in all sizes, packings
 * and specifications".
 */
export const ferroAlloys: FerroAlloy[] = [
  { mark: "FeNiCr", name: "Ferro-nickel-chrome" },
  { mark: "FeW", name: "Ferro-tungsten" },
  { mark: "FeMo", name: "Ferro-molybdenum" },
  { mark: "FeNb", name: "Ferro-niobium" },
  { mark: "FeTi", name: "Ferro-titanium" },
];

/* ── Powders, oxides & intermediates ─────────────────────────────────── */

export interface Intermediate {
  name: string;
  /** Chemical formula or trade abbreviation, shown as the mark. */
  formula?: string;
}

export interface IntermediateGroup {
  /** Element symbol; absent for residues that are not tied to one metal. */
  symbol?: string;
  metal: string;
  /** Portfolio material whose page carries this group. */
  family?: string;
  items: Intermediate[];
}

/**
 * The intermediate products of refining and tool-making that IMS takes
 * alongside scrap, as listed by IMS on 12 September 2026, plus the legacy
 * residue streams that are powders, oxides or filtercakes rather than scrap.
 *
 * Two formulas were normalised from the list as sent and are flagged for
 * confirmation: "Ta205" is read as Ta₂O₅ (tantalum pentoxide); "NbO2" is
 * carried as Nb₂O₅ (niobium pentoxide), the oxide that is actually traded —
 * NbO₂ exists but is not a commercial intermediate. YTO and WO₃ are both
 * listed as sent; YTO (yellow tungsten oxide) is a grade of WO₃.
 */
export const intermediates: IntermediateGroup[] = [
  {
    symbol: "W",
    metal: "Tungsten",
    family: "tungsten",
    items: [
      { formula: "APT", name: "Ammonium paratungstate" },
      { formula: "YTO", name: "Yellow tungsten oxide" },
      { formula: "CaWO₄", name: "Calcium tungstate" },
      { formula: "WO₃", name: "Tungsten trioxide" },
    ],
  },
  {
    symbol: "Mo",
    metal: "Molybdenum",
    family: "molybdenum",
    items: [{ formula: "MoO₃", name: "Molybdenum oxide" }],
  },
  {
    symbol: "Ta",
    metal: "Tantalum",
    family: "tantalum",
    items: [{ formula: "Ta₂O₅", name: "Tantalum pentoxide" }],
  },
  {
    symbol: "Nb",
    metal: "Niobium",
    family: "niobium",
    items: [{ formula: "Nb₂O₅", name: "Niobium pentoxide" }],
  },
  {
    symbol: "Hf",
    metal: "Hafnium",
    family: "hafnium",
    items: [{ formula: "HfO₂", name: "Hafnium dioxide" }],
  },
  {
    symbol: "Ni",
    metal: "Nickel",
    family: "high-nickel-alloys",
    items: [
      { formula: "Ni(OH)₂", name: "Nickel hydroxide" },
      { name: "Nickel powder" },
      { name: "Alloy metal powder" },
      { name: "Sinter powder" },
    ],
  },
  {
    metal: "Mill & process residues",
    items: [
      { name: "Filtercake, wet and dried" },
      { name: "Mill scale and fine mill scale" },
      { name: "Mill sludge" },
    ],
  },
];

/* ── Accepted forms ───────────────────────────────────────────────────── */

export interface AcceptedForm {
  name: string;
  /** The specific streams this form covers, from the previous website's list. */
  covers: string[];
}

/** The six physical forms IMS accepts, in the intro's order. */
export const acceptedForms: AcceptedForm[] = [
  { name: "Solids", covers: ["Nuggets", "BB's", "Cut solids and components"] },
  { name: "Turnings", covers: ["Turnings", "Swarf"] },
  { name: "Runnings", covers: ["Runners, risers and gates from casting"] },
  { name: "Grindings", covers: ["Grindings", "Grinding sludge"] },
  { name: "3D Powders", covers: ["Additive-manufacturing powder, used and off-spec"] },
  { name: "Dusts", covers: ["AOD dust", "EAF dust", "Plasma dust", "Shot dust", "Pelletizer dust"] },
];

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
