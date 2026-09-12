import type { Metadata } from "next";
import { MarketBoard } from "@/components/market/MarketBoard";
import { Container } from "@/components/ui/Container";
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
import { Hero } from "@/components/home/Hero";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { PortfolioSection } from "@/components/home/PortfolioSection";
import { AcceptedForms } from "@/components/shared/AcceptedForms";
import { Advantage } from "@/components/shared/Advantage";
import { CtaSection } from "@/components/shared/CtaSection";
import { pageMetadata } from "@/lib/seo";
import { getP } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("Turning Complex Scrap into Opportunity"),
    description: p(
      "Specialised recycler and supplier to the nickel refinery, stainless steel, superalloy, titanium and refractory metals industries. Complex scrap streams blended into high-value Ni-based blends.",
    ),
    path: "/",
  });
}

/**
 * The homepage follows the company intro's five headings — who we are, what
 * we do, portfolio, accepted forms, our advantage — and nothing else. The
 * market strip and the welcome above them are as IMS approved them.
 */
export default async function HomePage() {
  const p = await getP();

  return (
    <>
      {/* Directly under the header, where IMS wants the numbers: a thin strip
          a reader passes over on the way in. Renders nothing when neither feed
          has data. */}
      <div className="on-dark border-b border-white/10 bg-navy-950">
        <Container>
          <MarketBoard className="py-4 lg:py-5" />
        </Container>
      </div>
      <WelcomeBanner />
      <Hero />
      <WhatWeDo />
      <PortfolioSection />
      <AcceptedForms />
      <Advantage tone="white" />
      <CtaSection secondary={{ href: "/materials", label: p("See our portfolio") }} />
    </>
  );
}
