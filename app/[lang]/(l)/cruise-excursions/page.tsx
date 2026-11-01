import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaCruceros, { TEXTOS_CRUCEROS } from "@/components/cruceros/PaginaCruceros";
import { urlCruceros } from "@/lib/descubrir";
import { hreflangAlternates } from "@/lib/i18n/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = { params: { lang: string } };

export const dynamicParams = false;

export function generateStaticParams(): { lang: string }[] {
  return [{ lang: "en" }];
}

export function generateMetadata({ params }: Props): Metadata {
  if (params.lang !== "en") return { title: "Not found" };
  const t = TEXTOS_CRUCEROS.en;
  const url = `${SITE_URL}${urlCruceros("en")}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: t.metaTitulo,
    description: t.metaDescripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => (l === "es" || l === "en" ? urlCruceros(l) : null)),
    },
    openGraph: {
      type: "website",
      url,
      title: `${t.metaTitulo} | ExploraSpain`,
      description: t.metaDescripcion,
      siteName: "ExploraSpain",
      locale: "en_US",
    },
  };
}

export default function CruiseExcursionsPage({ params }: Props) {
  if (params.lang !== "en") notFound();
  return <PaginaCruceros idioma="en" />;
}
