import { obtenerListaActividadesPorCiudad } from "./actividades";
import type { ActividadListItem } from "./actividades";
import type { Idioma } from "./i18n/types";

// =============================================================================
// Reservas dentro de una guía editorial
// -----------------------------------------------------------------------------
// Tres mecanismos, todos alimentados por el frontmatter de las fichas (precio,
// rating, cancelación), nunca por texto escrito a mano en la guía:
//
//   1. Shortcode `[actividad: slug-es]` en un párrafo propio del markdown →
//      el page lo sustituye por <TarjetaReservaInline> (React, con next/image).
//      `partirHtmlPorShortcodes` devuelve los trozos de HTML y los slugs.
//   2. Enlaces internos a fichas (`/ciudades/x/actividades/y`, `/en/cities/…`)
//      → `enriquecerEnlacesFichas` les añade una píldora con precio y
//      valoración y los atributos `data-reserva` para la medición.
//   3. Medición: cada elemento clicable lleva `data-reserva="<posicion>"` y
//      `data-ficha="<slug>"`; <TrackingReservasGuia> (cliente) delega el click
//      y envía `click_reserva` a GA4 con guía, ficha y posición.
//
// Las posiciones medidas: "inline" (tarjeta en el texto), "enlace" (píldora),
// "top" (bloque bajo el hero), "carrusel" (pie), "sticky" (barra móvil),
// "tabla" (botón «Reservar» junto al enlace dentro de una tabla).
// =============================================================================

export type PosicionReserva =
  | "inline"
  | "enlace"
  | "top"
  | "carrusel"
  | "sticky"
  | "tabla";

export type TrozoGuia =
  | { tipo: "html"; html: string }
  | { tipo: "actividad"; slug: string };

/**
 * Idioma en el que existen fichas para una guía. Solo hay fichas ES y EN:
 * las guías DE ofrecen las fichas EN (mejor una ficha en inglés que ninguna).
 */
export function idiomaFichas(idioma: Idioma): Idioma {
  return idioma === "es" ? "es" : "en";
}

/**
 * Índice de fichas publicadas de una ciudad, accesible tanto por el slug del
 * idioma de la guía como por el slug ES (que es el que usan los shortcodes y
 * el campo `actividades:` de las guías).
 */
export function indexarFichasCiudad(
  idioma: Idioma,
  ciudad: string
): Map<string, ActividadListItem> {
  const indice = new Map<string, ActividadListItem>();
  for (const a of obtenerListaActividadesPorCiudad(idiomaFichas(idioma), ciudad)) {
    indice.set(a.slug, a);
    if (a.slugs?.es) indice.set(a.slugs.es, a);
  }
  return indice;
}

const RE_SHORTCODE = /<p>\s*\[actividad:\s*([a-z0-9-]+)\s*\]\s*<\/p>/g;

/**
 * Separa el HTML de la guía en trozos: HTML normal y shortcodes de actividad.
 * Un shortcode cuya ficha no existe (o no está publicada) se elimina sin
 * dejar rastro, para que una ficha despublicada nunca rompa una guía.
 */
export function partirHtmlPorShortcodes(
  html: string,
  fichas: Map<string, ActividadListItem>
): TrozoGuia[] {
  const trozos: TrozoGuia[] = [];
  let ultimo = 0;
  for (const m of html.matchAll(RE_SHORTCODE)) {
    const inicio = m.index ?? 0;
    if (inicio > ultimo) trozos.push({ tipo: "html", html: html.slice(ultimo, inicio) });
    if (fichas.has(m[1])) trozos.push({ tipo: "actividad", slug: m[1] });
    ultimo = inicio + m[0].length;
  }
  if (ultimo < html.length) trozos.push({ tipo: "html", html: html.slice(ultimo) });
  return trozos;
}

/** Slugs (ES) de las tarjetas inline, en orden de aparición. */
export function slugsInline(trozos: TrozoGuia[]): string[] {
  return trozos.flatMap((t) => (t.tipo === "actividad" ? [t.slug] : []));
}

const LOCALE: Record<string, string> = { es: "es-ES", en: "en-US", de: "de-DE" };

export function formatearPrecio(
  a: Pick<ActividadListItem, "precioDesde" | "moneda">,
  idioma: Idioma
): string {
  return new Intl.NumberFormat(LOCALE[idioma] ?? "es-ES", {
    style: "currency",
    currency: a.moneda,
    maximumFractionDigits: 0,
  }).format(a.precioDesde);
}

