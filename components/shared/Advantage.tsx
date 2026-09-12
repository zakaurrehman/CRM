import { getP } from "@/lib/i18n/server";
import { advantages } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Our Advantage", the intro's five lines.
 *
 * Each is one sentence and they are not a sequence, so there are no numbers
 * and no bodies invented to pad them out — a ruled list in display type, in
 * the order IMS wrote them.
 */
export async function Advantage({ tone = "light" }: { tone?: "light" | "white" }) {
  const p = await getP();

  return (
    <Section tone={tone} id="advantage">
      <SectionHeader
        eyebrow={p("Our advantage")}
        title={p("Why refiners and alloy producers work with IMS.")}
        align="split"
      />
      <ul className="mt-12 border-t border-steel-200">
        {advantages.map((line, i) => (
          <Reveal as="li" key={line} delay={i * 60} className="border-b border-steel-200 py-5 lg:py-6">
            <p className="max-w-3xl font-display text-lg font-semibold leading-snug tracking-tight text-navy-900 lg:text-xl">
              {p(line)}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
