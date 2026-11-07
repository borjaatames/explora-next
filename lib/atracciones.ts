import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { obtenerListaActividadesPorCiudad, type ActividadListItem, type PreguntaFrecuente } from "@/lib/actividades";
import { obtenerListaGuias, type GuiaListItem } from "@/lib/guias";
import { urlAtraccionesDeCiudad } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Páginas de atracción (`/ciudades/<ciudad>/atracciones/<slug>`): reúnen
 * todas las formas de visitar un monumento (fichas con su etiqueta en
 * `atraccionesRelacionadas`), la información práctica y las guías.
 *
 * Contenido en `content/atracciones/<idioma>/<ciudad>/<slug>.md`. El cuerpo
 * del Markdown es la descripción del monumento («Sobre…»).
 */

const atraccionesRoot = path.join(process.cwd(), "content", "atracciones");

export type DatoAtraccion = { etiqueta: string; valor: string };
export type FotoAtraccion = { src: string; alt: string; pie: string };
export type BloquePractico = { titulo: string; texto: string };
export type RecomendacionAtraccion = { busca: string; ficha: string };

export type AtraccionFrontmatter = {
  /** Nombre corto del monumento («La Alhambra»). */
  nombre: string;
  /** Nombre con el que aparece en `atracciones:` del .md de la ciudad. */
  nombreEnCiudad: string;
  slug: string;
  /** Slugs por idioma; `es` es la clave común. */
  slugs: Partial<Record<Idioma, string>>;
  ciudad: string;
  /** Etiqueta de `atraccionesRelacionadas` que identifica sus fichas. */
  tag: string;
  titulo: string;
  metaTitle: string;
  metaDescription: string;
  subtitulo: string;
  distintivo: string;
  imagen: string;
  imagenAlt: string;
  datosClave: DatoAtraccion[];
  ficha: DatoAtraccion[];
  fotos: FotoAtraccion[];
  practico: BloquePractico[];
  /** Guías de la ciudad por slug ES. */
  guias: string[];
  /** Filas de «¿Qué opción te conviene?» con la ficha por slug ES. */
  recomendaciones: RecomendacionAtraccion[];
  faq: PreguntaFrecuente[];
  /** Coordenadas para el JSON-LD TouristAttraction. */
  latitud?: number;
  longitud?: number;
  publicada: boolean;
};

export type Atraccion = AtraccionFrontmatter & {
  idioma: Idioma;
  url: string;
  descripcionHtml: string;
};

export type TipoOpcion = "entrada" | "guiada" | "privada" | "nocturna" | "jardines";

export type OpcionAtraccion = { actividad: ActividadListItem; tipo: TipoOpcion };

export function urlAtraccion(idioma: Idioma, ciudad: string, slug: string): string {
  return `${urlAtraccionesDeCiudad(idioma, ciudad)}/${slug}`;
}

function leerFrontmatter(ruta: string): AtraccionFrontmatter | null {
  const { data } = matter(fs.readFileSync(ruta, "utf8"));
  const fm = data as AtraccionFrontmatter;
  return fm.publicada ? fm : null;
}

type Entrada = { idioma: Idioma; ciudad: string; slug: string; fm: AtraccionFrontmatter };

/** Todas las atracciones publicadas de un idioma. */
function listar(idioma: Idioma): Entrada[] {
  const base = path.join(atraccionesRoot, idioma);
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).flatMap((ciudad) => {
    const dir = path.join(base, ciudad);
    if (!fs.statSync(dir).isDirectory()) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .flatMap((f) => {
        const fm = leerFrontmatter(path.join(dir, f));
        return fm ? [{ idioma, ciudad, slug: f.replace(/\.md$/, ""), fm }] : [];
      });
  });
}

export function obtenerTodasLasAtracciones(
  idioma: Idioma
): { ciudad: string; slug: string; slugEs: string; url: string }[] {
  return listar(idioma).map(({ ciudad, slug, fm }) => ({
    ciudad,
    slug,
    slugEs: fm.slugs.es ?? slug,
    url: urlAtraccion(idioma, ciudad, slug),
  }));
}

