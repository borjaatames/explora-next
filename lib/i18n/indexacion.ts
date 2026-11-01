/**
 * Qué URLs se ofrecen a los buscadores.
 *
 * El alemán tiene guías más cortas que ES/EN, así que de las guías solo se
 * indexa donde hay demanda alemana clara: la home `/de` y las islas. Las
 * fichas DE (actividades que se hacen en alemán) y sus listados se indexan
 * en todas las ciudades. El resto de `/de/...` sigue publicado para quien llegue por un
 * enlace, pero va con `noindex, follow` (cabecera en el middleware) y sale
 * del sitemap y del hreflang. Para reindexar una ciudad, añádela aquí.
 *
 * Sin dependencias de Node: lo importa el middleware (Edge runtime).
 */
export const CIUDADES_DE_INDEXABLES: ReadonlySet<string> = new Set([
  "mallorca",
  "tenerife",
  "gran-canaria",
  "lanzarote",
  "fuerteventura",
]);

/** `ruta` es un path absoluto del sitio, sin dominio (p. ej. `/de/guides/mallorca/x`). */
export function rutaIndexable(ruta: string): boolean {
  const idioma = /^\/(de|fr|it|pt)(?:\/|$)/.exec(ruta)?.[1];
  if (!idioma) return true;
  if (ruta === `/${idioma}`) return true;
  // Fichas (solo las actividades que se hacen en ese idioma) y sus listados:
  // contenido propio, indexable en todas las ciudades.
  if (/^\/[a-z]{2}\/cities\/[^/]+\/activities(?:\/(?:c\/)?[^/]+)?$/.test(ruta)) return true;
  // FR/IT/PT solo tienen fichas: el resto (ciudad, legales…) no se indexa.
  if (idioma !== "de") return false;
  const m = /^\/de\/(?:guides|cities)\/([^/]+)/.exec(ruta);
  return m !== null && CIUDADES_DE_INDEXABLES.has(m[1]);
}
