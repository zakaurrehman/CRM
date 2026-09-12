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
