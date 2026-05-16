import {
  IDIOMAS_ACTIVOS,
  IDIOMA_DEFECTO,
  IDIOMA_LOCALE,
  URL_SEGMENTS,
  esIdiomaActivo,
} from "./config";
import type { Idioma } from "./types";

export function prefijoIdioma(idioma: Idioma): string {
  return idioma === IDIOMA_DEFECTO ? "" : `/${idioma}`;
}

export function urlGuia(
  idioma: Idioma,
  categoria: string,
  slug: string
): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].guias;
  return `${prefijo}/${segmento}/${categoria}/${slug}`;
}

export function urlIndiceGuias(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].guias;
  return `${prefijo}/${segmento}`;
}

export function urlCiudad(idioma: Idioma, slug: string): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].ciudades;
  return `${prefijo}/${segmento}/${slug}`;
}

export function urlIndiceCiudades(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].ciudades;
  return `${prefijo}/${segmento}`;
}

export function urlActividadesDeCiudad(
  idioma: Idioma,
  ciudad: string
): string {
  const prefijo = prefijoIdioma(idioma);
  const segmentoCiudades = URL_SEGMENTS[idioma].ciudades;
  const segmentoActividades = URL_SEGMENTS[idioma].actividades;
  return `${prefijo}/${segmentoCiudades}/${ciudad}/${segmentoActividades}`;
}

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

export function urlAtraccionesDeCiudad(
  idioma: Idioma,
  ciudad: string
): string {
  const prefijo = prefijoIdioma(idioma);
  const segmentoCiudades = URL_SEGMENTS[idioma].ciudades;
  const segmentoAtracciones = URL_SEGMENTS[idioma].atracciones;
  return `${prefijo}/${segmentoCiudades}/${ciudad}/${segmentoAtracciones}`;
}

export function urlGuiasDeCiudad(idioma: Idioma, ciudad: string): string {
  const prefijo = prefijoIdioma(idioma);
  const segmentoCiudades = URL_SEGMENTS[idioma].ciudades;
  const segmentoGuias = URL_SEGMENTS[idioma].guias;
  return `${prefijo}/${segmentoCiudades}/${ciudad}/${segmentoGuias}`;
}

export function urlActividadesDeCiudadPorCategoria(
  idioma: Idioma,
  ciudad: string,
  categoriaUrlSlug: string
): string {
  return `${urlActividadesDeCiudad(idioma, ciudad)}/c/${categoriaUrlSlug}`;
}

export function urlAvisoLegal(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].avisoLegal;
  return `${prefijo}/${segmento}`;
}

export function urlPrivacidad(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].privacidad;
  return `${prefijo}/${segmento}`;
}

export function urlCookies(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].cookies;
  return `${prefijo}/${segmento}`;
}

export function urlContacto(idioma: Idioma): string {
  const prefijo = prefijoIdioma(idioma);
  const segmento = URL_SEGMENTS[idioma].contacto;
  return `${prefijo}/${segmento}`;
}

export function resolverIdiomaDesdePath(pathname: string): Idioma {
  const segmento = pathname.split("/").filter(Boolean)[0];
  if (segmento && esIdiomaActivo(segmento)) return segmento;
  return IDIOMA_DEFECTO;
}

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

export function hreflangAlternates(
  constructorUrl: (idioma: Idioma) => string | null
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const lang of IDIOMAS_ACTIVOS) {
    const ruta = constructorUrl(lang);
    if (ruta !== null) {
      result[lang] = `${SITE_URL}${ruta}`;
    }
  }

  const rutaDefault = constructorUrl(IDIOMA_DEFECTO);
  if (rutaDefault !== null) {
    result["x-default"] = `${SITE_URL}${rutaDefault}`;
  } else {
    const primeraDisponible = IDIOMAS_ACTIVOS.find(
      (l) => constructorUrl(l) !== null
    );
    if (primeraDisponible) {
      const ruta = constructorUrl(primeraDisponible);
      if (ruta !== null) {
        result["x-default"] = `${SITE_URL}${ruta}`;
      }
    }
  }

  return result;
}
