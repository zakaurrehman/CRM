# Refocus: bringing the site in line with what IMS does now

_12 September 2026. Source: the IMS Metals & Alloys company intro (PDF) and
Sharoon's feedback of the same date. Published copy of this plan:
https://claude.ai/code/artifact/b050fa36-2009-4885-99be-cd1b1248bd97_

## Status

| Phase | State |
| --- | --- |
| **1 — Structure and data** | **Done** on branch `refocus-portfolio`. Everything below that needs no photographs. |
| 2 — Photos | Waiting on IMS. Slots are in `data/portfolio.ts` (`images`, up to four per family). |
| 3 — Translate and QA | Not started. ~70 new English phrases fall back to English in ru/fr/nl/he until translated. |

### Round 2 — Sharoon's feedback of 12 September, 14:41

Built the same day:

- **No groups at first glance.** The portfolio is a flat grid of twelve
  materials in the intro's order; the two groups survive only in the menu
  and footer.
- **Symbol, then name.** Each card leads with the element symbol in a
  square — `Ti` Titanium, `W` Tungsten — or the trade shorthand for an
  alloy family (`HSS`, `18Ni` for maraging, `SS`).
- **Tungsten and molybdenum separate**, both at the intro's 8%+.
- **Ferro Alloys section** restored from the previous website: FeNiCr, FeW,
  FeMo, FeNb, FeTi, on `/materials/ferro-alloys`.
- **Powders, Oxides & Intermediaries** — new section, grouped by metal, with
  formulas: APT, YTO, CaWO₄, WO₃ · MoO₃ · Ta₂O₅ · Nb₂O₅ · HfO₂ · Ni(OH)₂ and
  the nickel powders · filtercake, mill scale, mill sludge. Each metal's
  items also appear on its own page.
