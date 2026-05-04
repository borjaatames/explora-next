import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import { IDIOMAS_ACTIVOS } from "./i18n/config";
import { urlActividad } from "./i18n/utils";
import type { Idioma } from "./i18n/types";
import {
  type ProveedorActividad,
  PROVEEDORES_ACTIVOS,
} from "./afiliados";

const actividadesRoot = path.join(process.cwd(), "content", "actividades");

/**
 * Categorías permitidas. Debe coincidir con las claves de
 * `dict.actividades.categorias` en los diccionarios.
 */
export const CATEGORIAS_ACTIVIDAD = [
  "cultural",
  "gastronomico",
  "aireLibre",
  "nocturno",
  "excursion",
  "familiar",
] as const;

export type CategoriaActividad = (typeof CATEGORIAS_ACTIVIDAD)[number];

export type ActividadHighlight = string;

export type ImagenGaleria = {
  src: string;
  alt: string;
};

/**
 * Detalles prácticos granulares (8 datos máximo).
 * Todos los campos son opcionales: si no están en el frontmatter, no se
 * muestra esa fila. Permite reusar el mismo bloque para actividades muy
 * distintas sin que falten datos a medias.
 */
export type DetallesPracticos = {
  ticketMovil?: boolean;
  confirmacionInmediata?: boolean;
  accesibleSilla?: boolean;
  edadMinima?: number;
  mascotasPermitidas?: boolean;
};

/**
 * Información importante mostrada en 3 columnas (Qué traer / No apto para
 * / A tener en cuenta). Cualquiera puede estar vacía o ausente.
 */
export type InformacionImportante = {
  queTraer?: string[];
  noAptoPara?: string[];
  aTenerEnCuenta?: string[];
};

/**
 * Punto de encuentro detallado con coordenadas para el mapa.
 * Sustituye/complementa al string `puntoEncuentro` original.
 *
 * Si en el frontmatter solo hay `puntoEncuentro: "texto"` (string), se
 * normaliza a `{ texto: "..." }` sin coordenadas: el mapa simplemente
 * no se renderizará para esa actividad.
 */
export type PuntoEncuentroDetallado = {
  texto: string;
  descripcionGuia?: string;
  latitud?: number;
  longitud?: number;
  zoom?: number;
};

export type PreguntaFrecuente = {
  pregunta: string;
  respuesta: string;
};

export type ActividadFrontmatter = {
  titulo: string;
  slug: string;
  ciudad: string;
  descripcion: string;

  // Datos comerciales
  duracion: string;
  duracionMinutos?: number;
  precioDesde: number;
  moneda: string;
  idiomas: string[];
  proveedor: ProveedorActividad;
  urlReserva: string;
  cancelacionGratuita?: boolean;
  horasCancelacion?: number;

  // Vendedor
  highlights: ActividadHighlight[];

  // Práctico
  incluye: string[];
  noIncluye: string[];
  /**
   * Punto de encuentro. Acepta dos formatos:
   *   - string plano (formato original, retrocompatible)
   *   - objeto PuntoEncuentroDetallado (recomendado para nuevas actividades)
   * Tras pasar por `construirListItem` siempre queda como objeto.
   */
  puntoEncuentro: string | PuntoEncuentroDetallado;

  // === Bloques nuevos (mejoras inspiradas en Civitatis y GetYourGuide) ===
  detallesPracticos?: DetallesPracticos;
  informacionImportante?: InformacionImportante;
  accesibilidad?: string;
  politicaCancelacion?: string;
  preguntasFrecuentes?: PreguntaFrecuente[];
  /**
   * Slugs de OTRAS actividades publicadas en la misma ciudad que se
   * mostrarán en el carrusel "Otras formas de visitar X". Si la lista
   * está vacía o los slugs no resuelven a una actividad publicada, el
   * bloque no aparece.
   */
  variantes?: string[];

  // Editorial
  opinionEditorial?: string;
  guiasRelacionadas?: string[];

  // Categorización
  categoria: CategoriaActividad;
  keywords?: string[];

  // Imágenes
  imagen: string;
  imagenAlt: string;
  galeria?: ImagenGaleria[];

  // SEO/JSON-LD
  ratingProveedor?: number;
  numeroOpiniones?: number;

  // Estado
  publicada: boolean;
  destacada?: boolean;
  fecha: string;

  /**
   * Mapa de slugs por idioma para esta actividad. Permite que el sitemap
   * y los pages declaren hreflang correcto cuando los slugs están
   * traducidos entre idiomas (e.g. ES "tour-prado" ↔ EN "prado-tour").
   * Si el campo no existe, no se asume pareja: el alternate hreflang se
   * omite para los idiomas no declarados (mejor que apuntar a un 404).
   */
  slugs?: Partial<Record<Idioma, string>>;
};

