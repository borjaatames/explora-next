import Link from "next/link";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import {
  formatearOpiniones,
  formatearPrecio,
  formatearRating,
} from "@/lib/guiasReservas";

type Actual = Pick<
  ActividadListItem,
  "titulo" | "precioDesde" | "moneda" | "duracion" | "ratingProveedor" | "numeroOpiniones"
>;

type Props = {
  idioma: Idioma;
  actual: Actual;
  versiones: ActividadListItem[];
};

const TEXTOS = {
  es: {
    titulo: "Otras versiones de esta visita",
    subtitulo: "Misma actividad, distinto formato o precio.",
    estaFicha: "Estás aquí",
    desde: "desde",
    ver: "Ver",
  },
  en: {
    titulo: "Other versions of this activity",
    subtitulo: "Same activity, different format or price.",
    estaFicha: "You're here",
    desde: "from",
    ver: "View",
  },
} as const;

/**
 * Comparador corto de variantes de la misma actividad (patrón de Civitatis,
 * que enlaza «grupo reducido», «con Nazaríes», «privado» dentro de la ficha).
 * Solo se pinta con alternativas casi iguales; nunca con otras actividades.
 */
export default function OtrasVersiones({ idioma, actual, versiones }: Props) {
  if (versiones.length === 0) return null;
  const t = idioma === "es" ? TEXTOS.es : TEXTOS.en;
  const filas = versiones.slice(0, 3);

  const meta = (a: Actual) => {
    const rating = formatearRating(a, idioma);
    const opiniones = formatearOpiniones(a, idioma);
    return (
      <>
        {a.duracion}
        {rating && (
          <>
            {" · "}
            <span aria-hidden="true" className="text-azafran-500">
              ★
            </span>{" "}
            <span className="font-semibold text-piedra-900">{rating}</span>
            {opiniones ? ` (${opiniones})` : null}
          </>
        )}
      </>
    );
  };

  return (
    <section aria-labelledby="otras-versiones-titulo">
      <h2
        id="otras-versiones-titulo"
        className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-1"
      >
        {t.titulo}
      </h2>
      <p className="text-piedra-600 mb-4">{t.subtitulo}</p>
      <ul className="border border-piedra-200 rounded-lg divide-y divide-piedra-200 overflow-hidden">
        <li className="flex items-center gap-3 px-4 py-3 bg-piedra-50">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-anil-700 mb-0.5">
              {t.estaFicha}
            </p>
            <p className="font-semibold text-piedra-900 leading-snug">{actual.titulo}</p>
            <p className="text-xs text-piedra-500 mt-0.5">{meta(actual)}</p>
          </div>
          <p className="flex-none text-right text-sm text-piedra-600">
            {t.desde}{" "}
            <span className="block text-base font-bold text-piedra-900">
              {formatearPrecio(actual, idioma)}
            </span>
          </p>
        </li>
        {filas.map((v) => (
          <li key={v.url}>
            <Link
              href={v.url}
              prefetch={false}
              className="group flex items-center gap-3 px-4 py-3 hover:bg-piedra-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-inset"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-piedra-900 leading-snug group-hover:text-anil-700 transition-colors">
                  {v.titulo}
                </p>
                <p className="text-xs text-piedra-500 mt-0.5">{meta(v)}</p>
              </div>
              <p className="flex-none text-right text-sm text-piedra-600">
                {t.desde}{" "}
                <span className="block text-base font-bold text-piedra-900">
                  {formatearPrecio(v, idioma)}
                </span>
              </p>
              <span aria-hidden="true" className="flex-none text-anil-600 group-hover:text-anil-700">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
