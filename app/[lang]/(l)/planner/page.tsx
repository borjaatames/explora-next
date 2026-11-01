import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaPlanificador, { TEXTOS_PLANIFICADOR } from "@/components/planificador/PaginaPlanificador";
import { urlPlanificador } from "@/lib/planificador";
import { hreflangAlternates } from "@/lib/i18n/utils";
import { obtenerCiudadesPlanificador } from "@/lib/planificadorDatos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = { params: { lang: string } };

export const dynamicParams = false;

export function generateStaticParams(): { lang: string }[] {
  return [{ lang: "en" }];
}

export function generateMetadata({ params }: Props): Metadata {
  if (params.lang !== "en") return { title: "Not found" };
  const t = TEXTOS_PLANIFICADOR.en;
  const url = `${SITE_URL}${urlPlanificador("en")}`;
  const n = obtenerCiudadesPlanificador("en").length;
  const descripcion = `Pick a city, who you're travelling with and your budget, and we'll suggest the activities that fit best: tours, tapas, flamenco, day trips and private tours in ${n} Spanish cities.`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: t.metaTitulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => (l === "es" || l === "en" ? urlPlanificador(l) : null)),
    },
    openGraph: {
      type: "website",
      url,
      title: `${t.metaTitulo} | ExploraSpain`,
      description: descripcion,
      siteName: "ExploraSpain",
      locale: "en_US",
    },
  };
}

export default function PlannerPage({ params }: Props) {
  if (params.lang !== "en") notFound();
  return <PaginaPlanificador idioma="en" />;
}
