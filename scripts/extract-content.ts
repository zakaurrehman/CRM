/**
 * Extracts the translatable prose out of the data files into a content pack.
 *
 * Written rather than retyped so the English wording is byte-identical to what
 * ships today, and so the 295-grade composition database is never touched — only
 * the descriptive fields around it are lifted.
 */
import fs from "node:fs";
import { alloyCategories } from "@/data/alloys";
import { tungstenForms } from "@/data/recovery";
import { articles } from "@/data/insights";

const pack = {
  categories: Object.fromEntries(
    alloyCategories.map((c) => [c.slug, {
      name: c.name,
      summary: c.summary,
      properties: c.properties,
      applications: c.applications,
    }]),
  ),
  tungstenForms: Object.fromEntries(tungstenForms.map((t) => [t.slug, { name: t.name, note: t.note }])),
  articles: Object.fromEntries(
    articles.map((a) => [a.slug, {
      title: a.title,
      standfirst: a.standfirst,
      description: a.description,
      body: a.body.map((b) => (b.type === "ul" ? { type: "ul", items: b.items } : { type: b.type, text: b.text })),
    }]),
  ),
};

const counts = {
  categories: Object.keys(pack.categories).length,
  tungstenForms: Object.keys(pack.tungstenForms).length,
  articles: Object.keys(pack.articles).length,
};
console.log("extracted:", JSON.stringify(counts));

const words = JSON.stringify(pack).split(/\s+/).length;
console.log("approx words:", words);

fs.writeFileSync(
  "C:/Users/hp/AppData/Local/Temp/claude/c--Users-hp-Desktop-ims-metal/e82c5337-a451-4917-9e9f-0436a5f21781/scratchpad/content-en.json",
  JSON.stringify(pack, null, 2),
);
console.log("written to content-en.json");
