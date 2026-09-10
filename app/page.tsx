import type { Metadata } from "next";
import { MarketBoard } from "@/components/market/MarketBoard";
import { MarketTicker } from "@/components/market/MarketTicker";
import { Container } from "@/components/ui/Container";
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
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
import { getLocale, getP } from "@/lib/i18n/server";
import { localiseCategory } from "@/lib/i18n/content";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
  title: p("Metals, Alloys & Recycling Solutions for Global Industry"),
  description:
    p("Specialist alloys and metal recovery for aerospace, oil & gas, industrial gas turbine and stainless steel. Sorted, certified and returned to the melt."),
  path: "/",
});
}

export default async function HomePage() {
  const locale = await getLocale();
  const teasers = alloyCategoryTeasers.map((c) => localiseCategory(c, locale));
  const p = await getP();

  return (
    <>
      {/* The two scrolling bars sit directly under the header, where IMS asked
          for them: metals above, currency rates below in a lighter tone so they
          read as two feeds rather than one long run of numbers. Each renders
          nothing when its feed is empty. The board further down carries the
          same numbers at rest, for a reader who would rather not chase them. */}
      <MarketTicker feed="metals" tone="dark" />
      <MarketTicker feed="rates" tone="light" />
      <WelcomeBanner />

      {/* Between the welcome band and the hero: prominent without pushing the
          headline below the fold. Renders nothing when neither feed has data. */}
      <div className="on-dark border-b border-white/10 bg-navy-950">
        <Container>
          <MarketBoard className="py-10 lg:py-12" />
        </Container>
      </div>
      <Hero />
      <CredibilityStrip />
      <Pillars />
      <MaterialsIndex categories={teasers} totalGrades={totalGradeCount} />
      <IndustriesSection />
      <RecyclingStory />
      <QualityBand />
      <TrustSection />
      <InsightsSection />
      <CtaSection secondary={{ href: "/materials", label: p("Explore materials") }} />
    </>
  );
}
