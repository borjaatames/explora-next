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
  const slugDestino = slugs?.[idiomaDestino];
  // El frontmatter puede declarar una pareja que aún no está escrita:
  // sin archivo destino, no hay pareja (evita hreflang y enlaces 404).
  if (slugDestino) {
    const destino = path.join(
      actividadesRoot,
      idiomaDestino,
      ciudad,
      `${slugDestino}.md`
    );
    if (fs.existsSync(destino)) return slugDestino;
  }
  if (!fs.existsSync(fullPath)) return null;
  // Búsqueda inversa: las fichas nuevas (p. ej. FR/IT/PT) declaran sus
  // parejas ES/EN, pero las fichas ES/EN no siempre se actualizan con el
  // slug del idioma nuevo. Se busca en el idioma destino la ficha que apunta
  // a esta (por el slug del idioma actual o por la clave común `slugs.es`).
  const claveEs = idiomaActual === "es" ? slugActual : slugs?.es;
  const pareja = fichasConSlugs(idiomaDestino, ciudad).find(
    (f) =>
      f.slugs?.[idiomaActual] === slugActual ||
      (claveEs !== undefined &&
        (idiomaDestino === "es" ? f.slug === claveEs : f.slugs?.es === claveEs))
  );
  return pareja?.slug ?? null;
}

type FichaConSlugs = {
  slug: string;
  slugs: Partial<Record<Idioma, string>> | null;
};

const cacheFichasConSlugs = new Map<string, FichaConSlugs[]>();

/** Slugs de las fichas (`.md`) de una ciudad en un idioma, con caché por build. */
function fichasConSlugs(idioma: Idioma, ciudad: string): FichaConSlugs[] {
  const clave = `${idioma}/${ciudad}`;
  const enCache = cacheFichasConSlugs.get(clave);
  if (enCache) return enCache;
  const dir = path.join(actividadesRoot, idioma, ciudad);
  const fichas: FichaConSlugs[] = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
        .map((f) => ({
          slug: f.replace(/\.md$/, ""),
          slugs: leerSlugsDelFrontmatter(path.join(dir, f)),
        }))
    : [];
  cacheFichasConSlugs.set(clave, fichas);
  return fichas;
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
  const slugDestino = slugs?.[idiomaDestino];
  if (slugDestino) {
    const destino = path.join(
      guiasRoot,
      idiomaDestino,
      categoria,
      `${slugDestino}.md`
    );
    if (fs.existsSync(destino)) return slugDestino;
  }
  if (!fs.existsSync(fullPath)) return null;
  // Búsqueda inversa (mismo criterio que en las fichas): las guías FR/IT/PT
  // declaran sus parejas ES/EN, pero las ES/EN no siempre llevan el slug del
  // idioma nuevo. Se busca en el idioma destino la guía que apunta a esta.
  const claveEs = idiomaActual === "es" ? slugActual : slugs?.es;
  const pareja = guiasConSlugs(idiomaDestino, categoria).find(
    (g) =>
      g.slugs?.[idiomaActual] === slugActual ||
      (claveEs !== undefined &&
        (idiomaDestino === "es" ? g.slug === claveEs : g.slugs?.es === claveEs))
  );
  return pareja?.slug ?? null;
}

const cacheGuiasConSlugs = new Map<string, FichaConSlugs[]>();

/** Slugs de las guías (`.md`) de una ciudad en un idioma, con caché por build. */
function guiasConSlugs(idioma: Idioma, categoria: string): FichaConSlugs[] {
  const clave = `${idioma}/${categoria}`;
  const enCache = cacheGuiasConSlugs.get(clave);
  if (enCache) return enCache;
  const dir = path.join(guiasRoot, idioma, categoria);
  const guias: FichaConSlugs[] = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
        .map((f) => ({
          slug: f.replace(/\.md$/, ""),
          slugs: leerSlugsDelFrontmatter(path.join(dir, f)),
        }))
    : [];
  cacheGuiasConSlugs.set(clave, guias);
  return guias;
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
