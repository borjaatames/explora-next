import {
  IDIOMA_DEFECTO,
  IDIOMA_LOCALE,
  URL_SEGMENTS,
  esIdiomaActivo,
} from "./config";
import type { Idioma } from "./types";

/**
 * Devuelve el prefijo de URL para un idioma.
 * Idioma por defecto (es): "" (sin prefijo).
 * Resto: "/en", "/de", etc.
 */
export function prefijoIdioma(idioma: Idioma): string {
  return idioma === IDIOMA_DEFECTO ? "" : `/${idioma}`;
}

/**
 * Construye la URL canónica de una guía para un idioma dado.
 * ES: /guias/madrid/madrid-en-3-dias
 * EN: /en/guides/madrid/madrid-in-3-days
 */
export function urlGuia(
  idioma: Idioma,
  categoria: string,
  slug: string
): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].guias;
  return `${prefijo}/${segmento}/${categoria}/${slug}`;
}

/**
 * Construye la URL del índice de guías.
 */
export function urlIndiceGuias(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].guias;
  return `${prefijo}/${segmento}`;
}

/**
 * Construye la URL canónica de una ciudad.
 */
export function urlCiudad(idioma: Idioma, slug: string): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].ciudades;
  return `${prefijo}/${segmento}/${slug}`;
}

/**
 * Construye la URL del índice de ciudades.
 */
export function urlIndiceCiudades(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].ciudades;
  return `${prefijo}/${segmento}`;
}

/**
 * Resuelve el idioma desde el primer segmento de un pathname.
 * "/en/guides/..." → "en"
 * "/guias/..."     → "es"
 * Si el segmento no es un idioma activo, devuelve IDIOMA_DEFECTO.
 */
export function resolverIdiomaDesdePath(pathname: string): Idioma {
  const segmento = pathname.split("/").filter(Boolean)[0];
  if (segmento && esIdiomaActivo(segmento)) return segmento;
  return IDIOMA_DEFECTO;
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) en el locale del idioma.
 */
export function formatearFecha(iso: string, idioma: Idioma): string {
  if (!iso) return "";
  try {
    const fecha = new Date(iso);
    return fecha.toLocaleDateString(IDIOMA_LOCALE[idioma], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}