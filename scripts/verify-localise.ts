import { alloyCategorySummaries } from "@/data/alloy-index";
import { industries } from "@/data/industries";
import { localiseCategory, localiseIndustry, contentFor } from "@/lib/i18n/content";

const c = alloyCategorySummaries[0];
console.log("base slug     :", c.slug);
console.log("base name     :", c.name);
console.log("pack has slug :", Boolean(contentFor("ru").categories[c.slug]));
console.log("pack name     :", contentFor("ru").categories[c.slug]?.name);
const ru = localiseCategory(c, "ru");
console.log("localised name:", ru.name);
console.log("localised summ:", ru.summary?.slice(0, 60));
console.log("grades intact :", ru.gradeCount, "grade names:", ru.gradeNames.length);

const i = localiseIndustry(industries[0], "fr");
console.log("\nindustry fr   :", i.name, "|", i.strapline?.slice(0, 40));
