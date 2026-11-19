"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

type Proveedor = "getyourguide" | "viator" | "bokun" | "whatsapp" | "ficha";

/**
 * Cuenta los clics de reserva en Vercel Web Analytics (evento personalizado
 * «Reserva clic»), sin cookies: incluye a quien rechaza el banner, que GA4
 * casi no ve. Vercel guarda la ruta de la página con cada evento, así que
 * bastan dos propiedades (el plan Pro admite dos):
 *   - proveedor: getyourguide | viator | bokun | whatsapp | ficha (guía → ficha)
 *   - posicion: valor de `data-reserva` si lo hay; si no, «barra» cuando el
 *     enlace está dentro de un elemento fijo (barras de móvil) o «pagina».
 *
 * Un único listener delegado en captura: no toca ningún componente ni la
 * composición de la página. Las visitas internas y los robots de medición
 * se descartan en el `beforeSend` de AnaliticaVercel, que también filtra
 * los eventos.
 */
function proveedorDe(href: string): Proveedor | null {
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  const host = url.hostname;
  if (host.endsWith("getyourguide.com") || host.endsWith("getyourguide.es")) return "getyourguide";
  if (host.endsWith("viator.com")) return "viator";
  if (host.endsWith("bokun.io")) return "bokun";
  if (host === "wa.me" || host.endsWith("whatsapp.com")) return "whatsapp";
  if (host === window.location.hostname && /\/(actividades|activities)\//.test(url.pathname)) {
    return "ficha";
  }
  return null;
}

function estaEnElementoFijo(elemento: Element): boolean {
  let actual: Element | null = elemento;
  while (actual && actual !== document.body) {
    if (window.getComputedStyle(actual).position === "fixed") return true;
    actual = actual.parentElement;
  }
  return false;
}

export default function MedicionReservas() {
  useEffect(() => {
    function alClick(evento: MouseEvent) {
      const objetivo = evento.target;
      if (!(objetivo instanceof Element)) return;
      const enlace = objetivo.closest<HTMLAnchorElement>("a[href]");
      if (!enlace) return;
      const proveedor = proveedorDe(enlace.getAttribute("href") ?? "");
      if (!proveedor) return;
      // Un enlace a otra ficha solo cuenta si está marcado como reserva
      // (guías); los enlaces internos normales no son clics de reserva.
      const marcado = enlace.closest<HTMLElement>("[data-reserva]");
      if (proveedor === "ficha" && !marcado) return;
      const posicion = marcado?.dataset.reserva ?? (estaEnElementoFijo(enlace) ? "barra" : "pagina");
      track("Reserva clic", { proveedor, posicion });
    }
    document.addEventListener("click", alClick, { capture: true });
    return () => document.removeEventListener("click", alClick, { capture: true });
  }, []);

  return null;
}
