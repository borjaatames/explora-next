"use client";

import type { Idioma } from "@/lib/i18n/types";
import { urlWhatsApp } from "@/lib/contacto";

type Props = {
  idioma: Idioma;
  ciudad: string;
  tituloGuia: string;
  guiaSlug: string;
};

const TEXTOS: Record<
  Idioma,
  { titulo: (c: string) => string; texto: string; boton: string; mensaje: (t: string, c: string) => string }
> = {
  es: {
    titulo: (c) => `¿Te ayudamos a organizar tu visita a ${c}?`,
    texto: "Cuéntanos tus fechas y qué os gusta, y te respondemos por WhatsApp con un plan y qué conviene reservar. Sin compromiso.",
    boton: "Escríbenos por WhatsApp",
    mensaje: (t, c) => `Hola, estoy leyendo «${t}» y me gustaría ayuda para organizar mi visita a ${c}.`,
  },
  en: {
    titulo: (c) => `Want help planning your time in ${c}?`,
    texto: "Tell us your dates and what you enjoy, and we'll reply on WhatsApp with a plan and what's worth booking. No strings attached.",
    boton: "Message us on WhatsApp",
    mensaje: (t, c) => `Hi, I'm reading "${t}" and I'd like some help planning my visit to ${c}.`,
  },
  de: {
    titulo: (c) => `Sollen wir dir bei der Planung für ${c} helfen?`,
    texto: "Schreib uns deine Reisedaten und was dich interessiert. Wir antworten per WhatsApp mit einem Plan und Tipps, was sich zu buchen lohnt. Unverbindlich.",
    boton: "Schreib uns auf WhatsApp",
    mensaje: (t, c) => `Hallo, ich lese „${t}“ und hätte gern Hilfe bei der Planung meines Besuchs in ${c}.`,
  },
  fr: {
    titulo: (c) => `Besoin d'aide pour organiser votre séjour à ${c} ?`,
    texto: "Donnez-nous vos dates et vos envies : nous vous répondons sur WhatsApp avec un programme et ce qu'il vaut la peine de réserver. Sans engagement.",
    boton: "Écrivez-nous sur WhatsApp",
    mensaje: (t, c) => `Bonjour, je lis « ${t} » et j'aimerais de l'aide pour organiser ma visite à ${c}.`,
  },
  it: {
    titulo: (c) => `Ti aiutiamo a organizzare la visita a ${c}?`,
    texto: "Dicci le date e cosa ti piace: ti rispondiamo su WhatsApp con un programma e cosa conviene prenotare. Senza impegno.",
    boton: "Scrivici su WhatsApp",
    mensaje: (t, c) => `Ciao, sto leggendo «${t}» e vorrei aiuto per organizzare la mia visita a ${c}.`,
  },
  pt: {
    titulo: (c) => `Quer ajuda para organizar a visita a ${c}?`,
    texto: "Diga-nos as datas e o que gosta: respondemos pelo WhatsApp com um plano e o que vale a pena reservar. Sem compromisso.",
    boton: "Escreva-nos pelo WhatsApp",
    mensaje: (t, c) => `Olá, estou a ler «${t}» e gostava de ajuda para organizar a minha visita a ${c}.`,
  },
};

type Gtag = (comando: "event", nombre: string, parametros: Record<string, string>) => void;

/**
 * Caja «¿Te ayudamos a organizar tu visita?» al final de las guías largas
 * (ciudad e itinerario). Las privadas que se han vendido empezaron con una
 * conversación; aquí se la ofrecemos a quien está planificando.
 */
export default function AyudaWhatsAppGuia({ idioma, ciudad, tituloGuia, guiaSlug }: Props) {
  const t = TEXTOS[idioma];
  return (
    <aside aria-label={t.boton} className="mt-12 rounded-lg border border-piedra-200 bg-piedra-50 p-5">
      <p className="font-fraunces text-lg font-bold text-piedra-900">{t.titulo(ciudad)}</p>
      <p className="mt-1 text-sm text-piedra-600 leading-relaxed">{t.texto}</p>
      <a
        href={urlWhatsApp(t.mensaje(tituloGuia, ciudad))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          const gtag = (window as unknown as { gtag?: Gtag }).gtag;
          if (typeof gtag === "function") gtag("event", "click_whatsapp_guia", { idioma, guia_slug: guiaSlug });
        }}
        className="mt-3 inline-flex items-center justify-center bg-piedra-900 hover:bg-piedra-800 text-white font-semibold text-sm px-4 py-2.5 min-h-[44px] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-piedra-900 focus-visible:ring-offset-2"
      >
        {t.boton}
      </a>
    </aside>
  );
}
