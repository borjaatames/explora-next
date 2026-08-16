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

const LAST_UPDATED_EN = "April 24, 2026";
const LAST_UPDATED_DE = "24. April 2026";

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

  const titulo =
    lang === "de" ? "Cookie-Richtlinie | ExploraSpain" : "Cookie Policy | ExploraSpain";
  const descripcion =
    lang === "de"
      ? "Informationen über die Verwendung von Cookies auf ExploraSpain, die verwendeten Cookie-Typen und wie du sie verwalten kannst."
      : "Information about the use of cookies on ExploraSpain, the types of cookies used, and how to manage them.";
  const ogDescripcion =
    lang === "de"
      ? "Auf ExploraSpain verwendete Cookies und wie du sie verwaltest."
      : "Cookies used on ExploraSpain and how to manage them.";

  return {
    title: titulo,
    description: descripcion,
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
      title: titulo,
      description: ogDescripcion,
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
  const esAleman = lang === "de";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";
  const pageUrl = `${siteUrl}${urlCookies(lang)}`;
  const homeUrl = `${siteUrl}${prefijoIdioma(lang) || "/"}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: esAleman ? "Startseite" : "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: esAleman ? "Cookie-Richtlinie" : "Cookie Policy",
        item: pageUrl,
      },
    ],
  };

  if (esAleman) {
    return (
      <main className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        <section className="bg-sky-500 text-white py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">
              Cookie-Richtlinie
            </h1>
            <p className="text-sky-50">Zuletzt aktualisiert: {LAST_UPDATED_DE}</p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
            <h2>1. Was Cookies sind</h2>
            <p>
              Ein Cookie ist eine kleine Textdatei, die eine Website beim
              Besuch in deinem Browser speichert. Cookies ermöglichen es der
              Website, Informationen über deinen Besuch zu speichern, etwa
              deine bevorzugte Sprache oder Nutzungsdaten, was die
              Nutzererfahrung verbessern und dem Betreiber helfen kann, zu
              verstehen, wie die Website genutzt wird.
            </p>
            <p>
              Diese Richtlinie erklärt, welche Cookies{" "}
              <strong>exploraspain.com</strong> verwendet, zu welchem Zweck
              und wie du sie verwalten kannst, gemäß Artikel 22.2 des
              spanischen Gesetzes 34/2002 (LSSI-CE) und dem Cookie-Leitfaden
              der{" "}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
              >
                spanischen Datenschutzbehörde (AEPD)
              </a>
              .
            </p>

            <h2>2. Cookie-Arten nach Zweck</h2>
            <ul>
              <li>
                <strong>Technische Cookies (unbedingt erforderlich)</strong>:
                ermöglichen grundlegende Funktionen der Website (Navigation,
                Zugriff auf Bereiche, Sicherheit). Erfordern keine
                Einwilligung.
              </li>
              <li>
                <strong>Analyse- oder Messungs-Cookies</strong>: ermöglichen
                die aggregierte Analyse des Nutzerverhaltens (besuchte
                Seiten, Verweildauer usw.), um die Website zu verbessern.
                Erfordern Einwilligung.
              </li>
              <li>
                <strong>Cookies für verhaltensbasierte Werbung</strong>:
                ermöglichen die Anzeige personalisierter Werbung basierend
                auf dem Nutzerprofil. Erfordern Einwilligung. Aktuell{" "}
                <strong>
                  verwendet diese Website keine Cookies für
                  verhaltensbasierte Werbung
                </strong>
                .
              </li>
            </ul>

            <h2>3. Auf dieser Website verwendete Cookies</h2>
            <p>
              Die aktuell von dieser Website verwendeten Cookies sind unten
              aufgeführt:
            </p>

            <div className="not-prose my-8 overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                      Cookie
                    </th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                      Typ
                    </th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                      Zweck
                    </th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                      Dauer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-mono text-xs">__vercel_live_token</td>
                    <td className="p-3">Technisch</td>
                    <td className="p-3">
                      Verwaltung von Deployment und Betrieb der Website
                      (Vercel).
                    </td>
                    <td className="p-3">Sitzung</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">
                      exploraspain_cookie_consent
                    </td>
                    <td className="p-3">Technisch</td>
                    <td className="p-3">
                      Speichert deine Entscheidung zur Cookie-Nutzung auf
                      dieser Website.
                    </td>
                    <td className="p-3">12 Monate</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-slate-600 italic">
              Diese Tabelle wird aktualisiert, sobald weitere Analyse- oder
              Messtools hinzugefügt werden. Sobald Google Analytics 4
              aktiviert wird, werden die entsprechenden Cookies (_ga,
              _ga_*) hinzugefügt und vor der Aktivierung wird eine
              vorherige Einwilligung eingeholt.
            </p>

            <h2>4. Cookies Dritter bei ausgehenden Links</h2>
            <p>
              Die Website enthält Links zu externen Plattformen (Viator,
              GetYourGuide oder andere). Wenn du auf diese Links klickst,
              wirst du zu deren Websites weitergeleitet, die eigene
              Cookies verwenden und ihre eigenen Datenschutz- und
              Cookie-Richtlinien anwenden. Der Betreiber dieser Website hat
              keine Kontrolle über die Cookie-Nutzung dieser Plattformen auf
              ihren eigenen Domains und übernimmt hierfür keine
              Verantwortung.
            </p>

            <h2>5. Wie du Cookies verwaltest</h2>
            <p>
              Du kannst die Verwendung von Cookies auf dieser Website über
              das Einwilligungsbanner, das bei deinem ersten Besuch
              erscheint, akzeptieren, ablehnen oder anpassen. Du kannst
              deine Entscheidung jederzeit ändern.
            </p>
            <p>
              Du kannst außerdem deinen Browser so konfigurieren, dass er
              Cookies akzeptiert, ablehnt oder löscht. Anleitungen für
              deinen Browser:
            </p>
            <ul>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647?hl=de"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/de/kb/verbesserter-schutz-vor-aktivitatenverfolgung-firefox-desktop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/de-de/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/de-de/microsoft-edge"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p>
              Bitte beachte, dass das Deaktivieren bestimmter Cookies die
              Funktionalität der Website beeinträchtigen kann.
            </p>

            <h2>6. Aktualisierungen dieser Richtlinie</h2>
            <p>
              Diese Cookie-Richtlinie kann aktualisiert werden, wenn sich
              die verwendeten Cookies oder die geltenden Vorschriften
              ändern. Es gilt stets die auf dieser Seite veröffentlichte
              Fassung, mit dem oben angegebenen Datum der letzten
              Aktualisierung.
            </p>

            <h2>7. Weitere Informationen</h2>
            <p>
              Bei Fragen zu dieser Cookie-Richtlinie schreib uns an{" "}
              <a href="mailto:contacto@exploraspain.com">
                contacto@exploraspain.com
              </a>{" "}
              oder über die <Link href="/contacto">Kontaktseite</Link>.
            </p>
            <p>
              Weitere Informationen darüber, wie deine personenbezogenen
              Daten verarbeitet werden, findest du in der{" "}
              <Link href={`/${lang}/privacy`}>Datenschutzerklärung</Link>.
            </p>
          </div>

          <aside
            className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
            aria-label="Hinweis zur Sprachversion"
          >
            <p className="font-semibold text-slate-900 mb-2">
              Hinweis zur Sprachversion
            </p>
            <p>
              Diese deutsche Fassung dient ausschließlich der Orientierung
              für nicht spanischsprachige Nutzer. Rechtsverbindlich ist
              allein die spanische Originalfassung dieses Dokuments. Bei
              Abweichungen oder Widersprüchen zwischen den Fassungen hat die
              spanische Version Vorrang. Die spanische Originalfassung ist
              verfügbar unter{" "}
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
              ← Zurück zur Startseite
            </Link>
          </div>
        </article>
      </main>
    );
  }

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
          <p className="text-sky-50">Last updated: {LAST_UPDATED_EN}</p>
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
