"use client";

import { useEffect } from "react";

type Props = {
  guiaSlug: string;
  ciudad: string;
  idioma: string;
};

type Gtag = (
  comando: "event",
  nombre: string,
  parametros: Record<string, unknown>
) => void;

/**
 * Medición de clics hacia fichas desde una guía. Un único listener delegado:
 * cualquier `<a data-reserva="posicion" data-ficha="slug">` de la página
 * dispara `click_reserva` en GA4 con la guía, la ficha y la posición
 * (inline / enlace / top / carrusel / sticky). Con eso se compara qué
 * posición convierte sin tocar los componentes.
 */
export default function TrackingReservasGuia({ guiaSlug, ciudad, idioma }: Props) {
  useEffect(() => {
    function alClick(evento: MouseEvent) {
      const objetivo = evento.target;
      if (!(objetivo instanceof Element)) return;
      const enlace = objetivo.closest<HTMLElement>("[data-reserva]");
      if (!enlace) return;
      const gtag = (window as unknown as { gtag?: Gtag }).gtag;
      if (typeof gtag !== "function") return;
      gtag("event", "click_reserva", {
        event_category: "guia",
        guia_slug: guiaSlug,
        ciudad,
        idioma,
        ficha_slug: enlace.dataset.ficha ?? null,
        posicion: enlace.dataset.reserva ?? null,
      });
    }
    document.addEventListener("click", alClick, { capture: true });
    return () => document.removeEventListener("click", alClick, { capture: true });
  }, [guiaSlug, ciudad, idioma]);

  return null;
}
