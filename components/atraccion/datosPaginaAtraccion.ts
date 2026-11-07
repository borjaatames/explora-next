import type { Metadata } from "next";
import { obtenerCiudad } from "@/lib/ciudades";
import {
  atraccionPorNombreEnCiudad,
  guiasDeAtraccion,
  obtenerAtraccion,
  opcionesDeAtraccion,
  urlAtraccionEnIdioma,
  type Atraccion,
  type OpcionAtraccion,
} from "@/lib/atracciones";
import type { GuiaListItem } from "@/lib/guias";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";
import { hreflangAlternates, urlAtraccionesDeCiudad } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import type { Cercana } from "@/components/atraccion/PaginaAtraccion";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

export type DatosPaginaAtraccion = {
  atraccion: Atraccion;
  ciudad: { slug: string; nombre: string; url: string };
  opciones: OpcionAtraccion[];
  guias: GuiaListItem[];
  cercanas: Cercana[];
  urlAgotadas?: string;
};

/** Todo lo que necesita la página de una atracción, en un idioma. */
export async function datosPaginaAtraccion(
  idioma: Idioma,
  ciudadSlug: string,
  slug: string
): Promise<DatosPaginaAtraccion | null> {
  const [atraccion, ciudad] = await Promise.all([
    obtenerAtraccion(idioma, ciudadSlug, slug),
    obtenerCiudad(idioma, ciudadSlug),
  ]);
  if (!atraccion || !ciudad) return null;
  const opciones = opcionesDeAtraccion(idioma, ciudadSlug, atraccion.tag);
  if (opciones.length === 0) return null;
  const guias = guiasDeAtraccion(idioma, atraccion);
  const listado = urlAtraccionesDeCiudad(idioma, ciudadSlug);
  const cercanas: Cercana[] = (ciudad.atracciones ?? [])
    .filter((a) => a.nombre !== atraccion.nombreEnCiudad)
    .slice(0, 4)
    .map((a) => ({
      nombre: a.nombre,
      descripcion: a.descripcion,
      url: atraccionPorNombreEnCiudad(idioma, ciudadSlug, a.nombre) ?? listado,
    }));
  return {
    atraccion,
    ciudad: { slug: ciudadSlug, nombre: ciudad.nombre, url: ciudad.url },
    opciones,
    guias,
    cercanas,
    urlAgotadas: guias.find((g) => /agotad|sold-out/.test(g.slug))?.url,
  };
}

export function metadataAtraccion(idioma: Idioma, atraccion: Atraccion): Metadata {
  const url = `${SITE_URL}${atraccion.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: atraccion.metaTitle,
    description: atraccion.metaDescription,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => urlAtraccionEnIdioma(l, atraccion.slugs.es ?? atraccion.slug)),
    },
    openGraph: {
      type: "website",
      url,
      title: atraccion.metaTitle,
      description: atraccion.metaDescription,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[idioma].replace("-", "_"),
      images: [{ url: `${SITE_URL}${atraccion.imagen}`, alt: atraccion.imagenAlt }],
    },
  };
}
