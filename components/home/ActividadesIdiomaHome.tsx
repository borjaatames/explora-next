import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";
import { obtenerCiudadesConActividades, obtenerListaActividadesPorCiudad } from "@/lib/actividades";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { urlActividadesDeCiudad } from "@/lib/i18n/utils";

type IdiomaSecundario = "de" | "fr" | "it" | "pt";

const TEXTOS: Record<IdiomaSecundario, { titulo: string; descripcion: (total: number) => string }> = {
  de: {
    titulo: "Aktivitäten auf Deutsch",
    descripcion: (total) =>
      `${total} Touren, Führungen und Ausflüge mit deutschsprachigem Guide, Audioguide oder App – von Mallorca und den Kanaren bis Madrid und Barcelona.`,
  },
  fr: {
    titulo: "Activités en français",
    descripcion: (total) =>
      `${total} visites, tours et excursions avec guide francophone, audioguide ou application, ville par ville.`,
  },
  it: {
    titulo: "Attività in italiano",
    descripcion: (total) =>
      `${total} visite, tour ed escursioni con guida in italiano, audioguida o app, città per città.`,
  },
  pt: {
    titulo: "Atividades em português",
    descripcion: (total) =>
      `${total} visitas, tours e excursões com guia em português, audioguia ou aplicação, cidade a cidade.`,
  },
};

function esIdiomaSecundario(idioma: Idioma): idioma is IdiomaSecundario {
  return idioma === "de" || idioma === "fr" || idioma === "it" || idioma === "pt";
}

/**
 * Portada DE/FR/IT/PT: ciudades con actividades que se hacen en ese idioma
 * (las únicas que tienen ficha en él), con su número, de más a menos.
 */
export default function ActividadesIdiomaHome({ idioma }: { idioma: Idioma }) {
  if (!esIdiomaSecundario(idioma)) return null;
  const t = TEXTOS[idioma];
  const nombres = new Map(obtenerListaCiudades(idioma).map((c) => [c.slug, c.nombre]));
  const ciudades = obtenerCiudadesConActividades(idioma)
    .map((slug) => ({
      slug,
      nombre: nombres.get(slug) ?? slug,
      total: obtenerListaActividadesPorCiudad(idioma, slug).length,
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, idioma));
  if (ciudades.length === 0) return null;
  const total = ciudades.reduce((n, c) => n + c.total, 0);

  return (
    <section aria-labelledby="actividades-idioma" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <div className="mb-8 max-w-2xl">
        <h2 id="actividades-idioma" className="font-fraunces text-3xl md:text-4xl font-bold text-piedra-900 mb-3">
          {t.titulo}
        </h2>
        <p className="text-piedra-600 text-lg">{t.descripcion(total)}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {ciudades.map((c) => (
          <li key={c.slug}>
            <Link
              href={urlActividadesDeCiudad(idioma, c.slug)}
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
