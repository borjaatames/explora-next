import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ciudadesDirectory = path.join(process.cwd(), "content", "ciudades");

export type CiudadFrontmatter = {
  nombre: string;
  slug: string;
  descripcion: string;
  comunidad: string;
  imagen?: string;
  publicada: boolean;
  destacada?: boolean;
  orden?: number;
  keywords?: string[];
};

export type CiudadListItem = CiudadFrontmatter & {
  url: string;
};

export type CiudadCompleta = CiudadListItem & {
  contenidoHtml: string;
};

/**
 * Lee todos los archivos .md de content/ciudades.
 * Solo incluye las que tengan publicada: true.
 */
export function obtenerListaCiudades(): CiudadListItem[] {
  if (!fs.existsSync(ciudadesDirectory)) return [];

  const archivos = fs
    .readdirSync(ciudadesDirectory)
    .filter((f) => f.endsWith(".md"));

  const ciudades: CiudadListItem[] = [];

  for (const archivo of archivos) {
    const slug = archivo.replace(/\.md$/, "");
    const fullPath = path.join(ciudadesDirectory, archivo);
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
      publicada: true,
      destacada: fm.destacada || false,
      orden: fm.orden ?? 999,
      keywords: fm.keywords || [],
      url: `/ciudades/${slug}`,
    });
  }

  return ciudades.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
}

/**
 * Lee una ciudad por slug y devuelve frontmatter + HTML.
 */
export async function obtenerCiudad(
  slug: string
): Promise<CiudadCompleta | null> {
  const fullPath = path.join(ciudadesDirectory, `${slug}.md`);
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
    publicada: true,
    destacada: fm.destacada || false,
    orden: fm.orden ?? 999,
    keywords: fm.keywords || [],
    url: `/ciudades/${slug}`,
    contenidoHtml: procesado.toString(),
  };
}

/**
 * Devuelve todos los slugs para generateStaticParams.
 */
export function obtenerTodosLosCaminosCiudades(): { ciudad: string }[] {
  return obtenerListaCiudades().map(({ slug }) => ({ ciudad: slug }));
}
