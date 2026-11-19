import type { Idioma } from "@/lib/i18n/types";
import Link from "next/link";
import { urlWhatsApp } from "@/lib/contacto";
import { urlCondiciones } from "@/lib/i18n/utils";

type Props = {
  idioma: Idioma;
  titulo: string;
  confirmacionInmediata?: boolean;
  cancelacionGratuita?: boolean;
  horasCancelacion?: number;
};

const TEXTOS = {
  es: {
    cabecera: "Reservas con ExploraSpain",
    empresa: "Empresa española: Skyward Partners S.L., Madrid",
    pago: "Pago con tarjeta en la pasarela segura de Bókun; no vemos tus datos de pago",
    confirmacion: "Confirmación al momento en tu correo",
    cancelacion: (h?: number) =>
      h ? `Cancelación gratis hasta ${h} h antes, con reembolso íntegro` : "Cancelación gratis",
    dudas: "¿Dudas antes de reservar? Escríbenos por WhatsApp",
    mensaje: (t: string) => `Hola, tengo una duda sobre «${t}».`,
    condiciones: "Condiciones de reserva",
  },
  en: {
    cabecera: "Booking with ExploraSpain",
    empresa: "Spanish company: Skyward Partners S.L., Madrid",
    pago: "Card payment on Bókun's secure checkout; we never see your payment details",
    confirmacion: "Instant confirmation by email",
    cancelacion: (h?: number) =>
      h ? `Free cancellation up to ${h}h before, full refund` : "Free cancellation",
    dudas: "Questions before booking? Message us on WhatsApp",
    mensaje: (t: string) => `Hi, I have a question about "${t}".`,
    condiciones: "Booking terms",
  },
  de: {
    cabecera: "Buchen bei ExploraSpain",
    empresa: "Spanisches Unternehmen: Skyward Partners S.L., Madrid",
    pago: "Kartenzahlung über die sichere Bókun-Kasse; wir sehen deine Zahlungsdaten nicht",
    confirmacion: "Sofortige Bestätigung per E-Mail",
    cancelacion: (h?: number) =>
      h ? `Kostenlose Stornierung bis ${h} Std. vorher, volle Erstattung` : "Kostenlose Stornierung",
    dudas: "Fragen vor der Buchung? Schreib uns auf WhatsApp",
    mensaje: (t: string) => `Hallo, ich habe eine Frage zu „${t}“.`,
    condiciones: "Buchungsbedingungen (EN)",
  },
  fr: {
    cabecera: "Réserver avec ExploraSpain",
    empresa: "Entreprise espagnole : Skyward Partners S.L., Madrid",
    pago: "Paiement par carte sur la plateforme sécurisée de Bókun ; nous ne voyons jamais vos données de paiement",
    confirmacion: "Confirmation immédiate par e-mail",
    cancelacion: (h?: number) =>
      h ? `Annulation gratuite jusqu'à ${h} h avant, remboursement intégral` : "Annulation gratuite",
    dudas: "Une question avant de réserver ? Écrivez-nous sur WhatsApp",
    mensaje: (t: string) => `Bonjour, j'ai une question sur « ${t} ».`,
    condiciones: "Conditions de réservation (EN)",
  },
  it: {
    cabecera: "Prenota con ExploraSpain",
    empresa: "Azienda spagnola: Skyward Partners S.L., Madrid",
    pago: "Pagamento con carta sul checkout sicuro di Bókun; non vediamo mai i tuoi dati di pagamento",
    confirmacion: "Conferma immediata via e-mail",
    cancelacion: (h?: number) =>
      h ? `Cancellazione gratuita fino a ${h} ore prima, con rimborso completo` : "Cancellazione gratuita",
    dudas: "Dubbi prima di prenotare? Scrivici su WhatsApp",
    mensaje: (t: string) => `Ciao, ho una domanda su «${t}».`,
    condiciones: "Condizioni di prenotazione (EN)",
  },
  pt: {
    cabecera: "Reservar com a ExploraSpain",
    empresa: "Empresa espanhola: Skyward Partners S.L., Madrid",
    pago: "Pagamento com cartão na plataforma segura da Bókun; não vemos os seus dados de pagamento",
    confirmacion: "Confirmação imediata por e-mail",
    cancelacion: (h?: number) =>
      h ? `Cancelamento gratuito até ${h} h antes, com reembolso total` : "Cancelamento gratuito",
    dudas: "Dúvidas antes de reservar? Escreva-nos pelo WhatsApp",
    mensaje: (t: string) => `Olá, tenho uma dúvida sobre «${t}».`,
    condiciones: "Condições de reserva (EN)",
  },
} as const;

/**
 * Bajo el calendario de Bókun: quién cobra, quién responde y qué pasa si
 * cancelas. Solo afirmaciones comprobables (datos del aviso legal y de la
 * ficha); nada de «agencia de viajes».
 */
export default function ConfianzaReservaBokun({
  idioma,
  titulo,
  confirmacionInmediata,
  cancelacionGratuita,
  horasCancelacion,
}: Props) {
  const t = TEXTOS[idioma];
  const puntos = [
    t.empresa,
    t.pago,
    ...(confirmacionInmediata ? [t.confirmacion] : []),
    ...(cancelacionGratuita ? [t.cancelacion(horasCancelacion)] : []),
  ];

  return (
    <div className="mt-4 rounded-lg border border-piedra-200 bg-white p-4">
      <p className="text-sm font-semibold text-piedra-900 mb-2">{t.cabecera}</p>
      <ul className="space-y-1.5 text-sm text-piedra-700">
        {puntos.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <span aria-hidden="true" className="text-anil-600 mt-0.5">
              ✓
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <a
        href={urlWhatsApp(t.mensaje(titulo))}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded"
      >
        {t.dudas} →
      </a>
      <p className="mt-2 text-xs text-piedra-500">
        <Link href={urlCondiciones(idioma)} prefetch={false} className="underline hover:text-anil-700">
          {t.condiciones}
        </Link>
      </p>
    </div>
  );
}