/**
 * Versión normalizada del frontmatter tal y como la consume la UI:
 * `puntoEncuentro` es siempre un objeto, los arrays nunca son undefined,
 * etc. Esto simplifica el render en el page sin defensive coding.
 */
export type ActividadListItem = Omit<ActividadFrontmatter, "puntoEncuentro"> & {
  idioma: Idioma;
  url: string;
  puntoEncuentro: PuntoEncuentroDetallado;
};

export type ActividadCompleta = ActividadListItem & {
  contenidoHtml: string;
};

function directorioCiudad(idioma: Idioma, ciudad: string): string {
  return path.join(actividadesRoot, idioma, ciudad);
}

/**
 * Lista todas las actividades publicadas de una ciudad para un idioma dado.
 * Devuelve array vacío si la carpeta no existe (ciudad sin actividades aún).
 */
export function obtenerListaActividadesPorCiudad(
  idioma: Idioma,
  ciudad: string
): ActividadListItem[] {
  const base = directorioCiudad(idioma, ciudad);
  if (!fs.existsSync(base)) return [];

  const archivos = fs.readdirSync(base).filter((f) => f.endsWith(".md"));
  const actividades: ActividadListItem[] = [];

  for (const archivo of archivos) {
    const slug = archivo.replace(/\.md$/, "");
    const fullPath = path.join(base, archivo);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const fm = data as Partial<ActividadFrontmatter>;
    if (!fm.publicada) continue;

    actividades.push(construirListItem(fm, slug, ciudad, idioma));
  }

  // Orden: destacadas primero, luego por fecha descendente.
  return actividades.sort((a, b) => {
    if (a.destacada !== b.destacada) return a.destacada ? -1 : 1;
    return a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0;
  });
}

/**
 * Devuelve una actividad concreta por idioma + ciudad + slug, con HTML
 * procesado. Devuelve null si no existe o no está publicada.
 */
