/**
 * Normalización de URLs de Viator por idioma de la página.
 *
 * Función pura, sin imports de Node ni de `process.env`: se usa desde
 * Server Components y desde `lib/sem/url-builder.ts`.
 *
 * Viator decide el idioma así:
 *  - Español → ruta con el segmento de locale `/es-ES/` (viator.com/es-ES/tours/...).
 *  - Inglés  → SIN segmento de locale (viator.com/tours/...) y con `&primaryLanguage=en`.
 * Si una página EN apunta a `/es-ES/` (o una ES sin él), el operador abre en el idioma
 * equivocado. Este helper lo corrige según el idioma de NUESTRA página.
 */

/** Segmento de locale inicial tipo "/es-ES/" o "/en-US/". */
const LOCALE_SEG = /^\/[a-z]{2}-[A-Za-z]{2}\//;

/**
 * Devuelve la URL de Viator normalizada para el idioma indicado:
 *  - fuerza dominio `www.viator.com`,
 *  - ES → antepone `/es-ES` en la ruta y quita `primaryLanguage`,
 *  - EN → quita cualquier segmento de locale y añade `primaryLanguage=en`.
 * Si la URL no es parseable, se devuelve sin tocar.
 */
export function normalizarUrlViator(
  urlBase: string,
  idioma: "es" | "en"
): string {
  try {
    const url = new URL(urlBase);
    url.hostname = "www.viator.com";
    const path = url.pathname.replace(LOCALE_SEG, "/");
    if (idioma === "es") {
      url.pathname = `/es-ES${path}`;
      url.searchParams.delete("primaryLanguage");
    } else {
      url.pathname = path;
      url.searchParams.set("primaryLanguage", "en");
    }
    return url.toString();
  } catch {
    return urlBase;
  }
}
