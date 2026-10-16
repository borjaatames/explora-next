import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { hreflangAlternates, urlIndiceCiudades } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import IndiceCiudades from "@/components/ciudad/IndiceCiudades";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = {
  params: { lang: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const canonical = `${SITE_URL}${urlIndiceCiudades(lang)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: dict.ciudades.tituloIndice,
    description: dict.ciudades.descripcionIndice,
    alternates: {
      canonical,
      languages: hreflangAlternates((l) => urlIndiceCiudades(l)),
    },
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: { index: allowIndexing, follow: allowIndexing },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: dict.ciudades.tituloIndice,
      description: dict.ciudades.descripcionIndice,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

export default function CiudadesPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }
  const lang: Idioma = params.lang;
  const ciudades = obtenerListaCiudades(lang);
  return <IndiceCiudades idioma={lang} ciudades={ciudades} />;
}
