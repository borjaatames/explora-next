import { NextResponse } from "next/server";
import type { ResenaTripadvisor } from "@/lib/tripadvisor";

export const dynamic = "force-dynamic";

// Reseñas reales de Tripadvisor vía su API oficial Terra (no se copian ni se
// guardan en el repo). La clave va solo en el servidor (TRIPADVISOR_API_KEY,
// cabecera X-API-Key, nunca en la URL ni en el navegador). Plan «Discover»:
// 1.000 entidades gratis para toda la vida de la cuenta y luego pago por
// entidad (0,015 $ → 0,009 $), máximo 3 reseñas por POI. Su política de caché
// no permite guardar reseñas, así que no se cachea nada: cada carga pide a la
// API (el bloque solo se pide cuando el usuario baja hasta él).

const API = "https://terra.tripadvisor.com/api/locations";
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
    cache: "no-store",
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

  // El plan da como mucho 3 reseñas por sitio y el filtro de idioma puede
  // dejar menos: se completa hasta 3 con las de inglés, sin repetir.
  let resenas = await pedir(locationId, idioma, clave);
  if (resenas.length < MAX_RESENAS && idioma !== "en") {
    const vistas = new Set(resenas.map((r) => r.id));
    const extra = (await pedir(locationId, "en", clave)).filter((r) => !vistas.has(r.id));
    resenas = [...resenas, ...extra].slice(0, MAX_RESENAS);
  }

  return NextResponse.json({ resenas }, { headers: { "Cache-Control": "no-store" } });
}
