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
  const canonicalUrl = `${siteUrl}${urlAvisoLegal(lang)}`;
  const languages = hreflangAlternates((l) => urlAvisoLegal(l));

  const titulo =
    lang === "de" ? "Impressum | ExploraSpain" : "Legal Notice | ExploraSpain";
  const descripcion =
    lang === "de"
      ? "Rechtliche Angaben zum Betreiber der Website ExploraSpain, gemäß dem spanischen Gesetz 34/2002 (LSSI-CE)."
      : "Legal information about the owner of the ExploraSpain website, in compliance with Spanish Law 34/2002 (LSSI-CE).";
  const ogDescripcion =
    lang === "de"
      ? "Rechtliche Angaben zum Betreiber von ExploraSpain."
      : "Legal information about the owner of ExploraSpain.";

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

export default function LegalNoticePage({
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
  const pageUrl = `${siteUrl}${urlAvisoLegal(lang)}`;
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
        name: esAleman ? "Impressum" : "Legal Notice",
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
              Impressum
            </h1>
            <p className="text-sky-50">Zuletzt aktualisiert: {LAST_UPDATED_DE}</p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
            <h2>1. Angaben zum Betreiber</h2>
            <p>
              Gemäß dem spanischen Gesetz 34/2002 vom 11. Juli über
              Dienstleistungen der Informationsgesellschaft und den
              elektronischen Geschäftsverkehr (LSSI-CE) werden folgende
              Angaben zum Betreiber dieser Website gemacht:
            </p>
            <ul>
              <li>
                <strong>Betreiber</strong>: SKYWARD PARTNERS, S.L.
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
              <li>
                <strong>Tätigkeit</strong>: Verkauf von Touren und
                touristischen Aktivitäten in Spanien sowie Veröffentlichung
                redaktioneller Inhalte über Reisen und Tourismus,
                einschließlich Affiliate-Links zu Plattformen Dritter.
              </li>
            </ul>

            <h2>2. Zweck und Geltungsbereich</h2>
            <p>
              Dieses Impressum regelt die Nutzung der Website{" "}
              <strong>exploraspain.com</strong> (im Folgenden „die
              Website"), die vom Betreiber bereitgestellt wird, um
              informative und redaktionelle Inhalte über das Reisen in
              Spanien anzubieten, Touren und touristische Aktivitäten zu
              verkaufen und auf touristische Produkte und Dienstleistungen
              Dritter zu verlinken.
            </p>
            <p>
              Der Zugriff auf und die Nutzung der Website verleihen den
              Status als Nutzer und beinhalten die vollständige Annahme der
              in diesem Impressum festgelegten Bedingungen sowie der{" "}
              <Link href={`/${lang}/privacy`}>Datenschutzerklärung</Link> und
              der{" "}
              <Link href={`/${lang}/cookies`}>Cookie-Richtlinie</Link>.
            </p>

            <h2>3. Nutzungsbedingungen</h2>
            <p>
              Der Nutzer verpflichtet sich, die Website rechtmäßig und
              angemessen zu nutzen, in Übereinstimmung mit geltendem Recht,
              diesem Impressum, guten Sitten und öffentlicher Ordnung.
            </p>
            <p>Untersagt sind insbesondere:</p>
            <ul>
              <li>
                Die Nutzung der Website für rechtswidrige Zwecke oder auf
                eine Weise, die den Interessen des Betreibers oder Dritter
                schaden könnte.
              </li>
              <li>
                Das Einschleusen von Computerviren, defekten Dateien oder
                anderen Programmen, die die Website oder die Systeme des
                Betreibers oder Dritter beschädigen könnten.
              </li>
              <li>
                Missbräuchliche Nutzung der Website, wie massenhaftes
                Scraping, automatisierte Datenerfassung oder unbefugte
                Vervielfältigung von Inhalten.
              </li>
              <li>
                Sich als der Betreiber oder als ein anderer Nutzer
                auszugeben.
              </li>
            </ul>

            <h2>4. Geistiges und gewerbliches Eigentum</h2>
            <p>
              Sämtliche Inhalte der Website (Texte, Bilder, Grafiken,
              Design, Quellcode, Logos, Marken und andere Elemente) sind
              Eigentum von SKYWARD PARTNERS, S.L. oder Dritter, die deren
              Nutzung genehmigt haben, und sind durch spanisches und
              internationales Recht zum Schutz geistigen und gewerblichen
              Eigentums geschützt.
            </p>
            <p>
              Die Vervielfältigung, Verbreitung, öffentliche Wiedergabe,
              Bearbeitung oder jede andere Form der Verwertung der Inhalte
              ist ohne vorherige ausdrückliche Genehmigung des Betreibers
              ausdrücklich untersagt, mit Ausnahme der persönlichen und
              privaten Nutzung durch den Nutzer.
            </p>
            <p>
              Kurze Zitate aus den Inhalten sind zu Informations- oder
              Bildungszwecken gestattet, sofern die Quelle genannt und auf
              die Original-Website verlinkt wird.
            </p>

            <h2>5. Affiliate-Links und Links zu Dritten</h2>
            <p>
              Die Website enthält Links zu Plattformen Dritter,
              einschließlich Affiliate-Links (zum Beispiel zu Viator,
              GetYourGuide oder ähnlichen). Wenn ein Nutzer über diese Links
              einen Kauf oder eine Buchung tätigt, kann der Betreiber eine
              Provision erhalten, ohne zusätzliche Kosten für den Nutzer.
            </p>
            <p>
              Der Betreiber übernimmt keine Verantwortung für die Inhalte,
              Geschäftspraktiken, Datenschutzrichtlinien oder
              Nutzungsbedingungen der verlinkten Websites. Der Zugriff auf
              diese Seiten erfolgt auf eigenes Risiko des Nutzers.
            </p>

            <h2>6. Haftungs- und Gewährleistungsausschluss</h2>
            <p>
              Der Betreiber bemüht sich nach besten Kräften, dafür zu
              sorgen, dass die auf der Website veröffentlichten
              Informationen korrekt, aktuell und von hoher Qualität sind.
              Der Betreiber übernimmt jedoch keine Gewähr für die
              Richtigkeit, Vollständigkeit oder Aktualität sämtlicher
              Informationen, insbesondere in Bezug auf Preise,
              Öffnungszeiten, Verfügbarkeit oder Bedingungen von Produkten
              und Dienstleistungen Dritter.
            </p>
            <p>
              Der Nutzer akzeptiert, dass die veröffentlichten
              Informationen lediglich zur Orientierung dienen und vor
              Reise- oder Buchungsentscheidungen über offizielle Quellen
              überprüft werden sollten. Der Betreiber haftet nicht für
              Schäden oder Verluste, die aus der Nutzung der Informationen
              auf der Website entstehen.
            </p>
            <p>
              Der Betreiber garantiert keine durchgehende Verfügbarkeit der
              Website und behält sich das Recht vor, den Zugang aus
              technischen, wartungsbedingten oder anderen gerechtfertigten
              Gründen auszusetzen, zu unterbrechen oder zu ändern.
            </p>

            <h2>7. Änderung des Impressums</h2>
            <p>
              Der Betreiber behält sich das Recht vor, dieses Impressum
              jederzeit zu ändern, um es an gesetzliche, betriebliche oder
              sonstige Änderungen anzupassen. Es gilt stets die auf dieser
              Seite veröffentlichte Fassung.
            </p>

            <h2>8. Anwendbares Recht und Gerichtsstand</h2>
            <p>
              Dieses Impressum unterliegt spanischem Recht. Jede
              Streitigkeit, die sich aus dem Zugriff auf oder der Nutzung
              der Website ergibt, wird den Gerichten am Sitz des Betreibers
              vorgelegt, sofern das anwendbare Recht aufgrund des
              Verbraucherstatus des Nutzers nichts anderes vorsieht.
            </p>

            <h2>9. Kontakt</h2>
            <p>
              Bei Fragen zu diesem Impressum kontaktiere uns bitte über die{" "}
              <Link href="/contacto">Kontaktseite</Link> oder per E-Mail an{" "}
              <a href="mailto:contacto@exploraspain.com">
                contacto@exploraspain.com
              </a>
              .
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
            Legal Notice
          </h1>
          <p className="text-sky-50">Last updated: {LAST_UPDATED_EN}</p>
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
