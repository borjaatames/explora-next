import type { Metadata } from "next";
import type { ReactNode } from "react";
import CookieBanner from "@/components/CookieBanner";
import SemBrandStrip from "@/components/sem/SemBrandStrip";

/**
 * Shell para todas las landings SEM (`/sem/*`).
 *
 * Cumple cuatro funciones (todo elemento de chrome vive AQUÍ, NO en
 * pages — ver `programacion de la pagina/reglas-proyecto-exploraspain.md`
 * §8 "Patrón canónico de shells"):
 *
 * 1. Aplica `noindex, nofollow` global a todas las rutas /sem/* para que
 *    Google no las indexe (no compiten con SEO orgánico). Esto está bien
 *    documentado en SEM: las landings de campañas pagadas no deben
 *    aparecer en resultados orgánicos.
 *
 * 2. Monta `SemBrandStrip`: franja de marca ExploraSpain (logo + nombre,
 *    no clicable) sobre `bg-amber-400 / border-sky-500`. Identidad visual
 *    consistente con el Navbar editorial sin abrir fuga del funnel.
 *
 * 3. Envuelve children en `<main pb-24 md:pb-0>` para que `SemStickyMobile`
 *    nunca tape el último bloque de contenido al final de la landing.
 *
 * 4. Monta el CookieBanner. Sin él, GA4 no recibe consentimiento y no
 *    se puede medir conversión SEM (crítico para optimizar Google Ads).
 *    El consent default "denied" del script en app/layout.tsx ya cumple
 *    GDPR de partida; el banner permite al usuario otorgar granted.
 *
 * NO monta Navbar de enlaces ni Footer editorial: las landings SEM son
 * experiencias cerradas. La única salida deseable es el CTA hacia
 * ficha-propia o Viator. Cualquier nav/footer extra abre fugas que
 * reducen conversión.
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
      <SemBrandStrip />
      <main className="pb-24 md:pb-0">{children}</main>
      <CookieBanner idioma="es" />
    </div>
  );
}
