import type { Metadata } from "next";
import { MarketBoard } from "@/components/market/MarketBoard";
import { isMetalsConfigured } from "@/lib/market/metals";
import { Container } from "@/components/ui/Container";
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
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
      "IMS specialises in complex high-nickel, superalloy, titanium and refractory materials. Through our international processing network, we develop tailored recovery and supply routes that preserve valuable metal content and reduce unnecessary downgrading.",
    ),
    path: "/",
  });
}

/**
 * The homepage: the positioning and the two commercial routes. The company
 * intro's headings — what we do, portfolio, accepted forms, our advantage —
 * and nothing else; the operating model is told on What we do and About.
 */
export default async function HomePage() {
  return (
    <>
      {/* Metal prices, directly under the header. The FX rates that shared
          this strip are off, on IMS's word (13 September 2026): they served
          IMS-Tech, not IMS's buyers. The band renders only when a metals feed
          is configured, decided here on the server — so with no key there is
          no strip at all, rather than a loading skeleton that collapses to an
          empty line on every visit. It returns as soon as METALS_API_KEY is
          set. */}
      {isMetalsConfigured() ? (
        <div className="on-dark border-b border-white/10 bg-navy-950">
          <Container>
            <MarketBoard className="py-4 lg:py-5" />
          </Container>
        </div>
      ) : null}
      <WelcomeBanner />
      <WhatWeDo />
      <PortfolioSection />
      <AcceptedForms />
      <Advantage tone="white" />
      <CtaSection />
    </>
  );
}
