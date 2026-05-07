import type { Metadata } from "next";
import type { ReactNode } from "react";
import CookieBanner from "@/components/CookieBanner";

/**
 * Shell para todas las landings SEM (`/sem/*`).
 *
 * Cumple tres funciones:
 *
 * 1. Aplica `noindex, nofollow` global a todas las rutas /sem/* para que
 *    Google no las indexe (no compiten con SEO orgánico). Esto está bien
 *    documentado en SEM: las landings de campañas pagadas no deben
 *    aparecer en resultados orgánicos.
 *
 * 2. Monta el CookieBanner. Sin él, GA4 no recibe consentimiento y no
 *    se puede medir conversión SEM (crítico para optimizar Google Ads).
 *    El consent default "denied" del script en app/layout.tsx ya cumple
 *    GDPR de partida; el banner permite al usuario otorgar granted.
 *
 * 3. NO monta Navbar ni Footer: las landings SEM son experiencias
 *    cerradas. La única salida deseable es el CTA hacia ficha-propia o
 *    Viator. Cualquier nav/footer extra abre fugas que reducen conversión.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function SemLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {children}
      <CookieBanner idioma="es" />
    </div>
  );
}
