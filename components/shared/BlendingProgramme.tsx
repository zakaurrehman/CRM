import { getP } from "@/lib/i18n/server";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * The blending programme as three steps: what comes in, what is developed
 * for it, where it goes. They are in sequence — a lot really does move left
 * to right through this — so the arrows between them carry meaning.
 *
 * The words are IMS's (14 September 2026). Note what they do not say: that
 * IMS transforms or processes the material itself. Materials are assessed,
 * routes are developed, materials are directed — the processing happens in
 * the network.
 */
const steps = [
  {
    title: "Complex materials in",
    body: "Mixed lots, off-spec alloys and difficult-to-place metal-bearing materials are assessed according to chemistry, form and condition.",
  },
  {
    title: "Blended for the melt",
    body: "Processing and blending routes are developed around the requirements of nickel refineries, alloy producers and stainless steel mills.",
  },
  {
    title: "Value preserved",
    body: "Materials are directed toward the most suitable metallurgical route, helping preserve valuable nickel and other recoverable metal units.",
  },
];

export async function BlendingProgramme({ tone = "light" }: { tone?: "light" | "dark" }) {
  const p = await getP();
  const dark = tone === "dark";

  return (
    <ol className="grid gap-8 lg:grid-cols-3 lg:gap-0">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 90} className="relative lg:px-8 lg:first:ps-0 lg:last:pe-0">
          {i > 0 ? (
            <span
              aria-hidden
              className={cn(
                "absolute start-0 top-1 hidden -translate-x-1/2 font-display text-2xl lg:block",
                dark ? "text-brand-300" : "text-brand-700",
              )}
            >
              <span className="dir-arrow">&rarr;</span>
            </span>
          ) : null}
          <p className={cn("font-mono text-[0.6875rem] tracking-[0.1em]", dark ? "text-steel-400" : "text-steel-500")}>
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className={cn("mt-2 font-display text-xl font-medium tracking-tight", dark ? "text-white" : "text-navy-900")}>
            {p(step.title)}
          </h3>
          <p className={cn("mt-3 max-w-sm text-[0.9375rem] leading-relaxed", dark ? "text-steel-300" : "text-steel-600")}>
            {p(step.body)}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}
