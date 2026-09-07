# IMS Metals & Alloys — Website

A complete rebuild of [ims-metals.com](https://ims-metals.com) in Next.js. Replaces the
legacy WordPress/Elementor site, migrating all content and the full technical alloy
dataset while rebuilding the information architecture, design system and front end.

**Read first:** [`docs/content-verification.md`](docs/content-verification.md) — a list of
contradictory, placeholder and unsupported information found on the legacy site. Three
items block launch.

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm start            # serve the production build
npm run typecheck    # tsc --noEmit
```

Node 20+ required (developed on Node 24).

---

## Configuration

Copy `.env.example` to `.env.local`. Nothing is required for local development.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph. Defaults to the production domain. |
| `INQUIRY_WEBHOOK_URL` | Server-side. POSTs each inquiry as JSON to a CRM/Zapier/Make endpoint. |
| `RESEND_API_KEY` | Server-side. Alternative transport — sends the inquiry by email via the Resend HTTP API. |
| `INQUIRY_TO_EMAIL` | Recipient when using Resend. Defaults to `info@ims-metals.com`. |
| `INQUIRY_FROM_EMAIL` | Sender when using Resend. |

**The inquiry form needs one of `INQUIRY_WEBHOOK_URL` or `RESEND_API_KEY` before launch.**
Without either, the API returns a clear error and the form tells the visitor to email
directly — an enquiry is never silently dropped. In development, submissions are logged
to the server console instead.

No key is ever exposed to the browser; all delivery happens in `app/api/inquiry/route.ts`.

---

## Where things live

```
app/                  Routes (App Router). One folder per page, plus sitemap/robots/api.
components/
  layout/             Header, mega menu, mobile drawer, search, footer
  ui/                 Design-system primitives: Button, Badge, Section, Breadcrumbs, Reveal
  home/               Homepage sections
  materials/          Composition table, materials browser, stream grid
  shared/             PageHero, CtaSection, ProcessSteps
  forms/              InquiryForm
lib/
  site.ts             Single source of truth for company facts  <-- edit this, not pages
  navigation.ts       Information architecture
  search.ts           Site-wide search index
  seo.ts / schema.tsx Metadata helpers and JSON-LD
  inquiry.ts          Inquiry validation + delivery transports
data/
  alloys.ts           295 alloy grades with full composition (generated — do not hand-edit)
  alloy-index.ts      Slim companion: names only, for client-side browse/search
  recovery.ts         19 recovery streams, 9 tungsten forms, the 6-step process
  industries.ts       4 industry sectors
  insights.ts         3 migrated articles
docs/                 Audit, content verification, migration matrix
public/images/        46 assets recovered from the legacy site, organised by subject
```

### Editing company information

`lib/site.ts` is the single place that defines company facts. Two values are deliberately
withheld until verified:

```ts
export const contact = { phone: null, social: [], ... };
export const experience = { years: null, verified: false };
```

Setting `phone` publishes it across the header, footer, contact page and Organization
schema. Setting `experience` to `{ years: 30, verified: true }` adds the years stat to the
homepage. Nothing else needs changing. See `docs/content-verification.md` for why both are
currently empty.

### The alloy dataset

`data/alloys.ts` is generated from the legacy technical tables and verified byte-for-byte
against the crawled source: **295 grades, 3,245 composition cells, zero mismatches.**
Composition values are reproduced exactly, including the `*` maximum notation, `BAL`, and
multi-element "Others" entries. Do not hand-edit; corrections should come from IMS and be
applied deliberately.

`data/alloy-index.ts` carries the same categories without the composition values, so
client components can browse and search without downloading the tables.

---

## Architecture notes

**Server-first.** Every page is a server component and statically rendered. Client
components are limited to the five places that need interactivity: the header/mega menu,
the mobile drawer, search, the filters on the materials/streams/table views, and the
inquiry form.

**Bundle discipline.** The composition tables never reach the browser as JavaScript. The
search index is loaded on demand when search is opened, not on first paint. Shared JS is
102 kB; content pages are 111–113 kB first load.

**Redirects.** Every legacy URL is 301-redirected in a single hop, including the trailing
slash form that WordPress actually published. `skipTrailingSlashRedirect` is enabled so
those rules run before Next's own normaliser — see the comment in `next.config.ts`.

---

## Verification performed

| Check | Result |
| --- | --- |
| Alloy data vs. crawled source | 295 grades, 3,245 cells, **0 mismatches** |
| Internal links and assets | 33 pages, 43 assets, **0 broken** |
| Legacy URL redirects | All 301, single hop, with and without trailing slash |
| SEO (title/description length, canonical, OG, single H1, JSON-LD) | **0 issues** across 15 page types |
| Accessibility (alt text, labels, landmarks, heading order, table semantics, skip link) | **0 issues** |
| Horizontal overflow | **None** at 360 / 390 / 414 / 768 / 1024 / 1440 px |
| WCAG AA contrast | All text and UI tokens pass |
| Inquiry API | Validation, allowlist, honeypot, rate limit, malformed input all behave correctly |
| TypeScript | `tsc --noEmit` clean |
| Scroll reveals | All fire on scroll; all content visible with JavaScript disabled and in print |

---

## Before launch

1. Configure an inquiry transport (see Configuration).
2. Resolve the P1 items in [`docs/content-verification.md`](docs/content-verification.md):
   the years-of-experience contradiction and the placeholder telephone number.
3. Set `NEXT_PUBLIC_SITE_URL` if deploying anywhere other than the production domain.
4. Submit the new sitemap in Search Console and keep the legacy URLs crawlable so the
   301s are picked up.
