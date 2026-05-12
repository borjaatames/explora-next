import type { Metadata } from "next";
import type { ReactNode } from "react";
import CookieBanner from "@/components/CookieBanner";
import SemBrandStrip from "@/components/sem/SemBrandStrip";

/**
 * Shell for all English SEM landings (`/en/sem/*`).
 *
 * Mirrors the Spanish SEM shell (`app/sem/layout.tsx`). All chrome lives
 * here, NOT in pages — see
 * `programacion de la pagina/reglas-proyecto-exploraspain.md`
 * §8 "Patrón canónico de shells".
 *
 * Four responsibilities:
 *
 * 1. Apply `noindex, nofollow` globally so Google doesn't index these
 *    paid-only landings (they don't compete with organic SEO). Defense in
 *    depth alongside the `X-Robots-Tag` header in next.config.js and the
 *    Disallow rule in app/robots.ts.
 *
 * 2. Mount `SemBrandStrip`: ExploraSpain identity strip (logo + name, NOT
 *    clickable) over `bg-amber-400 / border-sky-500`. Consistent with the
 *    editorial Navbar while keeping the funnel closed.
 *
 * 3. Wrap children in `<main pb-24 md:pb-0>` so `SemStickyMobile` never
 *    overlaps the bottom content block.
 *
 * 4. Mount the CookieBanner in English so GA4 can receive consent and we
 *    can measure SEM conversions. The default "denied" consent state set
 *    in app/layout.tsx already complies with GDPR; this banner lets the
 *    user grant consent.
 *
 * Do NOT mount editorial Navbar or Footer: SEM landings are closed
 * experiences. The only desired exit is the CTA toward our own activity
 * page or to Viator. Any extra nav opens leaks that hurt conversion rate.
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

export default function SemEnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <SemBrandStrip />
      <main className="pb-24 md:pb-0">{children}</main>
      <CookieBanner idioma="en" />
    </div>
  );
}
