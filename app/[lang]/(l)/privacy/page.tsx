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
  urlPrivacidad,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

type IdiomaLegal = Exclude<Idioma, "es">;

interface CuerpoProps {
  lang: IdiomaLegal;
}

interface ContenidoPrivacidad {
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
      <p className="text-xl leading-relaxed text-piedra-700">
        At ExploraSpain we take your privacy seriously. This policy explains
        what data we process, for what purpose, and what rights you have, in
        compliance with the GDPR (EU Regulation 2016/679) and the Spanish
        Organic Law 3/2018 on Personal Data Protection (LOPDGDD).
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
          <strong>Registered office</strong>: Calle Castelló 117, 28006 Madrid,
          Spain
        </li>
        <li>
          <strong>Email</strong>: {EMAIL}
        </li>
        <li>
          <strong>Website</strong>: https://exploraspain.com
        </li>
      </ul>

      <h2>2. What data we process</h2>
      <p>
        Depending on how you interact with the website, we may process the
        following data:
      </p>
      <ul>
        <li>
          <strong>Contact data</strong>: when you write to us by email, we
          process the data you choose to provide voluntarily (name, email,
          message content).
        </li>
        <li>
          <strong>Browsing data</strong>: when you visit the site, technical
          data is collected such as IP address, browser type, operating system,
          pages visited, time spent and referrer, through cookies and analytics
          tools, if you accept them.
        </li>
      </ul>
      <p>
        <strong>
          The website does not currently offer user registration, a checkout
          form or newsletter subscription.
        </strong>{" "}
        If these features are added in the future, this policy will be updated
        accordingly.
      </p>

      <h2>3. Purpose and legal basis for processing</h2>
      <ul>
        <li>
          <strong>Responding to your inquiries</strong>: when you write to us,
          we use your email and message data only to reply. Legal basis:
          user&rsquo;s consent when sending the message.
        </li>
        <li>
          <strong>Site usage analytics</strong>: to understand how the site is
          used and improve the content. Legal basis: consent given through the
          cookie banner.
        </li>
        <li>
          <strong>Compliance with legal obligations</strong>: to comply with
          applicable regulations where appropriate. Legal basis: legal
          obligation.
        </li>
      </ul>

      <h2>4. Retention period</h2>
      <p>
        Contact data is retained for as long as necessary to handle your
        inquiry and, afterwards, for the legal period applicable to address
        potential liabilities.
      </p>
      <p>
        Browsing data is retained for the period set out in the cookie policy
        for each tool.
      </p>

      <h2>5. Recipients and international transfers</h2>
      <p>
        Your data is not shared with third parties except where legally
        required. However, the website uses services from providers that may
        have access to browsing data as data processors:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (USA): website hosting. Transfer covered
          by the European Commission&rsquo;s Standard Contractual Clauses.
        </li>
        <li>
          <strong>Google LLC</strong> (USA): web analytics, if you accept
          analytics cookies. Transfer covered by the EU-U.S. Data Privacy
          Framework.
        </li>
        <li>
          <strong>Affiliate platforms</strong> (GetYourGuide or others): when
          you click an affiliate link, you will be redirected to their website,
          which applies its own privacy policy.
        </li>
      </ul>

