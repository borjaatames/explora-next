import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import { IDIOMAS_ACTIVOS } from "./i18n/config";
import { urlGuia } from "./i18n/utils";
import type { Idioma } from "./i18n/types";

const guiasRoot = path.join(process.cwd(), "content", "guias");

export type GuiaFrontmatter = {
  titulo: string;
  descripcion: string;
  categoria: string;
  slug: string;
  fecha: string;
  fecha_actualizacion?: string;
  autor?: string;
  imagen?: string;
  imagen_portada?: string;
  imagen_alt?: string;
  publicada: boolean;
  destacada?: boolean;
  keywords?: string[];

  /**
   * Mapa de slugs por idioma para esta guía. Ver `slugs` en
   * `ActividadFrontmatter` para el patrón completo.
   */
  slugs?: Partial<Record<Idioma, string>>;
};

export type GuiaListItem = GuiaFrontmatter & {
  idioma: Idioma;
  tiempoLectura: number;
  url: string;
};

export type GuiaCompleta = GuiaListItem & {
  contenidoHtml: string;
};

function directorioIdioma(idioma: Idioma): string {
  return path.join(guiasRoot, idioma);
}

/**
 * Lista todas las guías publicadas para un idioma dado.
 */
export function obtenerListaGuias(idioma: Idioma): GuiaListItem[] {
  const base = directorioIdioma(idioma);
  if (!fs.existsSync(base)) return [];

  const categorias = fs.readdirSync(base).filter((entry) => {
    const fullPath = path.join(base, entry);
    return fs.statSync(fullPath).isDirectory();
  });

  const todas: GuiaListItem[] = [];

  for (const categoria of categorias) {
    const categoriaPath = path.join(base, categoria);
    const archivos = fs
      .readdirSync(categoriaPath)
      .filter((f) => f.endsWith(".md"));

    for (const archivo of archivos) {
      const slug = archivo.replace(/\.md$/, "");
      const fullPath = path.join(categoriaPath, archivo);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const fm = data as Partial<GuiaFrontmatter>;
      if (!fm.publicada) continue;

      todas.push({
        titulo: fm.titulo || "Sin título",
        descripcion: fm.descripcion || "",
        categoria,
        slug,
        fecha: fm.fecha || "",
        fecha_actualizacion: fm.fecha_actualizacion,
        autor: fm.autor,
        imagen: fm.imagen,
        imagen_portada: fm.imagen_portada,
        imagen_alt: fm.imagen_alt,
        publicada: true,
        destacada: fm.destacada || false,
        keywords: fm.keywords || [],
        slugs: fm.slugs,
        idioma,
        tiempoLectura: calcularTiempoLectura(content),
        url: urlGuia(idioma, categoria, slug),
      });
    }
  }

  return todas.sort((a, b) =>
    a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0
  );
}

/**
 * Devuelve una guía por idioma + categoría + slug, con HTML procesado.
 */
export async function obtenerGuia(
  idioma: Idioma,
  categoria: string,
  slug: string
): Promise<GuiaCompleta | null> {
  const fullPath = path.join(directorioIdioma(idioma), categoria, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const fm = data as Partial<GuiaFrontmatter>;
  if (!fm.publicada) return null;

  const procesado = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    titulo: fm.titulo || "Sin título",
    descripcion: fm.descripcion || "",
    categoria,
    slug,
    fecha: fm.fecha || "",
    fecha_actualizacion: fm.fecha_actualizacion,
    autor: fm.autor,
    imagen: fm.imagen,
    imagen_portada: fm.imagen_portada,
    imagen_alt: fm.imagen_alt,
    publicada: true,
    destacada: fm.destacada || false,
    keywords: fm.keywords || [],
    slugs: fm.slugs,
    idioma,
    tiempoLectura: calcularTiempoLectura(content),
    url: urlGuia(idioma, categoria, slug),
    contenidoHtml: procesado.toString(),
  };
}

export function obtenerGuiasDestacadas(
  idioma: Idioma,
  limite: number = 3
): GuiaListItem[] {
  const todas = obtenerListaGuias(idioma);
  const destacadas = todas.filter((g) => g.destacada);
  if (destacadas.length >= limite) return destacadas.slice(0, limite);
  return [...destacadas, ...todas.filter((g) => !g.destacada)].slice(0, limite);
}

export function obtenerGuiasRelacionadas(
  idioma: Idioma,
  categoria: string,
  slugActual: string,
  limite: number = 3
): GuiaListItem[] {
  return obtenerListaGuias(idioma)
    .filter((g) => g.categoria === categoria && g.slug !== slugActual)
    .slice(0, limite);
}

/**
 * Devuelve todos los caminos (idioma + categoria + slug) de todos los idiomas
 * activos. Pensado para generateStaticParams en /[lang]/guides/[categoria]/[slug].
 * Para la ruta española sin prefijo, filtrar por idioma === "es".
 */
