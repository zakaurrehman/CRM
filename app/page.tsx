import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { Pillars } from "@/components/home/Pillars";
import { MaterialsIndex } from "@/components/home/MaterialsIndex";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { RecyclingStory } from "@/components/home/RecyclingStory";
import { QualityBand } from "@/components/home/QualityBand";
import { TrustSection } from "@/components/home/TrustSection";
import { InsightsSection } from "@/components/home/InsightsSection";
import { CtaSection } from "@/components/shared/CtaSection";
import { pageMetadata } from "@/lib/seo";
import { alloyCategoryTeasers, totalGradeCount } from "@/data/alloy-index";

export const metadata: Metadata = pageMetadata({
  title: "Metals, Alloys & Recycling Solutions for Global Industry",
  description:
    "Specialist alloys and metal recovery for aerospace, oil & gas, industrial gas turbine and stainless steel. Sorted, certified and returned to the melt.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStrip />
      <Pillars />
      <MaterialsIndex categories={alloyCategoryTeasers} totalGrades={totalGradeCount} />
      <IndustriesSection />
      <RecyclingStory />
      <QualityBand />
      <TrustSection />
      <InsightsSection />
      <CtaSection secondary={{ href: "/materials", label: "Explore materials" }} />
    </>
  );
}
