import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";
import { obtenerListaGuias } from "@/lib/guias";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { agruparPorTipo, ORDEN_TIPOS, type TipoGuia } from "@/lib/tiposGuia";

const TEXTOS: Record<"es" | "en" | "de", Record<TipoGuia, { titulo: string; sub: string }> & { porCiudad: string }> = {
  es: {
    excursiones: { titulo: "Excursiones de un día", sub: "Cómo ir, cuánto cuesta y si compensa en grupo o en privado." },
    agotadas: { titulo: "Entradas agotadas: qué hacer", sub: "Alternativas reales cuando no quedan entradas para los monumentos más buscados." },
    itinerarios: { titulo: "Itinerarios de 1 a 3 días", sub: "Qué ver y en qué orden para aprovechar el tiempo." },
    elegir: { titulo: "Cuál elegir", sub: "Comparativas de tours, tablaos y entradas para decidir rápido." },
    comoVisitar: { titulo: "Cómo visitar", sub: "Horarios, precios y consejos de los grandes monumentos." },
    porCiudad: "Guías por ciudad",
  },
  en: {
    excursiones: { titulo: "Day trips", sub: "How to get there, what it costs and whether group or private pays off." },
    agotadas: { titulo: "Sold-out tickets: what to do", sub: "Real alternatives when the top monuments are sold out." },
    itinerarios: { titulo: "1- to 3-day itineraries", sub: "What to see and in what order to make the most of your time." },
    elegir: { titulo: "Which one to choose", sub: "Comparisons of tours, flamenco shows and tickets to decide fast." },
    comoVisitar: { titulo: "How to visit", sub: "Opening hours, prices and tips for the great monuments." },
    porCiudad: "Guides by city",
  },
  de: {
    excursiones: { titulo: "Tagesausflüge", sub: "Anreise, Kosten und ob sich Gruppe oder privat lohnt." },
    agotadas: { titulo: "Ausverkaufte Tickets: was tun", sub: "Echte Alternativen, wenn die wichtigsten Sehenswürdigkeiten ausverkauft sind." },
    itinerarios: { titulo: "Reiserouten für 1 bis 3 Tage", sub: "Was du in welcher Reihenfolge sehen solltest." },
    elegir: { titulo: "Was wählen", sub: "Vergleiche von Touren, Flamenco-Shows und Tickets." },
    comoVisitar: { titulo: "Besichtigen", sub: "Öffnungszeiten, Preise und Tipps zu den großen Sehenswürdigkeiten." },
    porCiudad: "Reiseführer nach Stadt",
  },
};

const MAX_POR_TIPO = 12;

export function tituloPorCiudad(idioma: Idioma): string {
  return (TEXTOS[idioma as "es" | "en" | "de"] ?? TEXTOS.es).porCiudad;
}

/** Secciones del índice de guías por tipo, antes de la rejilla de ciudades. */
export default function SeccionesTipoGuia({ idioma }: { idioma: Idioma }) {
  const t = TEXTOS[idioma as "es" | "en" | "de"] ?? TEXTOS.es;
  const nombres = new Map(obtenerListaCiudades(idioma).map((c) => [c.slug, c.nombre]));
  const grupos = agruparPorTipo(
    obtenerListaGuias(idioma).sort((a, b) =>
      (b.fecha_actualizacion ?? b.fecha ?? "").localeCompare(a.fecha_actualizacion ?? a.fecha ?? "")
    )
  );

  return (
    <>
      {ORDEN_TIPOS.filter((tipo) => grupos[tipo].length > 0).map((tipo, i) => (
        <section
          key={tipo}
          aria-labelledby={`tipo-${tipo}`}
          className={i % 2 === 0 ? "border-b border-piedra-200" : "bg-piedra-50 border-b border-piedra-200"}
        >
          <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">
            <h2 id={`tipo-${tipo}`} className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900">
              {t[tipo].titulo}
            </h2>
            <p className="mt-1 mb-6 text-piedra-600">{t[tipo].sub}</p>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {grupos[tipo].slice(0, MAX_POR_TIPO).map((g) => (
                <li key={g.url}>
                  <Link
                    href={g.url}
                    className="group block h-full rounded-lg border border-piedra-200 bg-white p-4 transition-all hover:border-anil-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-anil-700">
                      {nombres.get(g.categoria) ?? g.categoria}
                    </span>
                    <span className="mt-1 block font-semibold leading-snug text-piedra-900 group-hover:text-anil-700 transition-colors">
                      {g.titulo}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </>
  );
}
