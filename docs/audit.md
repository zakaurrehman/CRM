# IMS Metals & Alloys — Legacy Website Audit

Audit of `https://ims-metals.com/` carried out before the rebuild. Every public URL
in the site's own sitemap was crawled and its content, imagery, tables and links
extracted.

**Audit date:** captured at the start of this rebuild
**Pages crawled:** 28 of 28 URLs in `sitemap_index.xml` (all returned HTTP 200)

---

## 1. Platform

| Item | Finding |
| --- | --- |
| CMS | WordPress |
| Page builder | Elementor + ElementsKit widgets |
| Forms | Forminator |
| SEO plugin | Yoast (`sitemap_index.xml`, `page-sitemap.xml`, `post-sitemap.xml`, `category-sitemap.xml`, `local-sitemap.xml`) |
| robots.txt | Disallows `/wp-admin/`, allows `admin-ajax.php`, declares sitemap |
| Homepage weight | 268 KB of HTML for a page whose real content is ~1,500 words |

---

## 2. Complete page inventory

### Core pages

| Legacy URL | Purpose | Keep / Merge / Redesign | New location |
| --- | --- | --- | --- |
| `/` | Home | Redesign | `/` |
| `/about-us/` | Company background | Redesign | `/about` |
| `/metals-alloys/` | Index of 15 alloy categories | Redesign | `/materials` |
| `/metals-and-waste-recovery/` | 19 recovery streams | Redesign | `/recycling` |
| `/tungsten-carbide-recycling/` | Tungsten forms | Redesign | `/recycling/tungsten` |
| `/industries-served/` | 3 industries + QC + environmental | Split & redesign | `/industries`, `/about/quality-and-compliance`, `/about/sustainability` |
| `/contact-us/` | Contact + form | Redesign | `/contact` |
| `/blogs/` | Article listing | Redesign | `/insights` |
| `/frequently-asked-questions/` | **Empty page** — zero content | Retire | 301 → `/contact` |
| `/category/blog/` | WP category archive | Merge | 301 → `/insights` |
| `/locations.kml` | Yoast local KML | Drop | n/a |

### Material pages (15)

Each carried an H1, a Properties line, an Applications line and one composition
table. All are preserved and redesigned at `/materials/<slug>`.

| Legacy URL | Grades | New location |
| --- | --- | --- |
| `/nickel-alloys/` | 52 | `/materials/nickel-alloys` |
| `/complex-nickel-alloys/` | 48 | `/materials/complex-nickel-alloys` |
| `/cobalt-alloys/` | 30 | `/materials/cobalt-alloys` |
| `/stainless-steel/` | 24 | `/materials/stainless-steel` |
| `/titanium-alloys/` | 23 | `/materials/titanium-alloys` |
| `/high-speed-steels/` | 19 | `/materials/high-speed-steels` |
| `/nickel-iron-alloys/` | 19 | `/materials/nickel-iron-alloys` |
| `/copper-nickel-alloys/` | 15 | `/materials/copper-nickel-alloys` |
| `/alloy-irons/` | 13 | `/materials/alloy-irons` |
| `/magnet-alloys/` | 13 | `/materials/magnet-alloys` |
| `/tungsten-alloys/` | 10 | `/materials/tungsten-alloys` |
| `/tool-steels/` | 10 | `/materials/tool-steels` |
| `/cobalt-iron-alloys/` | 8 | `/materials/cobalt-iron-alloys` |
| `/zirconium-alloys/` | 6 | `/materials/zirconium-alloys` |
| `/nickel-copper/` | 5 | `/materials/nickel-copper` |

**Total: 295 alloy grades across 15 categories.**

### Articles (3)

| Legacy URL | New location |
| --- | --- |
| `/2024/09/the-essential-role-of-metals-in-modern-industries/` | `/insights/the-essential-role-of-metals-in-modern-industries` |
| `/2024/10/sustainable-metal-recovery-turning-waste-into-value/` | `/insights/sustainable-metal-recovery-turning-waste-into-value` |
| `/2024/10/meeting-industry-standards-with-ims-metals-alloys-ou/` | `/insights/meeting-industry-standards-with-ims-metals-alloys-ou` |

