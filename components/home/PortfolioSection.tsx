import { getP } from "@/lib/i18n/server";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { FerroAlloys } from "@/components/portfolio/FerroAlloys";
import { Intermediates } from "@/components/portfolio/Intermediates";

/**
 * The portfolio on the homepage: the twelve materials, then the ferro-alloys
 * and the intermediaries — the same three parts the Portfolio page opens with.
 */
export async function PortfolioSection() {
  const p = await getP();

  return (
    <Section tone="light" id="portfolio">
      <SectionHeader
        eyebrow={p("Our portfolio")}
        title={p("What we buy, blend and supply.")}
        description={p("The materials IMS handles, in the forms we accept. Open any one for what we take, the thresholds that apply, and the published compositions behind it.")}
        align="split"
        action={<Button href="/materials" variant="secondary">{p("Open the portfolio")}</Button>}
      />
      <div className="mt-14">
        <PortfolioGrid />
      </div>
      <div className="mt-16">
        <FerroAlloys />
      </div>
      <div className="mt-16">
        <Intermediates />
      </div>
    </Section>
  );
}
