/**
 * Verificación semanal por API de Viator (CHECK 1 = precio, CHECK 2 = activa).
 *
 * Recorre todos los productos Viator del repo (fichas ES/EN + landings SEM),
 * y para cada uno consulta la API de afiliado:
 *   - /availability/schedules/{code} → summary.fromPrice (+ currency)  → precio "desde"
 *   - /products/{code}               → status (ACTIVE/INACTIVE)        → activa/descatalogada
 * Compara el precio con nuestro `precioDesde`/`precio_desde` y escribe un CSV.
 *
 * Uso:  npm run verificar:precios
 * Requiere VIATOR_API_KEY en .env.local (y opcional VIATOR_API_BASE).
 * NO modifica nada del repo: solo lee y genera el informe.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ── cargar .env.local (tsx no lo hace solo) ──────────────────────────────────
(function loadEnv() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
})();

const KEY = process.env.VIATOR_API_KEY;
const BASE = process.env.VIATOR_API_BASE || "https://api.viator.com/partner";
if (!KEY) {
  console.error("❌ Falta VIATOR_API_KEY en .env.local");
  process.exit(1);
}

const ROOT = path.join(process.cwd(), "content");
const HEADERS = {
  "exp-api-key": KEY,
  Accept: "application/json;version=2.0",
  "Accept-Language": "es-ES",
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const viaCode = (u: string): string | null => {
  const m = (u || "").match(/\/d\d+-([A-Za-z0-9]+)/);
  return m ? m[1] : null;
};
function walk(dir: string, fn: (f: string) => void) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, fn);
    else if (e.name.endsWith(".md") && !e.name.startsWith("_")) fn(p);
  }
}

// ── recolectar productos Viator + nuestro precio ─────────────────────────────
const prod = new Map<string, { precios: Set<number>; refs: string[] }>();
function add(code: string | null, precio: unknown, ref: string) {
  if (!code) return;
  const e = prod.get(code) || { precios: new Set<number>(), refs: [] };
  if (precio != null && Number.isFinite(Number(precio))) e.precios.add(Number(precio));
  e.refs.push(ref);
  prod.set(code, e);
}
for (const idi of ["es", "en"]) {
  walk(path.join(ROOT, "actividades", idi), (f) => {
    const { data } = matter(fs.readFileSync(f, "utf8")) as { data: Record<string, any> };
    const u = data.urlReserva as string;
    if (!u || !u.includes("viator")) return;
    add(viaCode(u), data.precioDesde, `ficha/${idi}/${path.basename(f)}`);
  });
}
walk(path.join(ROOT, "sem"), (f) => {
  const { data } = matter(fs.readFileSync(f, "utf8")) as { data: Record<string, any> };
  for (const t of (data.tours as any[]) || []) {
    const u = (t.viator_url as string) || (t.url_reserva as string) || "";
    if (!u.includes("viator")) continue;
    add(viaCode(u) || (t.viator_product_id as string), t.precio_desde, `sem/${path.basename(f)}`);
  }
});

const codes = [...prod.keys()].sort();
console.log(`Verificando ${codes.length} productos Viator por API…\n`);

async function getJson(url: string): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const r = await fetch(url, { headers: HEADERS });
    const data = r.headers.get("content-type")?.includes("json") ? await r.json() : null;
    return { ok: r.ok, status: r.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { error: String(e) } };
  }
}

type Fila = {
  code: string; nuestro: string; web: string; cur: string;
  activa: string; rating: string; opiniones: string; verdicto: string; refs: number;
};

(async () => {
  const filas: Fila[] = [];
  for (const code of codes) {
    const ours = [...prod.get(code)!.precios].sort((a, b) => a - b);
    const ourMin = ours.length ? ours[0] : null;
    const sch = await getJson(`${BASE}/availability/schedules/${encodeURIComponent(code)}`);
    await sleep(150);
    const prd = await getJson(`${BASE}/products/${encodeURIComponent(code)}`);
    await sleep(150);

    const fromPrice = sch.ok ? Number(sch.data?.summary?.fromPrice) : NaN;
    const cur = (sch.ok ? sch.data?.currency : null) || "";
    const status = prd.ok ? String(prd.data?.status || "").toUpperCase() : prd.status === 404 ? "404" : "?";
    const activa = status === "ACTIVE" ? "sí" : status === "404" || status === "INACTIVE" || status === "DEACTIVATED" ? "NO" : "?";
    const rating = prd.ok && prd.data?.reviews?.combinedAverageRating != null ? Number(prd.data.reviews.combinedAverageRating).toFixed(2) : "";
    const opiniones = prd.ok && prd.data?.reviews?.totalReviews != null ? String(prd.data.reviews.totalReviews) : "";

    let verdicto = "OK";
    if (activa === "NO") verdicto = "DESCATALOGADA";
    else if (!Number.isFinite(fromPrice)) verdicto = "SIN PRECIO API";
    else if (ourMin == null) verdicto = "SIN NUESTRO PRECIO";
    else {
      const diff = fromPrice - ourMin;
      const tol = Math.max(4, 0.1 * ourMin);
      if (Math.abs(diff) > tol) verdicto = diff > 0 ? "DIF web mayor" : "DIF web menor";
    }
    filas.push({
      code,
      nuestro: ours.join(";"),
      web: Number.isFinite(fromPrice) ? String(fromPrice) : "",
      cur,
      activa,
      rating,
      opiniones,
      verdicto,
      refs: prod.get(code)!.refs.length,
    });
    process.stdout.write(`  ${code}: nuestro ${ourMin ?? "-"} · web ${Number.isFinite(fromPrice) ? fromPrice : "-"} · ${activa === "sí" ? "activa" : activa} → ${verdicto}\n`);
  }

  const fecha = new Date().toISOString().slice(0, 10);
  const out = path.join(process.cwd(), `verificacion-viator-${fecha}.csv`);
  const head = "codigo,precio_nuestro,precio_web,moneda,activa,rating,opiniones,verdicto,n_enlaces\n";
  const body = filas
    .map((f) => [f.code, f.nuestro, f.web, f.cur, f.activa, f.rating, f.opiniones, f.verdicto, f.refs].join(","))
    .join("\n");
  fs.writeFileSync(out, head + body, "utf8");

  const flags = filas.filter((f) => f.verdicto !== "OK");
  console.log(`\n✅ Hecho. ${filas.length} productos · ${flags.length} a revisar.`);
  console.log(`Informe: ${out}`);
  if (flags.length) {
    console.log("\nA revisar:");
    for (const f of flags) console.log(`  - ${f.code}: ${f.verdicto} (nuestro ${f.nuestro || "-"}, web ${f.web || "-"})`);
  }
})();
