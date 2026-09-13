# scripts

One-off verification scripts, kept because the things they check are easy to break
silently and expensive to notice late.

Run with `npx tsx scripts/<name>.ts`.

| Script | Checks |
| --- | --- |
| `verify-parser.ts` | Every non-empty cell in the 295 published composition rows is accounted for by the parser in `lib/alloy-data.ts` — nothing is silently dropped — and that derived `Bal.` values reconstruct to ~100%. |
| `verify-ids.ts` | Grade ids are unique and well-formed. They key the comparison tray, saved materials and RFQ lines, so a collision would silently merge two alloys. |
| `verify-query.ts` | The finder's query parser against the real catalogue: constraints are ANDed not ORed, `cobalt free` excludes all Co-bearing grades, `contains X` finds elements that only appear in the Others column. |
| `verify-portfolio.ts` | The portfolio layer over the tables: every legacy category is claimed by a family or listed as reference, the Maraging split loses no grade, all 295 grade links land on a page that renders that grade, and search carries every family. |
| `verify-query2.ts` | The per-element thresholds derived from the catalogue's own distribution, and that a bare element name does not match everything. |
| `i18n-coverage.ts` | Which English strings the site uses, and which each language lacks or no longer needs. Unions a crawl trace, every literal passed to `p()`, and client-only strings (search results, form errors). |
| `i18n-crawl.mjs` | Visits every page in one language — sitemap plus the pages left out of it — so a traced server logs every key. |
| `og-card.mjs` | Renders `og-card.html` — the homepage opening at 1200×630 — to `public/images/og/site.jpg`, the share card every page points to. Run after changing the headline or the photograph. |
| `i18n-residue.mjs` | Lists English prose still showing on a translated page: text that never went through `p()`. Meaningful for ru and he. |

### Translation coverage

```bash
npx next build
I18N_TRACE=1 npx next start -p 3100 > trace.log &
node scripts/i18n-crawl.mjs http://localhost:3100 ru
npx tsx scripts/i18n-coverage.ts trace.log --out i18n-report

# then, for text that bypasses p() entirely:
node scripts/i18n-residue.mjs http://localhost:3100 ru   # no paths: every page the crawl visits
```

The trace logs each key once per server process, so restart the server between
runs. Keys are English, so one crawl in any language finds them all; the report
then compares that set against each language's table.
