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
  urlContacto,
  urlCookies,
  urlPrivacidad,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

type IdiomaLegal = Exclude<Idioma, "es">;

interface CuerpoProps {
  lang: IdiomaLegal;
}

interface ContenidoCookies {
  titulo: string;
  descripcion: string;
  ogDescripcion: string;
  inicio: string;
  actualizado: string;
  fecha: string;
  avisoTitulo: string;
  /** Texto de la cláusula de prevalencia, justo antes del enlace a la versión española. */
  avisoTexto: string;
  volver: string;
  Cuerpo: (props: CuerpoProps) => JSX.Element;
}

interface TextosTablaCookies {
  cabeceras: [string, string, string, string];
  tipoTecnica: string;
  vercelFinalidad: string;
  vercelDuracion: string;
  consentimientoFinalidad: string;
  consentimientoDuracion: string;
}

interface EnlacesNavegador {
  chrome: string;
  firefox: string;
  safari: string;
  edge: string;
}

function esIdiomaLegal(lang: string): lang is IdiomaLegal {
  return esIdiomaActivo(lang) && lang !== "es";
}

const EMAIL = "contacto@exploraspain.com";

const CLASE_TH =
  "text-left p-3 font-semibold text-piedra-900 border-b border-piedra-200";

function TablaCookies({ t }: { t: TextosTablaCookies }) {
  return (
    <div className="not-prose my-8 overflow-x-auto">
      <table className="w-full text-sm border border-piedra-200 rounded-lg overflow-hidden">
        <thead className="bg-piedra-50">
          <tr>
            {t.cabeceras.map((cabecera) => (
              <th key={cabecera} className={CLASE_TH}>
                {cabecera}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-piedra-100">
            <td className="p-3 font-mono text-xs">__vercel_live_token</td>
            <td className="p-3">{t.tipoTecnica}</td>
            <td className="p-3">{t.vercelFinalidad}</td>
            <td className="p-3">{t.vercelDuracion}</td>
          </tr>
          <tr>
            <td className="p-3 font-mono text-xs">
              exploraspain_cookie_consent
            </td>
            <td className="p-3">{t.tipoTecnica}</td>
            <td className="p-3">{t.consentimientoFinalidad}</td>
            <td className="p-3">{t.consentimientoDuracion}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ListaNavegadores({ enlaces }: { enlaces: EnlacesNavegador }) {
  const items: Array<{ nombre: string; href: string }> = [
    { nombre: "Google Chrome", href: enlaces.chrome },
    { nombre: "Mozilla Firefox", href: enlaces.firefox },
    { nombre: "Safari", href: enlaces.safari },
    { nombre: "Microsoft Edge", href: enlaces.edge },
  ];
  return (
    <ul>
      {items.map((item) => (
        <li key={item.nombre}>
          <a href={item.href} target="_blank" rel="noopener noreferrer">
            {item.nombre}
          </a>
        </li>
      ))}
    </ul>
  );
}

function EnlaceAepd({ children }: { children: string }) {
  return (
    <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function EnlacesProveedores({ y }: { y: string }) {
  return (
    <>
      <a
        href="https://www.bokun.io/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
      >
        bokun.io
      </a>{" "}
      {y}{" "}
      <a
        href="https://www.getyourguide.com/c/privacy-policy/"
        target="_blank"
        rel="noopener noreferrer"
      >
        getyourguide.com
      </a>
    </>
  );
}

function CuerpoEn({ lang }: CuerpoProps) {
  return (
    <>
      <h2>1. What cookies are</h2>
      <p>
        A cookie is a small text file that a website stores in your browser
        when you visit it. Cookies allow the site to remember information about
        your visit, such as your preferred language or browsing data, which can
        improve the user experience and help the owner understand how the site
        is used.
      </p>
      <p>
        This policy explains which cookies <strong>exploraspain.com</strong>{" "}
        uses, for what purpose, and how you can manage them, in compliance with
        article 22.2 of Spanish Law 34/2002 (LSSI-CE) and the Cookies Guide of
        the <EnlaceAepd>Spanish Data Protection Agency (AEPD)</EnlaceAepd>.
      </p>

      <h2>2. Types of cookies by purpose</h2>
      <ul>
        <li>
          <strong>Technical cookies (strictly necessary)</strong>: enable basic
          site functionality (navigation, access to sections, security). Do not
          require consent.
        </li>
        <li>
          <strong>Analytics or measurement cookies</strong>: enable analyzing
          user behavior in aggregate (pages visited, time spent, etc.) to
          improve the site. Require consent.
        </li>
        <li>
          <strong>Behavioral advertising cookies</strong>: enable showing
          personalized ads based on user profile. Require consent. Currently{" "}
          <strong>this site does not use behavioral advertising cookies</strong>
          .
        </li>
      </ul>

      <h2>3. Cookies used on this site</h2>
      <p>The cookies currently used by this website are detailed below:</p>

      <TablaCookies
        t={{
          cabeceras: ["Cookie", "Type", "Purpose", "Duration"],
          tipoTecnica: "Technical",
          vercelFinalidad: "Site deployment and operation management (Vercel).",
          vercelDuracion: "Session",
          consentimientoFinalidad:
            "Remembers your choice regarding cookie use on this site.",
          consentimientoDuracion: "12 months",
        }}
      />

      <p className="text-sm text-piedra-600 italic">
        This table will be updated when additional analytics or measurement
        tools are added. When Google Analytics 4 is activated, the
        corresponding cookies (_ga, _ga_*) will be added and prior consent will
        be requested before activation.
      </p>

      <h2>4. Third-party cookies on outbound links</h2>
      <p>
        The site contains links to external platforms (GetYourGuide or others).
        When you click these links, you will be redirected to their websites,
        which use their own cookies and apply their own privacy and cookie
        policies. The owner of this site does not control or take
        responsibility for how these platforms use cookies on their own
        domains.
      </p>
      <h3>Embedded booking calendars</h3>
      <p>
        Some activity pages show the provider&apos;s booking calendar (Bókun or
        GetYourGuide) inside our page. That calendar is served by the provider
        from its own domain, may use its own cookies to show availability,
        complete the booking and attribute it to ExploraSpain, and is loaded
        because it is needed to book the activity you chose. See their policies
        at <EnlacesProveedores y="and" />; you can block these cookies in your
        browser settings.
      </p>

      <h2>5. How to manage cookies</h2>
      <p>
        You can accept, reject or customize the use of cookies on this site
        through the consent banner that appears on your first visit. You can
        change your choice at any time.
      </p>
      <p>
        You can also configure your browser to accept, reject or delete
        cookies. See instructions for your browser:
      </p>
      <ListaNavegadores
        enlaces={{
          chrome: "https://support.google.com/chrome/answer/95647?hl=en",
          firefox:
            "https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop",
          safari:
            "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac",
          edge: "https://support.microsoft.com/en-us/microsoft-edge",
        }}
      />
      <p>
        Note that disabling some cookies may affect the website&rsquo;s
        functionality.
      </p>

      <h2>6. Updates to this policy</h2>
      <p>
        This cookie policy may be updated if the cookies used or the applicable
        regulations change. The version in force will always be the one
        published on this page, with the last-updated date shown at the top.
      </p>

      <h2>7. More information</h2>
      <p>
        For inquiries about this cookie policy, write to us at{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or through the{" "}
        <Link href={urlContacto(lang)}>contact page</Link>.
      </p>
      <p>
        For more information about how your personal data is processed, see
        the <Link href={urlPrivacidad(lang)}>Privacy Policy</Link>.
      </p>
    </>
  );
}

function CuerpoDe({ lang }: CuerpoProps) {
  return (
    <>
      <h2>1. Was Cookies sind</h2>
      <p>
        Ein Cookie ist eine kleine Textdatei, die eine Website beim Besuch in
        deinem Browser speichert. Cookies ermöglichen es der Website,
        Informationen über deinen Besuch zu speichern, etwa deine bevorzugte
        Sprache oder Nutzungsdaten, was die Nutzererfahrung verbessern und dem
        Betreiber helfen kann, zu verstehen, wie die Website genutzt wird.
      </p>
      <p>
        Diese Richtlinie erklärt, welche Cookies{" "}
        <strong>exploraspain.com</strong> verwendet, zu welchem Zweck und wie
        du sie verwalten kannst, gemäß Artikel 22.2 des spanischen Gesetzes
        34/2002 (LSSI-CE) und dem Cookie-Leitfaden der{" "}
        <EnlaceAepd>spanischen Datenschutzbehörde (AEPD)</EnlaceAepd>.
      </p>

      <h2>2. Cookie-Arten nach Zweck</h2>
      <ul>
        <li>
          <strong>Technische Cookies (unbedingt erforderlich)</strong>:
          ermöglichen grundlegende Funktionen der Website (Navigation, Zugriff
          auf Bereiche, Sicherheit). Erfordern keine Einwilligung.
        </li>
        <li>
          <strong>Analyse- oder Messungs-Cookies</strong>: ermöglichen die
          aggregierte Analyse des Nutzerverhaltens (besuchte Seiten,
          Verweildauer usw.), um die Website zu verbessern. Erfordern
          Einwilligung.
        </li>
        <li>
          <strong>Cookies für verhaltensbasierte Werbung</strong>: ermöglichen
          die Anzeige personalisierter Werbung basierend auf dem Nutzerprofil.
          Erfordern Einwilligung. Aktuell{" "}
          <strong>
            verwendet diese Website keine Cookies für verhaltensbasierte
            Werbung
          </strong>
          .
        </li>
      </ul>

      <h2>3. Auf dieser Website verwendete Cookies</h2>
      <p>Die aktuell von dieser Website verwendeten Cookies sind unten aufgeführt:</p>

      <TablaCookies
        t={{
          cabeceras: ["Cookie", "Typ", "Zweck", "Dauer"],
          tipoTecnica: "Technisch",
          vercelFinalidad:
            "Verwaltung von Deployment und Betrieb der Website (Vercel).",
          vercelDuracion: "Sitzung",
          consentimientoFinalidad:
            "Speichert deine Entscheidung zur Cookie-Nutzung auf dieser Website.",
          consentimientoDuracion: "12 Monate",
        }}
      />

      <p className="text-sm text-piedra-600 italic">
        Diese Tabelle wird aktualisiert, sobald weitere Analyse- oder Messtools
        hinzugefügt werden. Sobald Google Analytics 4 aktiviert wird, werden die
        entsprechenden Cookies (_ga, _ga_*) hinzugefügt und vor der Aktivierung
        wird eine vorherige Einwilligung eingeholt.
      </p>

      <h2>4. Cookies Dritter bei ausgehenden Links</h2>
      <p>
        Die Website enthält Links zu externen Plattformen (GetYourGuide oder
        andere). Wenn du auf diese Links klickst, wirst du zu deren Websites
        weitergeleitet, die eigene Cookies verwenden und ihre eigenen
        Datenschutz- und Cookie-Richtlinien anwenden. Der Betreiber dieser
        Website hat keine Kontrolle über die Cookie-Nutzung dieser Plattformen
        auf ihren eigenen Domains und übernimmt hierfür keine Verantwortung.
      </p>
      <h3>Eingebettete Buchungskalender</h3>
      <p>
        Auf einigen Aktivitätsseiten wird der Buchungskalender des Anbieters
        (Bókun oder GetYourGuide) direkt auf unserer Seite angezeigt. Dieser
        Kalender wird vom Anbieter über seine eigene Domain bereitgestellt,
        kann eigene Cookies verwenden, um die Verfügbarkeit anzuzeigen, die
        Buchung abzuschließen und sie ExploraSpain zuzuordnen, und wird
        geladen, weil er für die Buchung der gewählten Aktivität nötig ist. Die
        Richtlinien findest du auf <EnlacesProveedores y="und" />; du kannst
        diese Cookies in deinem Browser blockieren.
      </p>

      <h2>5. Wie du Cookies verwaltest</h2>
      <p>
        Du kannst die Verwendung von Cookies auf dieser Website über das
        Einwilligungsbanner, das bei deinem ersten Besuch erscheint,
        akzeptieren, ablehnen oder anpassen. Du kannst deine Entscheidung
        jederzeit ändern.
      </p>
      <p>
        Du kannst außerdem deinen Browser so konfigurieren, dass er Cookies
        akzeptiert, ablehnt oder löscht. Anleitungen für deinen Browser:
      </p>
      <ListaNavegadores
        enlaces={{
          chrome: "https://support.google.com/chrome/answer/95647?hl=de",
          firefox:
            "https://support.mozilla.org/de/kb/verbesserter-schutz-vor-aktivitatenverfolgung-firefox-desktop",
          safari: "https://support.apple.com/de-de/guide/safari/sfri11471/mac",
          edge: "https://support.microsoft.com/de-de/microsoft-edge",
        }}
      />
      <p>
        Bitte beachte, dass das Deaktivieren bestimmter Cookies die
        Funktionalität der Website beeinträchtigen kann.
      </p>

      <h2>6. Aktualisierungen dieser Richtlinie</h2>
      <p>
        Diese Cookie-Richtlinie kann aktualisiert werden, wenn sich die
        verwendeten Cookies oder die geltenden Vorschriften ändern. Es gilt
        stets die auf dieser Seite veröffentlichte Fassung, mit dem oben
        angegebenen Datum der letzten Aktualisierung.
      </p>

      <h2>7. Weitere Informationen</h2>
      <p>
        Bei Fragen zu dieser Cookie-Richtlinie schreib uns an{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> oder über die{" "}
        <Link href={urlContacto(lang)}>Kontaktseite</Link>.
      </p>
      <p>
        Weitere Informationen darüber, wie deine personenbezogenen Daten
        verarbeitet werden, findest du in der{" "}
        <Link href={urlPrivacidad(lang)}>Datenschutzerklärung</Link>.
      </p>
    </>
  );
}

function CuerpoFr({ lang }: CuerpoProps) {
  return (
    <>
      <h2>1. Qu’est-ce qu’un cookie</h2>
      <p>
        Un cookie est un petit fichier texte qu’un site web enregistre dans
        votre navigateur lorsque vous le visitez. Les cookies permettent au
        site de mémoriser des informations sur votre visite, comme votre
        langue préférée ou vos données de navigation, ce qui peut améliorer
        l’expérience utilisateur et aider l’éditeur à comprendre comment le
        site est utilisé.
      </p>
      <p>
        Cette politique explique quels cookies utilise{" "}
        <strong>exploraspain.com</strong>, dans quel but et comment vous
        pouvez les gérer, conformément à l’article 22.2 de la loi espagnole
        34/2002 (LSSI-CE) et au guide sur les cookies de l’
        <EnlaceAepd>Agence espagnole de protection des données (AEPD)</EnlaceAepd>
        .
      </p>

      <h2>2. Types de cookies selon leur finalité</h2>
      <ul>
        <li>
          <strong>Cookies techniques (strictement nécessaires)</strong> :
          permettent les fonctionnalités de base du site (navigation, accès aux
          rubriques, sécurité). Ne nécessitent pas de consentement.
        </li>
        <li>
          <strong>Cookies d’analyse ou de mesure</strong> : permettent
          d’analyser de manière agrégée le comportement des utilisateurs (pages
          consultées, temps passé, etc.) afin d’améliorer le site. Nécessitent
          un consentement.
        </li>
        <li>
          <strong>Cookies de publicité comportementale</strong> : permettent
          d’afficher des publicités personnalisées en fonction du profil de
          l’utilisateur. Nécessitent un consentement. Actuellement,{" "}
          <strong>
            ce site n’utilise pas de cookies de publicité comportementale
          </strong>
          .
        </li>
      </ul>

      <h2>3. Cookies utilisés sur ce site</h2>
      <p>Les cookies actuellement utilisés par ce site sont détaillés ci-dessous :</p>

      <TablaCookies
        t={{
          cabeceras: ["Cookie", "Type", "Finalité", "Durée"],
          tipoTecnica: "Technique",
          vercelFinalidad:
            "Gestion du déploiement et du fonctionnement du site (Vercel).",
          vercelDuracion: "Session",
          consentimientoFinalidad:
            "Mémorise votre choix concernant l’utilisation des cookies sur ce site.",
          consentimientoDuracion: "12 mois",
        }}
      />

      <p className="text-sm text-piedra-600 italic">
        Ce tableau sera mis à jour lorsque d’autres outils d’analyse ou de
        mesure seront ajoutés. Lorsque Google Analytics 4 sera activé, les
        cookies correspondants (_ga, _ga_*) seront ajoutés et un consentement
        préalable sera demandé avant leur activation.
      </p>

      <h2>4. Cookies tiers des liens sortants</h2>
      <p>
        Le site contient des liens vers des plateformes externes (GetYourGuide
        ou autres). Lorsque vous cliquez sur ces liens, vous êtes redirigé vers
        leurs sites web, qui utilisent leurs propres cookies et appliquent
        leurs propres politiques de confidentialité et de cookies. L’éditeur
        de ce site ne contrôle pas l’utilisation que ces plateformes font des
        cookies sur leurs propres domaines et n’en assume pas la
        responsabilité.
      </p>
      <h3>Calendriers de réservation intégrés</h3>
      <p>
        Certaines pages d’activités affichent le calendrier de réservation du
        prestataire (Bókun ou GetYourGuide) au sein de notre page. Ce
        calendrier est servi par le prestataire depuis son propre domaine, peut
        utiliser ses propres cookies pour afficher les disponibilités, finaliser
        la réservation et l’attribuer à ExploraSpain, et il est chargé parce
        qu’il est nécessaire pour réserver l’activité que vous avez choisie.
        Consultez leurs politiques sur <EnlacesProveedores y="et" /> ; vous
        pouvez bloquer ces cookies dans les paramètres de votre navigateur.
      </p>

      <h2>5. Comment gérer les cookies</h2>
      <p>
        Vous pouvez accepter, refuser ou personnaliser l’utilisation des
        cookies sur ce site via le bandeau de consentement qui s’affiche lors
        de votre première visite. Vous pouvez modifier votre choix à tout
        moment.
      </p>
      <p>
        Vous pouvez également configurer votre navigateur pour accepter,
        refuser ou supprimer les cookies. Consultez les instructions de votre
        navigateur :
      </p>
      <ListaNavegadores
        enlaces={{
          chrome: "https://support.google.com/chrome/answer/95647?hl=fr",
          firefox:
            "https://support.mozilla.org/fr/kb/enhanced-tracking-protection-firefox-desktop",
          safari: "https://support.apple.com/fr-fr/guide/safari/sfri11471/mac",
          edge: "https://support.microsoft.com/fr-fr/microsoft-edge",
        }}
      />
      <p>
        Veuillez noter que la désactivation de certains cookies peut affecter
        le fonctionnement du site.
      </p>

      <h2>6. Mises à jour de cette politique</h2>
      <p>
        Cette politique de cookies peut être mise à jour si les cookies
        utilisés ou la réglementation applicable changent. La version en
        vigueur est toujours celle publiée sur cette page, avec la date de
        dernière mise à jour indiquée en haut.
      </p>

      <h2>7. Plus d’informations</h2>
      <p>
        Pour toute question sur cette politique de cookies, écrivez-nous à{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ou passez par la{" "}
        <Link href={urlContacto(lang)}>page de contact</Link>.
      </p>
      <p>
        Pour en savoir plus sur la manière dont vos données personnelles sont
        traitées, consultez la{" "}
        <Link href={urlPrivacidad(lang)}>Politique de confidentialité</Link>.
      </p>
    </>
  );
}

function CuerpoIt({ lang }: CuerpoProps) {
  return (
    <>
      <h2>1. Cosa sono i cookie</h2>
      <p>
        Un cookie è un piccolo file di testo che un sito web salva nel tuo
        browser quando lo visiti. I cookie permettono al sito di ricordare
        informazioni sulla tua visita, come la lingua preferita o i dati di
        navigazione, il che può migliorare l’esperienza d’uso e aiutare il
        titolare a capire come viene utilizzato il sito.
      </p>
      <p>
        Questa policy spiega quali cookie utilizza{" "}
        <strong>exploraspain.com</strong>, per quale finalità e come puoi
        gestirli, in conformità con l’articolo 22.2 della Legge spagnola
        34/2002 (LSSI-CE) e con la Guida sui cookie dell’
        <EnlaceAepd>Agenzia spagnola per la protezione dei dati (AEPD)</EnlaceAepd>
        .
      </p>

      <h2>2. Tipi di cookie in base alla finalità</h2>
      <ul>
        <li>
          <strong>Cookie tecnici (strettamente necessari)</strong>: consentono
          le funzionalità di base del sito (navigazione, accesso alle sezioni,
          sicurezza). Non richiedono il consenso.
        </li>
        <li>
          <strong>Cookie analitici o di misurazione</strong>: consentono di
          analizzare in forma aggregata il comportamento degli utenti (pagine
          visitate, tempo di permanenza, ecc.) per migliorare il sito.
          Richiedono il consenso.
        </li>
        <li>
          <strong>Cookie di pubblicità comportamentale</strong>: consentono di
          mostrare annunci personalizzati in base al profilo dell’utente.
          Richiedono il consenso. Attualmente{" "}
          <strong>
            questo sito non utilizza cookie di pubblicità comportamentale
          </strong>
          .
        </li>
      </ul>

      <h2>3. Cookie utilizzati su questo sito</h2>
      <p>Di seguito sono elencati i cookie attualmente utilizzati da questo sito:</p>

      <TablaCookies
        t={{
          cabeceras: ["Cookie", "Tipo", "Finalità", "Durata"],
          tipoTecnica: "Tecnico",
          vercelFinalidad:
            "Gestione della distribuzione e del funzionamento del sito (Vercel).",
          vercelDuracion: "Sessione",
          consentimientoFinalidad:
            "Ricorda la tua scelta sull’uso dei cookie su questo sito.",
          consentimientoDuracion: "12 mesi",
        }}
      />

      <p className="text-sm text-piedra-600 italic">
        Questa tabella verrà aggiornata quando saranno aggiunti altri strumenti
        di analisi o misurazione. Quando verrà attivato Google Analytics 4,
        saranno aggiunti i relativi cookie (_ga, _ga_*) e verrà richiesto il
        consenso preventivo prima dell’attivazione.
      </p>

      <h2>4. Cookie di terze parti nei link in uscita</h2>
      <p>
        Il sito contiene link a piattaforme esterne (GetYourGuide o altre).
        Quando clicchi su questi link, vieni reindirizzato ai loro siti web,
        che utilizzano i propri cookie e applicano le proprie policy sulla
        privacy e sui cookie. Il titolare di questo sito non controlla né si
        assume la responsabilità dell’uso che queste piattaforme fanno dei
        cookie sui propri domini.
      </p>
      <h3>Calendari di prenotazione integrati</h3>
      <p>
        Alcune pagine di attività mostrano il calendario di prenotazione del
        fornitore (Bókun o GetYourGuide) all’interno della nostra pagina. Il
        calendario viene fornito dal fornitore dal proprio dominio, può usare i
        propri cookie per mostrare la disponibilità, completare la
        prenotazione e attribuirla a ExploraSpain, e viene caricato perché è
        necessario per prenotare l’attività che hai scelto. Consulta le loro
        policy su <EnlacesProveedores y="e" />; puoi bloccare questi cookie
        nelle impostazioni del tuo browser.
      </p>

      <h2>5. Come gestire i cookie</h2>
      <p>
        Puoi accettare, rifiutare o personalizzare l’uso dei cookie su questo
        sito tramite il banner del consenso che compare alla tua prima visita.
        Puoi modificare la tua scelta in qualsiasi momento.
      </p>
      <p>
        Puoi anche configurare il tuo browser per accettare, rifiutare o
        eliminare i cookie. Consulta le istruzioni del tuo browser:
      </p>
      <ListaNavegadores
        enlaces={{
          chrome: "https://support.google.com/chrome/answer/95647?hl=it",
          firefox:
            "https://support.mozilla.org/it/kb/enhanced-tracking-protection-firefox-desktop",
          safari: "https://support.apple.com/it-it/guide/safari/sfri11471/mac",
          edge: "https://support.microsoft.com/it-it/microsoft-edge",
        }}
      />
      <p>
        Tieni presente che disattivare alcuni cookie può compromettere il
        funzionamento del sito.
      </p>

      <h2>6. Aggiornamenti di questa policy</h2>
      <p>
        Questa cookie policy può essere aggiornata se cambiano i cookie
        utilizzati o la normativa applicabile. La versione in vigore è sempre
        quella pubblicata in questa pagina, con la data dell’ultimo
        aggiornamento indicata in alto.
      </p>

      <h2>7. Maggiori informazioni</h2>
      <p>
        Per domande su questa cookie policy, scrivici a{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> oppure tramite la{" "}
        <Link href={urlContacto(lang)}>pagina dei contatti</Link>.
      </p>
      <p>
        Per maggiori informazioni su come vengono trattati i tuoi dati
        personali, consulta l’
        <Link href={urlPrivacidad(lang)}>Informativa sulla privacy</Link>.
      </p>
    </>
  );
}

function CuerpoPt({ lang }: CuerpoProps) {
  return (
    <>
      <h2>1. O que são cookies</h2>
      <p>
        Um cookie é um pequeno ficheiro de texto que um website guarda no
        navegador do utilizador quando este o visita. Os cookies permitem ao
        website recordar informação sobre a visita, como o idioma preferido ou
        os dados de navegação, o que pode melhorar a experiência do utilizador
        e ajudar o titular a perceber como o website é utilizado.
      </p>
      <p>
        Esta política explica que cookies o <strong>exploraspain.com</strong>{" "}
        utiliza, para que finalidade e como o utilizador os pode gerir, em
        conformidade com o artigo 22.2 da Lei espanhola 34/2002 (LSSI-CE) e com
        o Guia sobre cookies da{" "}
        <EnlaceAepd>Agência Espanhola de Proteção de Dados (AEPD)</EnlaceAepd>.
      </p>

      <h2>2. Tipos de cookies segundo a finalidade</h2>
      <ul>
        <li>
          <strong>Cookies técnicos (estritamente necessários)</strong>:
          permitem as funcionalidades básicas do website (navegação, acesso às
          secções, segurança). Não requerem consentimento.
        </li>
        <li>
          <strong>Cookies analíticos ou de medição</strong>: permitem analisar
          de forma agregada o comportamento dos utilizadores (páginas visitadas,
          tempo de permanência, etc.) para melhorar o website. Requerem
          consentimento.
        </li>
        <li>
          <strong>Cookies de publicidade comportamental</strong>: permitem
          mostrar anúncios personalizados com base no perfil do utilizador.
          Requerem consentimento. Atualmente,{" "}
          <strong>
            este website não utiliza cookies de publicidade comportamental
          </strong>
          .
        </li>
      </ul>

      <h2>3. Cookies utilizados neste website</h2>
      <p>Os cookies atualmente utilizados por este website são os seguintes:</p>

      <TablaCookies
        t={{
          cabeceras: ["Cookie", "Tipo", "Finalidade", "Duração"],
          tipoTecnica: "Técnico",
          vercelFinalidad:
            "Gestão da implementação e do funcionamento do website (Vercel).",
          vercelDuracion: "Sessão",
          consentimientoFinalidad:
            "Guarda a escolha do utilizador sobre a utilização de cookies neste website.",
          consentimientoDuracion: "12 meses",
        }}
      />

      <p className="text-sm text-piedra-600 italic">
        Esta tabela será atualizada quando forem acrescentadas outras
        ferramentas de análise ou medição. Quando o Google Analytics 4 for
        ativado, serão acrescentados os cookies correspondentes (_ga, _ga_*) e
        será pedido o consentimento prévio antes da ativação.
      </p>

      <h2>4. Cookies de terceiros em links externos</h2>
      <p>
        O website contém links para plataformas externas (GetYourGuide ou
        outras). Ao clicar nestes links, o utilizador é redirecionado para os
        websites dessas plataformas, que utilizam os seus próprios cookies e
        aplicam as suas próprias políticas de privacidade e de cookies. O
        titular deste website não controla nem se responsabiliza pela forma
        como estas plataformas utilizam cookies nos seus próprios domínios.
      </p>
      <h3>Calendários de reserva integrados</h3>
      <p>
        Algumas páginas de atividades mostram o calendário de reserva do
        fornecedor (Bókun ou GetYourGuide) dentro da nossa página. Esse
        calendário é disponibilizado pelo fornecedor a partir do seu próprio
        domínio, pode utilizar cookies próprios para mostrar a disponibilidade,
        concluir a reserva e atribuí-la à ExploraSpain, e é carregado porque é
        necessário para reservar a atividade escolhida. As respetivas
        políticas podem ser consultadas em <EnlacesProveedores y="e" />; o
        utilizador pode bloquear estes cookies nas definições do navegador.
      </p>

      <h2>5. Como gerir os cookies</h2>
      <p>
        O utilizador pode aceitar, rejeitar ou personalizar a utilização de
        cookies neste website através do banner de consentimento que aparece
        na primeira visita, e pode alterar a sua escolha a qualquer momento.
      </p>
      <p>
        Também pode configurar o navegador para aceitar, rejeitar ou eliminar
        cookies. Consulte as instruções do seu navegador:
      </p>
      <ListaNavegadores
        enlaces={{
          chrome: "https://support.google.com/chrome/answer/95647?hl=pt-PT",
          firefox:
            "https://support.mozilla.org/pt-PT/kb/enhanced-tracking-protection-firefox-desktop",
          safari: "https://support.apple.com/pt-pt/guide/safari/sfri11471/mac",
          edge: "https://support.microsoft.com/pt-pt/microsoft-edge",
        }}
      />
      <p>
        Tenha em conta que desativar alguns cookies pode afetar o
        funcionamento do website.
      </p>

      <h2>6. Atualizações desta política</h2>
      <p>
        Esta política de cookies pode ser atualizada se os cookies utilizados
        ou a legislação aplicável mudarem. A versão em vigor será sempre a
        publicada nesta página, com a data da última atualização indicada no
        topo.
      </p>

      <h2>7. Mais informações</h2>
      <p>
        Para questões sobre esta política de cookies, o utilizador pode
        escrever-nos para <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ou utilizar
        a <Link href={urlContacto(lang)}>página de contacto</Link>.
      </p>
      <p>
        Para mais informações sobre a forma como os dados pessoais são
        tratados, consulte a{" "}
        <Link href={urlPrivacidad(lang)}>Política de Privacidade</Link>.
      </p>
    </>
  );
}

const CONTENIDO: Record<IdiomaLegal, ContenidoCookies> = {
  en: {
    titulo: "Cookie Policy",
    descripcion:
      "Information about the use of cookies on ExploraSpain, the types of cookies used, and how to manage them.",
    ogDescripcion: "Cookies used on ExploraSpain and how to manage them.",
    inicio: "Home",
    actualizado: "Last updated",
    fecha: "April 24, 2026",
    avisoTitulo: "Language version disclaimer",
    avisoTexto:
      "This English version is provided solely for the convenience of non-Spanish-speaking users. The original Spanish version of this document is the legally binding one. In case of any discrepancy or conflict between the two versions, the Spanish version shall prevail. The original Spanish version is available at",
    volver: "← Back to home",
    Cuerpo: CuerpoEn,
  },
  de: {
    titulo: "Cookie-Richtlinie",
    descripcion:
      "Informationen über die Verwendung von Cookies auf ExploraSpain, die verwendeten Cookie-Typen und wie du sie verwalten kannst.",
    ogDescripcion:
      "Auf ExploraSpain verwendete Cookies und wie du sie verwaltest.",
    inicio: "Startseite",
    actualizado: "Zuletzt aktualisiert",
    fecha: "24. April 2026",
    avisoTitulo: "Hinweis zur Sprachversion",
    avisoTexto:
      "Diese deutsche Fassung dient ausschließlich der Orientierung für nicht spanischsprachige Nutzer. Rechtsverbindlich ist allein die spanische Originalfassung dieses Dokuments. Bei Abweichungen oder Widersprüchen zwischen den Fassungen hat die spanische Version Vorrang. Die spanische Originalfassung ist verfügbar unter",
    volver: "← Zurück zur Startseite",
    Cuerpo: CuerpoDe,
  },
  fr: {
    titulo: "Politique de cookies",
    descripcion:
      "Informations sur l’utilisation des cookies sur ExploraSpain, les types de cookies utilisés et la manière de les gérer.",
    ogDescripcion:
      "Les cookies utilisés sur ExploraSpain et comment les gérer.",
    inicio: "Accueil",
    actualizado: "Dernière mise à jour",
    fecha: "24 avril 2026",
    avisoTitulo: "Avertissement sur la version linguistique",
    avisoTexto:
      "Cette version française est fournie uniquement pour faciliter la lecture aux utilisateurs non hispanophones. Seule la version originale en espagnol de ce document fait foi juridiquement. En cas de divergence ou de contradiction entre les versions, la version espagnole prévaut. La version originale en espagnol est disponible à l’adresse",
    volver: "← Retour à l’accueil",
    Cuerpo: CuerpoFr,
  },
  it: {
    titulo: "Cookie policy",
    descripcion:
      "Informazioni sull’uso dei cookie su ExploraSpain, sui tipi di cookie utilizzati e su come gestirli.",
    ogDescripcion: "I cookie utilizzati su ExploraSpain e come gestirli.",
    inicio: "Home",
    actualizado: "Ultimo aggiornamento",
    fecha: "24 aprile 2026",
    avisoTitulo: "Avviso sulla versione linguistica",
    avisoTexto:
      "Questa versione italiana è fornita esclusivamente per comodità degli utenti che non parlano spagnolo. L’unica versione giuridicamente vincolante è quella originale in spagnolo di questo documento. In caso di discrepanza o contrasto tra le versioni, prevale la versione spagnola. La versione originale in spagnolo è disponibile su",
    volver: "← Torna alla home",
    Cuerpo: CuerpoIt,
  },
  pt: {
    titulo: "Política de Cookies",
    descripcion:
      "Informação sobre a utilização de cookies na ExploraSpain, os tipos de cookies utilizados e como geri-los.",
    ogDescripcion: "Cookies utilizados na ExploraSpain e como geri-los.",
    inicio: "Início",
    actualizado: "Última atualização",
    fecha: "24 de abril de 2026",
    avisoTitulo: "Aviso sobre a versão linguística",
    avisoTexto:
      "Esta versão em português é disponibilizada apenas para conveniência dos utilizadores que não falam espanhol. A única versão juridicamente vinculativa é a versão original em espanhol deste documento. Em caso de divergência ou contradição entre as versões, prevalece a versão espanhola. A versão original em espanhol está disponível em",
    volver: "← Voltar ao início",
    Cuerpo: CuerpoPt,
  },
};

export function generateStaticParams(): Array<{ lang: Idioma }> {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = params;
  if (!esIdiomaLegal(lang)) {
    return {};
  }
  const t = CONTENIDO[lang];

  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
  const canonicalUrl = `${siteUrl}${urlCookies(lang)}`;
  const languages = hreflangAlternates((l) => urlCookies(l));

  return {
    title: t.titulo,
    description: t.descripcion,
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
      title: `${t.titulo} | ExploraSpain`,
      description: t.ogDescripcion,
    },
  };
}

export default function CookiesPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;
  if (!esIdiomaLegal(lang)) {
    notFound();
  }
  const t = CONTENIDO[lang];
  const { Cuerpo } = t;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
  const pageUrl = `${siteUrl}${urlCookies(lang)}`;
  const homeUrl = `${siteUrl}${prefijoIdioma(lang) || "/"}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.inicio,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.titulo,
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

      <section className="bg-anil-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold mb-2">
            {t.titulo}
          </h1>
          <p className="text-anil-50">
            {t.actualizado}: {t.fecha}
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-fraunces prose-headings:text-piedra-900 prose-a:text-anil-600">
          <Cuerpo lang={lang} />
        </div>

        {/* Cláusula prevails — caja gris fuera del prose */}
        <aside
          className="mt-12 p-6 bg-piedra-50 border border-piedra-200 rounded-lg text-sm text-piedra-700"
          aria-label={t.avisoTitulo}
        >
          <p className="font-semibold text-piedra-900 mb-2">{t.avisoTitulo}</p>
          <p>
            {t.avisoTexto}{" "}
            <Link
              href="/cookies"
              className="text-anil-600 hover:text-anil-700 underline"
            >
              /cookies
            </Link>
            .
          </p>
        </aside>

        <div className="mt-12 text-center">
          <Link
            href={`/${lang}`}
            className="text-anil-600 hover:text-anil-700 font-semibold"
          >
            {t.volver}
          </Link>
        </div>
      </article>
    </main>
  );
}
