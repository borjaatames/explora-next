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
  urlCookies,
  urlPrivacidad,
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
  const canonicalUrl = `${siteUrl}${urlCookies(lang)}`;
  const languages = hreflangAlternates((l) => urlCookies(l));

  return {
    title: "Cookie Policy | ExploraSpain",
    description:
      "Information about the use of cookies on ExploraSpain, the types of cookies used, and how to manage them.",
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
      title: "Cookie Policy | ExploraSpain",
      description:
        "Cookies used on ExploraSpain and how to manage them.",
    },
  };
}

export default function CookiesPage({
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
  const pageUrl = `${siteUrl}${urlCookies(lang)}`;
  const homeUrl = `${siteUrl}${prefijoIdioma(lang) || "/"}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cookie Policy",
        item: pageUrl,
      },
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
            Cookie Policy
          </h1>
          <p className="text-sky-50">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
          <h2>1. What cookies are</h2>
          <p>
            A cookie is a small text file that a website stores in your
            browser when you visit it. Cookies allow the site to remember
            information about your visit, such as your preferred language or
            browsing data, which can improve the user experience and help
            the owner understand how the site is used.
          </p>
          <p>
            This policy explains which cookies{" "}
            <strong>exploraspain.com</strong> uses, for what purpose, and
            how you can manage them, in compliance with article 22.2 of
            Spanish Law 34/2002 (LSSI-CE) and the Cookies Guide of the{" "}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spanish Data Protection Agency (AEPD)
            </a>
            .
          </p>

          <h2>2. Types of cookies by purpose</h2>
          <ul>
            <li>
              <strong>Technical cookies (strictly necessary)</strong>: enable
              basic site functionality (navigation, access to sections,
              security). Do not require consent.
            </li>
            <li>
              <strong>Analytics or measurement cookies</strong>: enable
              analyzing user behavior in aggregate (pages visited, time
              spent, etc.) to improve the site. Require consent.
            </li>
            <li>
              <strong>Behavioral advertising cookies</strong>: enable
              showing personalized ads based on user profile. Require
              consent. Currently{" "}
              <strong>
                this site does not use behavioral advertising cookies
              </strong>
              .
            </li>
          </ul>

          <h2>3. Cookies used on this site</h2>
          <p>
            The cookies currently used by this website are detailed below:
          </p>

          <div className="not-prose my-8 overflow-x-auto">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                    Cookie
                  </th>
                  <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                    Type
                  </th>
                  <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                    Purpose
                  </th>
                  <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-mono text-xs">__vercel_live_token</td>
                  <td className="p-3">Technical</td>
                  <td className="p-3">
                    Site deployment and operation management (Vercel).
                  </td>
                  <td className="p-3">Session</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">
                    exploraspain_cookie_consent
                  </td>
                  <td className="p-3">Technical</td>
                  <td className="p-3">
                    Remembers your choice regarding cookie use on this site.
                  </td>
                  <td className="p-3">12 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-600 italic">
            This table will be updated when additional analytics or
            measurement tools are added. When Google Analytics 4 is
            activated, the corresponding cookies (_ga, _ga_*) will be added
            and prior consent will be requested before activation.
          </p>

          <h2>4. Third-party cookies on outbound links</h2>
          <p>
            The site contains links to external platforms (Viator,
            GetYourGuide or others). When you click these links, you will be
            redirected to their websites, which use their own cookies and
            apply their own privacy and cookie policies. The owner of this
            site does not control or take responsibility for how these
            platforms use cookies on their own domains.
          </p>

          <h2>5. How to manage cookies</h2>
          <p>
            You can accept, reject or customize the use of cookies on this
            site through the consent banner that appears on your first
            visit. You can change your choice at any time.
          </p>
          <p>
            You can also configure your browser to accept, reject or delete
            cookies. See instructions for your browser:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647?hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
          <p>
            Note that disabling some cookies may affect the website&rsquo;s
            functionality.
          </p>

          <h2>6. Updates to this policy</h2>
          <p>
            This cookie policy may be updated if the cookies used or the
            applicable regulations change. The version in force will always
            be the one published on this page, with the last-updated date
            shown at the top.
          </p>

          <h2>7. More information</h2>
          <p>
            For inquiries about this cookie policy, write to us at{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>{" "}
            or through the <Link href="/contacto">contact page</Link>.
          </p>
          <p>
            For more information about how your personal data is processed,
            see the{" "}
            <Link href={`/${lang}/privacy`}>Privacy Policy</Link>.
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
              href="/cookies"
              className="text-sky-600 hover:text-sky-700 underline"
            >
              /cookies
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
