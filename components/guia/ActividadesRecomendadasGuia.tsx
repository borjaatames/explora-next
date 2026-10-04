import Link from "next/link";
import Image from "next/image";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  actividades: ActividadListItem[];
  idioma: Idioma;
  nombreCiudad: string;
  urlTodas: string;
};

type Textos = {
  etiqueta: string;
  titulo: (ciudad: string) => string;
  subtitulo: string;
  deslizar: string;
  desde: string;
  opiniones: string;
  verTodas: (ciudad: string) => string;
  localePrecio: string;
  localeNumero: string;
};

const TEXTOS: Record<"es" | "en" | "de", Textos> = {
  es: {
    etiqueta: "Planifica tu visita",
    titulo: (c) => `Actividades recomendadas en ${c}`,
    subtitulo: "Las experiencias mejor valoradas, seleccionadas por la redacción.",
    deslizar: "Desliza para ver más →",
    desde: "Desde",
    opiniones: "opiniones",
    verTodas: (c) => `Ver todas las actividades en ${c} →`,
    localePrecio: "es-ES",
    localeNumero: "es-ES",
  },
  en: {
    etiqueta: "Plan your visit",
    titulo: (c) => `Recommended activities in ${c}`,
    subtitulo: "The top-rated experiences, hand-picked by our editors.",
    deslizar: "Swipe to see more →",
    desde: "From",
    opiniones: "reviews",
    verTodas: (c) => `See all activities in ${c} →`,
    localePrecio: "en-US",
    localeNumero: "en-US",
  },
  de: {
    etiqueta: "Besuch planen",
    titulo: (c) => `Empfohlene Aktivitäten in ${c}`,
    subtitulo: "Die bestbewerteten Erlebnisse, von unserer Redaktion ausgewählt.",
    deslizar: "Wischen, um mehr zu sehen →",
    desde: "Ab",
    opiniones: "Bewertungen",
    verTodas: (c) => `Alle Aktivitäten in ${c} ansehen →`,
    localePrecio: "de-DE",
    localeNumero: "de-DE",
  },
};

function textos(idioma: Idioma): Textos {
  if (idioma === "en") return TEXTOS.en;
  if (idioma === "de") return TEXTOS.de;
  return TEXTOS.es;
}

/**
 * Carrusel de actividades al pie de una guía editorial. Enlaza solo a fichas
 * propias (nunca a afiliados). Scroll horizontal con snap en todos los
 * tamaños: 6 tarjetas no caben en una fila de max-w-5xl sin encogerlas.
 */
export default function ActividadesRecomendadasGuia({
  actividades,
  idioma,
  nombreCiudad,
  urlTodas,
}: Props) {
  if (actividades.length === 0) return null;
  const t = textos(idioma);

  return (
    <section
      aria-labelledby="actividades-recomendadas-titulo"
      className="border-t border-slate-200"
    >
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
          {t.etiqueta}
        </span>
        <h2
          id="actividades-recomendadas-titulo"
          className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-2"
        >
          {t.titulo(nombreCiudad)}
        </h2>
        <p className="text-slate-600 mb-6">{t.subtitulo}</p>

        <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-4 scrollbar-hide">
          {actividades.map((actividad) => (
            <li key={actividad.url} className="flex-none w-64 snap-start">
              <TarjetaActividad actividad={actividad} t={t} />
            </li>
          ))}
        </ul>
        {actividades.length > 3 && (
          <p className="text-sm text-slate-500 mt-1">{t.deslizar}</p>
        )}

        <div className="mt-6">
          <Link
            href={urlTodas}
            className="inline-flex items-center text-sky-600 hover:text-sky-700 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
          >
            {t.verTodas(nombreCiudad)}
          </Link>
        </div>
      </div>
    </section>
  );
}

function TarjetaActividad({
  actividad,
  t,
}: {
  actividad: ActividadListItem;
  t: Textos;
}) {
  const precio = new Intl.NumberFormat(t.localePrecio, {
    style: "currency",
    currency: actividad.moneda,
    maximumFractionDigits: 0,
  }).format(actividad.precioDesde);

  const rating =
    actividad.ratingProveedor !== undefined
      ? actividad.ratingProveedor.toLocaleString(t.localeNumero, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : null;

  return (
    <Link
      href={actividad.url}
      className="group flex h-full flex-col bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-sky-400 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
    >
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        {actividad.imagen ? (
          <Image
            src={actividad.imagen}
            alt={actividad.imagenAlt}
            fill
            sizes="256px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-playfair text-base font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3em] group-hover:text-sky-700 transition-colors">
          {actividad.titulo}
        </h3>
        <p className="text-xs text-slate-500 mb-3 truncate">
          {actividad.duracion}
          {rating && (
            <>
              {" · "}
              <span className="text-amber-500" aria-hidden>
                ★
              </span>{" "}
              <span className="font-semibold text-slate-900">{rating}</span>
              {actividad.numeroOpiniones ? (
                <>
                  {" "}
                  ({actividad.numeroOpiniones.toLocaleString(t.localeNumero)}{" "}
                  <span className="sr-only">{t.opiniones}</span>)
                </>
              ) : null}
            </>
          )}
        </p>
        <p className="mt-auto text-sm text-slate-600">
          {t.desde}{" "}
          <span className="font-bold text-slate-900">{precio}</span>
        </p>
      </div>
    </Link>
  );
}
