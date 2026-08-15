import type { Metadata } from "next";
import Link from "next/link";
import { urlIndiceGuias, urlIndiceCiudades, urlCiudad } from "@/lib/i18n/utils";

/**
 * 404 del shell inglés. Vive dentro de app/[lang]/, que hoy solo sirve
 * "en" (generateStaticParams de LangLayout excluye "es"), así que es
 * seguro fijar idioma="en" a mano: not-found.tsx no recibe params del
 * segmento padre en Next.js (limitación conocida del framework), pero
 * este archivo nunca se renderiza fuera de /en/*.
 *
 * Se renderiza dentro de LangLayout (Navbar + Footer EN ya montados).
 * Ver auditoria-seo-organico-2026-08-15.md para el contexto: antes de
 * este archivo, las fichas EN despublicadas caían en el 404 por defecto
 * de Next, sin navegación de vuelta al sitio.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const FEATURED_CITIES = [
  { slug: "madrid", nombre: "Madrid" },
  { slug: "barcelona", nombre: "Barcelona" },
  { slug: "sevilla", nombre: "Seville" },
  { slug: "granada", nombre: "Granada" },
];

export default function NotFoundEn() {
  return (
    <main className="min-h-screen bg-white flex items-center">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
        <p className="font-playfair text-sky-600 text-lg font-semibold mb-2">
          Error 404
        </p>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          This page doesn&apos;t exist (anymore)
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
          The link may be outdated, or the activity you were looking for is
          no longer available. We still have guides and activities all over
          Spain — start here.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/en"
            className="inline-flex items-center justify-center bg-white border border-slate-300 hover:border-sky-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Back to home
          </Link>
          <Link
            href={urlIndiceGuias("en")}
            className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            See all guides →
          </Link>
          <Link
            href={urlIndiceCiudades("en")}
            className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            See all cities →
          </Link>
        </div>

        <div className="pt-10 border-t border-slate-200">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Destinations with the most content
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {FEATURED_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={urlCiudad("en", c.slug)}
                className="inline-block bg-sky-100 text-sky-700 text-sm font-semibold px-3 py-1.5 rounded hover:bg-sky-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                {c.nombre}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
