import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerCiudad } from "@/lib/ciudades";
import { obtenerActividadesDestacadasPorCiudad, urlListadoActividadesSiExiste } from "@/lib/actividades";
import {
  obtenerCiudadesConHoteles,
  obtenerHotel,
  obtenerHotelesDeCiudad,
  urlFotoHotel,
  urlHotelesDeCiudad,
  urlHotelSiExiste,
} from "@/lib/hoteles";
import { tituloSeoGuia } from "@/lib/tituloSeo";
import { hreflangAlternates } from "@/lib/i18n/utils";
import PaginaHotel from "@/components/hoteles/PaginaHotel";
import { TEXTOS_HOTELES } from "@/components/hoteles/textos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
const t = TEXTOS_HOTELES.es;

type Props = { params: { ciudad: string; hotel: string } };

export const dynamicParams = false;

export function generateStaticParams(): { ciudad: string; hotel: string }[] {
  return obtenerCiudadesConHoteles("es").flatMap((ciudad) =>
    obtenerHotelesDeCiudad("es", ciudad).map((h) => ({ ciudad, hotel: h.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hotel = await obtenerHotel("es", params.ciudad, params.hotel);
  if (!hotel) return { title: "Hotel no encontrado" };
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

export default async function HotelPage({ params }: Props) {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  const hotel = await obtenerHotel("es", params.ciudad, params.hotel);
  if (!ciudad || !hotel) notFound();
  return (
    <PaginaHotel
      idioma="es"
      hotel={hotel}
      nombreCiudad={ciudad.nombre}
      migas={[
        { label: t.inicio, href: "/" },
        { label: ciudad.nombre, href: ciudad.url },
        { label: t.hoteles, href: urlHotelesDeCiudad("es", params.ciudad) },
        { label: hotel.nombre },
      ]}
      otros={obtenerHotelesDeCiudad("es", params.ciudad).filter((h) => h.slug !== hotel.slug).slice(0, 6)}
      actividades={obtenerActividadesDestacadasPorCiudad("es", params.ciudad, 3)}
      urlActividades={urlListadoActividadesSiExiste("es", params.ciudad)}
    />
  );
}
