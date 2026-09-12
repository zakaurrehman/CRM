import { portfolioGroups } from "@/data/portfolio";
import { familiesInGroup } from "@/lib/portfolio";
import type { AlloyGroup } from "@/types/content";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  /**
   * Dictionary key for the label, when there is one.
   *
   * Only the top-level items carry this. The menu contents are family names —
   * FeNiCr, Superalloys, Tungsten & Moly — which are designations rather than
   * words, and stay as published in every language.
   */
  i18nKey?: "portfolio" | "whatWeDo" | "about" | "insights";
  href: string;
  /** Present when the item opens a mega menu. */
  columns?: NavColumn[];
  /** Optional promoted panel shown alongside the columns. */
  feature?: { title: string; body: string; href: string; cta: string; image: string };
}

/**
 * Labels for the five element groups the composition tables are filed under.
 * Used by the alloy finder's group filter; the portfolio has its own groups.
 */
export const alloyGroupLabels: Record<AlloyGroup, string> = {
  nickel: "Nickel Alloys",
  cobalt: "Cobalt Alloys",
  ferrous: "Ferrous & Steels",
  refractory: "Refractory & Reactive",
  "non-ferrous": "Non-Ferrous & Specialty",
};

export const alloyGroupOrder: AlloyGroup[] = ["nickel", "cobalt", "ferrous", "refractory", "non-ferrous"];

/**
 * Three plain links and one menu.
 *
 * The menu is the portfolio: the twelve materials in two columns, then the
 * ferro-alloys, the intermediaries and the grade reference. Nothing promoted
 * beside it. Insights lives in the footer.
 */
const portfolioColumns: NavColumn[] = [
  ...portfolioGroups.map((group) => ({
    heading: group.name,
    links: familiesInGroup(group.id).map((f) => ({
      label: `${f.symbol} · ${f.name}`,
      href: `/materials/${f.slug}`,
      description: f.threshold ? `${f.threshold} content` : undefined,
    })),
  })),
  {
    heading: "Also",
    links: [
      { label: "Ferro Alloys", href: "/materials/ferro-alloys", description: "FeNiCr, FeW, FeMo, FeNb, FeTi" },
      { label: "Powders, Oxides & Intermediaries", href: "/materials#intermediates", description: "APT, oxides, hydroxides, filtercake" },
      { label: "Grade reference", href: "/materials#reference", description: "295 published compositions" },
    ],
  },
];

export const navigation: NavItem[] = [
  {
    label: "Portfolio",
    i18nKey: "portfolio",
    href: "/materials",
    columns: portfolioColumns,
  },
  { label: "What we do", i18nKey: "whatWeDo", href: "/what-we-do" },
  { label: "About", i18nKey: "about", href: "/about" },
];

export const footerNavigation: NavColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "What we do", href: "/what-we-do" },
      { label: "About IMS", href: "/about" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
  ...portfolioGroups.map((group) => ({
    heading: group.name,
    links: familiesInGroup(group.id).map((f) => ({ label: f.name, href: `/materials/${f.slug}` })),
  })),
  {
    heading: "Also",
    links: [
      { label: "Ferro Alloys", href: "/materials/ferro-alloys" },
      { label: "Powders, Oxides & Intermediaries", href: "/materials#intermediates" },
      { label: "Alloy finder", href: "/materials/finder" },
      { label: "Compare grades", href: "/materials/compare" },
      { label: "Request a quotation", href: "/rfq" },
    ],
  },
];
