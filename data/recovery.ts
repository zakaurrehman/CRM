import type { TungstenForm } from "@/types/content";

/**
 * Tungsten scrap and production-waste forms, from the legacy Tungsten
 * Recycling page, each with its original photograph. They now sit on the
 * Tungsten & Moly family page as the forms accepted — which is what the
 * intro's "incl. offgrade" covers in practice.
 *
 * The source listed "Swarf" twice against two different photographs; the
 * second is presented here as bulk swarf and flagged for confirmation.
 *
 * The nineteen residue streams and the six-step process that used to live in
 * this file were the previous website's description of the business and are
 * not in the company intro. Retired pending docs/refocus-plan.md Q3.
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