- **The nineteen residue streams** now all have a home: dusts, solids,
  turnings and grindings fold under the six accepted forms ("See what each
  form covers"); the powders, oxides, hydroxide and filtercakes sit in the
  intermediaries section. Q3 is therefore closed.

Two formulas were normalised from the list as sent and need a yes from IMS:
"Ta205" → Ta₂O₅; "NbO2" → Nb₂O₅ (the traded niobium oxide; NbO₂ exists but is
not a commercial intermediate). YTO and WO₃ are listed as sent — YTO is a
grade of WO₃, so they could be one item.

One deviation from the original plan: Stainless Steel sits in a group named
**"Ferro Alloys & Stainless"** beside FeNiCr, rather than under a bare "Ferro
Alloys" heading — stainless is a steel, not a ferro-alloy, and the heading
should not claim otherwise. The group still answers "where is the Ferro
Alloys section". Pending Q1.

## The gap

The site was a faithful rebuild of the old website, and the old website
described a different company: a "trading company" with a 295-grade
catalogue, 19 residue streams, tungsten recycling, aerospace reverts, four
industries, a metallurgical laboratory and a six-step process.

The intro describes **a specialised recycler that blends complex nickel-bearing
scrap into high-value Ni-based blends for refineries, superalloy producers and
stainless mills.** The word _blend_ appears five times in the intro and
appeared zero times on the site.

| Site before | IMS (intro) |
| --- | --- |
| "A trading company built on knowing exactly what the metal is" | "A specialised recycler and supplier to the global Ni refinery, stainless steel, superalloy, titanium & refractory metals industries" |
| "Advanced metals, alloys and recycling solutions for global industry" | "Turning complex scrap into opportunity" |
| Six-step sort/segregate/process/certify | A blending program: complex scrap in, Ni-based blends out, less downgrading |
| 295 grades in 15 categories, finder, compare, saved list | 11 material families |
| 19 residue streams | 6 accepted forms |
| 4 industries (who generates scrap) | 5 customer types (who IMS supplies) |
| Engine teardown, onsite destruction | not mentioned |
| Metallurgical laboratory | not mentioned |
| Ferro-alloys: a small list at the foot of About | FeNiCr is item 2 of 11 |
| Hf, Nb, Ta, Mo: names in a row of ten "specialist metals" | 4 of 11 items, with thresholds (8%+, 10%+) |

Why it felt like too much: 12 homepage sections, ~57 things to read or click,
two statistics bands showing the same four numbers, three competing calls to
action in two screens. The intro is one page.

## Rules

1. **The intro is the spine.** Every section maps to one of its five headings:
   Who we are · What we do · Portfolio · Accepted forms · Our advantage.
2. **Say it once.** No number, list or claim twice on a page.
3. **Data is reference, not headline.** The composition tables stay — behind
   each family, not in front of the company.
4. **Nothing invented, nothing deleted on a guess.** Old content the intro
   does not mention is a question in §8, not a silent deletion.
5. **Photos rotate; tiles don't.** Up to four frames per family. No element
   tiles.

## Homepage — 12 sections to 8

| Before | After |
| --- | --- |
| Market strip | Market strip (unchanged) |
| Welcome | Welcome (unchanged, as approved) |
| Hero: "Advanced metals…", Search 295 grades, ten-metal ticker | Hero: "Turning complex scrap into opportunity." · Request a quotation · See our portfolio · who we supply |
| Statistics band | — |
| Four pillars | — |
| 15 material tiles | **Portfolio**: 12 families in 4 groups, rotating photos |
| Four industries | — (one line in the closing CTA) |
| 19 streams + carousel + quote | **Accepted forms**: six words |
| Quality lab, four cards | — |
| Six-step process | — |
| Statistics again + six practices + company card | **Our advantage**: the intro's five |
| Three articles | — (Insights stays as a page, footer link) |
| Contact CTA | Contact CTA |
| | **What we do** — new; the blending program in three beats |

## Navigation and pages

Nav: `Portfolio ▾ · What we do · About` + Talk to IMS. The Portfolio menu is
the four groups and their families; no promo panels.

| Page | Action |
| --- | --- |
| `/` | Rebuilt |
| `/what-we-do` | New — who we are, the blending program, accepted forms, who we supply, advantage |
| `/about` | Rewritten — who we are, advantage, registered details (Reg. No. and EORI from the letterhead) |
| `/materials` (labelled Portfolio) | Rebuilt — 12 families in 4 groups; grade reference at the foot. URL kept for rankings |
| `/materials/<family>` × 12 | New — what's accepted, threshold, forms, photos, quotation; composition tables where a legacy table maps |
| `/materials/<category>` × 7 | Kept as reference — nickel copper, cupro-nickel, cobalt iron, alloy irons, nickel iron, magnet, zirconium |
| `/recycling` | Retired → `/what-we-do` (Q3) |
| `/recycling/tungsten` | Folded into `/materials/tungsten-moly` — its nine forms are that page's "forms we take" |
| `/recycling/aerospace-reverts` | Retired → `/materials/superalloys` (Q4) |
| `/industries` + 4 sectors | Retired → `/what-we-do` or the relevant family (Q6) |
| `/about/quality-and-compliance`, `/about/sustainability` | Retired → `/about` (Q5) |
| `/materials/finder`, `/compare`, `/saved`, `/rfq` | Kept; reached from the Portfolio page and footer, not the nav or hero |
| `/insights` | Kept; footer only |

Every retired URL and every legacy category URL returns a single-hop 301
(`next.config.ts`). 33 pages → 24.

## Portfolio

`data/portfolio.ts` is the source. Twelve families, four groups; each family
names the legacy composition tables that belong under it.

| Group | Family | Table(s) |
| --- | --- | --- |
| Nickel & Superalloys | High Nickel Alloys | Nickel Alloys (52) |
| | Superalloys — 718, 625, 713, Waspaloy, Hastelloy-types, Rene's, offgrade/mixes | Complex Nickel Alloys minus Maraging (44) |
| | Cobalt Based Alloys | Cobalt Alloys (30) |
| _(now flat — groups are menu-only)_ | Stainless Steel (`SS`) | Stainless Steel (24) |
| Steels & Titanium | HSS & Tool Steel | High Speed Steels (19) + Tool Steels (10) |
| | Maraging Steel | the four MARAGING grades, split out of Complex Nickel |
| | Titanium — Ti-6/4, CP Ti, 3D powder | Titanium Alloys (23) |
| | Tungsten (`W`) — 8%+ | Tungsten Alloys (10) + the nine tungsten forms |
| | Molybdenum (`Mo`) — 8%+ | — |
| | Niobium — 10%+ | — |
| | Tantalum — 10%+ | — |
| | Hafnium & Ni-Hf master alloys | — |

Grade ids, anchors and category slugs are untouched: they key the compare
tray, saved list and RFQ lines. `lib/portfolio.ts` maps a category (and grade)
to the family page that now carries it; every grade link goes through it.

**Family card**: group · name · threshold chip (where the intro gives one) ·
one line of what is accepted · rotating photo · "Details & quotation".
Nothing else — no grade count, no property tags, no paragraph.

## Rotating photos

`components/ui/RotatingImage.tsx`. Up to four frames, cross-fading every
five seconds, offset per card. Pauses on hover and focus; holds on frame 1
under reduced-motion and in a hidden tab; frames 2–4 load once the card is
on screen. A family with one frame is a still; a family with none shows a
light empty slot — not a picture of some other metal, not a coloured tile.

**Photo brief for IMS** — 12 families × 3–4 = 36–48 photographs:

- The material itself — turnings, solids, powder, grindings, inserts — not
  the yard, the crane or the building.
- Landscape, at least 1600 px wide, in focus, no watermarks or phone UI.
- Name by family: `superalloys-1.jpg` … `superalloys-4.jpg`.
- Frame 1 already covered from the existing library: High Nickel,
  Superalloys, Stainless, HSS & Tool Steel, Tungsten & Moly (all four frames).
- Nothing yet: Cobalt, FeNiCr, Maraging, Titanium, Niobium, Tantalum, Hafnium.

To add photographs: drop the files under `public/images/portfolio/` and list
them in the family's `images` array. Nothing else changes.

## Copy

In the intro's own words wherever it has them. Two words in the PDF render as
"Experdse" and "capabilides" — a font glitch for _Expertise_ and
_capabilities_.

Not carried forward unless confirmed: "metallurgical laboratory", "15+
years", "engine teardown", "onsite destruction", the 19 streams, "sorted,
segregated, processed, certified", "air-melt or vacuum grade".

## §8 — Decisions for IMS

The build proceeds on the recommendation until told otherwise.

| | Question | Recommendation (built) |
| --- | --- | --- |
| Q1 | Stainless steel — a customer, or also material you buy? | Both. Shown beside FeNiCr under "Ferro Alloys & Stainless", with its table. |
| Q2 | FeW, FeMo, FeNb, FeTi — still offered? | **Answered 12 Sept: yes.** All five are the Ferro Alloys section. |
| Q3 | The 19 residue streams — still accepted? | **Answered 12 Sept: fold them in.** Each stream now sits under an accepted form or in the intermediaries section. |
| Q4 | Aerospace reverts (teardown, onsite destruction) — still a service? | Retired. "Offgrade / mixes" under Superalloys is where that material lands. |
| Q5 | Laboratory, quality and sustainability pages — accurate? | Retired. Add one sentence to About only if true. |
| Q6 | Industries pages — retire? | Retired. One line naming the five customer types replaces them. |
| Q7 | "Rare earth" — which metals? | Group named "Refractory & Rare Metals", listing exactly W, Mo, Nb, Ta, Hf. Rare earths added only if IMS trades them. |

## What did not change

Market strip · welcome reveal · header and logo · WhatsApp button · five
languages · legacy WordPress 301s · RFQ form · design system · composition
tables (byte-identical).
