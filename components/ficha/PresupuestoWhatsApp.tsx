"use client";

import type { MouseEvent } from "react";
import type { Idioma } from "@/lib/i18n/types";
import { urlWhatsApp } from "@/lib/contacto";
import { IconoWhatsApp } from "@/components/WhatsAppButton";

type Ubicacion = "cabecera" | "reserva";

type Props = {
  idioma: Idioma;
  titulo: string;
  slug: string;
  ubicacion: Ubicacion;
};

type Gtag = (comando: "event", nombre: string, parametros: Record<string, unknown>) => void;

const TEXTOS: Record<
  Idioma,
  { boton: string; detalle: string; oReserva: string; mensaje: (titulo: string, url: string) => string }
> = {
  es: {
    boton: "Pide presupuesto por WhatsApp",
    detalle: "Sin compromiso. Te respondemos personalmente con disponibilidad y precio para tu grupo.",
    oReserva: "O reserva directamente en el calendario:",
    mensaje: (t, u) => `Hola, quiero pedir presupuesto para: ${t}\nFecha:\nPersonas:\n${u}`,
  },
  en: {
    boton: "Get a quote on WhatsApp",
    detalle: "No obligation. We'll reply personally with availability and the price for your group.",
    oReserva: "Or book directly in the calendar:",
    mensaje: (t, u) => `Hi, I'd like a quote for: ${t}\nDate:\nPeople:\n${u}`,
  },
  de: {
    boton: "Angebot per WhatsApp anfragen",
    detalle: "Unverbindlich. Wir antworten persönlich mit Verfügbarkeit und Preis für deine Gruppe.",
    oReserva: "Oder direkt im Kalender buchen:",
    mensaje: (t, u) => `Hallo, ich hätte gern ein Angebot für: ${t}\nDatum:\nPersonen:\n${u}`,
  },
  fr: {
    boton: "Demander un devis sur WhatsApp",
    detalle: "Sans engagement. Nous vous répondons personnellement avec les disponibilités et le prix pour votre groupe.",
    oReserva: "Ou réservez directement dans le calendrier :",
    mensaje: (t, u) => `Bonjour, je souhaite un devis pour : ${t}\nDate :\nPersonnes :\n${u}`,
  },
  it: {
    boton: "Chiedi un preventivo su WhatsApp",
    detalle: "Senza impegno. Ti rispondiamo personalmente con disponibilità e prezzo per il tuo gruppo.",
    oReserva: "Oppure prenota direttamente nel calendario:",
    mensaje: (t, u) => `Ciao, vorrei un preventivo per: ${t}\nData:\nPersone:\n${u}`,
  },
  pt: {
    boton: "Pedir orçamento por WhatsApp",
    detalle: "Sem compromisso. Respondemos pessoalmente com disponibilidade e preço para o seu grupo.",
    oReserva: "Ou reserve diretamente no calendário:",
    mensaje: (t, u) => `Olá, gostaria de um orçamento para: ${t}\nData:\nPessoas:\n${u}`,
  },
};

/**
 * Fichas privadas (Bókun): el presupuesto por WhatsApp es la llamada
 * principal y el calendario queda como segunda opción. Con precios de
 * 150-400 € la mayoría quiere preguntar antes de pagar (estudio del
 * 18-11-2026). Se mide con `click_whatsapp_privada`.
 */
export default function PresupuestoWhatsApp({ idioma, titulo, slug, ubicacion }: Props) {
  const t = TEXTOS[idioma];

  const alPulsar = (evento: MouseEvent<HTMLAnchorElement>): void => {
    const url = `${window.location.origin}${window.location.pathname}`;
    evento.currentTarget.href = urlWhatsApp(t.mensaje(titulo, url));
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === "function") {
      gtag("event", "click_whatsapp_privada", { ficha_slug: slug, idioma, ubicacion });
    }
  };

  return (
    <div className={ubicacion === "reserva" ? "mb-6" : "mt-4"}>
      <a
        href={urlWhatsApp(t.mensaje(titulo, ""))}
        onClick={alPulsar}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-piedra-900 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-piedra-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
      >
        <IconoWhatsApp size={20} />
        {t.boton}
      </a>
      <p className="mt-2 text-sm text-piedra-600">{t.detalle}</p>
      {ubicacion === "reserva" && (
        <p className="mt-4 text-sm font-semibold text-piedra-900">{t.oReserva}</p>
      )}
    </div>
  );
}
