import Link from "next/link";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import {
  formatearOpiniones,
  formatearPrecio,
  formatearRating,
} from "@/lib/guiasReservas";

type Props = {
  actividades: ActividadListItem[];
  idioma: Idioma;
};

const TEXTOS = {
  es: {
    titulo: "Lo que conviene reservar antes de ir",
    subtitulo: (n: number) =>
      n === 1 ? "La reserva clave de esta guía" : `Las ${n} reservas clave de esta guía`,
    cancelacion: "cancelación gratis",
    cta: "Reservar",
    aria: "Reservas recomendadas",
  },
  en: {
    titulo: "What to book before you go",
    subtitulo: (n: number) =>
      n === 1 ? "The key booking for this guide" : `The ${n} key bookings for this guide`,
    cancelacion: "free cancellation",
    cta: "Book",
    aria: "Recommended bookings",
  },
  de: {
    titulo: "Was du vorab buchen solltest",
    subtitulo: (n: number) =>
      n === 1
        ? "Die wichtigste Buchung für diesen Reiseführer"
        : `Die ${n} wichtigsten Buchungen für diesen Reiseführer`,
    cancelacion: "kostenlose Stornierung",
    cta: "Buchen",
    aria: "Empfohlene Buchungen",
  },
} as const;

function textos(idioma: Idioma) {
  if (idioma === "en") return TEXTOS.en;
  if (idioma === "de") return TEXTOS.de;
  return TEXTOS.es;
}

/**
 * Checklist de reservas bajo el hero, para guías de itinerario
 * (`reservasArriba: true` en el frontmatter). Muestra como máximo 4 fichas,
 * las primeras del campo `actividades:` de la guía.
 */
export default function ReservasGuia({ actividades, idioma }: Props) {
  if (actividades.length === 0) return null;
  const t = textos(idioma);

  return (
    <section
      aria-label={t.aria}
      className="bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
          <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
            {t.titulo}
          </h2>
          <p className="text-sm text-slate-500">{t.subtitulo(actividades.length)}</p>
        </div>
        <ol className="flex flex-col gap-2">
          {actividades.map((a, i) => {
            const rating = formatearRating(a, idioma);
            const opiniones = formatearOpiniones(a, idioma);
            const slugEs = a.slugs?.es ?? a.slug;
            return (
              <li
                key={a.url}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4 bg-white border border-slate-200 rounded-lg px-3 py-3 sm:px-4"
              >
                <span
                  className="flex-none w-7 h-7 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-[12rem]">
                  <Link
                    href={a.url}
                    className="block font-semibold text-slate-900 hover:text-sky-700 transition-colors leading-snug"
                    data-reserva="top"
                    data-ficha={slugEs}
                  >
                    {a.titulo}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {rating ? (
                      <>
                        <span className="text-amber-500" aria-hidden>
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
                </div>
                <div className="ml-auto flex items-center gap-3 sm:gap-4">
                <span className="flex-none font-bold text-slate-900 text-sm sm:text-base">
                  {formatearPrecio(a, idioma)}
                </span>
                <Link
                  href={a.url}
                  data-reserva="top"
                  data-ficha={slugEs}
                  className="flex-none inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-2.5 min-h-[44px] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
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
