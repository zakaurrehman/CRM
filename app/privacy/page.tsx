import type { Metadata } from "next";
import Link from "next/link";
import { getP } from "@/lib/i18n/server";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/ui/Section";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { contact, dataProtection, registration, routes } from "@/lib/site";
import { ATTACHMENT_LIMITS, formatBytes } from "@/lib/rfq";
import { LOCALE_COOKIE } from "@/lib/i18n/config";

const trail = [
  { name: "Home", href: "/" },
  { name: "Privacy policy", href: routes.privacy },
];

export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return pageMetadata({
    title: p("Privacy policy"),
    description: p("How IMS Metals & Alloys OÜ handles the personal and commercial information sent through this website, including uploaded files, and the one cookie the site sets."),
    path: routes.privacy,
  });
}

/**
 * What the site collects and what happens to it, in plain terms. Written to
 * be true of this site as built: three forms that send email, one essential
 * cookie, browser storage that never leaves the browser, no analytics. If
 * any of that changes, this page changes with it.
 */
export default async function PrivacyPage() {
  const p = await getP();
  const address = `${contact.address.street}, ${contact.address.postalCode} ${contact.address.city}, ${contact.address.country}`;

  return (
    <>
      <PageHero
        eyebrow={p("Legal")}
        title={p("Privacy policy")}
        intro={p("What this website collects, why, who sees it, and how long it is kept. Dated 14 September 2026.")}
        trail={trail}
      />

      <Section tone="white">
        <div className="prose-ims max-w-prose">
          <h2>{p("Who is responsible")}</h2>
          <p>
            {p("The controller for personal data collected through this website is {controller}, registry code {code}, {address}.", {
              controller: dataProtection.controller,
              code: registration.number,
              address,
            })}{" "}
            {p("For anything concerning your data, write to")}{" "}
            <a href={"mailto:" + dataProtection.email}>{dataProtection.email}</a>.
          </p>

          <h2>{p("What we collect")}</h2>
          <p>
            {p("When you offer material, request supply or send a message, we collect what you enter: your name, company and email address; your telephone number and location if you give them; the materials, quantities, forms, analyses and specifications you describe; your message; and any files you attach.")}
          </p>
          <p>
            {p("Our hosting provider records the technical data any web server records — IP address, browser type, the pages requested and when — in server logs, which are used for security and to keep the site running.")}
          </p>

          <h2>{p("Why, and on what basis")}</h2>
          <p>
            {p("We use this information to assess the material or requirement, to reply to you, and to conduct any commercial discussion that follows. The legal basis is taking steps at your request before entering into a contract (GDPR Article 6(1)(b)) and, for keeping records of business correspondence, our legitimate interest in running the business (Article 6(1)(f)).")}
          </p>
          <p>{p("We do not use it for marketing, and we do not sell or rent it.")}</p>

          <h2>{p("Uploaded files")}</h2>
          <p>
            {p("Files you attach to an offer or request — analyses, certificates, photographs, packing lists, specifications, inspection reports — are sent to us with your inquiry as email attachments, up to {n} files and {size} in total. Photographs may be reduced in size in your browser before sending. The website itself keeps no copy of them. They are used only to assess the material or requirement.", {
              n: ATTACHMENT_LIMITS.maxFiles,
              size: formatBytes(ATTACHMENT_LIMITS.maxTotalBytes),
            })}
          </p>

          <h2>{p("Who sees it")}</h2>
          <p>
            {p("Your inquiry is read by IMS. Where assessing a material requires it, we may share its technical details — the analysis, photographs and description of the material, not your personal details unless a transaction needs them — with specialist processing facilities and laboratories in our network.")}
          </p>
          <p>
            {p("Our email and hosting providers process data on our behalf as processors. Some may be outside the European Economic Area; where that is so, transfers are made under the safeguards the GDPR provides, such as standard contractual clauses.")}
          </p>

          <h2>{p("How long we keep it")}</h2>
          <p>
            {p("We keep inquiries and their attachments for as long as needed to respond and to conduct any business that results, and thereafter for as long as Estonian accounting and commercial law require records of business correspondence to be kept.")}
          </p>

          <h2>{p("Cookies and browser storage")}</h2>
          <p>
            {p("This site sets one cookie, {cookie}, which records the language you chose so that pages are served in it. It is essential to that function, is set only when you choose a language, and expires after a year.", { cookie: LOCALE_COOKIE })}
          </p>
          <p>
            {p("The site also keeps your language, the grades you compare and the materials you save in your browser's own storage. That data never leaves your browser and is not sent to us.")}
          </p>
          <p>
            {p("There are no analytics, advertising or third-party tracking cookies, so no cookie consent is requested. The WhatsApp link opens WhatsApp, which has its own privacy policy.")}
          </p>

          <h2>{p("Your rights")}</h2>
          <p>
            {p("Under the GDPR you may ask for access to your personal data, its correction or erasure, restriction of its processing, objection to processing based on our legitimate interest, and portability. Write to")}{" "}
            <a href={"mailto:" + dataProtection.email}>{dataProtection.email}</a>.{" "}
            {p("You may also complain to the supervisory authority where you live, or in Estonia to the")}{" "}
            <a href={dataProtection.authority.url} target="_blank" rel="noopener noreferrer">{dataProtection.authority.name}</a>.
          </p>

          <h2>{p("Changes")}</h2>
          <p>
            {p("This policy is dated 14 September 2026 and will be updated here if our practices change.")}{" "}
            {p("Company details are on the legal information page:")}{" "}
            <Link href={routes.legal}>{p("Legal information")}</Link>.
          </p>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
