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

interface ContenidoAvisoLegal {
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

function esIdiomaLegal(lang: string): lang is IdiomaLegal {
  return esIdiomaActivo(lang) && lang !== "es";
}

const EMAIL = "contacto@exploraspain.com";

function CuerpoEn({ lang }: CuerpoProps) {
  return (
    <>
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
          <strong>Registered office</strong>: Calle Castelló 117, 28006 Madrid,
          Spain
        </li>
        <li>
          <strong>Email</strong>: {EMAIL}
        </li>
        <li>
          <strong>Website</strong>: https://exploraspain.com
        </li>
        <li>
          <strong>Activity</strong>: sale of tours and tourism activities in
          Spain and publication of editorial content about travel and tourism,
          including affiliate links to third-party platforms.
        </li>
      </ul>

      <h2>2. Purpose and scope</h2>
      <p>
        This legal notice governs the use of the website{" "}
        <strong>exploraspain.com</strong> (hereinafter, &ldquo;the
        website&rdquo;), made available by the owner to provide informational
        and editorial content about traveling in Spain, sell tours and tourism
        activities, and link to third-party tourism products and services.
      </p>
      <p>
        Access to and use of the website confers user status and implies full
        acceptance of the terms set out in this legal notice, as well as of the{" "}
        <Link href={urlPrivacidad(lang)}>Privacy Policy</Link> and{" "}
        <Link href={urlCookies(lang)}>Cookie Policy</Link>.
      </p>

      <h2>3. Terms of use</h2>
      <p>
        The user agrees to use the website lawfully and appropriately, in
        accordance with applicable law, this legal notice, public morals and
        public order.
      </p>
      <p>The following are prohibited:</p>
      <ul>
        <li>
          Using the website for unlawful purposes or in ways that may harm the
          interests of the owner or third parties.
        </li>
        <li>
          Introducing computer viruses, defective files or any other program
          that may damage the website or the systems of the owner or third
          parties.
        </li>
        <li>
          Engaging in abusive use of the website, such as mass scraping,
          automated data collection or unauthorized reproduction of content.
        </li>
        <li>Impersonating the owner or any other user.</li>
      </ul>

      <h2>4. Intellectual and industrial property</h2>
      <p>
        All website content (text, images, graphics, design, source code,
        logos, trademarks and other elements) is owned by SKYWARD PARTNERS,
        S.L. or by third parties who have authorized its use, and is protected
        by Spanish and international intellectual and industrial property law.
      </p>
      <p>
        Reproduction, distribution, public communication, transformation or any
        other form of exploitation of the content is expressly prohibited
        without prior and express authorization from the owner, except for the
        user&rsquo;s personal and private use.
      </p>
      <p>
        Brief quotations from the content are permitted for informational or
        educational purposes, provided that the source is cited and the
        original website is linked.
      </p>

      <h2>5. Affiliate and third-party links</h2>
      <p>
        The website includes links to third-party platforms, including
        affiliate links (for example, to GetYourGuide or similar). When a user
        makes a purchase or booking through these links, the owner may receive
        a commission, at no additional cost to the user.
      </p>
      <p>
        The owner is not responsible for the content, business practices,
        privacy policies or terms of use of linked websites. Access to these
        sites is at the user&rsquo;s own risk.
      </p>

      <h2>6. Disclaimer of warranties and liability</h2>
      <p>
        The owner makes its best efforts to ensure that the information
        published on the website is accurate, up-to-date and of high quality.
        However, the owner does not warrant the accuracy, completeness or
        timeliness of all information, particularly with respect to prices,
        opening hours, availability or terms of third-party products and
        services.
      </p>
      <p>
        The user accepts that the published information is provided for
        guidance only and should be verified through official sources before
        making travel or booking decisions. The owner is not liable for any
        damages or losses arising from the use of the information on the
        website.
      </p>
      <p>
        The owner does not guarantee continuous availability of the website and
        reserves the right to suspend, interrupt or modify access to it for
        technical, maintenance or any other justified reasons.
      </p>

      <h2>7. Modification of the legal notice</h2>
      <p>
        The owner reserves the right to modify this legal notice at any time,
        in order to adapt it to legislative, operational or other changes. The
        version in force will always be the one published on this page.
      </p>

      <h2>8. Applicable law and jurisdiction</h2>
      <p>
        This legal notice is governed by Spanish law. Any dispute arising from
        access to or use of the website shall be submitted to the courts and
        tribunals of the owner&rsquo;s domicile, unless applicable law provides
        otherwise based on the user&rsquo;s consumer status.
      </p>

      <h2>9. Contact</h2>
      <p>
        For any questions regarding this legal notice, please contact us
        through the <Link href={urlContacto(lang)}>contact page</Link> or by
        writing to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </>
  );
}

function CuerpoDe({ lang }: CuerpoProps) {
  return (
    <>
      <h2>1. Angaben zum Betreiber</h2>
      <p>
        Gemäß dem spanischen Gesetz 34/2002 vom 11. Juli über Dienstleistungen
        der Informationsgesellschaft und den elektronischen Geschäftsverkehr
        (LSSI-CE) werden folgende Angaben zum Betreiber dieser Website gemacht:
      </p>
      <ul>
        <li>
          <strong>Betreiber</strong>: SKYWARD PARTNERS, S.L.
        </li>
        <li>
          <strong>Steuernummer (NIF)</strong>: B26629576
        </li>
        <li>
          <strong>Firmensitz</strong>: Calle Castelló 117, 28006 Madrid,
          Spanien
        </li>
        <li>
          <strong>E-Mail</strong>: {EMAIL}
        </li>
        <li>
          <strong>Website</strong>: https://exploraspain.com
        </li>
        <li>
          <strong>Tätigkeit</strong>: Verkauf von Touren und touristischen
          Aktivitäten in Spanien sowie Veröffentlichung redaktioneller Inhalte
          über Reisen und Tourismus, einschließlich Affiliate-Links zu
          Plattformen Dritter.
        </li>
      </ul>

      <h2>2. Zweck und Geltungsbereich</h2>
      <p>
        Dieses Impressum regelt die Nutzung der Website{" "}
        <strong>exploraspain.com</strong> (im Folgenden &bdquo;die
        Website&ldquo;), die vom Betreiber bereitgestellt wird, um informative
        und redaktionelle Inhalte über das Reisen in Spanien anzubieten, Touren
        und touristische Aktivitäten zu verkaufen und auf touristische Produkte
        und Dienstleistungen Dritter zu verlinken.
      </p>
      <p>
        Der Zugriff auf und die Nutzung der Website verleihen den Status als
        Nutzer und beinhalten die vollständige Annahme der in diesem Impressum
        festgelegten Bedingungen sowie der{" "}
        <Link href={urlPrivacidad(lang)}>Datenschutzerklärung</Link> und der{" "}
        <Link href={urlCookies(lang)}>Cookie-Richtlinie</Link>.
      </p>

      <h2>3. Nutzungsbedingungen</h2>
      <p>
        Der Nutzer verpflichtet sich, die Website rechtmäßig und angemessen zu
        nutzen, in Übereinstimmung mit geltendem Recht, diesem Impressum, guten
        Sitten und öffentlicher Ordnung.
      </p>
      <p>Untersagt sind insbesondere:</p>
      <ul>
        <li>
          Die Nutzung der Website für rechtswidrige Zwecke oder auf eine Weise,
          die den Interessen des Betreibers oder Dritter schaden könnte.
        </li>
        <li>
          Das Einschleusen von Computerviren, defekten Dateien oder anderen
          Programmen, die die Website oder die Systeme des Betreibers oder
          Dritter beschädigen könnten.
        </li>
        <li>
          Missbräuchliche Nutzung der Website, wie massenhaftes Scraping,
          automatisierte Datenerfassung oder unbefugte Vervielfältigung von
          Inhalten.
        </li>
        <li>Sich als der Betreiber oder als ein anderer Nutzer auszugeben.</li>
      </ul>

      <h2>4. Geistiges und gewerbliches Eigentum</h2>
      <p>
        Sämtliche Inhalte der Website (Texte, Bilder, Grafiken, Design,
        Quellcode, Logos, Marken und andere Elemente) sind Eigentum von SKYWARD
        PARTNERS, S.L. oder Dritter, die deren Nutzung genehmigt haben, und sind
        durch spanisches und internationales Recht zum Schutz geistigen und
        gewerblichen Eigentums geschützt.
      </p>
      <p>
        Die Vervielfältigung, Verbreitung, öffentliche Wiedergabe, Bearbeitung
        oder jede andere Form der Verwertung der Inhalte ist ohne vorherige
        ausdrückliche Genehmigung des Betreibers ausdrücklich untersagt, mit
        Ausnahme der persönlichen und privaten Nutzung durch den Nutzer.
      </p>
      <p>
        Kurze Zitate aus den Inhalten sind zu Informations- oder
        Bildungszwecken gestattet, sofern die Quelle genannt und auf die
        Original-Website verlinkt wird.
      </p>

      <h2>5. Affiliate-Links und Links zu Dritten</h2>
      <p>
        Die Website enthält Links zu Plattformen Dritter, einschließlich
        Affiliate-Links (zum Beispiel zu GetYourGuide oder ähnlichen). Wenn ein
        Nutzer über diese Links einen Kauf oder eine Buchung tätigt, kann der
        Betreiber eine Provision erhalten, ohne zusätzliche Kosten für den
        Nutzer.
      </p>
      <p>
        Der Betreiber übernimmt keine Verantwortung für die Inhalte,
        Geschäftspraktiken, Datenschutzrichtlinien oder Nutzungsbedingungen der
        verlinkten Websites. Der Zugriff auf diese Seiten erfolgt auf eigenes
        Risiko des Nutzers.
      </p>

      <h2>6. Haftungs- und Gewährleistungsausschluss</h2>
      <p>
        Der Betreiber bemüht sich nach besten Kräften, dafür zu sorgen, dass
        die auf der Website veröffentlichten Informationen korrekt, aktuell und
        von hoher Qualität sind. Der Betreiber übernimmt jedoch keine Gewähr
        für die Richtigkeit, Vollständigkeit oder Aktualität sämtlicher
        Informationen, insbesondere in Bezug auf Preise, Öffnungszeiten,
        Verfügbarkeit oder Bedingungen von Produkten und Dienstleistungen
        Dritter.
      </p>
      <p>
        Der Nutzer akzeptiert, dass die veröffentlichten Informationen
        lediglich zur Orientierung dienen und vor Reise- oder
        Buchungsentscheidungen über offizielle Quellen überprüft werden
        sollten. Der Betreiber haftet nicht für Schäden oder Verluste, die aus
        der Nutzung der Informationen auf der Website entstehen.
      </p>
      <p>
        Der Betreiber garantiert keine durchgehende Verfügbarkeit der Website
        und behält sich das Recht vor, den Zugang aus technischen,
        wartungsbedingten oder anderen gerechtfertigten Gründen auszusetzen, zu
        unterbrechen oder zu ändern.
      </p>

      <h2>7. Änderung des Impressums</h2>
      <p>
        Der Betreiber behält sich das Recht vor, dieses Impressum jederzeit zu
        ändern, um es an gesetzliche, betriebliche oder sonstige Änderungen
        anzupassen. Es gilt stets die auf dieser Seite veröffentlichte Fassung.
      </p>

      <h2>8. Anwendbares Recht und Gerichtsstand</h2>
      <p>
        Dieses Impressum unterliegt spanischem Recht. Jede Streitigkeit, die
        sich aus dem Zugriff auf oder der Nutzung der Website ergibt, wird den
        Gerichten am Sitz des Betreibers vorgelegt, sofern das anwendbare Recht
        aufgrund des Verbraucherstatus des Nutzers nichts anderes vorsieht.
      </p>

      <h2>9. Kontakt</h2>
      <p>
        Bei Fragen zu diesem Impressum kontaktiere uns bitte über die{" "}
        <Link href={urlContacto(lang)}>Kontaktseite</Link> oder per E-Mail an{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </>
  );
}

function CuerpoFr({ lang }: CuerpoProps) {
  return (
    <>
      <h2>1. Identification de l’éditeur</h2>
      <p>
        Conformément à la loi espagnole 34/2002 du 11 juillet relative aux
        services de la société de l’information et au commerce électronique
        (LSSI-CE), les informations suivantes concernant l’éditeur de ce site
        sont fournies :
      </p>
      <ul>
        <li>
          <strong>Éditeur</strong> : SKYWARD PARTNERS, S.L.
        </li>
        <li>
          <strong>Numéro d’identification fiscale (NIF)</strong> : B26629576
        </li>
        <li>
          <strong>Siège social</strong> : Calle Castelló 117, 28006 Madrid,
          Espagne
        </li>
        <li>
          <strong>E-mail</strong> : {EMAIL}
        </li>
        <li>
          <strong>Site web</strong> : https://exploraspain.com
        </li>
        <li>
          <strong>Activité</strong> : vente de visites et d’activités
          touristiques en Espagne et publication de contenus éditoriaux sur le
          voyage et le tourisme, y compris des liens d’affiliation vers des
          plateformes tierces.
        </li>
      </ul>

      <h2>2. Objet et champ d’application</h2>
      <p>
        Les présentes mentions légales régissent l’utilisation du site{" "}
        <strong>exploraspain.com</strong> (ci-après « le site »), mis à
        disposition par l’éditeur afin de proposer des contenus informatifs et
        éditoriaux sur les voyages en Espagne, de vendre des visites et des
        activités touristiques et de renvoyer vers des produits et services
        touristiques de tiers.
      </p>
      <p>
        L’accès au site et son utilisation confèrent la qualité d’utilisateur
        et impliquent l’acceptation pleine et entière des conditions énoncées
        dans les présentes mentions légales, ainsi que de la{" "}
        <Link href={urlPrivacidad(lang)}>Politique de confidentialité</Link> et
        de la <Link href={urlCookies(lang)}>Politique de cookies</Link>.
      </p>

      <h2>3. Conditions d’utilisation</h2>
      <p>
        L’utilisateur s’engage à utiliser le site de manière licite et
        appropriée, conformément à la législation applicable, aux présentes
        mentions légales, aux bonnes mœurs et à l’ordre public.
      </p>
      <p>Sont notamment interdits :</p>
      <ul>
        <li>
          L’utilisation du site à des fins illicites ou d’une manière
          susceptible de nuire aux intérêts de l’éditeur ou de tiers.
        </li>
        <li>
          L’introduction de virus informatiques, de fichiers défectueux ou de
          tout autre programme susceptible d’endommager le site ou les systèmes
          de l’éditeur ou de tiers.
        </li>
        <li>
          Toute utilisation abusive du site, telle que le scraping massif, la
          collecte automatisée de données ou la reproduction non autorisée de
          contenus.
        </li>
        <li>Le fait de se faire passer pour l’éditeur ou pour un autre utilisateur.</li>
      </ul>

      <h2>4. Propriété intellectuelle et industrielle</h2>
      <p>
        L’ensemble des contenus du site (textes, images, graphismes, design,
        code source, logos, marques et autres éléments) est la propriété de
        SKYWARD PARTNERS, S.L. ou de tiers ayant autorisé leur utilisation, et
        est protégé par la législation espagnole et internationale en matière
        de propriété intellectuelle et industrielle.
      </p>
      <p>
        Toute reproduction, distribution, communication publique,
        transformation ou toute autre forme d’exploitation des contenus est
        expressément interdite sans l’autorisation préalable et expresse de
        l’éditeur, à l’exception de l’usage personnel et privé de
        l’utilisateur.
      </p>
      <p>
        Les citations brèves des contenus sont autorisées à des fins
        d’information ou d’enseignement, à condition d’en citer la source et
        d’inclure un lien vers le site d’origine.
      </p>

      <h2>5. Liens d’affiliation et liens vers des tiers</h2>
      <p>
        Le site contient des liens vers des plateformes tierces, y compris des
        liens d’affiliation (par exemple vers GetYourGuide ou des plateformes
        similaires). Lorsqu’un utilisateur effectue un achat ou une
        réservation via ces liens, l’éditeur peut percevoir une commission,
        sans coût supplémentaire pour l’utilisateur.
      </p>
      <p>
        L’éditeur n’est pas responsable des contenus, pratiques commerciales,
        politiques de confidentialité ou conditions d’utilisation des sites
        liés. L’accès à ces sites se fait aux propres risques de
        l’utilisateur.
      </p>

      <h2>6. Exclusion de garanties et de responsabilité</h2>
      <p>
        L’éditeur met tout en œuvre pour que les informations publiées sur le
        site soient exactes, à jour et de qualité. Toutefois, l’éditeur ne
        garantit pas l’exactitude, l’exhaustivité ni l’actualité de
        l’ensemble des informations, notamment en ce qui concerne les prix,
        les horaires, la disponibilité ou les conditions des produits et
        services de tiers.
      </p>
      <p>
        L’utilisateur accepte que les informations publiées soient fournies à
        titre indicatif et doivent être vérifiées auprès de sources officielles
        avant toute décision de voyage ou de réservation. L’éditeur ne saurait
        être tenu responsable des dommages ou pertes résultant de
        l’utilisation des informations du site.
      </p>
      <p>
        L’éditeur ne garantit pas la disponibilité continue du site et se
        réserve le droit d’en suspendre, interrompre ou modifier l’accès pour
        des raisons techniques, de maintenance ou pour tout autre motif
        justifié.
      </p>

      <h2>7. Modification des mentions légales</h2>
      <p>
        L’éditeur se réserve le droit de modifier les présentes mentions
        légales à tout moment, afin de les adapter à des évolutions
        législatives, opérationnelles ou autres. La version en vigueur est
        toujours celle publiée sur cette page.
      </p>

      <h2>8. Droit applicable et juridiction compétente</h2>
      <p>
        Les présentes mentions légales sont régies par le droit espagnol. Tout
        litige découlant de l’accès au site ou de son utilisation sera soumis
        aux cours et tribunaux du domicile de l’éditeur, sauf si la loi
        applicable en dispose autrement en raison de la qualité de
        consommateur de l’utilisateur.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question concernant les présentes mentions légales, vous
        pouvez nous contacter via la{" "}
        <Link href={urlContacto(lang)}>page de contact</Link> ou en écrivant à{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </>
  );
}

function CuerpoIt({ lang }: CuerpoProps) {
  return (
    <>
      <h2>1. Dati identificativi del titolare</h2>
      <p>
        In conformità con la Legge spagnola 34/2002, dell’11 luglio, sui
        servizi della società dell’informazione e sul commercio elettronico
        (LSSI-CE), si forniscono le seguenti informazioni sul titolare di
        questo sito web:
      </p>
      <ul>
        <li>
          <strong>Titolare</strong>: SKYWARD PARTNERS, S.L.
        </li>
        <li>
          <strong>Codice fiscale (NIF)</strong>: B26629576
        </li>
        <li>
          <strong>Sede legale</strong>: Calle Castelló 117, 28006 Madrid,
          Spagna
        </li>
        <li>
          <strong>Email</strong>: {EMAIL}
        </li>
        <li>
          <strong>Sito web</strong>: https://exploraspain.com
        </li>
        <li>
          <strong>Attività</strong>: vendita di tour e attività turistiche in
          Spagna e pubblicazione di contenuti editoriali su viaggi e turismo,
          inclusi link di affiliazione a piattaforme di terze parti.
        </li>
      </ul>

      <h2>2. Oggetto e ambito di applicazione</h2>
      <p>
        Le presenti note legali disciplinano l’utilizzo del sito web{" "}
        <strong>exploraspain.com</strong> (di seguito, «il sito»), messo a
        disposizione dal titolare per offrire contenuti informativi ed
        editoriali sui viaggi in Spagna, vendere tour e attività turistiche e
        rimandare a prodotti e servizi turistici di terze parti.
      </p>
      <p>
        L’accesso al sito e il suo utilizzo attribuiscono la qualifica di
        utente e comportano la piena accettazione delle condizioni stabilite
        nelle presenti note legali, nonché dell’
        <Link href={urlPrivacidad(lang)}>Informativa sulla privacy</Link> e
        della <Link href={urlCookies(lang)}>Cookie policy</Link>.
      </p>

      <h2>3. Condizioni d’uso</h2>
      <p>
        L’utente si impegna a utilizzare il sito in modo lecito e appropriato,
        nel rispetto della legge applicabile, delle presenti note legali, del
        buon costume e dell’ordine pubblico.
      </p>
      <p>È vietato in particolare:</p>
      <ul>
        <li>
          Utilizzare il sito per scopi illeciti o in modi che possano
          danneggiare gli interessi del titolare o di terzi.
        </li>
        <li>
          Introdurre virus informatici, file danneggiati o qualsiasi altro
          programma che possa danneggiare il sito o i sistemi del titolare o di
          terzi.
        </li>
        <li>
          Fare un uso abusivo del sito, come lo scraping massivo, la raccolta
          automatizzata di dati o la riproduzione non autorizzata dei
          contenuti.
        </li>
        <li>Spacciarsi per il titolare o per qualsiasi altro utente.</li>
      </ul>

      <h2>4. Proprietà intellettuale e industriale</h2>
      <p>
        Tutti i contenuti del sito (testi, immagini, grafiche, design, codice
        sorgente, loghi, marchi e altri elementi) sono di proprietà di SKYWARD
        PARTNERS, S.L. o di terzi che ne hanno autorizzato l’uso, e sono
        tutelati dalla normativa spagnola e internazionale in materia di
        proprietà intellettuale e industriale.
      </p>
      <p>
        È espressamente vietata la riproduzione, distribuzione, comunicazione
        pubblica, trasformazione o qualsiasi altra forma di sfruttamento dei
        contenuti senza la previa ed espressa autorizzazione del titolare,
        fatto salvo l’uso personale e privato da parte dell’utente.
      </p>
      <p>
        Sono consentite brevi citazioni dei contenuti a fini informativi o
        didattici, purché venga citata la fonte e venga inserito un link al
        sito originale.
      </p>

      <h2>5. Link di affiliazione e a terze parti</h2>
      <p>
        Il sito include link a piattaforme di terze parti, compresi link di
        affiliazione (ad esempio a GetYourGuide o simili). Quando un utente
        effettua un acquisto o una prenotazione tramite questi link, il
        titolare può ricevere una commissione, senza costi aggiuntivi per
        l’utente.
      </p>
      <p>
        Il titolare non è responsabile dei contenuti, delle pratiche
        commerciali, delle informative sulla privacy o delle condizioni d’uso
        dei siti collegati. L’accesso a tali siti avviene a rischio
        dell’utente.
      </p>

      <h2>6. Esclusione di garanzie e di responsabilità</h2>
      <p>
        Il titolare fa del suo meglio affinché le informazioni pubblicate sul
        sito siano accurate, aggiornate e di qualità. Tuttavia, il titolare non
        garantisce l’accuratezza, la completezza o l’attualità di tutte le
        informazioni, in particolare per quanto riguarda prezzi, orari,
        disponibilità o condizioni di prodotti e servizi di terze parti.
      </p>
      <p>
        L’utente accetta che le informazioni pubblicate hanno valore
        puramente indicativo e devono essere verificate tramite fonti ufficiali
        prima di prendere decisioni di viaggio o di prenotazione. Il titolare
        non è responsabile di eventuali danni o perdite derivanti dall’uso
        delle informazioni presenti sul sito.
      </p>
      <p>
        Il titolare non garantisce la disponibilità continua del sito e si
        riserva il diritto di sospenderne, interromperne o modificarne
        l’accesso per motivi tecnici, di manutenzione o per qualsiasi altro
        motivo giustificato.
      </p>

      <h2>7. Modifica delle note legali</h2>
      <p>
        Il titolare si riserva il diritto di modificare le presenti note legali
        in qualsiasi momento, per adeguarle a modifiche normative, operative o
        di altro tipo. La versione in vigore è sempre quella pubblicata in
        questa pagina.
      </p>

      <h2>8. Legge applicabile e foro competente</h2>
      <p>
        Le presenti note legali sono disciplinate dalla legge spagnola.
        Qualsiasi controversia derivante dall’accesso al sito o dal suo
        utilizzo sarà sottoposta ai giudici e ai tribunali del domicilio del
        titolare, salvo che la legge applicabile disponga diversamente in
        ragione della qualità di consumatore dell’utente.
      </p>

      <h2>9. Contatti</h2>
      <p>
        Per qualsiasi domanda su queste note legali, contattaci tramite la{" "}
        <Link href={urlContacto(lang)}>pagina dei contatti</Link> o scrivendo
        a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </>
  );
}

function CuerpoPt({ lang }: CuerpoProps) {
  return (
    <>
      <h2>1. Identificação do titular</h2>
      <p>
        Em cumprimento da Lei espanhola 34/2002, de 11 de julho, sobre os
        Serviços da Sociedade da Informação e o Comércio Eletrónico (LSSI-CE),
        são disponibilizadas as seguintes informações sobre o titular deste
        website:
      </p>
      <ul>
        <li>
          <strong>Titular</strong>: SKYWARD PARTNERS, S.L.
        </li>
        <li>
          <strong>Número de identificação fiscal (NIF)</strong>: B26629576
        </li>
        <li>
          <strong>Sede social</strong>: Calle Castelló 117, 28006 Madrid,
          Espanha
        </li>
        <li>
          <strong>E-mail</strong>: {EMAIL}
        </li>
        <li>
          <strong>Website</strong>: https://exploraspain.com
        </li>
        <li>
          <strong>Atividade</strong>: venda de tours e atividades turísticas em
          Espanha e publicação de conteúdos editoriais sobre viagens e turismo,
          incluindo links de afiliação para plataformas de terceiros.
        </li>
      </ul>

      <h2>2. Objeto e âmbito</h2>
      <p>
        O presente aviso legal regula a utilização do website{" "}
        <strong>exploraspain.com</strong> (doravante, «o website»),
        disponibilizado pelo titular para oferecer conteúdos informativos e
        editoriais sobre viagens em Espanha, vender tours e atividades
        turísticas e remeter para produtos e serviços turísticos de terceiros.
      </p>
      <p>
        O acesso e a utilização do website conferem a condição de utilizador e
        implicam a aceitação plena das condições estabelecidas neste aviso
        legal, bem como da{" "}
        <Link href={urlPrivacidad(lang)}>Política de Privacidade</Link> e da{" "}
        <Link href={urlCookies(lang)}>Política de Cookies</Link>.
      </p>

      <h2>3. Condições de utilização</h2>
      <p>
        O utilizador compromete-se a utilizar o website de forma lícita e
        adequada, de acordo com a legislação aplicável, com este aviso legal,
        com os bons costumes e com a ordem pública.
      </p>
      <p>É proibido, nomeadamente:</p>
      <ul>
        <li>
          Utilizar o website para fins ilícitos ou de forma que possa
          prejudicar os interesses do titular ou de terceiros.
        </li>
        <li>
          Introduzir vírus informáticos, ficheiros defeituosos ou qualquer
          outro programa que possa danificar o website ou os sistemas do
          titular ou de terceiros.
        </li>
        <li>
          Fazer uma utilização abusiva do website, como scraping massivo,
          recolha automatizada de dados ou reprodução não autorizada de
          conteúdos.
        </li>
        <li>Fazer-se passar pelo titular ou por qualquer outro utilizador.</li>
      </ul>

      <h2>4. Propriedade intelectual e industrial</h2>
      <p>
        Todos os conteúdos do website (textos, imagens, gráficos, design,
        código-fonte, logótipos, marcas e outros elementos) são propriedade da
        SKYWARD PARTNERS, S.L. ou de terceiros que autorizaram a sua
        utilização, e estão protegidos pela legislação espanhola e
        internacional de propriedade intelectual e industrial.
      </p>
      <p>
        É expressamente proibida a reprodução, distribuição, comunicação
        pública, transformação ou qualquer outra forma de exploração dos
        conteúdos sem autorização prévia e expressa do titular, salvo para uso
        pessoal e privado do utilizador.
      </p>
      <p>
        São permitidas citações breves dos conteúdos para fins informativos ou
        educativos, desde que seja indicada a fonte e incluído um link para o
        website original.
      </p>

      <h2>5. Links de afiliação e de terceiros</h2>
      <p>
        O website inclui links para plataformas de terceiros, incluindo links
        de afiliação (por exemplo, para a GetYourGuide ou semelhantes). Quando
        um utilizador efetua uma compra ou reserva através destes links, o
        titular pode receber uma comissão, sem custo adicional para o
        utilizador.
      </p>
      <p>
        O titular não é responsável pelos conteúdos, práticas comerciais,
        políticas de privacidade ou condições de utilização dos websites
        ligados. O acesso a esses websites é feito por conta e risco do
        utilizador.
      </p>

      <h2>6. Exclusão de garantias e de responsabilidade</h2>
      <p>
        O titular envida os seus melhores esforços para que a informação
        publicada no website seja exata, atual e de qualidade. No entanto, o
        titular não garante a exatidão, a integralidade ou a atualidade de
        toda a informação, em especial no que se refere a preços, horários,
        disponibilidade ou condições de produtos e serviços de terceiros.
      </p>
      <p>
        O utilizador aceita que a informação publicada tem caráter meramente
        orientativo e deve ser confirmada junto de fontes oficiais antes de
        tomar decisões de viagem ou de reserva. O titular não é responsável
        por quaisquer danos ou prejuízos decorrentes da utilização da
        informação do website.
      </p>
      <p>
        O titular não garante a disponibilidade contínua do website e
        reserva-se o direito de suspender, interromper ou modificar o acesso
        ao mesmo por motivos técnicos, de manutenção ou por qualquer outro
        motivo justificado.
      </p>

      <h2>7. Alteração do aviso legal</h2>
      <p>
        O titular reserva-se o direito de alterar este aviso legal a qualquer
        momento, para o adaptar a alterações legislativas, operacionais ou de
        outra natureza. A versão em vigor será sempre a publicada nesta
        página.
      </p>

      <h2>8. Lei aplicável e foro competente</h2>
      <p>
        O presente aviso legal rege-se pela lei espanhola. Qualquer litígio
        decorrente do acesso ou da utilização do website será submetido aos
        tribunais do domicílio do titular, salvo se a lei aplicável dispuser
        de outro modo em virtude da condição de consumidor do utilizador.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para qualquer questão sobre este aviso legal, o utilizador pode
        contactar-nos através da{" "}
        <Link href={urlContacto(lang)}>página de contacto</Link> ou escrever
        para <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </>
  );
}

const CONTENIDO: Record<IdiomaLegal, ContenidoAvisoLegal> = {
  en: {
    titulo: "Legal Notice",
    descripcion:
      "Legal information about the owner of the ExploraSpain website, in compliance with Spanish Law 34/2002 (LSSI-CE).",
    ogDescripcion: "Legal information about the owner of ExploraSpain.",
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
    titulo: "Impressum",
    descripcion:
      "Rechtliche Angaben zum Betreiber der Website ExploraSpain, gemäß dem spanischen Gesetz 34/2002 (LSSI-CE).",
    ogDescripcion: "Rechtliche Angaben zum Betreiber von ExploraSpain.",
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
    titulo: "Mentions légales",
    descripcion:
      "Informations légales sur l’éditeur du site ExploraSpain, conformément à la loi espagnole 34/2002 (LSSI-CE).",
    ogDescripcion: "Informations légales sur l’éditeur d’ExploraSpain.",
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
    titulo: "Note legali",
    descripcion:
      "Informazioni legali sul titolare del sito web ExploraSpain, in conformità con la Legge spagnola 34/2002 (LSSI-CE).",
    ogDescripcion: "Informazioni legali sul titolare di ExploraSpain.",
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
    titulo: "Aviso Legal",
    descripcion:
      "Informação legal sobre o titular do website ExploraSpain, em conformidade com a Lei espanhola 34/2002 (LSSI-CE).",
    ogDescripcion: "Informação legal sobre o titular da ExploraSpain.",
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
  const canonicalUrl = `${siteUrl}${urlAvisoLegal(lang)}`;
  const languages = hreflangAlternates((l) => urlAvisoLegal(l));

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

export default function LegalNoticePage({
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
  const pageUrl = `${siteUrl}${urlAvisoLegal(lang)}`;
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
              href="/aviso-legal"
              className="text-anil-600 hover:text-anil-700 underline"
            >
              /aviso-legal
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
