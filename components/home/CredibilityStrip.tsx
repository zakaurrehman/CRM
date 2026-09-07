import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { alloyCategoryCount, totalGradeCount } from "@/data/alloy-index";
import { recoveryStreams } from "@/data/recovery";
import { companyFacts, experience } from "@/lib/site";

interface Fact {
  value: string;
  label: string;
  detail: string;
}

/**
 * Trust band.
 *
 * Every figure here is countable from IMS's own published catalogue, so nothing
 * needs a claim we cannot stand behind. The years-of-experience stat is only
 * rendered once `experience.years` is set in lib/site.ts — the legacy site
 * published two contradictory numbers and neither is asserted here.
 */
export function CredibilityStrip() {
  const facts: Fact[] = [
    ...(experience.verified && experience.years
      ? [
          {
            value: `${experience.years}+`,
            label: "Years in the metals industry",
            detail: "Trading from Eastern Europe into an international network",
          },
        ]
      : []),
    {
      value: String(totalGradeCount),
      label: "Alloy grades documented",
      detail: `Across ${alloyCategoryCount} material categories with full composition data`,
    },
    {
      value: String(recoveryStreams.length),
      label: "Recovery streams handled",
      detail: "From coarse solids to extremely fine metallic dusts and powders",
    },
    {
      value: String(companyFacts.specialistMetals.length),
      label: "Specialist metals",
      detail: "Nickel and cobalt through to hafnium, rhenium and precious metals",
    },
    {
      value: String(companyFacts.sectors.length),
      label: "Sectors supplied",
      detail: "Aerospace and energy through to medical and additive manufacturing",
    },
  ];

  return (
    <section className="border-b border-steel-200 bg-white">
      <Container>
        <dl className="grid gap-px bg-steel-200 sm:grid-cols-2 lg:grid-cols-4">
          {facts.slice(0, 4).map((fact, i) => (
            <Reveal key={fact.label} delay={i * 70} className="bg-white p-7 lg:p-8">
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                <span className="block font-display text-4xl font-bold tracking-tight text-brand-700 tabular-nums lg:text-5xl">
                  {fact.value}
                </span>
                <span className="mt-3 block font-display text-[0.9375rem] font-semibold text-navy-900">
                  {fact.label}
                </span>
                <span className="mt-1.5 block text-[0.8125rem] leading-relaxed text-steel-500">{fact.detail}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
