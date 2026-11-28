import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerCiudad } from "@/lib/ciudades";
import { obtenerActividadesDestacadasPorCiudad, urlListadoActividadesSiExiste } from "@/lib/actividades";
import {
  esIdiomaHotel,
  faqHotelesCiudad,
  obtenerCiudadesConHoteles,
  obtenerHotelesDeCiudad,
  urlHotelesDeCiudad,
  urlHotelesSiExiste,
  type IdiomaHotel,
} from "@/lib/hoteles";
import { hreflangAlternates, prefijoIdioma } from "@/lib/i18n/utils";
import PaginaHotelesCiudad from "@/components/hoteles/PaginaHotelesCiudad";
import { TEXTOS_HOTELES } from "@/components/hoteles/textos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = { params: { lang: string; ciudad: string } };
type IdiomaNoEs = Exclude<IdiomaHotel, "es">;

export const dynamicParams = false;

const IDIOMAS: ReadonlyArray<IdiomaNoEs> = ["en"];

function idiomaValido(lang: string): IdiomaNoEs | null {
  return esIdiomaHotel(lang) && lang !== "es" ? lang : null;
}

export function generateStaticParams(): { lang: string; ciudad: string }[] {
  return IDIOMAS.flatMap((lang) => obtenerCiudadesConHoteles(lang).map((ciudad) => ({ lang, ciudad })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = idiomaValido(params.lang);
  if (!lang) return { title: "Not found" };
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  const hoteles = obtenerHotelesDeCiudad(lang, params.ciudad);
  if (!ciudad || hoteles.length === 0) return { title: "Not found" };
  const t = TEXTOS_HOTELES[lang];
  const titulo = t.listadoTitulo(ciudad.nombre);
  const descripcion = t.listadoDescripcion(ciudad.nombre, hoteles.length);
  const url = `${SITE_URL}${urlHotelesDeCiudad(lang, params.ciudad)}`;
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

export default async function HotelsCityPage({ params }: Props) {
  const lang = idiomaValido(params.lang);
  if (!lang) notFound();
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  const hoteles = obtenerHotelesDeCiudad(lang, params.ciudad);
  if (!ciudad || hoteles.length === 0) notFound();
  const t = TEXTOS_HOTELES[lang];
  return (
    <PaginaHotelesCiudad
      idioma={lang}
      ciudad={params.ciudad}
      nombreCiudad={ciudad.nombre}
      hoteles={hoteles}
      migas={[{ label: t.inicio, href: prefijoIdioma(lang) || "/" }, { label: ciudad.nombre, href: ciudad.url }, { label: t.hoteles }]}
      actividades={obtenerActividadesDestacadasPorCiudad(lang, params.ciudad, 3)}
      urlActividades={urlListadoActividadesSiExiste(lang, params.ciudad)}
      faq={faqHotelesCiudad(lang, params.ciudad, ciudad.nombre, hoteles)}
    />
  );
}
