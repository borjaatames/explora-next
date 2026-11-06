import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_LOCALE,
  esIdiomaActivo,
} from "@/lib/i18n/config";
import {
  hreflangAlternates,
  urlContacto,
  urlAvisoLegal,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import { SAME_AS_REDES } from "@/lib/redesSociales";
import RedesSociales from "@/components/RedesSociales";

export function generateStaticParams(): Array<{ lang: Idioma }> {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

type Copy = {
  metaTitle: string;
  metaDescription: string;
  ogDescription: string;
  breadcrumbHome: string;
  breadcrumbContact: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappHeading: string;
  whatsappBody: string;
  whatsappPrefill: string;
  writeHeading: string;
  writeBody: string;
  errorHeading: string;
  errorBody: string;
  suggestionHeading: string;
  suggestionBody: string;
  partnershipsHeading: string;
  partnershipsBody: string;
  bookingsHeading: string;
  bookingsBody: string;
  companyInfoLabel: string;
  companyLegalLine: string;
  moreInfoPrefix: string;
  legalNoticeLink: string;
  backToHome: string;
};

const COPY_FR_IT_PT: Record<"fr" | "it" | "pt", Copy> = {
  fr: {
    metaTitle: "Contact | ExploraSpain",
    metaDescription:
      "Une question sur une activité ou une réservation, une suggestion ou un partenariat ? Écrivez-nous via le formulaire ou WhatsApp : nous vous répondrons dans les meilleurs délais.",
    ogDescription:
      "Contactez l’équipe d’ExploraSpain pour vos suggestions, corrections ou partenariats.",
    breadcrumbHome: "Accueil",
    breadcrumbContact: "Contact",
    heroTitle: "Contact",
    heroSubtitle:
      "Questions, suggestions, corrections, partenariats. Nous lisons tout.",
    whatsappHeading: "Une question rapide ? Écrivez-nous sur WhatsApp",
    whatsappBody:
      "Une aide directe pour les activités et les réservations. Nous vous répondrons dans les meilleurs délais.",
    whatsappPrefill:
      "Bonjour, j’ai une question sur les expériences d’ExploraSpain.",
    writeHeading: "Écrivez-nous directement",
    writeBody:
      "Remplissez le formulaire et nous vous répondrons dans les meilleurs délais.",
    errorHeading: "Vous avez repéré une erreur ?",
    errorBody:
      "Prix obsolètes, horaires modifiés, détail inexact : signalez-le-nous et nous le corrigerons. Indiquez l’URL de la page et le problème constaté.",
    suggestionHeading: "Une suggestion ?",
    suggestionBody:
      "S’il vous manque une destination, une activité ou une recommandation précise, dites-le-nous. Les meilleures idées viennent de ceux qui voyagent vraiment.",
    partnershipsHeading: "Partenariats ?",
    partnershipsBody:
      "Presse, médias, partenaires touristiques, propositions éditoriales. Expliquez-nous brièvement qui vous êtes et ce que vous proposez.",
    bookingsHeading: "Réservations et visites ?",
    bookingsBody:
      "Pour toute question sur une activité, une modification ou un problème de réservation, indiquez dans votre message le numéro de réservation et la date de l’activité.",
    companyInfoLabel: "Informations sur l’entreprise :",
    companyLegalLine:
      "SKYWARD PARTNERS, S.L. · NIF B26629576 · Calle Castelló 117, 28006 Madrid, Espagne.",
    moreInfoPrefix: "Plus d’informations dans les",
    legalNoticeLink: "mentions légales",
    backToHome: "← Retour à l’accueil",
  },
  it: {
    metaTitle: "Contatti | ExploraSpain",
    metaDescription:
      "Domande su un’attività o una prenotazione, suggerimenti o collaborazioni? Scrivici tramite il modulo o WhatsApp e ti risponderemo il prima possibile.",
    ogDescription:
      "Contatta il team di ExploraSpain per suggerimenti, correzioni o collaborazioni.",
    breadcrumbHome: "Home",
    breadcrumbContact: "Contatti",
    heroTitle: "Contatti",
    heroSubtitle:
      "Domande, suggerimenti, correzioni, collaborazioni. Leggiamo tutto.",
    whatsappHeading: "Una domanda veloce? Scrivici su WhatsApp",
    whatsappBody:
      "Aiuto diretto su attività e prenotazioni. Ti risponderemo il prima possibile.",
    whatsappPrefill: "Ciao, ho una domanda sulle esperienze di ExploraSpain.",
    writeHeading: "Scrivici direttamente",
    writeBody: "Compila il modulo e ti risponderemo il prima possibile.",
    errorHeading: "Hai trovato un errore?",
    errorBody:
      "Prezzi non aggiornati, orari cambiati, un dettaglio impreciso: segnalacelo e lo correggiamo. Indica l’URL della pagina e il problema.",
    suggestionHeading: "Un suggerimento?",
    suggestionBody:
      "Se ti manca una destinazione, un’attività o un consiglio specifico, diccelo. Le idee migliori arrivano da chi viaggia davvero.",
    partnershipsHeading: "Collaborazioni?",
    partnershipsBody:
      "Stampa, media, partner turistici, proposte editoriali. Raccontaci in breve chi sei e cosa proponi.",
    bookingsHeading: "Prenotazioni e tour?",
    bookingsBody:
      "Per domande su attività, modifiche o problemi con una prenotazione, indica nel messaggio il numero di prenotazione e la data dell’attività.",
    companyInfoLabel: "Informazioni sull’azienda:",
    companyLegalLine:
      "SKYWARD PARTNERS, S.L. · Codice fiscale (NIF) B26629576 · Calle Castelló 117, 28006 Madrid, Spagna.",
    moreInfoPrefix: "Maggiori informazioni nelle",
    legalNoticeLink: "note legali",
    backToHome: "← Torna alla home",
  },
  pt: {
    metaTitle: "Contacto | ExploraSpain",
    metaDescription:
      "Dúvidas sobre uma atividade ou reserva, sugestões ou parcerias? Escreva-nos através do formulário ou do WhatsApp e responderemos o mais rapidamente possível.",
    ogDescription:
      "Contacte a equipa da ExploraSpain para sugestões, correções ou parcerias.",
    breadcrumbHome: "Início",
    breadcrumbContact: "Contacto",
    heroTitle: "Contacto",
    heroSubtitle:
      "Dúvidas, sugestões, correções, parcerias. Lemos tudo.",
    whatsappHeading: "Uma dúvida rápida? Escreva-nos no WhatsApp",
    whatsappBody:
      "Ajuda direta com atividades e reservas. Responderemos o mais rapidamente possível.",
    whatsappPrefill:
      "Olá, tenho uma questão sobre as experiências da ExploraSpain.",
    writeHeading: "Escreva-nos diretamente",
    writeBody:
      "Preencha o formulário e responderemos o mais rapidamente possível.",
    errorHeading: "Encontrou um erro?",
    errorBody:
      "Preços desatualizados, horários alterados, um detalhe impreciso: avise-nos e corrigimos. Indique o URL da página e o problema.",
    suggestionHeading: "Tem uma sugestão?",
    suggestionBody:
      "Se lhe falta um destino, uma atividade ou uma recomendação concreta, diga-nos. As melhores ideias vêm de quem viaja de verdade.",
    partnershipsHeading: "Parcerias?",
    partnershipsBody:
      "Imprensa, meios de comunicação, parceiros turísticos, propostas editoriais. Explique-nos brevemente quem é e o que propõe.",
    bookingsHeading: "Reservas e tours?",
    bookingsBody:
      "Para questões sobre atividades, alterações ou problemas com uma reserva, indique na mensagem o número da reserva e a data da atividade.",
    companyInfoLabel: "Informação da empresa:",
    companyLegalLine:
      "SKYWARD PARTNERS, S.L. · NIF B26629576 · Calle Castelló 117, 28006 Madrid, Espanha.",
    moreInfoPrefix: "Mais informações no",
    legalNoticeLink: "aviso legal",
    backToHome: "← Voltar ao início",
  },
};

function getCopy(lang: Idioma): Copy {
  if (lang === "fr" || lang === "it" || lang === "pt") {
    return COPY_FR_IT_PT[lang];
  }
  if (lang === "de") {
    return {
      metaTitle: "Kontakt | ExploraSpain",
      metaDescription:
        "Fragen zu einer Aktivität oder Buchung, Vorschläge oder Kooperationen? Schreib uns über das Formular oder WhatsApp — wir melden uns so schnell wie möglich.",
      ogDescription:
        "Kontaktiere das ExploraSpain-Team für Vorschläge, Korrekturen oder Kooperationen.",
      breadcrumbHome: "Startseite",
      breadcrumbContact: "Kontakt",
      heroTitle: "Kontakt",
      heroSubtitle:
        "Fragen, Vorschläge, Korrekturen, Kooperationen. Wir lesen alles.",
      whatsappHeading: "Kurze Frage? Schreib uns auf WhatsApp",
      whatsappBody:
        "Direkte Hilfe bei Aktivitäten und Buchungen. Wir antworten so schnell wie möglich.",
      whatsappPrefill:
        "Hallo, ich habe eine Frage zu einem Erlebnis von ExploraSpain.",
      writeHeading: "Schreib uns direkt",
      writeBody:
        "Füll das Formular aus und wir melden uns so schnell wie möglich.",
      errorHeading: "Einen Fehler entdeckt?",
      errorBody:
        "Veraltete Preise, geänderte Öffnungszeiten, ein ungenaues Detail. Sag uns Bescheid und wir korrigieren es. Bitte gib die URL der Guide und das Problem an.",
      suggestionHeading: "Vorschlag für eine Guide?",
      suggestionBody:
        "Wenn dir ein Reiseziel, eine Route oder eine bestimmte Empfehlung fehlt, sag es uns. Die besten Ideen kommen von Leuten, die tatsächlich unterwegs sind.",
      partnershipsHeading: "Kooperationen?",
      partnershipsBody:
        "Presse, Medien, Tourismuspartner, redaktionelle Vorschläge. Erzähl uns kurz, wer du bist und was du vorschlägst.",
      bookingsHeading: "Buchungen und Touren?",
      bookingsBody:
        "Bei Fragen zu Aktivitäten, Änderungen oder Problemen mit einer Buchung gib bitte die Buchungsnummer und das Datum der Aktivität in deiner Nachricht an.",
      companyInfoLabel: "Unternehmensangaben:",
      companyLegalLine:
        "SKYWARD PARTNERS, S.L. · Steuernummer (NIF) B26629576 · Calle Castelló 117, 28006 Madrid, Spanien.",
      moreInfoPrefix: "Weitere Informationen im",
      legalNoticeLink: "Impressum",
      backToHome: "← Zurück zur Startseite",
    };
  }
  return {
    metaTitle: "Contact | ExploraSpain",
    metaDescription:
      "Questions about an activity or booking, suggestions or partnerships? Message us via the form or WhatsApp and we'll get back to you as soon as possible.",
    ogDescription:
      "Get in touch with the ExploraSpain team for suggestions, corrections or partnerships.",
    breadcrumbHome: "Home",
    breadcrumbContact: "Contact",
    heroTitle: "Contact",
    heroSubtitle:
      "Questions, suggestions, corrections, partnerships. We read everything.",
    whatsappHeading: "Quick questions? Message us on WhatsApp",
    whatsappBody:
      "Direct help with activities and bookings. We'll reply as soon as possible.",
    whatsappPrefill:
      "Hi, I have a question about ExploraSpain's experiences.",
    writeHeading: "Write to us directly",
    writeBody: "Fill in the form and we'll get back to you as soon as possible.",
    errorHeading: "Spotted an error?",
    errorBody:
      "Outdated prices, changed opening hours, an inaccurate detail. Let us know and we'll fix it. Please include the URL of the guide and what's wrong.",
    suggestionHeading: "Guide suggestion?",
    suggestionBody:
      "If you're missing a destination, route or specific recommendation, tell us. The best ideas come from people who are actually traveling.",
    partnershipsHeading: "Partnerships?",
    partnershipsBody:
      "Press, media, tourism partners, editorial proposals. Briefly explain who you are and what you're proposing.",
    bookingsHeading: "Bookings and tours?",
    bookingsBody:
      "For questions about activities, changes or issues with a booking, please include the booking number and the date of the activity in your message.",
    companyInfoLabel: "Company information:",
    companyLegalLine:
      "SKYWARD PARTNERS, S.L. · Tax ID B26629576 · Calle Castelló 117, 28006 Madrid, Spain.",
    moreInfoPrefix: "More information in the",
    legalNoticeLink: "legal notice",
    backToHome: "← Back to home",
  };
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

  const copy = getCopy(lang);
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
  const canonicalUrl = `${siteUrl}${urlContacto(lang)}`;
  const languages = hreflangAlternates((l) => urlContacto(l));

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
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
      title: copy.metaTitle,
      description: copy.ogDescription,
    },
  };
}

