import type { Metadata } from "next";
import PaginaCruceros, { TEXTOS_CRUCEROS } from "@/components/cruceros/PaginaCruceros";
import { urlCruceros } from "@/lib/descubrir";
import { hreflangAlternates } from "@/lib/i18n/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

export function generateMetadata(): Metadata {
  const t = TEXTOS_CRUCEROS.es;
  const url = `${SITE_URL}${urlCruceros("es")}`;
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
      locale: "es_ES",
    },
  };
}

export default function CrucerosPage() {
  return <PaginaCruceros idioma="es" />;
}
