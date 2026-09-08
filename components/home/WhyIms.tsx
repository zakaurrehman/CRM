import Image from "next/image";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";

/**
 * The "why us" argument the previous site carried on its homepage.
 *
 * Each point is drawn from IMS's own published copy — the international network
 * that began in Eastern Europe, the sort/segregate/certify workflow, the
 * metallurgical laboratory, the landfill diversion — rewritten out of the
 * keyword-stuffed original. Nothing here asserts anything the audit could not
 * substantiate.
 */
const reasons = [
  {
    title: "Specification, not approximation",
    body: "Aerospace, oil & gas and turbine production leave no room for a grade that is nearly right. Material is identified and segregated so it returns to the melt as the alloy it actually is.",
  },
  {
    title: "An international network",
    body: "Routes that began in Eastern Europe now run internationally, alongside joint partnerships with several of the largest companies in the sector.",
  },
  {
    title: "Processing others turn away",
    body: "Extremely fine dusts, filtercakes, sludges and mixed tungsten forms are routine here. Difficult streams are the work, not the exception.",
  },
  {
    title: "Certified before it ships",
    body: "Our metallurgical laboratory tests incoming samples, daily feed stock and the production line itself. Certification travels with the material.",
  },
  {
    title: "Landfill turned back into metal",
    body: "Recovery diverts thousands of tons a year from disposal and replaces metal that would otherwise come from primary mining.",
  },
];

export function WhyIms() {
  return (
    <Section tone="navy">
      <SectionHeader
        eyebrow="Why IMS"
        title="Five reasons buyers and producers keep coming back."
        description="We work both directions of the same chain — supplying prime alloy and recovering it at end of life. That is what keeps the grade knowledge sharp."
        align="split"
        className="[&_h2]:text-white"
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <ol className="lg:col-span-7">
          {reasons.map((reason, i) => (
            <Reveal as="li" key={reason.title} delay={i * 70} className="border-t border-white/12 py-6 first:border-t-0 first:pt-0">
              <div className="flex gap-5">
                <span className="mt-1 shrink-0 font-mono text-[0.75rem] text-brand-300 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-white">{reason.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel-400">{reason.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="hidden lg:col-span-5 lg:block">
          <figure className="relative aspect-[3/4] overflow-hidden rounded-md">
            <Image
              src="/images/company/scrap-yard.jpg"
              alt="Sorted metal arisings staged for processing"
              fill
              sizes="(min-width: 1024px) 34vw, 0px"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
          </figure>
          <p className="mt-6 text-[0.9375rem] leading-relaxed text-steel-400">
            Tell us the alloy, the stream or the volume and we will come back with a route for it.
          </p>
          <div className="mt-4">
            <ArrowLink href="/about" tone="light">
              More about IMS
            </ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
