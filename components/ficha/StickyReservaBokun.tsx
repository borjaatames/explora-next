"use client";

import { useEffect, useState } from "react";
import type { Idioma } from "@/lib/i18n/types";
import {
  ANCLA_RESERVA,
  textosPrecioBokun,
  type DatosPrecioBokun,
} from "@/lib/reservaBokun";

type Props = DatosPrecioBokun & {
  idioma: Idioma;
  ratingProveedor?: number;
  numeroOpiniones?: number;
  /** Aviso de disponibilidad cierto (frontmatter `avisoReserva`). */
  aviso?: string;
};

/**
 * Barra fija inferior (solo móvil) para las fichas Bókun.
 *
 * En móvil el calendario de Bókun queda al final de la ficha; esta barra
 * mantiene precio y acción siempre a mano y baja hasta él. Visible desde la
 * carga; solo se oculta mientras el bloque de reserva está en pantalla, para
 * no tapar el propio calendario.
 */
export default function StickyReservaBokun({
  idioma,
  ratingProveedor,
  numeroOpiniones,
  aviso,
  ...datos
}: Props) {
  const [reservaVisible, setReservaVisible] = useState(false);

  useEffect(() => {
    const bloque = document.getElementById(ANCLA_RESERVA);
    if (!bloque || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entrada]) => setReservaVisible(entrada.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(bloque);
    return () => observer.disconnect();
  }, []);

  if (!(datos.precioDesde > 0)) return null;
  const t = textosPrecioBokun(datos, idioma);
  const visible = !reservaVisible;
  const locale = idioma === "es" ? "es-ES" : "en-GB";
  const rating =
    typeof ratingProveedor === "number" && (numeroOpiniones ?? 0) > 0
      ? `${ratingProveedor.toLocaleString(locale, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })} (${(numeroOpiniones ?? 0).toLocaleString(locale)})`
      : null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-piedra-200 shadow-lg transition-transform duration-300 pb-[env(safe-area-inset-bottom)] ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      role="region"
      aria-label={idioma === "es" ? "Reservar actividad" : "Book activity"}
      aria-hidden={!visible}
    >
      {aviso && (
        <p className="bg-azafran-50 border-b border-azafran-200 text-azafran-900 text-xs font-semibold text-center px-4 py-1.5">
          {aviso}
        </p>
      )}
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-6xl mx-auto">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-base font-bold text-piedra-900 leading-tight">
            {t.desde} {t.precio}
          </span>
          <span className="text-xs text-piedra-500 leading-tight line-clamp-2">
            {rating && (
              <>
                <span aria-hidden="true" className="text-azafran-500">
                  ★
                </span>{" "}
                <span className="font-semibold text-piedra-900">{rating}</span>
                {" · "}
              </>
            )}
            {t.unidad}
          </span>
        </div>
        <a
          href={`#${ANCLA_RESERVA}`}
          tabIndex={visible ? 0 : -1}
          className="inline-flex items-center justify-center rounded-lg bg-azafran-400 hover:bg-azafran-500 px-4 py-3 text-sm font-semibold text-piedra-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
        >
          {t.verFechas} →
        </a>
      </div>
    </div>
  );
}