      <h2>6. Your rights</h2>
      <p>
        As a data subject, you have the following rights, recognized by the
        GDPR and LOPDGDD:
      </p>
      <ul>
        <li>
          <strong>Access</strong>: to know what data we process about you.
        </li>
        <li>
          <strong>Rectification</strong>: to correct inaccurate or incomplete
          data.
        </li>
        <li>
          <strong>Erasure</strong> (&ldquo;right to be forgotten&rdquo;): to
          request that we delete your data when it is no longer necessary.
        </li>
        <li>
          <strong>Objection</strong>: to object to certain processing
          activities.
        </li>
        <li>
          <strong>Restriction</strong>: to ask us to restrict processing in
          certain cases.
        </li>
        <li>
          <strong>Portability</strong>: to receive your data in a structured
          format and transfer it to another controller.
        </li>
        <li>
          <strong>Withdraw consent</strong> at any time, without affecting the
          lawfulness of prior processing.
        </li>
      </ul>
      <p>
        To exercise these rights, write to us at{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> indicating which right you wish
        to exercise and, if necessary, providing proof of your identity.
      </p>
      <p>
        If you believe that the processing of your data does not comply with
        regulations, you may file a complaint with the{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          Spanish Data Protection Agency (AEPD)
        </a>
        .
      </p>

      <h2>7. Security measures</h2>
      <p>
        We apply reasonable technical and organizational measures to protect
        your data against unauthorized access, loss or destruction. The website
        uses encrypted connection (HTTPS) and the contracted services apply
        industry-standard security measures.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        This policy may be updated to reflect legislative, operational or
        service changes. The version in force will always be the one published
        on this page, with the last-updated date shown at the top.
      </p>

      <h2>9. Contact</h2>
      <p>
        For any questions about privacy, write to us at{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or through the{" "}
        <Link href={urlContacto(lang)}>contact page</Link>.
      </p>
    </>
  );
}

function CuerpoDe({ lang }: CuerpoProps) {
  return (
    <>
      <p className="text-xl leading-relaxed text-piedra-700">
        Bei ExploraSpain nehmen wir deinen Datenschutz ernst. Diese Erklärung
        beschreibt, welche Daten wir verarbeiten, zu welchem Zweck und welche
        Rechte du hast, gemäß der DSGVO (EU-Verordnung 2016/679) und dem
        spanischen Organgesetz 3/2018 zum Schutz personenbezogener Daten
        (LOPDGDD).
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
          <strong>Firmensitz</strong>: Calle Castelló 117, 28006 Madrid,
          Spanien
        </li>
        <li>
          <strong>E-Mail</strong>: {EMAIL}
        </li>
        <li>
          <strong>Website</strong>: https://exploraspain.com
        </li>
      </ul>

      <h2>2. Welche Daten wir verarbeiten</h2>
      <p>
        Je nachdem, wie du mit der Website interagierst, verarbeiten wir
        möglicherweise folgende Daten:
      </p>
      <ul>
        <li>
          <strong>Kontaktdaten</strong>: Wenn du uns per E-Mail schreibst,
          verarbeiten wir die Daten, die du freiwillig angibst (Name, E-Mail,
          Nachrichteninhalt).
        </li>
        <li>
          <strong>Nutzungsdaten</strong>: Beim Besuch der Website werden
          technische Daten wie IP-Adresse, Browsertyp, Betriebssystem, besuchte
          Seiten, Verweildauer und Referrer erfasst, über Cookies und
          Analysetools, sofern du diese akzeptierst.
        </li>
      </ul>
      <p>
        <strong>
          Die Website bietet derzeit keine Benutzerregistrierung, kein
          Bestellformular und kein Newsletter-Abonnement an.
        </strong>{" "}
        Sollten diese Funktionen künftig hinzukommen, wird diese Erklärung
        entsprechend aktualisiert.
      </p>

      <h2>3. Zweck und Rechtsgrundlage der Verarbeitung</h2>
      <ul>
        <li>
          <strong>Beantwortung deiner Anfragen</strong>: Wenn du uns schreibst,
          verwenden wir deine E-Mail- und Nachrichtendaten ausschließlich, um
          zu antworten. Rechtsgrundlage: Einwilligung des Nutzers beim Senden
          der Nachricht.
        </li>
        <li>
          <strong>Nutzungsanalyse der Website</strong>: um zu verstehen, wie
          die Website genutzt wird, und den Inhalt zu verbessern.
          Rechtsgrundlage: über den Cookie-Banner erteilte Einwilligung.
        </li>
        <li>
          <strong>Erfüllung gesetzlicher Pflichten</strong>: zur Einhaltung
          geltender Vorschriften, sofern zutreffend. Rechtsgrundlage:
          gesetzliche Verpflichtung.
        </li>
      </ul>

      <h2>4. Aufbewahrungsdauer</h2>
      <p>
        Kontaktdaten werden so lange aufbewahrt, wie es zur Bearbeitung deiner
        Anfrage erforderlich ist, und danach für den gesetzlich vorgesehenen
        Zeitraum zur Abwehr möglicher Haftungsansprüche.
      </p>
      <p>
        Nutzungsdaten werden für den in der Cookie-Richtlinie für das jeweilige
        Tool festgelegten Zeitraum aufbewahrt.
      </p>

      <h2>5. Empfänger und internationale Datenübermittlungen</h2>
      <p>
        Deine Daten werden nicht an Dritte weitergegeben, außer wenn dies
        gesetzlich vorgeschrieben ist. Die Website nutzt jedoch Dienste von
        Anbietern, die als Auftragsverarbeiter Zugriff auf Nutzungsdaten haben
        können:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (USA): Website-Hosting. Die Übermittlung
          ist durch die Standardvertragsklauseln der Europäischen Kommission
          abgedeckt.
        </li>
        <li>
          <strong>Google LLC</strong> (USA): Webanalyse, sofern du
          Analyse-Cookies akzeptierst. Die Übermittlung ist durch das EU-US
          Data Privacy Framework abgedeckt.
        </li>
        <li>
          <strong>Affiliate-Plattformen</strong> (GetYourGuide oder andere):
          Wenn du auf einen Affiliate-Link klickst, wirst du zu deren Website
          weitergeleitet, die ihre eigene Datenschutzerklärung anwendet.
        </li>
      </ul>

      <h2>6. Deine Rechte</h2>
      <p>
        Als betroffene Person hast du gemäß DSGVO und LOPDGDD folgende Rechte:
      </p>
      <ul>
        <li>
          <strong>Auskunft</strong>: zu erfahren, welche Daten wir über dich
          verarbeiten.
        </li>
        <li>
          <strong>Berichtigung</strong>: unrichtige oder unvollständige Daten
          korrigieren zu lassen.
        </li>
        <li>
          <strong>Löschung</strong> (&bdquo;Recht auf Vergessenwerden&ldquo;):
          zu verlangen, dass wir deine Daten löschen, wenn sie nicht mehr
          erforderlich sind.
        </li>
        <li>
          <strong>Widerspruch</strong>: bestimmten Verarbeitungstätigkeiten zu
          widersprechen.
        </li>
        <li>
          <strong>Einschränkung</strong>: uns zu bitten, die Verarbeitung in
          bestimmten Fällen einzuschränken.
        </li>
        <li>
          <strong>Datenübertragbarkeit</strong>: deine Daten in einem
          strukturierten Format zu erhalten und an einen anderen
          Verantwortlichen zu übertragen.
        </li>
        <li>
          <strong>Widerruf der Einwilligung</strong> jederzeit, ohne dass die
          Rechtmäßigkeit der bisherigen Verarbeitung berührt wird.
        </li>
      </ul>
      <p>
        Um diese Rechte auszuüben, schreib uns an{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> und gib an, welches Recht du
        ausüben möchtest, gegebenenfalls mit einem Identitätsnachweis.
      </p>
      <p>
        Wenn du der Ansicht bist, dass die Verarbeitung deiner Daten nicht den
        Vorschriften entspricht, kannst du eine Beschwerde bei der{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          spanischen Datenschutzbehörde (AEPD)
        </a>{" "}
        einreichen.
      </p>

      <h2>7. Sicherheitsmaßnahmen</h2>
      <p>
        Wir wenden angemessene technische und organisatorische Maßnahmen an, um
        deine Daten vor unbefugtem Zugriff, Verlust oder Zerstörung zu
        schützen. Die Website nutzt eine verschlüsselte Verbindung (HTTPS), und
        die beauftragten Dienste wenden branchenübliche Sicherheitsmaßnahmen
        an.
      </p>

      <h2>8. Änderungen dieser Erklärung</h2>
      <p>
        Diese Erklärung kann aktualisiert werden, um gesetzliche, betriebliche
        oder dienstleistungsbezogene Änderungen widerzuspiegeln. Es gilt stets
        die auf dieser Seite veröffentlichte Fassung, mit dem oben angegebenen
        Datum der letzten Aktualisierung.
      </p>

      <h2>9. Kontakt</h2>
      <p>
        Bei Fragen zum Datenschutz schreib uns an{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> oder über die{" "}
        <Link href={urlContacto(lang)}>Kontaktseite</Link>.
      </p>
    </>
  );
}

function CuerpoFr({ lang }: CuerpoProps) {
  return (
    <>
      <p className="text-xl leading-relaxed text-piedra-700">
        Chez ExploraSpain, nous prenons votre vie privée au sérieux. Cette
        politique explique quelles données nous traitons, dans quel but et
        quels sont vos droits, conformément au RGPD (Règlement (UE) 2016/679)
        et à la loi organique espagnole 3/2018 relative à la protection des
        données personnelles (LOPDGDD).
      </p>

      <h2>1. Responsable du traitement</h2>
      <ul>
        <li>
          <strong>Responsable</strong> : SKYWARD PARTNERS, S.L.
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
      </ul>

      <h2>2. Quelles données nous traitons</h2>
      <p>
        Selon la manière dont vous interagissez avec le site, nous pouvons
        traiter les données suivantes :
      </p>
      <ul>
        <li>
          <strong>Données de contact</strong> : lorsque vous nous écrivez par
          e-mail, nous traitons les données que vous choisissez de fournir
          volontairement (nom, e-mail, contenu du message).
        </li>
        <li>
          <strong>Données de navigation</strong> : lorsque vous visitez le
          site, des données techniques sont collectées, telles que l’adresse
          IP, le type de navigateur, le système d’exploitation, les pages
          consultées, le temps passé et le site de provenance, au moyen de
          cookies et d’outils d’analyse, si vous les acceptez.
        </li>
      </ul>
      <p>
        <strong>
          Le site ne propose actuellement ni inscription des utilisateurs, ni
          formulaire de commande, ni abonnement à une newsletter.
        </strong>{" "}
        Si ces fonctionnalités sont ajoutées à l’avenir, cette politique sera
        mise à jour en conséquence.
      </p>

      <h2>3. Finalités et base juridique du traitement</h2>
      <ul>
        <li>
          <strong>Répondre à vos demandes</strong> : lorsque vous nous écrivez,
          nous utilisons votre e-mail et les données de votre message
          uniquement pour vous répondre. Base juridique : consentement de
          l’utilisateur lors de l’envoi du message.
        </li>
        <li>
          <strong>Analyse de l’utilisation du site</strong> : pour comprendre
          comment le site est utilisé et en améliorer le contenu. Base
          juridique : consentement donné via le bandeau de cookies.
        </li>
        <li>
          <strong>Respect des obligations légales</strong> : pour se conformer
          à la réglementation applicable, le cas échéant. Base juridique :
          obligation légale.
        </li>
      </ul>

      <h2>4. Durée de conservation</h2>
      <p>
        Les données de contact sont conservées le temps nécessaire au
        traitement de votre demande, puis pendant le délai légal applicable
        afin de faire face à d’éventuelles responsabilités.
      </p>
      <p>
        Les données de navigation sont conservées pendant la durée indiquée
        dans la politique de cookies pour chaque outil.
      </p>

      <h2>5. Destinataires et transferts internationaux</h2>
      <p>
        Vos données ne sont pas communiquées à des tiers, sauf obligation
        légale. Toutefois, le site utilise les services de prestataires qui
        peuvent avoir accès aux données de navigation en tant que
        sous-traitants :
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (États-Unis) : hébergement du site.
          Transfert encadré par les clauses contractuelles types de la
          Commission européenne.
        </li>
        <li>
          <strong>Google LLC</strong> (États-Unis) : analyse d’audience, si
          vous acceptez les cookies d’analyse. Transfert encadré par le Data
          Privacy Framework UE-États-Unis.
        </li>
        <li>
          <strong>Plateformes d’affiliation</strong> (GetYourGuide ou autres) :
          lorsque vous cliquez sur un lien d’affiliation, vous êtes redirigé
          vers leur site web, qui applique sa propre politique de
          confidentialité.
        </li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        En tant que personne concernée, vous disposez des droits suivants,
        reconnus par le RGPD et la LOPDGDD :
      </p>
      <ul>
        <li>
          <strong>Accès</strong> : savoir quelles données nous traitons à votre
          sujet.
        </li>
        <li>
          <strong>Rectification</strong> : faire corriger des données inexactes
          ou incomplètes.
        </li>
        <li>
          <strong>Effacement</strong> (« droit à l’oubli ») : demander que nous
          supprimions vos données lorsqu’elles ne sont plus nécessaires.
        </li>
        <li>
          <strong>Opposition</strong> : vous opposer à certaines activités de
          traitement.
        </li>
        <li>
          <strong>Limitation</strong> : nous demander de limiter le traitement
          dans certains cas.
        </li>
        <li>
          <strong>Portabilité</strong> : recevoir vos données dans un format
          structuré et les transmettre à un autre responsable du traitement.
        </li>
        <li>
          <strong>Retrait du consentement</strong> à tout moment, sans que cela
          porte atteinte à la licéité du traitement effectué auparavant.
        </li>
      </ul>
      <p>
        Pour exercer ces droits, écrivez-nous à{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> en indiquant le droit que vous
        souhaitez exercer et, si nécessaire, en joignant un justificatif
        d’identité.
      </p>
      <p>
        Si vous estimez que le traitement de vos données n’est pas conforme à
        la réglementation, vous pouvez introduire une réclamation auprès de l’
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          Agence espagnole de protection des données (AEPD)
        </a>
        .
      </p>

      <h2>7. Mesures de sécurité</h2>
      <p>
        Nous appliquons des mesures techniques et organisationnelles
        raisonnables pour protéger vos données contre tout accès non autorisé,
        perte ou destruction. Le site utilise une connexion chiffrée (HTTPS) et
        les services auxquels nous faisons appel appliquent des mesures de
        sécurité conformes aux standards du secteur.
      </p>

      <h2>8. Modifications de cette politique</h2>
      <p>
        Cette politique peut être mise à jour pour refléter des évolutions
        législatives, opérationnelles ou de service. La version en vigueur est
        toujours celle publiée sur cette page, avec la date de dernière mise à
        jour indiquée en haut.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question relative à la confidentialité, écrivez-nous à{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ou passez par la{" "}
        <Link href={urlContacto(lang)}>page de contact</Link>.
      </p>
    </>
  );
}

function CuerpoIt({ lang }: CuerpoProps) {
  return (
    <>
      <p className="text-xl leading-relaxed text-piedra-700">
        In ExploraSpain prendiamo sul serio la tua privacy. Questa informativa
        spiega quali dati trattiamo, per quale finalità e quali diritti hai,
        in conformità con il GDPR (Regolamento UE 2016/679) e con la Legge
        organica spagnola 3/2018 sulla protezione dei dati personali
        (LOPDGDD).
      </p>

      <h2>1. Titolare del trattamento</h2>
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
      </ul>

      <h2>2. Quali dati trattiamo</h2>
      <p>
        A seconda di come interagisci con il sito, potremmo trattare i
        seguenti dati:
      </p>
      <ul>
        <li>
          <strong>Dati di contatto</strong>: quando ci scrivi via email,
          trattiamo i dati che scegli di fornire volontariamente (nome, email,
          contenuto del messaggio).
        </li>
        <li>
          <strong>Dati di navigazione</strong>: quando visiti il sito vengono
          raccolti dati tecnici come indirizzo IP, tipo di browser, sistema
          operativo, pagine visitate, tempo di permanenza e sito di
          provenienza, tramite cookie e strumenti di analisi, se li accetti.
        </li>
      </ul>
      <p>
        <strong>
          Al momento il sito non offre registrazione degli utenti, un modulo
          d’acquisto né l’iscrizione a una newsletter.
        </strong>{" "}
        Se in futuro queste funzionalità verranno aggiunte, questa informativa
        sarà aggiornata di conseguenza.
      </p>

      <h2>3. Finalità e base giuridica del trattamento</h2>
      <ul>
        <li>
          <strong>Rispondere alle tue richieste</strong>: quando ci scrivi,
          usiamo la tua email e i dati del messaggio solo per risponderti.
          Base giuridica: consenso dell’utente all’invio del messaggio.
        </li>
        <li>
          <strong>Analisi dell’utilizzo del sito</strong>: per capire come
          viene usato il sito e migliorarne i contenuti. Base giuridica:
          consenso espresso tramite il banner dei cookie.
        </li>
        <li>
          <strong>Adempimento di obblighi di legge</strong>: per rispettare la
          normativa applicabile, ove previsto. Base giuridica: obbligo di
          legge.
        </li>
      </ul>

      <h2>4. Periodo di conservazione</h2>
      <p>
        I dati di contatto vengono conservati per il tempo necessario a gestire
        la tua richiesta e, successivamente, per il periodo previsto dalla
        legge al fine di far fronte a eventuali responsabilità.
      </p>
      <p>
        I dati di navigazione vengono conservati per il periodo indicato nella
        cookie policy per ciascuno strumento.
      </p>

      <h2>5. Destinatari e trasferimenti internazionali</h2>
      <p>
        I tuoi dati non vengono comunicati a terzi, salvo obbligo di legge.
        Tuttavia, il sito utilizza servizi di fornitori che possono avere
        accesso ai dati di navigazione in qualità di responsabili del
        trattamento:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (USA): hosting del sito. Trasferimento
          coperto dalle clausole contrattuali tipo della Commissione europea.
        </li>
        <li>
          <strong>Google LLC</strong> (USA): analisi web, se accetti i cookie
          analitici. Trasferimento coperto dal Data Privacy Framework UE-USA.
        </li>
        <li>
          <strong>Piattaforme di affiliazione</strong> (GetYourGuide o altre):
          quando clicchi su un link di affiliazione, vieni reindirizzato al
          loro sito web, che applica la propria informativa sulla privacy.
        </li>
      </ul>

      <h2>6. I tuoi diritti</h2>
      <p>
        In qualità di interessato, hai i seguenti diritti, riconosciuti dal
        GDPR e dalla LOPDGDD:
      </p>
      <ul>
        <li>
          <strong>Accesso</strong>: sapere quali dati trattiamo su di te.
        </li>
        <li>
          <strong>Rettifica</strong>: correggere dati inesatti o incompleti.
        </li>
        <li>
          <strong>Cancellazione</strong> («diritto all’oblio»): chiedere che
          cancelliamo i tuoi dati quando non sono più necessari.
        </li>
        <li>
          <strong>Opposizione</strong>: opporti a determinate attività di
          trattamento.
        </li>
        <li>
          <strong>Limitazione</strong>: chiederci di limitare il trattamento in
          determinati casi.
        </li>
        <li>
          <strong>Portabilità</strong>: ricevere i tuoi dati in un formato
          strutturato e trasmetterli a un altro titolare.
        </li>
        <li>
          <strong>Revoca del consenso</strong> in qualsiasi momento, senza
          pregiudicare la liceità del trattamento effettuato in precedenza.
        </li>
      </ul>
      <p>
        Per esercitare questi diritti, scrivici a{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> indicando quale diritto vuoi
        esercitare e, se necessario, allegando un documento che attesti la tua
        identità.
      </p>
      <p>
        Se ritieni che il trattamento dei tuoi dati non sia conforme alla
        normativa, puoi presentare un reclamo all’
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          Agenzia spagnola per la protezione dei dati (AEPD)
        </a>
        .
      </p>

      <h2>7. Misure di sicurezza</h2>
      <p>
        Applichiamo misure tecniche e organizzative ragionevoli per proteggere
        i tuoi dati da accessi non autorizzati, perdita o distruzione. Il sito
        utilizza una connessione cifrata (HTTPS) e i servizi a cui ci
        affidiamo applicano misure di sicurezza conformi agli standard del
        settore.
      </p>

      <h2>8. Modifiche a questa informativa</h2>
      <p>
        Questa informativa può essere aggiornata per riflettere modifiche
        normative, operative o del servizio. La versione in vigore è sempre
        quella pubblicata in questa pagina, con la data dell’ultimo
        aggiornamento indicata in alto.
      </p>

      <h2>9. Contatti</h2>
      <p>
        Per qualsiasi domanda sulla privacy, scrivici a{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> oppure tramite la{" "}
        <Link href={urlContacto(lang)}>pagina dei contatti</Link>.
      </p>
    </>
  );
}

function CuerpoPt({ lang }: CuerpoProps) {
  return (
    <>
      <p className="text-xl leading-relaxed text-piedra-700">
        Na ExploraSpain levamos a sério a privacidade dos nossos utilizadores.
        Esta política explica que dados tratamos, para que finalidade e que
        direitos assistem ao utilizador, em conformidade com o RGPD
        (Regulamento (UE) 2016/679) e com a Lei Orgânica espanhola 3/2018 de
        Proteção de Dados Pessoais (LOPDGDD).
      </p>

      <h2>1. Responsável pelo tratamento</h2>
      <ul>
        <li>
          <strong>Responsável</strong>: SKYWARD PARTNERS, S.L.
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
      </ul>

      <h2>2. Que dados tratamos</h2>
      <p>
        Consoante a forma como o utilizador interage com o website, podemos
        tratar os seguintes dados:
      </p>
      <ul>
        <li>
          <strong>Dados de contacto</strong>: quando o utilizador nos escreve
          por e-mail, tratamos os dados que decide fornecer voluntariamente
          (nome, e-mail, conteúdo da mensagem).
        </li>
        <li>
          <strong>Dados de navegação</strong>: ao visitar o website, são
          recolhidos dados técnicos como o endereço IP, o tipo de navegador, o
          sistema operativo, as páginas visitadas, o tempo de permanência e o
          site de origem, através de cookies e ferramentas de análise, caso o
          utilizador os aceite.
        </li>
      </ul>
      <p>
        <strong>
          Atualmente, o website não oferece registo de utilizadores,
          formulário de compra nem subscrição de newsletter.
        </strong>{" "}
        Se estas funcionalidades forem acrescentadas no futuro, esta política
        será atualizada em conformidade.
      </p>

      <h2>3. Finalidade e fundamento jurídico do tratamento</h2>
      <ul>
        <li>
          <strong>Responder aos pedidos do utilizador</strong>: quando o
          utilizador nos escreve, usamos o seu e-mail e os dados da mensagem
          apenas para responder. Fundamento jurídico: consentimento do
          utilizador ao enviar a mensagem.
        </li>
        <li>
          <strong>Análise da utilização do website</strong>: para perceber
          como o website é utilizado e melhorar os conteúdos. Fundamento
          jurídico: consentimento dado através do banner de cookies.
        </li>
        <li>
          <strong>Cumprimento de obrigações legais</strong>: para cumprir a
          legislação aplicável, quando for o caso. Fundamento jurídico:
          obrigação legal.
        </li>
      </ul>

      <h2>4. Prazo de conservação</h2>
      <p>
        Os dados de contacto são conservados durante o tempo necessário para
        tratar o pedido do utilizador e, posteriormente, durante o prazo legal
        aplicável para responder a eventuais responsabilidades.
      </p>
      <p>
        Os dados de navegação são conservados durante o prazo indicado na
        política de cookies para cada ferramenta.
      </p>

      <h2>5. Destinatários e transferências internacionais</h2>
      <p>
        Os dados não são comunicados a terceiros, salvo obrigação legal. No
        entanto, o website utiliza serviços de fornecedores que podem ter
        acesso aos dados de navegação na qualidade de subcontratantes:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (EUA): alojamento do website.
          Transferência abrangida pelas cláusulas contratuais-tipo da Comissão
          Europeia.
        </li>
        <li>
          <strong>Google LLC</strong> (EUA): análise web, caso o utilizador
          aceite os cookies analíticos. Transferência abrangida pelo Quadro de
          Privacidade de Dados UE-EUA (Data Privacy Framework).
        </li>
        <li>
          <strong>Plataformas de afiliação</strong> (GetYourGuide ou outras):
          ao clicar num link de afiliação, o utilizador é redirecionado para o
          website dessas plataformas, que aplicam a sua própria política de
          privacidade.
        </li>
      </ul>

      <h2>6. Direitos do utilizador</h2>
      <p>
        Enquanto titular dos dados, o utilizador tem os seguintes direitos,
        reconhecidos pelo RGPD e pela LOPDGDD:
      </p>
      <ul>
        <li>
          <strong>Acesso</strong>: saber que dados tratamos sobre si.
        </li>
        <li>
          <strong>Retificação</strong>: corrigir dados inexatos ou incompletos.
        </li>
        <li>
          <strong>Apagamento</strong> («direito a ser esquecido»): pedir que
          eliminemos os seus dados quando deixarem de ser necessários.
        </li>
        <li>
          <strong>Oposição</strong>: opor-se a determinadas atividades de
          tratamento.
        </li>
        <li>
          <strong>Limitação</strong>: pedir-nos que limitemos o tratamento em
          determinados casos.
        </li>
        <li>
          <strong>Portabilidade</strong>: receber os seus dados num formato
          estruturado e transmiti-los a outro responsável pelo tratamento.
        </li>
        <li>
          <strong>Retirar o consentimento</strong> a qualquer momento, sem
          comprometer a licitude do tratamento efetuado anteriormente.
        </li>
      </ul>
      <p>
        Para exercer estes direitos, o utilizador pode escrever-nos para{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, indicando o direito que
        pretende exercer e, se necessário, apresentando prova da sua
        identidade.
      </p>
      <p>
        Se considerar que o tratamento dos seus dados não cumpre a legislação,
        o utilizador pode apresentar uma reclamação junto da{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          Agência Espanhola de Proteção de Dados (AEPD)
        </a>
        .
      </p>

      <h2>7. Medidas de segurança</h2>
      <p>
        Aplicamos medidas técnicas e organizativas razoáveis para proteger os
        dados contra acessos não autorizados, perda ou destruição. O website
        utiliza uma ligação cifrada (HTTPS) e os serviços contratados aplicam
        medidas de segurança de acordo com as normas do setor.
      </p>

      <h2>8. Alterações a esta política</h2>
      <p>
        Esta política pode ser atualizada para refletir alterações
        legislativas, operacionais ou do serviço. A versão em vigor será
        sempre a publicada nesta página, com a data da última atualização
        indicada no topo.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para qualquer questão sobre privacidade, o utilizador pode escrever-nos
        para <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ou utilizar a{" "}
        <Link href={urlContacto(lang)}>página de contacto</Link>.
      </p>
    </>
  );
}

const CONTENIDO: Record<IdiomaLegal, ContenidoPrivacidad> = {
  en: {
    titulo: "Privacy Policy",
    descripcion:
      "Information about how ExploraSpain processes personal data, in compliance with the GDPR (EU Regulation 2016/679) and the Spanish Data Protection Act (LOPDGDD).",
    ogDescripcion:
      "How ExploraSpain processes personal data, under GDPR and LOPDGDD.",
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
    titulo: "Datenschutzerklärung",
    descripcion:
      "Informationen darüber, wie ExploraSpain personenbezogene Daten verarbeitet, gemäß DSGVO (EU-Verordnung 2016/679) und dem spanischen Datenschutzgesetz (LOPDGDD).",
    ogDescripcion:
      "Wie ExploraSpain personenbezogene Daten verarbeitet, gemäß DSGVO und LOPDGDD.",
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
    titulo: "Politique de confidentialité",
    descripcion:
      "Informations sur la manière dont ExploraSpain traite les données personnelles, conformément au RGPD (Règlement (UE) 2016/679) et à la loi espagnole sur la protection des données (LOPDGDD).",
    ogDescripcion:
      "Comment ExploraSpain traite les données personnelles, selon le RGPD et la LOPDGDD.",
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
    titulo: "Informativa sulla privacy",
    descripcion:
      "Informazioni su come ExploraSpain tratta i dati personali, in conformità con il GDPR (Regolamento UE 2016/679) e con la legge spagnola sulla protezione dei dati (LOPDGDD).",
    ogDescripcion:
      "Come ExploraSpain tratta i dati personali, secondo il GDPR e la LOPDGDD.",
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
    titulo: "Política de Privacidade",
    descripcion:
      "Informação sobre a forma como a ExploraSpain trata os dados pessoais, em conformidade com o RGPD (Regulamento (UE) 2016/679) e com a lei espanhola de proteção de dados (LOPDGDD).",
    ogDescripcion:
      "Como a ExploraSpain trata os dados pessoais, ao abrigo do RGPD e da LOPDGDD.",
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
  const canonicalUrl = `${siteUrl}${urlPrivacidad(lang)}`;
  const languages = hreflangAlternates((l) => urlPrivacidad(l));

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

export default function PrivacyPage({
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
  const pageUrl = `${siteUrl}${urlPrivacidad(lang)}`;
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
              href="/privacidad"
              className="text-anil-600 hover:text-anil-700 underline"
            >
              /privacidad
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
