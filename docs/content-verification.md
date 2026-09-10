# CONTENT / BUSINESS INFORMATION REQUIRES VERIFICATION

Everything below was found on the live `ims-metals.com` during the migration audit and
is either **contradictory**, **placeholder**, **broken**, or **an unsupported claim**.

Nothing in this list has been guessed at or invented in the new site. Where a value
could not be verified, the new build **omits it** rather than picking one — each item
notes exactly what the new site does today and what to change once you confirm.

Priority key: **P1** blocks launch · **P2** fix before launch · **P3** tidy-up

---

## P1 — Blocks launch

### 1. Years of experience — RESOLVED (15, confirmed 2026-09-10)

The legacy site made two incompatible claims, and its About page contradicted
**itself** — the counter said 15 while its own body text said 30, three
paragraphs apart:

| Claim | Where |
| --- | --- |
| "over **15** years of experience" | Homepage body copy (twice) |
| "**15**+ Years Of Experience" | About page counter widget (`data-value="15"`) |
| "over **30** years of experience" | About page body copy (twice) |
| "over **30** years of experience" | About page meta description |
| "With over **30** years of experience" | Article: *Meeting Industry Standards* |
| "With over **30** years of experience" | Article: *The Essential Role of Metals* |

**IMS confirmed 15 on 2026-09-10.** `experience` in `lib/site.ts` is now
`{ years: 15, verified: true }` and the homepage credibility strip renders the
stat in every language. That file is the single source of truth — no other file
hard-codes a number.

The 30-year figure was therefore wrong wherever it appeared, including in the
two migrated articles. Those sentences have been corrected in
`data/insights.ts` and `lib/i18n/content/en.ts` rather than reproduced as
published: leaving them would have put a claim IMS has told us is false on the
site, contradicting the homepage on the same visit.

---

### 2. Telephone number — RESOLVED (confirmed 2026-09-10)

The legacy contact page published `+123-456-7890`, a Forminator demo value.
Its form placeholders were untouched defaults too — "E.g. John",
"E.g. john@doe.com", "E.g. +1 3004005000".

**IMS confirmed +972 54-907-0254 on 2026-09-10**, the same number already
supplied for WhatsApp (see 9b, now also closed). `contact.phone` in
`lib/site.ts` is set, so the header, footer, contact page and Organization
structured data all carry it. `tel:` links strip the visual separators, giving
`tel:+972549070254`.

An Israeli dialling code against an Estonian registered office is intentional
and reflects how the business is run; it is recorded here so it is not later
mistaken for a data-entry error.

---

### 3. Inquiry form has no delivery transport configured

The endpoint validates, rate-limits and is proven to deliver — it just has nowhere to
send to yet. This is configuration, not code: the credential can only come from IMS,
and it must not live in the repository.

**Current state:** with no transport set the API returns a clear error, and the form
hands the visitor a **pre-filled email** containing everything they typed, so an
enquiry is never lost and nobody has to retype a long technical message. In
development, submissions are logged to the server console.

**To fix:** set **one** of the following in the Vercel project settings
(Settings → Environment Variables), then redeploy. Full notes in `.env.example`.

| Option | Variables | When it suits |
| --- | --- | --- |
| **A — existing mailbox** | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Usually quickest. Uses the SMTP details for `info@ims-metals.com` from your email host. No new account, and mail leaves from an address recipients already trust. |
| **B — CRM / automation** | `INQUIRY_WEBHOOK_URL` | The enquiry is POSTed as JSON to Zapier, Make or a CRM, creating a record rather than an email. |
| **C — Resend** | `RESEND_API_KEY` | Best deliverability and a log of every message, but needs an account and domain verification. |

Option A is normally a two-minute job — the details are the same ones used to set up
`info@ims-metals.com` in a mail client.

None of these ever reaches the browser; delivery happens entirely in
`lib/inquiry-delivery.ts`, which the client bundle never imports.

**Verified:** the SMTP path was tested end to end against a live SMTP server —
`POST /api/inquiry` returned `200 {"ok":true}` with the message accepted for delivery.

---

## P2 — Fix before launch

### 4. Empty FAQ page is published and indexed

`/frequently-asked-questions/` appears in the sitemap, returns HTTP 200, and contains
**no content whatsoever** — no headings, no questions, no answers. Only the site chrome.

**Current state:** 301-redirected to `/contact`.
**Decide:** either supply real FAQ content (we can build the page), or leave the
redirect in place permanently.

