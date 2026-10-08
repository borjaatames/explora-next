import Image from "next/image";
import type { Idioma } from "@/lib/i18n/types";

const DICT = {
  es: {
    titulo: "Por qué reservar con ExploraSpain",
    items: [
      { t: "Pago 100% seguro", d: "Vía Stripe y partners oficiales" },
      { t: "Confirmación inmediata", d: "Tu entrada, en el móvil" },
      { t: "Atención al cliente", d: "Te ayudamos con tu reserva" },
      { t: "Guías independientes", d: "Sin relleno turístico" },
    ],
    partners: "Reservas con partners oficiales",
  },
  en: {
    titulo: "Why book with ExploraSpain",
    items: [
      { t: "100% secure payment", d: "Via Stripe and official partners" },
      { t: "Instant confirmation", d: "Your ticket on your phone" },
      { t: "Customer support", d: "We help you with your booking" },
      { t: "Independent guides", d: "No tourist filler" },
    ],
    partners: "Bookings through official partners",
  },
  de: {
    titulo: "Warum mit ExploraSpain buchen",
    items: [
      { t: "100% sichere Zahlung", d: "Über Stripe und offizielle Partner" },
      { t: "Sofortige Bestätigung", d: "Dein Ticket auf dem Handy" },
      { t: "Kundenservice", d: "Wir helfen dir bei der Buchung" },
      { t: "Unabhängige Reiseführer", d: "Kein touristischer Fülltext" },
    ],
    partners: "Buchungen über offizielle Partner",
  },
} as const;

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
  const t = DICT[idioma === "en" ? "en" : idioma === "de" ? "de" : "es"];

  return (
    <section aria-label={t.titulo}>
      <div className="border-b border-slate-200">
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
                className="text-sky-700 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                {ICONOS[i]}
              </svg>
              <div>
                <p className="font-semibold text-slate-900">{item.t}</p>
                <p className="text-sm text-slate-500">{item.d}</p>
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
  const t = DICT[idioma === "en" ? "en" : idioma === "de" ? "de" : "es"];

  return (
    <section aria-label={t.partners} className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {t.partners}
        </p>
        <div className="flex items-center gap-10 opacity-70 grayscale">
          <Image src="/logos/getyourguide.svg" alt="GetYourGuide" width={47} height={40} className="h-10 w-auto" />
          <Image src="/logos/viator.svg" alt="Viator" width={100} height={32} className="h-6 w-auto" />
          <span className="text-lg font-semibold text-slate-500">Stripe</span>
        </div>
      </div>
    </section>
  );
}
