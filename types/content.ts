export type AlloyGroup = "nickel" | "cobalt" | "ferrous" | "refractory" | "non-ferrous";

export interface AlloyGrade {
  /** Grade designation exactly as published in the source technical table. */
  name: string;
  /** Composition values, positionally aligned with `AlloyCategory.elements`. */
  values: string[];
}

export interface AlloyCategory {
  slug: string;
  name: string;
  group: AlloyGroup;
  summary: string;
  properties: string[];
  applications: string[];
  image: string;
  /**
   * Whether the card shows a photograph or the derived specimen artwork.
   *
   * "specimen" means IMS has no photograph of this family, and a generic
   * industrial shot standing in for it was doing more harm than good. See
   * components/materials/SpecimenArt.tsx.
   */
  cardArt: "photo" | "specimen";
  /** Element column headers for the composition table. */
  elements: string[];
  grades: AlloyGrade[];
}

export interface RecoveryStream {
  slug: string;
  name: string;
  image: string;
  /** Physical form, used for grouping and filtering. */
  form: "Powder" | "Dust" | "Filtercake" | "Oxide" | "Solids" | "Sludge" | "Scale";
}

export interface TungstenForm {
  slug: string;
  name: string;
  image: string;
  note: string;
}

export interface Industry {
  slug: string;
  name: string;
  strapline: string;
  intro: string;
  image: string;
  capabilities: { title: string; body: string }[];
  materials: string[];
}

export interface Article {
  slug: string;
  title: string;
  standfirst: string;
  description: string;
  published: string;
  updated?: string;
  readingMinutes: number;
  image: string;
  imageAlt: string;
  /** Original WordPress permalink, preserved for the 301 redirect map. */
  legacyPath: string;
  body: ArticleBlock[];
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

/**
 * Slim projection of a category, without the composition rows.
 *
 * Server components pass this to client components that only need to list or
 * search categories, so the full grade tables stay out of the browser bundle.
 */
export interface AlloyCategorySummary {
  slug: string;
  name: string;
  group: AlloyGroup;
  summary: string;
  properties: string[];
  applications: string[];
  image: string;
  /**
   * Whether the card shows a photograph or the derived specimen artwork.
   *
   * "specimen" means IMS has no photograph of this family, and a generic
   * industrial shot standing in for it was doing more harm than good. See
   * components/materials/SpecimenArt.tsx.
   */
  cardArt: "photo" | "specimen";
  gradeCount: number;
  /** Grade designations only — enough to search, without the element values. */
  gradeNames: string[];
}

/**
 * The narrowest projection the homepage index needs.
 *
 * Props passed to a client component are serialised into the page's RSC payload
 * and shipped inside the HTML. Passing the full summary put all 295 grade names
 * into every homepage response for no reason; this carries only what renders.
 */
export interface AlloyCategoryTeaser {
  slug: string;
  name: string;
  summary: string;
  applications: string[];
  image: string;
  /**
   * Whether the card shows a photograph or the derived specimen artwork.
   *
   * "specimen" means IMS has no photograph of this family, and a generic
   * industrial shot standing in for it was doing more harm than good. See
   * components/materials/SpecimenArt.tsx.
   */
  cardArt: "photo" | "specimen";
  gradeCount: number;
}
