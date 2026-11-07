import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaAtraccion from "@/components/atraccion/PaginaAtraccion";
import { datosPaginaAtraccion, metadataAtraccion } from "@/components/atraccion/datosPaginaAtraccion";
import { obtenerAtraccion, obtenerTodasLasAtracciones } from "@/lib/atracciones";
import { IDIOMAS_ACTIVOS } from "@/lib/i18n/config";
import type { Idioma } from "@/lib/i18n/types";

type Props = { params: { lang: string; ciudad: string; atraccion: string } };
type IdiomaNoEs = Exclude<Idioma, "es">;

export const dynamicParams = false;

function idiomaValido(lang: string): IdiomaNoEs | null {
  const l = IDIOMAS_ACTIVOS.find((x) => x === lang);
  return l && l !== "es" ? l : null;
}

export function generateStaticParams(): { lang: string; ciudad: string; atraccion: string }[] {
  return IDIOMAS_ACTIVOS.filter((l): l is IdiomaNoEs => l !== "es").flatMap((lang) =>
    obtenerTodasLasAtracciones(lang).map(({ ciudad, slug }) => ({ lang, ciudad, atraccion: slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = idiomaValido(params.lang);
  if (!lang) return { title: "Not found" };
  const atraccion = await obtenerAtraccion(lang, params.ciudad, params.atraccion);
  if (!atraccion) return { title: "Not found" };
  return metadataAtraccion(lang, atraccion);
}

export default async function AttractionPage({ params }: Props) {
  const lang = idiomaValido(params.lang);
  if (!lang) notFound();
  const datos = await datosPaginaAtraccion(lang, params.ciudad, params.atraccion);
  if (!datos) notFound();
  return <PaginaAtraccion idioma={lang} {...datos} />;
}