export function obtenerTodosLosCaminos(): {
  idioma: Idioma;
  categoria: string;
  slug: string;
}[] {
  const caminos: { idioma: Idioma; categoria: string; slug: string }[] = [];
  for (const idioma of IDIOMAS_ACTIVOS) {
    for (const guia of obtenerListaGuias(idioma)) {
      caminos.push({
        idioma,
        categoria: guia.categoria,
        slug: guia.slug,
      });
    }
  }
  return caminos;
}

function calcularTiempoLectura(texto: string): number {
  const palabras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palabras / 200));
}


/**
 * Comprueba si existe el archivo `.md` de una guía en el idioma dado.
 * Ver `existeActividad` en `lib/actividades.ts` para el mismo patrón.
 */
export function existeGuia(
  idioma: Idioma,
  categoria: string,
  slug: string
): boolean {
  const fullPath = path.join(directorioIdioma(idioma), categoria, `${slug}.md`);
  return fs.existsSync(fullPath);
}

// =============================================================================
// Helpers de filtrado por ciudad
//
// En este proyecto, las guías se organizan en carpetas por ciudad
// (`content/guias/<idioma>/<ciudad>/<slug>.md`) y el campo `categoria` del
// frontmatter coincide con el slug de la ciudad. Por lo tanto, "categoría" y
// "ciudad" son sinónimos a efectos de filtrado. Los helpers de abajo
// formalizan ese contrato para que las rutas `/ciudades/[ciudad]/guias` no
// dependan de la convención implícita.
// =============================================================================

/**
 * Devuelve todas las guías publicadas de una ciudad concreta en el idioma
 * dado. Lee solo la carpeta de esa ciudad (más eficiente que filtrar la
 * lista global). Devuelve array vacío si la carpeta no existe o no hay
 * guías publicadas.
 */
export function obtenerGuiasDeCiudad(
  idioma: Idioma,
  ciudad: string
): GuiaListItem[] {
  const ciudadPath = path.join(directorioIdioma(idioma), ciudad);
  if (!fs.existsSync(ciudadPath)) return [];
  if (!fs.statSync(ciudadPath).isDirectory()) return [];

  const archivos = fs
    .readdirSync(ciudadPath)
    .filter((f) => f.endsWith(".md"));

  const guias: GuiaListItem[] = [];

  for (const archivo of archivos) {
    const slug = archivo.replace(/\.md$/, "");
    const fullPath = path.join(ciudadPath, archivo);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const fm = data as Partial<GuiaFrontmatter>;
    if (!fm.publicada) continue;

    guias.push({
      titulo: fm.titulo || "Sin título",
      descripcion: fm.descripcion || "",
      categoria: ciudad,
      slug,
      fecha: fm.fecha || "",
      fecha_actualizacion: fm.fecha_actualizacion,
      autor: fm.autor,
      imagen: fm.imagen,
      imagen_portada: fm.imagen_portada,
      imagen_alt: fm.imagen_alt,
      publicada: true,
      destacada: fm.destacada || false,
      keywords: fm.keywords || [],
      slugs: fm.slugs,
      idioma,
      tiempoLectura: calcularTiempoLectura(content),
      url: urlGuia(idioma, ciudad, slug),
    });
  }

  return guias.sort((a, b) => {
    if (a.destacada !== b.destacada) return a.destacada ? -1 : 1;
    return a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0;
  });
}

export type CiudadConGuias = {
  /** Slug de la ciudad (= nombre de la carpeta). */
  ciudad: string;
  /** Número de guías publicadas en esa ciudad. */
  total: number;
  /** Imagen de portada: la primera guía con `imagen_portada`, si la hay. */
  imagenPortada?: string;
  /** Alt de la imagen de portada. */
  imagenPortadaAlt?: string;
};

/**
 * Devuelve los slugs de ciudades que tienen al menos una guía publicada en
 * el idioma indicado, con su contador e imagen de portada. Ordenadas por
 * número de guías descendente. Útil para construir el grid del hub `/guias`.
 */
export function obtenerCiudadesConGuias(idioma: Idioma): CiudadConGuias[] {
  const base = directorioIdioma(idioma);
  if (!fs.existsSync(base)) return [];

  const ciudades = fs.readdirSync(base).filter((entry) => {
    const fullPath = path.join(base, entry);
    return fs.statSync(fullPath).isDirectory();
  });

  const resultado: CiudadConGuias[] = [];
  for (const ciudad of ciudades) {
    const guias = obtenerGuiasDeCiudad(idioma, ciudad);
    if (guias.length === 0) continue;

    const portada = guias.find((g) => g.imagen_portada) ?? guias[0];
    resultado.push({
      ciudad,
      total: guias.length,
      imagenPortada: portada.imagen_portada,
      imagenPortadaAlt: portada.imagen_alt,
    });
  }

  return resultado.sort((a, b) => b.total - a.total);
}
