import { getP } from "@/lib/i18n/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { alloyCategoryCount, totalGradeCount } from "@/data/alloy-index";
import { recoveryStreams } from "@/data/recovery";
import { companyFacts, experience } from "@/lib/site";

interface Fact {
  value: number;
  suffix?: string;
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
export async function CredibilityStrip() {
  const p = await getP();

  const facts: Fact[] = [
    ...(experience.verified && experience.years
      ? [
          {
            value: experience.years,
            suffix: "+",
            label: "Years in the metals industry",
            detail: "Trading from Eastern Europe into an international network",
          },
        ]
      : []),
    {
      value: totalGradeCount,
      label: "Alloy grades documented",
      detail: p("Across {n} material categories with full composition data", { n: alloyCategoryCount }),
    },
    {
      value: recoveryStreams.length,
      label: "Recovery streams handled",
      detail: "From coarse solids to extremely fine metallic dusts and powders",
    },
    {
      value: companyFacts.specialistMetals.length,
      label: "Specialist metals",
      detail: "Nickel and cobalt through to hafnium, rhenium and precious metals",
    },
    {
      value: companyFacts.sectors.length,
      label: "Sectors supplied",
      detail: "Aerospace and energy through to medical and additive manufacturing",
    },
  ];

  return (
    <section className="border-b border-steel-200 bg-white">
      <Container>
        <dl className="grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
          {facts.slice(0, 4).map((fact, i) => (
            <Reveal key={p(fact.label)} delay={i * 70} className="bg-white p-7 lg:p-8">
              <dt className="sr-only">{p(fact.label)}</dt>
              <dd>
                <CountUp
                  value={fact.value}
                  suffix={fact.suffix}
                  className="block font-display text-4xl font-bold tracking-tight text-brand-700 tabular-nums lg:text-5xl"
                />
                <span className="mt-3 block font-display text-[0.9375rem] font-semibold text-navy-900">
                  {p(fact.label)}
                </span>
                <span className="mt-1.5 block text-[0.8125rem] leading-relaxed text-steel-500">{p(fact.detail)}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
