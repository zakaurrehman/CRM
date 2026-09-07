import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, articleBySlug, articlesByDate } from "@/data/insights";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaSection } from "@/components/shared/CtaSection";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug.get(slug);
  if (!article) return {};

  return pageMetadata({
    title: article.title,
    description: article.description,
    path: "/insights/" + article.slug,
    image: article.image,
    type: "article",
    publishedTime: article.published,
    titleAbsolute: true,
  });
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = articleBySlug.get(slug);
  if (!article) notFound();

  const trail = [
    { name: "Home", href: "/" },
    { name: "Insights", href: "/insights" },
    { name: article.title, href: "/insights/" + article.slug },
  ];

  const more = articlesByDate.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <article>
        <header className="border-b border-steel-200 bg-steel-50">
          <Container>
            <div className="py-12 sm:py-16">
              <Breadcrumbs trail={trail} />
              <div className="mt-8 max-w-3xl">
                <p className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
                  <time dateTime={article.published}>{formatDate(article.published)}</time>
                  <span aria-hidden className="h-px w-6 bg-steel-300" />
                  <span>{article.readingMinutes} min read</span>
                </p>
                <h1 className="mt-5 text-display-lg">{article.title}</h1>
                <p className="mt-6 text-lg leading-relaxed text-steel-600 sm:text-xl">{article.standfirst}</p>
              </div>
            </div>
          </Container>
        </header>

        <Container>
          <figure className="relative -mt-px aspect-[16/9] overflow-hidden bg-steel-100 sm:aspect-[21/9]">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </figure>
        </Container>

        <Container>
          <div className="grid gap-12 py-14 sm:py-18 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7 lg:col-start-2">
              <div className="prose-ims max-w-prose">
                {article.body.map((block, i) => {
                  if (block.type === "h2") {
                    return <h2 key={i}>{block.text}</h2>;
                  }
                  if (block.type === "ul") {
                    return (
                      <ul key={i}>
                        {block.items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i}>{block.text}</p>;
                })}
              </div>
            </div>

            <aside className="lg:col-span-3 lg:col-start-10">
              <div className="lg:sticky lg:top-28">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
                  Talk to IMS
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-steel-600">
                  If this touches on a material requirement of your own, our team can tell you what we can
                  supply or recover.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex h-11 items-center rounded bg-brand-700 px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-brand-800"
                >
                  Request an inquiry
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </article>

      {more.length > 0 ? (
        <Section tone="light">
          <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
            More insights
          </h2>
          <ul className="mt-8 grid gap-px bg-steel-200 sm:grid-cols-2">
            {more.map((item) => (
              <li key={item.slug} className="bg-white">
                <Link href={"/insights/" + item.slug} className="group flex h-full flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden bg-steel-100">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-swift group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <time
                      dateTime={item.published}
                      className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500"
                    >
                      {formatDate(item.published)}
                    </time>
                    <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaSection secondary={{ href: "/insights", label: "All insights" }} />

      <JsonLd data={[breadcrumbSchema(trail), articleSchema(article)]} />
    </>
  );
}
