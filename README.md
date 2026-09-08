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
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Server-side. Sends through an existing mailbox. Usually the quickest route. |
| `INQUIRY_WEBHOOK_URL` | Server-side. POSTs each inquiry as JSON to a CRM/Zapier/Make endpoint. |
| `RESEND_API_KEY` | Server-side. Sends via the Resend HTTP API. |
| `INQUIRY_TO_EMAIL` | Where enquiries land. Defaults to `info@ims-metals.com`. |
| `INQUIRY_FROM_EMAIL` | Address the notification is sent from. |

**The inquiry form needs one of the three transports above before launch.** Set it in
the Vercel project settings and redeploy — no code change is required.

Without one, the API returns a clear error and the form hands the visitor a **pre-filled
email** containing everything they typed, so an enquiry is never dropped and nobody has
to retype a long technical message. In development, submissions are logged to the server
console instead.

No credential reaches the browser. Delivery lives in `lib/inquiry-delivery.ts`, which is
kept separate from `lib/inquiry.ts` precisely so the client bundle never pulls in Node
built-ins. The SMTP path is verified end to end against a live SMTP server.

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
  inquiry.ts          Inquiry validation + options (shared with the client)
  inquiry-delivery.ts Delivery transports (server-only)
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

`lib/site.ts` is the single place that defines company facts. Two values are still
deliberately withheld, because the legacy site's versions were contradictory or
placeholder:

```ts
export const contact = { phone: null, /* email, address, whatsapp, social set */ };
export const experience = { years: null, verified: false };
```

Setting `phone` publishes it across the header, footer, contact page and Organization
schema. Setting `experience` to `{ years: 30, verified: true }` adds the years stat to the
homepage. Nothing else needs changing — no page hard-codes either value. See
`docs/content-verification.md` for why both are still empty.

Note that `phone` and `whatsapp` are separate on purpose: being reachable on WhatsApp is
a narrower commitment than publishing a number as the company's general telephone.

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

## Dependencies and security

Pinned to **Next 15.5.25** — the patched release on the 15.5 line. The original
15.5.4 carried a critical advisory (CVE-2025-66478). `sharp` is held at `^0.35.4`
through an `overrides` entry to clear the libvips CVEs; Next 15.5.25 declares
`^0.34.3 || ^0.35.4`, so this stays inside its supported range.

`npm audit` still reports **one high and one moderate** advisory. Both come from
the copy of `postcss` vendored inside Next, and both are only resolved by moving
to **Next 16.3.4**, a breaking major. That postcss runs at build time against our
own stylesheet — it never sees attacker-controlled input at runtime — so the
practical exposure here is low.

Upgrading to Next 16 is worth scheduling deliberately, with the QA suite re-run
against it. It is not a drop-in change and should not be done as part of a
content deployment.

### WhatsApp contact button

Live on every page, pointing at the number IMS supplied. It is a plain `wa.me`
link rather than the official widget script, so it ships no JavaScript, no
third-party tracking and needs no cookie consent. The number lives in
`lib/site.ts` as digits only, which is the format wa.me expects:

```ts
whatsapp: "972549070254",   // +972 54-907-0254
```

### `NEXT_PUBLIC_SITE_URL`

Next inlines `NEXT_PUBLIC_*` at build time and substitutes an **empty string**
when the variable is absent from the build environment — which is different from
it being `undefined` locally. `lib/site.ts` therefore normalises the value rather
than relying on `??`: empty, whitespace, a missing protocol or an unparseable
value all fall back to the production origin. Leaving the variable blank in a
deploy dashboard is safe.

---

## Multiple languages — deliberately not built

The site is English-only, which matches the legacy site and the working language
of the trade. A machine-translation widget was considered and rejected:

- The copy carries ~14 terms of art — *arisings, revert, air-melt, vacuum grade,
  mill scale, filtercake, swarf, AOD dust, EAF dust, Densalloy, CP-W, turnings,
  moly oxide, pelletizer*. Machine translation renders these literally or as
  nonsense, which reads as inexperience to the exact audience the site is for.
- 295 alloy grade designations (`Hastelloy C276`, `MAR M-509`, `Nimonic 80`)
  must never be altered. Translation layers sometimes transliterate them, and a
  wrong grade name in a specification context is a commercial problem.
- Client-side widgets produce no indexable pages and no `hreflang`, so they add
  nothing for buyers searching in another language — usually the actual goal.

**If it is revisited**, the version worth building is real i18n: locale routes
(`/ru/`, `/zh/`, `/de/`), `hreflang`, and professionally translated prose, with
the composition tables left untouched since they are numbers and element
symbols. Scope per language is roughly **15,700 words across 1,244 strings**.

Priority markets, per the business: **Russian** (the company's own history
begins with Eastern European routes), **Chinese (Simplified)** (tungsten and
refractory metals) and **German** (aerospace and IGT manufacturing).

---

## Before launch

1. Configure an inquiry transport (see Configuration).
2. Resolve the P1 items in [`docs/content-verification.md`](docs/content-verification.md):
   the years-of-experience contradiction and the placeholder telephone number.
3. Set `NEXT_PUBLIC_SITE_URL` if deploying anywhere other than the production domain.
4. Submit the new sitemap in Search Console and keep the legacy URLs crawlable so the
   301s are picked up.
