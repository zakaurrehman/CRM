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
 * Four plain links and one menu.
 *
 * The menu is the portfolio: the four groups as columns, the families under
 * them, and nothing promoted beside it. Everything that used to open a panel
 * — Recycling, Industries, About with its sub-pages — is either a single page
 * now or is gone. Insights lives in the footer.
 */
const portfolioColumns: NavColumn[] = portfolioGroups.map((group) => ({
  heading: group.name,
  links: familiesInGroup(group.id).map((f) => ({
    label: f.name,
    href: `/materials/${f.slug}`,
    description: f.threshold ? `${f.threshold} content` : undefined,
  })),
}));

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
  {
    heading: "Portfolio",
    links: [
      ...portfolioGroups.map((group) => ({ label: group.name, href: `/materials#group-${group.id}` })),
      { label: "All families", href: "/materials" },
    ],
  },
  {
    /* Listed by family, not just by group: these are the ones IMS asked
       where they were. */
    heading: "Refractory & Rare Metals",
    links: familiesInGroup("refractory").map((f) => ({ label: f.name, href: `/materials/${f.slug}` })),
  },
  {
    heading: "Grade reference",
    links: [
      { label: "Alloy finder", href: "/materials/finder" },
      { label: "Compare grades", href: "/materials/compare" },
      { label: "Request a quotation", href: "/rfq" },
    ],
  },
];
