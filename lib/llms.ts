import { obtenerListaCiudades } from "@/lib/ciudades";
import { obtenerListaGuias, type GuiaListItem } from "@/lib/guias";
import {
  obtenerCiudadesConActividades,
  obtenerListaActividadesPorCiudad,
} from "@/lib/actividades";
import { urlActividadesDeCiudad } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import { rutaIndexable } from "@/lib/i18n/indexacion";

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
  { idioma: "fr", titulo: "Guides en français" },
  { idioma: "it", titulo: "Guide in italiano" },
  { idioma: "pt", titulo: "Guias em português" },
];

/** Listado de fichas de actividades por ciudad en los idiomas nuevos (además de sus guías). */
const SECCIONES_SOLO_FICHAS: ReadonlyArray<{ idioma: Idioma; titulo: string; prefijo: string }> = [
  { idioma: "fr", titulo: "Activités en français", prefijo: "Activités à" },
  { idioma: "it", titulo: "Attività in italiano", prefijo: "Attività a" },
  { idioma: "pt", titulo: "Atividades em português", prefijo: "Atividades em" },
];

const RE_AGOTADAS = /entradas-agotadas|tickets-sold-out|ausverkauft/;

/** FR/IT/PT usan slugs propios: la guía es de entradas agotadas si su versión ES lo es. */
function esGuiaAgotadas(g: GuiaListItem): boolean {
  return RE_AGOTADAS.test(g.slug) || RE_AGOTADAS.test(g.slugs?.es ?? "");
}

function limpiar(texto: string): string {
  return texto
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, "$1")
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
  fr: "prix et horaires vérifiés le",
  it: "prezzi e orari verificati il",
  pt: "preços e horários verificados em",
};

function sufijoComprobado(g: GuiaListItem): string {
  return g.datosComprobados
    ? ` (${TEXTO_COMPROBADO[g.idioma] ?? TEXTO_COMPROBADO.en} ${g.datosComprobados})`
    : "";
}

const CABECERA: string[] = [
  "# ExploraSpain",
  "",
  "> Guías de viaje de España escritas y revisadas por Borja (ExploraSpain), con tours, entradas y actividades con cancelación gratuita. Travel guides to Spain written and checked by a local editor, with tours and tickets with free cancellation. Español, English, Deutsch, Français, Italiano, Português.",
  "",
  `- Autor y método: ${SITE_URL}/sobre-nosotros#autor. Cada guía abre con una «respuesta corta»; las que indican fecha tienen precios y horarios comprobados en las webs oficiales ese día.`,
  "- Reservas: algunas actividades se reservan directamente en la web (calendario de reserva con pago seguro y confirmación inmediata); el resto enlaza a GetYourGuide.",
  `- Versión ampliada con la respuesta corta de cada guía: ${SITE_URL}/llms-full.txt`,
  "",
];

/** Guías de un idioma que Google puede indexar (en DE solo una parte). */
function guiasPublicables(idioma: Idioma): GuiaListItem[] {
  return obtenerListaGuias(idioma).filter((g) => rutaIndexable(g.url));
}

/** Última fecha de la guía: actualización si la hay, si no publicación. */
function fechaGuia(g: GuiaListItem): string {
  return [g.fecha_actualizacion ?? "", g.fecha].sort().pop() ?? "";
}

const MAX_NOVEDADES = 20;

export function generarLlmsTxt(): string {
  const ciudades = obtenerListaCiudades("es");
  const partes: string[] = [...CABECERA];

  // Lo más reciente primero: los asistentes priorizan fuentes con fecha.
  const novedades = (["es", "en"] as const).flatMap((idioma) =>
    guiasPublicables(idioma)
      .sort((a, b) => fechaGuia(b).localeCompare(fechaGuia(a)))
      .slice(0, MAX_NOVEDADES / 2)
  );
  if (novedades.length > 0) {
    partes.push(
      "## Novedades / Latest guides",
      "",
      ...novedades.map((g) =>
        enlace(g.titulo, g.url, `${g.descripcion} (${fechaGuia(g)})`)
      ),
      ""
    );
  }

  const agotadas = SECCIONES.flatMap(({ idioma }) =>
    guiasPublicables(idioma).filter(esGuiaAgotadas)
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
    const guias = guiasPublicables(idioma).filter(
      (g) => !esGuiaAgotadas(g)
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

  const nombresEs = nombresCiudades("es");
  for (const { idioma, titulo, prefijo } of SECCIONES_SOLO_FICHAS) {
    const ciudadesIdioma = obtenerCiudadesConActividades(idioma);
    if (ciudadesIdioma.length === 0) continue;
    const nombres = nombresCiudades(idioma);
    partes.push(
      `## ${titulo}`,
      "",
      ...ciudadesIdioma.map((c) =>
        enlace(`${prefijo} ${nombres.get(c) ?? nombresEs.get(c) ?? c}`, urlActividadesDeCiudad(idioma, c))
      ),
      ""
    );
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
    const guias = guiasPublicables(idioma);
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
