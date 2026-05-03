import {
  IDIOMAS_ACTIVOS,
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
 * Construye la URL del listado de actividades de una ciudad.
 * ES: /ciudades/madrid/actividades
 * EN: /en/cities/madrid/activities
 */
export function urlActividadesDeCiudad(
  idioma: Idioma,
  ciudad: string
): string {
  const prefijo = prefijoIdioma(idioma);
  const segmentoCiudades = URL_SEGMENTS[idioma].ciudades;
  const segmentoActividades = URL_SEGMENTS[idioma].actividades;
  return `${prefijo}/${segmentoCiudades}/${ciudad}/${segmentoActividades}`;
}

/**
 * Construye la URL canónica de una actividad concreta.
 * ES: /ciudades/madrid/actividades/tour-prado
 * EN: /en/cities/madrid/activities/prado-tour
 */
export function urlActividad(
  idioma: Idioma,
  ciudad: string,
  slug: string
): string {
  const prefijo = prefijoIdioma(idioma);
  const segmentoCiudades = URL_SEGMENTS[idioma].ciudades;
  const segmentoActividades = URL_SEGMENTS[idioma].actividades;
  return `${prefijo}/${segmentoCiudades}/${ciudad}/${segmentoActividades}/${slug}`;
}

/**
 * Construye la URL del listado de actividades de una ciudad filtrado por
 * categoría. Usa el prefijo /c/ para evitar conflicto con el segmento
 * hermano [slug] de la ficha de actividad.
 *
 * El parámetro `categoriaUrlSlug` es el slug en kebab-case usado en URLs
 * (por ejemplo "aire-libre"), no la clave camelCase del frontmatter
 * ("aireLibre"). Para convertir entre ambas formas, usar `categoriaAUrl`
 * y `categoriaDesdeUrl` de `@/lib/actividades`.
 *
 * ES: /ciudades/madrid/actividades/c/cultural
 * EN: /en/cities/madrid/activities/c/cultural
 */
export function urlActividadesDeCiudadPorCategoria(
  idioma: Idioma,
  ciudad: string,
  categoriaUrlSlug: string
): string {
  return `${urlActividadesDeCiudad(idioma, ciudad)}/c/${categoriaUrlSlug}`;
}

/**
 * Construye la URL del aviso legal.
 * ES: /aviso-legal
 * EN: /en/legal-notice
 */
export function urlAvisoLegal(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].avisoLegal;
  return `${prefijo}/${segmento}`;
}

/**
 * Construye la URL de la política de privacidad.
 * ES: /privacidad
 * EN: /en/privacy
 */
export function urlPrivacidad(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].privacidad;
  return `${prefijo}/${segmento}`;
}

/**
 * Construye la URL de la política de cookies.
 * ES: /cookies
 * EN: /en/cookies
 */
export function urlCookies(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].cookies;
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

/**
 * Genera el objeto `alternates.languages` de Next 14 Metadata API,
 * incluyendo todos los idiomas activos. El idioma por defecto se mapea
 * también a `x-default`.
 *
 * `constructorUrl` es una función que, dado un idioma, devuelve la URL
 * (relativa) de la versión traducida de esa página. Esto desacopla la
 * generación de hreflang de la lógica concreta de cada tipo de página
 * (guía, ciudad, actividad, índice, etc.).
 *
 * Ejemplo de uso:
 *
 *   alternates: {
 *     canonical: `${SITE_URL}${urlGuia(idioma, categoria, slug)}`,
 *     languages: hreflangAlternates((l) => urlGuia(l, categoria, slug)),
 *   }
 */
export function hreflangAlternates(
  constructorUrl: (idioma: Idioma) => string
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const lang of IDIOMAS_ACTIVOS) {
    result[lang] = `${SITE_URL}${constructorUrl(lang)}`;
  }

  // x-default apunta al idioma por defecto.
  result["x-default"] = `${SITE_URL}${constructorUrl(IDIOMA_DEFECTO)}`;

  return result;
}
