import type { Metadata } from "next";
import Link from "next/link";
import { getP } from "@/lib/i18n/server";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact, registration, routes, site } from "@/lib/site";
import { compositionDisclaimer } from "@/lib/composition";

const trail = [
  { name: "Home", href: "/" },
  { name: "Legal information", href: routes.legal },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("Legal information"),
    description: p("Company details of IMS Metals & Alloys OÜ, and the terms on which the content of this website — including the composition tables — is provided."),
    path: routes.legal,
  });
}

/** The company behind the site, and what the site's content is and is not. */
export default async function LegalPage() {
  const p = await getP();

  return (
    <>
      <PageHero
        eyebrow={p("Legal")}
        title={p("Legal information")}
        intro={p("The company behind this website, and the terms on which its content is provided.")}
        trail={trail}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="prose-ims max-w-prose">
              <h2>{p("Content of this website")}</h2>
              <p>{p(compositionDisclaimer)}</p>
              <p>
                {p("The descriptions of materials, forms and thresholds on this website say what IMS routinely handles. They are not an undertaking to buy or supply any particular material. Submitting material or requesting supply through this website is an inquiry, not a contract; any purchase or sale is subject to IMS's assessment and to terms agreed in writing.")}
              </p>
              <p>
                {p("IMS takes care to keep this website accurate but gives no warranty that its content is complete or current, and accepts no liability for decisions taken on the basis of it.")}
              </p>

              <h2>{p("Trademarks")}</h2>
              <p>
                {p("Inconel, Hastelloy, Incoloy, Nimonic, Waspaloy, Stellite, Densalloy, Zircaloy and the other alloy designations on this website are the trademarks of their respective owners, used here to identify material only.")}
              </p>

              <h2>{p("Personal data")}</h2>
              <p>
                {p("How inquiries, uploaded files and the site's one cookie are handled is set out in the")}{" "}
                <Link href={routes.privacy}>{p("privacy policy")}</Link>.
              </p>

              <h2>{p("Governing law")}</h2>
              <p>{p("This website and any dispute relating to it are governed by the law of the Republic of Estonia.")}</p>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border-t-2 border-brand-700 bg-steel-50 p-6">
              <h2 className="label text-steel-500">{p("Company")}</h2>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-[0.8125rem] text-steel-500">{p("Registered entity")}</dt>
                  <dd className="mt-0.5 text-[0.9375rem] font-medium text-navy-900">{site.legalName}</dd>
                </div>
                <div>
                  <dt className="text-[0.8125rem] text-steel-500">{p("Registration no.")}</dt>
                  <dd className="mt-0.5 font-mono text-[0.9375rem] text-navy-900 tabular-nums">{registration.number}</dd>
                </div>
                <div>
                  <dt className="text-[0.8125rem] text-steel-500">EORI</dt>
                  <dd className="mt-0.5 font-mono text-[0.9375rem] text-navy-900 tabular-nums">{registration.eori}</dd>
                </div>
                <div>
                  <dt className="text-[0.8125rem] text-steel-500">{p("Registered office")}</dt>
                  <dd className="mt-0.5 text-[0.9375rem] text-navy-900">
                    {contact.address.street}
                    <br />
                    {contact.address.postalCode} {contact.address.city}
                    <br />
                    {contact.address.country}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.8125rem] text-steel-500">{p("Email")}</dt>
                  <dd className="mt-0.5">
                    <a href={"mailto:" + contact.email} className="text-[0.9375rem] text-navy-900 underline decoration-steel-300 underline-offset-4 hover:decoration-brand-700">
                      {contact.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
