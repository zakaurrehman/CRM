# Old → New Migration Matrix

Every public URL from the legacy sitemap, and every feature, accounted for.
Redirects are implemented in `next.config.ts` and all return **HTTP 301**.

---

## 1. Pages

| # | Legacy URL | New location | Status | Redirect |
| --- | --- | --- | --- | --- |
| 1 | `/` | `/` | Redesigned | — |
| 2 | `/about-us/` | `/about` | Redesigned | 301 |
| 3 | `/metals-alloys/` | `/materials` | Redesigned — now a searchable, filterable directory | 301 |
| 4 | `/metals-and-waste-recovery/` | `/recycling` | Redesigned — 19 streams, filterable by form | 301 |
| 5 | `/tungsten-carbide-recycling/` | `/recycling/tungsten` | Redesigned — own premium page | 301 |
| 6 | `/industries-served/` | `/industries` | Split & redesigned | 301 |
| 7 | `/contact-us/` | `/contact` | Redesigned — qualified inquiry form | 301 |
| 8 | `/blogs/` | `/insights` | Redesigned — editorial layout | 301 |
| 9 | `/category/blog/` | `/insights` | Merged | 301 |
| 10 | `/frequently-asked-questions/` | `/contact` | **Retired** — page was empty | 301 |
| 11 | `/locations.kml` | — | Dropped (Yoast local artefact) | — |

### Material pages — all 15 preserved

| # | Legacy URL | New location | Grades | Status |
| --- | --- | --- | --- | --- |
| 12 | `/nickel-alloys/` | `/materials/nickel-alloys` | 52 | Preserved + improved · 301 |
| 13 | `/tungsten-alloys/` | `/materials/tungsten-alloys` | 10 | Preserved + improved · 301 |
| 14 | `/stainless-steel/` | `/materials/stainless-steel` | 24 | Preserved + improved · 301 |
| 15 | `/complex-nickel-alloys/` | `/materials/complex-nickel-alloys` | 48 | Preserved + improved · 301 |
| 16 | `/nickel-copper/` | `/materials/nickel-copper` | 5 | Preserved + improved · 301 |
| 17 | `/high-speed-steels/` | `/materials/high-speed-steels` | 19 | Preserved + improved · 301 |
| 18 | `/cobalt-alloys/` | `/materials/cobalt-alloys` | 30 | Preserved + improved · 301 |
| 19 | `/copper-nickel-alloys/` | `/materials/copper-nickel-alloys` | 15 | Preserved + improved · 301 |
| 20 | `/tool-steels/` | `/materials/tool-steels` | 10 | Preserved + improved · 301 |
| 21 | `/cobalt-iron-alloys/` | `/materials/cobalt-iron-alloys` | 8 | Preserved + improved · 301 |
| 22 | `/alloy-irons/` | `/materials/alloy-irons` | 13 | Preserved + improved · 301 |
| 23 | `/titanium-alloys/` | `/materials/titanium-alloys` | 23 | Preserved + improved · 301 |
| 24 | `/nickel-iron-alloys/` | `/materials/nickel-iron-alloys` | 19 | Preserved + improved · 301 |
| 25 | `/magnet-alloys/` | `/materials/magnet-alloys` | 13 | Preserved + improved · 301 |
| 26 | `/zirconium-alloys/` | `/materials/zirconium-alloys` | 6 | Preserved + improved · 301 |

### Articles — all 3 preserved

| # | Legacy URL | New location | Status |
| --- | --- | --- | --- |
| 27 | `/2024/09/the-essential-role-of-metals-in-modern-industries/` | `/insights/the-essential-role-of-metals-in-modern-industries` | Migrated in full · 301 |
| 28 | `/2024/10/sustainable-metal-recovery-turning-waste-into-value/` | `/insights/sustainable-metal-recovery-turning-waste-into-value` | Migrated in full · 301 |
| 29 | `/2024/10/meeting-industry-standards-with-ims-metals-alloys-ou/` | `/insights/meeting-industry-standards-with-ims-metals-alloys-ou` | Migrated in full · 301 |

A catch-all rule also maps any other `/:year/:month/:slug` permalink to `/insights/:slug`.

**Coverage: 28 of 28 sitemap URLs accounted for.**

---

## 2. New pages (no legacy equivalent)

