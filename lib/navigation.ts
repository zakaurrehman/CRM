import { alloyCategories } from "@/data/alloys";
import { industries } from "@/data/industries";
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
  href: string;
  /** Present when the item opens a mega menu. */
  columns?: NavColumn[];
  /** Optional promoted panel shown alongside the columns. */
  feature?: { title: string; body: string; href: string; cta: string; image: string };
}

export const alloyGroupLabels: Record<AlloyGroup, string> = {
  nickel: "Nickel Alloys",
  cobalt: "Cobalt Alloys",
  ferrous: "Ferrous & Steels",
  refractory: "Refractory & Reactive",
  "non-ferrous": "Non-Ferrous & Specialty",
};

export const alloyGroupOrder: AlloyGroup[] = ["nickel", "cobalt", "ferrous", "refractory", "non-ferrous"];

function materialColumns(): NavColumn[] {
  return alloyGroupOrder.map((group) => ({
    heading: alloyGroupLabels[group],
    links: alloyCategories
      .filter((c) => c.group === group)
      .map((c) => ({ label: c.name, href: `/materials/${c.slug}` })),
  }));
}

/** The catalogue tools, promoted alongside the categories rather than buried in a page. */
const toolsColumn: NavColumn = {
  heading: "Tools",
  links: [
    { label: "Alloy Finder", href: "/materials/finder", description: "Search by element content" },
    { label: "Compare Grades", href: "/materials/compare", description: "Up to four side by side" },
    { label: "Saved Materials", href: "/materials/saved", description: "Your shortlist" },
    { label: "Request a Quotation", href: "/rfq", description: "Line-by-line RFQ" },
  ],
};

export const navigation: NavItem[] = [
  {
    label: "About",
    href: "/about",
    columns: [
      {
        heading: "The company",
        links: [
          { label: "Company", href: "/about", description: "Who we are and how we trade" },
          { label: "Our Capabilities", href: "/about#capabilities", description: "Processing, sorting and supply" },
        ],
      },
      {
        heading: "How we operate",
        links: [
          { label: "Quality & Compliance", href: "/about/quality-and-compliance", description: "Laboratory, testing and traceability" },
          { label: "Sustainability", href: "/about/sustainability", description: "Recovery in place of primary mining" },
        ],
      },
    ],
    feature: {
      title: "How IMS works",
      body: "Six steps from arising to certified material returning to the melt.",
      href: "/about#process",
      cta: "See the process",
      image: "/images/company/claw-crane.jpg",
    },
  },
  {
    label: "Materials",
    href: "/materials",
    columns: [...materialColumns(), toolsColumn],
    feature: {
      title: "Alloy finder",
      body: "Search every grade by element content — \"cobalt free, chromium above 20\" — and compare the shortlist side by side.",
      href: "/materials/finder",
      cta: "Search by composition",
      image: "/images/metals/steel-rods.jpg",
    },
  },
  {
    label: "Recycling",
    href: "/recycling",
    columns: [
      {
        heading: "Recovery services",
        links: [
          { label: "Metals & Waste Recovery", href: "/recycling", description: "19 metal-bearing streams" },
          { label: "Tungsten Recycling", href: "/recycling/tungsten", description: "Carbide, Densalloy, CP-W and heavy metals" },
          { label: "Aerospace Reverts", href: "/recycling/aerospace-reverts", description: "Teardown, destruction and grading" },
        ],
      },
      {
        heading: "Process",
        links: [
          { label: "Recycling Process", href: "/recycling#process", description: "Source through to certified supply" },
          { label: "Quality Control", href: "/about/quality-and-compliance", description: "Metallurgical laboratory" },
        ],
      },
    ],
    feature: {
      title: "Tungsten recycling",
      body: "Tungsten handled in almost all forms of scrap and production waste.",
      href: "/recycling/tungsten",
      cta: "Tungsten capabilities",
      image: "/images/tungsten/densalloy.jpg",
    },
  },
  {
    label: "Industries",
    href: "/industries",
    columns: [
      {
        heading: "Sectors served",
        links: industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}`, description: i.strapline })),
      },
    ],
    feature: {
      title: "Aerospace revert solutions",
      body: "Engine teardown, onsite destruction and superalloy grading.",
      href: "/industries/aerospace",
      cta: "Aerospace capabilities",
      image: "/images/aerospace/aero-engines.jpg",
    },
  },
  { label: "Insights", href: "/insights" },
];

export const footerNavigation: NavColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "About IMS", href: "/about" },
      { label: "Quality & Compliance", href: "/about/quality-and-compliance" },
      { label: "Sustainability", href: "/about/sustainability" },
      { label: "Insights", href: "/insights" },
    ],
  },
  {
    heading: "Materials",
    links: [
      { label: "All materials", href: "/materials" },
      { label: "Nickel Alloys", href: "/materials/nickel-alloys" },
      { label: "Complex Nickel Alloys", href: "/materials/complex-nickel-alloys" },
      { label: "Cobalt Alloys", href: "/materials/cobalt-alloys" },
      { label: "Stainless Steel", href: "/materials/stainless-steel" },
      { label: "Titanium Alloys", href: "/materials/titanium-alloys" },
    ],
  },
  {
    heading: "Recycling",
    links: [
      { label: "Metals & Waste Recovery", href: "/recycling" },
      { label: "Tungsten Recycling", href: "/recycling/tungsten" },
      { label: "Aerospace Reverts", href: "/recycling/aerospace-reverts" },
    ],
  },
  {
    heading: "Industries",
    links: industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })),
  },
];
