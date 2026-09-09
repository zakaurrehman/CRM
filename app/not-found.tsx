import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getP } from "@/lib/i18n/server";

export default async function NotFound() {
  const p = await getP();
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col justify-center py-20">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 text-display-lg">{p("This page could not be found.")}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel-600">
          {p("The page may have moved during our site rebuild. Try the materials directory, or search for the alloy grade or stream you were looking for.")}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/materials"
            className="inline-flex h-12 items-center rounded bg-brand-700 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-brand-800"
          >
            {p("Materials directory")}
          </Link>
          <Link
            href="/search"
            className="inline-flex h-12 items-center rounded border border-steel-300 bg-white px-6 text-[0.9375rem] font-medium text-navy-900 transition-colors hover:border-brand-700 hover:text-brand-700"
          >
            {p("Search the site")}
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center rounded px-6 text-[0.9375rem] font-medium text-navy-900 transition-colors hover:bg-steel-100"
          >
            {p("Contact IMS")}
          </Link>
        </div>
      </div>
    </Container>
  );
}
