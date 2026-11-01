import { NextResponse } from "next/server";
import type { Idioma } from "@/lib/i18n/types";
import {
  obtenerActividadesPlanificador,
  obtenerCiudadesPlanificador,
} from "@/lib/planificadorDatos";

/**
 * JSON estático (se genera en build) con las actividades de una ciudad para el
 * planificador. Así la página no carga de golpe las ~2.000 fichas: el cliente
 * pide solo la ciudad elegida.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

const IDIOMAS: ReadonlyArray<Idioma> = ["es", "en"];

type Params = { params: { idioma: string; ciudad: string } };

export function generateStaticParams(): { idioma: string; ciudad: string }[] {
  return IDIOMAS.flatMap((idioma) =>
    obtenerCiudadesPlanificador(idioma).map((c) => ({ idioma, ciudad: c.slug }))
  );
}

export function GET(_request: Request, { params }: Params) {
  const idioma = IDIOMAS.find((i) => i === params.idioma);
  if (!idioma) return NextResponse.json({ error: "not found" }, { status: 404 });
  const actividades = obtenerActividadesPlanificador(idioma, params.ciudad);
  return NextResponse.json(
    { ciudad: params.ciudad, actividades },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Robots-Tag": "noindex",
      },
    }
  );
}
