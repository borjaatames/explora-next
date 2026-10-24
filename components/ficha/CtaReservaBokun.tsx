import type { Idioma } from "@/lib/i18n/types";
import {
  ANCLA_RESERVA,
  textosPrecioBokun,
  type DatosPrecioBokun,
} from "@/lib/reservaBokun";

type Props = DatosPrecioBokun & {
  idioma: Idioma;
  horasCancelacion?: number;
  cancelacionGratuita?: boolean;
  confirmacionInmediata?: boolean;
};

const CONFIANZA = {
  es: {
    cancelacion: (h?: number) => (h ? `Cancelación gratis hasta ${h} h antes` : "Cancelación gratis"),
    confirmacion: "Confirmación inmediata",
    pago: "Pago seguro",
  },
  en: {
    cancelacion: (h?: number) => (h ? `Free cancellation up to ${h}h before` : "Free cancellation"),
    confirmacion: "Instant confirmation",
    pago: "Secure payment",
  },
  de: {
    cancelacion: (h?: number) => (h ? `Kostenlose Stornierung bis ${h} Std. vorher` : "Kostenlose Stornierung"),
    confirmacion: "Sofortige Bestätigung",
    pago: "Sichere Zahlung",
  },
} as const;

/**
 * Precio "desde" + botón que baja al calendario de reserva, en la cabecera
 * de las fichas Bókun. Pensado para el tráfico de anuncios: el precio y la
 * acción quedan a la vista sin hacer scroll, en móvil y en escritorio.
 *
 * Server Component: el salto es un enlace de ancla nativo, sin JavaScript.
 */
export default function CtaReservaBokun({
  idioma,
  horasCancelacion,
  cancelacionGratuita,
  confirmacionInmediata,
  ...datos
}: Props) {
  if (!(datos.precioDesde > 0)) return null;
  const t = textosPrecioBokun(datos, idioma);
  const c = CONFIANZA[idioma === "en" || idioma === "de" ? idioma : "es"];
  const garantias = [
    ...(cancelacionGratuita ? [c.cancelacion(horasCancelacion)] : []),
    ...(confirmacionInmediata ? [c.confirmacion] : []),
    c.pago,
  ];

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
      <p className="text-piedra-900">
        <span className="text-sm text-piedra-500">{t.desde} </span>
        <span className="text-2xl font-bold">{t.precio}</span>
        <span className="text-sm text-piedra-500"> {t.unidad}</span>
      </p>
      <a
        href={`#${ANCLA_RESERVA}`}
        className="inline-flex items-center justify-center rounded-lg bg-azafran-400 hover:bg-azafran-500 px-5 py-3 text-sm font-semibold text-piedra-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2"
      >
        {t.verFechas} →
      </a>
      <p className="w-full text-sm text-piedra-600 flex flex-wrap gap-x-4 gap-y-1">
        {garantias.map((g) => (
          <span key={g} className="inline-flex items-center gap-1">
            <span aria-hidden="true" className="text-anil-600">
              ✓
            </span>
            {g}
          </span>
        ))}
      </p>
    </div>
  );
}
