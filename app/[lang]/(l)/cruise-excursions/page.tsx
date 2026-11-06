import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaCruceros, { TEXTOS_CRUCEROS } from "@/components/cruceros/PaginaCruceros";
import { idiomaConCruceros, urlCruceros } from "@/lib/descubrir";
import { IDIOMAS_ACTIVOS, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { hreflangAlternates } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = { params: { lang: string } };
type IdiomaNoEs = Exclude<Idioma, "es">;

export const dynamicParams = false;

function idiomaValido(lang: string): IdiomaNoEs | null {
  const l = IDIOMAS_ACTIVOS.find((x) => x === lang);
  return l && l !== "es" && idiomaConCruceros(l) ? l : null;
}

export function generateStaticParams(): { lang: string }[] {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es" && idiomaConCruceros(l)).map((lang) => ({ lang }));
}

export function generateMetadata({ params }: Props): Metadata {
  const lang = idiomaValido(params.lang);
  if (!lang) return { title: "Not found" };
  const t = TEXTOS_CRUCEROS[lang];
  const url = `${SITE_URL}${urlCruceros(lang)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: t.metaTitulo,
    description: t.metaDescripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => (idiomaConCruceros(l) ? urlCruceros(l) : null)),
    },
    openGraph: {
      type: "website",
      url,
      title: `${t.metaTitulo} | ExploraSpain`,
      description: t.metaDescripcion,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang].replace("-", "_"),
    },
  };
}

export default function CruiseExcursionsPage({ params }: Props) {
  const lang = idiomaValido(params.lang);
  if (!lang) notFound();
  return <PaginaCruceros idioma={lang} />;
}
