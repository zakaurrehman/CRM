import { getP } from "@/lib/i18n/server";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/Button";
import { BlendingProgram } from "@/components/shared/BlendingProgram";

/**
 * What IMS does. The one section the site did not have: the blending
 * program, in the intro's own sentence, and the three beats it runs in.
 */
export async function WhatWeDo() {
  const p = await getP();

  return (
    <Section tone="white" id="what-we-do">
      <SectionHeader
        eyebrow={p("What we do")}
        title={p("A blending program built around complex scrap.")}
        description={p("Through our specialised blending program, we transform complex scrap streams into high-value Ni-based blends — maximising recoverable metal content and reducing downgrading.")}
        align="split"
        action={<ArrowLink href="/what-we-do">{p("How the program works")}</ArrowLink>}
      />
      <div className="mt-14">
        <BlendingProgram />
      </div>
    </Section>
  );
}