export function formatearRating(
  a: Pick<ActividadListItem, "ratingProveedor">,
  idioma: Idioma
): string | null {
  if (a.ratingProveedor === undefined) return null;
  return a.ratingProveedor.toLocaleString(LOCALE[idioma] ?? "es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function formatearOpiniones(
  a: Pick<ActividadListItem, "numeroOpiniones">,
  idioma: Idioma
): string | null {
  if (!a.numeroOpiniones) return null;
  return a.numeroOpiniones.toLocaleString(LOCALE[idioma] ?? "es-ES");
}

// Enlaces internos a fichas en cualquiera de los tres idiomas activos.
const RE_ENLACE_FICHA =
  /<a href="(\/ciudades\/[^/"]+\/actividades\/([a-z0-9-]+)|\/(?:en|de)\/cities\/[^/"]+\/activities\/([a-z0-9-]+))">([\s\S]*?)<\/a>/g;

/**
 * Añade a cada enlace a una ficha publicada:
 *   - `data-reserva="enlace"` + `data-ficha` para la medición;
 *   - una píldora "20 € · ★ 4,7" leída del frontmatter de la ficha.
 * Dentro de tablas no se añade la píldora (ya suelen tener columna de precio y
 * valoración); en su lugar, al final de la celda va un botón «Reservar» que
 * hace visible que el enlace lleva a una actividad reservable
 * (`data-reserva="tabla"`). Los enlaces a fichas desconocidas se dejan intactos.
 */
export function enriquecerEnlacesFichas(
  html: string,
  fichas: Map<string, ActividadListItem>,
  idioma: Idioma
): string {
  // Partimos por tablas para no duplicar precio/rating dentro de ellas.
  const segmentos = html.split(/(<table[\s\S]*?<\/table>)/g);
  return segmentos
    .map((seg, i) => {
      const enTabla = i % 2 === 1;
      return seg.replace(
        RE_ENLACE_FICHA,
        (original, href: string, slugEs: string | undefined, slugOtro: string | undefined, texto: string) => {
          const ficha = fichas.get(slugEs ?? slugOtro ?? "");
          if (!ficha) return original;
          const attrs = ` data-reserva="enlace" data-ficha="${ficha.slugs?.es ?? ficha.slug}"`;
          if (enTabla) return `<a href="${href}"${attrs.replace('"enlace"', '"tabla"')}>${texto}</a>`;
          const rating = formatearRating(ficha, idioma);
          const partes = [formatearPrecio(ficha, idioma)];
          if (rating) partes.push(`<span class="text-amber-500" aria-hidden="true">★</span> ${rating}`);
          const pildora =
            `<span class="inline-flex items-center gap-1 align-[1px] ml-1.5 bg-sky-100 text-sky-700 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap no-underline">` +
            partes.join(" · ") +
            `</span>`;
          return `<a href="${href}"${attrs} class="reserva-enlace">${texto}${pildora}</a>`;
        }
      );
    })
    .map((seg, i) => (i % 2 === 1 ? anadirBotonesTabla(seg, idioma) : seg))
    .join("");
}

const TEXTO_BOTON_TABLA: Record<string, string> = {
  es: "Reservar",
  en: "Book",
  de: "Buchen",
};

// `!` porque `.prose-guia a` (globals.css) tiene más especificidad que las utilidades.
const CLASES_BOTON_TABLA =
  "reserva-tabla inline-block mt-1 ml-1 bg-amber-500 hover:bg-amber-600 !text-white text-xs font-semibold px-2.5 py-1 rounded !no-underline whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2";

/**
 * En cada celda de tabla que contenga un enlace ya enriquecido a una ficha,
 * añade al final un botón «Reservar» hacia la misma ficha. Un botón por celda.
 */
function anadirBotonesTabla(tabla: string, idioma: Idioma): string {
  const texto = TEXTO_BOTON_TABLA[idioma] ?? TEXTO_BOTON_TABLA.es;
  return tabla.replace(/(<td[^>]*>)([\s\S]*?)(<\/td>)/g, (celda: string, apertura: string, contenido: string, cierre: string) => {
    const m = contenido.match(/<a href="([^"]+)" data-reserva="tabla" data-ficha="([^"]+)">/);
    if (!m) return celda;
    const boton = `<a href="${m[1]}" data-reserva="tabla" data-ficha="${m[2]}" class="${CLASES_BOTON_TABLA}">${texto}</a>`;
    return `${apertura}${contenido} ${boton}${cierre}`;
  });
}