| New URL | Why it exists |
| --- | --- |
| `/about/quality-and-compliance` | Quality Control content was buried on the Industries page; it deserves its own page |
| `/about/sustainability` | Environmental Compliance content, likewise |
| `/recycling/aerospace-reverts` | Aerospace revert capability existed only as a paragraph on Home and About |
| `/industries/aerospace` | Was a heading with a broken image and no body copy |
| `/industries/oil-and-gas` | As above |
| `/industries/industrial-gas-turbine` | As above |
| `/industries/technology-and-mobility` | EV/battery/additive content existed only on the homepage |
| `/search` | The legacy site had no search at all |

---

## 3. Content elements

| Element | Legacy | New | Status |
| --- | --- | --- | --- |
| Company story | About + Home (duplicated verbatim) | `/about` — told once, properly | Consolidated |
| Company history | "started routes in Eastern Europe…" | `/about` hero + Who we are | Preserved |
| Alloy composition tables | 15 raw tables | 15 redesigned technical tables | **295/295 grades preserved** |
| Composition footnote | "indicates maximum…" | Reproduced verbatim, per table | Preserved |
| Continuation rows | 10 cells in unlabelled rows | Merged into parent grade's "Others" | Preserved (would have been lost) |
| Properties / Applications | One line each | Structured, in a spec panel | Preserved |
| Recovery streams | 19 headings + thumbnails | 19 cards, filterable by form | Preserved |
| Tungsten forms | 9 headings + thumbnails | 9 cards with descriptions | Preserved |
| Tungsten material classes | Prose sentence | Badge row in page hero | Preserved |
| Ferro-alloys | FeNiCr/FeW/FeMo/FeNb/FeTi | `/about` + `/materials` | Preserved |
| Specialist metals | Prose list of 10 | Hero ticker + About + Recycling | Preserved |
| Sectors served | Prose list of 11 | `/industries` grid | Preserved |
| Aerospace reverts | One paragraph | Full page + industry page | Expanded from source |
| Quality control | One paragraph | `/about/quality-and-compliance` | Preserved + structured |
| Environmental | One paragraph | `/about/sustainability` | Preserved + structured |
| Quality policy | One sentence | Quality page | Preserved |
| Process (sort→certify→melt) | One sentence | Six-step visual process | Expanded from source |
| Contact details | Address + email + fake phone | Address + email (phone withheld) | Preserved, placeholder removed |
| "Why Choose IMS" | 5 keyword-stuffed blocks | 4 differentiators on `/about` | Rewritten |
| FAQ | Empty page | — | Retired (nothing to migrate) |

---

## 4. Functionality

| Feature | Legacy | New | Status |
| --- | --- | --- | --- |
| Main navigation | Flat, 5 items, no Contact, 3 dead anchors | Mega menu, 5 groups, featured panels, Contact CTA | Substantially improved |
| Mobile navigation | Standard Elementor drawer | Purpose-built drawer, focus trap, accordions, 44px targets | Substantially improved |
| Site search | **None** | 340+ indexed items, Cmd/Ctrl-K palette + `/search` | **New** |
| Material filtering | **None** | By group, by grade name, live counts | **New** |
| In-table grade filter | **None** | On any table over 8 rows | **New** |
| Grade deep links | **None** | `#grade-<name>` anchors, linked from search | **New** |
| Stream filtering | **None** | By physical form | **New** |
| Contact form | 4 fields, demo placeholders | 10 fields, honeypot, rate limit, server validation, a11y errors | Substantially improved |
| Breadcrumbs | Present, buggy | Correct + BreadcrumbList schema | Fixed |
| Sitemap | Yoast XML | `app/sitemap.ts`, generated from data | Preserved |
| robots.txt | Static | `app/robots.ts` | Preserved |
| Structured data | Yoast defaults | Organization, WebSite+SearchAction, Breadcrumb, Article, ProductGroup | Improved |
| Downloads | None | None | No change (nothing existed) |

---

## 5. Nothing lost

Confirmed present in the new build:

- ✅ All 28 sitemap URLs resolve (kept or 301)
- ✅ All 295 alloy grades, with values byte-identical to source
- ✅ All 15 composition tables, including element column ordering
- ✅ All 10 continuation-row cells that a naive migration would have dropped
- ✅ All 19 recovery streams with their correct photographs
- ✅ All 9 tungsten forms with their correct photographs
- ✅ All 3 articles, body copy intact
- ✅ All usable imagery (46 assets, at higher resolution than the live site served)
- ✅ Address and email
- ✅ Every substantive sentence of real company content

Deliberately **not** carried over: the placeholder phone number, the three dead `#a`/`#b`/`#c`
links, the three 404 images, the empty FAQ page, the personal LinkedIn link, and the
keyword-stuffed duplicate prose. Each is documented in
[content-verification.md](./content-verification.md).