---

### 5. Broken navigation links on the homepage

Three homepage menu items point at dead anchors that match nothing on the page:

```
https://ims-metals.com/#a
https://ims-metals.com/#b
https://ims-metals.com/#c
```

**Current state:** not carried over. The new navigation has no placeholder links.
**Action:** none needed unless those were meant to reach specific sections — tell us
which, and we will point them there.

---

### 6. Three industry images return 404

The Industries Served page references three photographs that no longer exist on the
server. The live page renders three broken images.

| File | Status |
| --- | --- |
| `/wp-content/uploads/2024/10/ind1.jpg` | HTTP 404 |
| `/wp-content/uploads/2024/10/oilgass.jpg` | HTTP 404 |
| `/wp-content/uploads/2024/10/gasturbine.jpg` | HTTP 404 |

**Current state:** replaced with genuine aerospace, steel-pipe and turbine photographs
already owned and used elsewhere on the site.
**Confirm:** that these substitutions are acceptable, or supply the intended originals.

---

### 7. Certification claims are unsupported

The article *Meeting Industry Standards* states materials are:

> "certified to meet relevant international standards, such as **ASTM, ISO**, and other
> industry-specific regulations"

No certification, accreditation or scheme membership is shown anywhere else on the site,
and no certificate is published.

**Current state:** the claim remains inside the migrated article (reproduced as
originally published) but is **not** repeated on the new Quality & Compliance page.
That page instead says certification accompanies material and specific standards are
confirmed per contract.
**To fix:** confirm which standards IMS actually holds or certifies to. If IMS is
certified to ISO 9001 or 14001, send the certificate numbers and we will display them
properly. If not, the article sentence should be amended.

---

### 8. LinkedIn link is a personal profile, not a company page — SUPPLIED

The legacy site's only social link pointed at an individual's LinkedIn profile.
IMS has confirmed this is the link to use, and it is now live as an icon in the
footer: `linkedin.com/in/sharon-bashan-355a1272/`.

**One deliberate limit.** It is shown in the footer but **excluded from the
Organization `sameAs`** structured data. `sameAs` asserts that each URL is
another presence *of this organisation*; listing a person's profile there tells
search engines the company and the individual are the same entity, which can
distort how the business is represented in search results.

**Still worth doing:** create a LinkedIn **company page**. It carries the
business rather than an individual, survives staff changes, and can then be
claimed in structured data. Once it exists, add it in `lib/site.ts` with
`isCompanyProfile: true` and the schema picks it up automatically.

---

### 9. Wrong company name in a heading

The Industries Served page has a section headed:

> "Why Work with **IMS Stainless**"

This does not match the company name used everywhere else (IMS Metals & Alloys OÜ).

**Current state:** not carried over; the content beneath it (the quality policy
statement) was migrated to the Quality & Compliance page under a correct heading.
**Confirm:** whether "IMS Stainless" is a related trading entity or simply an error.

---

### 9b. WhatsApp contact button — RESOLVED

IMS supplied **+972 54-907-0254**. The floating WhatsApp button is live on every
page, opening a thread prefilled with "Hello IMS — I have a materials enquiry."
It is a plain `wa.me` link, not the official widget: no third-party script, no
tracking, no cookie-consent requirement.

**The open question — whether this should also be the published telephone
number — was answered on 2026-09-10: yes.** IMS gave the same number when asked
for a company telephone, so it is now set as `contact.phone` as well and
appears in the header, footer, contact page and structured data. See item 2.

---

### 10. Missing company registration details

For an Estonian OÜ trading internationally, the site publishes no registry code, no VAT
number and no company registration information.

**Current state:** none shown.
**To fix:** supply the Estonian registry code and VAT number if you want them in the
footer — common practice for EU B2B and useful for trade credibility.

---

## P3 — Corrections applied, please confirm

### 11. Spelling and wording corrected

| Legacy text | Corrected to | Where |
| --- | --- | --- |
| "We Are Are Leader In **Industiral** Market" | Heading dropped; content restructured | About |
| "**Nuggetts**" | "Nuggets" | Recovery streams |
| "**BB's01**" | "BB's" — the trailing "01" looked like a stray character | Recovery streams |

**Confirm:** that "BB's" is correct and "01" was not a meaningful product code.

---

### 12. "Swarf" was listed twice on the Tungsten page

Two separate entries both labelled "Swarf", with two different photographs.

