import { getP } from "@/lib/i18n/server";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { alloyCategoryCount, totalGradeCount } from "@/data/alloy-index";
import { recoveryStreams } from "@/data/recovery";
import { companyFacts, site, contact } from "@/lib/site";

/**
 * Credibility band.
 *
 * Every figure is countable from what IMS actually publishes — grades in the
 * catalogue, streams handled, metals traded, sectors supplied — so each one can
 * be checked by clicking through to the page it came from. That link is the
 * point: a statistic a reader can verify is worth more than a bigger one they
 * cannot.
 *
 * There is deliberately no certification row. IMS has not supplied evidence of
 * any accreditation, and the brief is explicit that certifications are not to be
 * invented. An ISO badge nobody can produce a certificate for is worse than no
 * badge at all — it is the first thing a serious buyer checks. What is shown
 * instead is the quality practice IMS does describe in its own material, which
 * is defensible. See docs/content-verification.md item 7.
 */

/**
 * Drawn from IMS's own published copy — the metallurgical laboratory, the
 * sort/segregate/certify workflow, the international network that began in
 * Eastern Europe, the landfill diversion. This absorbed the separate "Why IMS"
 * band, which made the same argument one section later on the same navy ground.
 */
const practices = [
  {
    title: "Specification, not approximation",
    body: "Aerospace, oil & gas and turbine work leave no room for a grade that is nearly right. Material is identified and segregated so it returns to the melt as the alloy it actually is.",
    href: "/about/quality-and-compliance",
  },
  {
    title: "Metallurgical laboratory",
    body: "Sample testing on receipt, daily feed-stock analysis and in-progress production monitoring. Certification travels with the material.",
    href: "/about/quality-and-compliance",
  },
  {
    title: "Processing others turn away",
    body: "Extremely fine dusts, filtercakes, sludges and mixed tungsten forms are routine here. Difficult streams are the work, not the exception.",
    href: "/recycling",
  },
  {
    title: "An international network",
    body: "Routes that began in Eastern Europe now run internationally, alongside joint partnerships with several of the largest companies in the sector.",
    href: "/about",
  },
  {
    title: "Published composition",
    body: "Nominal chemistry for all {count} grades is on the site — not behind a login or a sales call.",
    href: "/materials",
  },
  {
    title: "Landfill turned back into metal",
    body: "Recovery diverts material from disposal and replaces metal units that would otherwise come from primary mining.",
    href: "/about/sustainability",
  },
];

export async function TrustSection() {
  const p = await getP();

  const stats = [
    {
      value: totalGradeCount,
      label: "Alloy grades published",
      detail: "Full nominal composition across {count} categories",
      href: "/materials",
    },
    {
      value: recoveryStreams.length,
      label: "Recovery streams handled",
      detail: "Fine metallic dusts and powders through to coarse solids",
      href: "/recycling",
    },
    {
      value: companyFacts.specialistMetals.length,
      label: "Specialist metals traded",
      detail: "Nickel and cobalt through to hafnium, rhenium and tungsten",
      href: "/materials",
    },
    {
      value: companyFacts.sectors.length,
      label: "Sectors supplied",
      detail: "Aerospace and energy through to medical and additive manufacturing",
      href: "/industries",
    },
  ];

  return (
    <Section tone="navy" id="credibility">
      <SectionHeader
        eyebrow={p("Why buyers work with IMS")}
        title={p("Everything on this page can be checked.")}
        description={p("No unverifiable claims and no rounded-up numbers — each figure below is countable from the catalogue itself, and links to where it comes from.")}
        align="split"
        /* Headings default to navy-900, which is invisible on a navy ground —
           the same override every dark section carries. */
        className="[&_h2]:text-white"
      />

      <dl className="mt-14 grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={p(stat.label)} delay={i * 70} className="bg-navy-950">
            <Link
              href={stat.href}
              className="group flex h-full flex-col p-7 transition-colors hover:bg-navy-900 lg:p-8"
            >
              <dt className="sr-only">{p(stat.label)}</dt>
              <dd>
                <CountUp
                  value={stat.value}
                  className="block font-display text-4xl font-bold tracking-tight text-brand-300 tabular-nums lg:text-5xl"
                />
                <span className="mt-3 block font-display text-[0.9375rem] font-semibold text-white">
                  {p(stat.label)}
                </span>
                <span className="mt-1.5 block text-[0.8125rem] leading-relaxed text-steel-400">{p(stat.detail, { count: alloyCategoryCount })}</span>
                <span
                  aria-hidden
                  className="mt-4 block text-[0.8125rem] font-medium text-brand-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  {p("See for yourself")} <span className="dir-arrow">&rarr;</span>
                </span>
              </dd>
            </Link>
          </Reveal>
        ))}
      </dl>

      <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h3 className="font-display text-xl font-semibold text-white">{p("How material is controlled")}</h3>
          <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {practices.map((practice, i) => (
              <Reveal as="li" key={p(practice.title)} delay={i * 60}>
                <Link href={practice.href} className="group block">
                  <h4 className="font-display text-[0.9375rem] font-semibold text-white transition-colors group-hover:text-brand-300">
                    {p(practice.title)}
                  </h4>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-steel-400">{p(practice.body, { count: totalGradeCount })}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={120} className="lg:col-span-5">
          <div className="rounded-lg border border-white/15 bg-white/5 p-7">
            <h3 className="font-display text-xl font-semibold text-white">{p("The company")}</h3>
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-300">
                  {p("Registered entity")}
                </dt>
                <dd className="mt-1 text-[0.9375rem] text-white">{site.legalName}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-300">
                  {p("Registered office")}
                </dt>
                <dd className="mt-1 text-[0.9375rem] text-white">
                  {contact.address.city}, {contact.address.country}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-300">
                  {p("Material output")}
                </dt>
                <dd className="mt-1 text-[0.9375rem] text-white">
                  {p("{grades} material returned to the melt", { grades: companyFacts.outputGrades.join(p(" and ")) })}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-300">
                  {p("Direct contact")}
                </dt>
                <dd className="mt-1">
                  <a
                    href={"mailto:" + contact.email}
                    className="text-[0.9375rem] text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
