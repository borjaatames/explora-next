'use client';

import { useEffect } from 'react';

/**
 * Captura el `gclid` (Google Click Identifier) y UTMs cuando el usuario
 * llega desde un anuncio de pago. Los guarda en sessionStorage para
 * que las tarjetas los usen al construir la URL outbound a Viator.
 *
 * sessionStorage limita el dato a la sesión actual del navegador.
 * Cuando el user cierra la pestaña, se pierde. Es lo correcto:
 * solo queremos atribuir clicks de la misma sesión.
 *
 * No renderiza nada visible.
 */
export default function GclidCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const gclid = params.get('gclid');

    if (gclid) {
      try {
        window.sessionStorage.setItem('gclid', gclid);
      } catch {
        // sessionStorage puede estar deshabilitado en modo privado
      }
    }

    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ];

    utmKeys.forEach((key) => {
      const value = params.get(key);
      if (value) {
        try {
          window.sessionStorage.setItem(key, value);
        } catch {
          // Ignorar
        }
      }
    });
  }, []);

  return null;
}
