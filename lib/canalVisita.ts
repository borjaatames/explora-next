/**
 * Canal de llegada de la visita (IA, Ads, buscador, directo…), calculado una
 * vez por sesión en la página de entrada y guardado en sessionStorage.
 *
 * Se añade al final de la campaña `cmp` de los enlaces y widgets de
 * GetYourGuide (p. ej. `ficha-es-caminito-del-rey-ia-eg`), para que el panel
 * de GYG diga de qué canal y de qué tipo de página de entrada viene cada
 * reserva. No guarda datos personales: solo
 * una etiqueta corta, así que no depende del consentimiento de cookies.
 */

export type CanalVisita = "ia" | "ads" | "google" | "buscador" | "social" | "ref" | "dir";

const CLAVE = "exploraspain_canal";

const IA = /chatgpt|openai|perplexity|copilot|gemini|claude\.ai|you\.com|mistral|deepseek|meta\.ai/i;
const SOCIAL = /facebook|instagram|t\.co$|twitter|x\.com|whatsapp|tiktok|pinterest|linkedin|youtube|reddit/i;
const BUSCADORES = /bing\.|duckduckgo|ecosia|yahoo|yandex|brave|qwant|startpage|baidu|naver/i;

function calcular(): CanalVisita {
  const params = new URLSearchParams(window.location.search);
  if (params.has("gclid") || params.has("gbraid") || params.has("wbraid")) return "ads";
  const medio = (params.get("utm_medium") ?? "").toLowerCase();
  if (medio === "cpc" || medio === "ppc" || medio === "paid") return "ads";
  const fuente = params.get("utm_source") ?? "";
  if (IA.test(fuente)) return "ia";

  let host = "";
  try {
    host = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    host = "";
  }
  if (!host || host === window.location.hostname || host.endsWith("exploraspain.com")) {
    return fuente ? "ref" : "dir";
  }
  if (IA.test(host)) return "ia";
  if (/(^|\.)google\./.test(host)) return "google";
  if (BUSCADORES.test(host)) return "buscador";
  if (SOCIAL.test(host)) return "social";
  return "ref";
}

/**
 * Tipo de la página de entrada de la sesión, en una letra: g (guía),
 * f (ficha), a (atracción), c (ciudad), h (home), o (otra). Sirve para saber
 * en el panel de GYG si una reserva hecha en una ficha empezó en una guía.
 */
export type EntradaVisita = "g" | "f" | "a" | "c" | "h" | "o";

const CLAVE_ENTRADA = "exploraspain_entrada";

export function tipoEntrada(ruta: string): EntradaVisita {
  if (/^\/(en|de|fr|it|pt)?\/?$/.test(ruta)) return "h";
  if (/\/(actividades|activities)\/[^/]+\/?$/.test(ruta)) return "f";
  if (/\/(guias|guides)\/[^/]+\/[^/]+\/?$/.test(ruta)) return "g";
  if (/\/(atracciones|attractions)\/[^/]+\/?$/.test(ruta)) return "a";
  if (/\/(ciudades|cities)\/[^/]+\/?$/.test(ruta)) return "c";
  return "o";
}

/** Guarda canal y página de entrada de la sesión si aún no están (llamar al cargar). */
export function registrarCanalVisita(): void {
  if (typeof window === "undefined") return;
  try {
    if (!window.sessionStorage.getItem(CLAVE)) {
      window.sessionStorage.setItem(CLAVE, calcular());
    }
    if (!window.sessionStorage.getItem(CLAVE_ENTRADA)) {
      window.sessionStorage.setItem(CLAVE_ENTRADA, tipoEntrada(window.location.pathname));
    }
  } catch {
    // sessionStorage bloqueado: canalVisita() lo calcula al vuelo.
  }
}

/** Tipo de la página de entrada; null si no se pudo guardar. */
export function entradaVisita(): EntradaVisita | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(CLAVE_ENTRADA) as EntradaVisita | null;
  } catch {
    return null;
  }
}

/** Canal de la sesión actual. */
export function canalVisita(): CanalVisita {
  if (typeof window === "undefined") return "dir";
  try {
    const guardado = window.sessionStorage.getItem(CLAVE) as CanalVisita | null;
    if (guardado) return guardado;
  } catch {
    // Sin sessionStorage.
  }
  return calcular();
}

/**
 * Añade a una campaña `cmp` el canal y, si se conoce, la página de entrada
 * (sin duplicarlos): `ficha-es-slug-google-eg` = llegó desde Google y entró
 * por una guía. Sin entrada guardada queda como antes: `ficha-es-slug-google`.
 */
export function campanaConCanal(campana: string): string {
  const entrada = entradaVisita();
  const sufijo = entrada ? `-${canalVisita()}-e${entrada}` : `-${canalVisita()}`;
  return campana.endsWith(sufijo) ? campana : `${campana}${sufijo}`;
}

/**
 * Devuelve la URL con el canal añadido a su `cmp` si es un enlace a
 * GetYourGuide con campaña; cualquier otra URL se devuelve sin tocar.
 */
export function urlGygConCanal(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (!url.hostname.endsWith("getyourguide.com")) return href;
  const cmp = url.searchParams.get("cmp");
  if (!cmp) return href;
  url.searchParams.set("cmp", campanaConCanal(cmp));
  return url.toString();
}

/**
 * Escucha los clics en enlaces a GetYourGuide y añade el canal a su `cmp`
 * justo antes de salir. Devuelve la función para quitar el listener.
 *
 * Solo cubre los enlaces que navegan con su propio `href`. Los que abren la
 * URL por código (`window.open`) deben llamar a `urlGygConCanal`.
 */
export function etiquetarEnlacesGyg(): () => void {
  const alPulsar = (evento: MouseEvent): void => {
    const destino = evento.target instanceof Element ? evento.target.closest("a[href]") : null;
    if (!(destino instanceof HTMLAnchorElement)) return;
    const conCanal = urlGygConCanal(destino.href);
    if (conCanal !== destino.href) destino.href = conCanal;
  };
  // Captura para ir antes que cualquier otro manejador del enlace.
  document.addEventListener("click", alPulsar, true);
  document.addEventListener("auxclick", alPulsar, true);
  return () => {
    document.removeEventListener("click", alPulsar, true);
    document.removeEventListener("auxclick", alPulsar, true);
  };
}
