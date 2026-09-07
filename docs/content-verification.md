# CONTENT / BUSINESS INFORMATION REQUIRES VERIFICATION

Everything below was found on the live `ims-metals.com` during the migration audit and
is either **contradictory**, **placeholder**, **broken**, or **an unsupported claim**.

Nothing in this list has been guessed at or invented in the new site. Where a value
could not be verified, the new build **omits it** rather than picking one — each item
notes exactly what the new site does today and what to change once you confirm.

Priority key: **P1** blocks launch · **P2** fix before launch · **P3** tidy-up

---

## P1 — Blocks launch

### 1. Years of experience — two different numbers

The legacy site makes two incompatible claims:

| Claim | Where |
| --- | --- |
| "over **15** years of experience" | Homepage body copy (twice) |
| "**15**+ Years Of Experience" | About page counter widget (`data-value="15"`) |
| "over **30** years of experience" | About page body copy (twice) |
| "over **30** years of experience" | About page meta description |
| "With over **30** years of experience" | Article: *Meeting Industry Standards* |
| "With over **30** years of experience" | Article: *The Essential Role of Metals* |

Note the About page contradicts **itself**: its counter says 15 while its own body text
says 30, three paragraphs apart.

**Current state:** no number is displayed anywhere on the new site.
**To fix:** set `experience` in `lib/site.ts`:

```ts
export const experience = { years: 30, verified: true };
```

The homepage credibility strip will then render the stat automatically. This is the
single source of truth — no other file hard-codes a number.

> The migrated articles still contain "over 30 years" in their body copy, as they are
> dated archive posts reproduced as published. If the correct figure is 15, those two
> sentences in `data/insights.ts` need correcting too.

---

### 2. Placeholder telephone number is live

The contact page publishes:

```
+123-456-7890
```

This is a Forminator demo value. The form's placeholders are also untouched defaults —
"E.g. John", "E.g. john@doe.com", "E.g. +1 3004005000".

**Current state:** no telephone number is rendered anywhere, and none is emitted in the
Organization schema. `contact.phone` is `null`.
**To fix:** set the real number in `lib/site.ts`:

```ts
phone: "+372 XXXX XXXX",
```

Header, footer, contact page and structured data all pick it up automatically.

---

### 3. Inquiry form has no delivery transport configured

The new inquiry endpoint validates and rate-limits, but needs somewhere to send to.

**Current state:** with no transport configured the API returns a clear error and the
form tells the user to email `info@ims-metals.com` directly — an enquiry is never
silently lost. In development, submissions are logged to the server console.
**To fix:** set **one** of these server-side environment variables (see `.env.example`):

- `INQUIRY_WEBHOOK_URL` — POSTs the JSON payload to a CRM, Zapier or Make endpoint
- `RESEND_API_KEY` + `INQUIRY_TO_EMAIL` — sends via the Resend HTTP API

Neither is ever exposed to the browser.

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

### 8. Company social link is a personal LinkedIn profile

The only social link on the site points to an individual's personal LinkedIn profile
(`linkedin.com/in/sharon-bashan-...`), labelled as the company's social presence.

**Current state:** omitted. `contact.social` is an empty array.
**To fix:** supply the LinkedIn **company page** URL and add it to `lib/site.ts`; it
will appear in the footer and in `sameAs` on the Organization schema.

---

### 9. Wrong company name in a heading

The Industries Served page has a section headed:

> "Why Work with **IMS Stainless**"

This does not match the company name used everywhere else (IMS Metals & Alloys OÜ).

**Current state:** not carried over; the content beneath it (the quality policy
statement) was migrated to the Quality & Compliance page under a correct heading.
**Confirm:** whether "IMS Stainless" is a related trading entity or simply an error.

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
