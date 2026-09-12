import { getP } from "@/lib/i18n/server";
import { acceptedForms } from "@/data/portfolio";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The six forms IMS accepts, as a strip.
 *
 * Six words, set large. It replaces a grid of nineteen residue streams, each
 * with its own photograph and filter — the intro puts the whole answer in one
 * line, and so does this.
 */
export async function AcceptedForms({ heading = "Accepted forms" }: { heading?: string }) {
  const p = await getP();

  return (
    <section className="on-dark bg-navy-950 text-white">
      <Container>
        <div className="py-12 lg:py-14">
          <Reveal>
            <p className="eyebrow">{p(heading)}</p>
          </Reveal>
          <ul className="mt-6 grid grid-cols-2 border-t border-white/10 sm:grid-cols-3 lg:grid-cols-6">
            {acceptedForms.map((form, i) => (
              <Reveal
                as="li"
                key={form}
                delay={i * 60}
                className="border-b border-e border-white/10 px-4 py-5 sm:px-5 lg:py-6 [&:nth-child(2n)]:border-e-0 sm:[&:nth-child(2n)]:border-e sm:[&:nth-child(3n)]:border-e-0 lg:[&:nth-child(3n)]:border-e lg:last:border-e-0"
              >
                <span className="font-display text-lg font-semibold tracking-tight text-white lg:text-xl">
                  {p(form)}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
