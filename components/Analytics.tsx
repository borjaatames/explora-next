"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  leerConsentimiento,
  COOKIE_CONSENT_EVENT,
  type EstadoConsentimiento,
} from "@/lib/cookies";

type Props = {
  /**
   * ID de medición de GA4 (formato G-XXXXXXXXXX). Si no está definido,
   * el componente no carga GA4 ni renderiza nada.
   */
  gaId: string | undefined;
};

/**
 * Renderiza GA4 si y solo si el usuario ha dado consentimiento explícito.
 *
 * El componente se rehidrata escuchando el evento custom que dispara
 * `lib/cookies.ts`, así si el usuario cambia su decisión (p.ej. desde
 * /cookies con un botón de reiniciar), GA4 se monta o desmonta sin
 * recargar la página.
 *
 * Cuando se desmonta, GoogleAnalytics de @next/third-parties retira el
 * script del DOM. Las cookies _ga ya puestas se conservan hasta que el
 * navegador las expire o el usuario las borre (Next no puede eliminarlas
 * desde otro origen).
 */
export default function Analytics({ gaId }: Props) {
  const [estado, setEstado] = useState<EstadoConsentimiento>("pending");
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    setEstado(leerConsentimiento());
    setHidratado(true);

    function alCambiar() {
      setEstado(leerConsentimiento());
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, alCambiar);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, alCambiar);
    };
  }, []);

  // No renderizar GA4 hasta haber leído el estado real desde localStorage.
  // Así evitamos un flash donde GA4 podría cargarse momentáneamente antes
  // de saber que el usuario lo había rechazado.
  if (!hidratado) return null;
  if (!gaId) return null;
  if (estado !== "granted") return null;

  return <GoogleAnalytics gaId={gaId} />;
}
