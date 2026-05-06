import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { SemLanding, SemLandingFrontmatter } from './types';

const semDirectory = path.join(process.cwd(), 'content', 'sem');

/**
 * Lee un landing SEM por slug.
 *
 * NOTA: Este archivo solo debe importarse desde Server Components o desde
 * código que corre en build time (page.tsx, layout.tsx, generateMetadata).
 * Si lo importas desde un Client Component fallará con "Can't resolve 'fs'".
 *
 * Para construir URLs Viator desde el cliente, usa lib/sem/url-builder.ts
 *
 * Devuelve null si no existe o si publicada: false.
 */
export function obtenerLandingSem(slug: string): SemLanding | null {
  const filePath = path.join(semDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  const frontmatter = data as SemLandingFrontmatter;

  if (!frontmatter.publicada) {
    return null;
  }

  return {
    ...frontmatter,
    url: `/sem/${frontmatter.slug}`,
  };
}
