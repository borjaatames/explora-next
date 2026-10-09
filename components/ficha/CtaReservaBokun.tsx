import type { Idioma } from "@/lib/i18n/types";
import {
  ANCLA_RESERVA,
  textosPrecioBokun,
  type DatosPrecioBokun,
} from "@/lib/reservaBokun";

type Props = DatosPrecioBokun & {
  idioma: Idioma;
};

/**
 * Precio "desde" + botón que baja al calendario de reserva, en la cabecera
 * de las fichas Bókun. Pensado para el tráfico de anuncios: el precio y la
 * acción quedan a la vista sin hacer scroll, en móvil y en escritorio.
 *
 * Server Component: el salto es un enlace de ancla nativo, sin JavaScript.
 */
export default function CtaReservaBokun({ idioma, ...datos }: Props) {
  if (!(datos.precioDesde > 0)) return null;
  const t = textosPrecioBokun(datos, idioma);

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
      <p className="text-slate-900">
        <span className="text-sm text-slate-500">{t.desde} </span>
        <span className="text-2xl font-bold">{t.precio}</span>
        <span className="text-sm text-slate-500"> {t.unidad}</span>
      </p>
      <a
        href={`#${ANCLA_RESERVA}`}
        className="inline-flex items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        {t.verFechas} →
      </a>
    </div>
  );
}
