import type { ContentPack } from "./types";

/**
 * English — the source content.
 *
 * Generated from the data files so the wording is byte-identical to what the
 * site has always shipped. Every other locale is an overlay on this shape, and
 * anything a locale omits falls back to these words.
 *
 * Regenerate with `npx tsx scripts/extract-content.ts` after editing the data.
 */
export const enContent: ContentPack = {
  "categories": {
    "nickel-alloys": {
      "name": "Nickel Alloys",
      "summary": "Corrosion- and heat-resistant nickel-base alloys, including the Hastelloy, Inconel, Incoloy and Nimonic families, used where chemical attack and elevated temperature occur together.",
      "properties": [
        "Heat Resistant",
        "Corrosion Resistant",
        "Acid Resistant"
      ],
      "applications": [
        "Chemical and Food Industry",
        "Aero Engine Parts"
      ]
    },
    "tungsten-alloys": {
      "name": "Tungsten Alloys",
      "summary": "Tungsten and tungsten carbide grades characterised by very high hardness and density, used in cutting tools, wear parts and heavy metal applications.",
      "properties": [
        "High Hardness",
        "High Density"
      ],
      "applications": [
        "Cutting Tools"
      ]
    },
    "stainless-steel": {
      "name": "Stainless Steel",
      "summary": "Austenitic, ferritic, martensitic and duplex stainless grades covering the full spread of general-purpose and specialised corrosion-resistant steels.",
      "properties": [
        "Corrosion Resistant"
      ],
      "applications": [
        "Domestic",
        "Food and Dairy Industries",
        "Decorative and Constructions"
      ]
    },
    "complex-nickel-alloys": {
      "name": "Complex Nickel Alloys",
      "summary": "Precipitation-hardened and cast nickel superalloys engineered for creep resistance in the hot section of gas turbines and aero engines.",
      "properties": [
        "High Temperature Alloys",
        "Heat Resistant",
        "Corrosion Resistant",
        "Creep Resistant"
      ],
      "applications": [
        "Aero Engine Parts"
      ]
    },
    "nickel-copper": {
      "name": "Nickel Copper",
      "summary": "Monel-type nickel-copper alloys combining seawater corrosion resistance with good strength for marine and chemical service.",
      "properties": [
        "Heat Resistant",
        "Corrosion Resistant"
      ],
      "applications": [
        "Marine Castings"
      ]
    },
    "high-speed-steels": {
      "name": "High Speed Steels",
      "summary": "Tungsten- and molybdenum-base high speed steels that retain hardness at cutting temperature, including the M and T series.",
      "properties": [
        "Wear Resistant",
        "High Hardness at Temperature"
      ],
      "applications": [
        "Cutting of Metals (High Cutting Rates)"
      ]
    },
    "cobalt-alloys": {
      "name": "Cobalt Alloys",
      "summary": "Cobalt-base wear, heat and corrosion resistant alloys — the Stellite and MAR-M families — used for hardfacing and turbine hot-section components.",
      "properties": [
        "Heat Resistant",
        "Corrosion Resistant",
        "Wear Resistant"
      ],
      "applications": [
        "Aero Engine Parts"
      ]
    },
    "copper-nickel-alloys": {
      "name": "Copper Nickel Alloys",
      "summary": "Cupro-nickels and nickel silvers used for seawater piping, heat exchangers, condensers and decorative applications.",
      "properties": [
        "Corrosion Resistant"
      ],
      "applications": [
        "Decorative",
        "Water/Heat Transfer"
      ]
    },
    "tool-steels": {
      "name": "Tool Steels",
      "summary": "Cold-work, hot-work and shock-resisting tool steels selected for hardness, toughness and dimensional stability in tooling and dies.",
      "properties": [
        "Wear Resistant",
        "High Hardness"
      ],
      "applications": [
        "Tools and Dies (Cold Work)",
        "Hot Work Dies"
      ]
    },
    "cobalt-iron-alloys": {
      "name": "Cobalt Iron Alloys",
      "summary": "High-permeability cobalt-iron and cobalt-vanadium alloys used in transformer laminations, magnetic cores and electronic assemblies.",
      "properties": [
        "Magnetic Properties (High Permeability)"
      ],
      "applications": [
        "Electronics Industry"
      ]
    },
    "alloy-irons": {
      "name": "Alloy Irons",
      "summary": "High-alloy irons and Ni-Resist type castings offering corrosion and heat resistance in chemical, pump and process equipment.",
      "properties": [
        "Heat Resistant",
        "Corrosion Resistant",
        "Acid Resistant"
      ],
      "applications": [
        "Chemical and Food Industry",
        "Aero Engine Parts"
      ]
    },
    "titanium-alloys": {
      "name": "Titanium Alloys",
      "summary": "Commercially pure titanium and alpha, alpha-beta and beta alloys offering an exceptional strength-to-weight ratio with strong corrosion resistance.",
      "properties": [
        "High Strength to Weight Ratio",
        "Good Corrosion Resistance"
      ],
      "applications": [
        "Aerospace",
        "Power Generation"
      ]
    },
    "nickel-iron-alloys": {
      "name": "Nickel Iron Alloys",
      "summary": "Controlled-expansion and soft magnetic nickel-iron alloys such as Invar, Nilo and Mumetal, plus iron-base superalloys including A286.",
      "properties": [
        "Heat Resistant",
        "Corrosion Resistant",
        "Acid Resistant"
      ],
      "applications": [
        "Chemical and Food Industry",
        "Aero Engine Parts"
      ]
    },
    "magnet-alloys": {
      "name": "Magnet Alloys",
      "summary": "Alnico and related permanent magnet alloys built on aluminium, nickel, cobalt and iron for stable magnetic performance.",
      "properties": [
        "Magnetic Properties"
      ],
      "applications": [
        "Permanent Magnets"
      ]
    },
    "zirconium-alloys": {
      "name": "Zirconium Alloys",
      "summary": "Zircaloy and related zirconium grades valued for low neutron absorption and corrosion resistance in nuclear and chemical plant.",
      "properties": [
        "Corrosion Resistant"
      ],
      "applications": [
        "Nuclear Industry"
      ]
    }
  },
  "industries": {
    "aerospace": {
      "name": "Aerospace",
      "strapline": "Revert solutions for the aviation and engine supply chain",
      "intro": "Aerospace components are built from the most tightly specified alloys in industry, and their value survives the end of service life. We provide recycling and revert solutions to the aviation and support industry, led by a team of aviation recycling specialists, with services built around each customer's material and security requirements.",
      "capabilities": [
        {
          "title": "Engine teardown",
          "body": "End-of-life engines are dismantled and separated into their constituent alloy groups so that high-value superalloy content is recovered rather than lost to mixed scrap."
        },
        {
          "title": "Onsite destruction",
          "body": "Life-limited parts and rotating components are destroyed on site, giving a verifiable end to the part's service life before the material enters the recycling stream."
        },
        {
          "title": "Sorting and grading",
          "body": "All superalloys are sorted and graded so that reverts return to the melt shop as a known, certified specification rather than an unidentified blend."
        },
        {
          "title": "Precious metal recovery",
          "body": "Gold, platinum and rhenium are recovered from coatings and components alongside the base alloy content."
        }
      ]
    },
    "oil-and-gas": {
      "name": "Oil & Gas",
      "strapline": "Alloys and prime metals for high-pressure, corrosive service",
      "intro": "Upstream and petrochemical operations run materials at the edge of their corrosion and pressure limits. We supply alloys suited to those conditions and recycle the metallic arisings that petrochemical and oil & gas processing generates.",
      "capabilities": [
        {
          "title": "Corrosion-resistant alloys",
          "body": "Nickel-base alloys selected for resistance to sour service, chlorides and elevated-temperature attack."
        },
        {
          "title": "Petrochemical arisings",
          "body": "Metallic waste from drilling, refinery and processing operations is recovered instead of being sent to landfill."
        },
        {
          "title": "Stainless and duplex supply",
          "body": "Stainless grades for drilling, pipeline and process equipment, supplied against specification."
        },
        {
          "title": "Ferro-alloy supply",
          "body": "Ferro-alloys in all sizes, packings and specifications for strength and durability in high-temperature environments."
        }
      ]
    },
    "industrial-gas-turbine": {
      "name": "Industrial Gas Turbine",
      "strapline": "Hot-section alloys for power generation",
      "intro": "Industrial gas turbines depend on nickel and cobalt alloys that hold their strength where conventional steels cannot. We supply those materials and recover critical alloy content from IGT arisings, returning it to the melt as air-melt or vacuum grade product.",
      "capabilities": [
        {
          "title": "High-temperature alloys",
          "body": "Nickel and cobalt alloys for blades, vanes, combustors and other hot-section hardware."
        },
        {
          "title": "Critical material recovery",
          "body": "Recovery and reprocessing of alloy content from turbine arisings and production scrap."
        },
        {
          "title": "Air-melt and vacuum grade",
          "body": "Material is prepared and certified for return to either air-melt or vacuum-grade production routes."
        },
        {
          "title": "Segregated by grade",
          "body": "Turbine alloys are kept separated by specification so their full metallurgical value is retained."
        }
      ]
    },
    "technology-and-mobility": {
      "name": "Technology & Mobility",
      "strapline": "Battery metals, thermal spray and additive manufacturing feedstock",
      "intro": "Electrification and advanced manufacturing have created demand for the same metals we already recover. We handle nickel and other technology metals for battery production, and supply material into thermal spray, electroplating and additive manufacturing.",
      "capabilities": [
        {
          "title": "Battery metals",
          "body": "Recovery of nickel and related metals used in electric vehicle battery production."
        },
        {
          "title": "Rare and refractory metals",
          "body": "Recovery of molybdenum, niobium, tantalum, zirconium, hafnium and rhenium from industrial streams."
        },
        {
          "title": "Powder feedstock",
          "body": "Metal powders handled for thermal spray, electroplating and 3D additive manufacturing."
        },
        {
          "title": "Medical and orthopaedic",
          "body": "Cobalt and titanium alloy streams arising from medical and orthopaedic component manufacture."
        }
      ]
    }
  },
  "streams": {
    "alloy-metal-powder": {
      "name": "Alloy Metal Powder",
      "form": "Powder"
    },
    "aod-dust": {
      "name": "AOD Dust",
      "form": "Dust"
    },
    "eaf-dust": {
      "name": "EAF Dust",
      "form": "Dust"
    },
    "wet-filtercake": {
      "name": "Wet Filtercake",
      "form": "Filtercake"
    },
    "dried-filtercake": {
      "name": "Dried Filtercake",
      "form": "Filtercake"
    },
    "grindings": {
      "name": "Grindings",
      "form": "Solids"
    },
    "ni-hydroxide": {
      "name": "Ni Hydroxide",
      "form": "Powder"
    },
    "bbs": {
      "name": "BB's",
      "form": "Solids"
    },
    "nuggets": {
      "name": "Nuggets",
      "form": "Solids"
    },
    "mill-scale": {
      "name": "Mill Scale",
      "form": "Scale"
    },
    "fine-mill-scale": {
      "name": "Fine Mill Scale",
      "form": "Scale"
    },
    "moly-oxide": {
      "name": "Moly Oxide",
      "form": "Oxide"
    },
    "ni-powder": {
      "name": "Ni Powder",
      "form": "Powder"
    },
    "plasma-dust": {
      "name": "Plasma Dust",
      "form": "Dust"
    },
    "shot-dust": {
      "name": "Shot Dust",
      "form": "Dust"
    },
    "sinter-powder": {
      "name": "Sinter Powder",
      "form": "Powder"
    },
    "mill-sludge": {
      "name": "Mill Sludge",
      "form": "Sludge"
    },
    "turnings": {
      "name": "Turnings",
      "form": "Solids"
    },
    "pelletizer-dust": {
      "name": "Pelletizer Dust",
      "form": "Dust"
    }
  },
  "tungstenForms": {
    "drills-end-mills": {
      "name": "Drills & End Mills",
      "note": "Worn and end-of-life solid carbide rotary tooling."
    },
    "mining-bits": {
      "name": "Mining Bits",
      "note": "Carbide-tipped drilling and cutting bits from mining and construction."
    },
    "densalloy": {
      "name": "Densalloy",
      "note": "Tungsten heavy alloy solids used for ballast, shielding and counterweights."
    },
    "cc-inserts": {
      "name": "CC Inserts",
      "note": "Indexable cemented carbide cutting inserts."
    },
    "sludge": {
      "name": "Sludge",
      "note": "Tungsten-bearing grinding sludge from tool production."
    },
    "swarf": {
      "name": "Swarf",
      "note": "Machining swarf carrying recoverable tungsten."
    },
    "morgan-rolls": {
      "name": "Morgan Rolls",
      "note": "Carbide rolls and roll rings from rod and bar mills."
    },
    "w-crucibles": {
      "name": "W Crucibles",
      "note": "Tungsten crucibles and furnace components from high-temperature process plant."
    },
    "swarf-bulk": {
      "name": "Swarf (bulk)",
      "note": "Loose swarf received in bulk for sorting and analysis."
    }
  },
  "process": {
    "01": {
      "title": "Source",
      "body": "Material is collected as arisings from petrochemical, oil & gas, industrial gas turbine and aerospace operations, alongside our international supply network."
    },
    "02": {
      "title": "Inspect",
      "body": "Incoming loads are sampled and booked in. Feed stock is checked against the declared specification before it enters the process."
    },
    "03": {
      "title": "Sort",
      "body": "Arisings are sorted and segregated by alloy family and grade, so that material is never downgraded by being mixed with a lower specification."
    },
    "04": {
      "title": "Process",
      "body": "Streams are processed into a saleable form — from coarse solids through to extremely fine metallic dusts and powders."
    },
    "05": {
      "title": "Certify",
      "body": "Our metallurgical laboratory analyses production and issues the certification that accompanies the material to the customer."
    },
    "06": {
      "title": "Supply",
      "body": "Certified material is supplied to end customers worldwide to be melted back into its parent alloy as either air-melt or vacuum grade product."
    }
  },
  "articles": {
    "the-essential-role-of-metals-in-modern-industries": {
      "title": "The Essential Role of Metals in Modern Industries",
      "standfirst": "Why IMS Metals & Alloys OÜ is at the Heart of Global Metal Supply Chains",
      "description": "Why IMS Metals & Alloys OÜ is at the Heart of Global Metal Supply Chains",
      "body": [
        {
          "type": "p",
          "text": "In today’s fast-paced and ever-evolving world, metals are the lifeblood of modern industries. Whether it’s the construction of skyscrapers, the development of advanced aerospace technology, or the innovation behind electric vehicle batteries, metals play a crucial role in supporting these achievements. As a key player in the global metal market, IMS Metals & Alloys OÜ is committed to ensuring that these industries have a consistent and sustainable supply of essential metals."
        },
        {
          "type": "h2",
          "text": "The Foundation of Industry"
        },
        {
          "type": "p",
          "text": "Metals like Nickel, Cobalt, Stainless Steel, and various Ferro-Alloys form the foundation of countless industries. Each metal has unique properties that make it indispensable. For example:"
        },
        {
          "type": "ul",
          "items": [
            "Nickel is highly resistant to corrosion and is used in stainless steel and other super alloys, making it vital for aerospace and chemical processing industries.",
            "Cobalt provides strength and temperature stability in high-performance applications like jet turbines and rechargeable batteries.",
            "Stainless Steel, with its rust-resistant properties, is used everywhere from medical equipment to industrial machinery."
          ]
        },
        {
          "type": "p",
          "text": "At IMS Metals & Alloys OÜ, we source, process, and supply these materials to support sectors such as oil & gas, aerospace, automotive, and industrial gas turbines."
        },
        {
          "type": "h2",
          "text": "Metals in High-Tech Applications"
        },
        {
          "type": "p",
          "text": "Advanced technology sectors, like aerospace and renewable energy, heavily rely on high-performance metals to innovate and grow. The increasing demand for super alloys —which combine metals like nickel, chromium, and cobalt—has fueled advancements in jet engines and gas turbines. These materials are designed to withstand extreme temperatures and pressures, ensuring efficiency and safety in critical applications."
        },
        {
          "type": "p",
          "text": "IMS Metals & Alloys OÜ is proud to provide these high-grade materials, ensuring that industries can continue to push boundaries with metals that meet the highest standards of durability and performance."
        },
        {
          "type": "h2",
          "text": "The Global Supply Chain: Connecting Industries"
        },
        {
          "type": "p",
          "text": "One of the key strengths of IMS Metals & Alloys OÜ is our ability to manage a global supply chain. With over 30 years of experience, we have developed long-standing relationships with suppliers, manufacturers, and logistics companies worldwide. This enables us to deliver essential metals and alloys with precision, ensuring timely availability for production needs across industries."
        },
        {
          "type": "p",
          "text": "Our business began by serving Eastern Europe, but we’ve since expanded our operations globally. This international presence, along with our partnerships with leading companies, ensures that we remain a critical player in the metals industry."
        },
        {
          "type": "h2",
          "text": "Sustainability: The Future of Metal Sourcing"
        },
        {
          "type": "p",
          "text": "As global industries grow, so does the demand for metals. However, mining new materials can have a significant environmental impact. That’s where IMS Metals & Alloys OÜ steps in with sustainable sourcing and recycling solutions."
        },
        {
          "type": "p",
          "text": "By focusing on metal recycling, we reduce waste, conserve natural resources, and lower the environmental footprint of metal production. Our expertise in recycling high-value materials like nickel, cobalt, and titanium from industrial by-products (dusts, sludges, powders) allows us to reintroduce these metals into production cycles—ensuring industries can access high-quality recycled metals without compromising performance."
        },
        {
          "type": "h2",
          "text": "Conclusion"
        },
        {
          "type": "p",
          "text": "Metals are at the core of industrial progress, and IMS Metals & Alloys OÜ plays an essential role in ensuring the global supply of these critical materials. By leveraging our expertise in sourcing, processing, and recycling, we not only support the technological advancements of today but also contribute to a sustainable and efficient future for industries around the world."
        },
        {
          "type": "p",
          "text": "If your business requires reliable, high-quality metal supply, IMS Metals & Alloys OÜ is here to provide the solutions you need. Together, we can shape the future of modern industry."
        },
        {
          "type": "p",
          "text": "Sustainable Metal Recovery: Turning Waste into Value"
        }
      ]
    },
    "sustainable-metal-recovery-turning-waste-into-value": {
      "title": "Sustainable Metal Recovery: Turning Waste into Value",
      "standfirst": "How IMS Metals & Alloys OÜ Leads the Way in Metal Recycling",
      "description": "How IMS Metals & Alloys OÜ Leads the Way in Metal Recycling",
      "body": [
        {
          "type": "p",
          "text": "In an era where sustainability is at the forefront of global business strategies, the importance of recycling cannot be overstated. For industries reliant on metals, sustainability doesn’t just mean reducing waste—it means finding innovative ways to recover valuable resources. At IMS Metals & Alloys OÜ, we specialize in sustainable metal recovery, transforming waste into high-value materials that can be reused in production cycles."
        },
        {
          "type": "h2",
          "text": "The Growing Need for Metal Recovery"
        },
        {
          "type": "p",
          "text": "As industries like aerospace, oil & gas, and automotive continue to expand, the demand for metals has surged. However, mining virgin metals is not only costly but also has significant environmental impacts. Extracting raw metals leads to habitat destruction, high energy consumption, and increased CO2 emissions."
        },
        {
          "type": "p",
          "text": "This is where IMS Metals & Alloys OÜ steps in. Through our advanced recycling techniques, we turn industrial waste into reusable metals, reducing the need for mining while preserving natural resources. Our commitment to sustainability helps companies lower their environmental footprint without compromising the quality of the metals they need."
        },
        {
          "type": "h2",
          "text": "The Metal Recovery Process: Turning Waste into Value"
        },
        {
          "type": "p",
          "text": "Metals are often present in industrial waste streams like powders, sludges, dusts, and other residues. Traditionally, this waste was considered useless and sent to landfills. But with advancements in technology and recycling methods, we now recognize the immense value hidden in these by-products."
        },
        {
          "type": "p",
          "text": "At IMS Metals & Alloys OÜ, we specialize in recovering high-value metals like Nickel, Cobalt, Titanium, and Tungsten from these waste streams. Here’s how our process works:"
        },
        {
          "type": "ul",
          "items": [
            "Collection and Sorting: We gather metallic waste from various industries, including aerospace, petrochemical, and oil & gas sectors. This waste is carefully sorted to separate materials that can be recycled.",
            "Processing and Refining: Using state-of-the-art techniques, we process the waste, recovering metals in their pure or alloy forms. This process requires expertise in metallurgy to ensure the quality and purity of the recovered materials.",
            "Certification and Reintroduction: The recovered metals are tested and certified to meet industry standards. Once certified, they are reintroduced into production cycles, where they are melted down and reused in new products, such as super alloys or stainless steels."
          ]
        },
        {
          "type": "p",
          "text": "By recycling these materials, IMS Metals & Alloys OÜ helps reduce landfill waste and provides industries with a cost-effective, sustainable alternative to sourcing raw metals."
        },
        {
          "type": "h2",
          "text": "Case Studies: Real-World Impact"
        },
        {
          "type": "p",
          "text": "Our sustainable metal recovery efforts have made a significant difference in industries around the world. For instance:"
        },
        {
          "type": "ul",
          "items": [
            "Aerospace Industry: In the aerospace sector, high-performance metals like Nickel Super Alloys and Titanium are crucial for manufacturing aircraft components. However, these metals are expensive to produce from raw materials. By recovering these metals from post-production waste and end-of-life parts, IMS Metals & Alloys OÜ helps the aerospace industry reduce costs and lower its environmental footprint.",
            "Oil & Gas Sector: The oil & gas industry generates substantial metallic waste, particularly from drilling operations and refinery processes. Instead of sending this waste to landfills, we recover valuable metals like Cobalt and Tungsten, enabling their reuse in new projects."
          ]
        },
        {
          "type": "p",
          "text": "Our sustainable solutions not only benefit the environment but also provide financial advantages for our clients by reducing raw material costs and minimizing waste disposal fees."
        },
        {
          "type": "h2",
          "text": "The Environmental and Economic Benefits"
        },
        {
          "type": "p",
          "text": "The benefits of metal recovery extend far beyond just waste reduction. Here’s how:"
        },
        {
          "type": "ul",
          "items": [
            "Lower Environmental Impact: By recycling metals, we reduce the need for mining, which in turn cuts down on CO2 emissions, energy consumption, and the destruction of natural habitats.",
            "Cost Savings: Recovering metals from waste is often more cost-effective than sourcing new materials. Companies can save on raw material costs, while also reducing expenses related to waste disposal.",
            "Circular Economy: Metal recovery supports a circular economy model, where waste materials are reintroduced into the production process rather than being discarded. This closed-loop system helps industries operate more sustainably and efficiently."
          ]
        },
        {
          "type": "h2",
          "text": "Why Choose IMS Metals & Alloys OÜ for Metal Recovery"
        },
        {
          "type": "p",
          "text": "At IMS Metals & Alloys OÜ, we pride ourselves on our ability to deliver innovative, cost-effective recycling solutions. Our deep expertise in metallurgy and sustainable practices ensures that we can recover metals at the highest quality, providing our clients with materials that meet the exact specifications they require."
        },
        {
          "type": "p",
          "text": "By partnering with us, companies not only reduce their environmental impact but also benefit from a reliable, sustainable source of high-quality metals. Our global network and extensive industry experience allow us to serve a diverse range of sectors, from aerospace to industrial gas turbines."
        },
        {
          "type": "h2",
          "text": "Conclusion"
        },
        {
          "type": "p",
          "text": "As industries continue to prioritize sustainability, metal recovery is becoming a key part of the solution. IMS Metals & Alloys OÜ is at the forefront of this movement, helping companies transform waste into value through advanced recycling techniques. By choosing sustainable metal recovery, businesses can reduce their reliance on mining, cut costs, and minimize their environmental footprint."
        },
        {
          "type": "p",
          "text": "If your business is looking for innovative ways to recover metals and support a greener future, IMS Metals & Alloys OÜ is here to help. Let’s work together to turn waste into opportunity."
        },
        {
          "type": "p",
          "text": "The Essential Role of Metals in Modern Industries"
        },
        {
          "type": "p",
          "text": "Meeting Industry Standards with IMS Metals & Alloys OÜ"
        }
      ]
    },
    "meeting-industry-standards-with-ims-metals-alloys-ou": {
      "title": "Meeting Industry Standards with IMS Metals & Alloys OÜ",
      "standfirst": "How We Deliver Quality and Compliance Across Global Industries",
      "description": "How We Deliver Quality and Compliance Across Global Industries",
      "body": [
        {
          "type": "p",
          "text": "In today’s fast-paced industrial landscape, companies require high-performance materials that meet rigorous industry standards. Whether it’s in aerospace, oil & gas, or high-temperature applications, the metals used in critical systems must adhere to strict guidelines to ensure safety, reliability, and efficiency. At IMS Metals & Alloys OÜ, we are dedicated to supplying metals and alloys that meet and exceed industry standards, supporting companies worldwide in achieving operational excellence."
        },
        {
          "type": "h2",
          "text": "The Importance of Industry Standards"
        },
        {
          "type": "p",
          "text": "Every industry has a unique set of standards that govern material quality, performance, and safety. For example, in the aerospace industry, metals must withstand extreme temperatures and pressures without compromising structural integrity. Similarly, the oil & gas sector relies on metals that resist corrosion and can endure the harsh environments found in drilling and refining operations."
        },
        {
          "type": "p",
          "text": "Meeting these stringent requirements is essential not only to ensure safety but also to maintain the reliability of components and systems. IMS Metals & Alloys OÜ understands the critical nature of these standards, and we make it our mission to provide materials that meet the highest levels of quality and compliance."
        },
        {
          "type": "h2",
          "text": "Our Commitment to Quality"
        },
        {
          "type": "p",
          "text": "At IMS Metals & Alloys OÜ, quality is the cornerstone of our operations. We pride ourselves on a meticulous approach to sourcing, processing, and testing our metals to ensure they meet the specific requirements of our clients. Our comprehensive quality control process includes:"
        },
        {
          "type": "ul",
          "items": [
            "Metallurgical Testing: Every batch of metal we handle is rigorously tested in our state-of-the-art metallurgical laboratory. We analyze the chemical composition and mechanical properties of the materials to ensure they comply with industry specifications, whether they are intended for air-melt or vacuum-grade production.",
            "Certification: All materials provided by IMS Metals & Alloys OÜ are certified to meet relevant international standards, such as ASTM, ISO, and other industry-specific regulations. We ensure that every product delivered is accompanied by the necessary certifications and documentation.",
            "Traceability: We offer complete traceability of our metals, from the moment they are sourced to when they are delivered to our clients. This ensures that our customers have full transparency and can trust that the materials they receive meet their specifications."
          ]
        },
        {
          "type": "p",
          "text": "By adhering to these practices, we not only guarantee product quality but also ensure compliance with the stringent standards of industries like aerospace, oil & gas, and industrial gas turbines (IGT)."
        },
        {
          "type": "h2",
          "text": "Specialized Metals for Critical Applications"
        },
        {
          "type": "p",
          "text": "One of the key strengths of IMS Metals & Alloys OÜ is our ability to supply highly specialized metals and alloys tailored to specific industry needs. Some of the high-performance metals we offer include:"
        },
        {
          "type": "ul",
          "items": [
            "Nickel Super Alloys: Used extensively in aerospace and industrial gas turbines for their ability to withstand high temperatures and resist corrosion.",
            "Cobalt Alloys: Known for their high strength and resistance to wear, cobalt alloys are ideal for critical aerospace and oil & gas applications.",
            "Titanium Alloys: Lightweight yet incredibly strong, titanium is crucial for industries that require high strength-to-weight ratios, such as aerospace and medical."
          ]
        },
        {
          "type": "p",
          "text": "In addition to these metals, we provide a wide range of ferro-alloys, stainless steels, and other high-performance materials, all of which are certified to meet the demanding standards of our clients’ industries."
        },
        {
          "type": "h2",
          "text": "Custom Solutions for Aerospace Revert Metals"
        },
        {
          "type": "p",
          "text": "The aerospace industry, in particular, has stringent requirements for the metals used in aircraft engines, airframes, and other critical components. Beyond supplying high-performance alloys, IMS Metals & Alloys OÜ offers specialized aerospace revert solutions. Revert metals—those recovered from end-of-life components or manufacturing scrap—are recycled, tested, and certified to reenter the supply chain, providing a sustainable and cost-effective solution for aerospace manufacturers."
        },
        {
          "type": "p",
          "text": "Our expert team handles everything from engine teardown and component destruction to sorting and grading of superalloys. We also ensure that all precious metals, such as gold, platinum, and rhenium, are recovered and reprocessed according to industry standards. By partnering with IMS Metals & Alloys OÜ, aerospace companies can not only reduce waste but also maintain strict adherence to performance and safety standards."
        },
        {
          "type": "h2",
          "text": "Supporting the Oil & Gas Industry"
        },
        {
          "type": "p",
          "text": "The oil & gas sector operates in some of the most extreme environments on Earth, and the metals used in this industry must be able to endure corrosive conditions and high pressures. At IMS Metals & Alloys OÜ, we supply materials that meet the demanding requirements of the sector, including:"
        },
        {
          "type": "ul",
          "items": [
            "High-performance nickel alloys for corrosion resistance",
            "Stainless steels for drilling and pipeline applications",
            "Ferro-alloys that provide enhanced durability and strength in high-temperature environments"
          ]
        },
        {
          "type": "p",
          "text": "We work closely with our oil & gas clients to ensure that the materials we supply are not only of the highest quality but also comply with all relevant industry standards and regulations."
        },
        {
          "type": "h2",
          "text": "Environmental Compliance: Leading with Sustainability"
        },
        {
          "type": "p",
          "text": "At IMS Metals & Alloys OÜ, we don’t just meet industry standards for material quality; we also lead the way in environmental compliance. Our commitment to sustainability is reflected in our innovative recycling processes, which help reduce waste and minimize the environmental impact of metal production."
        },
        {
          "type": "p",
          "text": "By recovering valuable metals from industrial by-products such as powders, dusts, and sludges, we contribute to a circular economy and reduce the demand for primary metal mining. This approach not only helps our clients meet their own sustainability goals but also ensures compliance with environmental regulations worldwide."
        },
        {
          "type": "h2",
          "text": "Why IMS Metals & Alloys OÜ is the Partner You Can Trust"
        },
        {
          "type": "p",
          "text": "With over 30 years of experience, IMS Metals & Alloys OÜ has earned a reputation for delivering high-quality metals that meet the most demanding industry standards. Our extensive network of suppliers, state-of-the-art testing facilities, and commitment to quality make us the trusted partner for industries across the globe."
        },
        {
          "type": "p",
          "text": "Whether you need aerospace-grade alloys, corrosion-resistant metals for oil & gas, or high-performance materials for industrial gas turbines, we have the expertise and resources to deliver. By choosing IMS Metals & Alloys OÜ, you’re not only ensuring compliance with industry standards but also gaining a partner who is committed to your success."
        },
        {
          "type": "h2",
          "text": "Conclusion"
        },
        {
          "type": "p",
          "text": "Meeting industry standards is essential to ensuring safety, reliability, and efficiency across a range of sectors. At IMS Metals & Alloys OÜ, we provide metals and alloys that meet the highest levels of quality and compliance, supporting industries like aerospace, oil & gas, and industrial gas turbines."
        },
        {
          "type": "p",
          "text": "If your business requires materials that meet or exceed industry standards, look no further than IMS Metals & Alloys OÜ. Contact us today to learn how we can support your material needs and help you maintain the highest standards of quality and sustainability."
        },
        {
          "type": "p",
          "text": "Sustainable Metal Recovery: Turning Waste into Value"
        }
      ]
    }
  }
};
