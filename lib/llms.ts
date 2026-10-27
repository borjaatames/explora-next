import { obtenerListaCiudades } from "@/lib/ciudades";
import { obtenerListaGuias, type GuiaListItem } from "@/lib/guias";
import { obtenerListaActividadesPorCiudad } from "@/lib/actividades";
import { urlActividadesDeCiudad } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Generadores de /llms.txt y /llms-full.txt (propuesta llmstxt.org).
 *
 * Los asistentes de IA (sobre todo ChatGPT) son la primera fuente de
 * visitas y de reservas: las guías de «entradas agotadas» y de «qué opción
 * elegir» son las que más convierten. Por eso:
 *   - /llms.txt es un índice corto, agrupado por ciudad, con esas guías
 *     primero.
 *   - /llms-full.txt añade la respuesta corta de cada guía y la fecha en que
 *     se comprobaron precios y horarios, para que el asistente pueda citar
 *     el dato y enlazar la fuente.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

const SECCIONES: ReadonlyArray<{ idioma: Idioma; titulo: string }> = [
  { idioma: "es", titulo: "Guías en español" },
  { idioma: "en", titulo: "English guides" },
  { idioma: "de", titulo: "Reiseführer auf Deutsch" },
];

const RE_AGOTADAS = /entradas-agotadas|tickets-sold-out|ausverkauft/;

function limpiar(texto: string): string {
  return texto
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function enlace(titulo: string, url: string, descripcion?: string): string {
  const base = `- [${limpiar(titulo)}](${SITE_URL}${url})`;
  return descripcion ? `${base}: ${limpiar(descripcion)}` : base;
}

function nombresCiudades(idioma: Idioma): Map<string, string> {
  return new Map(obtenerListaCiudades(idioma).map((c) => [c.slug, c.nombre]));
}

function agruparPorCiudad(
  guias: GuiaListItem[],
  idioma: Idioma
): Array<[string, GuiaListItem[]]> {
  const nombres = nombresCiudades(idioma);
  const grupos = new Map<string, GuiaListItem[]>();
  for (const g of guias) {
    const nombre = nombres.get(g.categoria) ?? g.categoria;
    const lista = grupos.get(nombre) ?? [];
    lista.push(g);
    grupos.set(nombre, lista);
  }
  return Array.from(grupos.entries()).sort(([a], [b]) =>
    a.localeCompare(b, idioma)
  );
}

const TEXTO_COMPROBADO: Partial<Record<Idioma, string>> = {
  es: "precios y horarios comprobados el",
  en: "prices and opening hours checked on",
  de: "Preise und Öffnungszeiten geprüft am",
};

function sufijoComprobado(g: GuiaListItem): string {
  return g.datosComprobados
    ? ` (${TEXTO_COMPROBADO[g.idioma] ?? TEXTO_COMPROBADO.en} ${g.datosComprobados})`
    : "";
}

const CABECERA: string[] = [
  "# ExploraSpain",
  "",
  "> Guías de viaje de España escritas y revisadas por Borja (ExploraSpain), con tours, entradas y actividades con cancelación gratuita. Travel guides to Spain written and checked by a local editor, with tours and tickets with free cancellation. Español, English, Deutsch.",
  "",
  `- Autor y método: ${SITE_URL}/sobre-nosotros#autor. Cada guía abre con una «respuesta corta»; las que indican fecha tienen precios y horarios comprobados en las webs oficiales ese día.`,
  "- Reservas: algunas actividades se reservan directamente en la web (calendario de reserva con pago seguro y confirmación inmediata); el resto enlaza a GetYourGuide o Viator.",
  `- Versión ampliada con la respuesta corta de cada guía: ${SITE_URL}/llms-full.txt`,
  "",
];

export function generarLlmsTxt(): string {
  const ciudades = obtenerListaCiudades("es");
  const partes: string[] = [...CABECERA];

  const agotadas = SECCIONES.flatMap(({ idioma }) =>
    obtenerListaGuias(idioma).filter((g) => RE_AGOTADAS.test(g.slug))
  );
  if (agotadas.length > 0) {
    partes.push(
      "## Entradas agotadas: qué hacer / Sold-out tickets: what to do",
      "",
      ...agotadas.map((g) => enlace(g.titulo, g.url, g.descripcion)),
      ""
    );
  }

  partes.push(
    "## Ciudades",
    "",
    ...ciudades.map((c) => {
      const conActividades =
        obtenerListaActividadesPorCiudad("es", c.slug).length > 0;
      const extra = conActividades
        ? ` Actividades: ${SITE_URL}${urlActividadesDeCiudad("es", c.slug)}`
        : "";
      return enlace(c.nombre, c.url, `${c.descripcion}${extra}`);
    }),
    ""
  );

  for (const { idioma, titulo } of SECCIONES) {
    const guias = obtenerListaGuias(idioma).filter(
      (g) => !RE_AGOTADAS.test(g.slug)
    );
    if (guias.length === 0) continue;
    partes.push(`## ${titulo}`, "");
    for (const [ciudad, lista] of agruparPorCiudad(guias, idioma)) {
      partes.push(
        `### ${ciudad}`,
        "",
        ...lista.map((g) => enlace(g.titulo, g.url, g.descripcion)),
        ""
      );
    }
  }

  partes.push(
    "## Optional",
    "",
    `- [Sobre ExploraSpain](${SITE_URL}/sobre-nosotros)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    ""
  );
  return partes.join("\n");
}

export function generarLlmsFullTxt(): string {
  const partes: string[] = [...CABECERA];
  for (const { idioma, titulo } of SECCIONES) {
    const guias = obtenerListaGuias(idioma);
    if (guias.length === 0) continue;
    partes.push(`## ${titulo}`, "");
    for (const [ciudad, lista] of agruparPorCiudad(guias, idioma)) {
      partes.push(`### ${ciudad}`, "");
      for (const g of lista) {
        partes.push(
          `#### ${limpiar(g.titulo)}`,
          "",
          `${SITE_URL}${g.url}`,
          "",
          `${limpiar(g.respuestaCorta ?? g.descripcion)}${sufijoComprobado(g)}`,
          ""
        );
      }
    }
  }
  return partes.join("\n");
}
