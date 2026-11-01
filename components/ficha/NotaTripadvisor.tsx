import type { DatosTripadvisor } from "@/lib/tripadvisor";
import { textoRankingTripadvisor } from "@/lib/tripadvisor";
import type { Idioma } from "@/lib/i18n/types";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";

const OPINIONES: Record<Idioma, string> = {
  es: "opiniones",
  en: "reviews",
  de: "Bewertungen",
  fr: "avis",
  it: "recensioni",
  pt: "avaliações",
};

type Props = {
  idioma: Idioma;
  datos: DatosTripadvisor | null;
};

/**
 * Resumen de Tripadvisor del proveedor (dato que Bókun da al revendedor),
 * siempre atribuido a Tripadvisor. Es la ficha de Tripadvisor que el
 * proveedor tiene vinculada en Bókun (a veces del operador, a veces del tour).
 */
export default function NotaTripadvisor({ idioma, datos }: Props) {
  if (!datos) return null;
  const locale = idioma === "en" ? "en-GB" : IDIOMA_LOCALE[idioma];
  const nota = datos.rating.toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const opiniones = datos.opiniones.toLocaleString(locale);
  const ranking = textoRankingTripadvisor(datos.ranking, idioma);

  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-piedra-600">
      <span className="font-semibold text-piedra-900">Tripadvisor</span>
      <span className="inline-flex items-center gap-1">
        <span aria-hidden="true" className="text-azafran-500">
          ★
        </span>
        <span className="font-semibold text-piedra-900">{nota}</span>
      </span>
      <span aria-hidden="true" className="text-piedra-400">
        ·
      </span>
      {/* Enlaza a las reseñas con texto del final de la ficha (#opiniones). */}
      <a
        href="#opiniones"
        className="underline decoration-piedra-300 underline-offset-2 hover:text-anil-700 hover:decoration-anil-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded-sm"
      >
        {`${opiniones} ${OPINIONES[idioma]}`}
      </a>
      {ranking && (
        <>
          <span aria-hidden="true" className="text-piedra-400">
            ·
          </span>
          <span>{ranking}</span>
        </>
      )}
    </p>
  );
}
