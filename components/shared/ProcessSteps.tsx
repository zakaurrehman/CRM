import { processSteps } from "@/data/recovery";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * The six-step workflow, drawn as a connected track rather than six loose cards
 * so the sequence itself is legible. The connector is decorative and hidden from
 * assistive technology; the list markup carries the real order.
 */
export function ProcessSteps({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {processSteps.map((step, i) => (
        <Reveal as="li" key={step.number} delay={i * 60} className="relative">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "font-mono text-sm font-medium tabular-nums",
                dark ? "text-brand-300" : "text-brand-700",
              )}
            >
              {step.number}
            </span>
            <span
              aria-hidden
              className={cn("h-px flex-1", dark ? "bg-white/15" : "bg-steel-200")}
            />
          </div>
          <h3
            className={cn(
              "mt-5 font-display text-xl font-semibold tracking-tight",
              dark ? "text-white" : "text-navy-900",
            )}
          >
            {step.title}
          </h3>
          <p className={cn("mt-3 text-[0.9375rem] leading-relaxed", dark ? "text-steel-400" : "text-steel-600")}>
            {step.body}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}
