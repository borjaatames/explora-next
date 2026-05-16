import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import { IDIOMAS_ACTIVOS } from "./i18n/config";
import { urlCiudad } from "./i18n/utils";
import type { Idioma } from "./i18n/types";

const ciudadesRoot = path.join(process.cwd(), "content", "ciudades");

export type Atraccion = {
  nombre: string;
  descripcion: string;
  imagen?: string;
  imagenAlt?: string;
};

/**
 * Chip rápido para filtrar actividades en la página de ciudad. Cada chip
 * tiene un label visible y un `tag` que se cruza con
 * `atraccionesRelacionadas` del frontmatter de cada actividad.
 */
export type ChipFiltro = {
  label: string;
  tag: string;
};

export type CiudadFrontmatter = {
  nombre: string;
  slug: string;
  descripcion: string;
  comunidad: string;
  imagen?: string;
  imagenAlt?: string;
  imagenGuias?: string;
  imagenGuiasAlt?: string;
  imagenActividades?: string;
  imagenActividadesAlt?: string;
  imagenAtracciones?: string;
  imagenAtraccionesAlt?: string;
  atracciones?: Atraccion[];
  /**
   * Chips de filtros destacados a mostrar en la página de ciudad. Si está
   * vacío o ausente, no se muestra sidebar de chips. Orden manual.
   */
  chipsFiltros?: ChipFiltro[];
  publicada: boolean;
  destacada?: boolean;
  orden?: number;
  keywords?: string[];

  slugs?: Partial<Record<Idioma, string>>;
};

export type CiudadListItem = CiudadFrontmatter & {
  idioma: Idioma;
  url: string;
};

export type CiudadCompleta = CiudadListItem & {
  contenidoHtml: string;
};

function directorioIdioma(idioma: Idioma): string {
  return path.join(ciudadesRoot, idioma);
}

export function obtenerListaCiudades(idioma: Idioma): CiudadListItem[] {
  const base = directorioIdioma(idioma);
  if (!fs.existsSync(base)) return [];

  const archivos = fs.readdirSync(base).filter((f) => f.endsWith(".md"));
  const ciudades: CiudadListItem[] = [];

  for (const archivo of archivos) {
    const slug = archivo.replace(/\.md$/, "");
    const fullPath = path.join(base, archivo);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const fm = data as Partial<CiudadFrontmatter>;
    if (!fm.publicada) continue;

    ciudades.push({
      nombre: fm.nombre || slug,
      slug,
      descripcion: fm.descripcion || "",
      comunidad: fm.comunidad || "",
      imagen: fm.imagen,
      imagenAlt: fm.imagenAlt,
      imagenGuias: fm.imagenGuias,
      imagenGuiasAlt: fm.imagenGuiasAlt,
      imagenActividades: fm.imagenActividades,
      imagenActividadesAlt: fm.imagenActividadesAlt,
      imagenAtracciones: fm.imagenAtracciones,
      imagenAtraccionesAlt: fm.imagenAtraccionesAlt,
      atracciones: fm.atracciones,
      chipsFiltros: fm.chipsFiltros,
      publicada: true,
      destacada: fm.destacada || false,
      orden: fm.orden ?? 999,
      keywords: fm.keywords || [],
      slugs: fm.slugs,
      idioma,
      url: urlCiudad(idioma, slug),
    });
  }

  return ciudades.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
}

export async function obtenerCiudad(
  idioma: Idioma,
  slug: string
): Promise<CiudadCompleta | null> {
  const fullPath = path.join(directorioIdioma(idioma), `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const fm = data as Partial<CiudadFrontmatter>;
  if (!fm.publicada) return null;

  const procesado = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    nombre: fm.nombre || slug,
    slug,
    descripcion: fm.descripcion || "",
    comunidad: fm.comunidad || "",
    imagen: fm.imagen,
    imagenAlt: fm.imagenAlt,
    imagenGuias: fm.imagenGuias,
    imagenGuiasAlt: fm.imagenGuiasAlt,
    imagenActividades: fm.imagenActividades,
    imagenActividadesAlt: fm.imagenActividadesAlt,
    imagenAtracciones: fm.imagenAtracciones,
    imagenAtraccionesAlt: fm.imagenAtraccionesAlt,
    atracciones: fm.atracciones,
    chipsFiltros: fm.chipsFiltros,
    publicada: true,
    destacada: fm.destacada || false,
    orden: fm.orden ?? 999,
    keywords: fm.keywords || [],
    slugs: fm.slugs,
    idioma,
    url: urlCiudad(idioma, slug),
    contenidoHtml: procesado.toString(),
  };
}

export function obtenerTodosLosCaminosCiudades(): {
  idioma: Idioma;
  ciudad: string;
}[] {
  const caminos: { idioma: Idioma; ciudad: string }[] = [];
  for (const idioma of IDIOMAS_ACTIVOS) {
    for (const c of obtenerListaCiudades(idioma)) {
      caminos.push({ idioma, ciudad: c.slug });
    }
  }
  return caminos;
}

export function existeCiudad(idioma: Idioma, slug: string): boolean {
  const fullPath = path.join(directorioIdioma(idioma), `${slug}.md`);
  return fs.existsSync(fullPath);
}
