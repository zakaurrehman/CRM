import { getP } from "@/lib/i18n/server";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * The blending program as three beats: what comes in, what IMS does, what
 * goes out. They are in sequence — a stream really does move left to right
 * through this — so the arrows between them carry meaning.
 *
 * The words are the intro's. "Off-spec", "off-grade", "downgrading" and
 * "recoverable metal content" are its terms, and they are the ones a refiner
 * or a stainless mill uses.
 */
const beats = [
  {
    title: "Complex streams in",
    body: "Off-spec grades, mixed lots and off-grade refractory units — the material that is hard to place as it stands.",
  },
  {
    title: "Blended to the melt",
    body: "Tailored blends for refiners, alloy producers and the stainless-steel sector, built to preserve nickel value.",
  },
  {
    title: "More recovered, less downgraded",
    body: "Maximising recoverable metal content and reducing downgrading.",
  },
];

export async function BlendingProgram({ tone = "light" }: { tone?: "light" | "dark" }) {
  const p = await getP();
  const dark = tone === "dark";

  return (
    <ol className="grid gap-8 lg:grid-cols-3 lg:gap-0">
      {beats.map((beat, i) => (
        <Reveal as="li" key={beat.title} delay={i * 90} className="relative lg:px-8 lg:first:ps-0 lg:last:pe-0">
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
          <h3 className={cn("font-display text-xl font-semibold tracking-tight", dark ? "text-white" : "text-navy-900")}>
            {p(beat.title)}
          </h3>
          <p className={cn("mt-3 max-w-sm text-[0.9375rem] leading-relaxed", dark ? "text-steel-300" : "text-steel-600")}>
            {p(beat.body)}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}
