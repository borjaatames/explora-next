import { NextResponse } from "next/server";
import type { ResenaTripadvisor } from "@/lib/tripadvisor";

// Reseñas reales de Tripadvisor vía su Content API oficial (no se copian ni se
// guardan en el repo). La clave va solo en el servidor (TRIPADVISOR_API_KEY,
// sin exponer en el navegador). Plan «Discover»: 1.000 entidades gratis y
// luego 0,015 $/entidad, con un máximo de 3 reseñas por POI. Por eso la
// respuesta se cachea 7 días: ~18 proveedores × 2 idiomas ≈ 150 llamadas/mes.

const API = "https://api.content.tripadvisor.com/api/v1/location";
const UNA_SEMANA = 60 * 60 * 24 * 7;
const MAX_RESENAS = 3;


type ResenaApi = {
  id?: number | string;
  title?: string;
  text?: string;
  rating?: number;
  published_date?: string;
  url?: string;
  user?: { username?: string; user_location?: { name?: string } | null };
};

async function pedir(locationId: string, idioma: string, clave: string): Promise<ResenaTripadvisor[]> {
  const url = `${API}/${locationId}/reviews?language=${idioma}&key=${encodeURIComponent(clave)}`;
  const res = await fetch(url, {
    headers: { accept: "application/json", referer: "https://www.exploraspain.com/" },
    next: { revalidate: UNA_SEMANA },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: ResenaApi[] };
  return (json.data ?? [])
    .filter((r) => r.text && r.url && typeof r.rating === "number")
    .slice(0, MAX_RESENAS)
    .map((r) => ({
      id: String(r.id ?? r.url),
      titulo: r.title ?? "",
      texto: r.text ?? "",
      rating: r.rating ?? 0,
      fecha: r.published_date ?? "",
      autor: r.user?.username ?? "Tripadvisor",
      lugarAutor: r.user?.user_location?.name ?? null,
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

  if (!clave || !/^\d{3,12}$/.test(locationId)) {
    return NextResponse.json({ resenas: [] }, { status: 200 });
  }

  // Si no hay reseñas en el idioma de la página, mejor en inglés que ninguna.
  let resenas = await pedir(locationId, idioma, clave);
  if (resenas.length === 0 && idioma !== "en") resenas = await pedir(locationId, "en", clave);

  return NextResponse.json(
    { resenas },
    { headers: { "Cache-Control": `public, s-maxage=${UNA_SEMANA}, stale-while-revalidate=${UNA_SEMANA}` } }
  );
}
