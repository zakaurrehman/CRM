import { getP } from "@/lib/i18n/server";
import { acceptedForms } from "@/data/portfolio";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The eight forms IMS accepts, as a strip.
 *
 * Under it, folded away, what each form covers: the residue streams the
 * previous website listed one by one now sit under the form they are.
 * IMS's "see more" — the strip stays eight names at first glance, and a
 * reader who wants to know whether AOD dust counts can open it.
 */
export async function AcceptedForms({ heading = "Accepted forms" }: { heading?: string }) {
  const p = await getP();

  return (
    <section id="forms" className="on-dark bg-navy-950 text-white">
      <Container>
        <div className="py-9 lg:py-10">
          <Reveal>
            <p className="eyebrow">{p(heading)}</p>
          </Reveal>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-y border-white/10 py-5 lg:gap-x-12">
            {acceptedForms.map((form, i) => (
              <Reveal as="li" key={form.name} delay={i * 60}>
                <span className="font-display text-lg font-medium tracking-tight text-white lg:text-xl">
                  {p(form.name)}
                </span>
              </Reveal>
            ))}
          </ul>

          <details className="group/more mt-5">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-sm text-[0.875rem] font-medium text-steel-300 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
              <span className="group-open/more:hidden">{p("See what each form covers")}</span>
              <span className="hidden group-open/more:inline">{p("Hide")}</span>
              <svg viewBox="0 0 12 12" aria-hidden className="h-3 w-3 transition-transform group-open/more:rotate-180">
                <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <dl className="mt-5 grid gap-x-8 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              {acceptedForms.map((form) => (
                <div key={form.name}>
                  <dt className="label text-brand-300">{p(form.name)}</dt>
                  <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-steel-300">
                    {form.covers.map((c) => p(c)).join(" · ")}
                  </dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      </Container>
    </section>
  );
}
