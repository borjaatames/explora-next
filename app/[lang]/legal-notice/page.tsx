import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_LOCALE,
  esIdiomaActivo,
} from "@/lib/i18n/config";
import {
  hreflangAlternates,
  urlAvisoLegal,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const LAST_UPDATED = "April 24, 2026";

export function generateStaticParams(): Array<{ lang: Idioma }> {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") {
    return {};
  }

  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";
  const canonicalUrl = `${siteUrl}${urlAvisoLegal(lang)}`;
  const languages = hreflangAlternates((l) => urlAvisoLegal(l));

  return {
    title: "Legal Notice | ExploraSpain",
    description:
      "Legal information about the owner of the ExploraSpain website, in compliance with Spanish Law 34/2002 (LSSI-CE).",
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: { index: allowIndexing, follow: allowIndexing },
    },
    openGraph: {
      type: "website",
      locale: IDIOMA_LOCALE[lang],
      url: canonicalUrl,
      siteName: "ExploraSpain",
      title: "Legal Notice | ExploraSpain",
      description:
        "Legal information about the owner of ExploraSpain.",
    },
  };
}

export default function LegalNoticePage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";
  const pageUrl = `${siteUrl}${urlAvisoLegal(lang)}`;
  const homeUrl = `${siteUrl}${prefijoIdioma(lang) || "/"}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      { "@type": "ListItem", position: 2, name: "Legal Notice", item: pageUrl },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">
            Legal Notice
          </h1>
          <p className="text-sky-50">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
          <h2>1. Owner identification</h2>
          <p>
            In compliance with Spanish Law 34/2002, of July 11, on Information
            Society Services and Electronic Commerce (LSSI-CE), the following
            information about the owner of this website is provided:
          </p>
          <ul>
            <li>
              <strong>Owner</strong>: SKYWARD PARTNERS, S.L.
            </li>
            <li>
              <strong>Tax ID (NIF)</strong>: B26629576
            </li>
            <li>
              <strong>Registered office</strong>: Calle Castelló 117, 28006
              Madrid, Spain
            </li>
            <li>
              <strong>Email</strong>: contacto@exploraspain.com
            </li>
            <li>
              <strong>Website</strong>: https://exploraspain.com
            </li>
            <li>
              <strong>Activity</strong>: sale of tours and tourism activities
              in Spain and publication of editorial content about travel and
              tourism, including affiliate links to third-party platforms.
            </li>
          </ul>

          <h2>2. Purpose and scope</h2>
          <p>
            This legal notice governs the use of the website{" "}
            <strong>exploraspain.com</strong> (hereinafter, &ldquo;the
            website&rdquo;), made available by the owner to provide
            informational and editorial content about traveling in Spain, sell
            tours and tourism activities, and link to third-party tourism
            products and services.
          </p>
          <p>
            Access to and use of the website confers user status and implies
            full acceptance of the terms set out in this legal notice, as well
            as of the <Link href={`/${lang}/privacy`}>Privacy Policy</Link> and{" "}
            <Link href={`/${lang}/cookies`}>Cookie Policy</Link>.
          </p>

          <h2>3. Terms of use</h2>
          <p>
            The user agrees to use the website lawfully and appropriately, in
            accordance with applicable law, this legal notice, public morals
            and public order.
          </p>
          <p>The following are prohibited:</p>
          <ul>
            <li>
              Using the website for unlawful purposes or in ways that may harm
              the interests of the owner or third parties.
            </li>
            <li>
              Introducing computer viruses, defective files or any other
              program that may damage the website or the systems of the owner
              or third parties.
            </li>
            <li>
              Engaging in abusive use of the website, such as mass scraping,
              automated data collection or unauthorized reproduction of
              content.
            </li>
            <li>
              Impersonating the owner or any other user.
            </li>
          </ul>

          <h2>4. Intellectual and industrial property</h2>
          <p>
            All website content (text, images, graphics, design, source code,
            logos, trademarks and other elements) is owned by SKYWARD
            PARTNERS, S.L. or by third parties who have authorized its use,
            and is protected by Spanish and international intellectual and
            industrial property law.
          </p>
          <p>
            Reproduction, distribution, public communication, transformation
            or any other form of exploitation of the content is expressly
            prohibited without prior and express authorization from the owner,
            except for the user&rsquo;s personal and private use.
          </p>
          <p>
            Brief quotations from the content are permitted for informational
            or educational purposes, provided that the source is cited and the
            original website is linked.
          </p>

          <h2>5. Affiliate and third-party links</h2>
          <p>
            The website includes links to third-party platforms, including
            affiliate links (for example, to Viator, GetYourGuide or similar).
            When a user makes a purchase or booking through these links, the
            owner may receive a commission, at no additional cost to the user.
          </p>
          <p>
            The owner is not responsible for the content, business practices,
            privacy policies or terms of use of linked websites. Access to
            these sites is at the user&rsquo;s own risk.
          </p>

          <h2>6. Disclaimer of warranties and liability</h2>
          <p>
            The owner makes its best efforts to ensure that the information
            published on the website is accurate, up-to-date and of high
            quality. However, the owner does not warrant the accuracy,
            completeness or timeliness of all information, particularly with
            respect to prices, opening hours, availability or terms of
            third-party products and services.
          </p>
          <p>
            The user accepts that the published information is provided for
            guidance only and should be verified through official sources
            before making travel or booking decisions. The owner is not liable
            for any damages or losses arising from the use of the information
            on the website.
          </p>
          <p>
            The owner does not guarantee continuous availability of the
            website and reserves the right to suspend, interrupt or modify
            access to it for technical, maintenance or any other justified
            reasons.
          </p>

          <h2>7. Modification of the legal notice</h2>
          <p>
            The owner reserves the right to modify this legal notice at any
            time, in order to adapt it to legislative, operational or other
            changes. The version in force will always be the one published on
            this page.
          </p>

          <h2>8. Applicable law and jurisdiction</h2>
          <p>
            This legal notice is governed by Spanish law. Any dispute arising
            from access to or use of the website shall be submitted to the
            courts and tribunals of the owner&rsquo;s domicile, unless
            applicable law provides otherwise based on the user&rsquo;s
            consumer status.
          </p>

          <h2>9. Contact</h2>
          <p>
            For any questions regarding this legal notice, please contact us
            through the <Link href="/contacto">contact page</Link> or by
            writing to{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>
            .
          </p>
        </div>

        {/* Cláusula prevails — caja gris fuera del prose */}
        <aside
          className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
          aria-label="Language version disclaimer"
        >
          <p className="font-semibold text-slate-900 mb-2">
            Language version disclaimer
          </p>
          <p>
            This English version is provided solely for the convenience of
            non-Spanish-speaking users. The original Spanish version of this
            document is the legally binding one. In case of any discrepancy
            or conflict between the two versions, the Spanish version shall
            prevail. The original Spanish version is available at{" "}
            <Link
              href="/aviso-legal"
              className="text-sky-600 hover:text-sky-700 underline"
            >
              /aviso-legal
            </Link>
            .
          </p>
        </aside>

        <div className="mt-12 text-center">
          <Link
            href={`/${lang}`}
            className="text-sky-600 hover:text-sky-700 font-semibold"
          >
            ← Back to home
          </Link>
        </div>
      </article>
    </main>
  );
}
