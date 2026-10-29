import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerCiudad } from "@/lib/ciudades";
import PaginaPrivados from "@/components/privados/PaginaPrivados";
import {
  faqPrivadas,
  MIN_PRIVADAS_CIUDAD,
  obtenerCiudadesConPrivadas,
  obtenerPrivadasDeCiudad,
  urlPrivadasDeCiudad,
} from "@/lib/privados";
import { hreflangAlternates, urlActividadesDeCiudad } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = { params: { lang: string; ciudad: string } };

export const dynamicParams = false;

export function generateStaticParams(): { lang: string; ciudad: string }[] {
  return obtenerCiudadesConPrivadas("en").map((c) => ({ lang: "en", ciudad: c.ciudad }));
}

function urlSiExiste(idioma: Idioma, ciudad: string): string | null {
  if (idioma !== "es" && idioma !== "en") return null;
  return obtenerPrivadasDeCiudad(idioma, ciudad).length >= MIN_PRIVADAS_CIUDAD
    ? urlPrivadasDeCiudad(idioma, ciudad)
    : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (params.lang !== "en") return { title: "Not found" };
  const ciudad = await obtenerCiudad("en", params.ciudad);
  if (!ciudad) return { title: "City not found" };
  const total = obtenerPrivadasDeCiudad("en", params.ciudad).length;
  const titulo = `Private tours and day trips in ${ciudad.nombre}`;
  const descripcion = `${total} private tours and day trips in ${ciudad.nombre}, just for your group, with the price per person by group size and direct booking.`;
  const url = `${SITE_URL}${urlPrivadasDeCiudad("en", params.ciudad)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: titulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => urlSiExiste(l, params.ciudad)),
    },
    openGraph: { type: "website", url, title: `${titulo} | ExploraSpain`, description: descripcion, siteName: "ExploraSpain", locale: "en_US" },
  };
}

export default async function PrivateToursCityPage({ params }: Props) {
  if (params.lang !== "en") notFound();
  const ciudad = await obtenerCiudad("en", params.ciudad);
  if (!ciudad) notFound();
  const actividades = obtenerPrivadasDeCiudad("en", params.ciudad);
  if (actividades.length < MIN_PRIVADAS_CIUDAD) notFound();

  return (
    <PaginaPrivados
      idioma="en"
      titulo={`Private tours and day trips in ${ciudad.nombre}`}
      intro={`${actividades.length} tours and day trips just for your group, with pickup and timing depending on each one. We show the price per person by group size so you can compare them with group tours.`}
      migas={[
        { label: "Home", href: "/en" },
        { label: ciudad.nombre, href: ciudad.url },
        { label: "Activities", href: urlActividadesDeCiudad("en", params.ciudad) },
        { label: "Private tours" },
      ]}
      grupos={[{ actividades }]}
      faq={faqPrivadas("en", actividades, ciudad.nombre)}
    />
  );
}
