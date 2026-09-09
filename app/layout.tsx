import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { CompareTray } from "@/components/materials/CompareTray";
import { I18nProvider } from "@/lib/i18n/provider";
import { LOCALE_STORAGE_KEY, localeMeta } from "@/lib/i18n/config";
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

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "IMS Metals & Alloys | Metals, Alloys & Recovery for Global Industry",
    template: "%s | IMS Metals & Alloys",
  },
  description: site.description,
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

export const viewport: Viewport = {
  themeColor: "#0A142E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* Marks the document as script-enabled before first paint, so the
            scroll-reveal hidden state only ever applies where JavaScript can
            actually undo it. Without this, a no-JS visitor would meet blank
            sections. Kept inline and tiny so it never blocks meaningfully. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        {/* Applies the stored language's direction before the first paint, so a
            Hebrew reader never sees the layout render left-to-right and then
            flip. The words settle on hydration; the layout never moves. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});if(!l)return;var m=${JSON.stringify(
              Object.fromEntries(Object.entries(localeMeta).map(([code, meta]) => [code, [meta.tag, meta.dir]])),
            )};var e=m[l];if(!e)return;var r=document.documentElement;r.lang=e[0];r.dir=e[1];}catch(_){}})()`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-brand-700 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <I18nProvider>
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
