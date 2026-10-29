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

type Props = { params: { ciudad: string } };

export const dynamicParams = false;

export function generateStaticParams(): { ciudad: string }[] {
  return obtenerCiudadesConPrivadas("es").map((c) => ({ ciudad: c.ciudad }));
}

function urlSiExiste(idioma: Idioma, ciudad: string): string | null {
  if (idioma !== "es" && idioma !== "en") return null;
  return obtenerPrivadasDeCiudad(idioma, ciudad).length >= MIN_PRIVADAS_CIUDAD
    ? urlPrivadasDeCiudad(idioma, ciudad)
    : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) return { title: "Ciudad no encontrada" };
  const total = obtenerPrivadasDeCiudad("es", params.ciudad).length;
  const titulo = `Excursiones y tours privados en ${ciudad.nombre}`;
  const descripcion = `${total} excursiones y visitas privadas en ${ciudad.nombre}, solo para tu grupo, con precio por persona según cuántos seáis y reserva directa.`;
  const url = `${SITE_URL}${urlPrivadasDeCiudad("es", params.ciudad)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: titulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => urlSiExiste(l, params.ciudad)),
    },
    openGraph: { type: "website", url, title: `${titulo} | ExploraSpain`, description: descripcion, siteName: "ExploraSpain", locale: "es_ES" },
  };
}

export default async function PrivadasCiudadPage({ params }: Props) {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) notFound();
  const actividades = obtenerPrivadasDeCiudad("es", params.ciudad);
  if (actividades.length < MIN_PRIVADAS_CIUDAD) notFound();

  return (
    <PaginaPrivados
      idioma="es"
      titulo={`Excursiones y tours privados en ${ciudad.nombre}`}
      intro={`${actividades.length} excursiones y visitas solo para tu grupo, con recogida y horario según cada una. Te mostramos lo que sale por persona según cuántos seáis para que puedas compararlas con los tours en grupo.`}
      migas={[
        { label: "Inicio", href: "/" },
        { label: ciudad.nombre, href: ciudad.url },
        { label: "Actividades", href: urlActividadesDeCiudad("es", params.ciudad) },
        { label: "Excursiones privadas" },
      ]}
      grupos={[{ actividades }]}
      faq={faqPrivadas("es", actividades, ciudad.nombre)}
    />
  );
}