**Current state:** kept as `Swarf` and `Swarf (bulk)` — the second image shows loose
bulk material.
**Confirm:** the correct name for the second entry.

---

### 13. Breadcrumb bug on the Tungsten page

`/tungsten-carbide-recycling/` displayed a breadcrumb reading "Home / Metals and Waste
Recovery" rather than its own title.

**Current state:** fixed. Correct trails site-wide, plus matching BreadcrumbList schema.

---

### 14. Identical Properties/Applications on unrelated alloy categories

Three categories share byte-identical metadata, which looks like copy-paste in the source:

| Category | Properties | Applications |
| --- | --- | --- |
| Nickel Alloys | Heat Resistant, Corrosion Resistant, Acid Resistant | Chemical and Food Industry, Aero Engine Parts |
| Alloy Irons | *(identical)* | *(identical)* |
| Nickel Iron Alloys | *(identical)* | *(identical)* |

Alloy Irons and Nickel Iron Alloys are metallurgically quite different from Nickel
Alloys and from each other — "Aero Engine Parts" is a doubtful application for Alloy Irons.

**Current state:** preserved exactly as published; a distinct written summary was added
per category so the pages are not identical to a reader.
**To fix:** supply corrected properties/applications for Alloy Irons and Nickel Iron Alloys.

---

### 15. Image alt text was keyword-stuffed

Nearly every image on the site carried `alt="Metal Recycling Company Tallinn"`,
regardless of subject — bad for accessibility and offers nothing to search engines.

**Current state:** rewritten. Decorative images use empty alt; content images describe
what they show.

---

### 16. Stale copyright year

Footer read "Copyright © 2024" throughout.

**Current state:** renders the current year automatically.

---

### 17. Display font on the original site is commercially licensed — DECISION NEEDED

The existing ims-metals.com sets its headings in **Ethnocentric** (loaded via
`post-28.css`, alongside TT Commons, Barlow and Inter). Ethnocentric is a paid
commercial typeface, not a webfont that can be self-hosted without a licence.

**Current state:** the rebuild uses **Archivo** for display headings. It is not a
match for Ethnocentric's wide techno character.

**Why this is not a decision I can make:** self-hosting Ethnocentric requires
proof that IMS holds a web licence for it. Shipping it without one would be an
infringement, and the licence cannot be inferred from the fact that the current
site uses it — the current site may itself be out of compliance.

**Options, for IMS to choose:**

| Option | What it needs |
| --- | --- |
| **A — keep Archivo** | Nothing. Cleaner and more legible at small sizes; does not evoke the original masthead. |
| **B — self-host Ethnocentric** | IMS supplies the web licence (or buys one) plus the WOFF2 files. Closest to the original. |
| **C — free lookalike** | Nothing. Michroma or Orbitron sit near Ethnocentric's proportions without the licence question, but neither is an exact match. |

Ask IMS whether they hold a web licence for Ethnocentric. If they do, B is the
closest match to "like the original". If they do not, this is A or C.

---

### 18. Material availability indicators — BLOCKED, NEEDS DATA

Requested as part of the platform build: an availability or stock indicator against
each grade.

**Not built, deliberately.** IMS has supplied no stock, lead-time or availability
data, and none exists anywhere in the audited site. Any indicator rendered today
would be invented — and unlike a vague marketing claim, "In stock" is a commercial
representation a buyer will act on. A wrong one costs an order and, on aerospace or
oil & gas material, potentially a production stoppage.

**What would unblock it,** in rough order of effort:

| Option | What IMS supplies | What appears on the site |
| --- | --- | --- |
| **A — per-grade flag** | A spreadsheet with one row per grade and a status (`stocked` / `to order` / `enquire`) | A badge on the grade row, table and finder result |
| **B — lead-time band** | The same, plus an indicative lead time per status | "Typically 2–4 weeks" under the badge |
| **C — live feed** | A URL or export from the stock system, refreshed on a schedule | Live indicator, with a "last updated" timestamp |

The data model already has a stable id for every grade (`categorySlug:grade-name`,
see `lib/alloy-ids.ts`), so any of the three drops in against that key without a
schema change.

---

### 19. Interactive global supply and recycling map — BLOCKED, NEEDS DATA

Requested as a premium feature: a map of supply and recycling locations.

**Not built, deliberately.** The only location the audit could substantiate is the
registered office in Tallinn, Estonia. The brief forbids inventing locations and
countries, and a world map is a claim about physical presence — arguably the single
easiest thing on a website for a prospective customer or a regulator to check.

