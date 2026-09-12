import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { alloyCategoryBySlug, alloyCategories } from "@/data/alloys";
import { portfolioFamilies } from "@/data/portfolio";
import { claimedCategorySlugs, familyBySlug, groupOf } from "@/lib/portfolio";
import { getLocale, getP } from "@/lib/i18n/server";
import { localiseCategory } from "@/lib/i18n/content";
import { FamilyPage, tablesFor } from "@/components/portfolio/FamilyPage";
import { ReferencePage } from "@/components/materials/ReferencePage";
import { pageMetadata } from "@/lib/seo";

interface Params {
  params: Promise<{ slug: string }>;
}

/**
 * One route, two kinds of page.
 *
 * A slug is either a portfolio family — the front of the section — or one of
 * the legacy composition tables the portfolio does not claim, kept at the URL
 * it always had. Legacy category slugs the portfolio does claim are not
 * served here at all: next.config.ts sends them to their family in one hop.
 */
export function generateStaticParams() {
  return [
    ...portfolioFamilies.map((f) => ({ slug: f.slug })),
    ...alloyCategories.filter((c) => !claimedCategorySlugs.has(c.slug)).map((c) => ({ slug: c.slug })),
  ];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getP();
  const locale = await getLocale();

  const family = familyBySlug.get(slug);
  if (family) {
    const grades = tablesFor(family, locale).reduce((n, t) => n + t.grades.length, 0);
    return pageMetadata({
      title: family.name,
      description: p("{name} — {accepts} {group}. {forms}", {
        name: family.name,
        accepts: family.accepts,
        group: p(groupOf(family).name),
        forms: grades > 0 ? p("{n} grades with published composition.", { n: grades }) : p("Solids, turnings, runnings, grindings, 3D powders and dusts."),
      }),
      path: "/materials/" + family.slug,
      image: family.images[0] ?? "/images/hero/turnings.jpg",
    });
  }

  const base = alloyCategoryBySlug.get(slug);
  if (!base || claimedCategorySlugs.has(slug)) return {};
  const category = localiseCategory(base, locale);
  return pageMetadata({
    title: category.name,
    description: p("{n} {name} grades with nominal chemical composition, kept for reference.", {
      n: category.grades.length,
      name: category.name.toLowerCase(),
    }),
    path: "/materials/" + category.slug,
    image: category.image,
  });
}

export default async function MaterialPage({ params }: Params) {
  const { slug } = await params;

  const family = familyBySlug.get(slug);
  if (family) return <FamilyPage family={family} />;

  const base = alloyCategoryBySlug.get(slug);
  if (!base || claimedCategorySlugs.has(slug)) notFound();
  const category = localiseCategory(base, await getLocale());
  return <ReferencePage category={category} />;
}
