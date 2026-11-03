/**
 * Qué URLs se ofrecen a los buscadores.
 *
 * El alemán tiene guías más cortas que ES/EN, así que de las guías solo se
 * indexa donde hay demanda alemana clara: la home `/de`, las islas y las
 * guías completas de GUIAS_DE_INDEXABLES. Las
 * fichas DE (actividades que se hacen en alemán) y sus listados se indexan
 * en todas las ciudades. El resto de `/de/...` sigue publicado para quien llegue por un
 * enlace, pero va con `noindex, follow` (cabecera en el middleware) y sale
 * del sitemap y del hreflang. Para reindexar una ciudad, añádela aquí.
 *
 * FR/IT/PT: las guías son traducciones completas, así que se indexan todas
 * (hub `/xx/guides`, cada guía y `/xx/cities/<ciudad>/guides`), igual que
 * las fichas y sus listados. El resto de páginas de ciudad no se indexa.
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

/**
 * Guías DE completas (misma extensión que la ES) y optimizadas con búsquedas
 * alemanas reales (3 nov 2026): se indexan aunque su ciudad no esté en
 * CIUDADES_DE_INDEXABLES. Para abrir otra guía DE, añade aquí su ruta.
 */
export const GUIAS_DE_INDEXABLES: ReadonlySet<string> = new Set([
  "/de/guides/barcelona/flamenco-barcelona-welches-tablao-waehlen",
  "/de/guides/barcelona/montserrat-anreise-ab-barcelona",
  "/de/guides/barcelona/montserrat-welche-tour-waehlen",
  "/de/guides/barcelona/park-guell-tickets-ausverkauft",
  "/de/guides/barcelona/park-guell-welches-ticket-waehlen",
  "/de/guides/barcelona/sagrada-familia-besichtigen",
  "/de/guides/barcelona/sagrada-familia-tickets-ausverkauft",
  "/de/guides/barcelona/sagrada-familia-welches-ticket-waehlen",
  "/de/guides/cordoba/mezquita-catedral-besichtigen",
  "/de/guides/granada/alhambra-besichtigen",
  "/de/guides/granada/alhambra-nachtbesuch-tickets-ausverkauft",
  "/de/guides/granada/alhambra-tickets-ausverkauft",
  "/de/guides/granada/alhambra-welche-tour-waehlen",
  "/de/guides/madrid/avila-sehenswuerdigkeiten-tagesausflug",
  "/de/guides/madrid/flamenco-madrid-welches-tablao-waehlen",
  "/de/guides/madrid/koenigspalast-madrid-tickets-ausverkauft",
  "/de/guides/madrid/madrid-in-3-tagen",
  "/de/guides/madrid/prado-museum-tickets-ausverkauft",
  "/de/guides/madrid/segovia-sehenswuerdigkeiten-tagesausflug",
  "/de/guides/madrid/spanien-rundreise-10-tage",
  "/de/guides/madrid/tagesausflug-toledo-ab-madrid",
  "/de/guides/madrid/zug-madrid-toledo",
  "/de/guides/malaga/caminito-del-rey-besichtigen",
  "/de/guides/malaga/malaga-in-zwei-tagen",
  "/de/guides/malaga/malaga-sehenswuerdigkeiten-an-einem-tag",
  "/de/guides/malaga/ronda-sehenswuerdigkeiten-an-einem-tag",
  "/de/guides/sevilla/alcazar-sevilla-tickets-ausverkauft",
  "/de/guides/sevilla/alcazar-von-sevilla-besichtigen",
  "/de/guides/sevilla/flamenco-sevilla-welches-tablao-waehlen",
  "/de/guides/sevilla/kathedrale-sevilla-giralda-tickets-ausverkauft",
]);

/** `ruta` es un path absoluto del sitio, sin dominio (p. ej. `/de/guides/mallorca/x`). */
export function rutaIndexable(ruta: string): boolean {
  const idioma = /^\/(de|fr|it|pt)(?:\/|$)/.exec(ruta)?.[1];
  if (!idioma) return true;
  if (ruta === `/${idioma}`) return true;
  // Fichas (solo las actividades que se hacen en ese idioma) y sus listados:
  // contenido propio, indexable en todas las ciudades.
  if (/^\/[a-z]{2}\/cities\/[^/]+\/activities(?:\/(?:c\/)?[^/]+)?$/.test(ruta)) return true;
  if (idioma !== "de") {
    // FR/IT/PT: guías completas (hub, guía y guías de cada ciudad). El resto
    // (página de ciudad, legales…) no se indexa.
    return (
      /^\/[a-z]{2}\/guides(?:\/[^/]+\/[^/]+)?$/.test(ruta) ||
      /^\/[a-z]{2}\/cities\/[^/]+\/guides$/.test(ruta)
    );
  }
  if (GUIAS_DE_INDEXABLES.has(ruta)) return true;
  const m = /^\/de\/(?:guides|cities)\/([^/]+)/.exec(ruta);
  return m !== null && CIUDADES_DE_INDEXABLES.has(m[1]);
}
