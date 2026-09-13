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
      body: [
        {
          "type": "p",
          "text": "Dans un monde en évolution rapide et constante, les métaux sont le sang vital de l'industrie moderne. Qu'il s'agisse de construire des gratte-ciel, de développer des technologies aérospatiales de pointe ou d'innover dans les batteries de véhicules électriques, les métaux jouent un rôle déterminant dans ces réalisations. Acteur clé du marché mondial des métaux, IMS Metals & Alloys OÜ s'engage à garantir à ces industries un approvisionnement régulier et durable en métaux essentiels."
        },
        {
          "type": "h2",
          "text": "Le socle de l'industrie"
        },
        {
          "type": "p",
          "text": "Des métaux comme le nickel, le cobalt, l'acier inoxydable et divers ferroalliages constituent le socle d'innombrables industries. Chacun possède des propriétés uniques qui le rendent indispensable. Par exemple :"
        },
        {
          "type": "ul",
          "items": [
            "Le nickel résiste très bien à la corrosion et entre dans la composition de l'acier inoxydable et des superalliages, ce qui le rend vital pour l'aérospatiale et l'industrie chimique.",
            "Le cobalt apporte résistance mécanique et stabilité thermique dans des applications exigeantes comme les turbines de réacteurs et les batteries rechargeables.",
            "L'acier inoxydable, grâce à sa résistance à la rouille, est utilisé partout, des équipements médicaux aux machines industrielles."
          ]
        },
        {
          "type": "p",
          "text": "Chez IMS Metals & Alloys OÜ, nous achetons, transformons et fournissons ces matériaux pour des secteurs tels que le pétrole et le gaz, l'aérospatiale, l'automobile et les turbines à gaz industrielles."
        },
        {
          "type": "h2",
          "text": "Les métaux dans les applications de haute technologie"
        },
        {
          "type": "p",
          "text": "Les secteurs technologiques avancés, comme l'aérospatiale et les énergies renouvelables, dépendent largement de métaux à hautes performances pour innover et se développer. La demande croissante de superalliages — qui associent des métaux comme le nickel, le chrome et le cobalt — a porté les progrès des moteurs à réaction et des turbines à gaz. Ces matériaux sont conçus pour résister à des températures et des pressions extrêmes, garantissant efficacité et sécurité dans les applications critiques."
        },
        {
          "type": "p",
          "text": "IMS Metals & Alloys OÜ est fière de fournir ces matériaux de haute qualité, afin que les industries puissent continuer à repousser les limites avec des métaux répondant aux plus hautes exigences de durabilité et de performance."
        },
        {
          "type": "h2",
          "text": "La chaîne d'approvisionnement mondiale : relier les industries"
        },
        {
          "type": "p",
          "text": "L'un des grands atouts d'IMS Metals & Alloys OÜ est notre capacité à gérer une chaîne d'approvisionnement mondiale. Forts de plus de 15 ans d'expérience, nous avons noué des relations durables avec des fournisseurs, des fabricants et des logisticiens du monde entier. Cela nous permet de livrer avec précision les métaux et alliages essentiels et d'en garantir la disponibilité en temps voulu pour les besoins de production de nombreuses industries."
        },
        {
          "type": "p",
          "text": "Notre activité a commencé en Europe de l'Est, mais nous avons depuis étendu nos opérations à l'échelle mondiale. Cette présence internationale, ainsi que nos partenariats avec des entreprises de premier plan, font de nous un acteur incontournable de l'industrie des métaux."
        },
        {
          "type": "h2",
          "text": "Durabilité : l'avenir de l'approvisionnement en métaux"
        },
        {
          "type": "p",
          "text": "À mesure que l'industrie mondiale se développe, la demande de métaux augmente. Or, l'extraction de nouvelles matières peut avoir un impact environnemental important. C'est là qu'IMS Metals & Alloys OÜ intervient, avec des solutions d'approvisionnement durable et de recyclage."
        },
        {
          "type": "p",
          "text": "En misant sur le recyclage des métaux, nous réduisons les déchets, préservons les ressources naturelles et diminuons l'empreinte environnementale de la production métallique. Notre expertise dans la récupération de métaux de valeur comme le nickel, le cobalt et le titane à partir de sous-produits industriels (poussières, boues, poudres) nous permet de réintroduire ces métaux dans les cycles de production — pour que les industries accèdent à des métaux recyclés de haute qualité sans compromis sur les performances."
        },
        {
          "type": "h2",
          "text": "Conclusion"
        },
        {
          "type": "p",
          "text": "Les métaux sont au cœur du progrès industriel, et IMS Metals & Alloys OÜ joue un rôle essentiel dans l'approvisionnement mondial de ces matériaux critiques. En mettant à profit notre expertise en achat, en transformation et en recyclage, nous soutenons non seulement les avancées technologiques d'aujourd'hui, mais contribuons aussi à un avenir durable et efficace pour les industries du monde entier."
        },
        {
          "type": "p",
          "text": "Si votre entreprise a besoin d'un approvisionnement en métaux fiable et de haute qualité, IMS Metals & Alloys OÜ est là pour vous apporter les solutions nécessaires. Ensemble, façonnons l'avenir de l'industrie moderne."
        },
        {
          "type": "p",
          "text": "Valorisation durable des métaux : transformer le déchet en valeur"
        }
      ],
    },
    "sustainable-metal-recovery-turning-waste-into-value": {
      title: "Valorisation durable des métaux : transformer le déchet en valeur",
      standfirst: "Comment IMS Metals & Alloys OÜ ouvre la voie dans le recyclage des métaux",
      description: "Comment IMS Metals & Alloys OÜ ouvre la voie dans le recyclage des métaux",
      body: [
        {
          "type": "p",
          "text": "À une époque où la durabilité est au premier plan des stratégies des entreprises, on ne saurait trop souligner l'importance du recyclage. Pour les industries qui dépendent des métaux, la durabilité ne signifie pas seulement réduire les déchets : c'est aussi trouver des moyens innovants de récupérer des ressources précieuses. Chez IMS Metals & Alloys OÜ, nous sommes spécialisés dans la valorisation durable des métaux, en transformant les déchets en matériaux de haute valeur réutilisables dans les cycles de production."
        },
        {
          "type": "h2",
          "text": "Un besoin croissant de valorisation des métaux"
        },
        {
          "type": "p",
          "text": "À mesure que des industries comme l'aérospatiale, le pétrole et le gaz ou l'automobile se développent, la demande de métaux a fortement augmenté. Or, l'extraction de métaux primaires est non seulement coûteuse, mais elle a aussi un impact environnemental important : destruction d'habitats, forte consommation d'énergie et hausse des émissions de CO2."
        },
        {
          "type": "p",
          "text": "C'est là qu'intervient IMS Metals & Alloys OÜ. Grâce à des techniques de recyclage avancées, nous transformons les déchets industriels en métaux réutilisables, réduisant le besoin d'extraction tout en préservant les ressources naturelles. Notre engagement en faveur de la durabilité aide les entreprises à réduire leur empreinte environnementale sans sacrifier la qualité des métaux dont elles ont besoin."
        },
        {
          "type": "h2",
          "text": "Le processus de valorisation : transformer le déchet en valeur"
        },
        {
          "type": "p",
          "text": "Les métaux sont souvent présents dans des flux de déchets industriels comme les poudres, les boues, les poussières et d'autres résidus. Traditionnellement, ces déchets étaient jugés inutiles et mis en décharge. Mais grâce aux progrès des technologies et des méthodes de recyclage, nous mesurons aujourd'hui la valeur considérable que recèlent ces sous-produits."
        },
        {
          "type": "p",
          "text": "Chez IMS Metals & Alloys OÜ, nous sommes spécialisés dans la récupération de métaux de valeur comme le nickel, le cobalt, le titane et le tungstène à partir de ces flux. Voici comment fonctionne notre processus :"
        },
        {
          "type": "ul",
          "items": [
            "Collecte et tri : nous collectons les déchets métalliques de diverses industries, notamment l'aérospatiale, la pétrochimie et le pétrole et le gaz. Ces déchets sont soigneusement triés pour isoler les matériaux recyclables.",
            "Traitement et affinage : à l'aide de techniques de pointe, nous traitons les déchets et récupérons les métaux sous forme pure ou alliée. Ce processus exige une expertise métallurgique pour garantir la qualité et la pureté des matériaux récupérés.",
            "Certification et réintroduction : les métaux récupérés sont testés et certifiés conformes aux normes de l'industrie. Une fois certifiés, ils sont réintroduits dans les cycles de production, où ils sont refondus et réutilisés dans de nouveaux produits, comme les superalliages ou les aciers inoxydables."
          ]
        },
        {
          "type": "p",
          "text": "En recyclant ces matériaux, IMS Metals & Alloys OÜ contribue à réduire les déchets mis en décharge et offre aux industries une alternative économique et durable à l'achat de métaux primaires."
        },
        {
          "type": "h2",
          "text": "Études de cas : un impact concret"
        },
        {
          "type": "p",
          "text": "Nos actions de valorisation durable des métaux ont fait une réelle différence dans des industries du monde entier. Par exemple :"
        },
        {
          "type": "ul",
          "items": [
            "Industrie aérospatiale : dans l'aérospatiale, des métaux à hautes performances comme les superalliages de nickel et le titane sont essentiels à la fabrication des composants d'avion. Mais leur production à partir de matières premières coûte cher. En récupérant ces métaux à partir des chutes de production et des pièces en fin de vie, IMS Metals & Alloys OÜ aide l'industrie aérospatiale à réduire ses coûts et son empreinte environnementale.",
            "Secteur pétrolier et gazier : l'industrie pétrolière et gazière génère d'importants déchets métalliques, notamment lors du forage et du raffinage. Au lieu de les envoyer en décharge, nous récupérons des métaux de valeur comme le cobalt et le tungstène pour qu'ils soient réutilisés dans de nouveaux projets."
          ]
        },
        {
          "type": "p",
          "text": "Nos solutions durables profitent non seulement à l'environnement, mais apportent aussi des avantages financiers à nos clients en réduisant le coût des matières premières et les frais d'élimination des déchets."
        },
        {
          "type": "h2",
          "text": "Les bénéfices environnementaux et économiques"
        },
        {
          "type": "p",
          "text": "Les bénéfices de la valorisation des métaux vont bien au-delà de la simple réduction des déchets :"
        },
        {
          "type": "ul",
          "items": [
            "Moindre impact environnemental : le recyclage des métaux réduit le besoin d'extraction, ce qui diminue les émissions de CO2, la consommation d'énergie et la destruction des habitats naturels.",
            "Économies : récupérer des métaux à partir de déchets est souvent plus rentable que d'acheter des matières neuves. Les entreprises économisent sur les matières premières tout en réduisant leurs frais d'élimination des déchets.",
            "Économie circulaire : la valorisation des métaux s'inscrit dans un modèle d'économie circulaire, où les déchets sont réintroduits dans la production au lieu d'être jetés. Ce système en boucle fermée aide les industries à fonctionner de manière plus durable et plus efficace."
          ]
        },
        {
          "type": "h2",
          "text": "Pourquoi choisir IMS Metals & Alloys OÜ pour la valorisation des métaux"
        },
        {
          "type": "p",
          "text": "Chez IMS Metals & Alloys OÜ, nous sommes fiers de proposer des solutions de recyclage innovantes et rentables. Notre solide expertise en métallurgie et nos pratiques durables nous permettent de récupérer des métaux de la plus haute qualité et de fournir à nos clients des matériaux conformes exactement aux spécifications requises."
        },
        {
          "type": "p",
          "text": "En travaillant avec nous, les entreprises réduisent leur impact environnemental et bénéficient d'une source fiable et durable de métaux de haute qualité. Notre réseau mondial et notre vaste expérience sectorielle nous permettent de servir des secteurs très variés, de l'aérospatiale aux turbines à gaz industrielles."
        },
        {
          "type": "h2",
          "text": "Conclusion"
        },
        {
          "type": "p",
          "text": "À mesure que les industries font de la durabilité une priorité, la valorisation des métaux devient un élément clé de la solution. IMS Metals & Alloys OÜ est à l'avant-garde de ce mouvement et aide les entreprises à transformer leurs déchets en valeur grâce à des techniques de recyclage avancées. En choisissant la valorisation durable des métaux, les entreprises peuvent réduire leur dépendance à l'extraction, diminuer leurs coûts et limiter leur empreinte environnementale."
        },
        {
          "type": "p",
          "text": "Si votre entreprise cherche des moyens innovants de récupérer des métaux et de contribuer à un avenir plus vert, IMS Metals & Alloys OÜ est là pour vous aider. Travaillons ensemble pour transformer les déchets en opportunités."
        },
        {
          "type": "p",
          "text": "Le rôle essentiel des métaux dans l'industrie moderne"
        },
        {
          "type": "p",
          "text": "Répondre aux normes de l'industrie avec IMS Metals & Alloys OÜ"
        }
      ],
    },
    "meeting-industry-standards-with-ims-metals-alloys-ou": {
      title: "Répondre aux normes de l'industrie avec IMS Metals & Alloys OÜ",
      standfirst: "Comment nous assurons qualité et conformité dans l'industrie mondiale",
      description: "Comment nous assurons qualité et conformité dans l'industrie mondiale",
      body: [
        {
          "type": "p",
          "text": "Dans le paysage industriel actuel, les entreprises ont besoin de matériaux à hautes performances conformes à des normes rigoureuses. Que ce soit dans l'aérospatiale, le pétrole et le gaz ou les applications à haute température, les métaux utilisés dans les systèmes critiques doivent respecter des exigences strictes pour garantir sécurité, fiabilité et efficacité. Chez IMS Metals & Alloys OÜ, nous nous engageons à fournir des métaux et alliages qui satisfont, voire dépassent, les normes de l'industrie, et à accompagner les entreprises du monde entier vers l'excellence opérationnelle."
        },
        {
          "type": "h2",
          "text": "L'importance des normes industrielles"
        },
        {
          "type": "p",
          "text": "Chaque industrie possède son propre ensemble de normes encadrant la qualité, les performances et la sécurité des matériaux. Dans l'aérospatiale, par exemple, les métaux doivent résister à des températures et des pressions extrêmes sans compromettre leur intégrité structurelle. De même, le secteur pétrolier et gazier s'appuie sur des métaux résistants à la corrosion, capables de supporter les environnements difficiles du forage et du raffinage."
        },
        {
          "type": "p",
          "text": "Répondre à ces exigences strictes est indispensable, non seulement pour la sécurité, mais aussi pour la fiabilité des composants et des systèmes. IMS Metals & Alloys OÜ mesure le caractère critique de ces normes et s'est donné pour mission de fournir des matériaux au plus haut niveau de qualité et de conformité."
        },
        {
          "type": "h2",
          "text": "Notre engagement qualité"
        },
        {
          "type": "p",
          "text": "Chez IMS Metals & Alloys OÜ, la qualité est la pierre angulaire de nos activités. Nous appliquons une démarche rigoureuse à l'achat, à la transformation et aux essais de nos métaux pour qu'ils répondent aux exigences précises de nos clients. Notre contrôle qualité complet comprend :"
        },
        {
          "type": "ul",
          "items": [
            "Essais métallurgiques : chaque lot de métal que nous traitons est rigoureusement testé dans notre laboratoire métallurgique de pointe. Nous analysons la composition chimique et les propriétés mécaniques des matériaux pour vérifier leur conformité aux spécifications de l'industrie, qu'ils soient destinés à la fusion à l'air ou à la qualité vide.",
            "Certification : tous les matériaux fournis par IMS Metals & Alloys OÜ sont certifiés conformes aux normes internationales applicables, telles que l'ASTM, l'ISO et d'autres réglementations sectorielles. Chaque produit livré est accompagné des certificats et de la documentation nécessaires.",
            "Traçabilité : nous assurons une traçabilité complète de nos métaux, de leur achat jusqu'à leur livraison. Nos clients bénéficient ainsi d'une transparence totale et peuvent être certains que les matériaux reçus répondent à leurs spécifications."
          ]
        },
        {
          "type": "p",
          "text": "Grâce à ces pratiques, nous garantissons non seulement la qualité des produits, mais aussi la conformité aux normes strictes d'industries comme l'aérospatiale, le pétrole et le gaz et les turbines à gaz industrielles (IGT)."
        },
        {
          "type": "h2",
          "text": "Des métaux spécialisés pour les applications critiques"
        },
        {
          "type": "p",
          "text": "L'un des grands atouts d'IMS Metals & Alloys OÜ est sa capacité à fournir des métaux et alliages très spécialisés, adaptés aux besoins de chaque industrie. Parmi les métaux à hautes performances que nous proposons :"
        },
        {
          "type": "ul",
          "items": [
            "Superalliages de nickel : largement utilisés dans l'aérospatiale et les turbines à gaz industrielles pour leur capacité à résister aux hautes températures et à la corrosion.",
            "Alliages de cobalt : réputés pour leur grande résistance mécanique et à l'usure, ils sont idéaux pour les applications critiques de l'aérospatiale et du pétrole et du gaz.",
            "Alliages de titane : légers mais extrêmement résistants, ils sont essentiels pour les industries qui exigent un rapport résistance/poids élevé, comme l'aérospatiale et le médical."
          ]
        },
        {
          "type": "p",
          "text": "Outre ces métaux, nous fournissons une large gamme de ferroalliages, d'aciers inoxydables et d'autres matériaux à hautes performances, tous certifiés conformes aux normes exigeantes des industries de nos clients."
        },
        {
          "type": "h2",
          "text": "Des solutions sur mesure pour les métaux de retour aérospatiaux"
        },
        {
          "type": "p",
          "text": "L'industrie aérospatiale impose des exigences particulièrement strictes aux métaux utilisés dans les moteurs, les cellules et d'autres composants critiques. Au-delà de la fourniture d'alliages à hautes performances, IMS Metals & Alloys OÜ propose des solutions spécialisées pour les métaux de retour aérospatiaux. Ces métaux — récupérés sur des composants en fin de vie ou des chutes de fabrication — sont recyclés, testés et certifiés pour réintégrer la chaîne d'approvisionnement, offrant aux constructeurs une solution durable et économique."
        },
        {
          "type": "p",
          "text": "Notre équipe d'experts prend en charge l'ensemble du processus, du démontage des moteurs et de la destruction des composants jusqu'au tri et au classement des superalliages. Nous veillons également à ce que tous les métaux précieux, comme l'or, le platine et le rhénium, soient récupérés et retraités conformément aux normes de l'industrie. En s'associant à IMS Metals & Alloys OÜ, les entreprises aérospatiales peuvent non seulement réduire leurs déchets, mais aussi respecter scrupuleusement les normes de performance et de sécurité."
        },
        {
          "type": "h2",
          "text": "Au service de l'industrie pétrolière et gazière"
        },
        {
          "type": "p",
          "text": "Le secteur pétrolier et gazier opère dans certains des environnements les plus extrêmes de la planète, et les métaux qu'il utilise doivent supporter des conditions corrosives et de fortes pressions. Chez IMS Metals & Alloys OÜ, nous fournissons des matériaux qui répondent aux exigences de ce secteur, notamment :"
        },
        {
          "type": "ul",
          "items": [
            "Des alliages de nickel à hautes performances pour la résistance à la corrosion",
            "Des aciers inoxydables pour le forage et les pipelines",
            "Des ferroalliages qui renforcent la durabilité et la résistance dans les environnements à haute température"
          ]
        },
        {
          "type": "p",
          "text": "Nous travaillons en étroite collaboration avec nos clients du pétrole et du gaz pour garantir que les matériaux fournis sont non seulement de la plus haute qualité, mais aussi conformes à toutes les normes et réglementations applicables."
        },
        {
          "type": "h2",
          "text": "Conformité environnementale : la durabilité en tête"
        },
        {
          "type": "p",
          "text": "Chez IMS Metals & Alloys OÜ, nous ne nous contentons pas de respecter les normes de qualité des matériaux : nous montrons aussi la voie en matière de conformité environnementale. Notre engagement en faveur de la durabilité se traduit par des procédés de recyclage innovants qui réduisent les déchets et limitent l'impact environnemental de la production métallique."
        },
        {
          "type": "p",
          "text": "En récupérant des métaux de valeur à partir de sous-produits industriels comme les poudres, les poussières et les boues, nous contribuons à l'économie circulaire et réduisons la demande d'extraction de métaux primaires. Cette approche aide nos clients à atteindre leurs propres objectifs de durabilité et garantit le respect des réglementations environnementales dans le monde entier."
        },
        {
          "type": "h2",
          "text": "Pourquoi IMS Metals & Alloys OÜ est un partenaire de confiance"
        },
        {
          "type": "p",
          "text": "Forte de plus de 15 ans d'expérience, IMS Metals & Alloys OÜ s'est forgé une réputation de fournisseur de métaux de haute qualité conformes aux normes industrielles les plus exigeantes. Notre vaste réseau de fournisseurs, nos installations d'essai de pointe et notre engagement qualité font de nous un partenaire de confiance pour les industries du monde entier."
        },
        {
          "type": "p",
          "text": "Que vous ayez besoin d'alliages de qualité aérospatiale, de métaux résistants à la corrosion pour le pétrole et le gaz ou de matériaux à hautes performances pour les turbines à gaz industrielles, nous avons l'expertise et les ressources pour vous livrer. En choisissant IMS Metals & Alloys OÜ, vous vous assurez non seulement de la conformité aux normes de l'industrie, mais vous gagnez aussi un partenaire engagé pour votre réussite."
        },
        {
          "type": "h2",
          "text": "Conclusion"
        },
        {
          "type": "p",
          "text": "Le respect des normes industrielles est essentiel pour garantir la sécurité, la fiabilité et l'efficacité dans de nombreux secteurs. Chez IMS Metals & Alloys OÜ, nous fournissons des métaux et alliages au plus haut niveau de qualité et de conformité, au service d'industries comme l'aérospatiale, le pétrole et le gaz et les turbines à gaz industrielles."
        },
        {
          "type": "p",
          "text": "Si votre entreprise a besoin de matériaux qui satisfont ou dépassent les normes de l'industrie, faites appel à IMS Metals & Alloys OÜ. Contactez-nous dès aujourd'hui pour découvrir comment nous pouvons répondre à vos besoins en matériaux et vous aider à maintenir les plus hauts standards de qualité et de durabilité."
        },
        {
          "type": "p",
          "text": "Valorisation durable des métaux : transformer le déchet en valeur"
        }
      ],
    },
  },
};
