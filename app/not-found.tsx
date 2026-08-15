import type { Metadata } from "next";
import Link from "next/link";

/**
 * 404 raíz de la aplicación. Next.js solo la usa cuando una URL no
 * matchea NINGÚN patrón de ruta (ni siquiera uno dinámico) en todo el
 * árbol — en ese caso no llega a montarse ningún layout segmentado
 * ((es-shell) o [lang]), así que aquí NO hay Navbar/Footer disponibles
 * y el idioma por defecto es español (coherente con <html lang="es">
 * en app/layout.tsx).
 *
 * El caso más común y con más volumen (fichas de actividad despublicadas,
 * que SÍ matchean el patrón dinámico [slug]) usa en su lugar
 * app/(es-shell)/not-found.tsx o app/[lang]/not-found.tsx, con Navbar y
 * Footer completos. Este archivo es el fallback genérico para URLs
 * verdaderamente ajenas a la estructura del sitio.
 */
export const metadata: Metadata = {
  title: "Página no encontrada | ExploraSpain",
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-white text-slate-900">
        <main className="min-h-screen flex items-center">
          <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
            <Link
              href="/"
              className="inline-block font-bold text-xl text-slate-900 mb-10"
            >
              ExploraSpain
            </Link>
            <p className="text-sky-600 text-lg font-semibold mb-2">
              Error 404
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Esta página no existe
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
              La dirección a la que has llegado no corresponde a ninguna
              página de ExploraSpain.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-white border border-slate-300 hover:border-sky-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Volver al inicio
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
