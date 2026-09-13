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
      body: [
        {
          "type": "p",
          "text": "In de snel veranderende wereld van vandaag zijn metalen de levensader van de moderne industrie. Of het nu gaat om de bouw van wolkenkrabbers, de ontwikkeling van geavanceerde lucht- en ruimtevaarttechnologie of innovatie in accu's voor elektrische voertuigen: metalen spelen een cruciale rol in deze prestaties. Als belangrijke speler op de wereldwijde metaalmarkt zet IMS Metals & Alloys OÜ zich ervoor in dat deze industrieën kunnen rekenen op een constante en duurzame aanvoer van essentiële metalen."
        },
        {
          "type": "h2",
          "text": "Het fundament van de industrie"
        },
        {
          "type": "p",
          "text": "Metalen zoals nikkel, kobalt, roestvast staal en diverse ferrolegeringen vormen het fundament van talloze industrieën. Elk metaal heeft unieke eigenschappen die het onmisbaar maken. Bijvoorbeeld:"
        },
        {
          "type": "ul",
          "items": [
            "Nikkel is zeer corrosiebestendig en wordt gebruikt in roestvast staal en superlegeringen, waardoor het onmisbaar is voor de lucht- en ruimtevaart en de chemische industrie.",
            "Kobalt zorgt voor sterkte en temperatuurstabiliteit in veeleisende toepassingen zoals straalturbines en oplaadbare batterijen.",
            "Roestvast staal wordt dankzij zijn roestbestendigheid overal gebruikt, van medische apparatuur tot industriële machines."
          ]
        },
        {
          "type": "p",
          "text": "Bij IMS Metals & Alloys OÜ kopen, verwerken en leveren we deze materialen voor sectoren als olie en gas, lucht- en ruimtevaart, de automobielindustrie en industriële gasturbines."
        },
        {
          "type": "h2",
          "text": "Metalen in hightechtoepassingen"
        },
        {
          "type": "p",
          "text": "Geavanceerde technologiesectoren, zoals de lucht- en ruimtevaart en hernieuwbare energie, zijn sterk afhankelijk van hoogwaardige metalen om te innoveren en te groeien. De stijgende vraag naar superlegeringen — combinaties van metalen als nikkel, chroom en kobalt — heeft de ontwikkeling van straalmotoren en gasturbines aangejaagd. Deze materialen zijn ontworpen om extreme temperaturen en drukken te weerstaan en zorgen voor efficiëntie en veiligheid in kritieke toepassingen."
        },
        {
          "type": "p",
          "text": "IMS Metals & Alloys OÜ levert deze hoogwaardige materialen met trots, zodat industrieën grenzen kunnen blijven verleggen met metalen die voldoen aan de hoogste eisen op het gebied van duurzaamheid en prestaties."
        },
        {
          "type": "h2",
          "text": "De wereldwijde toeleveringsketen: industrieën verbinden"
        },
        {
          "type": "p",
          "text": "Een van de grote sterktes van IMS Metals & Alloys OÜ is ons vermogen om een wereldwijde toeleveringsketen te beheren. Met meer dan 15 jaar ervaring hebben we duurzame relaties opgebouwd met leveranciers, fabrikanten en logistieke bedrijven over de hele wereld. Zo kunnen we essentiële metalen en legeringen nauwkeurig leveren en tijdige beschikbaarheid garanderen voor de productiebehoeften van uiteenlopende industrieën."
        },
        {
          "type": "p",
          "text": "Ons bedrijf begon in Oost-Europa, maar inmiddels zijn we wereldwijd actief. Deze internationale aanwezigheid en onze partnerschappen met toonaangevende bedrijven maken ons tot een belangrijke speler in de metaalindustrie."
        },
        {
          "type": "h2",
          "text": "Duurzaamheid: de toekomst van metaalinkoop"
        },
        {
          "type": "p",
          "text": "Naarmate de wereldwijde industrie groeit, neemt ook de vraag naar metalen toe. Het winnen van nieuwe grondstoffen kan echter een grote impact op het milieu hebben. Daar komt IMS Metals & Alloys OÜ in beeld, met duurzame inkoop- en recyclingoplossingen."
        },
        {
          "type": "p",
          "text": "Door in te zetten op metaalrecycling beperken we afval, sparen we natuurlijke hulpbronnen en verkleinen we de milieuvoetafdruk van de metaalproductie. Onze expertise in het terugwinnen van waardevolle metalen zoals nikkel, kobalt en titaan uit industriële bijproducten (stof, slib, poeders) maakt het mogelijk deze metalen opnieuw in de productiecyclus te brengen — zodat industrieën hoogwaardige gerecyclede metalen kunnen gebruiken zonder in te leveren op prestaties."
        },
        {
          "type": "h2",
          "text": "Conclusie"
        },
        {
          "type": "p",
          "text": "Metalen vormen de kern van industriële vooruitgang, en IMS Metals & Alloys OÜ speelt een essentiële rol in de wereldwijde aanvoer van deze kritieke materialen. Met onze expertise in inkoop, verwerking en recycling ondersteunen we niet alleen de technologische ontwikkelingen van vandaag, maar dragen we ook bij aan een duurzame en efficiënte toekomst voor industrieën wereldwijd."
        },
        {
          "type": "p",
          "text": "Heeft uw bedrijf behoefte aan een betrouwbare, hoogwaardige aanvoer van metalen? IMS Metals & Alloys OÜ biedt de oplossingen die u nodig hebt. Samen geven we vorm aan de toekomst van de moderne industrie."
        },
        {
          "type": "p",
          "text": "Duurzame metaalterugwinning: van afval naar waarde"
        }
      ],
    },
    "sustainable-metal-recovery-turning-waste-into-value": {
      title: "Duurzame metaalterugwinning: van afval naar waarde",
      standfirst: "Hoe IMS Metals & Alloys OÜ voorop loopt in metaalrecycling",
      description: "Hoe IMS Metals & Alloys OÜ voorop loopt in metaalrecycling",
      body: [
        {
          "type": "p",
          "text": "In een tijd waarin duurzaamheid vooropstaat in de strategie van bedrijven wereldwijd, kan het belang van recycling niet genoeg worden benadrukt. Voor industrieën die van metalen afhankelijk zijn, betekent duurzaamheid niet alleen minder afval, maar ook innovatieve manieren vinden om waardevolle grondstoffen terug te winnen. IMS Metals & Alloys OÜ is gespecialiseerd in duurzame metaalterugwinning en zet afval om in hoogwaardige materialen die opnieuw in productiecycli kunnen worden gebruikt."
        },
        {
          "type": "h2",
          "text": "De groeiende behoefte aan metaalterugwinning"
        },
        {
          "type": "p",
          "text": "Nu industrieën als de lucht- en ruimtevaart, olie en gas en de automobielindustrie blijven groeien, is de vraag naar metalen sterk gestegen. Het winnen van primaire metalen is echter niet alleen kostbaar, maar heeft ook een aanzienlijke milieu-impact: het leidt tot vernietiging van habitats, een hoog energieverbruik en meer CO2-uitstoot."
        },
        {
          "type": "p",
          "text": "Daar komt IMS Metals & Alloys OÜ in beeld. Met geavanceerde recyclingtechnieken zetten we industrieel afval om in herbruikbare metalen, waardoor er minder hoeft te worden gemijnd en natuurlijke hulpbronnen worden gespaard. Onze inzet voor duurzaamheid helpt bedrijven hun milieuvoetafdruk te verkleinen zonder concessies aan de kwaliteit van de metalen die zij nodig hebben."
        },
        {
          "type": "h2",
          "text": "Het terugwinningsproces: van afval naar waarde"
        },
        {
          "type": "p",
          "text": "Metalen komen vaak voor in industriële afvalstromen zoals poeders, slib, stof en andere residuen. Vroeger werd dit afval als waardeloos beschouwd en gestort. Dankzij technologische vooruitgang en betere recyclingmethoden zien we nu de enorme waarde die in deze bijproducten schuilt."
        },
        {
          "type": "p",
          "text": "IMS Metals & Alloys OÜ is gespecialiseerd in het terugwinnen van waardevolle metalen zoals nikkel, kobalt, titaan en wolfraam uit deze afvalstromen. Zo werkt ons proces:"
        },
        {
          "type": "ul",
          "items": [
            "Inzameling en sortering: we verzamelen metaalhoudend afval uit diverse industrieën, waaronder de lucht- en ruimtevaart, de petrochemie en de olie- en gassector. Dit afval wordt zorgvuldig gesorteerd om recyclebare materialen te scheiden.",
            "Verwerking en raffinage: met geavanceerde technieken verwerken we het afval en winnen we metalen terug in zuivere of gelegeerde vorm. Dit proces vraagt metallurgische expertise om de kwaliteit en zuiverheid van de teruggewonnen materialen te waarborgen.",
            "Certificering en herintroductie: de teruggewonnen metalen worden getest en gecertificeerd volgens industrienormen. Na certificering keren ze terug in de productiecyclus, waar ze worden omgesmolten en hergebruikt in nieuwe producten, zoals superlegeringen of roestvast staal."
          ]
        },
        {
          "type": "p",
          "text": "Door deze materialen te recyclen helpt IMS Metals & Alloys OÜ stortafval te verminderen en biedt het industrieën een kostenefficiënt en duurzaam alternatief voor de inkoop van primaire metalen."
        },
        {
          "type": "h2",
          "text": "Praktijkvoorbeelden: impact in de praktijk"
        },
        {
          "type": "p",
          "text": "Onze inspanningen op het gebied van duurzame metaalterugwinning hebben in industrieën wereldwijd een aanzienlijk verschil gemaakt. Bijvoorbeeld:"
        },
        {
          "type": "ul",
          "items": [
            "Lucht- en ruimtevaart: in de lucht- en ruimtevaart zijn hoogwaardige metalen zoals nikkelsuperlegeringen en titaan cruciaal voor de productie van vliegtuigonderdelen. De productie ervan uit ruwe grondstoffen is echter duur. Door deze metalen terug te winnen uit productieafval en onderdelen aan het einde van hun levensduur helpt IMS Metals & Alloys OÜ de sector kosten te verlagen en de milieuvoetafdruk te verkleinen.",
            "Olie- en gassector: de olie- en gasindustrie produceert veel metaalhoudend afval, met name bij boringen en raffinageprocessen. In plaats van dit afval te storten, winnen we waardevolle metalen zoals kobalt en wolfraam terug, zodat ze in nieuwe projecten kunnen worden hergebruikt."
          ]
        },
        {
          "type": "p",
          "text": "Onze duurzame oplossingen zijn niet alleen goed voor het milieu, maar leveren onze klanten ook financiële voordelen op door lagere grondstofkosten en minder afvalverwerkingskosten."
        },
        {
          "type": "h2",
          "text": "De ecologische en economische voordelen"
        },
        {
          "type": "p",
          "text": "De voordelen van metaalterugwinning reiken veel verder dan alleen afvalvermindering:"
        },
        {
          "type": "ul",
          "items": [
            "Minder milieu-impact: door metalen te recyclen is er minder mijnbouw nodig, wat CO2-uitstoot, energieverbruik en de vernietiging van natuurlijke habitats vermindert.",
            "Kostenbesparing: metalen terugwinnen uit afval is vaak voordeliger dan nieuwe materialen inkopen. Bedrijven besparen op grondstoffen en verlagen tegelijk hun afvalverwerkingskosten.",
            "Circulaire economie: metaalterugwinning ondersteunt een circulair economisch model, waarin afval terugkeert in het productieproces in plaats van te worden weggegooid. Dit gesloten systeem helpt industrieën duurzamer en efficiënter te werken."
          ]
        },
        {
          "type": "h2",
          "text": "Waarom kiezen voor IMS Metals & Alloys OÜ voor metaalterugwinning"
        },
        {
          "type": "p",
          "text": "IMS Metals & Alloys OÜ is trots op zijn vermogen om innovatieve en kostenefficiënte recyclingoplossingen te bieden. Dankzij onze diepgaande metallurgische kennis en duurzame werkwijze kunnen we metalen van de hoogste kwaliteit terugwinnen en onze klanten materialen leveren die precies aan hun specificaties voldoen."
        },
        {
          "type": "p",
          "text": "Door met ons samen te werken verkleinen bedrijven niet alleen hun milieu-impact, maar profiteren ze ook van een betrouwbare, duurzame bron van hoogwaardige metalen. Ons wereldwijde netwerk en onze ruime ervaring stellen ons in staat uiteenlopende sectoren te bedienen, van de lucht- en ruimtevaart tot industriële gasturbines."
        },
        {
          "type": "h2",
          "text": "Conclusie"
        },
        {
          "type": "p",
          "text": "Nu industrieën steeds meer prioriteit geven aan duurzaamheid, wordt metaalterugwinning een belangrijk onderdeel van de oplossing. IMS Metals & Alloys OÜ loopt voorop in deze beweging en helpt bedrijven afval om te zetten in waarde met geavanceerde recyclingtechnieken. Door te kiezen voor duurzame metaalterugwinning kunnen bedrijven hun afhankelijkheid van mijnbouw verminderen, kosten besparen en hun milieuvoetafdruk verkleinen."
        },
        {
          "type": "p",
          "text": "Zoekt uw bedrijf innovatieve manieren om metalen terug te winnen en een groenere toekomst te ondersteunen? IMS Metals & Alloys OÜ helpt u graag. Laten we samen afval omzetten in kansen."
        },
        {
          "type": "p",
          "text": "De essentiële rol van metalen in de moderne industrie"
        },
        {
          "type": "p",
          "text": "Voldoen aan industrienormen met IMS Metals & Alloys OÜ"
        }
      ],
    },
    "meeting-industry-standards-with-ims-metals-alloys-ou": {
      title: "Voldoen aan industrienormen met IMS Metals & Alloys OÜ",
      standfirst: "Hoe wij kwaliteit en conformiteit leveren in de wereldwijde industrie",
      description: "Hoe wij kwaliteit en conformiteit leveren in de wereldwijde industrie",
      body: [
        {
          "type": "p",
          "text": "In het huidige dynamische industriële landschap hebben bedrijven hoogwaardige materialen nodig die aan strenge industrienormen voldoen. Of het nu gaat om de lucht- en ruimtevaart, olie en gas of toepassingen bij hoge temperaturen: de metalen in kritieke systemen moeten aan strikte richtlijnen voldoen om veiligheid, betrouwbaarheid en efficiëntie te garanderen. IMS Metals & Alloys OÜ levert metalen en legeringen die industrienormen halen en overtreffen, en ondersteunt bedrijven wereldwijd bij het bereiken van operationele excellentie."
        },
        {
          "type": "h2",
          "text": "Het belang van industrienormen"
        },
        {
          "type": "p",
          "text": "Elke industrie heeft een eigen set normen voor de kwaliteit, prestaties en veiligheid van materialen. In de lucht- en ruimtevaart moeten metalen bijvoorbeeld extreme temperaturen en drukken weerstaan zonder hun structurele integriteit te verliezen. Evenzo is de olie- en gassector afhankelijk van corrosiebestendige metalen die bestand zijn tegen de zware omstandigheden bij boringen en raffinage."
        },
        {
          "type": "p",
          "text": "Voldoen aan deze strenge eisen is niet alleen essentieel voor de veiligheid, maar ook voor de betrouwbaarheid van componenten en systemen. IMS Metals & Alloys OÜ begrijpt het kritieke belang van deze normen en stelt zich tot doel materialen te leveren van het hoogste niveau van kwaliteit en conformiteit."
        },
        {
          "type": "h2",
          "text": "Onze inzet voor kwaliteit"
        },
        {
          "type": "p",
          "text": "Bij IMS Metals & Alloys OÜ is kwaliteit de hoeksteen van onze activiteiten. We hanteren een nauwgezette aanpak bij de inkoop, verwerking en het testen van onze metalen, zodat ze voldoen aan de specifieke eisen van onze klanten. Onze uitgebreide kwaliteitscontrole omvat:"
        },
        {
          "type": "ul",
          "items": [
            "Metallurgische tests: elke partij metaal die we verwerken, wordt grondig getest in ons moderne metallurgische laboratorium. We analyseren de chemische samenstelling en mechanische eigenschappen van de materialen om te controleren of ze aan de industriespecificaties voldoen, of ze nu bestemd zijn voor luchtsmelten of vacuümkwaliteit.",
            "Certificering: alle materialen van IMS Metals & Alloys OÜ zijn gecertificeerd volgens de relevante internationale normen, zoals ASTM, ISO en andere sectorspecifieke regelgeving. Elk geleverd product gaat vergezeld van de benodigde certificaten en documentatie.",
            "Traceerbaarheid: we bieden volledige traceerbaarheid van onze metalen, vanaf de inkoop tot de levering aan onze klanten. Zo hebben klanten volledige transparantie en kunnen ze erop vertrouwen dat de ontvangen materialen aan hun specificaties voldoen."
          ]
        },
        {
          "type": "p",
          "text": "Door deze werkwijze te volgen garanderen we niet alleen de productkwaliteit, maar ook de naleving van de strenge normen van industrieën als de lucht- en ruimtevaart, olie en gas en industriële gasturbines (IGT)."
        },
        {
          "type": "h2",
          "text": "Gespecialiseerde metalen voor kritieke toepassingen"
        },
        {
          "type": "p",
          "text": "Een van de grote sterktes van IMS Metals & Alloys OÜ is ons vermogen om zeer gespecialiseerde metalen en legeringen te leveren, afgestemd op de behoeften van specifieke industrieën. Enkele van de hoogwaardige metalen die we aanbieden:"
        },
        {
          "type": "ul",
          "items": [
            "Nikkelsuperlegeringen: veel gebruikt in de lucht- en ruimtevaart en in industriële gasturbines vanwege hun bestendigheid tegen hoge temperaturen en corrosie.",
            "Kobaltlegeringen: bekend om hun hoge sterkte en slijtvastheid, en ideaal voor kritieke toepassingen in de lucht- en ruimtevaart en de olie- en gassector.",
            "Titaanlegeringen: licht en toch uitzonderlijk sterk, en daarmee onmisbaar voor industrieën die een hoge sterkte-gewichtsverhouding vereisen, zoals de lucht- en ruimtevaart en de medische sector."
          ]
        },
        {
          "type": "p",
          "text": "Naast deze metalen leveren we een breed assortiment ferrolegeringen, roestvast staal en andere hoogwaardige materialen, allemaal gecertificeerd volgens de veeleisende normen van de industrieën van onze klanten."
        },
        {
          "type": "h2",
          "text": "Maatwerkoplossingen voor retourmetalen uit de lucht- en ruimtevaart"
        },
        {
          "type": "p",
          "text": "Vooral de lucht- en ruimtevaart stelt strenge eisen aan de metalen in vliegtuigmotoren, casco's en andere kritieke componenten. Naast de levering van hoogwaardige legeringen biedt IMS Metals & Alloys OÜ gespecialiseerde oplossingen voor retourmetalen uit de lucht- en ruimtevaart. Retourmetalen — teruggewonnen uit onderdelen aan het einde van hun levensduur of uit productieschroot — worden gerecycled, getest en gecertificeerd om opnieuw in de toeleveringsketen te komen, wat fabrikanten een duurzame en kostenefficiënte oplossing biedt."
        },
        {
          "type": "p",
          "text": "Ons team van experts verzorgt alles, van het demonteren van motoren en het vernietigen van componenten tot het sorteren en classificeren van superlegeringen. We zorgen er ook voor dat alle edelmetalen, zoals goud, platina en renium, volgens industrienormen worden teruggewonnen en opnieuw verwerkt. Door met IMS Metals & Alloys OÜ samen te werken, kunnen lucht- en ruimtevaartbedrijven niet alleen afval verminderen, maar ook strikt voldoen aan prestatie- en veiligheidsnormen."
        },
        {
          "type": "h2",
          "text": "Ondersteuning van de olie- en gasindustrie"
        },
        {
          "type": "p",
          "text": "De olie- en gassector werkt in enkele van de meest extreme omgevingen op aarde, en de metalen in deze industrie moeten bestand zijn tegen corrosieve omstandigheden en hoge drukken. IMS Metals & Alloys OÜ levert materialen die voldoen aan de veeleisende eisen van de sector, waaronder:"
        },
        {
          "type": "ul",
          "items": [
            "Hoogwaardige nikkellegeringen voor corrosiebestendigheid",
            "Roestvast staal voor boor- en pijpleidingtoepassingen",
            "Ferrolegeringen die zorgen voor extra duurzaamheid en sterkte bij hoge temperaturen"
          ]
        },
        {
          "type": "p",
          "text": "We werken nauw samen met onze klanten in de olie- en gassector om ervoor te zorgen dat de geleverde materialen niet alleen van de hoogste kwaliteit zijn, maar ook voldoen aan alle relevante industrienormen en regelgeving."
        },
        {
          "type": "h2",
          "text": "Milieunaleving: voorop in duurzaamheid"
        },
        {
          "type": "p",
          "text": "Bij IMS Metals & Alloys OÜ voldoen we niet alleen aan industrienormen voor materiaalkwaliteit; we lopen ook voorop in milieunaleving. Onze inzet voor duurzaamheid blijkt uit onze innovatieve recyclingprocessen, die afval verminderen en de milieu-impact van metaalproductie beperken."
        },
        {
          "type": "p",
          "text": "Door waardevolle metalen terug te winnen uit industriële bijproducten zoals poeders, stof en slib, dragen we bij aan een circulaire economie en verminderen we de vraag naar primaire metaalwinning. Deze aanpak helpt onze klanten hun eigen duurzaamheidsdoelen te halen en waarborgt de naleving van milieuregelgeving wereldwijd."
        },
        {
          "type": "h2",
          "text": "Waarom IMS Metals & Alloys OÜ de partner is die u kunt vertrouwen"
        },
        {
          "type": "p",
          "text": "Met meer dan 15 jaar ervaring heeft IMS Metals & Alloys OÜ een reputatie opgebouwd als leverancier van hoogwaardige metalen die aan de strengste industrienormen voldoen. Ons uitgebreide netwerk van leveranciers, moderne testfaciliteiten en onze inzet voor kwaliteit maken ons tot een betrouwbare partner voor industrieën over de hele wereld."
        },
        {
          "type": "p",
          "text": "Of u nu legeringen van luchtvaartkwaliteit, corrosiebestendige metalen voor olie en gas of hoogwaardige materialen voor industriële gasturbines nodig hebt: wij hebben de expertise en middelen om te leveren. Door te kiezen voor IMS Metals & Alloys OÜ zorgt u niet alleen voor naleving van industrienormen, maar krijgt u ook een partner die zich inzet voor uw succes."
        },
        {
          "type": "h2",
          "text": "Conclusie"
        },
        {
          "type": "p",
          "text": "Voldoen aan industrienormen is essentieel voor veiligheid, betrouwbaarheid en efficiëntie in uiteenlopende sectoren. IMS Metals & Alloys OÜ levert metalen en legeringen van het hoogste niveau van kwaliteit en conformiteit en ondersteunt industrieën als de lucht- en ruimtevaart, olie en gas en industriële gasturbines."
        },
        {
          "type": "p",
          "text": "Heeft uw bedrijf materialen nodig die industrienormen halen of overtreffen? Dan bent u bij IMS Metals & Alloys OÜ aan het juiste adres. Neem vandaag nog contact met ons op en ontdek hoe we uw materiaalbehoeften kunnen invullen en u helpen de hoogste normen van kwaliteit en duurzaamheid te handhaven."
        },
        {
          "type": "p",
          "text": "Duurzame metaalterugwinning: van afval naar waarde"
        }
      ],
    },
  },
};
