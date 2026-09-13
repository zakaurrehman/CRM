import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

/**
 * Interior page header.
 *
 * Every interior page opens on the same dark band (IMS, 14 September 2026),
 * with a photograph faintly behind it where one is given and plain where
 * not. `tone="light"` is kept for a page that has a reason to open light;
 * none does at present.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  trail,
  image,
  imageAlt = "",
  align = "left",
  tone,
  mark,
  children,
}: {
  eyebrow?: string;
  title: string;
  /** Rendered beside the title — the material symbol on a portfolio page. */
  mark?: React.ReactNode;
  intro?: React.ReactNode;
  trail: Crumb[];
  image?: string;
  imageAlt?: string;
  align?: "left" | "wide";
  /** The band is dark by default; "light" opts out. */
  tone?: "dark" | "light";
  children?: React.ReactNode;
}) {
  const dark = tone !== "light";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        dark ? "on-dark bg-navy-950 text-white" : "border-b border-steel-200 bg-steel-50",
      )}
    >
      {dark ? (
        <>
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="-z-10 object-cover opacity-[0.28]"
            />
          ) : null}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950 via-navy-950/85 to-brand-950/70"
          />
          <div aria-hidden className="tech-grid absolute inset-0 -z-10 opacity-60" />
        </>
      ) : null}

      <Container>
        {/* The extra height is for a photograph; a plain band stays slim. */}
        <div className={cn("py-8 sm:py-10 lg:py-12", image && "sm:py-12 lg:py-16")}>
          <Breadcrumbs trail={trail} tone={dark ? "dark" : "light"} />
          <div className={cn("mt-5", align === "left" ? "max-w-3xl" : "max-w-4xl")}>
            {eyebrow ? (
              <p className={cn("eyebrow mb-4 animate-fade-up", dark && "text-brand-300")}>{eyebrow}</p>
            ) : null}
            {mark ? (
              <div className="flex animate-fade-up items-center gap-5 [animation-delay:70ms]">
                {mark}
                <h1 className={cn("text-display-lg", dark && "text-white")}>{title}</h1>
              </div>
            ) : (
              <h1 className={cn("animate-fade-up text-display-lg [animation-delay:70ms]", dark && "text-white")}>{title}</h1>
            )}
            {intro ? (
              <div
                className={cn(
                  "mt-5 animate-fade-up text-lg leading-relaxed [animation-delay:140ms] sm:text-xl",
                  dark ? "text-steel-300" : "text-steel-600",
                )}
              >
                {intro}
              </div>
            ) : null}
            {children ? <div className="mt-7 animate-fade-up [animation-delay:210ms]">{children}</div> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