export default function ContactPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") {
    notFound();
  }

  const copy = getCopy(lang);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
  const pageUrl = `${siteUrl}${urlContacto(lang)}`;
  const homeUrl = `${siteUrl}${prefijoIdioma(lang) || "/"}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.breadcrumbHome, item: homeUrl },
      { "@type": "ListItem", position: 2, name: copy.breadcrumbContact, item: pageUrl },
    ],
  };

  // ContactPage Schema.org for SEO
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: copy.metaTitle,
    url: pageUrl,
    inLanguage: IDIOMA_LOCALE[lang],
    mainEntity: {
      "@type": "Organization",
      name: "SKYWARD PARTNERS, S.L.",
      email: "contacto@exploraspain.com",
      url: siteUrl,
      sameAs: SAME_AS_REDES,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle Castelló 117",
        postalCode: "28006",
        addressLocality: "Madrid",
        addressCountry: "ES",
      },
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-anil-500 text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-fraunces text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {copy.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-anil-50">{copy.heroSubtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Quick access via WhatsApp */}
        <div className="bg-[#25D366]/10 border border-[#25D366]/40 rounded-lg p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 mb-1">
              {copy.whatsappHeading}
            </h2>
            <p className="text-piedra-700 text-sm">{copy.whatsappBody}</p>
          </div>
          <a
            href={`https://wa.me/34917647730?text=${encodeURIComponent(
              copy.whatsappPrefill
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-6 py-3 rounded-lg whitespace-nowrap transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>

        <RedesSociales idioma={lang} variante="claro" className="mb-8" />

        {/* Main email block */}
        <div className="bg-azafran-50 border-l-4 border-azafran-500 rounded-r-lg p-8 mb-12">
          <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-3">
            {copy.writeHeading}
          </h2>
          <p className="text-piedra-700 mb-6">{copy.writeBody}</p>
          <ContactForm idioma={lang} />
        </div>

        {/* Categories of messages */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 border border-piedra-200 rounded-lg">
            <h3 className="font-fraunces text-xl font-bold text-piedra-900 mb-2">
              {copy.errorHeading}
            </h3>
            <p className="text-piedra-700 text-sm leading-relaxed">
              {copy.errorBody}
            </p>
          </div>

          <div className="p-6 border border-piedra-200 rounded-lg">
            <h3 className="font-fraunces text-xl font-bold text-piedra-900 mb-2">
              {copy.suggestionHeading}
            </h3>
            <p className="text-piedra-700 text-sm leading-relaxed">
              {copy.suggestionBody}
            </p>
          </div>

          <div className="p-6 border border-piedra-200 rounded-lg">
            <h3 className="font-fraunces text-xl font-bold text-piedra-900 mb-2">
              {copy.partnershipsHeading}
            </h3>
            <p className="text-piedra-700 text-sm leading-relaxed">
              {copy.partnershipsBody}
            </p>
          </div>

          <div className="p-6 border border-piedra-200 rounded-lg">
            <h3 className="font-fraunces text-xl font-bold text-piedra-900 mb-2">
              {copy.bookingsHeading}
            </h3>
            <p className="text-piedra-700 text-sm leading-relaxed">
              {copy.bookingsBody}
            </p>
          </div>
        </div>

        {/* Company info */}
        <div className="p-6 bg-piedra-50 rounded-lg text-sm text-piedra-600 leading-relaxed">
          <p className="mb-2">
            <strong className="text-piedra-900">{copy.companyInfoLabel}</strong>
          </p>
          <p>{copy.companyLegalLine}</p>
          <p className="mt-3">
            {copy.moreInfoPrefix}{" "}
            <Link
              href={urlAvisoLegal(lang)}
              className="text-anil-600 hover:underline"
            >
              {copy.legalNoticeLink}
            </Link>
            .
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-12 text-center">
          <Link
            href={`/${lang}`}
            className="text-anil-600 hover:text-anil-700 font-semibold"
          >
            {copy.backToHome}
          </Link>
        </div>
      </section>
    </main>
  );
}
