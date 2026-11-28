import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerCiudad } from "@/lib/ciudades";
import { obtenerActividadesDestacadasPorCiudad, urlListadoActividadesSiExiste } from "@/lib/actividades";
import {
  esIdiomaHotel,
  obtenerCiudadesConHoteles,
  obtenerHotel,
  obtenerHotelesDeCiudad,
  urlFotoHotel,
  urlHotelesDeCiudad,
  urlHotelSiExiste,
  type IdiomaHotel,
} from "@/lib/hoteles";
import { tituloSeoGuia } from "@/lib/tituloSeo";
import { hreflangAlternates, prefijoIdioma } from "@/lib/i18n/utils";
import PaginaHotel from "@/components/hoteles/PaginaHotel";
import { TEXTOS_HOTELES } from "@/components/hoteles/textos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = { params: { lang: string; ciudad: string; hotel: string } };
type IdiomaNoEs = Exclude<IdiomaHotel, "es">;

export const dynamicParams = false;

const IDIOMAS: ReadonlyArray<IdiomaNoEs> = ["en"];

function idiomaValido(lang: string): IdiomaNoEs | null {
  return esIdiomaHotel(lang) && lang !== "es" ? lang : null;
}

export function generateStaticParams(): { lang: string; ciudad: string; hotel: string }[] {
  return IDIOMAS.flatMap((lang) =>
    obtenerCiudadesConHoteles(lang).flatMap((ciudad) =>
      obtenerHotelesDeCiudad(lang, ciudad).map((h) => ({ lang, ciudad, hotel: h.slug }))
    )
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = idiomaValido(params.lang);
  if (!lang) return { title: "Not found" };
  const hotel = await obtenerHotel(lang, params.ciudad, params.hotel);
  if (!hotel) return { title: "Not found" };
  const t = TEXTOS_HOTELES[lang];
  const url = `${SITE_URL}${hotel.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const imagen = hotel.fotos[0] ? [{ url: urlFotoHotel(hotel.fotos[0].src), alt: hotel.fotos[0].alt }] : undefined;
  return {
    title: tituloSeoGuia(hotel.titulo),
    description: hotel.descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: { canonical: url, languages: hreflangAlternates((l) => urlHotelSiExiste(l, params.ciudad, params.hotel)) },
    openGraph: { type: "website", url, title: `${hotel.titulo} | ExploraSpain`, description: hotel.descripcion, siteName: "ExploraSpain", locale: t.ogLocale, images: imagen },
    twitter: { card: "summary_large_image", title: hotel.titulo, description: hotel.descripcion },
  };
}

export default async function HotelPageEn({ params }: Props) {
  const lang = idiomaValido(params.lang);
  if (!lang) notFound();
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  const hotel = await obtenerHotel(lang, params.ciudad, params.hotel);
  if (!ciudad || !hotel) notFound();
  const t = TEXTOS_HOTELES[lang];
  return (
    <PaginaHotel
      idioma={lang}
      hotel={hotel}
      nombreCiudad={ciudad.nombre}
      migas={[
        { label: t.inicio, href: prefijoIdioma(lang) || "/" },
        { label: ciudad.nombre, href: ciudad.url },
        { label: t.hoteles, href: urlHotelesDeCiudad(lang, params.ciudad) },
        { label: hotel.nombre },
      ]}
      otros={obtenerHotelesDeCiudad(lang, params.ciudad).filter((h) => h.slug !== hotel.slug).slice(0, 6)}
      actividades={obtenerActividadesDestacadasPorCiudad(lang, params.ciudad, 3)}
      urlActividades={urlListadoActividadesSiExiste(lang, params.ciudad)}
    />
  );
}
