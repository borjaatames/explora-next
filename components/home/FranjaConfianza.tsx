import Image from "next/image";
import type { Idioma } from "@/lib/i18n/types";

const DICT = {
  es: {
    titulo: "Por qué reservar con ExploraSpain",
    items: [
      { t: "Pago 100% seguro", d: "Vía Bókun y partners oficiales" },
      { t: "Confirmación inmediata", d: "Tu entrada, en el móvil" },
      { t: "Atención al cliente", d: "Te ayudamos con tu reserva" },
      { t: "Guías independientes", d: "Sin relleno turístico" },
    ],
    partners: "Reservas con partners oficiales",
  },
  en: {
    titulo: "Why book with ExploraSpain",
    items: [
      { t: "100% secure payment", d: "Via Bókun and official partners" },
      { t: "Instant confirmation", d: "Your ticket on your phone" },
      { t: "Customer support", d: "We help you with your booking" },
      { t: "Independent guides", d: "No tourist filler" },
    ],
    partners: "Bookings through official partners",
  },
  de: {
    titulo: "Warum mit ExploraSpain buchen",
    items: [
      { t: "100% sichere Zahlung", d: "Über Bókun und offizielle Partner" },
      { t: "Sofortige Bestätigung", d: "Dein Ticket auf dem Handy" },
      { t: "Kundenservice", d: "Wir helfen dir bei der Buchung" },
      { t: "Unabhängige Reiseführer", d: "Kein touristischer Fülltext" },
    ],
    partners: "Buchungen über offizielle Partner",
  },
  fr: {
    titulo: "Pourquoi réserver avec ExploraSpain",
    items: [
      { t: "Paiement 100 % sécurisé", d: "Via Bókun et des partenaires officiels" },
      { t: "Confirmation immédiate", d: "Votre billet sur votre mobile" },
      { t: "Service client", d: "Nous vous aidons pour votre réservation" },
      { t: "Sélection indépendante", d: "Sans remplissage touristique" },
    ],
    partners: "Réservations via des partenaires officiels",
  },
  it: {
    titulo: "Perché prenotare con ExploraSpain",
    items: [
      { t: "Pagamento sicuro al 100%", d: "Tramite Bókun e partner ufficiali" },
      { t: "Conferma immediata", d: "Il tuo biglietto sul cellulare" },
      { t: "Assistenza clienti", d: "Ti aiutiamo con la tua prenotazione" },
      { t: "Selezione indipendente", d: "Niente riempitivi turistici" },
    ],
    partners: "Prenotazioni tramite partner ufficiali",
  },
  pt: {
    titulo: "Porquê reservar com a ExploraSpain",
    items: [
      { t: "Pagamento 100% seguro", d: "Via Bókun e parceiros oficiais" },
      { t: "Confirmação imediata", d: "O seu bilhete no telemóvel" },
      { t: "Apoio ao cliente", d: "Ajudamos com a sua reserva" },
      { t: "Seleção independente", d: "Sem enchimento turístico" },
    ],
    partners: "Reservas através de parceiros oficiais",
  },
} as const satisfies Record<Idioma, { titulo: string; items: ReadonlyArray<{ t: string; d: string }>; partners: string }>;

const ICONOS: ReadonlyArray<JSX.Element> = [
  <path key="l" d="M7 11V7a5 5 0 0110 0v4M5 11h14v10H5z" />,
  <path key="b" d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  <path key="h" d="M3 12a9 9 0 0118 0v5a2 2 0 01-2 2h-2v-6h4M3 12v5a2 2 0 002 2h2v-6H3" />,
  <path key="s" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zM9 12l2 2 4-4" />,
];

/**
 * Franja de confianza bajo el hero de la home. Solo promesas verificables,
 * sin cifras inventadas. Server Component puro.
 */
export default function FranjaConfianza({ idioma }: { idioma: Idioma }) {
  const t = DICT[idioma];

  return (
    <section aria-label={t.titulo}>
      <div className="border-b border-piedra-200">
        <ul className="max-w-6xl mx-auto px-4 py-6 md:py-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          {t.items.map((item, i) => (
            <li key={item.t} className="flex items-start gap-3">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-anil-700 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                {ICONOS[i]}
              </svg>
              <div>
                <p className="font-semibold text-piedra-900">{item.t}</p>
                <p className="text-sm text-piedra-500">{item.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Fila de partners, al final de la home (justo antes del footer). */
export function FranjaPartners({ idioma }: { idioma: Idioma }) {
  const t = DICT[idioma];

  return (
    <section aria-label={t.partners} className="bg-piedra-50 border-t border-piedra-200">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-piedra-500">
          {t.partners}
        </p>
        <div className="flex items-center gap-10 opacity-70 grayscale">
          <Image src="/logos/getyourguide.svg" alt="GetYourGuide" width={47} height={40} className="h-10 w-auto" />
          <span className="text-lg font-semibold text-piedra-500">Bókun</span>
        </div>
      </div>
    </section>
  );
}
