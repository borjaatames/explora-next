import type { Metadata } from "next";
import Link from "next/link";
import { urlIndiceGuias, urlIndiceCiudades, urlCiudad } from "@/lib/i18n/utils";

/**
 * 404 del shell español. Se renderiza dentro de EsShellLayout (Navbar +
 * Footer ES ya montados), tanto para URLs que no matchean ningún patrón
 * de ruta dentro de (es-shell) como para las que sí matchean pero llaman
 * a notFound() (p. ej. actividad despublicada en /ciudades/[ciudad]/
 * actividades/[slug]/page.tsx).
 *
 * Ver auditoria-seo-organico-2026-08-15.md: antes de este archivo, todas
 * las URLs rotas caían en el 404 por defecto de Next (sin navegación),
 * lo que probablemente explicaba las vistas de la página "404: This page
 * could not be..." en GA4.
 */
export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

const CIUDADES_DESTACADAS = [
  { slug: "madrid", nombre: "Madrid" },
  { slug: "barcelona", nombre: "Barcelona" },
  { slug: "sevilla", nombre: "Sevilla" },
  { slug: "granada", nombre: "Granada" },
];

export default function NotFoundEs() {
  return (
    <main className="min-h-screen bg-white flex items-center">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
        <p className="font-playfair text-sky-600 text-lg font-semibold mb-2">
          Error 404
        </p>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          Esta página no existe (o ya no)
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
          El enlace puede estar desactualizado o la actividad que buscabas ya
          no está disponible. Seguimos teniendo guías y actividades por toda
          España — empieza por aquí.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-white border border-slate-300 hover:border-sky-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Volver al inicio
          </Link>
          <Link
            href={urlIndiceGuias("es")}
            className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            Ver todas las guías →
          </Link>
          <Link
            href={urlIndiceCiudades("es")}
            className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            Ver todas las ciudades →
          </Link>
        </div>

        <div className="pt-10 border-t border-slate-200">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Destinos con más contenido
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CIUDADES_DESTACADAS.map((c) => (
              <Link
                key={c.slug}
                href={urlCiudad("es", c.slug)}
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
