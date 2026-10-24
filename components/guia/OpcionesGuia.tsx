import Link from "next/link";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import {
  formatearOpiniones,
  formatearPrecio,
  formatearRating,
} from "@/lib/guiasReservas";

export type OpcionGuia = {
  /** Etiqueta editorial de la opción («La más barata», «Con guía»…). */
  etiqueta: string;
  actividad: ActividadListItem;
};

type Props = {
  opciones: OpcionGuia[];
  idioma: Idioma;
};

const TEXTOS = {
  es: {
    titulo: (n: number) => `Nuestras ${n} opciones`,
    subtitulo: "Elige según tu presupuesto y cómo quieres visitarlo",
    cancelacion: "Cancelación gratis",
    cta: "Ver disponibilidad",
    aria: "Opciones recomendadas para reservar",
  },
  en: {
    titulo: (n: number) => `Our ${n} picks`,
    subtitulo: "Choose by budget and how you want to visit",
    cancelacion: "Free cancellation",
    cta: "Check availability",
    aria: "Recommended options to book",
  },
  de: {
    titulo: (n: number) => `Unsere ${n} Empfehlungen`,
    subtitulo: "Wähle nach Budget und Art des Besuchs",
    cancelacion: "Kostenlose Stornierung",
    cta: "Verfügbarkeit prüfen",
    aria: "Empfohlene Buchungsoptionen",
  },
} as const;

function textos(idioma: Idioma) {
  if (idioma === "en") return TEXTOS.en;
  if (idioma === "de") return TEXTOS.de;
  return TEXTOS.es;
}

/**
 * Bloque «Nuestras 3 opciones» bajo la respuesta corta en guías de un solo
 * monumento (`opciones:` en el frontmatter). Cada tarjeta lleva una etiqueta
 * editorial que dice para quién es, para que el lector elija en segundos.
 * Los clics se miden como `click_reserva` con `posicion = opciones`.
 */
export default function OpcionesGuia({ opciones, idioma }: Props) {
  if (opciones.length === 0) return null;
  const t = textos(idioma);

  return (
    <section aria-label={t.aria} className="bg-piedra-50 border-b border-piedra-200">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="mb-5">
          <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900">
            {t.titulo(opciones.length)}
          </h2>
          <p className="text-sm text-piedra-500 mt-1">{t.subtitulo}</p>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opciones.map(({ etiqueta, actividad: a }) => {
            const rating = formatearRating(a, idioma);
            const opiniones = formatearOpiniones(a, idioma);
            const slugEs = a.slugs?.es ?? a.slug;
            return (
              <li
                key={a.url}
                className="flex flex-col bg-white border border-piedra-200 rounded-lg p-4 hover:border-anil-400 hover:shadow-md transition-all"
              >
                <span className="self-start inline-block bg-anil-100 text-anil-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                  {etiqueta}
                </span>
                <Link
                  href={a.url}
                  data-reserva="opciones"
                  data-ficha={slugEs}
                  className="font-semibold text-piedra-900 hover:text-anil-700 transition-colors leading-snug"
                >
                  {a.titulo}
                </Link>
                <p className="text-xs text-piedra-500 mt-1">
                  {rating ? (
                    <>
                      <span className="text-azafran-600" aria-hidden>
                        ★
                      </span>{" "}
                      {rating}
                      {opiniones ? ` (${opiniones})` : null}
                    </>
                  ) : null}
                  {a.cancelacionGratuita ? (
                    <>
                      {rating ? " · " : null}
                      {t.cancelacion}
                    </>
                  ) : null}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                  <span className="font-bold text-piedra-900">
                    {formatearPrecio(a, idioma)}
                  </span>
                  <Link
                    href={a.url}
                    data-reserva="opciones"
                    data-ficha={slugEs}
                    className="inline-flex items-center justify-center bg-azafran-500 hover:bg-azafran-600 text-piedra-900 font-semibold text-sm px-4 py-2.5 min-h-[44px] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2"
                  >
                    {t.cta}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
