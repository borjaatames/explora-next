/**
 * Canal de llegada de la visita (IA, Ads, buscador, directo…), calculado una
 * vez por sesión en la página de entrada y guardado en sessionStorage.
 *
 * Se añade al final de la campaña `cmp` de los enlaces y widgets de
 * GetYourGuide (p. ej. `ficha-es-caminito-del-rey-ia`), para que el panel de
 * GYG diga de qué canal viene cada reserva. No guarda datos personales: solo
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

/** Guarda el canal de la sesión si aún no está guardado (llamar al cargar). */
export function registrarCanalVisita(): void {
  if (typeof window === "undefined") return;
  try {
    if (!window.sessionStorage.getItem(CLAVE)) {
      window.sessionStorage.setItem(CLAVE, calcular());
    }
  } catch {
    // sessionStorage bloqueado: canalVisita() lo calcula al vuelo.
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

/** Añade el canal a una campaña `cmp` (sin duplicarlo). */
export function campanaConCanal(campana: string): string {
  const canal = canalVisita();
  return campana.endsWith(`-${canal}`) ? campana : `${campana}-${canal}`;
}

/**
 * Escucha los clics en enlaces a GetYourGuide y añade el canal a su `cmp`
 * justo antes de salir. Devuelve la función para quitar el listener.
 */
export function etiquetarEnlacesGyg(): () => void {
  const alPulsar = (evento: MouseEvent): void => {
    const destino = evento.target instanceof Element ? evento.target.closest("a[href]") : null;
    if (!(destino instanceof HTMLAnchorElement)) return;
    let url: URL;
    try {
      url = new URL(destino.href);
    } catch {
      return;
    }
    if (!url.hostname.endsWith("getyourguide.com")) return;
    const cmp = url.searchParams.get("cmp");
    if (!cmp) return;
    url.searchParams.set("cmp", campanaConCanal(cmp));
    destino.href = url.toString();
  };
  // Captura para ir antes que cualquier otro manejador del enlace.
  document.addEventListener("click", alPulsar, true);
  document.addEventListener("auxclick", alPulsar, true);
  return () => {
    document.removeEventListener("click", alPulsar, true);
    document.removeEventListener("auxclick", alPulsar, true);
  };
}
