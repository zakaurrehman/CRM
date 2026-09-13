/**
 * Visit every page of a running site in one language.
 *
 * Paired with a server started with I18N_TRACE=1, this makes the server log
 * every phrase key the pages ask for — the input to scripts/i18n-coverage.ts.
 * Pages come from the sitemap, plus the few deliberately left out of it.
 *
 * Usage: node scripts/i18n-crawl.mjs <baseUrl> [locale=ru] [--list]
 *   --list  print the paths only (scripts/i18n-residue.mjs uses this)
 */
const args = process.argv.slice(2);
const listOnly = args.includes("--list");
const [base, locale = "ru"] = args.filter((a) => a !== "--list");
if (!base) {
  console.error("usage: node scripts/i18n-crawl.mjs <baseUrl> [locale] [--list]");
  process.exit(2);
}

/* Not in the sitemap on purpose, but real pages with real copy. The last one
   renders the not-found page. */
const EXTRAS = [
  "/materials/saved",
  "/search?q=titanium",
  "/rfq",
  "/rfq?direction=sell",
  "/rfq?direction=buy",
  "/this-page-does-not-exist",
];

const xml = await (await fetch(base + "/sitemap.xml")).text();
/* The sitemap carries the production origin; only the path is wanted — with
   its query, which is what tells the offer form from the supply form. */
const fromSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const u = new URL(m[1].replace(/&amp;/g, "&"));
  return u.pathname + u.search;
});
const paths = [...new Set([...fromSitemap, ...EXTRAS])];

if (listOnly) {
  console.log(paths.join(" "));
} else {
  let failed = 0;
  for (const path of paths) {
    const res = await fetch(base + path, { headers: { cookie: `ims_locale=${locale}` } });
    await res.text();
    if (res.status >= 500) {
      failed++;
      console.log(`${res.status} ${path}`);
    }
  }
  console.log(`${locale}: crawled ${paths.length} pages, ${failed} server error(s)`);
}
