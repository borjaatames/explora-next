/**
 * Gestión del consentimiento de cookies (RGPD).
 *
 * El estado vive en localStorage bajo la clave documentada en la página
 * /cookies. El nombre debe coincidir con lo que dice la política para que
 * el usuario pueda inspeccionarla manualmente si quiere verificarla.
 *
 * Estados posibles:
 *   - "granted": el usuario aceptó cookies de análisis (GA4 puede cargar)
 *   - "denied": el usuario rechazó (GA4 NO carga, ni se ponen cookies _ga)
 *   - "pending": no hay decisión (banner debe aparecer)
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
 * Guarda la decisión del usuario y dispara el evento global para que
 * cualquier componente que escuche reaccione (típicamente el componente
 * Analytics que carga/descarga GA4).
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
      JSON.stringify(registro)
    );
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
  } catch {
    // localStorage puede fallar en navegación privada estricta. Silencioso.
  }
}

/**
 * Borra el consentimiento previo. La página /cookies puede usar esto
 * para ofrecer un botón "Cambiar mi decisión".
 */
export function reiniciarConsentimiento(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
  } catch {
    // Silencioso.
  }
}
