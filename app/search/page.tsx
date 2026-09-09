import { getP } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { SearchResults } from "./SearchResults";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Search"),
  description: p("Search alloy grades, material categories, recovery streams and pages across the IMS site."),
  path: "/search",
  noIndex: true,
});
}

export default async function SearchPage() {
  const p = await getP();
  return (
    <>
      <PageHero
        eyebrow={p("Search")}
        title={p("Search IMS")}
        intro={p("Alloy grades, material categories, recovery streams and every page on the site.")}
        trail={[
          { name: "Home", href: "/" },
          { name: "Search", href: "/search" },
        ]}
      />
      <Section tone="white">
        <div className="max-w-3xl">
          <Suspense fallback={<p className="text-steel-500">{p("Loading search…")}</p>}>
            <SearchResults />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
