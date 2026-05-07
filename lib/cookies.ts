/**
 * Gestión del consentimiento de cookies (RGPD) + Consent Mode v2.
 *
 * El estado vive en localStorage bajo la clave documentada en la página
 * /cookies. El nombre debe coincidir con lo que dice la política para que
 * el usuario pueda inspeccionarla manualmente si quiere verificarla.
 *
 * Estados posibles:
 *   - "granted": el usuario aceptó cookies de análisis (GA4 recibe datos
 *                identificables y puede escribir cookies _ga)
 *   - "denied": el usuario rechazó (GA4 sigue cargado pero sin cookies;
 *               envía pings agregados/modelados a Google)
 *   - "pending": no hay decisión (banner debe aparecer; consent default
 *                "denied" del script en layout.tsx sigue activo)
 *
 * El consentimiento expira a los 180 días (recomendación AEPD para
 * pedir reconsentimiento). Tras ese plazo vuelve a "pending" y el banner
 * reaparece.
 */

export type EstadoConsentimiento = "granted" | "denied" | "pending";

/** Clave de localStorage. NO cambiar sin actualizar /app/cookies/page.tsx. */
export const COOKIE_CONSENT_KEY = "exploraspain_cookie_consent";

/** Días de validez antes de pedir reconsentimiento (AEPD). */
export const COOKIE_CONSENT_DAYS = 180;

/** Evento custom que dispara cualquier cambio de consentimiento. */
export const COOKIE_CONSENT_EVENT = "exploraspain:consent-changed";

type RegistroConsentimiento = {
  estado: "granted" | "denied";
  /** Timestamp en ms de cuándo se otorgó/denegó. */
  fecha: number;
};

type GtagFn = (
  command: string,
  action: string,
  params: Record<string, unknown>,
) => void;

/**
 * Lee el estado actual desde localStorage. Devuelve "pending" si no hay
 * registro previo, si está corrupto, o si ha caducado.
 *
 * Es seguro llamar desde Client Components: si no hay window (SSR), devuelve
 * "pending" sin lanzar error.
 */
export function leerConsentimiento(): EstadoConsentimiento {
  if (typeof window === "undefined") return "pending";

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return "pending";

    const registro = JSON.parse(raw) as RegistroConsentimiento;

    // Validación defensiva: el JSON podría estar corrupto.
    if (
      (registro.estado !== "granted" && registro.estado !== "denied") ||
      typeof registro.fecha !== "number"
    ) {
      return "pending";
    }

    // ¿Ha caducado?
    const ahora = Date.now();
    const edadMs = ahora - registro.fecha;
    const edadDias = edadMs / (1000 * 60 * 60 * 24);
    if (edadDias > COOKIE_CONSENT_DAYS) return "pending";

    return registro.estado;
  } catch {
    return "pending";
  }
}

/**
 * Emite la actualización de Consent Mode v2 a gtag.
 *
 * - "granted" → analytics y publicidad activos (cookies _ga, identificación normal).
 * - "denied" → modo cookieless: gtag.js sigue corriendo y envía pings,
 *   pero Google modela conversiones agregadas en lugar de identificar al usuario.
 *
 * Si gtag aún no está disponible (carrera en primer render), no pasa nada:
 * el default "denied" del script inline en app/layout.tsx ya está activo.
 */
export function emitirConsentGtag(estado: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  if (!("gtag" in window)) return;

  const gtag = (window as unknown as { gtag: GtagFn }).gtag;

  gtag("consent", "update", {
    ad_storage: estado,
    ad_user_data: estado,
    ad_personalization: estado,
    analytics_storage: estado,
    functionality_storage: estado,
    personalization_storage: estado,
    // security_storage siempre granted: solo cookies de seguridad esenciales.
  });
}

/**
 * Guarda la decisión del usuario, emite Consent Mode v2 update y dispara
 * el evento global para que cualquier componente que escuche reaccione.
 */
export function guardarConsentimiento(estado: "granted" | "denied"): void {
  if (typeof window === "undefined") return;

  const registro: RegistroConsentimiento = {
    estado,
    fecha: Date.now(),
  };

  try {
    window.localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify(registro),
    );
    emitirConsentGtag(estado);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
  } catch {
    // localStorage puede fallar en navegación privada estricta. Silencioso.
  }
}

/**
 * Borra el consentimiento previo. La página /cookies puede usar esto
 * para ofrecer un botón "Cambiar mi decisión".
 *
 * Tras el reset, el consent vuelve al default "denied" del script inline.
 */
export function reiniciarConsentimiento(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
    emitirConsentGtag("denied");
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
  } catch {
    // Silencioso.
  }
}
