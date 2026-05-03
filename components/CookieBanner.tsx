"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  leerConsentimiento,
  guardarConsentimiento,
  COOKIE_CONSENT_EVENT,
} from "@/lib/cookies";

/**
 * Banner inferior de consentimiento de cookies. Aparece solo si el
 * usuario no ha decidido todavía (estado "pending") o si caducó.
 *
 * Diseño: barra fina inferior tipo Vercel/Linear. No bloquea contenido.
 * Posición fixed, fuera del flujo, no provoca CLS.
 *
 * Cumplimiento RGPD:
 *   - Aceptar y Rechazar tienen igual prominencia visual.
 *   - Los enlaces a la política de cookies y privacidad son visibles.
 *   - GA4 NO carga hasta que se pulsa "Aceptar" (lo gestiona Analytics.tsx).
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function evaluar() {
      setVisible(leerConsentimiento() === "pending");
    }

    // Pequeño delay para no interferir con el LCP. El banner es importante
    // pero no es lo primero que el usuario debe ver al cargar la página.
    const timer = setTimeout(evaluar, 400);

    // Re-evaluar si el consentimiento cambia (por ej. desde /cookies con
    // un botón "Cambiar mi decisión").
    window.addEventListener(COOKIE_CONSENT_EVENT, evaluar);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(COOKIE_CONSENT_EVENT, evaluar);
    };
  }, []);

  function aceptar() {
    guardarConsentimiento("granted");
    setVisible(false);
  }

  function rechazar() {
    guardarConsentimiento("denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-titulo"
      aria-describedby="cookie-banner-texto"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white shadow-lg animate-cookie-slide-up"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-3">
        <div className="flex-1">
          <p
            id="cookie-banner-titulo"
            className="text-sm font-semibold text-slate-900"
          >
            Usamos cookies para entender cómo se usa el sitio
          </p>
          <p
            id="cookie-banner-texto"
            className="mt-1 text-sm text-slate-600"
          >
            Analítica con Google Analytics 4. No vendemos tus datos. Más
            información en{" "}
            <Link
              href="/cookies"
              className="underline hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-sm"
            >
              Política de cookies
            </Link>{" "}
            y{" "}
            <Link
              href="/privacidad"
              className="underline hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-sm"
            >
              Privacidad
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 lg:flex-shrink-0">
          <button
            type="button"
            onClick={rechazar}
            className="flex-1 lg:flex-none rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={aceptar}
            className="flex-1 lg:flex-none rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Aceptar
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes cookie-slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-cookie-slide-up {
          animation: cookie-slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
