import { getP } from "@/lib/i18n/server";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

/** The portfolio on the homepage: the same grid the Portfolio page opens with. */
export async function PortfolioSection() {
  const p = await getP();

  return (
    <Section tone="light" id="portfolio">
      <SectionHeader
        eyebrow={p("Our portfolio")}
        title={p("What we buy, blend and supply.")}
        description={p("The material families IMS handles, in the forms we accept. Open any family for what we take, the thresholds that apply, and the published compositions behind it.")}
        align="split"
        action={<Button href="/materials" variant="secondary">{p("Open the portfolio")}</Button>}
      />
      <div className="mt-14">
        <PortfolioGrid />
      </div>
    </Section>
  );
}
