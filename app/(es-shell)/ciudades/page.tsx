import type { Metadata } from "next";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { hreflangAlternates, urlIndiceCiudades } from "@/lib/i18n/utils";
import IndiceCiudades from "@/components/ciudad/IndiceCiudades";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

const TITULO = "Ciudades de España";
const DESCRIPCION =
  "Guías de viaje por las principales ciudades de España: Madrid, Barcelona, Sevilla y más. Información práctica, qué visitar y consejos con criterio.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: {
    canonical: `${SITE_URL}${urlIndiceCiudades("es")}`,
    languages: hreflangAlternates((l) => urlIndiceCiudades(l)),
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${urlIndiceCiudades("es")}`,
    title: TITULO,
    description: DESCRIPCION,
    siteName: "ExploraSpain",
    locale: "es_ES",
  },
};

export default function CiudadesPage() {
  const ciudades = obtenerListaCiudades("es");
  return <IndiceCiudades idioma="es" ciudades={ciudades} />;
}
