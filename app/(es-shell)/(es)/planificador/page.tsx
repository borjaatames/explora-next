import type { Metadata } from "next";
import PaginaPlanificador, { TEXTOS_PLANIFICADOR } from "@/components/planificador/PaginaPlanificador";
import { urlPlanificador } from "@/lib/planificador";
import { hreflangAlternates } from "@/lib/i18n/utils";
import { obtenerCiudadesPlanificador } from "@/lib/planificadorDatos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

export function generateMetadata(): Metadata {
  const t = TEXTOS_PLANIFICADOR.es;
  const url = `${SITE_URL}${urlPlanificador("es")}`;
  const n = obtenerCiudadesPlanificador("es").length;
  const descripcion = `Elige ciudad, con quién viajas y tu presupuesto y te proponemos las actividades que mejor encajan: visitas, tapas, flamenco, excursiones y privados en ${n} ciudades de España.`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: t.metaTitulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => urlPlanificador(l)),
    },
    openGraph: {
      type: "website",
      url,
      title: `${t.metaTitulo} | ExploraSpain`,
      description: descripcion,
      siteName: "ExploraSpain",
      locale: "es_ES",
    },
  };
}

export default function PlanificadorPage() {
  return <PaginaPlanificador idioma="es" />;
}
