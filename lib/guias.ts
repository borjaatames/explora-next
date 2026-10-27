import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import { IDIOMAS_ACTIVOS } from "./i18n/config";
import { urlGuia } from "./i18n/utils";
import type { Idioma } from "./i18n/types";
import type { PreguntaFrecuente } from "./actividades";

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

  /**
   * Preguntas frecuentes de la guía (mismo tipo que en actividades).
   * Se renderizan con <FaqActividad> y, a partir de 4 preguntas, activan
   * el JSON-LD `FAQPage` en la página de la guía (ver geo-checklist-
   * guias-citables-ia.md, punto 4 — relevante para citabilidad en IA).
   */
  faq?: PreguntaFrecuente[];

  /**
   * Fichas de actividad de las que HABLA esta guía, por slug ES (única
   * fuente de verdad; en otros idiomas se resuelve la ficha gemela vía
   * `slugs.es`). El carrusel "Actividades recomendadas" muestra exactamente
   * esta lista, en este orden, sin rellenar con otras fichas de la ciudad.
   * Si falta o está vacía, el carrusel no aparece.
   */
  actividades?: string[];

  /**
   * Guías de itinerario ("X en 3 días", "con niños", "qué ver en"): muestra
   * bajo el hero el bloque "Lo que conviene reservar antes de ir" con las
   * 4 primeras fichas de `actividades`. Las guías de un solo sitio usan en
   * su lugar el shortcode `[actividad: slug]` dentro del texto.
   */
  reservasArriba?: boolean;

  /**
   * Respuesta de 2-3 frases a la pregunta principal de la guía, en un
   * recuadro bajo el hero. Pensado para lectores que llegan desde ChatGPT
   * buscando un dato concreto: lo confirmamos arriba y, justo debajo, el
   * bloque de reservas. Admite **negrita**.
   */
  respuestaCorta?: string;

  /**
   * Fecha (YYYY-MM-DD) en que se comprobaron precios y horarios en fuentes
   * oficiales. Se muestra bajo la respuesta corta: «✓ Datos comprobados el…».
   */
  datosComprobados?: string;

  /**
   * Guías de un solo monumento: bloque «Nuestras 3 opciones» bajo la
   * respuesta corta. `ficha` es el slug ES de la ficha (de la misma ciudad
   * que la guía) y `etiqueta` dice para quién es, en el idioma de la guía.
   */
  opciones?: OpcionFrontmatter[];
};

export type OpcionFrontmatter = { ficha: string; etiqueta: string };

function leerOpciones(valor: unknown): OpcionFrontmatter[] | undefined {
  if (!Array.isArray(valor)) return undefined;
  const opciones = valor
    .filter(
      (o): o is OpcionFrontmatter =>
        typeof o === "object" &&
        o !== null &&
        typeof (o as Record<string, unknown>).ficha === "string" &&
        typeof (o as Record<string, unknown>).etiqueta === "string"
    )
    .slice(0, 3);
  return opciones.length > 0 ? opciones : undefined;
}

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
        actividades: fm.actividades || [],
        faq: fm.faq,
        respuestaCorta:
          typeof fm.respuestaCorta === "string" && fm.respuestaCorta.trim()
            ? fm.respuestaCorta.trim()
            : undefined,
        datosComprobados:
          typeof fm.datosComprobados === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(fm.datosComprobados)
            ? fm.datosComprobados
            : undefined,
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
    actividades: fm.actividades || [],
    reservasArriba: fm.reservasArriba === true,
    respuestaCorta:
      typeof fm.respuestaCorta === "string" && fm.respuestaCorta.trim()
        ? fm.respuestaCorta.trim()
        : undefined,
    opciones: leerOpciones(fm.opciones),
    datosComprobados:
      typeof fm.datosComprobados === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(fm.datosComprobados)
        ? fm.datosComprobados
        : undefined,
    faq: fm.faq,
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
      actividades: fm.actividades || [],
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

// =============================================================================
// Enlazado interno ficha → guías
//
// Cada ficha de actividad enlaza a guías de su ciudad para repartir autoridad
// hacia las guías (el contenido que Google y los asistentes de IA citan) y
// ayudar a su descubrimiento e indexación. Primero van las guías indicadas a
// mano en `guiasRelacionadas` del frontmatter; el resto se completa con guías
// de la misma ciudad ordenadas por afinidad temática con la ficha.
// =============================================================================

const PALABRAS_VACIAS = new Set<string>([
  "with", "from", "tour", "tours", "guided", "ticket", "tickets", "entry",
  "desde", "con", "para", "visita", "entrada", "entradas", "guiada", "guiado",
  "the", "and", "por", "sin", "dia", "day", "trip", "excursion", "small",
  "group", "grupo", "reducido", "private", "privado", "skip", "line",
]);

export function tokensDe(texto: string): Set<string> {
  return new Set(
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 3 && !PALABRAS_VACIAS.has(t))
  );
}

function afinidad(tokensFicha: Set<string>, guia: GuiaListItem): number {
  const tokensGuia = tokensDe(
    [guia.slug, guia.titulo, ...(guia.keywords ?? [])].join(" ")
  );
  let puntos = 0;
  tokensFicha.forEach((t) => {
    if (tokensGuia.has(t)) puntos += 1;
  });
  return puntos;
}

/**
 * Guías a enlazar desde una ficha de actividad: las de `guiasRelacionadas`
 * primero y, hasta completar `limite`, guías de la misma ciudad ordenadas
 * por afinidad con el slug/título de la ficha (después, destacadas y más
 * recientes, que es el orden de `obtenerGuiasDeCiudad`).
 */
export function obtenerGuiasParaFicha(
  idioma: Idioma,
  ciudad: string,
  ficha: { slug: string; titulo: string; guiasRelacionadas?: string[] },
  limite: number = 3
): GuiaListItem[] {
  const explicitas =
    ficha.guiasRelacionadas && ficha.guiasRelacionadas.length > 0
      ? obtenerListaGuias(idioma).filter((g) =>
          ficha.guiasRelacionadas!.includes(g.slug)
        )
      : [];

  if (explicitas.length >= limite) return explicitas.slice(0, limite);

  const yaIncluidas = new Set<string>(explicitas.map((g) => g.url));
  const tokensFicha = tokensDe(`${ficha.slug} ${ficha.titulo}`);

  const candidatas = obtenerGuiasDeCiudad(idioma, ciudad)
    .filter((g) => !yaIncluidas.has(g.url))
    .map((g, orden) => ({ g, orden, puntos: afinidad(tokensFicha, g) }))
    .sort((a, b) => b.puntos - a.puntos || a.orden - b.orden)
    .map(({ g }) => g);

  return [...explicitas, ...candidatas].slice(0, limite);
}
