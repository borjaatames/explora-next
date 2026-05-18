import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { SemIdioma, SemLanding, SemLandingFrontmatter } from './types';

const semDirectory = path.join(process.cwd(), 'content', 'sem');

/**
 * Lee un landing SEM por slug e idioma.
 *
 * NOTA: Este archivo solo debe importarse desde Server Components o desde
 * código que corre en build time (page.tsx, layout.tsx, generateMetadata).
 * Si lo importas desde un Client Component fallará con "Can't resolve 'fs'".
 *
 * Para construir URLs Viator desde el cliente, usa lib/sem/url-builder.ts
 *
 * @param slug Nombre del .md sin extensión.
 * @param idioma Idioma de la landing. Por defecto 'es' (retrocompatibilidad
 *               con las páginas SEM existentes que llaman sin segundo arg).
 *               'es' lee `content/sem/{slug}.md`.
 *               'en' lee `content/sem/en/{slug}.md`.
 *
 * Devuelve null si no existe o si publicada: false.
 */
export function obtenerLandingSem(
  slug: string,
  idioma: SemIdioma = 'es',
): SemLanding | null {
  const filePath =
    idioma === 'es'
      ? path.join(semDirectory, `${slug}.md`)
      : path.join(semDirectory, idioma, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  const frontmatter = data as SemLandingFrontmatter;

  if (!frontmatter.publicada) {
    return null;
  }

  const url =
    idioma === 'es'
      ? `/sem/${frontmatter.slug}`
      : `/${idioma}/sem/${frontmatter.slug}`;

  return {
    ...frontmatter,
    url,
    idioma,
  };
}

/**
 * Resumen mínimo de una landing SEM para usar en links de navegación
 * (por ejemplo, el botón "← Volver" en la ficha de actividad cuando el
 * usuario llega desde una landing).
 */
export type SemLandingResumen = {
  slug: string;
  url: string;
};

/**
 * Lista TODAS las landings SEM publicadas para un idioma, devolviendo
 * solo `{slug, url}`. Pensado para pasar a un Client Component que
 * necesita saber qué landings existen (por ejemplo, para validar un
 * `?from=<slug>` antes de redirigir).
 *
 * Server-only — depende de `fs`. No importar desde Client Components.
 *
 * @param idioma 'es' lee `content/sem/*.md`; 'en' lee `content/sem/en/*.md`.
 *               Para añadir más idiomas, replicar el patrón.
 */
export function obtenerLandingsSemConocidas(
  idioma: SemIdioma = 'es',
): SemLandingResumen[] {
  const dir =
    idioma === 'es' ? semDirectory : path.join(semDirectory, idioma);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.md'));

  const resumen: SemLandingResumen[] = [];
  for (const entry of entries) {
    const slug = entry.name.replace(/\.md$/, '');
    const landing = obtenerLandingSem(slug, idioma);
    if (landing) {
      resumen.push({ slug: landing.slug, url: landing.url });
    }
  }
  return resumen;
}
