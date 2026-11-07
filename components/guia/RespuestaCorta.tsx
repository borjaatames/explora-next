import Link from "next/link";
import type { ReactNode } from "react";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  texto: string | undefined;
  idioma: Idioma;
  /** YYYY-MM-DD de la última comprobación en fuentes oficiales. */
  comprobado?: string;
  /** Dentro de la columna de lectura de la guía: sin contenedor propio. */
  enColumna?: boolean;
};

const COMPROBADO: Record<Idioma, string> = {
  es: "Precios y horarios comprobados en fuentes oficiales el",
  en: "Prices and opening hours checked against official sources on",
  de: "Preise und Öffnungszeiten in offiziellen Quellen geprüft am",
  fr: "Prix et horaires vérifiés auprès des sources officielles le",
  it: "Prezzi e orari verificati sulle fonti ufficiali il",
  pt: "Preços e horários confirmados em fontes oficiais a",
};

const LOCALE: Record<Idioma, string> = {
  es: "es-ES",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
};

function fechaLarga(iso: string, idioma: Idioma): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(LOCALE[idioma], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const ETIQUETA: Record<Idioma, string> = {
  es: "Respuesta corta",
  en: "Short answer",
  de: "Kurz gesagt",
  fr: "En bref",
  it: "In breve",
  pt: "Resposta curta",
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
    .replace(/`([^`]+)`/g, "$1")
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
export default function RespuestaCorta({ texto, idioma, comprobado, enColumna = false }: Props) {
  if (!texto) return null;
  return (
    <section aria-label={ETIQUETA[idioma]} className="bg-white">
      <div className={enColumna ? "" : "max-w-3xl mx-auto px-4 pt-5 md:pt-10"}>
        <div className="border border-piedra-200 rounded-lg p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-anil-700 mb-2">
            {ETIQUETA[idioma]}
          </p>
          <p className="text-piedra-600 leading-relaxed">{formatear(texto)}</p>
          {comprobado && (
            <p className="mt-3 text-sm text-piedra-500">
              <span className="text-cobre-600" aria-hidden="true">✓</span>{" "}
              {COMPROBADO[idioma]}{" "}
              <time dateTime={comprobado}>{fechaLarga(comprobado, idioma)}</time>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
