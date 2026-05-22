/**
 * Normalización de URLs de GetYourGuide por idioma de la página.
 *
 * Función pura, sin imports de Node ni de `process.env`: se puede usar
 * tanto desde Server Components como desde el `lib/sem/url-builder.ts`.
 *
 * Motivo: GetYourGuide decide el idioma de la página por el segmento de
 * locale de la RUTA (`/en-us/`, `/es-es/`…). Si la URL no lo lleva, GYG
 * cae a geolocalización del visitante — por eso una `getyourguide.com`
 * "a secas" abierta desde España se servía en español aunque la página
 * de ExploraSpain estuviera en inglés. Forzar el segmento es el
 * equivalente de GYG al `&primaryLanguage=en` de Viator.
 */

/** Partner ID oficial de afiliado GYG (ver afiliacion-getyourguide.md). */
export const GYG_PARTNER_ID = "C71NOAW";

/** Segmento de locale de GetYourGuide por idioma activo de la web. */
const GYG_LOCALE: Record<"es" | "en", string> = {
  es: "es-es",
  en: "en-us",
};

/** Detecta un segmento de locale GYG tipo "en-us", "es-es", "fr-fr"… */
const GYG_LOCALE_SEGMENT = /^[a-z]{2}-[a-z]{2}$/;

/** Parámetros de integraciones ajenas que NO deben viajar en nuestros enlaces. */
const PARAMS_AJENOS = ["utm_medium", "utm_source", "utm_campaign", "placement"];

/**
 * Devuelve la URL de GetYourGuide normalizada para el idioma indicado:
 *  - fuerza el dominio `www.getyourguide.com`,
 *  - inserta o reemplaza el segmento de locale en la ruta (`en-us` / `es-es`),
 *  - fija nuestro `partner_id` sobrescribiendo cualquier otro,
 *  - elimina parámetros de integraciones ajenas (utm_*, placement).
 *
 * Si la URL no es parseable, se devuelve sin tocar (no rompe la web).
 */
export function normalizarUrlGetYourGuide(
  urlBase: string,
  idioma: "es" | "en"
): string {
  try {
    const url = new URL(urlBase);
    url.hostname = "www.getyourguide.com";

    const segmentos = url.pathname.split("/").filter(Boolean);
    if (segmentos.length > 0 && GYG_LOCALE_SEGMENT.test(segmentos[0])) {
      segmentos[0] = GYG_LOCALE[idioma];
    } else {
      segmentos.unshift(GYG_LOCALE[idioma]);
    }
    url.pathname = `/${segmentos.join("/")}/`;

    url.searchParams.set("partner_id", GYG_PARTNER_ID);
    for (const ajeno of PARAMS_AJENOS) {
      url.searchParams.delete(ajeno);
    }

    return url.toString();
  } catch {
    return urlBase;
  }
}
