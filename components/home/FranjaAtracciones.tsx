import Link from "next/link";
import Image from "next/image";
import { atraccionesParaHome } from "@/lib/atracciones";
import type { Idioma } from "@/lib/i18n/types";

type TextosFranja = { titulo: string; subtitulo: string; ver: string };

const TEXTOS: Partial<Record<Idioma, TextosFranja>> = {
  es: {
    titulo: "Atracciones imprescindibles",
    subtitulo: "Entradas, visitas guiadas y todo lo que necesitas saber de cada monumento, comparado en una sola página.",
    ver: "Ver opciones",
  },
  en: {
    titulo: "Must-see attractions",
    subtitulo: "Tickets, guided tours and everything you need to know about each landmark, compared on a single page.",
    ver: "See options",
  },
};

const NOMBRE_CIUDAD: Record<string, Partial<Record<Idioma, string>>> = {
  barcelona: { es: "Barcelona", en: "Barcelona" },
  cordoba: { es: "Córdoba", en: "Córdoba" },
  granada: { es: "Granada", en: "Granada" },
  madrid: { es: "Madrid", en: "Madrid" },
  malaga: { es: "Málaga", en: "Málaga" },
  sevilla: { es: "Sevilla", en: "Seville" },
};

/** Rejilla de tarjetas (foto del hero + frase), cinco por fila en escritorio, hacia las páginas de atracción. Solo si el idioma tiene al menos 4. */
export default function FranjaAtracciones({ idioma }: { idioma: Idioma }) {
  const t = TEXTOS[idioma];
  const atracciones = atraccionesParaHome(idioma);
  if (!t || atracciones.length < 4) return null;

  return (
    <section aria-labelledby="atracciones-home" className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="mb-6 max-w-2xl">
        <h2 id="atracciones-home" className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-2">
          {t.titulo}
        </h2>
        <p className="text-piedra-600">{t.subtitulo}</p>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {atracciones.map((a) => (
          <li key={a.url}>
            <Link
              href={a.url}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-piedra-200 bg-white hover:border-anil-400 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-piedra-100">
                <Image
                  src={a.imagen}
                  alt={a.imagenAlt}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-3 md:p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-piedra-500 mb-1">
                  {NOMBRE_CIUDAD[a.ciudad]?.[idioma] ?? a.ciudad}
                </span>
                <h3 className="font-fraunces text-base md:text-lg font-bold leading-snug text-piedra-900 group-hover:text-anil-700 transition-colors mb-2">
                  {a.nombre}
                </h3>
                {a.resumen ? <p className="text-sm leading-relaxed text-piedra-600 mb-3">{a.resumen}</p> : null}
                <span className="mt-auto text-sm font-semibold text-anil-600 group-hover:text-anil-700 transition-colors">
                  {t.ver} →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
