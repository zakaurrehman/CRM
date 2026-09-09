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

  industries: {
    aerospace: {
      name: "Lucht- en ruimtevaart",
      strapline: "Revert-oplossingen voor de luchtvaart en de motortoeleveringsketen",
      intro:
        "Luchtvaartcomponenten worden gemaakt van de strengst gespecificeerde legeringen in de industrie, en hun waarde blijft bestaan na het einde van de levensduur. Wij bieden de luchtvaartsector recycling- en revert-oplossingen, geleid door specialisten in luchtvaartrecycling, met diensten die zijn opgebouwd rond de materiaal- en beveiligingseisen van elke klant.",
      capabilities: [
        {
          title: "Demontage van motoren",
          body: "Motoren aan het einde van hun levensduur worden gedemonteerd en gescheiden naar legeringsgroep, zodat waardevolle superlegeringen worden teruggewonnen in plaats van verloren te gaan in gemengd schroot.",
        },
        {
          title: "Vernietiging op locatie",
          body: "Onderdelen met beperkte levensduur en roterende componenten worden ter plaatse vernietigd, wat een aantoonbaar einde geeft aan de levensduur voordat het materiaal de recyclingstroom in gaat.",
        },
        {
          title: "Sorteren en classificeren",
          body: "Alle superlegeringen worden gesorteerd en geclassificeerd, zodat revert als bekende, gecertificeerde specificatie terugkomt bij de smelterij en niet als ongeïdentificeerd mengsel.",
        },
        {
          title: "Terugwinning van edelmetalen",
          body: "Goud, platina en rhenium worden teruggewonnen uit coatings en componenten, naast de basislegering.",
        },
      ],
    },
    "oil-and-gas": {
      name: "Olie en gas",
      strapline: "Legeringen en primaire metalen voor hoge druk in corrosieve omstandigheden",
      intro:
        "Upstream- en petrochemische activiteiten belasten materialen tot aan de grens van hun corrosie- en drukbestendigheid. Wij leveren legeringen die daarop berekend zijn en recyclen de metaalhoudende reststromen die petrochemische en olie- en gasverwerking oplevert.",
      capabilities: [
        {
          title: "Corrosiebestendige legeringen",
          body: "Legeringen op nikkelbasis, gekozen op bestandheid tegen zure omstandigheden, chloriden en aantasting bij hoge temperatuur.",
        },
        {
          title: "Petrochemische reststromen",
          body: "Metaalafval uit boor-, raffinage- en verwerkingsactiviteiten wordt teruggewonnen in plaats van gestort.",
        },
        {
          title: "Levering roestvast en duplex",
          body: "Roestvaste kwaliteiten voor boor-, pijpleiding- en procesapparatuur, geleverd op specificatie.",
        },
        {
          title: "Levering ferrolegeringen",
          body: "Ferrolegeringen in alle korrelgroottes, verpakkingen en specificaties, voor sterkte en duurzaamheid bij hoge temperatuur.",
        },
      ],
    },
    "industrial-gas-turbine": {
      name: "Industriële gasturbines",
      strapline: "Legeringen voor het hete deel, voor energieopwekking",
      intro:
        "Industriële gasturbines steunen op nikkel- en kobaltlegeringen die hun sterkte behouden waar conventioneel staal dat niet kan. Wij leveren die materialen en winnen kritische legeringsinhoud terug uit turbinereststromen, om die als air-melt of vacuümkwaliteit terug te brengen naar de smelt.",
      capabilities: [
        {
          title: "Hogetemperatuurlegeringen",
          body: "Nikkel- en kobaltlegeringen voor schoepen, leischoepen, verbrandingskamers en andere onderdelen van het hete deel.",
        },
        {
          title: "Terugwinning van kritische materialen",
          body: "Terugwinning en herverwerking van legeringsinhoud uit turbinereststromen en productieschroot.",
        },
        {
          title: "Air-melt en vacuümkwaliteit",
          body: "Materiaal wordt voorbereid en gecertificeerd voor terugkeer naar de air-melt- of de vacuümroute.",
        },
        {
          title: "Gescheiden per kwaliteit",
          body: "Turbinelegeringen worden per specificatie gescheiden gehouden, zodat hun volledige metallurgische waarde behouden blijft.",
        },
      ],
    },
    "technology-and-mobility": {
      name: "Technologie en mobiliteit",
      strapline: "Batterijmetalen, thermisch spuiten en grondstof voor additive manufacturing",
      intro:
        "Elektrificatie en geavanceerde productie hebben vraag gecreëerd naar dezelfde metalen die wij al terugwinnen. Wij verwerken nikkel en andere technologiemetalen voor batterijproductie, en leveren materiaal aan thermisch spuiten, galvaniseren en additive manufacturing.",
      capabilities: [
        {
          title: "Batterijmetalen",
          body: "Terugwinning van nikkel en verwante metalen die worden gebruikt in de productie van batterijen voor elektrische voertuigen.",
        },
        {
          title: "Zeldzame en refractaire metalen",
          body: "Terugwinning van molybdeen, niobium, tantaal, zirkonium, hafnium en rhenium uit industriële stromen.",
        },
        {
          title: "Poedergrondstof",
          body: "Metaalpoeders verwerkt voor thermisch spuiten, galvaniseren en 3D-printen.",
        },
        {
          title: "Medisch en orthopedisch",
          body: "Kobalt- en titaanlegeringsstromen afkomstig uit de productie van medische en orthopedische componenten.",
        },
      ],
    },
  },

  streams: {
    "alloy-metal-powder": { name: "Legeringspoeder" },
    "aod-dust": { name: "AOD-stof" },
    "eaf-dust": { name: "Vlamboogovenstof (EAF)" },
    "wet-filtercake": { name: "Natte filterkoek" },
    "dried-filtercake": { name: "Gedroogde filterkoek" },
    grindings: { name: "Slijpafval" },
    "ni-hydroxide": { name: "Nikkelhydroxide" },
    bbs: { name: "BB's-korrels" },
    nuggets: { name: "Metaalklompjes" },
    "mill-scale": { name: "Walshuid" },
    "fine-mill-scale": { name: "Fijne walshuid" },
    "moly-oxide": { name: "Molybdeenoxide" },
    "ni-powder": { name: "Nikkelpoeder" },
    "plasma-dust": { name: "Plasmastof" },
    "shot-dust": { name: "Straalstof" },
    "sinter-powder": { name: "Sinterpoeder" },
    "mill-sludge": { name: "Walserijslib" },
    turnings: { name: "Draaikrullen" },
    "pelletizer-dust": { name: "Pelletiseerstof" },
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

  process: {
    "01": {
      title: "Inzamelen",
      body: "Materiaal wordt ingezameld als reststroom uit petrochemie, olie en gas, industriële gasturbines en luchtvaart, naast ons internationale toeleveringsnetwerk.",
    },
    "02": {
      title: "Controleren",
      body: "Binnenkomende vrachten worden bemonsterd en ingeboekt. Grondstof wordt getoetst aan de opgegeven specificatie voordat die het proces in gaat.",
    },
    "03": {
      title: "Sorteren",
      body: "Reststromen worden gesorteerd en gescheiden per legeringsfamilie en kwaliteit, zodat materiaal nooit in waarde daalt door vermenging met een lagere specificatie.",
    },
    "04": {
      title: "Verwerken",
      body: "Stromen worden verwerkt tot een verkoopbare vorm — van grove vaste stoffen tot uiterst fijne metaalstoffen en -poeders.",
    },
    "05": {
      title: "Certificeren",
      body: "Ons metallurgisch laboratorium analyseert de productie en geeft de certificering af die het materiaal naar de klant vergezelt.",
    },
    "06": {
      title: "Leveren",
      body: "Gecertificeerd materiaal wordt wereldwijd aan eindklanten geleverd om te worden teruggesmolten tot de oorspronkelijke legering, als air-melt of vacuümkwaliteit.",
    },
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
