/**
 * Extracts the translatable prose out of the data files into a content pack.
 *
 * Written rather than retyped so the English wording is byte-identical to what
 * ships today, and so the 295-grade composition database is never touched — only
 * the descriptive fields around it are lifted.
 */
import fs from "node:fs";
import { alloyCategories } from "@/data/alloys";
import { industries } from "@/data/industries";
import { recoveryStreams, tungstenForms, processSteps } from "@/data/recovery";
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
  industries: Object.fromEntries(
    industries.map((i) => [i.slug, {
      name: i.name,
      strapline: i.strapline,
      intro: i.intro,
      capabilities: i.capabilities.map((c) => ({ title: c.title, body: c.body })),
    }]),
  ),
  streams: Object.fromEntries(recoveryStreams.map((s) => [s.slug, { name: s.name, form: s.form }])),
  tungstenForms: Object.fromEntries(tungstenForms.map((t) => [t.slug, { name: t.name, note: t.note }])),
  process: Object.fromEntries(processSteps.map((s) => [s.number, { title: s.title, body: s.body }])),
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
  industries: Object.keys(pack.industries).length,
  streams: Object.keys(pack.streams).length,
  tungstenForms: Object.keys(pack.tungstenForms).length,
  process: Object.keys(pack.process).length,
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
