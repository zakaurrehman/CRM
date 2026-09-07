import type { Industry } from "@/types/content";

/**
 * Industry capability content, consolidated from the legacy "Industries Served"
 * page and the industry sections of the legacy homepage. Claims are limited to
 * capabilities the legacy site states; nothing has been added.
 */
export const industries: Industry[] = [
  {
    slug: "aerospace",
    name: "Aerospace",
    strapline: "Revert solutions for the aviation and engine supply chain",
    intro:
      "Aerospace components are built from the most tightly specified alloys in industry, and their value survives the end of service life. We provide recycling and revert solutions to the aviation and support industry, led by a team of aviation recycling specialists, with services built around each customer's material and security requirements.",
    image: "/images/aerospace/aero-engines.jpg",
    capabilities: [
      {
        title: "Engine teardown",
        body: "End-of-life engines are dismantled and separated into their constituent alloy groups so that high-value superalloy content is recovered rather than lost to mixed scrap.",
      },
      {
        title: "Onsite destruction",
        body: "Life-limited parts and rotating components are destroyed on site, giving a verifiable end to the part's service life before the material enters the recycling stream.",
      },
      {
        title: "Sorting and grading",
        body: "All superalloys are sorted and graded so that reverts return to the melt shop as a known, certified specification rather than an unidentified blend.",
      },
      {
        title: "Precious metal recovery",
        body: "Gold, platinum and rhenium are recovered from coatings and components alongside the base alloy content.",
      },
    ],
    materials: ["complex-nickel-alloys", "nickel-alloys", "cobalt-alloys", "titanium-alloys"],
  },
  {
    slug: "oil-and-gas",
    name: "Oil & Gas",
    strapline: "Alloys and prime metals for high-pressure, corrosive service",
    intro:
      "Upstream and petrochemical operations run materials at the edge of their corrosion and pressure limits. We supply alloys suited to those conditions and recycle the metallic arisings that petrochemical and oil & gas processing generates.",
    image: "/images/oil-gas/steel-pipes.jpg",
    capabilities: [
      {
        title: "Corrosion-resistant alloys",
        body: "Nickel-base alloys selected for resistance to sour service, chlorides and elevated-temperature attack.",
      },
      {
        title: "Petrochemical arisings",
        body: "Metallic waste from drilling, refinery and processing operations is recovered instead of being sent to landfill.",
      },
      {
        title: "Stainless and duplex supply",
        body: "Stainless grades for drilling, pipeline and process equipment, supplied against specification.",
      },
      {
        title: "Ferro-alloy supply",
        body: "Ferro-alloys in all sizes, packings and specifications for strength and durability in high-temperature environments.",
      },
    ],
    materials: ["nickel-alloys", "stainless-steel", "cobalt-alloys", "nickel-copper"],
  },
  {
    slug: "industrial-gas-turbine",
    name: "Industrial Gas Turbine",
    strapline: "Hot-section alloys for power generation",
    intro:
      "Industrial gas turbines depend on nickel and cobalt alloys that hold their strength where conventional steels cannot. We supply those materials and recover critical alloy content from IGT arisings, returning it to the melt as air-melt or vacuum grade product.",
    image: "/images/turbine/turbine-manufacturing.jpg",
    capabilities: [
      {
        title: "High-temperature alloys",
        body: "Nickel and cobalt alloys for blades, vanes, combustors and other hot-section hardware.",
      },
      {
        title: "Critical material recovery",
        body: "Recovery and reprocessing of alloy content from turbine arisings and production scrap.",
      },
      {
        title: "Air-melt and vacuum grade",
        body: "Material is prepared and certified for return to either air-melt or vacuum-grade production routes.",
      },
      {
        title: "Segregated by grade",
        body: "Turbine alloys are kept separated by specification so their full metallurgical value is retained.",
      },
    ],
    materials: ["complex-nickel-alloys", "cobalt-alloys", "nickel-alloys", "tungsten-alloys"],
  },
  {
    slug: "technology-and-mobility",
    name: "Technology & Mobility",
    strapline: "Battery metals, thermal spray and additive manufacturing feedstock",
    intro:
      "Electrification and advanced manufacturing have created demand for the same metals we already recover. We handle nickel and other technology metals for battery production, and supply material into thermal spray, electroplating and additive manufacturing.",
    image: "/images/metals/stamped-components.jpg",
    capabilities: [
      {
        title: "Battery metals",
        body: "Recovery of nickel and related metals used in electric vehicle battery production.",
      },
      {
        title: "Rare and refractory metals",
        body: "Recovery of molybdenum, niobium, tantalum, zirconium, hafnium and rhenium from industrial streams.",
      },
      {
        title: "Powder feedstock",
        body: "Metal powders handled for thermal spray, electroplating and 3D additive manufacturing.",
      },
      {
        title: "Medical and orthopaedic",
        body: "Cobalt and titanium alloy streams arising from medical and orthopaedic component manufacture.",
      },
    ],
    materials: ["titanium-alloys", "cobalt-alloys", "magnet-alloys", "zirconium-alloys"],
  },
];

export const industryBySlug = new Map(industries.map((i) => [i.slug, i]));
