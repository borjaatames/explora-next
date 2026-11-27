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
 * Además, la primera vez que el visitante toca dentro del calendario de GYG
 * o de Bókun (iframes de otro dominio, donde no llegan los clics) se envía
 * «Widget interaccion» con el proveedor y posicion «widget». Se detecta
 * porque la ventana pierde el foco y el elemento activo pasa a ser el iframe.
 *
 * Los enlaces a una ficha que no son de reserva (portada, listados, páginas
 * de ciudad y de atracción, fichas relacionadas) se cuentan aparte, como
 * «Ficha clic», para no inflar «Reserva clic». Propiedades:
 *   - origen: portada | listado | atraccion | ciudad | privados | ficha | guia | otro
 *   - posicion: «barra» si el enlace está en un elemento fijo; si no, «pagina».
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

type OrigenFicha =
  | "portada"
  | "listado"
  | "atraccion"
  | "ciudad"
  | "privados"
  | "ficha"
  | "guia"
  | "otro";

const PREFIJO_IDIOMA = /^\/(?:en|de|fr|it|pt)(?=\/|$)/;

/** Ruta de una ficha concreta (no un listado ni una categoría). */
function esRutaFicha(ruta: string): boolean {
  return /\/(?:actividades|activities)\/(?!c\/)[^/]+\/?$/.test(ruta);
}

function origenDe(ruta: string): OrigenFicha {
  const sinIdioma = ruta.replace(PREFIJO_IDIOMA, "") || "/";
  if (sinIdioma === "/") return "portada";
  if (/^\/(?:ciudades|cities)\/[^/]+\/(?:atracciones|attractions)(?:\/|$)/.test(sinIdioma)) {
    return "atraccion";
  }
  if (/^\/(?:ciudades|cities)\/[^/]+\/(?:excursiones-privadas|private-tours)(?:\/|$)/.test(sinIdioma)) {
    return "privados";
  }
  if (esRutaFicha(sinIdioma)) return "ficha";
  if (/^\/(?:ciudades|cities)\/[^/]+\/(?:actividades|activities)(?:\/|$)/.test(sinIdioma)) {
    return "listado";
  }
  if (/^\/(?:ciudades|cities)\/[^/]+\/?$/.test(sinIdioma)) return "ciudad";
  if (/^\/(?:guias|guides)(?:\/|$)/.test(sinIdioma)) return "guia";
  return "otro";
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
      if (proveedor === "ficha" && !marcado) {
        const destino = new URL(enlace.href, window.location.href).pathname;
        if (!esRutaFicha(destino) || destino === window.location.pathname) return;
        track("Ficha clic", {
          origen: origenDe(window.location.pathname),
          posicion: estaEnElementoFijo(enlace) ? "barra" : "pagina",
        });
        return;
      }
      const posicion = marcado?.dataset.reserva ?? (estaEnElementoFijo(enlace) ? "barra" : "pagina");
      track("Reserva clic", { proveedor, posicion });
    }
    const widgetsTocados = new Set<HTMLIFrameElement>();
    function alPerderFoco() {
      // El foco pasa al iframe justo después del blur.
      window.setTimeout(() => {
        const activo = document.activeElement;
        if (!(activo instanceof HTMLIFrameElement) || widgetsTocados.has(activo)) return;
        const src = activo.src;
        const proveedor: Proveedor | null = src.includes("getyourguide.com")
          ? "getyourguide"
          : src.includes("bokun.io")
            ? "bokun"
            : null;
        if (!proveedor) return;
        widgetsTocados.add(activo);
        track("Widget interaccion", { proveedor, posicion: "widget" });
      }, 0);
    }

    document.addEventListener("click", alClick, { capture: true });
    window.addEventListener("blur", alPerderFoco);
    return () => {
      document.removeEventListener("click", alClick, { capture: true });
      window.removeEventListener("blur", alPerderFoco);
    };
  }, []);

  return null;
}
