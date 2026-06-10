/**
 * Buscador de candidatos Viator para IGUALAR el catálogo (más Viator donde falta).
 *
 * Qué hace (solo lee y genera un CSV; NO toca el repo):
 *   1. Lee los códigos Viator que YA tienes (fichas ES/EN + landings SEM).
 *   2. Obtiene los IDs de destino de las ciudades objetivo (/destinations).
 *   3. Busca productos por ciudad (/products/search), paginando.
 *   4. Filtra por calidad (rating + nº de opiniones mínimos).
 *   5. Descarta los que ya tienes (dedup por código).
 *   6. Escribe `candidatos-viator-AAAA-MM-DD.csv` con los candidatos.
 *
 * Uso:  npm run descubrir:viator
 * Requiere VIATOR_API_KEY en .env.local (y opcional VIATOR_API_BASE).
 *
 * Si el endpoint de búsqueda devuelve 403 con tu acceso Basic, el script lo
 * dirá claramente por consola y no escribirá nada: ahí pivotamos.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ── Config editable ───────────────────────────────────────────────────────
const CIUDADES_OBJETIVO = ["Sevilla", "Barcelona", "Granada"];
const RATING_MIN = 4.5; // nota media mínima
const OPINIONES_MIN = 200; // nº de opiniones mínimo
const MAX_POR_CIUDAD = 300; // cuántos productos revisar por ciudad como máximo
const PAGINA = 50; // tamaño de página de la API

// ── Cargar .env.local (tsx no lo hace solo) ────────────────────────────────
(function loadEnv() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined)
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
})();

const KEY = process.env.VIATOR_API_KEY;
const BASE = process.env.VIATOR_API_BASE || "https://api.viator.com/partner";
if (!KEY) {
  console.error("❌ Falta VIATOR_API_KEY en .env.local");
  process.exit(1);
}

const HEADERS = {
  "exp-api-key": KEY,
  Accept: "application/json;version=2.0",
  "Accept-Language": "es-ES",
  "Content-Type": "application/json",
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const viaCode = (u: string): string | null => {
  const m = (u || "").match(/\/d\d+-([A-Za-z0-9]+)/);
  return m ? m[1] : null;
};

// ── Códigos Viator que YA tenemos (para no proponer duplicados) ────────────
const ROOT = path.join(process.cwd(), "content");
function walk(dir: string, fn: (f: string) => void) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, fn);
    else if (e.name.endsWith(".md") && !e.name.startsWith("_")) fn(p);
  }
}

const existentes = new Set<string>();
for (const idi of ["es", "en"]) {
  walk(path.join(ROOT, "actividades", idi), (f) => {
    const { data } = matter(fs.readFileSync(f, "utf8")) as {
      data: Record<string, any>;
    };
    const u = data.urlReserva as string;
    if (u && String(u).includes("viator")) {
      const c = viaCode(String(u));
      if (c) existentes.add(c);
    }
  });
}
walk(path.join(ROOT, "sem"), (f) => {
  const { data } = matter(fs.readFileSync(f, "utf8")) as {
    data: Record<string, any>;
  };
  for (const t of (data.tours as any[]) || []) {
    const u = (t.viator_url as string) || (t.url_reserva as string) || "";
    if (!u.includes("viator")) continue;
    const c = viaCode(u) || (t.viator_product_id as string);
    if (c) existentes.add(c);
  }
});

console.log(`Ya tienes ${existentes.size} productos Viator. Buscando candidatos nuevos…`);

// ── Helpers HTTP ───────────────────────────────────────────────────────────
async function getJson(url: string) {
  try {
    const r = await fetch(url, { headers: HEADERS });
    const data = r.headers.get("content-type")?.includes("json")
      ? await r.json()
      : null;
    return { ok: r.ok, status: r.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { error: String(e) } };
  }
}
async function postJson(url: string, body: unknown) {
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(body),
    });
    const data = r.headers.get("content-type")?.includes("json")
      ? await r.json()
      : null;
    return { ok: r.ok, status: r.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { error: String(e) } };
  }
}

type Fila = {
  ciudad: string;
  code: string;
  titulo: string;
  precio: string;
  rating: string;
  opiniones: string;
  url: string;
};

(async () => {
  // 1) IDs de destino
  const dest = await getJson(`${BASE}/destinations`);
  if (!dest.ok) {
    console.error(
      `❌ /destinations falló (${dest.status}). ${JSON.stringify(
        dest.data,
      ).slice(0, 300)}`,
    );
    process.exit(1);
  }
  const destinos: any[] = (dest.data as any)?.destinations || [];
  const findDestId = (nombre: string): number | null => {
    const n = nombre.toLowerCase();
    const exact = destinos.filter(
      (d) =>
        String(d.name || "").toLowerCase() === n &&
        String(d.type || "").toUpperCase() === "CITY",
    );
    const list = exact.length
      ? exact
      : destinos.filter(
          (d) =>
            String(d.name || "").toLowerCase().includes(n) &&
            String(d.type || "").toUpperCase() === "CITY",
        );
    return list.length ? Number(list[0].destinationId) : null;
  };

  // 2) Buscar por ciudad
  async function buscarCiudad(destId: number): Promise<any[]> {
    const out: any[] = [];
    let start = 1;
    while (out.length < MAX_POR_CIUDAD) {
      const body = {
        filtering: { destination: destId },
        pagination: { start, count: PAGINA },
        currency: "EUR",
      };
      const r = await postJson(`${BASE}/products/search`, body);
      if (!r.ok) {
        console.error(
          `   ⚠️ /products/search (destino ${destId}, start ${start}) → ${
            r.status
          }: ${JSON.stringify(r.data).slice(0, 300)}`,
        );
        break;
      }
      const prods: any[] = (r.data as any)?.products || [];
      out.push(...prods);
      if (prods.length < PAGINA) break;
      start += PAGINA;
      await sleep(200);
    }
    return out;
  }

  const filas: Fila[] = [];
  for (const ciudad of CIUDADES_OBJETIVO) {
    const id = findDestId(ciudad);
    if (id == null) {
      console.error(`   No encontré destino CITY para "${ciudad}".`);
      continue;
    }
    console.log(`\n${ciudad} (destino ${id})…`);
    const prods = await buscarCiudad(id);
    console.log(`   ${prods.length} productos recibidos de la API.`);
    let nuevos = 0;
    for (const p of prods) {
      const code = p.productCode as string;
      if (!code || existentes.has(code)) continue;
      const rating = Number(p.reviews?.combinedAverageRating);
      const ops = Number(p.reviews?.totalReviews);
      if (!(rating >= RATING_MIN) || !(ops >= OPINIONES_MIN)) continue;
      const precio = Number(p.pricing?.summary?.fromPrice);
      filas.push({
        ciudad,
        code,
        titulo: String(p.title || "").replace(/[\r\n,;]+/g, " ").trim(),
        precio: Number.isFinite(precio) ? String(precio) : "",
        rating: Number.isFinite(rating) ? rating.toFixed(2) : "",
        opiniones: Number.isFinite(ops) ? String(ops) : "",
        url: String(p.productUrl || ""),
      });
      nuevos++;
    }
    console.log(`   → ${nuevos} candidatos nuevos que cumplen calidad.`);
  }

  // 3) Dedup global por código y orden por nº de opiniones
  const vistos = new Set<string>();
  const unicos = filas.filter((f) =>
    vistos.has(f.code) ? false : (vistos.add(f.code), true),
  );
  unicos.sort((a, b) => (Number(b.opiniones) || 0) - (Number(a.opiniones) || 0));

  // 4) CSV
  const fecha = new Date().toISOString().slice(0, 10);
  const out = path.join(process.cwd(), `candidatos-viator-${fecha}.csv`);
  const head = "ciudad,codigo,titulo,precio,rating,opiniones,url\n";
  const cuerpo = unicos
    .map((f) =>
      [f.ciudad, f.code, f.titulo, f.precio, f.rating, f.opiniones, f.url].join(
        ",",
      ),
    )
    .join("\n");
  fs.writeFileSync(out, head + cuerpo, "utf8");

  console.log(`\n✅ Hecho. ${unicos.length} candidatos nuevos (rating ≥ ${RATING_MIN}, opiniones ≥ ${OPINIONES_MIN}).`);
  console.log(`Informe: ${out}`);
  if (unicos.length) {
    console.log("\nTop 15 por nº de opiniones:");
    for (const f of unicos.slice(0, 15))
      console.log(`  ${f.ciudad} · ${f.code} · ${f.rating}★ (${f.opiniones}) · ${f.precio}€ · ${f.titulo}`);
  }
})();