---

## 3. Content captured

### Company description (consistent across pages, carried forward)

- Trading company in the metals industry.
- Business began with routes in Eastern Europe, grown into an international network
  with joint partnerships alongside several of the largest leading companies in the world.
- Handles stainless steel, low alloy steels, die steel, nickel, cobalt, complex nickel
  superalloys, pure metals and ferro-alloys.
- Arisings come from the petrochemical, oil & gas, IGT and aerospace sectors.
- Arisings are 100% sorted, segregated, processed, certified, then sold to end customers
  worldwide to be melted back into their parent alloys as **air-melt** or **vacuum grade** products.

### Specialist metals (10)

Nickel, Cobalt, Titanium, Molybdenum, Niobium, Tantalum, Tungsten, Zirconium, Hafnium, Rhenium
— plus precious metals.

### Ferro-alloys (5)

FeNiCr, FeW, FeMo, FeNb, FeTi — "available in all sizes, packings and specifications".

### Sectors named (11)

Stainless Steel, Oil & Gas, Aerospace, Automobile, Medical, Orthopedics, Electric (Car Battery),
Thermal Spray, Electro plating, Steel, 3D Additive Manufacturing.

### Aerospace revert capability

Engine teardown; onsite destruction of LLPs / rotating parts; sorting and grading of all
superalloys; recovery of precious metals including gold, platinum and rhenium.

### Recovery streams (19)

Alloy Metal Powder, AOD Dust, EAF Dust, Wet Filtercake, Dried Filtercake, Grindings,
Ni Hydroxide, BB's, Nuggets, Mill Scale, Fine Mill Scale, Moly Oxide, Ni Powder,
Plasma Dust, Shot Dust, Sinter Powder, Mill Sludge, Turnings, Pelletizer Dust.

### Tungsten forms (9)

Drills & End Mills, Mining Bits, Densalloy, CC Inserts, Sludge, Swarf, Morgan Rolls,
W Crucibles, Swarf (second entry, second photograph).

Tungsten material classes named in copy: Tungsten Carbide, Densalloy, CP-W, Tungsten
powder, Heavy Metals.

### Quality control

"IMS takes pride in their Quality Control metallurgical laboratory. Whether it's receiving
new samples, testing daily feed stock or analyzing our production line, these results
provide essential data to all areas of our plant operations."

Quality policy: "IMS is committed to a policy of continuously improving quality performance
throughout the business, to ensure that highest standards of product and service are achieved."

### Environmental

"IMS unique recycling process enables us to revalorize thousands of tons of material destined
to landfill every year. This not only reduces the environmental impact and valuable landfill
space, but replaces metal units originating from primary mining operations."

### Contact

- Address: Jõe tn 4C, Tallinn 10151, Estonia
- Email: info@ims-metals.com
- Telephone: **placeholder — see content-verification.md**

---

## 4. Existing functionality

| Feature | Legacy behaviour | New behaviour |
| --- | --- | --- |
| Navigation | Flat menu: About, Metals & Alloys, Metals and Waste Recovery, Tungsten Recycling, Industries Served. No Contact link in main nav. | Five-group mega menu with descriptions and featured panels; Contact promoted to a persistent button |
| Search | **None** | Site-wide search: 295 grades, 15 categories, 19 streams, 9 tungsten forms, industries, articles and pages. Cmd/Ctrl-K palette plus a `/search` page |
| Filters | **None** | Material group filter, in-table grade filter, recovery-stream form filter |
| Technical tables | 15 raw HTML tables, no headers fixed, no filtering, overflow on mobile | Sticky header + sticky grade column, in-table filter, deep-linkable grade anchors, accessible caption and scope |
| Contact form | Forminator: name, email, phone, message. Default demo placeholders ("E.g. John", "E.g. john@doe.com") | 10-field qualified inquiry with requirement type, material, industry, quantity; honeypot, rate limiting, server-side validation |
| Downloads | None | None (no source assets existed to migrate) |
| Breadcrumbs | Present but **buggy** — the Tungsten page's breadcrumb read "Metals and Waste Recovery" | Correct trail on every page, plus BreadcrumbList schema |
| Structured data | Yoast defaults | Organization, WebSite + SearchAction, BreadcrumbList, Article, ProductGroup |

