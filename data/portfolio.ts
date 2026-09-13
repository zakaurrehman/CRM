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
 * Images are for the material's own page: the first sets its header, the rest
 * cross-fade in the "What we accept" section. The portfolio cards carry no
 * photograph (13 September 2026) — the symbol identifies the material. A
 * material with no photograph yet has an empty list, and its page simply
 * opens without one.
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
  /** What IMS accepts, in one line. The intro's wording wherever it gives one. Opens the page. */
  accepts: string;
  /**
   * The material as a noun in a sentence — "superalloy", "stainless steel" —
   * for "Filter superalloy grades by name" and the like, where the family name
   * ("Superalloys") reads wrongly.
   */
  noun: string;
  /**
   * The "What we accept" sentence: the shape of the lots, and the condition
   * on all of them — chemistry, form and condition. Distinct from `accepts`
   * so the page does not say the same thing twice (IMS, 14 September 2026).
   */
  acceptance: string;
  /** Content threshold, only where the intro states one. */
  threshold?: string;
  /** Up to four photographs, on the material's page: the first in its header, the rest cross-fading below. */
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
  { id: "alloys", name: "Nickel, Cobalt, Titanium & Specialty Steels" },
  /* Zirconium and hafnium are reactive metals; W, Mo, Nb and Ta refractory. */
  { id: "metals", name: "Reactive & Refractory Metals" },
];

export const MAX_FAMILY_IMAGES = 4;

const MARAGING = ["MARAGING 200", "MARAGING 250", "MARAGING 300", "MARAGING 350"];

