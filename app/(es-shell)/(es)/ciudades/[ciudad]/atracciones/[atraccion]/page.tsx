import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaAtraccion from "@/components/atraccion/PaginaAtraccion";
import { datosPaginaAtraccion, metadataAtraccion } from "@/components/atraccion/datosPaginaAtraccion";
import { obtenerAtraccion, obtenerTodasLasAtracciones } from "@/lib/atracciones";

type Props = { params: { ciudad: string; atraccion: string } };

export const dynamicParams = false;

export function generateStaticParams(): { ciudad: string; atraccion: string }[] {
  return obtenerTodasLasAtracciones("es").map(({ ciudad, slug }) => ({ ciudad, atraccion: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const atraccion = await obtenerAtraccion("es", params.ciudad, params.atraccion);
  if (!atraccion) return { title: "Página no encontrada" };
  return metadataAtraccion("es", atraccion);
}

export default async function AtraccionPage({ params }: Props) {
  const datos = await datosPaginaAtraccion("es", params.ciudad, params.atraccion);
  if (!datos) notFound();
  return <PaginaAtraccion idioma="es" {...datos} />;
}
