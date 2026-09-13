import { getP } from "@/lib/i18n/server";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/Button";
import { BlendingProgramme } from "@/components/shared/BlendingProgramme";

/**
 * What IMS does: the blending programme, in IMS's own sentence, and the
 * three steps it runs in. The words keep IMS where it is — developing and
 * managing the routes — and the processing with the network that does it.
 */
export async function WhatWeDo() {
  const p = await getP();

  return (
    <Section tone="white" id="what-we-do">
      <SectionHeader
        eyebrow={p("What we do")}
        title={p("A blending programme built around complex materials.")}
        description={p("Through our network of specialist processing facilities, IMS develops and manages tailored nickel-based blends for refiners, alloy producers and stainless steel mills — maximising recoverable metal content and reducing unnecessary downgrading.")}
        align="split"
        action={<ArrowLink href="/what-we-do">{p("How the programme works")}</ArrowLink>}
      />
      <div className="mt-10">
        <BlendingProgramme />
      </div>
    </Section>
  );
}
