import type { Idioma } from "@/lib/i18n/types";

/**
 * Barra de señales de confianza para el hero (fondo sky-500).
 * Texto claro (sky-50) con iconos en amber-300, según la guía de estilo.
 * Sin cifras: solo promesas verificables (atención al cliente, confirmación,
 * pago seguro). NO se promete cancelación gratuita en bloque porque algunas
 * experiencias Bokun no la permiten; eso va por ficha. Server Component puro.
 */

const DICT = {
  es: {
    cancelacion: "Atención al cliente",
    confirmacion: "Confirmación inmediata",
    pago: "Pago 100% seguro",
  },
  en: {
    cancelacion: "Customer support",
    confirmacion: "Instant confirmation",
    pago: "100% secure payment",
  },
  de: {
    cancelacion: "Kundenservice",
    confirmacion: "Sofortige Bestätigung",
    pago: "100% sichere Zahlung",
  },
} as const;

export default function TrustStrip({ idioma }: { idioma: Idioma }) {
  const t = DICT[idioma === "en" ? "en" : idioma === "de" ? "de" : "es"];
  return (
    <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-sky-50">
      <li className="inline-flex items-center gap-2">
        <IconCheck />
        {t.cancelacion}
      </li>
      <li className="inline-flex items-center gap-2">
        <IconBolt />
        {t.confirmacion}
      </li>
      <li className="inline-flex items-center gap-2">
        <IconLock />
        {t.pago}
      </li>
    </ul>
  );
}

function IconCheck() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-amber-300"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-amber-300"
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-amber-300"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
