import type { Metadata } from "next";
import PaginaProveedores, { copyProveedores } from "@/components/proveedores/PaginaProveedores";
import { hreflangAlternates } from "@/lib/i18n/utils";
import { urlProveedores } from "@/lib/proveedores";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
const t = copyProveedores("es");
const canonical = `${SITE_URL}${urlProveedores("es")}`;

export const metadata: Metadata = {
  title: t.titulo,
  description: t.subtitulo,
  robots: { index: allowIndexing, follow: allowIndexing },
  alternates: {
    canonical,
    languages: hreflangAlternates(urlProveedores),
  },
  openGraph: {
    type: "website",
    url: canonical,
    title: t.titulo,
    description: t.subtitulo,
    siteName: "ExploraSpain",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image", title: t.titulo, description: t.subtitulo },
};

export default function ProveedoresPage() {
  return <PaginaProveedores idioma="es" siteUrl={SITE_URL} />;
}
