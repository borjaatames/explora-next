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
 * Guías DE completas (al menos ~85 % de la extensión de la ES; revisado el
 * 3 nov 2026): se indexan aunque su ciudad no esté en CIUDADES_DE_INDEXABLES.
 * Para abrir otra guía DE, añade aquí su ruta.
 */
export const GUIAS_DE_INDEXABLES: ReadonlySet<string> = new Set([
  "/de/guides/alicante/costa-blanca-ausfluege-ab-alicante",
  "/de/guides/alicante/isla-de-tabarca-besichtigen",
  "/de/guides/alicante/was-sehen-in-alicante",
  "/de/guides/barcelona/barcelona-in-3-tagen",
  "/de/guides/barcelona/barcelona-in-einem-tag",
  "/de/guides/barcelona/barcelona-kreuzfahrt-landgang",
  "/de/guides/barcelona/barcelona-mit-kindern",
  "/de/guides/barcelona/casa-batllo-tickets-ausverkauft",
  "/de/guides/barcelona/essen-in-barcelona",
  "/de/guides/barcelona/flamenco-barcelona-welches-tablao-waehlen",
  "/de/guides/barcelona/la-pedrera-tickets-ausverkauft",
  "/de/guides/barcelona/montserrat-anreise-ab-barcelona",
  "/de/guides/barcelona/montserrat-welche-tour-waehlen",
  "/de/guides/barcelona/park-guell-tickets-ausverkauft",
  "/de/guides/barcelona/park-guell-welches-ticket-waehlen",
  "/de/guides/barcelona/picasso-museum-barcelona-tickets-ausverkauft",
  "/de/guides/barcelona/sagrada-familia-besichtigen",
  "/de/guides/barcelona/sagrada-familia-tickets-ausverkauft",
  "/de/guides/barcelona/sagrada-familia-welches-ticket-waehlen",
  "/de/guides/barcelona/weihnachten-barcelona",
  "/de/guides/bilbao/ausfluege-ab-bilbao",
  "/de/guides/bilbao/bilbao-in-einem-tag",
  "/de/guides/bilbao/bilbao-kreuzfahrt-landgang",
  "/de/guides/bilbao/bilbao-mit-kindern",
  "/de/guides/bilbao/guggenheim-bilbao-tickets-ausverkauft",
  "/de/guides/bilbao/guggenheim-museum-besichtigen",
  "/de/guides/bilbao/pintxos-in-bilbao",
  "/de/guides/cadiz/cadiz-in-einem-tag",
  "/de/guides/cadiz/cadiz-kreuzfahrt-landgang",
  "/de/guides/cadiz/karneval-von-cadiz",
  "/de/guides/cadiz/straende-costa-de-la-luz-cadiz",
  "/de/guides/cordoba/cordoba-in-einem-tag",
  "/de/guides/cordoba/mezquita-catedral-besichtigen",
  "/de/guides/cordoba/mezquita-cordoba-tickets-ausverkauft",
  "/de/guides/cordoba/patios-von-cordoba",
  "/de/guides/girona/costa-brava-ausfluege-ab-girona",
  "/de/guides/girona/dali-museum-figueres-tickets-ausverkauft",
  "/de/guides/girona/girona-game-of-thrones",
  "/de/guides/girona/girona-in-einem-tag",
  "/de/guides/granada/alhambra-besichtigen",
  "/de/guides/granada/alhambra-nachtbesuch-tickets-ausverkauft",
  "/de/guides/granada/alhambra-tickets-ausverkauft",
  "/de/guides/granada/alhambra-welche-tour-waehlen",
  "/de/guides/granada/granada-in-2-tagen",
  "/de/guides/granada/granada-mit-kindern",
  "/de/guides/granada/weihnachten-granada",
  "/de/guides/ibiza/formentera-ab-ibiza",
  "/de/guides/ibiza/schoenste-buchten-ibiza",
  "/de/guides/ibiza/was-sehen-in-ibiza",
  "/de/guides/madrid/avila-sehenswuerdigkeiten-tagesausflug",
  "/de/guides/madrid/bernabeu-stadion-tour-tickets-ausverkauft",
  "/de/guides/madrid/flamenco-madrid-welches-tablao-waehlen",
  "/de/guides/madrid/koenigspalast-madrid-tickets-ausverkauft",
  "/de/guides/madrid/madrid-in-3-tagen",
  "/de/guides/madrid/madrid-kostenlos",
  "/de/guides/madrid/madrid-mit-kindern",
  "/de/guides/madrid/prado-museum-kostenlos",
  "/de/guides/madrid/prado-museum-tickets-ausverkauft",
  "/de/guides/madrid/prado-reina-sofia-thyssen-vergleich",
  "/de/guides/madrid/reina-sofia-museum-tickets-ausverkauft",
  "/de/guides/madrid/segovia-sehenswuerdigkeiten-tagesausflug",
  "/de/guides/madrid/spanien-rundreise-10-tage",
  "/de/guides/madrid/tagesausflug-toledo-ab-madrid",
  "/de/guides/madrid/toledo-sehenswuerdigkeiten",
  "/de/guides/madrid/weihnachten-madrid",
  "/de/guides/madrid/zug-madrid-toledo",
  "/de/guides/malaga/ausfluege-ab-malaga",
  "/de/guides/malaga/caminito-del-rey-besichtigen",
  "/de/guides/malaga/caminito-del-rey-tickets-ausverkauft",
  "/de/guides/malaga/essen-in-malaga",
  "/de/guides/malaga/malaga-in-zwei-tagen",
  "/de/guides/malaga/malaga-kreuzfahrt-landgang",
  "/de/guides/malaga/malaga-mit-kindern",
  "/de/guides/malaga/malaga-sehenswuerdigkeiten-an-einem-tag",
  "/de/guides/malaga/picasso-museum-malaga-tickets-ausverkauft",
  "/de/guides/malaga/ronda-sehenswuerdigkeiten-an-einem-tag",
  "/de/guides/malaga/weihnachten-malaga",
  "/de/guides/salamanca/salamanca-in-einem-tag",
  "/de/guides/salamanca/salamanca-wochenendtrip",
  "/de/guides/salamanca/universidad-de-salamanca-besichtigen",
  "/de/guides/santiago-de-compostela/jakobsweg-letzte-100-km",
  "/de/guides/santiago-de-compostela/kathedrale-santiago-besichtigen",
  "/de/guides/santiago-de-compostela/santiago-in-einem-tag",
  "/de/guides/sevilla/alcazar-sevilla-tickets-ausverkauft",
  "/de/guides/sevilla/alcazar-von-sevilla-besichtigen",
  "/de/guides/sevilla/flamenco-sevilla-welches-tablao-waehlen",
  "/de/guides/sevilla/kathedrale-sevilla-giralda-tickets-ausverkauft",
  "/de/guides/sevilla/sevilla-in-3-tagen",
  "/de/guides/sevilla/sevilla-in-einem-tag",
  "/de/guides/sevilla/sevilla-mit-kindern",
  "/de/guides/sevilla/tapas-in-sevilla",
  "/de/guides/sevilla/weihnachten-sevilla",
  "/de/guides/tarragona/portaventura-world-guide",
  "/de/guides/tarragona/roemisches-tarraco",
  "/de/guides/tarragona/tarragona-in-einem-tag",
  "/de/guides/valencia/ausfluege-ab-valencia",
  "/de/guides/valencia/oceanografic-valencia-tickets-ausverkauft",
  "/de/guides/valencia/paella-in-valencia",
  "/de/guides/valencia/stadt-der-kuenste-und-wissenschaften-besichtigen",
  "/de/guides/valencia/valencia-in-2-tagen",
  "/de/guides/valencia/valencia-kreuzfahrt-landgang",
  "/de/guides/valencia/valencia-mit-kindern",
  "/de/guides/valencia/weihnachten-valencia/de/guides/madrid/madrid-tapas-nach-gericht",
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
