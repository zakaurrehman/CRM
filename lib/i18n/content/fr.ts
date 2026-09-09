import type { ContentPack } from "./types";

/**
 * French content.
 *
 * NEEDS NATIVE REVIEW — see docs/content-verification.md item 21.
 *
 * "Nuance" is used throughout for a material grade, which is the term the French
 * metals trade uses; "grade" would read as a quality ranking. Designations and
 * process acronyms stay as published.
 */
export const frContent: ContentPack = {
  categories: {
    "nickel-alloys": {
      name: "Alliages de nickel",
      summary:
        "Alliages base nickel résistants à la corrosion et à la chaleur, dont les familles Hastelloy, Inconel, Incoloy et Nimonic, employés là où attaque chimique et température élevée se conjuguent.",
      properties: ["Résistant à la chaleur", "Résistant à la corrosion", "Résistant aux acides"],
      applications: ["Industrie chimique et agroalimentaire", "Pièces de moteurs aéronautiques"],
    },
    "tungsten-alloys": {
      name: "Alliages de tungstène",
      summary:
        "Tungstène et nuances de carbure de tungstène caractérisés par une dureté et une densité très élevées, utilisés en outils de coupe, pièces d'usure et alliages lourds.",
      properties: ["Dureté élevée", "Densité élevée"],
      applications: ["Outils de coupe"],
    },
    "stainless-steel": {
      name: "Acier inoxydable",
      summary:
        "Nuances inoxydables austénitiques, ferritiques, martensitiques et duplex, couvrant tout l'éventail des aciers résistants à la corrosion, du usage général au spécialisé.",
      properties: ["Résistant à la corrosion"],
      applications: ["Usage domestique", "Industries alimentaires et laitières", "Décoration et construction"],
    },
    "complex-nickel-alloys": {
      name: "Superalliages de nickel",
      summary:
        "Superalliages de nickel à durcissement structural et de fonderie, conçus pour résister au fluage dans la partie chaude des turbines à gaz et des moteurs aéronautiques.",
      properties: ["Alliages haute température", "Résistant à la chaleur", "Résistant à la corrosion", "Résistant au fluage"],
      applications: ["Pièces de moteurs aéronautiques"],
    },
    "nickel-copper": {
      name: "Nickel-cuivre (Monel)",
      summary:
        "Alliages nickel-cuivre de type Monel, alliant résistance à la corrosion par l'eau de mer et bonne tenue mécanique pour le service marin et chimique.",
      properties: ["Résistant à la chaleur", "Résistant à la corrosion"],
      applications: ["Pièces moulées marines"],
    },
    "high-speed-steels": {
      name: "Aciers rapides",
      summary:
        "Aciers rapides base tungstène et molybdène conservant leur dureté à la température de coupe, séries M et T comprises.",
      properties: ["Résistant à l'usure", "Dureté élevée à chaud"],
      applications: ["Usinage des métaux (grandes vitesses de coupe)"],
    },
    "cobalt-alloys": {
      name: "Alliages de cobalt",
      summary:
        "Alliages base cobalt résistants à l'usure, à la chaleur et à la corrosion — familles Stellite et MAR-M — pour rechargement dur et pièces de partie chaude de turbine.",
      properties: ["Résistant à la chaleur", "Résistant à la corrosion", "Résistant à l'usure"],
      applications: ["Pièces de moteurs aéronautiques"],
    },
    "copper-nickel-alloys": {
      name: "Cupronickels",
      summary:
        "Cupronickels et maillechorts utilisés en tuyauterie d'eau de mer, échangeurs de chaleur, condenseurs et applications décoratives.",
      properties: ["Résistant à la corrosion"],
      applications: ["Décoration", "Transfert d'eau et de chaleur"],
    },
    "tool-steels": {
      name: "Aciers à outils",
      summary:
        "Aciers à outils de travail à froid, de travail à chaud et résistants aux chocs, choisis pour leur dureté, leur ténacité et leur stabilité dimensionnelle en outillage et matriçage.",
      properties: ["Résistant à l'usure", "Dureté élevée"],
      applications: ["Outils et matrices (travail à froid)", "Matrices de travail à chaud"],
    },
    "cobalt-iron-alloys": {
      name: "Alliages fer-cobalt",
      summary:
        "Alliages fer-cobalt et cobalt-vanadium à haute perméabilité, utilisés en tôles de transformateur, noyaux magnétiques et ensembles électroniques.",
      properties: ["Propriétés magnétiques (haute perméabilité)"],
      applications: ["Industrie électronique"],
    },
    "alloy-irons": {
      name: "Fontes alliées",
      summary:
        "Fontes fortement alliées et pièces moulées de type Ni-Resist offrant résistance à la corrosion et à la chaleur en équipements chimiques, de pompage et de procédé.",
      properties: ["Résistant à la chaleur", "Résistant à la corrosion", "Résistant aux acides"],
      applications: ["Industrie chimique et agroalimentaire", "Pièces de moteurs aéronautiques"],
    },
    "titanium-alloys": {
      name: "Alliages de titane",
      summary:
        "Titane commercialement pur et alliages alpha, alpha-bêta et bêta, offrant un rapport résistance/masse exceptionnel avec une forte tenue à la corrosion.",
      properties: ["Rapport résistance/masse élevé", "Bonne résistance à la corrosion"],
      applications: ["Aéronautique et spatial", "Production d'énergie"],
    },
    "nickel-iron-alloys": {
      name: "Alliages fer-nickel",
      summary:
        "Alliages fer-nickel à dilatation contrôlée et magnétiques doux — Invar, Nilo, Mumetal — ainsi que des superalliages base fer dont l'A286.",
      properties: ["Résistant à la chaleur", "Résistant à la corrosion", "Résistant aux acides"],
      applications: ["Industrie chimique et agroalimentaire", "Pièces de moteurs aéronautiques"],
    },
    "magnet-alloys": {
      name: "Alliages pour aimants",
      summary:
        "Alnico et alliages d'aimants permanents apparentés, à base d'aluminium, nickel, cobalt et fer, pour une performance magnétique stable.",
      properties: ["Propriétés magnétiques"],
      applications: ["Aimants permanents"],
    },
    "zirconium-alloys": {
      name: "Alliages de zirconium",
      summary:
        "Zircaloy et nuances de zirconium apparentées, appréciées pour leur faible absorption neutronique et leur tenue à la corrosion en installations nucléaires et chimiques.",
      properties: ["Résistant à la corrosion"],
      applications: ["Industrie nucléaire"],
    },
  },

  industries: {
    aerospace: {
      name: "Aéronautique",
      strapline: "Solutions de valorisation pour l'aviation et la chaîne d'approvisionnement moteur",
      intro:
        "Les composants aéronautiques sont fabriqués dans les alliages les plus étroitement spécifiés de l'industrie, et leur valeur subsiste au-delà de la fin de vie. Nous proposons au secteur aéronautique des solutions de recyclage et de valorisation, portées par une équipe spécialisée, avec des services construits autour des exigences matière et sécurité de chaque client.",
      capabilities: [
        {
          title: "Démontage moteur",
          body: "Les moteurs en fin de vie sont démontés et séparés par familles d'alliages, afin que la teneur en superalliages de forte valeur soit récupérée plutôt que perdue en ferraille mélangée.",
        },
        {
          title: "Destruction sur site",
          body: "Les pièces à vie limitée et les composants tournants sont détruits sur site, ce qui donne une fin de vie vérifiable avant l'entrée de la matière dans la filière de recyclage.",
        },
        {
          title: "Tri et classement",
          body: "Tous les superalliages sont triés et classés pour que la matière revienne à l'aciérie sous une spécification connue et certifiée, et non sous forme de mélange non identifié.",
        },
        {
          title: "Récupération des métaux précieux",
          body: "L'or, le platine et le rhénium sont récupérés des revêtements et des composants, en même temps que l'alliage de base.",
        },
      ],
    },
    "oil-and-gas": {
      name: "Pétrole et gaz",
      strapline: "Alliages et métaux primaires pour service à haute pression en milieu corrosif",
      intro:
        "Les opérations amont et pétrochimiques sollicitent les matériaux à la limite de leur tenue à la corrosion et à la pression. Nous fournissons les alliages adaptés à ces conditions et recyclons les déchets métalliques que génèrent la pétrochimie et le traitement pétrolier et gazier.",
      capabilities: [
        {
          title: "Alliages résistants à la corrosion",
          body: "Alliages base nickel choisis pour leur tenue en service acide, aux chlorures et à l'attaque à température élevée.",
        },
        {
          title: "Déchets pétrochimiques",
          body: "Les déchets métalliques issus du forage, du raffinage et des opérations de traitement sont valorisés au lieu d'être mis en décharge.",
        },
        {
          title: "Fourniture inox et duplex",
          body: "Nuances inoxydables pour équipements de forage, de canalisation et de procédé, fournies sur spécification.",
        },
        {
          title: "Fourniture de ferro-alliages",
          body: "Ferro-alliages dans toutes les granulométries, conditionnements et spécifications, pour la résistance et la durabilité en environnement à haute température.",
        },
      ],
    },
    "industrial-gas-turbine": {
      name: "Turbines à gaz industrielles",
      strapline: "Alliages de partie chaude pour la production d'électricité",
      intro:
        "Les turbines à gaz industrielles reposent sur des alliages de nickel et de cobalt qui conservent leur résistance là où les aciers conventionnels ne le peuvent pas. Nous fournissons ces matériaux et récupérons la teneur critique en alliage des déchets de turbines, pour la ramener à la fusion en qualité air ou sous vide.",
      capabilities: [
        {
          title: "Alliages haute température",
          body: "Alliages de nickel et de cobalt pour aubes, distributeurs, chambres de combustion et autres organes de partie chaude.",
        },
        {
          title: "Récupération de matières critiques",
          body: "Récupération et retraitement de la teneur en alliage des déchets de turbines et des chutes de production.",
        },
        {
          title: "Qualité air et qualité sous vide",
          body: "La matière est préparée et certifiée pour un retour vers l'une ou l'autre des filières de production, à l'air ou sous vide.",
        },
        {
          title: "Séparé par nuance",
          body: "Les alliages de turbine sont conservés séparément par spécification, afin de préserver toute leur valeur métallurgique.",
        },
      ],
    },
    "technology-and-mobility": {
      name: "Technologie et mobilité",
      strapline: "Métaux pour batteries, projection thermique et fabrication additive",
      intro:
        "L'électrification et la fabrication avancée ont créé une demande pour les métaux que nous récupérons déjà. Nous traitons le nickel et d'autres métaux technologiques destinés aux batteries, et fournissons de la matière à la projection thermique, à la galvanoplastie et à la fabrication additive.",
      capabilities: [
        {
          title: "Métaux pour batteries",
          body: "Récupération du nickel et des métaux associés employés dans la fabrication des batteries de véhicules électriques.",
        },
        {
          title: "Métaux rares et réfractaires",
          body: "Récupération du molybdène, du niobium, du tantale, du zirconium, du hafnium et du rhénium à partir de flux industriels.",
        },
        {
          title: "Poudres métalliques",
          body: "Poudres métalliques traitées pour la projection thermique, la galvanoplastie et l'impression 3D.",
        },
        {
          title: "Médical et orthopédie",
          body: "Flux d'alliages de cobalt et de titane issus de la fabrication de composants médicaux et orthopédiques.",
        },
      ],
    },
  },

  streams: {
    "alloy-metal-powder": { name: "Poudre métallique d'alliage" },
    "aod-dust": { name: "Poussière AOD" },
    "eaf-dust": { name: "Poussière de four à arc (EAF)" },
    "wet-filtercake": { name: "Gâteau de filtration humide" },
    "dried-filtercake": { name: "Gâteau de filtration séché" },
    grindings: { name: "Boues de rectification" },
    "ni-hydroxide": { name: "Hydroxyde de nickel" },
    bbs: { name: "Grenaille BB's" },
    nuggets: { name: "Nodules métalliques" },
    "mill-scale": { name: "Calamine" },
    "fine-mill-scale": { name: "Calamine fine" },
    "moly-oxide": { name: "Oxyde de molybdène" },
    "ni-powder": { name: "Poudre de nickel" },
    "plasma-dust": { name: "Poussière de plasma" },
    "shot-dust": { name: "Poussière de grenaillage" },
    "sinter-powder": { name: "Poudre d'aggloméré" },
    "mill-sludge": { name: "Boues de laminoir" },
    turnings: { name: "Copeaux tournés" },
    "pelletizer-dust": { name: "Poussière de bouletage" },
  },

  tungstenForms: {
    "drills-end-mills": {
      name: "Forets et fraises",
      note: "Outillage rotatif carbure monobloc usé ou en fin de vie.",
    },
    "mining-bits": {
      name: "Taillants miniers",
      note: "Outils de forage et de coupe à pastilles carbure, issus des mines et du BTP.",
    },
    densalloy: {
      name: "Densalloy",
      note: "Alliages lourds de tungstène massifs, pour lest, blindage et contrepoids.",
    },
    "cc-inserts": { name: "Plaquettes carbure", note: "Plaquettes de coupe indexables en carbure cémenté." },
    sludge: { name: "Boues", note: "Boues de rectification chargées en tungstène issues de la production d'outils." },
    swarf: { name: "Copeaux", note: "Copeaux d'usinage contenant du tungstène récupérable." },
    "morgan-rolls": { name: "Cylindres Morgan", note: "Cylindres et bagues carbure de laminoirs à fil et à barres." },
    "w-crucibles": {
      name: "Creusets tungstène",
      note: "Creusets et éléments de four en tungstène issus d'installations à haute température.",
    },
    "swarf-bulk": { name: "Copeaux (vrac)", note: "Copeaux en vrac reçus pour tri et analyse." },
  },

  process: {
    "01": {
      title: "Collecte",
      body: "La matière est collectée sous forme de déchets issus des opérations pétrochimiques, pétrolières et gazières, de turbines à gaz industrielles et aéronautiques, ainsi que par notre réseau international d'approvisionnement.",
    },
    "02": {
      title: "Contrôle",
      body: "Les lots entrants sont échantillonnés et enregistrés. La matière première est vérifiée par rapport à la spécification déclarée avant d'entrer dans le procédé.",
    },
    "03": {
      title: "Tri",
      body: "Les déchets sont triés et séparés par famille et par nuance d'alliage, afin que la matière ne soit jamais dévalorisée par mélange avec une spécification inférieure.",
    },
    "04": {
      title: "Traitement",
      body: "Les flux sont transformés en une forme commercialisable — des solides grossiers jusqu'aux poussières et poudres métalliques extrêmement fines.",
    },
    "05": {
      title: "Certification",
      body: "Notre laboratoire métallurgique analyse la production et délivre la certification qui accompagne la matière jusqu'au client.",
    },
    "06": {
      title: "Livraison",
      body: "La matière certifiée est livrée aux clients finaux dans le monde entier pour être refondue dans son alliage d'origine, en qualité air ou sous vide.",
    },
  },

  articles: {
    "the-essential-role-of-metals-in-modern-industries": {
      title: "Le rôle essentiel des métaux dans l'industrie moderne",
      standfirst: "Pourquoi IMS Metals & Alloys OÜ se trouve au cœur des chaînes d'approvisionnement mondiales",
      description: "Pourquoi IMS Metals & Alloys OÜ se trouve au cœur des chaînes d'approvisionnement mondiales",
    },
    "sustainable-metal-recovery-turning-waste-into-value": {
      title: "Valorisation durable des métaux : transformer le déchet en valeur",
      standfirst: "Comment IMS Metals & Alloys OÜ ouvre la voie dans le recyclage des métaux",
      description: "Comment IMS Metals & Alloys OÜ ouvre la voie dans le recyclage des métaux",
    },
    "meeting-industry-standards-with-ims-metals-alloys-ou": {
      title: "Répondre aux normes de l'industrie avec IMS Metals & Alloys OÜ",
      standfirst: "Comment nous assurons qualité et conformité dans l'industrie mondiale",
      description: "Comment nous assurons qualité et conformité dans l'industrie mondiale",
    },
  },
};
