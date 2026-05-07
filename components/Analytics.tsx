"use client";

import { useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  leerConsentimiento,
  COOKIE_CONSENT_EVENT,
  emitirConsentGtag,
} from "@/lib/cookies";

type Props = {
  /**
   * ID de medición de GA4 (formato G-XXXXXXXXXX). Si no está definido,
   * el componente no renderiza nada.
   */
  gaId: string | undefined;
};

/**
 * Renderiza GA4 con Consent Mode v2.
 *
 * A diferencia de la versión anterior, gtag.js se carga SIEMPRE (cuando
 * hay gaId). El control de cookies se hace vía gtag('consent', 'update', ...).
 *
 * Flujo:
 *   1. app/layout.tsx pre-inicializa consent en "denied" antes que nada (script inline).
 *   2. Aquí montamos GoogleAnalytics → gtag.js carga.
 *   3. Si el usuario ya había decidido en una visita anterior, sincronizamos
 *      el consent con su decisión guardada (granted/denied).
 *   4. Cuando el usuario interactúa con el banner, COOKIE_CONSENT_EVENT
 *      dispara una actualización del consent.
 *
 * Beneficio: aunque el usuario rechace, GA4 recibe pings sin cookies y
 * Google modela conversiones agregadas (clave para Google Ads).
 */
export default function Analytics({ gaId }: Props) {
  useEffect(() => {
    // Sincroniza el consent al cargar: si el usuario ya había decidido en
    // una sesión anterior, gtag debe saberlo. Si está en "pending", el
    // default "denied" del script inline en layout.tsx sigue activo.
    const estado = leerConsentimiento();
    if (estado === "granted" || estado === "denied") {
      emitirConsentGtag(estado);
    }

    // Reacciona a cambios futuros (botones del banner, página /cookies).
    function alCambiar() {
      const nuevoEstado = leerConsentimiento();
      if (nuevoEstado === "granted" || nuevoEstado === "denied") {
        emitirConsentGtag(nuevoEstado);
      }
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, alCambiar);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, alCambiar);
    };
  }, []);

  if (!gaId) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
