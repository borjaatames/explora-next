import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaPrivados from "@/components/privados/PaginaPrivados";
import { faqPrivadas, obtenerCiudadesConPrivadas, urlHubPrivados, urlPrivadasDeCiudad } from "@/lib/privados";
import { hreflangAlternates } from "@/lib/i18n/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
const MAX_POR_CIUDAD = 6;

type Props = { params: { lang: string } };

export const dynamicParams = false;

export function generateStaticParams(): { lang: string }[] {
  return [{ lang: "en" }];
}

export function generateMetadata({ params }: Props): Metadata {
  if (params.lang !== "en") return { title: "Not found" };
  const ciudades = obtenerCiudadesConPrivadas("en");
  const total = ciudades.reduce((n, c) => n + c.actividades.length, 0);
  const titulo = "Private tours and day trips in Spain";
  const descripcion = `${total} private tours and day trips in ${ciudades.length} Spanish cities, just for your group and booked direct: ${ciudades
    .slice(0, 5)
    .map((c) => c.nombre)
    .join(", ")} and more.`;
  const url = `${SITE_URL}${urlHubPrivados("en")}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: titulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => (l === "es" || l === "en" ? urlHubPrivados(l) : null)),
    },
    openGraph: { type: "website", url, title: `${titulo} | ExploraSpain`, description: descripcion, siteName: "ExploraSpain", locale: "en_US" },
  };
}

export default function PrivateToursHubPage({ params }: Props) {
  if (params.lang !== "en") notFound();
  const ciudades = obtenerCiudadesConPrivadas("en");
  const todas = ciudades.flatMap((c) => c.actividades);
  return (
    <PaginaPrivados
      idioma="en"
      titulo="Private tours and day trips in Spain"
      intro={`${todas.length} tours and day trips just for your group in ${ciudades.length} cities. Pick where you're starting from; each card shows the price per person by group size.`}
      migas={[{ label: "Home", href: "/en" }, { label: "Private tours" }]}
      grupos={ciudades.map((c) => ({
        titulo: `From ${c.nombre}`,
        url: urlPrivadasDeCiudad("en", c.ciudad),
        textoUrl: `See all ${c.actividades.length}`,
        actividades: c.actividades,
      }))}
      maxPorGrupo={MAX_POR_CIUDAD}
      faq={faqPrivadas("en", todas)}
    />
  );
}