---

## 5. Image inventory

81 unique image URLs were found; 46 assets were migrated after removing duplicate
thumbnail sizes and three broken files.

| Destination | Count | Source |
| --- | --- | --- |
| `/public/images/branding/` | 1 | Company logo (3000×1455 original) |
| `/public/images/hero/` | 2 | Turnings, hot metal plate |
| `/public/images/metals/` | 2 | Steel rods, stamped components |
| `/public/images/aerospace/` | 1 | Aero engines |
| `/public/images/oil-gas/` | 1 | Steel pipes |
| `/public/images/turbine/` | 1 | Turbine manufacturing |
| `/public/images/company/` | 4 | Scrap yard, claw crane, port terminal, recycling operations |
| `/public/images/recycling/` | 19 | One product photograph per recovery stream |
| `/public/images/tungsten/` | 9 | One photograph per tungsten form |
| `/public/images/news/` | 3 | Article lead images |
| `/public/images/icons/` | 3 | Quality, environmental, why-work-with-IMS icons |

**Recovered at full resolution.** The live pages served Elementor-cropped derivatives
(600×500 and 150×150 thumbnails). The uncropped originals were located and downloaded
instead, then re-encoded — 14.9 MB reduced to 8.6 MB with no visible quality loss.

**Broken images found.** `ind1.jpg`, `oilgass.jpg` and `gasturbine.jpg` — the three
industry photographs on `/industries-served/` — all return **HTTP 404**. The live page
renders three broken images. Replaced with the real aerospace, steel pipe and turbine
photographs already present elsewhere on the site.

---

## 6. Content problems found

Detailed in [content-verification.md](./content-verification.md). Summary:

1. **Years of experience contradicts itself** — 15 vs 30 across pages.
2. **Placeholder telephone number** `+123-456-7890` published on the contact page.
3. **Empty FAQ page** in the sitemap with no content at all.
4. **Broken navigation links** — homepage menu items point at `#a`, `#b`, `#c`.
5. **Three 404 images** on the Industries page.
6. **Personal LinkedIn** used as the company's only social link.
7. **Certification claim** (ASTM, ISO) appears in one article and nowhere else.
8. **Typos** — "We Are Are Leader In Industiral Market", "Nuggetts", "BB's01".
9. **Wrong brand name** — "Why Work with IMS Stainless" on the Industries page.
10. **Duplicate "Swarf"** listed twice on the Tungsten page.
11. **Breadcrumb bug** on the Tungsten page.
12. **Copy-pasted alloy metadata** — three unrelated categories share identical
    Properties and Applications text.
13. **Keyword-stuffed alt text** — nearly every image carried
    `alt="Metal Recycling Company Tallinn"`.
14. **Stale copyright** — "© 2024".

---

## 7. SEO assessment of the legacy site

**What was working:**
- Clean, flat URL structure with readable slugs.
- Yoast sitemaps and canonical tags present.
- Genuinely valuable technical content (295 alloy compositions) that few competitors publish.

**What was hurting it:**
- Severe keyword stuffing. The homepage repeated "metal recycling company Tallinn",
  "scrap metal processing Estonia" and similar phrases dozens of times in body copy.
- Title tags optimised for one local phrase rather than the business.
- The same company description repeated verbatim on the homepage and About page.
- Image alt text used as a keyword slot rather than a description.
- Material pages had almost no indexable prose — an H1, two short lines and a table.

**Preserved in the rebuild:** every legacy URL either kept or 301-redirected
(see [migration-matrix.md](./migration-matrix.md)); all 295 alloy grades; all real
company content; all usable imagery.