export async function obtenerActividad(
  idioma: Idioma,
  ciudad: string,
  slug: string
): Promise<ActividadCompleta | null> {
  const fullPath = path.join(directorioCiudad(idioma, ciudad), `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const fm = data as Partial<ActividadFrontmatter>;
  if (!fm.publicada) return null;

  const procesado = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    ...construirListItem(fm, slug, ciudad, idioma),
    contenidoHtml: procesado.toString(),
  };
}

/**
 * Lista TODAS las actividades de un idioma (de todas las ciudades).
 * Útil para el sitemap.
 */
export function obtenerListaActividades(idioma: Idioma): ActividadListItem[] {
  const base = path.join(actividadesRoot, idioma);
  if (!fs.existsSync(base)) return [];

  const ciudades = fs.readdirSync(base).filter((entry) => {
    const fullPath = path.join(base, entry);
    return fs.statSync(fullPath).isDirectory();
  });

  const todas: ActividadListItem[] = [];
  for (const ciudad of ciudades) {
    todas.push(...obtenerListaActividadesPorCiudad(idioma, ciudad));
  }

  return todas;
}

/**
 * Devuelve actividades destacadas de una ciudad (límite configurable).
 * Si no hay suficientes destacadas, completa con las más recientes.
 */
export function obtenerActividadesDestacadasPorCiudad(
  idioma: Idioma,
  ciudad: string,
  limite: number = 3
): ActividadListItem[] {
  const todas = obtenerListaActividadesPorCiudad(idioma, ciudad);
  const destacadas = todas.filter((a) => a.destacada);
  if (destacadas.length >= limite) return destacadas.slice(0, limite);
  return [...destacadas, ...todas.filter((a) => !a.destacada)].slice(0, limite);
}

/**
 * Agrupa las actividades de una ciudad por categoría.
 * Útil para el listado tipo Viator (secciones por categoría).
 */
export function agruparActividadesPorCategoria(
  actividades: ActividadListItem[]
): Record<CategoriaActividad, ActividadListItem[]> {
  const grupos = {
    cultural: [],
    gastronomico: [],
    aireLibre: [],
    nocturno: [],
    excursion: [],
    familiar: [],
  } as Record<CategoriaActividad, ActividadListItem[]>;

  for (const actividad of actividades) {
    if (CATEGORIAS_ACTIVIDAD.includes(actividad.categoria)) {
      grupos[actividad.categoria].push(actividad);
    }
  }

  return grupos;
}

/**
 * Devuelve actividades alternativas dentro de la misma ciudad,
 * excluyendo la actual y excluyendo también las que ya estén listadas
 * como `variantes` de la actividad actual (para no duplicar tarjetas).
 */
export function obtenerActividadesAlternativas(
  idioma: Idioma,
  ciudad: string,
  slugActual: string,
  limite: number = 3,
  slugsExcluidos: string[] = []
): ActividadListItem[] {
  const exclusiones = new Set([slugActual, ...slugsExcluidos]);
  return obtenerListaActividadesPorCiudad(idioma, ciudad)
    .filter((a) => !exclusiones.has(a.slug))
    .slice(0, limite);
}

/**
 * Resuelve una lista de slugs de variantes a las actividades reales
 * publicadas en la misma ciudad e idioma. Mantiene el orden indicado en
 * el frontmatter. Slugs no resolubles se descartan silenciosamente.
 */
export function obtenerVariantesDeActividad(
  idioma: Idioma,
  ciudad: string,
  slugs: string[]
): ActividadListItem[] {
  if (!slugs || slugs.length === 0) return [];
  const todas = obtenerListaActividadesPorCiudad(idioma, ciudad);
  const indice = new Map(todas.map((a) => [a.slug, a]));
  return slugs
    .map((slug) => indice.get(slug))
    .filter((a): a is ActividadListItem => Boolean(a));
}

/**
 * Devuelve todos los caminos (idioma + ciudad + slug) de todas las
 * actividades publicadas en idiomas activos. Pensado para
 * generateStaticParams en /[lang]/cities/[ciudad]/activities/[slug].
 * Para la ruta española sin prefijo, filtrar por idioma === "es".
 */
export function obtenerTodosLosCaminosActividades(): {
  idioma: Idioma;
  ciudad: string;
  slug: string;
}[] {
  const caminos: { idioma: Idioma; ciudad: string; slug: string }[] = [];
  for (const idioma of IDIOMAS_ACTIVOS) {
    for (const actividad of obtenerListaActividades(idioma)) {
      caminos.push({
        idioma,
        ciudad: actividad.ciudad,
        slug: actividad.slug,
      });
    }
  }
  return caminos;
}

/**
 * Devuelve los slugs de ciudades que tienen al menos una actividad
 * publicada en el idioma indicado. Útil para generateStaticParams del
 * listado de actividades por ciudad.
 */
export function obtenerCiudadesConActividades(idioma: Idioma): string[] {
  const base = path.join(actividadesRoot, idioma);
  if (!fs.existsSync(base)) return [];

  return fs
    .readdirSync(base)
    .filter((entry) => {
      const fullPath = path.join(base, entry);
      return fs.statSync(fullPath).isDirectory();
    })
    .filter((ciudad) => {
      const lista = obtenerListaActividadesPorCiudad(idioma, ciudad);
      return lista.length > 0;
    });
}

/**
 * Normaliza el campo `puntoEncuentro` del frontmatter a su forma de
 * objeto. Acepta string plano (formato original) u objeto detallado
 * (formato nuevo). Si está vacío devuelve un objeto con texto vacío
 * para que el render no tenga que comprobar undefined.
 */
function normalizarPuntoEncuentro(
  raw: string | PuntoEncuentroDetallado | undefined
): PuntoEncuentroDetallado {
  if (!raw) return { texto: "" };
  if (typeof raw === "string") return { texto: raw };
  return {
    texto: raw.texto || "",
    descripcionGuia: raw.descripcionGuia,
    latitud: raw.latitud,
    longitud: raw.longitud,
    zoom: raw.zoom,
  };
}

/**
 * Construye un ActividadListItem a partir del frontmatter. Centralizado
 * para no repetir la lógica entre obtenerLista y obtenerActividad.
 *
 * Si el `proveedor` del frontmatter no es uno de los conocidos, se hace
 * fallback a "civitatis" (con warning en consola en build).
 */
function construirListItem(
  fm: Partial<ActividadFrontmatter>,
  slug: string,
  ciudad: string,
  idioma: Idioma
): ActividadListItem {
  const proveedorRaw = (fm.proveedor as unknown as string) || "civitatis";
  const proveedor = PROVEEDORES_ACTIVOS.includes(
    proveedorRaw as ProveedorActividad
  )
    ? (proveedorRaw as ProveedorActividad)
    : (() => {
        // eslint-disable-next-line no-console
        console.warn(
          `[actividades] Proveedor desconocido "${proveedorRaw}" en ${idioma}/${ciudad}/${slug}.md, usando "civitatis" por defecto.`
        );
        return "civitatis" as ProveedorActividad;
      })();

  return {
    titulo: fm.titulo || "Sin título",
    slug,
    ciudad,
    descripcion: fm.descripcion || "",

    duracion: fm.duracion || "",
    duracionMinutos: fm.duracionMinutos,
    precioDesde: fm.precioDesde ?? 0,
    moneda: fm.moneda || "EUR",
    idiomas: fm.idiomas || [],
    proveedor,
    urlReserva: fm.urlReserva || "",
    cancelacionGratuita: fm.cancelacionGratuita ?? false,
    horasCancelacion: fm.horasCancelacion,

    highlights: fm.highlights || [],
    incluye: fm.incluye || [],
    noIncluye: fm.noIncluye || [],
    puntoEncuentro: normalizarPuntoEncuentro(fm.puntoEncuentro),

    detallesPracticos: fm.detallesPracticos,
    informacionImportante: fm.informacionImportante,
    accesibilidad: fm.accesibilidad,
    politicaCancelacion: fm.politicaCancelacion,
    preguntasFrecuentes: fm.preguntasFrecuentes || [],
    variantes: fm.variantes || [],

    opinionEditorial: fm.opinionEditorial,
    guiasRelacionadas: fm.guiasRelacionadas || [],

    categoria: (fm.categoria || "cultural") as CategoriaActividad,
    keywords: fm.keywords || [],

    imagen: fm.imagen || "",
    imagenAlt: fm.imagenAlt || "",
    galeria: fm.galeria || [],

    ratingProveedor: fm.ratingProveedor,
    numeroOpiniones: fm.numeroOpiniones,

    publicada: true,
    destacada: fm.destacada || false,
    fecha: fm.fecha || "",
    slugs: fm.slugs,

    idioma,
    url: urlActividad(idioma, ciudad, slug),
  };
}

// =============================================================================
// Helpers para listado de actividades por categoría
// =============================================================================

/**
 * Mapeo categoría camelCase del frontmatter -> slug kebab-case en URL.
 * Único lugar que conoce esta correspondencia.
 *
 * Si en el futuro se añade una categoría nueva, hay que actualizar:
 *   1) CATEGORIAS_ACTIVIDAD (arriba en este archivo)
 *   2) este mapeo
 *   3) la clave en `dict.actividades.categorias` de los 6 idiomas
 */
export const CATEGORIA_A_URL: Record<CategoriaActividad, string> = {
  cultural: "cultural",
  gastronomico: "gastronomico",
  aireLibre: "aire-libre",
  nocturno: "nocturno",
  excursion: "excursion",
  familiar: "familiar",
};

const URL_A_CATEGORIA: Record<string, CategoriaActividad> = Object.fromEntries(
  (Object.entries(CATEGORIA_A_URL) as [CategoriaActividad, string][]).map(
    ([clave, urlSlug]) => [urlSlug, clave]
  )
) as Record<string, CategoriaActividad>;

/** Convierte clave de categoría (frontmatter) -> slug de URL. */
export function categoriaAUrl(categoria: CategoriaActividad): string {
  return CATEGORIA_A_URL[categoria];
}

/**
 * Convierte slug de URL -> clave de categoría (frontmatter).
 * Devuelve null si el slug no corresponde a ninguna categoría conocida.
 */
export function categoriaDesdeUrl(
  urlSlug: string
): CategoriaActividad | null {
  return URL_A_CATEGORIA[urlSlug] ?? null;
}

export type CategoriaConActividades = {
  /** Clave camelCase del frontmatter (ej: "aireLibre"). */
  categoria: CategoriaActividad;
  /** Slug kebab-case usado en URLs (ej: "aire-libre"). */
  urlSlug: string;
  /** Número de actividades publicadas en esa categoría/ciudad. */
  total: number;
  /** Imagen de portada: la primera actividad de la categoría. */
  imagenPortada: string;
  /** Alt de la imagen de portada. */
  imagenPortadaAlt: string;
};

/**
 * Devuelve las categorías que tienen >=1 actividad publicada en una
 * ciudad, con su contador e imagen de portada (la primera actividad del
 * grupo).
 *
 * Ordenadas por número de actividades descendente. Las categorías sin
 * actividades NO se devuelven (decisión de producto: nada de "(0)").
 *
 * Útil para construir el grid del índice de actividades de la ciudad.
 */
export function obtenerCategoriasConActividades(
  idioma: Idioma,
  ciudad: string
): CategoriaConActividades[] {
  const actividades = obtenerListaActividadesPorCiudad(idioma, ciudad);
  if (actividades.length === 0) return [];

  const grupos = agruparActividadesPorCategoria(actividades);

  const resultado: CategoriaConActividades[] = [];
  for (const categoria of CATEGORIAS_ACTIVIDAD) {
    const lista = grupos[categoria];
    if (lista.length === 0) continue;

    const portada = lista[0];
    resultado.push({
      categoria,
      urlSlug: CATEGORIA_A_URL[categoria],
      total: lista.length,
      imagenPortada: portada.imagen,
      imagenPortadaAlt: portada.imagenAlt,
    });
  }

  return resultado.sort((a, b) => b.total - a.total);
}

/**
 * Devuelve las actividades de una ciudad filtradas por una categoría
 * concreta. Devuelve array vacío si la combinación no tiene actividades.
 *
 * El orden se hereda de `obtenerListaActividadesPorCiudad`: destacadas
 * primero, luego por fecha descendente.
 */
export function obtenerActividadesDeCiudadPorCategoria(
  idioma: Idioma,
  ciudad: string,
  categoria: CategoriaActividad
): ActividadListItem[] {
  return obtenerListaActividadesPorCiudad(idioma, ciudad).filter(
    (a) => a.categoria === categoria
  );
}


/**
 * Comprueba si existe el archivo `.md` de una actividad en el idioma dado.
 *
 * Útil para construir alternates hreflang correctos: si una actividad
 * no tiene pareja en otro idioma (por ejemplo, una actividad solo
 * publicada en inglés), no debemos declarar un hreflang apuntando a
 * una URL que devolvería 404.
 *
 * No comprueba el flag `publicada`: solo la existencia física del
 * archivo. Si necesitas considerar también `publicada`, usa
 * `obtenerActividad` y comprueba si el resultado es `null`.
 */
export function existeActividad(
  idioma: Idioma,
  ciudad: string,
  slug: string
): boolean {
  const fullPath = path.join(directorioCiudad(idioma, ciudad), `${slug}.md`);
  return fs.existsSync(fullPath);
}
