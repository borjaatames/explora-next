import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerCiudad } from "@/lib/ciudades";
import { obtenerActividadesDestacadasPorCiudad, urlListadoActividadesSiExiste } from "@/lib/actividades";
import {
  faqHotelesCiudad,
  obtenerCiudadesConHoteles,
  obtenerHotelesDeCiudad,
  urlHotelesDeCiudad,
  urlHotelesSiExiste,
} from "@/lib/hoteles";
import { hreflangAlternates } from "@/lib/i18n/utils";
import PaginaHotelesCiudad from "@/components/hoteles/PaginaHotelesCiudad";
import { TEXTOS_HOTELES } from "@/components/hoteles/textos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
const t = TEXTOS_HOTELES.es;

type Props = { params: { ciudad: string } };

export const dynamicParams = false;

export function generateStaticParams(): { ciudad: string }[] {
  return obtenerCiudadesConHoteles("es").map((ciudad) => ({ ciudad }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  const hoteles = obtenerHotelesDeCiudad("es", params.ciudad);
  if (!ciudad || hoteles.length === 0) return { title: "Ciudad no encontrada" };
  const titulo = t.listadoTitulo(ciudad.nombre);
  const descripcion = t.listadoDescripcion(ciudad.nombre, hoteles.length);
  const url = `${SITE_URL}${urlHotelesDeCiudad("es", params.ciudad)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: titulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: { canonical: url, languages: hreflangAlternates((l) => urlHotelesSiExiste(l, params.ciudad)) },
    openGraph: { type: "website", url, title: `${titulo} | ExploraSpain`, description: descripcion, siteName: "ExploraSpain", locale: t.ogLocale },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion },
  };
}

export default async function HotelesCiudadPage({ params }: Props) {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  const hoteles = obtenerHotelesDeCiudad("es", params.ciudad);
  if (!ciudad || hoteles.length === 0) notFound();
  return (
    <PaginaHotelesCiudad
      idioma="es"
      ciudad={params.ciudad}
      nombreCiudad={ciudad.nombre}
      hoteles={hoteles}
      migas={[{ label: t.inicio, href: "/" }, { label: ciudad.nombre, href: ciudad.url }, { label: t.hoteles }]}
      actividades={obtenerActividadesDestacadasPorCiudad("es", params.ciudad, 3)}
      urlActividades={urlListadoActividadesSiExiste("es", params.ciudad)}
      faq={faqHotelesCiudad("es", params.ciudad, ciudad.nombre, hoteles)}
    />
  );
}
