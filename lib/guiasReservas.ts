import type { ParadaMapa } from "@/lib/mapasGuias";
import { obtenerListaActividadesPorCiudad } from "./actividades";
import type { ActividadListItem } from "./actividades";
import type { Idioma } from "./i18n/types";
import { IDIOMA_LOCALE } from "./i18n/config";

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
  | { tipo: "actividad"; slug: string }
  | { tipo: "mapa"; dia: number; paradas: ParadaMapa[] };

/**
 * Idioma base de las fichas de una guía. Las guías que no son ES/EN (DE, FR, IT, PT)
 * parten de las fichas EN (hay muchas más) y `preferirFichasDe` cambia por la
 * versión en el idioma de la guía las que la tienen (actividades que se hacen
 * en ese idioma).
 */
export function idiomaFichas(idioma: Idioma): Idioma {
  return idioma === "es" ? "es" : "en";
}

/**
 * Índice de fichas publicadas de una ciudad, accesible tanto por el slug del
 * idioma de la guía como por el slug ES (que es el que usan los shortcodes y
 * el campo `actividades:` de las guías).
 */
/**
 * Ciudades cuyas guías pueden citar fichas de la otra (Jerez tuvo sus fichas
 * dentro de Cádiz hasta el 31 oct 2026 y las guías de Cádiz las siguen citando).
 * Las fichas de la propia ciudad tienen prioridad.
 */
const CIUDADES_VECINAS: Readonly<Record<string, readonly string[]>> = {
  cadiz: ["jerez-de-la-frontera"],
  "jerez-de-la-frontera": ["cadiz"],
};

export function indexarFichasCiudad(
  idioma: Idioma,
  ciudad: string,
  ciudadesExtra: readonly string[] = []
): Map<string, ActividadListItem> {
  const indice = new Map<string, ActividadListItem>();
  // Orden: extras y vecinas primero, la propia ciudad al final para que sus
  // fichas ganen si un slug coincide.
  const ciudades = [
    ...new Set([
      ...ciudadesExtra.filter((c) => c !== ciudad),
      ...(CIUDADES_VECINAS[ciudad] ?? []),
      ciudad,
    ]),
  ];
  for (const c of ciudades) {
    for (const a of obtenerListaActividadesPorCiudad(idiomaFichas(idioma), c)) {
      indice.set(a.slug, a);
      if (a.slugs?.es) indice.set(a.slugs.es, a);
    }
    if (idioma !== idiomaFichas(idioma)) {
      for (const a of obtenerListaActividadesPorCiudad(idioma, c)) {
        indice.set(a.slug, a);
        if (a.slugs?.es) indice.set(a.slugs.es, a);
        if (a.slugs?.en) indice.set(a.slugs.en, a);
      }
    }
  }
  return indice;
}

/**
 * En los idiomas que no son ES/EN, cambia cada ficha EN por su versión en el
 * idioma de la guía cuando existe (misma `slugs.es`). En ES/EN devuelve la
 * lista tal cual.
 */
export function preferirFichasDe(
  idioma: Idioma,
  lista: ActividadListItem[]
): ActividadListItem[] {
  if (idioma === idiomaFichas(idioma)) return lista;
  const porCiudad = new Map<string, Map<string, ActividadListItem>>();
  const fichaDe = (a: ActividadListItem): ActividadListItem | undefined => {
    let mapa = porCiudad.get(a.ciudad);
    if (!mapa) {
      mapa = new Map(
        obtenerListaActividadesPorCiudad(idioma, a.ciudad).map((d) => [d.slugs?.es ?? d.slug, d])
      );
      porCiudad.set(a.ciudad, mapa);
    }
    return mapa.get(a.slugs?.es ?? a.slug);
  };
  return lista.map((a) => fichaDe(a) ?? a);
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

export function formatearPrecio(
  a: Pick<ActividadListItem, "precioDesde" | "moneda">,
  idioma: Idioma
): string {
  return new Intl.NumberFormat(IDIOMA_LOCALE[idioma], {
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
  return a.ratingProveedor.toLocaleString(IDIOMA_LOCALE[idioma], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function formatearOpiniones(
  a: Pick<ActividadListItem, "numeroOpiniones">,
  idioma: Idioma
): string | null {
  if (!a.numeroOpiniones) return null;
  return a.numeroOpiniones.toLocaleString(IDIOMA_LOCALE[idioma]);
}

// Enlaces internos a fichas en cualquiera de los idiomas activos.
const RE_ENLACE_FICHA =
  /<a href="(\/ciudades\/[^/"]+\/actividades\/([a-z0-9-]+)|\/(?:en|de|fr|it|pt)\/cities\/[^/"]+\/activities\/([a-z0-9-]+))">([\s\S]*?)<\/a>/g;

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
          if (rating) partes.push(`<span class="text-azafran-500" aria-hidden="true">★</span> ${rating}`);
          const pildora =
            `<span class="inline-flex items-center gap-1 align-[1px] ml-1.5 bg-anil-100 text-anil-700 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap no-underline">` +
            partes.join(" · ") +
            `</span>`;
          return `<a href="${href}"${attrs} class="reserva-enlace">${texto}${pildora}</a>`;
        }
      );
    })
    .map((seg, i) => (i % 2 === 1 ? anadirBotonesTabla(seg, idioma) : seg))
    .join("");
}

const TEXTO_BOTON_TABLA: Record<Idioma, string> = {
  es: "Reservar",
  en: "Book",
  de: "Buchen",
  fr: "Réserver",
  it: "Prenota",
  pt: "Reservar",
};

// `!` porque `.prose-guia a` (globals.css) tiene más especificidad que las utilidades.
const CLASES_BOTON_TABLA =
  "reserva-tabla inline-block mt-1 ml-1 bg-azafran-500 hover:bg-azafran-600 !text-piedra-900 text-xs font-semibold px-2.5 py-1 rounded !no-underline whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2";

/**
 * En cada celda de tabla que contenga un enlace ya enriquecido a una ficha,
 * añade al final un botón «Reservar» hacia la misma ficha. Un botón por celda.
 */
function anadirBotonesTabla(tabla: string, idioma: Idioma): string {
  const texto = TEXTO_BOTON_TABLA[idioma];
  return tabla.replace(/(<td[^>]*>)([\s\S]*?)(<\/td>)/g, (celda: string, apertura: string, contenido: string, cierre: string) => {
    const m = contenido.match(/<a href="([^"]+)" data-reserva="tabla" data-ficha="([^"]+)">/);
    if (!m) return celda;
    const boton = `<a href="${m[1]}" data-reserva="tabla" data-ficha="${m[2]}" class="${CLASES_BOTON_TABLA}">${texto}</a>`;
    return `${apertura}${contenido} ${boton}${cierre}`;
  });
}
