import { NextResponse } from "next/server";
import type { ResenaTripadvisor } from "@/lib/tripadvisor";

// Reseñas reales de Tripadvisor vía su API oficial Terra (no se copian ni se
// guardan en el repo). La clave va solo en el servidor (TRIPADVISOR_API_KEY,
// cabecera X-API-Key, nunca en la URL ni en el navegador). Plan «Discover»:
// 1.000 entidades gratis y luego pago por entidad, máximo 3 reseñas por POI.
// Por eso la respuesta se cachea 7 días.

const API = "https://terra.tripadvisor.com/api/locations";
const UNA_SEMANA = 60 * 60 * 24 * 7;
const MAX_RESENAS = 3;

type Traduccion = { language?: string; primary?: boolean; value?: string };

type ResenaApi = {
  id?: number | string;
  title?: Traduccion[];
  text?: Traduccion[];
  rating?: number;
  publish_ts?: string;
  url?: string;
  user?: { username?: string; geo?: string | null };
};

function enIdioma(textos: Traduccion[] | undefined, idioma: string): string {
  if (!textos?.length) return "";
  const elegido =
    textos.find((t) => t.language === idioma && t.value) ??
    textos.find((t) => t.primary && t.value) ??
    textos.find((t) => t.value);
  return elegido?.value?.trim() ?? "";
}

async function pedir(locationId: string, idioma: string, clave: string): Promise<ResenaTripadvisor[]> {
  const url = `${API}/${locationId}/reviews?language=${idioma}&size=${MAX_RESENAS}&version=1`;
  const res = await fetch(url, {
    headers: { accept: "application/json", "X-API-Key": clave },
    // Next solo cachea respuestas 2xx: los errores no se quedan guardados.
    next: { revalidate: UNA_SEMANA },
  });
  if (!res.ok) {
    // Sin la clave en el log: solo estado y el principio del mensaje de error.
    const cuerpo = (await res.text()).slice(0, 300);
    console.error(`[tripadvisor] ${locationId} (${idioma}) → HTTP ${res.status}: ${cuerpo}`);
    return [];
  }
  const json = (await res.json()) as { data?: ResenaApi[] };
  if (!json.data?.length) console.warn(`[tripadvisor] ${locationId} (${idioma}) → 0 reseñas`);
  return (json.data ?? [])
    .map((r) => ({ r, texto: enIdioma(r.text, idioma) }))
    .filter(({ r, texto }) => texto && r.url && typeof r.rating === "number")
    .slice(0, MAX_RESENAS)
    .map(({ r, texto }) => ({
      id: String(r.id ?? r.url),
      titulo: enIdioma(r.title, idioma),
      texto,
      rating: r.rating ?? 0,
      fecha: r.publish_ts ?? "",
      autor: r.user?.username ?? "Tripadvisor",
      lugarAutor: r.user?.geo ?? null,
      url: r.url ?? "",
    }));
}

export async function GET(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  const clave = process.env.TRIPADVISOR_API_KEY;
  const { locationId } = params;
  const idioma = new URL(request.url).searchParams.get("idioma") === "en" ? "en" : "es";

  if (!clave) console.error("[tripadvisor] falta TRIPADVISOR_API_KEY");
  if (!clave || !/^\d{3,12}$/.test(locationId)) {
    return NextResponse.json({ resenas: [] }, { status: 200 });
  }

  // Si no hay reseñas en el idioma de la página, mejor en inglés que ninguna.
  let resenas = await pedir(locationId, idioma, clave);
  if (resenas.length === 0 && idioma !== "en") resenas = await pedir(locationId, "en", clave);

  // Una respuesta vacía (error o sin reseñas) no se cachea: se reintenta en
  // la siguiente visita en vez de quedarse una semana sin reseñas.
  return NextResponse.json(
    { resenas },
    {
      headers: {
        "Cache-Control":
          resenas.length > 0
            ? `public, s-maxage=${UNA_SEMANA}, stale-while-revalidate=${UNA_SEMANA}`
            : "no-store",
      },
    }
  );
}
