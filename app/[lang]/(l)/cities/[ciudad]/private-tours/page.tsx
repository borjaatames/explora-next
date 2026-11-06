import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerCiudad } from "@/lib/ciudades";
import PaginaPrivados from "@/components/privados/PaginaPrivados";
import {
  faqPrivadas,
  MIN_PRIVADAS_CIUDAD,
  obtenerCiudadesConPrivadas,
  obtenerPrivadasDeCiudad,
  urlPrivadasDeCiudad,
} from "@/lib/privados";
import { IDIOMAS_ACTIVOS } from "@/lib/i18n/config";
import { hreflangAlternates, prefijoIdioma, urlActividadesDeCiudad } from "@/lib/i18n/utils";
import { TEXTOS_PRIVADOS } from "@/lib/i18n/textosPrivados";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = { params: { lang: string; ciudad: string } };
type IdiomaNoEs = Exclude<Idioma, "es">;

export const dynamicParams = false;

const IDIOMAS: ReadonlyArray<IdiomaNoEs> = IDIOMAS_ACTIVOS.filter((l): l is IdiomaNoEs => l !== "es");

function idiomaValido(lang: string): IdiomaNoEs | null {
  return IDIOMAS.find((l) => l === lang) ?? null;
}

export function generateStaticParams(): { lang: string; ciudad: string }[] {
  return IDIOMAS.flatMap((lang) => obtenerCiudadesConPrivadas(lang).map((c) => ({ lang, ciudad: c.ciudad })));
}

function urlSiExiste(idioma: Idioma, ciudad: string): string | null {
  return obtenerPrivadasDeCiudad(idioma, ciudad).length >= MIN_PRIVADAS_CIUDAD
    ? urlPrivadasDeCiudad(idioma, ciudad)
    : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = idiomaValido(params.lang);
  if (!lang) return { title: "Not found" };
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) return { title: "Not found" };
  const t = TEXTOS_PRIVADOS[lang];
  const total = obtenerPrivadasDeCiudad(lang, params.ciudad).length;
  const titulo = t.ciudadTitulo(ciudad.nombre);
  const descripcion = t.ciudadDescripcion(total, ciudad.nombre);
  const url = `${SITE_URL}${urlPrivadasDeCiudad(lang, params.ciudad)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: titulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => urlSiExiste(l, params.ciudad)),
    },
    openGraph: { type: "website", url, title: `${titulo} | ExploraSpain`, description: descripcion, siteName: "ExploraSpain", locale: t.ogLocale },
  };
}

export default async function PrivateToursCityPage({ params }: Props) {
  const lang = idiomaValido(params.lang);
  if (!lang) notFound();
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) notFound();
  const actividades = obtenerPrivadasDeCiudad(lang, params.ciudad);
  if (actividades.length < MIN_PRIVADAS_CIUDAD) notFound();
  const t = TEXTOS_PRIVADOS[lang];

  return (
    <PaginaPrivados
      idioma={lang}
      titulo={t.ciudadTitulo(ciudad.nombre)}
      intro={t.ciudadIntro(actividades.length)}
      migas={[
        { label: t.inicio, href: prefijoIdioma(lang) || "/" },
        { label: ciudad.nombre, href: ciudad.url },
        { label: t.migaActividades, href: urlActividadesDeCiudad(lang, params.ciudad) },
        { label: t.migaHub },
      ]}
      grupos={[{ actividades }]}
      faq={faqPrivadas(lang, actividades, ciudad.nombre)}
    />
  );
}
