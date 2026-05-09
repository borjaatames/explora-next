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
