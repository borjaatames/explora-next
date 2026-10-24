import Link from "next/link";
import Image from "next/image";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  actividades: ActividadListItem[];
  idioma: Idioma;
  nombreCiudad: string;
  urlTodas: string;
  /** "ficha": textos para el pie de una ficha («otras actividades parecidas»). */
  variante?: "guia" | "ficha";
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

const TEXTOS_FICHA: Record<"es" | "en" | "de", Pick<Textos, "etiqueta" | "titulo" | "subtitulo">> = {
  es: {
    etiqueta: "Alternativas",
    titulo: (c) => `Otras actividades parecidas en ${c}`,
    subtitulo: "Opciones con buenas opiniones por si esta no encaja con tu plan.",
  },
  en: {
    etiqueta: "Alternatives",
    titulo: (c) => `Similar activities in ${c}`,
    subtitulo: "Well-reviewed options in case this one doesn't fit your plans.",
  },
  de: {
    etiqueta: "Alternativen",
    titulo: (c) => `Ähnliche Aktivitäten in ${c}`,
    subtitulo: "Gut bewertete Optionen, falls diese nicht zu deinen Plänen passt.",
  },
};

function textos(idioma: Idioma, variante: "guia" | "ficha" = "guia"): Textos {
  const clave = idioma === "en" || idioma === "de" ? idioma : "es";
  return variante === "ficha"
    ? { ...TEXTOS[clave], ...TEXTOS_FICHA[clave] }
    : TEXTOS[clave];
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
  variante = "guia",
}: Props) {
  if (actividades.length === 0) return null;
  const t = textos(idioma, variante);

  return (
    <section
      aria-labelledby="actividades-recomendadas-titulo"
      className="border-t border-piedra-200"
    >
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <span className="inline-block bg-anil-100 text-anil-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
          {t.etiqueta}
        </span>
        <h2
          id="actividades-recomendadas-titulo"
          className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-2"
        >
          {t.titulo(nombreCiudad)}
        </h2>
        <p className="text-piedra-600 mb-6">{t.subtitulo}</p>

        <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-4 scrollbar-hide">
          {actividades.map((actividad) => (
            <li key={actividad.url} className="relative flex-none w-64 snap-start">
              <TarjetaActividad actividad={actividad} t={t} />
            </li>
          ))}
        </ul>
        {actividades.length > 3 && (
          <p className="text-sm text-piedra-500 mt-1">{t.deslizar}</p>
        )}

        <div className="mt-6">
          <Link
            href={urlTodas}
            prefetch={false}
            className="inline-flex items-center text-anil-600 hover:text-anil-700 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded"
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
      prefetch={false}
      data-reserva="carrusel"
      data-ficha={actividad.slugs?.es ?? actividad.slug}
      className="group flex h-full flex-col bg-white border border-piedra-200 rounded-lg overflow-hidden hover:border-anil-400 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
    >
      <div className="relative w-full aspect-[4/3] bg-piedra-100 overflow-hidden">
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
        <h3 className="font-fraunces text-base font-bold text-piedra-900 mb-2 line-clamp-2 min-h-[3em] group-hover:text-anil-700 transition-colors">
          {actividad.titulo}
        </h3>
        <p className="text-xs text-piedra-500 mb-3 truncate">
          {actividad.duracion}
          {rating && (
            <>
              {" · "}
              <span className="text-azafran-600" aria-hidden>
                ★
              </span>{" "}
              <span className="font-semibold text-piedra-900">{rating}</span>
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
        <p className="mt-auto text-sm text-piedra-600">
          {t.desde}{" "}
          <span className="font-bold text-piedra-900">{precio}</span>
        </p>
      </div>
    </Link>
  );
}
