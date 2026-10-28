import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaProveedores, { copyProveedores } from "@/components/proveedores/PaginaProveedores";
import { IDIOMAS_ACTIVOS, IDIOMA_LOCALE, esIdiomaActivo } from "@/lib/i18n/config";
import { hreflangAlternates } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import { urlProveedores } from "@/lib/proveedores";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

export function generateStaticParams(): Array<{ lang: Idioma }> {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") return {};

  const t = copyProveedores(lang);
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const canonical = `${SITE_URL}${urlProveedores(lang)}`;

  return {
    title: `${t.titulo} | ExploraSpain`,
    description: t.subtitulo,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: { canonical, languages: hreflangAlternates(urlProveedores) },
    openGraph: {
      type: "website",
      url: canonical,
      title: t.titulo,
      description: t.subtitulo,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
    twitter: { card: "summary_large_image", title: t.titulo, description: t.subtitulo },
  };
}

export default function PartnersPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") notFound();
  return <PaginaProveedores idioma={lang} siteUrl={SITE_URL} />;
}