/** Superalloys first; then the nickel, cobalt, titanium and steel families; then the refractory metals W, Mo, Nb, Ta and the reactive Hf and Zr — that order on IMS's word (14 September 2026). */
export const portfolioFamilies: PortfolioFamily[
] = [
  {
    slug: "superalloys",
    name: "Superalloys",
    noun: "superalloy",
    symbol: "Ni",
    group: "alloys",
    accepts: "718, 625, 713, Waspaloy, Hastelloy types, René alloys, off-spec and mixed lots.",
    acceptance: "Segregated grades, mixed superalloy revert, off-spec material and non-vacuum-quality lots, subject to chemistry, form and condition.",
    /* No photograph until IMS supplies one of the material itself: the stock
       turbine hall that stood here read as a claim about the alloy, or about
       stock (IMS, 14 September 2026). */
    images: [],
    tables: [{ category: "complex-nickel-alloys", except: MARAGING }],
  },
  {
    slug: "high-nickel-alloys",
    name: "High-Nickel Alloys",
    noun: "high-nickel alloy",
    symbol: "Ni",
    group: "alloys",
    accepts: "Inconel, Hastelloy, Incoloy and Nimonic types.",
    acceptance: "Segregated grades, mixed high-nickel revert, off-spec and contaminated lots, subject to chemistry, form and condition.",
    images: [],
    tables: [{ category: "nickel-alloys" }],
  },
  {
    slug: "cobalt-alloys",
    name: "Cobalt-Based Alloys",
    noun: "cobalt-based alloy",
    symbol: "Co",
    group: "alloys",
    accepts: "Stellite, MAR-M and Umco types.",
    acceptance: "Segregated grades, mixed cobalt-based revert and off-spec lots, subject to chemistry, form and condition.",
    images: [],
    tables: [{ category: "cobalt-alloys" }],
  },
  {
    slug: "titanium",
    name: "Titanium",
    noun: "titanium",
    symbol: "Ti",
    group: "alloys",
    accepts: "Ti-6/4, CP Ti, AM and 3D powders.",
    acceptance: "Segregated grades, mixed titanium and titanium-superalloy turnings, and off-spec powders, subject to chemistry, form and condition.",
    images: [],
    tables: [{ category: "titanium-alloys" }],
  },
  {
    /* "18Ni" is the standard designation of the maraging family — 18Ni(200),
       18Ni(250) and so on — so it is the shorthand a buyer already uses. */
    slug: "maraging-steel",
    name: "Maraging Steels",
    noun: "maraging steel",
    symbol: "18Ni",
    group: "alloys",
    accepts: "Maraging 200, 250, 300 and 350.",
    acceptance: "Segregated grades, mixed maraging lots and off-spec material, subject to chemistry, form and condition.",
    images: [],
    tables: [{ category: "complex-nickel-alloys", only: MARAGING }],
  },
  {
    slug: "stainless-steel",
    name: "Stainless Steels",
    noun: "stainless steel",
    symbol: "SS",
    group: "alloys",
    accepts: "Austenitic, duplex and precipitation-hardening grades — 304, 316, Duplex, 17-4 PH.",
    acceptance: "Segregated grades, mixed stainless lots and off-spec material, subject to chemistry, form and condition.",
    images: [],
    tables: [{ category: "stainless-steel" }],
  },
  {
    slug: "hss-tool-steel",
    name: "High-Speed & Tool Steels",
    noun: "high-speed and tool steel",
    symbol: "HSS",
    group: "alloys",
    accepts: "M- and T-series high speed steels; D- and H-series tool steels.",
    acceptance: "Segregated grades, mixed tool-steel lots, grindings and off-spec material, subject to chemistry, form and condition.",
    images: [],
    tables: [{ category: "high-speed-steels" }, { category: "tool-steels" }],
  },
  {
    /* Both sides of the family: cupro-nickels (copper base — Kunifer, 70/30)
       and the Monels (nickel base). The trade buys them together, and the
       two legacy tables were sitting in the reference pile until IMS asked
       for the field on 12 September. */
    slug: "cu-ni-alloys",
    name: "Copper-Nickel Alloys",
    noun: "copper-nickel alloy",
    symbol: "CuNi",
    group: "alloys",
    accepts: "Cupro-nickels and nickel silvers — 70/30, 90/10, Kunifer — and Monel nickel-copper types.",
    acceptance: "Segregated grades, mixed copper-nickel lots and off-spec material, subject to chemistry, form and condition.",
    images: [],
    tables: [{ category: "copper-nickel-alloys" }, { category: "nickel-copper" }],
  },
  {
    slug: "tungsten",
    name: "Tungsten",
    noun: "tungsten",
    symbol: "W",
    group: "metals",
    threshold: "≥8%",
    accepts: "Materials containing ≥8% tungsten, including off-spec.",
    detail: "Carbide, Densalloy, CP-W, heavy metals, swarf, sludge and crucibles.",
    acceptance: "The categories below, subject to chemistry, form and condition.",
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
    noun: "molybdenum",
    symbol: "Mo",
    group: "metals",
    threshold: "≥8%",
    accepts: "Materials containing ≥8% molybdenum, including off-spec.",
    acceptance: "The categories below, subject to chemistry, form and condition.",
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
    noun: "niobium",
    symbol: "Nb",
    group: "metals",
    threshold: "≥10%",
    accepts: "Materials containing ≥10% niobium, including off-spec.",
    acceptance: "The categories below, subject to chemistry, form and condition.",
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
    noun: "tantalum",
    symbol: "Ta",
    group: "metals",
    threshold: "≥10%",
    accepts: "Materials containing ≥10% tantalum, including off-spec.",
    acceptance: "The categories below, subject to chemistry, form and condition.",
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
  {
    slug: "hafnium",
    name: "Hafnium & Ni-Hf",
    noun: "hafnium",
    symbol: "Hf",
    group: "metals",
    accepts: "Hafnium and nickel-hafnium master alloys.",
    detail: "A specialist focus, with Ni-Hf and other advanced master alloys.",
    acceptance: "The categories below, subject to chemistry, form and condition.",
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
    /* Added at IMS's request, 13 September 2026. The six grades in the
       legacy zirconium table — C.P., Zr-Nb and the Zircaloy types — move
       out of the reference pile onto this page. */
    slug: "zirconium",
    name: "Zirconium",
    noun: "zirconium",
    symbol: "Zr",
    group: "metals",
    accepts: "Commercially pure zirconium, Zr-Nb and Zircaloy types, including off-spec material.",
    acceptance: "The categories below, subject to chemistry, form and condition.",
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
  noun: "ferroalloy",
  symbol: "Fe",
  group: "alloys",
  accepts: "FeNiCr, FeW, FeMo, FeNb and FeTi — all sizes, packings and specifications.",
  acceptance: "All sizes, packings and specifications, subject to chemistry, form and condition.",
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

/**
 * The eight physical forms IMS accepts, as IMS named them on 14 September
 * 2026 — "runners, risers and gates" rather than the trade's "runnings",
 * "AM and 3D powders" rather than "3D powders". Also the form options on the
 * offer form.
 */
export const acceptedForms: AcceptedForm[] = [
  { name: "Solids", covers: ["Nuggets", "BB's", "Cut solids and components"] },
  { name: "Turnings and swarf", covers: ["Turnings", "Swarf", "Chips"] },
  { name: "Runners, risers and gates", covers: ["Casting runners, risers and gates"] },
  { name: "Grindings", covers: ["Grindings", "Grinding sludge"] },
  { name: "Fines and microgranules", covers: ["Fines", "Microgranules", "Shot"] },
  { name: "AM and 3D powders", covers: ["Additive-manufacturing powders — virgin, used, mixed-size or off-spec"] },
  { name: "Dusts", covers: ["AOD dust", "EAF dust", "Plasma dust", "Shot dust", "Pelletizer dust"] },
  { name: "Filter cake and process residues", covers: ["Filter cake, wet and dried", "Mill scale", "Mill sludge"] },
];

/**
 * The lots that define the specialisation — what "complex" means in
 * practice. IMS's list of 14 September 2026, verbatim.
 */
export const typicalMaterials = [
  "Mixed 718, 625, Waspaloy with contamination",
  "Non-vacuum-grade superalloy turnings",
  "Contaminated or off-spec high-nickel alloys",
  "Nickel-alloy dusts, fines and grindings",
  "Mixed titanium and superalloy turnings",
  "Off-spec tungsten, Mo, Nb & Ta-bearing materials",
  "Hf and Hf/Ni materials",
  "Powders, oxides and refining intermediates",
] as const;

/** Who IMS supplies, in the intro's order. */
export const customerSectors = [
  "Nickel refineries",
  "Stainless steel mills",
  "Superalloy producers",
  "Titanium industry",
  "Refractory metals industry",
] as const;

/** "Our Advantage" — the six points IMS set on 14 September 2026. */
export const advantages = [
  "Tailored blends designed to preserve nickel value",
  "Specialist knowledge of complex, mixed and off-spec materials",
  "Access to an international network of processing facilities and laboratories",
  "Commercial routes for materials conventional channels may downgrade",
  "Experience across high-nickel, superalloy, titanium and refractory materials",
  "Specialist focus on Hafnium, Ni-Hf and advanced master alloys",
] as const;
