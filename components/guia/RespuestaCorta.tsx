import Link from "next/link";
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

const NEGRITA = /^\*\*([^*]+)\*\*$/;
const ENLACE = /^\[([^\]]+)\]\((\/[^)\s]*)\)$/;

/**
 * Convierte `**negrita**` en <strong> y `[texto](/ruta)` (también
 * `[**texto**](/ruta)`) en enlace interno a la ficha. Solo rutas internas:
 * cualquier otra cosa se muestra como texto.
 */
function formatear(texto: string): ReactNode[] {
  return texto
    .split(/(\[[^\]]+\]\(\/[^)\s]*\)|\*\*[^*]+\*\*)/g)
    .filter((trozo) => trozo !== "")
    .map((trozo, i) => {
      const enlace = ENLACE.exec(trozo);
      if (enlace) {
        const etiqueta = enlace[1].replace(/\*\*/g, "");
        return (
          <Link
            key={i}
            href={enlace[2]}
            className="font-semibold text-anil-700 underline decoration-anil-300 underline-offset-2 hover:text-anil-900 hover:decoration-anil-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded-sm"
          >
            {etiqueta}
          </Link>
        );
      }
      const negrita = NEGRITA.exec(trozo);
      if (negrita) {
        return (
          <strong key={i} className="font-semibold text-piedra-900">
            {negrita[1]}
          </strong>
        );
      }
      return trozo;
    });
}

/**
 * Recuadro bajo el hero con la respuesta directa a la pregunta de la guía
 * (`respuestaCorta` en el frontmatter). Va encima del bloque de reservas.
 */
export default function RespuestaCorta({ texto, idioma, comprobado }: Props) {
  if (!texto) return null;
  return (
    <section aria-label={ETIQUETA[idioma] ?? ETIQUETA.es} className="bg-white">
      <div className="max-w-3xl mx-auto px-4 pt-5 md:pt-10">
        <div className="border border-piedra-200 rounded-lg p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-anil-700 mb-2">
            {ETIQUETA[idioma] ?? ETIQUETA.es}
          </p>
          <p className="text-piedra-600 leading-relaxed">{formatear(texto)}</p>
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