The legacy site says IMS trades "internationally" and holds "joint-partnerships with
several of the largest leading companies in the world" but names no country, city,
facility or partner. That is not enough to place a single pin beyond Tallinn, and a
map with one pin is worse than no map.

**What would unblock it:** a list of locations IMS is willing to publish, each with a
role — office, processing site, partner site, or market served. Even "markets served"
at country level would support a credible map, and is a much lower bar than claiming
facilities. Until then the site describes reach in the words IMS itself uses.

---


---

### 20. Photography — six alloy families have no image of the metal

There are seven general metal photographs on the site and fifteen alloy
families, so no assignment gives every family a true one. What was happening
instead was one photograph standing in for several unrelated materials:
`steel-rods.jpg` carried Nickel, Copper Nickel, Titanium **and** Zirconium, and
`stamped-components.jpg` carried three more. Titanium is bright silver and
cupronickel is coppery — a photograph of dark oxidised ferrous billet ends is
not a picture of either.

**Each photograph is now used by exactly one family, on the family it genuinely
depicts.** `scripts/verify-alloy-index.ts` fails the build check if that stops
being true.

| Family | Photograph | Why it is honest |
| --- | --- | --- |
| Nickel Alloys | aero engines | Inconel, Nimonic and Hastelloy are the aero-engine nickel alloys |
| Complex Nickel Alloys | turbine hall | cast superalloys, gas turbine hot section |
| Tungsten Alloys | Densalloy | actual tungsten heavy alloy |
| High Speed Steels | drills and end mills | HSS cutting tools |
| Stainless Steel | stainless turnings | the commonest stainless arising |
| Nickel Copper | pipe stock | Monel: seawater and marine piping |
| Tool Steels | ferrous billet ends | dark ferrous stock |
| Alloy Irons | hot ferrous plate | rolling and casting |
| Nickel Iron Alloys | stamped components | Invar and Nilo in precision stampings and laminations |

**The remaining six have no honest photograph and render a *specimen card*
instead** — the family's dominant element large, with its characteristic
elements and their typical percentages, computed from the published composition
tables. It is derived from real data rather than decorative, so it identifies
the family at a glance, and it is visibly a designed panel rather than a
photograph pretending to be one. Their detail pages use the typographic hero
rather than showing a picture of some other metal.

A wrong photograph is worse than no photograph on a technical site. The buyers
this site is for can tell tungsten carbide from tool steel at a glance, and one
mismatched image undermines the composition data sitting beside it.

**To replace a specimen card with photography,** supply any of the following.
Landscape, 2000px wide or more, and ideally IMS's own material rather than
stock:

| Family | What to photograph |
| --- | --- |
| Cobalt Alloys | Stellite hardfacing, cobalt-base valve seats or turbine wear parts |
| Copper Nickel Alloys | cupro-nickel tube, plate or condenser bundles |
| Cobalt Iron Alloys | transformer laminations or magnetic cores |
| Titanium Alloys | Ti bar, plate, sponge or machining turnings |
| Magnet Alloys | Alnico magnets, cast or sintered |
| Zirconium Alloys | Zr sponge, tube or bar |

Dropping one in is a two-field change — set `image` and `cardArt: "photo"` in
`data/alloys.ts` **and the matching entry in `data/alloy-index.ts`**. The index
is a generated companion with no generator checked in, so the two drift silently
if only one is edited; that is what `scripts/verify-alloy-index.ts` exists to
catch, and it is worth running after any image change.

**Also worth supplying,** to replace defensible-but-generic stand-ins: nickel
alloy bar or billet, and a stainless *product* rather than turnings, which are
an arising rather than something IMS sells.

**Reuse across page types is intentional and honest.** The aero-engine photo
appears on the Nickel Alloys category, the Aerospace industry page and the
aerospace reverts page; the turbine photo on Complex Nickel Alloys and the
Industrial Gas Turbine page. In each case the image depicts something true about
both. What was removed was reuse across *unrelated* subjects.

---

### 21. Translations need a native review before launch

The site ships in English, Russian, French, Dutch and Hebrew. English is the
default; the choice is remembered per browser and applies to the whole
application, not to the header alone.

**How it works.** Middleware reads the locale cookie and puts it on the request
as `x-ims-locale`; server components read that through `getLocale()`. This is
the part that matters: most of the site is server-rendered, and a server
component cannot read a client-side React context, so a client-only
implementation translates the navigation and leaves every page body in English.
The cookie is mirrored into `localStorage` so the choice survives a cleared
cookie, and changing language calls `router.refresh()` so the server tree
re-renders in the new language without a full page load.

