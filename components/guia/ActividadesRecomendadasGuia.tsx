import Link from "next/link";
import Image from "next/image";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";

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
};

const TEXTOS: Record<Idioma, Textos> = {
  es: {
    etiqueta: "Planifica tu visita",
    titulo: (c) => `Actividades recomendadas en ${c}`,
    subtitulo: "Las experiencias mejor valoradas, seleccionadas por la redacción.",
    deslizar: "Desliza para ver más →",
    desde: "Desde",
    opiniones: "opiniones",
    verTodas: (c) => `Ver todas las actividades en ${c} →`,
  },
  en: {
    etiqueta: "Plan your visit",
    titulo: (c) => `Recommended activities in ${c}`,
    subtitulo: "The top-rated experiences, hand-picked by our editors.",
    deslizar: "Swipe to see more →",
    desde: "From",
    opiniones: "reviews",
    verTodas: (c) => `See all activities in ${c} →`,
  },
  de: {
    etiqueta: "Besuch planen",
    titulo: (c) => `Empfohlene Aktivitäten in ${c}`,
    subtitulo: "Die bestbewerteten Erlebnisse, von unserer Redaktion ausgewählt.",
    deslizar: "Wischen, um mehr zu sehen →",
    desde: "Ab",
    opiniones: "Bewertungen",
    verTodas: (c) => `Alle Aktivitäten in ${c} ansehen →`,
  },
  fr: {
    etiqueta: "Préparez votre visite",
    titulo: (c) => `Activités recommandées à ${c}`,
    subtitulo: "Les expériences les mieux notées, sélectionnées par notre rédaction.",
    deslizar: "Faites défiler pour en voir plus →",
    desde: "À partir de",
    opiniones: "avis",
    verTodas: (c) => `Voir toutes les activités à ${c} →`,
  },
  it: {
    etiqueta: "Pianifica la tua visita",
    titulo: (c) => `Attività consigliate a ${c}`,
    subtitulo: "Le esperienze più apprezzate, selezionate dalla nostra redazione.",
    deslizar: "Scorri per vederne altre →",
    desde: "Da",
    opiniones: "recensioni",
    verTodas: (c) => `Vedi tutte le attività a ${c} →`,
  },
  pt: {
    etiqueta: "Planeie a sua visita",
    titulo: (c) => `Atividades recomendadas em ${c}`,
    subtitulo: "As experiências mais bem avaliadas, selecionadas pela nossa redação.",
    deslizar: "Deslize para ver mais →",
    desde: "Desde",
    opiniones: "avaliações",
    verTodas: (c) => `Ver todas as atividades em ${c} →`,
  },
};

const TEXTOS_FICHA: Record<Idioma, Pick<Textos, "etiqueta" | "titulo" | "subtitulo">> = {
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
  fr: {
    etiqueta: "Alternatives",
    titulo: (c) => `Activités similaires à ${c}`,
    subtitulo: "Des options bien notées, au cas où celle-ci ne conviendrait pas à vos projets.",
  },
  it: {
    etiqueta: "Alternative",
    titulo: (c) => `Attività simili a ${c}`,
    subtitulo: "Opzioni con buone recensioni, nel caso questa non si adatti ai tuoi piani.",
  },
  pt: {
    etiqueta: "Alternativas",
    titulo: (c) => `Atividades semelhantes em ${c}`,
    subtitulo: "Opções bem avaliadas, caso esta não se adapte aos seus planos.",
  },
};

function textos(idioma: Idioma, variante: "guia" | "ficha" = "guia"): Textos {
  return variante === "ficha"
    ? { ...TEXTOS[idioma], ...TEXTOS_FICHA[idioma] }
    : TEXTOS[idioma];
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
              <TarjetaActividad actividad={actividad} t={t} locale={IDIOMA_LOCALE[idioma]} />
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
  locale,
}: {
  actividad: ActividadListItem;
  t: Textos;
  locale: string;
}) {
  const precio = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: actividad.moneda,
    maximumFractionDigits: 0,
  }).format(actividad.precioDesde);

  const rating =
    actividad.ratingProveedor !== undefined
      ? actividad.ratingProveedor.toLocaleString(locale, {
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
                  ({actividad.numeroOpiniones.toLocaleString(locale)}{" "}
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
