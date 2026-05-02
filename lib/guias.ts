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
  tiempo_lectura?: number;
  publicada: boolean;
  destacada?: boolean;
  keywords?: string[];
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
        tiempo_lectura: fm.tiempo_lectura,
        publicada: true,
        destacada: fm.destacada || false,
        keywords: fm.keywords || [],
        idioma,
        tiempoLectura: fm.tiempo_lectura ?? calcularTiempoLectura(content),
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
    tiempo_lectura: fm.tiempo_lectura,
    publicada: true,
    destacada: fm.destacada || false,
    keywords: fm.keywords || [],
    idioma,
    tiempoLectura: fm.tiempo_lectura ?? calcularTiempoLectura(content),
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
