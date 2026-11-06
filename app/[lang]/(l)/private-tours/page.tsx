import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaPrivados, { type GrupoPrivados } from "@/components/privados/PaginaPrivados";
import {
  faqPrivadas,
  obtenerCiudadesConPrivadas,
  obtenerPrivadasOtrasCiudades,
  urlHubPrivados,
  urlPrivadasDeCiudad,
} from "@/lib/privados";
import { IDIOMAS_ACTIVOS } from "@/lib/i18n/config";
import { hreflangAlternates, prefijoIdioma } from "@/lib/i18n/utils";
import { TEXTOS_PRIVADOS } from "@/lib/i18n/textosPrivados";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
const MAX_POR_CIUDAD = 6;

type Props = { params: { lang: string } };
type IdiomaNoEs = Exclude<Idioma, "es">;

export const dynamicParams = false;

function idiomaValido(lang: string): IdiomaNoEs | null {
  return lang !== "es" && (IDIOMAS_ACTIVOS as readonly string[]).includes(lang) ? (lang as IdiomaNoEs) : null;
}

export function generateStaticParams(): { lang: string }[] {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

/** Grupos por ciudad (con página propia) y, fuera de EN, el resto en «Otras ciudades». */
function gruposHub(lang: IdiomaNoEs): { grupos: GrupoPrivados[]; ciudades: number } {
  const t = TEXTOS_PRIVADOS[lang];
  const ciudades = obtenerCiudadesConPrivadas(lang);
  const grupos: GrupoPrivados[] = ciudades.map((c) => ({
    titulo: t.desdeCiudad(c.nombre),
    url: urlPrivadasDeCiudad(lang, c.ciudad),
    textoUrl: t.verTodas(c.actividades.length),
    actividades: c.actividades,
  }));
  const otras = lang === "en" ? [] : obtenerPrivadasOtrasCiudades(lang);
  if (otras.length > 0) grupos.push({ titulo: t.otrasCiudades, actividades: otras });
  const numCiudades = ciudades.length + new Set(otras.map((a) => a.ciudad)).size;
  return { grupos, ciudades: numCiudades };
}

export function generateMetadata({ params }: Props): Metadata {
  const lang = idiomaValido(params.lang);
  if (!lang) return { title: "Not found" };
  const t = TEXTOS_PRIVADOS[lang];
  const { grupos, ciudades } = gruposHub(lang);
  const total = grupos.reduce((n, g) => n + g.actividades.length, 0);
  const nombres = obtenerCiudadesConPrivadas(lang)
    .slice(0, 5)
    .map((c) => c.nombre)
    .join(", ");
  const url = `${SITE_URL}${urlHubPrivados(lang)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: t.hubTitulo,
    description: t.hubDescripcion(total, ciudades, nombres),
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => urlHubPrivados(l)),
    },
    openGraph: {
      type: "website",
      url,
      title: `${t.hubTitulo} | ExploraSpain`,
      description: t.hubDescripcion(total, ciudades, nombres),
      siteName: "ExploraSpain",
      locale: t.ogLocale,
    },
  };
}

export default function PrivateToursHubPage({ params }: Props) {
  const lang = idiomaValido(params.lang);
  if (!lang) notFound();
  const t = TEXTOS_PRIVADOS[lang];
  const { grupos, ciudades } = gruposHub(lang);
  if (grupos.length === 0) notFound();
  const todas = grupos.flatMap((g) => g.actividades);
  return (
    <PaginaPrivados
      idioma={lang}
      titulo={t.hubTitulo}
      intro={t.hubIntro(todas.length, ciudades)}
      migas={[{ label: t.inicio, href: prefijoIdioma(lang) || "/" }, { label: t.migaHub }]}
      grupos={grupos}
      maxPorGrupo={MAX_POR_CIUDAD}
      faq={faqPrivadas(lang, todas)}
    />
  );
}
