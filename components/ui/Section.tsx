import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "light" | "muted" | "navy" | "white";

const tones: Record<Tone, string> = {
  white: "bg-white text-steel-800",
  light: "bg-steel-50 text-steel-800",
  muted: "bg-steel-100 text-steel-800",
  navy: "bg-navy-950 text-steel-200 on-dark",
};

/** Standard vertical rhythm band. `bleed` opts out of the container for full-width children. */
export function Section({
  tone = "white",
  className,
  id,
  bleed = false,
  children,
}: {
  tone?: Tone;
  className?: string;
  id?: string;
  bleed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-18 sm:py-22 lg:py-30", tones[tone], className)}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}

/**
 * Section heading block. `align="split"` puts the description beside the title
 * on wide screens, which keeps long editorial intros off a single narrow column.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "split";
  action?: React.ReactNode;
  className?: string;
}) {
  if (align === "split") {
    return (
      <div className={cn("grid gap-8 lg:grid-cols-12 lg:gap-16", className)}>
        <div className="lg:col-span-6">
          {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
          <h2 className="text-display-md">{title}</h2>
        </div>
        {(description || action) && (
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-2">
            {description ? <div className="text-lg leading-relaxed opacity-80">{description}</div> : null}
            {action ? <div className="mt-7">{action}</div> : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 className="text-display-md">{title}</h2>
      {description ? (
        <div className={cn("mt-5 text-lg leading-relaxed opacity-80", align === "left" && "max-w-2xl")}>
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
