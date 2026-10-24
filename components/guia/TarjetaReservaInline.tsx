import Link from "next/link";
import Image from "next/image";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import {
  formatearOpiniones,
  formatearPrecio,
  formatearRating,
} from "@/lib/guiasReservas";

type Props = {
  actividad: ActividadListItem;
  idioma: Idioma;
};

const TEXTOS = {
  es: {
    etiqueta: "Reserva recomendada",
    desde: "desde",
    opiniones: "opiniones",
    cancelacion: "Cancelación gratis",
    cta: "Ver disponibilidad",
  },
  en: {
    etiqueta: "Recommended booking",
    desde: "from",
    opiniones: "reviews",
    cancelacion: "Free cancellation",
    cta: "Check availability",
  },
  de: {
    etiqueta: "Empfohlene Buchung",
    desde: "ab",
    opiniones: "Bewertungen",
    cancelacion: "Kostenlose Stornierung",
    cta: "Verfügbarkeit prüfen",
  },
} as const;

function textos(idioma: Idioma) {
  if (idioma === "en") return TEXTOS.en;
  if (idioma === "de") return TEXTOS.de;
  return TEXTOS.es;
}

/**
 * Tarjeta de reserva dentro del cuerpo de una guía. Se coloca con el
 * shortcode `[actividad: slug-es]` en el markdown, justo donde el texto
 * recomienda reservar. Enlaza a la ficha propia (nunca al afiliado).
 */
export default function TarjetaReservaInline({ actividad, idioma }: Props) {
  const t = textos(idioma);
  const rating = formatearRating(actividad, idioma);
  const opiniones = formatearOpiniones(actividad, idioma);
  const slugEs = actividad.slugs?.es ?? actividad.slug;

  return (
    <aside
      className="my-8 border border-piedra-200 rounded-xl p-4 sm:p-5 bg-white flex flex-col sm:flex-row gap-4 sm:items-center"
      aria-label={t.etiqueta}
    >
      {actividad.imagen ? (
        <div className="relative w-full sm:w-32 aspect-[4/3] sm:aspect-auto sm:h-24 rounded-lg overflow-hidden bg-piedra-100 flex-none">
          <Image
            src={actividad.imagen}
            alt={actividad.imagenAlt}
            fill
            sizes="(max-width: 640px) 100vw, 128px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-anil-700 mb-1">
          {t.etiqueta}
        </p>
        <p className="font-semibold text-piedra-900 leading-snug mb-1">
          {actividad.titulo}
        </p>
        <p className="text-sm text-piedra-500">
          {rating ? (
            <>
              <span className="text-azafran-600" aria-hidden>
                ★
              </span>{" "}
              <span className="font-semibold text-piedra-900">{rating}</span>
              {opiniones ? ` · ${opiniones} ${t.opiniones}` : null}
            </>
          ) : null}
          {actividad.cancelacionGratuita ? (
            <>
              {rating ? " · " : null}
              {t.cancelacion}
            </>
          ) : null}
        </p>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 flex-none">
        <p className="text-sm text-piedra-500">
          {t.desde}{" "}
          <span className="text-lg font-bold text-piedra-900">
            {formatearPrecio(actividad, idioma)}
          </span>
        </p>
        <Link
          href={actividad.url}
          data-reserva="inline"
          data-ficha={slugEs}
          className="inline-flex items-center justify-center bg-azafran-500 hover:bg-azafran-600 text-piedra-900 font-semibold text-sm px-5 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2"
        >
          {t.cta}
        </Link>
      </div>
    </aside>
  );
}
