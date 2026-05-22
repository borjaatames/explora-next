/**
 * Ruta de servidor: precio exacto de una actividad Viator para una fecha
 * y nº de personas. La llama el calendario de la ficha (cliente) por POST.
 *
 * La API key NUNCA sale de aquí (vive en process.env.VIATOR_API_KEY, leída
 * dentro de lib/viator-api). Si no hay key o la API falla, responde
 * `{ disponible: null }` y el calendario sigue en modo orientativo.
 */
import { NextResponse } from "next/server";
import { comprobarDisponibilidadViator } from "@/lib/viator-api";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      code?: string;
      fecha?: string;
      adultos?: number;
      ninos?: number;
      idioma?: string;
    };
    if (!body?.code || !body?.fecha) {
      return NextResponse.json({ disponible: null }, { status: 200 });
    }
    const res = await comprobarDisponibilidadViator(
      String(body.code),
      String(body.fecha),
      Number(body.adultos) || 1,
      Number(body.ninos) || 0,
      body.idioma === "en" ? "en" : "es",
    );
    return NextResponse.json(res ?? { disponible: null }, { status: 200 });
  } catch {
    return NextResponse.json({ disponible: null }, { status: 200 });
  }
}
