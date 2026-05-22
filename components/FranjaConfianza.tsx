import type { ReactNode } from "react";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Franja de confianza: banda sobria justo bajo el hero de la ficha (y
 * reutilizable en landings SEM) con las garantías que reducen la fricción
 * de compra: cancelación gratis, confirmación inmediata y pago seguro.
 *
 * Es un Server Component puro (sin estado ni interactividad): se renderiza
 * estático en build (SSG) y no añade JS al cliente.
 *
 * La cancelación solo aparece si la actividad la ofrece (dato real del .md);
 * confirmación y pago seguro son garantías estándar de la plataforma.
 */

type Props = {
  idioma: Idioma;
  /** Solo se muestra la garantía de cancelación si es `true`. */
  cancelacionGratuita?: boolean;
  /** Horas de antelación para cancelar (ej. 24). Opcional. */
  horasCancelacion?: number;
  /** Nombre comercial del proveedor (Viator / GetYourGuide). */
  nombreProveedor: string;
};

type Copy = {
  ariaRegion: string;
  cancelacion: string;
  cancelacionHoras: (h: number) => string;
  cancelacionSinHoras: string;
  confirmacion: string;
  confirmacionSub: string;
  pago: string;
  pagoVia: (p: string) => string;
};

const COPY: Record<"es" | "en", Copy> = {
  es: {
    ariaRegion: "Garantías de reserva",
    cancelacion: "Cancelación gratis",
    cancelacionHoras: (h) => `Hasta ${h} h antes`,
    cancelacionSinHoras: "Reembolso sin complicaciones",
    confirmacion: "Confirmación inmediata",
    confirmacionSub: "Recibes tu reserva al instante",
    pago: "Pago seguro",
    pagoVia: (p) => `Procesado por ${p}`,
  },
  en: {
    ariaRegion: "Booking guarantees",
    cancelacion: "Free cancellation",
    cancelacionHoras: (h) => `Up to ${h}h before`,
    cancelacionSinHoras: "Hassle-free refund",
    confirmacion: "Instant confirmation",
    confirmacionSub: "Get your booking right away",
    pago: "Secure payment",
    pagoVia: (p) => `Processed by ${p}`,
  },
};

type Garantia = { icono: ReactNode; titulo: string; sub: string };

export default function FranjaConfianza({
  idioma,
  cancelacionGratuita,
  horasCancelacion,
  nombreProveedor,
}: Props) {
  const c = idioma === "es" ? COPY.es : COPY.en;

  const garantias: Garantia[] = [];

  if (cancelacionGratuita) {
    garantias.push({
      icono: <IconoCancelacion />,
      titulo: c.cancelacion,
      sub: horasCancelacion
        ? c.cancelacionHoras(horasCancelacion)
        : c.cancelacionSinHoras,
    });
  }

  garantias.push({
    icono: <IconoConfirmacion />,
    titulo: c.confirmacion,
    sub: c.confirmacionSub,
  });

  garantias.push({
    icono: <IconoPago />,
    titulo: c.pago,
    sub: c.pagoVia(nombreProveedor),
  });

  return (
    <section aria-label={c.ariaRegion} className="border-b border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <ul className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
          {garantias.map((g) => (
            <li key={g.titulo} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600"
              >
                {g.icono}
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-slate-900">
                  {g.titulo}
                </span>
                <span className="block text-xs text-slate-500">{g.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Iconos (SVG inline, heredan color con currentColor) ─────────────────── */

function IconoCancelacion() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function IconoConfirmacion() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5L16 9" />
    </svg>
  );
}

function IconoPago() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
