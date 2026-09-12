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
