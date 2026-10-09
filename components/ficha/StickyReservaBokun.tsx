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
};

/**
 * Barra fija inferior (solo móvil) para las fichas Bókun.
 *
 * En móvil el calendario de Bókun queda al final de la ficha; esta barra
 * mantiene precio y acción siempre a mano y baja hasta él. Aparece tras el
 * primer scroll y se oculta mientras el bloque de reserva está en pantalla,
 * para no tapar el propio calendario.
 */
export default function StickyReservaBokun({ idioma, ...datos }: Props) {
  const [haHechoScroll, setHaHechoScroll] = useState(false);
  const [reservaVisible, setReservaVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setHaHechoScroll(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const visible = haHechoScroll && !reservaVisible;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-slate-200 shadow-lg transition-transform duration-300 pb-[env(safe-area-inset-bottom)] ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      role="region"
      aria-label={idioma === "es" ? "Reservar actividad" : "Book activity"}
      aria-hidden={!visible}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-6xl mx-auto">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-base font-bold text-slate-900 leading-tight">
            {t.desde} {t.precio}
          </span>
          <span className="text-xs text-slate-500 leading-tight truncate">
            {t.unidad}
          </span>
        </div>
        <a
          href={`#${ANCLA_RESERVA}`}
          tabIndex={visible ? 0 : -1}
          className="inline-flex items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 whitespace-nowrap"
        >
          {t.verFechas} →
        </a>
      </div>
    </div>
  );
}