**What is translated:** effectively all of it. Navigation and dropdowns,
headings, body prose, buttons and calls to action, form labels, placeholders,
hints, validation messages, success and error states, empty and loading states,
search and filter controls, table captions and column labels, pagination,
tooltips, breadcrumbs, screen-reader-only labels, the statistics and trust
sections, the interactive recycling process, and the metadata (page titles,
descriptions, `lang` and `dir`). Category, industry, recovery-stream, tungsten
form and process-step descriptions are translated too, through a content
overlay keyed by slug — all 19 streams, 15 categories, 4 industries, 9 tungsten
forms and 6 process steps are covered in all four languages. Dates are
formatted per locale rather than pinned to `en-GB`.

**What is not, deliberately:**

| Kept in English | Why |
| --- | --- |
| Alloy designations (Inconel 718, Hastelloy C276) | International identifiers; translating one would name a different material |
| Element symbols (Ni, Cr, Co) | Case-significant notation — Co is cobalt, CO is carbon monoxide |
| Composition values, `max`, `Bal.` | Numeric and notational |
| Standards (ASTM, UNS, EN, AISI, AMS) | Standards bodies and their references |
| Ferro-alloy codes (FeNiCr, FeW, FeMo) | Designations, not words |
| Alloy-finder example queries | They are input to an English-language parser; a translated example would not run |
| Article bodies | A machine-grade translation of a material specification is a liability — get one term wrong and a buyer orders the wrong alloy. Titles, standfirsts and descriptions are translated; the body falls back to English |
| The RFQ email body sent to IMS | Addressed to the IMS team, not to the person filling the form in |

**Measured coverage.** Residual English words per page, Russian, counting only
words that are not in the keep-in-English list above:

| Page | Before | After |
| --- | --- | --- |
| `/` | 558 | 16 |
| `/about` | 414 | 9 |
| `/materials/finder` | 331 | 40 |
| `/materials/nickel-alloys` | 302 | 19 |
| `/recycling` | 204 | 4 |
| `/rfq` | 159 | 3 |
| `/contact` | 150 | 4 |
| `/materials` | 144 | 12 |
| `/industries` | 105 | 7 |
| `/recycling/tungsten` | 97 | 12 |
| `/insights` | 79 | 3 |

What remains is alloy names and composition notation — the rows in the table
above. Hebrew tracks Russian almost exactly because both are measured the same
way; French and Dutch cannot be measured this way at all, because the check
cannot tell French from English by script alone.

**Numbers and grammatical agreement.** Russian selects one of three noun forms
from a numeral's last digit (1 марка, 2 марки, 5 марок), and the phrase system
does not implement plural rules. Where a count is a fixed site constant — 295
grades, 15 categories, 19 streams — the wording is simply correct for that
value. Where the count is a live result, the sentence is built so the number
follows a colon ("Марок в каталоге: 52"), which is invariant. If a future change
introduces a variable count in a position that requires agreement, it needs
either the same treatment or real plural rules via `Intl.PluralRules`. Hebrew
has a dual form that is likewise not implemented; technical Hebrew tolerates the
plural at n=2, so this is left as it stands.

**These translations have not been reviewed by a native speaker.** They are
competent but they were not written by someone who trades metal in these
languages, and that is exactly where the risk sits. Terms to check first:

| English | Why it is risky |
| --- | --- |
| revert | Aerospace-specific; not "return" or "scrap" |
| arisings | Trade term for material generated by a process |
| air-melt / vacuum grade | Melting route, not a quality adjective |
| filtercake | Specific residue form |
| grade | "Nuance" in French, "kwaliteit" in Dutch — not "grade" |

Files are `lib/i18n/dictionaries/{ru,fr,nl,he}.ts` for short interface labels,
`lib/i18n/phrases/{ru,fr,nl,he}.ts` for page prose (~590 entries each, keyed by
the English source so a missing translation degrades to readable English rather
than a blank or a raw key), and `lib/i18n/content/{ru,fr,nl,he}.ts` for the
slug-keyed data overlays. All three are flat lists a translator can work
through without touching code, and the dictionary types make a missing key a
build failure rather than a blank label in production. Hebrew needs the most
attention: metallurgical vocabulary is less settled there and several terms are
descriptive rather than standard usage.

