import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * Layout de las landings SEM.
 *
 * Aplica `noindex, nofollow` globalmente a todas las rutas /sem/*.
 * Esto evita que Google las indexe (no compiten con SEO orgánico).
 *
 * No incluye Navbar ni Footer porque las landings SEM se renderizan
 * sin distracciones para maximizar la conversión del tráfico de pago.
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
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
      {children}
    </div>
  );
}
