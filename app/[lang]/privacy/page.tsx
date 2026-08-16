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
  const canonicalUrl = `${siteUrl}${urlPrivacidad(lang)}`;
  const languages = hreflangAlternates((l) => urlPrivacidad(l));

  const titulo =
    lang === "de"
      ? "Datenschutzerklärung | ExploraSpain"
      : "Privacy Policy | ExploraSpain";
  const descripcion =
    lang === "de"
      ? "Informationen darüber, wie ExploraSpain personenbezogene Daten verarbeitet, gemäß DSGVO (EU-Verordnung 2016/679) und dem spanischen Datenschutzgesetz (LOPDGDD)."
      : "Information about how ExploraSpain processes personal data, in compliance with the GDPR (EU Regulation 2016/679) and the Spanish Data Protection Act (LOPDGDD).";
  const ogDescripcion =
    lang === "de"
      ? "Wie ExploraSpain personenbezogene Daten verarbeitet, gemäß DSGVO und LOPDGDD."
      : "How ExploraSpain processes personal data, under GDPR and LOPDGDD.";

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

export default function PrivacyPage({
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
  const pageUrl = `${siteUrl}${urlPrivacidad(lang)}`;
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
        name: esAleman ? "Datenschutzerklärung" : "Privacy Policy",
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
              Datenschutzerklärung
            </h1>
            <p className="text-sky-50">Zuletzt aktualisiert: {LAST_UPDATED_DE}</p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
            <p className="text-xl leading-relaxed text-slate-700">
              Bei ExploraSpain nehmen wir deinen Datenschutz ernst. Diese
              Erklärung beschreibt, welche Daten wir verarbeiten, zu welchem
              Zweck und welche Rechte du hast, gemäß der DSGVO (EU-Verordnung
              2016/679) und dem spanischen Organgesetz 3/2018 zum Schutz
              personenbezogener Daten (LOPDGDD).
            </p>

            <h2>1. Verantwortlicher</h2>
            <ul>
              <li>
                <strong>Verantwortlicher</strong>: SKYWARD PARTNERS, S.L.
              </li>
              <li>
                <strong>Steuernummer (NIF)</strong>: B26629576
              </li>
              <li>
                <strong>Firmensitz</strong>: Calle Castelló 117, 28006
                Madrid, Spanien
              </li>
              <li>
                <strong>E-Mail</strong>: contacto@exploraspain.com
              </li>
              <li>
                <strong>Website</strong>: https://exploraspain.com
              </li>
            </ul>

            <h2>2. Welche Daten wir verarbeiten</h2>
            <p>
              Je nachdem, wie du mit der Website interagierst, verarbeiten
              wir möglicherweise folgende Daten:
            </p>
            <ul>
              <li>
                <strong>Kontaktdaten</strong>: Wenn du uns per E-Mail
                schreibst, verarbeiten wir die Daten, die du freiwillig
                angibst (Name, E-Mail, Nachrichteninhalt).
              </li>
              <li>
                <strong>Nutzungsdaten</strong>: Beim Besuch der Website
                werden technische Daten wie IP-Adresse, Browsertyp,
                Betriebssystem, besuchte Seiten, Verweildauer und Referrer
                erfasst, über Cookies und Analysetools, sofern du diese
                akzeptierst.
              </li>
            </ul>
            <p>
              <strong>
                Die Website bietet derzeit keine Benutzerregistrierung, kein
                Bestellformular und kein Newsletter-Abonnement an.
              </strong>{" "}
              Sollten diese Funktionen künftig hinzukommen, wird diese
              Erklärung entsprechend aktualisiert.
            </p>

            <h2>3. Zweck und Rechtsgrundlage der Verarbeitung</h2>
            <ul>
              <li>
                <strong>Beantwortung deiner Anfragen</strong>: Wenn du uns
                schreibst, verwenden wir deine E-Mail- und
                Nachrichtendaten ausschließlich, um zu antworten.
                Rechtsgrundlage: Einwilligung des Nutzers beim Senden der
                Nachricht.
              </li>
              <li>
                <strong>Nutzungsanalyse der Website</strong>: um zu
                verstehen, wie die Website genutzt wird, und den Inhalt zu
                verbessern. Rechtsgrundlage: über den Cookie-Banner erteilte
                Einwilligung.
              </li>
              <li>
                <strong>Erfüllung gesetzlicher Pflichten</strong>: zur
                Einhaltung geltender Vorschriften, sofern zutreffend.
                Rechtsgrundlage: gesetzliche Verpflichtung.
              </li>
            </ul>

            <h2>4. Aufbewahrungsdauer</h2>
            <p>
              Kontaktdaten werden so lange aufbewahrt, wie es zur
              Bearbeitung deiner Anfrage erforderlich ist, und danach für
              den gesetzlich vorgesehenen Zeitraum zur Abwehr möglicher
              Haftungsansprüche.
            </p>
            <p>
              Nutzungsdaten werden für den in der Cookie-Richtlinie für das
              jeweilige Tool festgelegten Zeitraum aufbewahrt.
            </p>

            <h2>5. Empfänger und internationale Datenübermittlungen</h2>
            <p>
              Deine Daten werden nicht an Dritte weitergegeben, außer wenn
              dies gesetzlich vorgeschrieben ist. Die Website nutzt jedoch
              Dienste von Anbietern, die als Auftragsverarbeiter Zugriff auf
              Nutzungsdaten haben können:
            </p>
            <ul>
              <li>
                <strong>Vercel Inc.</strong> (USA): Website-Hosting. Die
                Übermittlung ist durch die Standardvertragsklauseln der
                Europäischen Kommission abgedeckt.
              </li>
              <li>
                <strong>Google LLC</strong> (USA): Webanalyse, sofern du
                Analyse-Cookies akzeptierst. Die Übermittlung ist durch das
                EU-US Data Privacy Framework abgedeckt.
              </li>
              <li>
                <strong>Affiliate-Plattformen</strong> (Viator, GetYourGuide
                oder andere): Wenn du auf einen Affiliate-Link klickst,
                wirst du zu deren Website weitergeleitet, die ihre eigene
                Datenschutzerklärung anwendet.
              </li>
            </ul>

            <h2>6. Deine Rechte</h2>
            <p>
              Als betroffene Person hast du gemäß DSGVO und LOPDGDD
              folgende Rechte:
            </p>
            <ul>
              <li>
                <strong>Auskunft</strong>: zu erfahren, welche Daten wir
                über dich verarbeiten.
              </li>
              <li>
                <strong>Berichtigung</strong>: unrichtige oder
                unvollständige Daten korrigieren zu lassen.
              </li>
              <li>
                <strong>Löschung</strong> (&bdquo;Recht auf Vergessenwerden&ldquo;):
                zu verlangen, dass wir deine Daten löschen, wenn sie nicht
                mehr erforderlich sind.
              </li>
              <li>
                <strong>Widerspruch</strong>: bestimmten
                Verarbeitungstätigkeiten zu widersprechen.
              </li>
              <li>
                <strong>Einschränkung</strong>: uns zu bitten, die
                Verarbeitung in bestimmten Fällen einzuschränken.
              </li>
              <li>
                <strong>Datenübertragbarkeit</strong>: deine Daten in einem
                strukturierten Format zu erhalten und an einen anderen
                Verantwortlichen zu übertragen.
              </li>
              <li>
                <strong>Widerruf der Einwilligung</strong> jederzeit, ohne
                dass die Rechtmäßigkeit der bisherigen Verarbeitung berührt
                wird.
              </li>
            </ul>
            <p>
              Um diese Rechte auszuüben, schreib uns an{" "}
              <a href="mailto:contacto@exploraspain.com">
                contacto@exploraspain.com
              </a>{" "}
              und gib an, welches Recht du ausüben möchtest, gegebenenfalls
              mit einem Identitätsnachweis.
            </p>
            <p>
              Wenn du der Ansicht bist, dass die Verarbeitung deiner Daten
              nicht den Vorschriften entspricht, kannst du eine Beschwerde
              bei der{" "}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
              >
                spanischen Datenschutzbehörde (AEPD)
              </a>{" "}
              einreichen.
            </p>

            <h2>7. Sicherheitsmaßnahmen</h2>
            <p>
              Wir wenden angemessene technische und organisatorische
              Maßnahmen an, um deine Daten vor unbefugtem Zugriff, Verlust
              oder Zerstörung zu schützen. Die Website nutzt eine
              verschlüsselte Verbindung (HTTPS), und die beauftragten
              Dienste wenden branchenübliche Sicherheitsmaßnahmen an.
            </p>

            <h2>8. Änderungen dieser Erklärung</h2>
            <p>
              Diese Erklärung kann aktualisiert werden, um gesetzliche,
              betriebliche oder dienstleistungsbezogene Änderungen
              widerzuspiegeln. Es gilt stets die auf dieser Seite
              veröffentlichte Fassung, mit dem oben angegebenen Datum der
              letzten Aktualisierung.
            </p>

            <h2>9. Kontakt</h2>
            <p>
              Bei Fragen zum Datenschutz schreib uns an{" "}
              <a href="mailto:contacto@exploraspain.com">
                contacto@exploraspain.com
              </a>{" "}
              oder über die <Link href="/contacto">Kontaktseite</Link>.
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
                href="/privacidad"
                className="text-sky-600 hover:text-sky-700 underline"
              >
                /privacidad
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
            Privacy Policy
          </h1>
          <p className="text-sky-50">Last updated: {LAST_UPDATED_EN}</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
          <p className="text-xl leading-relaxed text-slate-700">
            At ExploraSpain we take your privacy seriously. This policy
            explains what data we process, for what purpose, and what rights
            you have, in compliance with the GDPR (EU Regulation 2016/679)
            and the Spanish Organic Law 3/2018 on Personal Data Protection
            (LOPDGDD).
          </p>

          <h2>1. Data controller</h2>
          <ul>
            <li>
              <strong>Controller</strong>: SKYWARD PARTNERS, S.L.
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
          </ul>

          <h2>2. What data we process</h2>
          <p>
            Depending on how you interact with the website, we may process
            the following data:
          </p>
          <ul>
            <li>
              <strong>Contact data</strong>: when you write to us by email,
              we process the data you choose to provide voluntarily (name,
              email, message content).
            </li>
            <li>
              <strong>Browsing data</strong>: when you visit the site,
              technical data is collected such as IP address, browser type,
              operating system, pages visited, time spent and referrer,
              through cookies and analytics tools, if you accept them.
            </li>
          </ul>
          <p>
            <strong>
              The website does not currently offer user registration, a
              checkout form or newsletter subscription.
            </strong>{" "}
            If these features are added in the future, this policy will be
            updated accordingly.
          </p>

          <h2>3. Purpose and legal basis for processing</h2>
          <ul>
            <li>
              <strong>Responding to your inquiries</strong>: when you write
              to us, we use your email and message data only to reply. Legal
              basis: user&rsquo;s consent when sending the message.
            </li>
            <li>
              <strong>Site usage analytics</strong>: to understand how the
              site is used and improve the content. Legal basis: consent
              given through the cookie banner.
            </li>
            <li>
              <strong>Compliance with legal obligations</strong>: to comply
              with applicable regulations where appropriate. Legal basis:
              legal obligation.
            </li>
          </ul>

          <h2>4. Retention period</h2>
          <p>
            Contact data is retained for as long as necessary to handle your
            inquiry and, afterwards, for the legal period applicable to
            address potential liabilities.
          </p>
          <p>
            Browsing data is retained for the period set out in the cookie
            policy for each tool.
          </p>

          <h2>5. Recipients and international transfers</h2>
          <p>
            Your data is not shared with third parties except where legally
            required. However, the website uses services from providers that
            may have access to browsing data as data processors:
          </p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong> (USA): website hosting. Transfer
              covered by the European Commission&rsquo;s Standard Contractual
              Clauses.
            </li>
            <li>
              <strong>Google LLC</strong> (USA): web analytics, if you accept
              analytics cookies. Transfer covered by the EU-U.S. Data Privacy
              Framework.
            </li>
            <li>
              <strong>Affiliate platforms</strong> (Viator, GetYourGuide or
              others): when you click an affiliate link, you will be
              redirected to their website, which applies its own privacy
              policy.
            </li>
          </ul>

          <h2>6. Your rights</h2>
          <p>
            As a data subject, you have the following rights, recognized by
            the GDPR and LOPDGDD:
          </p>
          <ul>
            <li>
              <strong>Access</strong>: to know what data we process about you.
            </li>
            <li>
              <strong>Rectification</strong>: to correct inaccurate or
              incomplete data.
            </li>
            <li>
              <strong>Erasure</strong> (&ldquo;right to be forgotten&rdquo;):
              to request that we delete your data when it is no longer
              necessary.
            </li>
            <li>
              <strong>Objection</strong>: to object to certain processing
              activities.
            </li>
            <li>
              <strong>Restriction</strong>: to ask us to restrict processing
              in certain cases.
            </li>
            <li>
              <strong>Portability</strong>: to receive your data in a
              structured format and transfer it to another controller.
            </li>
            <li>
              <strong>Withdraw consent</strong> at any time, without
              affecting the lawfulness of prior processing.
            </li>
          </ul>
          <p>
            To exercise these rights, write to us at{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>{" "}
            indicating which right you wish to exercise and, if necessary,
            providing proof of your identity.
          </p>
          <p>
            If you believe that the processing of your data does not comply
            with regulations, you may file a complaint with the{" "}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spanish Data Protection Agency (AEPD)
            </a>
            .
          </p>

          <h2>7. Security measures</h2>
          <p>
            We apply reasonable technical and organizational measures to
            protect your data against unauthorized access, loss or
            destruction. The website uses encrypted connection (HTTPS) and
            the contracted services apply industry-standard security
            measures.
          </p>

          <h2>8. Changes to this policy</h2>
          <p>
            This policy may be updated to reflect legislative, operational or
            service changes. The version in force will always be the one
            published on this page, with the last-updated date shown at the
            top.
          </p>

          <h2>9. Contact</h2>
          <p>
            For any questions about privacy, write to us at{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>{" "}
            or through the <Link href="/contacto">contact page</Link>.
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
              href="/privacidad"
              className="text-sky-600 hover:text-sky-700 underline"
            >
              /privacidad
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
