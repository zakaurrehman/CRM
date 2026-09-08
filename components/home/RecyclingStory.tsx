import Image from "next/image";
import { recoveryStreams } from "@/data/recovery";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ArrowLink, Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

/**
 * Recovery and sustainability band.
 *
 * The stream photographs carry this section: they are the most distinctive
 * imagery IMS owns, and showing the actual material is more credible than any
 * sustainability stock photograph would be.
 */
export function RecyclingStory() {
  /* Fifteen fills three clean rows of five, which balances the column beside
     it. Ten left the grid ending well short of the image and quote, opening a
     half-screen hole on the left. */
  const featured = recoveryStreams.slice(0, 15);

  return (
    <Section tone="light">
      <SectionHeader
        eyebrow="Recycling & recovery"
        title="Metal that would have gone to landfill, returned to the melt."
        description="IMS recovers metal units from the residues of industrial processing — dusts, powders, filtercakes, scales and sludges — and puts them back into production. Recovered units replace metal that would otherwise come from primary mining."
        align="split"
        action={
          <div className="flex flex-wrap gap-3">
            <Button href="/recycling" variant="primary">
              Recovery capabilities
            </Button>
            <Button href="/about/sustainability" variant="secondary">
              Our environmental position
            </Button>
          </div>
        }
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
            Streams we treat
          </p>
          <ul className="mt-6 grid grid-cols-2 grid-rule sm:grid-cols-3 lg:grid-cols-5 [&>li:nth-child(n+11)]:hidden lg:[&>li:nth-child(n+11)]:block">
            {featured.map((stream, i) => (
              <Reveal as="li" key={stream.slug} delay={i * 40} className="bg-white">
                <div className="flex flex-col items-center px-2 py-4">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-steel-100">
                    <Image
                      src={stream.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="scale-[0.82] object-contain mix-blend-multiply"
                    />
                  </div>
                  <span className="mt-3 text-center text-[0.75rem] font-medium leading-tight text-steel-700">
                    {stream.name}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-[0.875rem] text-steel-600">
            {recoveryStreams.length} streams in total, from extremely fine metallic dusts to coarse turnings.{" "}
            <ArrowLink href="/recycling">See every stream</ArrowLink>
          </p>
        </div>

        <div className="lg:col-span-5">
          <ImageCarousel
            aspect="aspect-[4/3]"
            slides={[
              { src: "/images/company/recycling-operations.jpg", alt: "Sorted metal arisings being handled at a recycling operation", caption: "Arisings received and staged" },
              { src: "/images/company/claw-crane.jpg", alt: "Grab crane moving mixed metal scrap", caption: "Sorting and segregation" },
              { src: "/images/hero/hot-metal-plate.jpg", alt: "Hot metal plate at a steel mill", caption: "Back into the melt" },
              { src: "/images/company/port-terminal.jpg", alt: "Recovered metal at a port terminal", caption: "Supplied to customers worldwide" },
            ]}
          />
          <blockquote className="mt-6 border-l-2 border-brand-700 pl-5">
            <p className="text-[0.9375rem] leading-relaxed text-steel-700">
              Our recycling process enables us to revalorise thousands of tons of material destined for
              landfill every year. This not only reduces environmental impact and valuable landfill space,
              but replaces metal units originating from primary mining operations.
            </p>
            <footer className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
              IMS environmental position
            </footer>
          </blockquote>
        </div>
      </div>
    </Section>
  );
}