**URLs do not change with language.** The identifiers that would justify a
per-language URL are exactly the part that stays in English, so per-locale URLs
would serve near-duplicate pages and split their own ranking. It also keeps the
legacy 301 map, the sitemap and every existing internal link untouched. The
trade-off is that pages render per request and search engines, which do not
send cookies, index the English version. If IMS later has the technical content
professionally translated, per-locale routing becomes worth adding and should
be revisited then.

**Caching.** Because the locale comes from a cookie, an HTML response is only
valid for the cookie that produced it. Pages are sent `private, no-store`,
which is what actually prevents a shared cache from handing one visitor a page
rendered for another. A `Vary: Cookie` header is declared in `next.config.ts`,
but Next.js replaces `Vary` on RSC-rendered routes with its own router values,
so it does not survive on most pages — verified against a running build. This
is safe as it stands; it would need revisiting if these routes were ever made
cacheable.

**Right-to-left** is implemented for Hebrew through logical CSS properties, so
the layout mirrors rather than being restyled: navigation, drawer, tables,
forms, cards and the sticky grade column all flip, and the logo moves to the
right of the header with the call to action on the left. English paragraphs
inside an RTL page are marked so their punctuation does not migrate to the
wrong end of the sentence. Verified for layout mirroring and horizontal
overflow at 1440, 1024, 768 and 390px across seven pages.

---

### 22. Live metals prices and exchange rates — LIVE, WITH TWO FEED PROBLEMS

The homepage carries a price board above the hero: nine metals and five currency
rates, refreshed automatically every 15 minutes with a manual refresh control and
a visible timestamp, so a reader can always see how old a figure is.

**Where the numbers come from.** Metals from metals-api, currencies from Open
Exchange Rates. Both are read server-side only. `METALS_API_KEY` and the exchange
app ID are read inside modules marked `server-only`, which makes importing them
into a client component a build error rather than a leak; the browser only ever
talks to `/api/market` on this domain. Neither credential is in the repository —
`.env*` is gitignored and only `.env.example`, with empty placeholders, is tracked.

**Prices are never invented.** If a feed is unavailable, that half of the board is
omitted; if neither responds, the whole band renders nothing and the page closes up
around it. There is no placeholder, no last-known figure presented as current, and
no fallback table. Prices are converted from the provider's troy-ounce quoting to
tonnes (×32,150.7466) and rejected if the result is implausible, because a wrong
unit is worse than no price.

**Rouble pairs are not offered.** USD/RUB and EUR/RUB were removed on IMS's
instruction: quoting in roubles carries sanctions exposure and invites a KYC
question. RUB is dropped from the supported currency list rather than hidden in the
interface, so it is not reachable through the API either.

**Two problems with the feed, for IMS to raise with the provider:**

| Problem | Detail |
| --- | --- |
| **Titanium is missing** | The plan publishes no titanium symbol, so a metal central to IMS's business is absent from the board. Every candidate code was tried against the provider's own symbol list. |
| **Tungsten reads ~$357,000/tonne** | Roughly ten times the market. The figure is not shown for that reason. Either the symbol is quoted in a unit the provider does not document, or the series is wrong. |

**Small trend charts are not built.** They need a daily series, and the timeseries
endpoint returns HTTP 400 on the current plan — it is a tier feature. If IMS wants
sparklines, this is a plan upgrade, not development work; the code already probes
the endpoint and reports what it gets back.

**Design.** The board is a static grid, not a scrolling ticker. A ticker makes a
reader wait for the number they came for, does not scan on a phone, and needs a
pause control to satisfy WCAG 2.2.2 because it never stops. A board is read at a
glance and has no motion to manage. Metal names translate in all five languages;
element symbols, currency codes and figures do not.

---

## Claims deliberately NOT made on the new site

Recorded so it is clear these were choices, not oversights. Each was either
contradictory, unsupported, or absent from the legacy content:

- Any specific number of years in business
- Any telephone number
- Any certification, accreditation or standards body membership
- Number of employees, customers, countries or facilities
- Tonnage, throughput, capacity or revenue figures
- Quantified environmental figures (CO₂ saved, tonnes diverted)
- Named customers or partners — the site says "Joint-Partnerships with several of the
  largest leading companies in the world" but names none, so none are implied
- Any facility, plant or laboratory location beyond the Tallinn registered address

The environmental language that **is** used ("revalorise thousands of tons of material
destined for landfill every year", "replaces metal units originating from primary
mining operations") is reproduced from IMS's own published statement.
