import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { SearchResults } from "./SearchResults";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Search",
  description: "Search alloy grades, material categories, recovery streams and pages across the IMS site.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Search"
        title="Search IMS"
        intro="Alloy grades, material categories, recovery streams and every page on the site."
        trail={[
          { name: "Home", href: "/" },
          { name: "Search", href: "/search" },
        ]}
      />
      <Section tone="white">
        <div className="max-w-3xl">
          <Suspense fallback={<p className="text-steel-500">Loading search…</p>}>
            <SearchResults />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
