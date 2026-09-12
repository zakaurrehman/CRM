import type { ContentPack } from "./types";

/**
 * Dutch content.
 *
 * NEEDS NATIVE REVIEW — see docs/content-verification.md item 21.
 *
 * Dutch metals trade keeps a good deal of English vocabulary. "Kwaliteit" is
 * used for a material grade; family names, process acronyms and trade marks stay
 * as published.
 */
export const nlContent: ContentPack = {
  categories: {
    "nickel-alloys": {
      name: "Nikkellegeringen",
      summary:
        "Corrosie- en hittebestendige legeringen op nikkelbasis, waaronder de families Hastelloy, Inconel, Incoloy en Nimonic, toegepast waar chemische aantasting en hoge temperatuur samenvallen.",
      properties: ["Hittebestendig", "Corrosiebestendig", "Zuurbestendig"],
      applications: ["Chemische en voedingsmiddelenindustrie", "Onderdelen van vliegtuigmotoren"],
    },
    "tungsten-alloys": {
      name: "Wolfraamlegeringen",
      summary:
        "Wolfraam en wolfraamcarbide-kwaliteiten met zeer hoge hardheid en dichtheid, toegepast in snijgereedschap, slijtdelen en zware metalen.",
      properties: ["Hoge hardheid", "Hoge dichtheid"],
      applications: ["Snijgereedschap"],
    },
    "stainless-steel": {
      name: "Roestvast staal",
      summary:
        "Austenitische, ferritische, martensitische en duplex roestvaste kwaliteiten, die het volledige bereik van algemene en gespecialiseerde corrosiebestendige staalsoorten bestrijken.",
      properties: ["Corrosiebestendig"],
      applications: ["Huishoudelijk", "Voedings- en zuivelindustrie", "Decoratie en bouw"],
    },
    "complex-nickel-alloys": {
      name: "Nikkel-superlegeringen",
      summary:
        "Uitscheidingshardende en gegoten nikkel-superlegeringen, ontworpen voor kruipweerstand in het hete deel van gasturbines en vliegtuigmotoren.",
      properties: ["Hogetemperatuurlegeringen", "Hittebestendig", "Corrosiebestendig", "Kruipbestendig"],
      applications: ["Onderdelen van vliegtuigmotoren"],
    },
    "nickel-copper": {
      name: "Nikkel-koper (Monel)",
      summary:
        "Nikkel-koperlegeringen van het Monel-type, die bestandheid tegen zeewatercorrosie combineren met goede sterkte voor maritieme en chemische toepassing.",
      properties: ["Hittebestendig", "Corrosiebestendig"],
      applications: ["Maritiem gietwerk"],
    },
    "high-speed-steels": {
      name: "Snelstaal",
      summary:
        "Snelstaalsoorten op wolfraam- en molybdeenbasis die hun hardheid behouden bij snijtemperatuur, inclusief de M- en T-series.",
      properties: ["Slijtvast", "Hoge hardheid bij temperatuur"],
      applications: ["Verspanen van metaal (hoge snijsnelheden)"],
    },
    "cobalt-alloys": {
      name: "Kobaltlegeringen",
      summary:
        "Slijt-, hitte- en corrosiebestendige legeringen op kobaltbasis — de families Stellite en MAR-M — voor hardlassen en onderdelen in het hete deel van turbines.",
      properties: ["Hittebestendig", "Corrosiebestendig", "Slijtvast"],
      applications: ["Onderdelen van vliegtuigmotoren"],
    },
    "copper-nickel-alloys": {
      name: "Koper-nikkellegeringen",
      summary:
        "Cupronikkel en nieuwzilver, toegepast in zeewaterleidingen, warmtewisselaars, condensors en decoratieve toepassingen.",
      properties: ["Corrosiebestendig"],
      applications: ["Decoratief", "Water- en warmteoverdracht"],
    },
    "tool-steels": {
      name: "Gereedschapsstaal",
      summary:
        "Koudwerk-, warmwerk- en schokbestendig gereedschapsstaal, gekozen om hardheid, taaiheid en maatvastheid in gereedschappen en matrijzen.",
      properties: ["Slijtvast", "Hoge hardheid"],
      applications: ["Gereedschap en matrijzen (koudwerk)", "Warmwerkmatrijzen"],
    },
    "cobalt-iron-alloys": {
      name: "Kobalt-ijzerlegeringen",
      summary:
        "Kobalt-ijzer- en kobalt-vanadiumlegeringen met hoge permeabiliteit, toegepast in transformatorlamellen, magnetische kernen en elektronica.",
      properties: ["Magnetische eigenschappen (hoge permeabiliteit)"],
      applications: ["Elektronica-industrie"],
    },
    "alloy-irons": {
      name: "Gelegeerd gietijzer",
      summary:
        "Hooggelegeerd gietijzer en gietstukken van het Ni-Resist-type, met corrosie- en hittebestandheid in chemische, pomp- en procesapparatuur.",
      properties: ["Hittebestendig", "Corrosiebestendig", "Zuurbestendig"],
      applications: ["Chemische en voedingsmiddelenindustrie", "Onderdelen van vliegtuigmotoren"],
    },
    "titanium-alloys": {
      name: "Titaanlegeringen",
      summary:
        "Commercieel zuiver titaan en alfa-, alfa-bèta- en bètalegeringen met een uitzonderlijke sterkte-gewichtsverhouding en sterke corrosiebestandheid.",
      properties: ["Hoge sterkte-gewichtsverhouding", "Goede corrosiebestandheid"],
      applications: ["Lucht- en ruimtevaart", "Energieopwekking"],
    },
    "nickel-iron-alloys": {
      name: "Nikkel-ijzerlegeringen",
      summary:
        "Nikkel-ijzerlegeringen met gecontroleerde uitzetting en zachtmagnetische eigenschappen zoals Invar, Nilo en Mumetal, plus superlegeringen op ijzerbasis waaronder A286.",
      properties: ["Hittebestendig", "Corrosiebestendig", "Zuurbestendig"],
      applications: ["Chemische en voedingsmiddelenindustrie", "Onderdelen van vliegtuigmotoren"],
    },
    "magnet-alloys": {
      name: "Magneetlegeringen",
      summary:
        "Alnico en verwante permanentmagneetlegeringen op basis van aluminium, nikkel, kobalt en ijzer, voor stabiele magnetische prestaties.",
      properties: ["Magnetische eigenschappen"],
      applications: ["Permanente magneten"],
    },
    "zirconium-alloys": {
      name: "Zirkoniumlegeringen",
      summary:
        "Zircaloy en verwante zirkoniumkwaliteiten, gewaardeerd om lage neutronenabsorptie en corrosiebestandheid in nucleaire en chemische installaties.",
      properties: ["Corrosiebestendig"],
      applications: ["Nucleaire industrie"],
    },
  },



  tungstenForms: {
    "drills-end-mills": {
      name: "Boren en frezen",
      note: "Versleten en afgedankt massief hardmetalen roterend gereedschap.",
    },
    "mining-bits": {
      name: "Mijnbouwbeitels",
      note: "Boor- en snijbeitels met hardmetalen punt uit mijnbouw en bouw.",
    },
    densalloy: {
      name: "Densalloy",
      note: "Massieve wolfraam-zwaarlegeringen voor ballast, afscherming en contragewichten.",
    },
    "cc-inserts": { name: "Hardmetalen wisselplaten", note: "Verwisselbare snijplaten van gesinterd hardmetaal." },
    sludge: { name: "Slib", note: "Wolfraamhoudend slijpslib uit de gereedschapsproductie." },
    swarf: { name: "Verspaningsafval", note: "Verspaningsafval met terugwinbaar wolfraam." },
    "morgan-rolls": { name: "Morgan-rollen", note: "Hardmetalen walsen en walsringen uit draad- en staafwalserijen." },
    "w-crucibles": {
      name: "Wolfraam smeltkroezen",
      note: "Wolfraam smeltkroezen en ovendelen uit hogetemperatuurinstallaties.",
    },
    "swarf-bulk": { name: "Verspaningsafval (bulk)", note: "Los verspaningsafval, in bulk ontvangen voor sortering en analyse." },
  },


  articles: {
    "the-essential-role-of-metals-in-modern-industries": {
      title: "De essentiële rol van metalen in de moderne industrie",
      standfirst: "Waarom IMS Metals & Alloys OÜ centraal staat in mondiale metaalketens",
      description: "Waarom IMS Metals & Alloys OÜ centraal staat in mondiale metaalketens",
    },
    "sustainable-metal-recovery-turning-waste-into-value": {
      title: "Duurzame metaalterugwinning: van afval naar waarde",
      standfirst: "Hoe IMS Metals & Alloys OÜ voorop loopt in metaalrecycling",
      description: "Hoe IMS Metals & Alloys OÜ voorop loopt in metaalrecycling",
    },
    "meeting-industry-standards-with-ims-metals-alloys-ou": {
      title: "Voldoen aan industrienormen met IMS Metals & Alloys OÜ",
      standfirst: "Hoe wij kwaliteit en conformiteit leveren in de wereldwijde industrie",
      description: "Hoe wij kwaliteit en conformiteit leveren in de wereldwijde industrie",
    },
  },
};
