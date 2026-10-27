import type { ReactNode } from "react";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  texto: string | undefined;
  idioma: Idioma;
  /** YYYY-MM-DD de la última comprobación en fuentes oficiales. */
  comprobado?: string;
};

const COMPROBADO: Record<string, string> = {
  es: "Precios y horarios comprobados en fuentes oficiales el",
  en: "Prices and opening hours checked against official sources on",
  de: "Preise und Öffnungszeiten in offiziellen Quellen geprüft am",
};

const LOCALE: Record<string, string> = { es: "es-ES", en: "en-GB", de: "de-DE" };

function fechaLarga(iso: string, idioma: Idioma): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(LOCALE[idioma] ?? "es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const ETIQUETA: Record<string, string> = {
  es: "Respuesta corta",
  en: "Short answer",
  de: "Kurz gesagt",
};

/** Convierte `**negrita**` en <strong>; el resto se muestra como texto. */
function conNegritas(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((trozo, i) =>
    trozo.startsWith("**") && trozo.endsWith("**") ? (
      <strong key={i} className="font-semibold text-piedra-900">
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
export default function RespuestaCorta({ texto, idioma, comprobado }: Props) {
  if (!texto) return null;
  return (
    <section aria-label={ETIQUETA[idioma] ?? ETIQUETA.es} className="bg-white">
      <div className="max-w-3xl mx-auto px-4 pt-8 md:pt-10">
        <div className="border border-piedra-200 rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-anil-700 mb-2">
            {ETIQUETA[idioma] ?? ETIQUETA.es}
          </p>
          <p className="text-piedra-600 leading-relaxed">{conNegritas(texto)}</p>
          {comprobado && (
            <p className="mt-3 text-sm text-piedra-500">
              <span className="text-cobre-600" aria-hidden="true">✓</span>{" "}
              {COMPROBADO[idioma] ?? COMPROBADO.es}{" "}
              <time dateTime={comprobado}>{fechaLarga(comprobado, idioma)}</time>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
