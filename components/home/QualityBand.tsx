import Image from "next/image";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ProcessSteps } from "@/components/shared/ProcessSteps";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const controls = [
  {
    title: "Sample testing",
    body: "New samples are received and analysed before material is accepted against a specification.",
  },
  {
    title: "Feed-stock analysis",
    body: "Daily feed stock is tested so that what enters the process is a known quantity, not an assumption.",
  },
  {
    title: "Production monitoring",
    body: "The production line is analysed in progress, giving data back to every area of plant operations.",
  },
  {
    title: "Material traceability",
    body: "Material is tracked through sorting and processing so its origin and specification stay attached to it.",
  },
];

export function QualityBand() {
  return (
    <>
      {/* Header, then a full-width band of controls, then the note. The earlier
          two-column version pinned the copy in a sticky left column that ran
          taller than the cards beside it, leaving half a screen of dead space
          under them. This follows the same rhythm as every other section. */}
      <Section tone="white" id="quality">
        <SectionHeader
          eyebrow="Quality & compliance"
          title="A metallurgical laboratory at the centre of the operation."
          description={
            <>
              Whether it is receiving new samples, testing daily feed stock or analysing our production
              line, laboratory results provide essential data to all areas of plant operations. We work
              with customers to make sure material is well sampled and tested against their requirement.
            </>
          }
          align="split"
          action={<ArrowLink href="/about/quality-and-compliance">How we control quality</ArrowLink>}
        />

        <ul className="mt-14 grid grid-rule sm:grid-cols-2 lg:grid-cols-4">
          {controls.map((control, i) => (
            <Reveal as="li" key={control.title} delay={i * 70} className="bg-white p-6 lg:p-7">
              <h3 className="font-display text-base font-semibold text-navy-900">{control.title}</h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-steel-600">{control.body}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <figure className="relative hidden aspect-[16/9] overflow-hidden lg:col-span-7 lg:block lg:aspect-[21/9]">
            <Image
              src="/images/hero/hot-metal-plate.jpg"
              alt="Hot metal plate at a steel mill"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </figure>
          <div className="lg:col-span-5">
            <p className="content-en text-[0.9375rem] leading-relaxed text-steel-600">
              IMS is committed to a policy of continuously improving quality performance throughout the
              business, to ensure the highest standards of product and service are achieved.
            </p>
            <p className="mt-5 border-s-2 border-steel-300 ps-5 text-[0.875rem] leading-relaxed text-steel-600">
              Certification accompanies material supplied by IMS. Specific standards and scheme
              accreditations are confirmed per contract &mdash; ask us for the documentation that applies
              to your requirement.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted" id="process">
        <SectionHeader
          eyebrow="How IMS works"
          title="From arising to certified supply."
          description="Arisings are sorted, segregated, processed and certified, then sold to end customers around the world to be melted back into their parent alloys as either air-melt or vacuum grade products."
          align="split"
        />
        <div className="mt-14">
          <ProcessSteps />
        </div>
      </Section>
    </>
  );
}