export async function obtenerAtraccion(
  idioma: Idioma,
  ciudad: string,
  slug: string
): Promise<Atraccion | null> {
  const ruta = path.join(atraccionesRoot, idioma, ciudad, `${slug}.md`);
  if (!fs.existsSync(ruta)) return null;
  const { data, content } = matter(fs.readFileSync(ruta, "utf8"));
  const fm = data as AtraccionFrontmatter;
  if (!fm.publicada) return null;
  const html = await remark().use(remarkGfm).use(remarkHtml).process(content);
  return { ...fm, idioma, url: urlAtraccion(idioma, ciudad, slug), descripcionHtml: html.toString() };
}

/** URL de la misma atracción en otro idioma (para hreflang), si existe. */
export function urlAtraccionEnIdioma(idioma: Idioma, slugEs: string): string | null {
  const e = listar(idioma).find((x) => x.fm.slugs.es === slugEs);
  return e ? urlAtraccion(idioma, e.ciudad, e.slug) : null;
}

export type EnlaceAtraccion = { nombre: string; url: string };

/** Página de la atracción a la que pertenece una ficha (por su etiqueta). */
export function atraccionDeFicha(
  idioma: Idioma,
  ciudad: string,
  tags: readonly string[]
): EnlaceAtraccion | null {
  const e = listar(idioma).find((x) => x.ciudad === ciudad && tags.includes(x.fm.tag));
  return e ? { nombre: e.fm.nombre, url: urlAtraccion(idioma, e.ciudad, e.slug) } : null;
}

/** Página de la atracción que recomienda una guía (por slug ES de la guía). */
export function atraccionDeGuia(idioma: Idioma, slugEsGuia: string): EnlaceAtraccion | null {
  const e = listar(idioma).find((x) => x.fm.guias.includes(slugEsGuia));
  return e ? { nombre: e.fm.nombre, url: urlAtraccion(idioma, e.ciudad, e.slug) } : null;
}

/** Página de la atracción por el nombre usado en el listado de la ciudad. */
export function atraccionPorNombreEnCiudad(
  idioma: Idioma,
  ciudad: string,
  nombre: string
): string | null {
  const e = listar(idioma).find((x) => x.ciudad === ciudad && x.fm.nombreEnCiudad === nombre);
  return e ? urlAtraccion(idioma, e.ciudad, e.slug) : null;
}

function tipoDe(a: ActividadListItem): TipoOpcion {
  const slug = (a.slugs?.es ?? a.slug).toLowerCase();
  if (a.privada) return "privada";
  if (/nocturn|night/.test(slug)) return "nocturna";
  if (/jardines|gardens/.test(slug)) return "jardines";
  if (a.categoria === "entradas") return "entrada";
  return "guiada";
}

function puntuacion(a: ActividadListItem): number {
  return (a.ratingProveedor ?? 0) * Math.log10(1 + (a.numeroOpiniones ?? 0));
}

/** Fichas de la atracción, de la más elegida a la menos. */
export function opcionesDeAtraccion(idioma: Idioma, ciudad: string, tag: string): OpcionAtraccion[] {
  return obtenerListaActividadesPorCiudad(idioma, ciudad)
    .filter((a) => (a.atraccionesRelacionadas ?? []).includes(tag))
    .sort((a, b) => puntuacion(b) - puntuacion(a))
    .map((actividad) => ({ actividad, tipo: tipoDe(actividad) }));
}

/** Guías listadas en la atracción, resueltas en el idioma pedido. */
export function guiasDeAtraccion(idioma: Idioma, atraccion: Atraccion): GuiaListItem[] {
  const todas = obtenerListaGuias(idioma);
  return atraccion.guias.flatMap((slugEs) => {
    const g = todas.find((x) => (idioma === "es" ? x.slug : x.slugs?.es) === slugEs);
    return g ? [g] : [];
  });
}
