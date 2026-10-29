import type { Metadata } from "next";
import PaginaPrivados from "@/components/privados/PaginaPrivados";
import { faqPrivadas, obtenerCiudadesConPrivadas, urlHubPrivados, urlPrivadasDeCiudad } from "@/lib/privados";
import { hreflangAlternates } from "@/lib/i18n/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
const MAX_POR_CIUDAD = 6;

export function generateMetadata(): Metadata {
  const ciudades = obtenerCiudadesConPrivadas("es");
  const total = ciudades.reduce((n, c) => n + c.actividades.length, 0);
  const titulo = "Excursiones y tours privados en España";
  const descripcion = `${total} excursiones y visitas privadas en ${ciudades.length} ciudades de España, solo para tu grupo y con reserva directa: ${ciudades
    .slice(0, 5)
    .map((c) => c.nombre)
    .join(", ")} y más.`;
  const url = `${SITE_URL}${urlHubPrivados("es")}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: titulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => (l === "es" || l === "en" ? urlHubPrivados(l) : null)),
    },
    openGraph: { type: "website", url, title: `${titulo} | ExploraSpain`, description: descripcion, siteName: "ExploraSpain", locale: "es_ES" },
  };
}

export default function HubPrivadosPage() {
  const ciudades = obtenerCiudadesConPrivadas("es");
  const todas = ciudades.flatMap((c) => c.actividades);
  return (
    <PaginaPrivados
      idioma="es"
      titulo="Excursiones y tours privados en España"
      intro={`${todas.length} excursiones y visitas solo para tu grupo en ${ciudades.length} ciudades. Elige la ciudad de salida; en cada tarjeta ves lo que sale por persona según cuántos seáis.`}
      migas={[{ label: "Inicio", href: "/" }, { label: "Excursiones privadas" }]}
      grupos={ciudades.map((c) => ({
        titulo: `Desde ${c.nombre}`,
        url: urlPrivadasDeCiudad("es", c.ciudad),
        textoUrl: `Ver las ${c.actividades.length}`,
        actividades: c.actividades,
      }))}
      maxPorGrupo={MAX_POR_CIUDAD}
      faq={faqPrivadas("es", todas)}
    />
  );
}
