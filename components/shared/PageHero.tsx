import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

/**
 * Interior page header.
 *
 * Two treatments share one component so every non-home page opens with the same
 * rhythm: `image` gives a dark editorial band, `plain` a light typographic one.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  trail,
  image,
  imageAlt = "",
  align = "left",
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  trail: Crumb[];
  image?: string;
  imageAlt?: string;
  align?: "left" | "wide";
  children?: React.ReactNode;
}) {
  const dark = Boolean(image);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        dark ? "on-dark bg-navy-950 text-white" : "border-b border-steel-200 bg-steel-50",
      )}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover opacity-[0.28]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950 via-navy-950/85 to-brand-950/70"
          />
          <div aria-hidden className="tech-grid absolute inset-0 -z-10 opacity-60" />
        </>
      ) : null}

      <Container>
        <div className={cn("py-12 sm:py-16 lg:py-20", dark && "lg:py-24")}>
          <Breadcrumbs trail={trail} tone={dark ? "dark" : "light"} />
          <div className={cn("mt-8", align === "left" ? "max-w-3xl" : "max-w-4xl")}>
            {eyebrow ? (
              <p className={cn("eyebrow mb-4 animate-fade-up", dark && "text-brand-300")}>{eyebrow}</p>
            ) : null}
            <h1 className={cn("animate-fade-up text-display-lg [animation-delay:70ms]", dark && "text-white")}>{title}</h1>
            {intro ? (
              <div
                className={cn(
                  "mt-6 animate-fade-up text-lg leading-relaxed [animation-delay:140ms] sm:text-xl",
                  dark ? "text-steel-300" : "text-steel-600",
                )}
              >
                {intro}
              </div>
            ) : null}
            {children ? <div className="mt-9 animate-fade-up [animation-delay:210ms]">{children}</div> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
