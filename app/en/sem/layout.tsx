import type { Metadata } from "next";
import type { ReactNode } from "react";
import CookieBanner from "@/components/CookieBanner";

/**
 * Shell for all English SEM landings (`/en/sem/*`).
 *
 * Same three responsibilities as the Spanish SEM shell:
 *
 * 1. Apply `noindex, nofollow` globally so Google doesn't index these
 *    paid-only landings (they don't compete with organic SEO). Defense in
 *    depth alongside the `X-Robots-Tag` header in next.config.js and the
 *    Disallow rule in app/robots.ts.
 *
 * 2. Mount the CookieBanner in English so GA4 can receive consent and we
 *    can measure SEM conversions. The default "denied" consent state set
 *    in app/layout.tsx already complies with GDPR; this banner lets the
 *    user grant consent.
 *
 * 3. Do NOT mount Navbar or Footer: SEM landings are closed experiences.
 *    The only desired exit is the CTA toward our own activity page or to
 *    Viator. Any extra nav opens leaks that hurt conversion rate.
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
      {children}
      <CookieBanner idioma="en" />
    </div>
  );
}
