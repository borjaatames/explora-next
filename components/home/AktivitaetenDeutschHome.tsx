import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";
import { obtenerCiudadesConActividades, obtenerListaActividadesPorCiudad } from "@/lib/actividades";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { urlActividadesDeCiudad } from "@/lib/i18n/utils";

/**
 * Portada DE: ciudades con actividades que se hacen en alemán (las únicas que
 * tienen ficha DE), con su número, de más a menos.
 */
export default function AktivitaetenDeutschHome({ idioma }: { idioma: Idioma }) {
  if (idioma !== "de") return null;
  const nombres = new Map(obtenerListaCiudades("de").map((c) => [c.slug, c.nombre]));
  const ciudades = obtenerCiudadesConActividades("de")
    .map((slug) => ({
      slug,
      nombre: nombres.get(slug) ?? slug,
      total: obtenerListaActividadesPorCiudad("de", slug).length,
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, "de"));
  if (ciudades.length === 0) return null;
  const total = ciudades.reduce((n, c) => n + c.total, 0);

  return (
    <section aria-labelledby="aktivitaeten-deutsch" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <div className="mb-8 max-w-2xl">
        <h2 id="aktivitaeten-deutsch" className="font-fraunces text-3xl md:text-4xl font-bold text-piedra-900 mb-3">
          Aktivitäten auf Deutsch
        </h2>
        <p className="text-piedra-600 text-lg">
          {total} Touren, Führungen und Ausflüge mit deutschsprachigem Guide, Audioguide oder App – von Mallorca und
          den Kanaren bis Madrid und Barcelona.
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {ciudades.map((c) => (
          <li key={c.slug}>
            <Link
              href={urlActividadesDeCiudad("de", c.slug)}
              className="inline-flex items-center gap-2 bg-white border border-piedra-200 hover:border-anil-400 text-piedra-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
            >
              {c.nombre}
              <span className="text-piedra-500 font-normal">{c.total}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
