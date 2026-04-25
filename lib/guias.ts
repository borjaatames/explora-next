import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const guiasDirectory = path.join(process.cwd(), "content", "guias");

export type GuiaFrontmatter = {
  titulo: string;
  descripcion: string;
  categoria: string;
  slug: string;
  fecha: string;
  autor?: string;
  imagen?: string;
  publicada: boolean;
  destacada?: boolean;
  keywords?: string[];
};

export type GuiaListItem = GuiaFrontmatter & {
  tiempoLectura: number;
  url: string;
};

export type GuiaCompleta = GuiaListItem & {
  contenidoHtml: string;
};

/**
 * Lee todos los archivos .md de content/guias y devuelve metadata.
 * Solo incluye las que tengan publicada: true.
 */
export function obtenerListaGuias(): GuiaListItem[] {
  if (!fs.existsSync(guiasDirectory)) return [];

  const categorias = fs.readdirSync(guiasDirectory).filter((entry) => {
    const fullPath = path.join(guiasDirectory, entry);
    return fs.statSync(fullPath).isDirectory();
  });

  const todas: GuiaListItem[] = [];

  for (const categoria of categorias) {
    const categoriaPath = path.join(guiasDirectory, categoria);
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
        autor: fm.autor,
        imagen: fm.imagen,
        publicada: true,
        destacada: fm.destacada || false,
        keywords: fm.keywords || [],
        tiempoLectura: calcularTiempoLectura(content),
        url: `/guias/${categoria}/${slug}`,
      });
    }
  }

  return todas.sort((a, b) =>
    a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0
  );
}

/**
 * Lee una guía concreta por categoría + slug y devuelve frontmatter + HTML.
 */
export async function obtenerGuia(
  categoria: string,
  slug: string
): Promise<GuiaCompleta | null> {
  const fullPath = path.join(guiasDirectory, categoria, `${slug}.md`);
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
    autor: fm.autor,
    imagen: fm.imagen,
    publicada: true,
    destacada: fm.destacada || false,
    keywords: fm.keywords || [],
    tiempoLectura: calcularTiempoLectura(content),
    url: `/guias/${categoria}/${slug}`,
    contenidoHtml: procesado.toString(),
  };
}

/**
 * Devuelve hasta N guías destacadas, o las más recientes si no hay marcadas.
 */
export function obtenerGuiasDestacadas(limite: number = 3): GuiaListItem[] {
  const todas = obtenerListaGuias();
  const destacadas = todas.filter((g) => g.destacada);
  if (destacadas.length >= limite) return destacadas.slice(0, limite);
  return [...destacadas, ...todas.filter((g) => !g.destacada)].slice(0, limite);
}

/**
 * Devuelve guías relacionadas (misma categoría, excluyendo la actual).
 */
export function obtenerGuiasRelacionadas(
  categoria: string,
  slugActual: string,
  limite: number = 3
): GuiaListItem[] {
  return obtenerListaGuias()
    .filter((g) => g.categoria === categoria && g.slug !== slugActual)
    .slice(0, limite);
}

/**
 * Devuelve todos los pares categoria/slug para generateStaticParams.
 */
export function obtenerTodosLosCaminos(): {
  categoria: string;
  slug: string;
}[] {
  return obtenerListaGuias().map(({ categoria, slug }) => ({
    categoria,
    slug,
  }));
}

/**
 * Estima minutos de lectura: ~200 palabras/minuto.
 */
function calcularTiempoLectura(texto: string): number {
  const palabras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palabras / 200));
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) en español.
 */
export function formatearFecha(iso: string): string {
  if (!iso) return "";
  try {
    const fecha = new Date(iso);
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
