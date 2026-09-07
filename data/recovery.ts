import type { RecoveryStream, TungstenForm, ProcessStep } from "@/types/content";

/**
 * Metal-bearing streams listed on the legacy "Metals and Waste Recovery" page,
 * in source order, each paired with its original product photograph.
 *
 * Two names were corrected for obvious typography and are flagged in
 * /docs/content-verification.md: "Nuggetts" -> "Nuggets", "BB's01" -> "BB's".
 */
export const recoveryStreams: RecoveryStream[] = [
  { slug: "alloy-metal-powder", name: "Alloy Metal Powder", image: "/images/recycling/alloy-metal-powder.png", form: "Powder" },
  { slug: "aod-dust", name: "AOD Dust", image: "/images/recycling/aod-dust.png", form: "Dust" },
  { slug: "eaf-dust", name: "EAF Dust", image: "/images/recycling/eaf-dust.png", form: "Dust" },
  { slug: "wet-filtercake", name: "Wet Filtercake", image: "/images/recycling/wet-filtercake.png", form: "Filtercake" },
  { slug: "dried-filtercake", name: "Dried Filtercake", image: "/images/recycling/dried-filtercake.png", form: "Filtercake" },
  { slug: "grindings", name: "Grindings", image: "/images/recycling/grindings.png", form: "Solids" },
  { slug: "ni-hydroxide", name: "Ni Hydroxide", image: "/images/recycling/ni-hydroxide.png", form: "Powder" },
  { slug: "bbs", name: "BB's", image: "/images/recycling/bbs.png", form: "Solids" },
  { slug: "nuggets", name: "Nuggets", image: "/images/recycling/nuggets.png", form: "Solids" },
  { slug: "mill-scale", name: "Mill Scale", image: "/images/recycling/mill-scale.png", form: "Scale" },
  { slug: "fine-mill-scale", name: "Fine Mill Scale", image: "/images/recycling/fine-mill-scale.png", form: "Scale" },
  { slug: "moly-oxide", name: "Moly Oxide", image: "/images/recycling/moly-oxide.png", form: "Oxide" },
  { slug: "ni-powder", name: "Ni Powder", image: "/images/recycling/ni-powder.png", form: "Powder" },
  { slug: "plasma-dust", name: "Plasma Dust", image: "/images/recycling/plasma-dust.png", form: "Dust" },
  { slug: "shot-dust", name: "Shot Dust", image: "/images/recycling/shot-dust.png", form: "Dust" },
  { slug: "sinter-powder", name: "Sinter Powder", image: "/images/recycling/sinter-powder.png", form: "Powder" },
  { slug: "mill-sludge", name: "Mill Sludge", image: "/images/recycling/mill-sludge.png", form: "Sludge" },
  { slug: "turnings", name: "Turnings", image: "/images/recycling/turnings.png", form: "Solids" },
  { slug: "pelletizer-dust", name: "Pelletizer Dust", image: "/images/recycling/pelletizer-dust.png", form: "Dust" },
];

export const recoveryForms = ["Powder", "Dust", "Filtercake", "Oxide", "Solids", "Sludge", "Scale"] as const;

/**
 * Tungsten scrap and production-waste forms from the legacy Tungsten Recycling
 * page. The source listed "Swarf" twice against two different photographs; the
 * second is presented here as bulk swarf and flagged for confirmation.
 */
export const tungstenForms: TungstenForm[] = [
  { slug: "drills-end-mills", name: "Drills & End Mills", image: "/images/tungsten/drills-end-mills.jpg", note: "Worn and end-of-life solid carbide rotary tooling." },
  { slug: "mining-bits", name: "Mining Bits", image: "/images/tungsten/mining-bits.jpg", note: "Carbide-tipped drilling and cutting bits from mining and construction." },
  { slug: "densalloy", name: "Densalloy", image: "/images/tungsten/densalloy.jpg", note: "Tungsten heavy alloy solids used for ballast, shielding and counterweights." },
  { slug: "cc-inserts", name: "CC Inserts", image: "/images/tungsten/cc-inserts.jpg", note: "Indexable cemented carbide cutting inserts." },
  { slug: "sludge", name: "Sludge", image: "/images/tungsten/sludge.jpg", note: "Tungsten-bearing grinding sludge from tool production." },
  { slug: "swarf", name: "Swarf", image: "/images/tungsten/swarf.jpg", note: "Machining swarf carrying recoverable tungsten." },
  { slug: "morgan-rolls", name: "Morgan Rolls", image: "/images/tungsten/morgan-rolls.jpg", note: "Carbide rolls and roll rings from rod and bar mills." },
  { slug: "w-crucibles", name: "W Crucibles", image: "/images/tungsten/w-crucibles.jpg", note: "Tungsten crucibles and furnace components from high-temperature process plant." },
  { slug: "swarf-bulk", name: "Swarf (bulk)", image: "/images/tungsten/swarf-bulk.jpg", note: "Loose swarf received in bulk for sorting and analysis." },
];

/** Tungsten material classes named in the legacy page copy. */
export const tungstenMaterials = [
  "Tungsten Carbide",
  "Densalloy",
  "CP-W",
  "Tungsten Powder",
  "Heavy Metals",
];

/**
 * Workflow described on the legacy site: arisings are "100% sorted, segregated,
 * processed, certified and then sold to end customers around the world to be
 * melted back into their parent alloys as either Air-melt or Vacuum grade".
 */
export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Source",
    body: "Material is collected as arisings from petrochemical, oil & gas, industrial gas turbine and aerospace operations, alongside our international supply network.",
  },
  {
    number: "02",
    title: "Inspect",
    body: "Incoming loads are sampled and booked in. Feed stock is checked against the declared specification before it enters the process.",
  },
  {
    number: "03",
    title: "Sort",
    body: "Arisings are sorted and segregated by alloy family and grade, so that material is never downgraded by being mixed with a lower specification.",
  },
  {
    number: "04",
    title: "Process",
    body: "Streams are processed into a saleable form — from coarse solids through to extremely fine metallic dusts and powders.",
  },
  {
    number: "05",
    title: "Certify",
    body: "Our metallurgical laboratory analyses production and issues the certification that accompanies the material to the customer.",
  },
  {
    number: "06",
    title: "Supply",
    body: "Certified material is supplied to end customers worldwide to be melted back into its parent alloy as either air-melt or vacuum grade product.",
  },
];
