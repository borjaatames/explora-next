import type { ReactNode } from "react";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  texto: string | undefined;
  idioma: Idioma;
};

const ETIQUETA: Record<string, string> = {
  es: "Respuesta corta",
  en: "Short answer",
  de: "Kurz gesagt",
};

/** Convierte `**negrita**` en <strong>; el resto se muestra como texto. */
function conNegritas(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((trozo, i) =>
    trozo.startsWith("**") && trozo.endsWith("**") ? (
      <strong key={i} className="font-semibold text-slate-900">
        {trozo.slice(2, -2)}
      </strong>
    ) : (
      trozo
    )
  );
}

/**
 * Recuadro bajo el hero con la respuesta directa a la pregunta de la guía
 * (`respuestaCorta` en el frontmatter). Va encima del bloque de reservas.
 */
export default function RespuestaCorta({ texto, idioma }: Props) {
  if (!texto) return null;
  return (
    <section aria-label={ETIQUETA[idioma] ?? ETIQUETA.es} className="bg-white">
      <div className="max-w-3xl mx-auto px-4 pt-8 md:pt-10">
        <div className="border border-slate-200 rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-2">
            {ETIQUETA[idioma] ?? ETIQUETA.es}
          </p>
          <p className="text-slate-600 leading-relaxed">{conNegritas(texto)}</p>
        </div>
      </div>
    </section>
  );
}
