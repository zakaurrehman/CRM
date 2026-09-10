import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Inter, Orbitron } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { CompareTray } from "@/components/materials/CompareTray";
import { I18nProvider } from "@/lib/i18n/provider";
import { dirOf, localeMeta } from "@/lib/i18n/config";
import { getLocale, getP } from "@/lib/i18n/server";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/schema";
import { navigation } from "@/lib/navigation";
import { site } from "@/lib/site";
import "./globals.css";

/* Self-hosted and subset by next/font: no render-blocking request to a third party,
   and `display: swap` keeps text visible during the swap period. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["600", "700"],
});

/*
 * Stand-in for Ethnocentric, the face the original site sets its headings in.
 * Ethnocentric is a paid commercial typeface and IMS has not confirmed a web
 * licence, so it cannot be self-hosted here; Orbitron is the nearest free
 * equivalent in the same wide, squared, technical vein. Used for the welcome
 * lockup only, which is what was asked for.
 *
 * Latin only. It has no Hebrew glyphs, so the Hebrew page falls through to the
 * display stack, which is correct rather than a gap.
 */
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-lockup",
  display: "swap",
  weight: ["600", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

/*
 * Generated rather than static so the default title and description follow the
 * selected language. Every page sets its own, so these surface mainly on
 * not-found and error routes — which are exactly the pages a visitor is most
 * likely to hit in the wrong language if this were left in English.
 */
export async function generateMetadata(): Promise<Metadata> {
  const p = await getP();
  return {
  metadataBase: new URL(site.url),
  title: {
    default: p("IMS Metals & Alloys | Metals, Alloys & Recovery for Global Industry"),
    template: "%s | IMS Metals & Alloys",
  },
  description: p(site.description),
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  };
}

export const viewport: Viewport = {
  themeColor: "#0A142E",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  /* Resolved on the server from the request, so the markup arrives in the right
     language and direction. Nothing flips after hydration. */
  const locale = await getLocale();
  const p = await getP();

  return (
    <html
      lang={localeMeta[locale].tag}
      dir={dirOf(locale)}
      className={`${inter.variable} ${archivo.variable} ${orbitron.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {/* Marks the document as script-enabled before first paint, so the
            scroll-reveal hidden state only ever applies where JavaScript can
            actually undo it. Without this, a no-JS visitor would meet blank
            sections. Kept inline and tiny so it never blocks meaningfully. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-brand-700 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
        >
          {p("Skip to content")}
        </a>
        <I18nProvider initialLocale={locale}>
          <Header items={navigation} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <CompareTray />
        </I18nProvider>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
