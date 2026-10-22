import { obtenerListaCiudades } from "@/lib/ciudades";
import { obtenerListaGuias } from "@/lib/guias";
import { urlActividadesDeCiudad } from "@/lib/i18n/utils";
import { obtenerListaActividadesPorCiudad } from "@/lib/actividades";

/**
 * /llms.txt (propuesta llmstxt.org): índice en Markdown para asistentes de
 * IA. ChatGPT es la primera fuente de tráfico, así que les damos un mapa
 * corto de hubs y guías. Estático, se regenera en cada build.
 */
export const dynamic = "force-static";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

function linea(titulo: string, url: string, descripcion: string): string {
  const limpia = descripcion.replace(/\s+/g, " ").trim();
  return `- [${titulo}](${SITE_URL}${url}): ${limpia}`;
}

export function GET(): Response {
  const ciudades = obtenerListaCiudades("es");
  const guias = obtenerListaGuias("es");
  const guiasEn = obtenerListaGuias("en");

  const partes: string[] = [
    "# ExploraSpain",
    "",
    "> Guías de viaje de España escritas por expertos locales y selección de tours, entradas y actividades con cancelación gratuita (reserva directa o vía GetYourGuide). Contenido en español, inglés y alemán.",
    "",
    "Precios y valoraciones de cada actividad están en su ficha y se revisan periódicamente; la reserva se completa en la web del proveedor indicado.",
    "",
    "## Ciudades",
    "",
    ...ciudades.map((c) => {
      const conActividades =
        obtenerListaActividadesPorCiudad("es", c.slug).length > 0;
      const extra = conActividades
        ? ` Actividades: ${SITE_URL}${urlActividadesDeCiudad("es", c.slug)}`
        : "";
      return linea(c.nombre, c.url, `${c.descripcion}${extra}`);
    }),
    "",
    "## Guías",
    "",
    ...guias.map((g) => linea(g.titulo, g.url, g.descripcion)),
    "",
    "## English guides",
    "",
    ...guiasEn.map((g) => linea(g.titulo, g.url, g.descripcion)),
    "",
    "## Optional",
    "",
    `- [Sobre ExploraSpain](${SITE_URL}/sobre-nosotros)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  ];

  return new Response(partes.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
