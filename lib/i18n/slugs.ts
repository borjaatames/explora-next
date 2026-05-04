import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Idioma } from "./types";

/**
 * Helpers para resolver "slug pareja" entre idiomas. El campo `slugs` del
 * frontmatter declara, en cada `.md`, cómo se llama esa misma actividad/
 * guía/ciudad en otros idiomas. Esto permite construir hreflang correcto
 * incluso cuando los slugs están traducidos.
 *
 * Convención del frontmatter:
 *
 *   slugs:
 *     es: tour-prado
 *     en: prado-tour
 *
 * Comportamiento:
 *   - Si el `.md` actual no existe: devuelve null (entrada huérfana).
 *   - Si existe pero no declara `slugs`: devuelve null (no se asume
 *     pareja; mejor omitir el alternate que apuntar a un 404).
 *   - Si declara `slugs[idiomaDestino]`: devuelve ese slug.
 *   - Si NO declara el idioma destino: devuelve null.
 *
 * Caso especial — `idiomaActual === idiomaDestino`: se devuelve el
 * `slugActual` directamente, sin leer disco. Esto cubre el escenario
 * típico del sitemap de "el alternate de ES es la propia URL ES".
 */

const actividadesRoot = path.join(process.cwd(), "content", "actividades");
const guiasRoot = path.join(process.cwd(), "content", "guias");
const ciudadesRoot = path.join(process.cwd(), "content", "ciudades");

function leerSlugsDelFrontmatter(
  fullPath: string
): Partial<Record<Idioma, string>> | null {
  if (!fs.existsSync(fullPath)) return null;
  try {
    const contents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(contents);
    const slugs = (data as { slugs?: Partial<Record<Idioma, string>> }).slugs;
    return slugs ?? null;
  } catch {
    return null;
  }
}

/**
 * Devuelve el slug de la actividad pareja en `idiomaDestino`, leyendo el
 * frontmatter del `.md` actual (en `idiomaActual`).
 */
export function slugParejaActividad(
  idiomaActual: Idioma,
  ciudad: string,
  slugActual: string,
  idiomaDestino: Idioma
): string | null {
  if (idiomaActual === idiomaDestino) return slugActual;
  const fullPath = path.join(
    actividadesRoot,
    idiomaActual,
    ciudad,
    `${slugActual}.md`
  );
  const slugs = leerSlugsDelFrontmatter(fullPath);
  return slugs?.[idiomaDestino] ?? null;
}

/**
 * Devuelve el slug de la guía pareja en `idiomaDestino`. La categoría es
 * invariante por convención del proyecto, así que se reusa.
 */
export function slugParejaGuia(
  idiomaActual: Idioma,
  categoria: string,
  slugActual: string,
  idiomaDestino: Idioma
): string | null {
  if (idiomaActual === idiomaDestino) return slugActual;
  const fullPath = path.join(
    guiasRoot,
    idiomaActual,
    categoria,
    `${slugActual}.md`
  );
  const slugs = leerSlugsDelFrontmatter(fullPath);
  return slugs?.[idiomaDestino] ?? null;
}

/**
 * Devuelve el slug de la ciudad pareja en `idiomaDestino`.
 *
 * Política especial: si el `.md` no declara `slugs`, se asume que el
 * slug es invariante (mismo en todos los idiomas). Esto refleja la
 * realidad actual del proyecto: las 5 ciudades (madrid, barcelona,
 * sevilla, granada, salamanca) usan el mismo slug en ES y EN.
 *
 * Si una ciudad futura quiere slugs distintos por idioma, declara
 * `slugs` explícitamente y el fallback deja de aplicar.
 */
export function slugParejaCiudad(
  idiomaActual: Idioma,
  slugActual: string,
  idiomaDestino: Idioma
): string | null {
  if (idiomaActual === idiomaDestino) return slugActual;
  const fullPath = path.join(ciudadesRoot, idiomaActual, `${slugActual}.md`);

  // Verificación de existencia del archivo en idioma actual.
  if (!fs.existsSync(fullPath)) return null;

  const slugs = leerSlugsDelFrontmatter(fullPath);
  if (slugs && slugs[idiomaDestino]) {
    return slugs[idiomaDestino] as string;
  }

  // Fallback: asumir slug invariante. Comprobamos que la pareja existe
  // físicamente en el idioma destino antes de devolverla.
  const parejaPath = path.join(
    ciudadesRoot,
    idiomaDestino,
    `${slugActual}.md`
  );
  return fs.existsSync(parejaPath) ? slugActual : null;
}
