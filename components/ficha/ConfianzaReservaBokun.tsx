import type { Idioma } from "@/lib/i18n/types";
import { urlWhatsApp } from "@/lib/contacto";

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
  const t = TEXTOS[idioma === "en" || idioma === "de" ? idioma : "es"];
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
    </div>
  );
}
