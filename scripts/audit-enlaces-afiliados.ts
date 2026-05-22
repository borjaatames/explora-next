/**
 * Audit de enlaces de afiliación (CHECK 3 = ID, CHECK 4 = idioma).
 *
 * Se ejecuta en `prebuild`. Recorre TODAS las actividades (fichas ES/EN y
 * landings SEM ES/EN), construye la URL final de reserva con las MISMAS
 * funciones que usa la web en runtime, y FALLA EL BUILD si alguna URL:
 *
 *   - CHECK 3 (ID de afiliado): GetYourGuide debe llevar `partner_id=C71NOAW`;
 *     Viator debe llevar `pid=P00298823`.
 *   - CHECK 4 (idioma coherente): la página del operador debe abrir en el idioma
 *     de NUESTRA página. GYG: ruta `/en-us/` (EN) o `/es-es/` (ES). Viator:
 *     ES con `/es-ES/` en la ruta; EN sin segmento de locale y con `primaryLanguage=en`.
 *
 * Determinista y sin red: garantiza por construcción que 3 y 4 nunca se rompan.
 * (CHECK 0 = activa y CHECK 1 = precio se verifican aparte, contra el operador.)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { construirUrlReserva } from "../lib/afiliados";
import { construirUrlViatorFicha } from "../lib/sem/url-builder-ficha";
import { construirUrlAfiliado } from "../lib/sem/url-builder";

const GYG_PARTNER = "C71NOAW";
const VIATOR_PID = "P00298823";
const ROOT = path.join(process.cwd(), "content");

type Idi = "es" | "en";
const errores: string[] = [];
let revisados = 0;

function esPlantilla(n: string): boolean {
  return n.startsWith("_") || !n.endsWith(".md");
}
function listar(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listar(p));
    else if (!esPlantilla(e.name)) out.push(p);
  }
  return out;
}
function proveedorDe(prov: unknown, url: string): string {
  const u = (url || "").toLowerCase();
  const p = String(prov || "").toLowerCase();
  if (p.includes("getyourguide") || u.includes("getyourguide")) return "getyourguide";
  if (p.includes("viator") || u.includes("viator")) return "viator";
  if (p.includes("civitatis") || u.includes("civitatis")) return "civitatis";
  return "otro";
}

function comprobar(finalUrl: string, prov: string, idioma: Idi, ctx: string): void {
  revisados++;
  let u: URL;
  try {
    u = new URL(finalUrl);
  } catch {
    errores.push(`[URL inválida] ${ctx}: ${finalUrl}`);
    return;
  }
  if (prov === "getyourguide") {
    if (u.searchParams.get("partner_id") !== GYG_PARTNER)
      errores.push(`[CHECK3 ID] ${ctx}: GYG partner_id=${u.searchParams.get("partner_id")} (esperado ${GYG_PARTNER}) → ${finalUrl}`);
    const seg = u.pathname.split("/").filter(Boolean)[0] || "";
    const want = idioma === "es" ? "es-es" : "en-us";
    if (seg !== want)
      errores.push(`[CHECK4 idioma] ${ctx}: GYG locale "${seg}" (esperado "${want}") → ${finalUrl}`);
  } else if (prov === "viator") {
    if (u.searchParams.get("pid") !== VIATOR_PID)
      errores.push(`[CHECK3 ID] ${ctx}: Viator pid=${u.searchParams.get("pid")} (esperado ${VIATOR_PID}) → ${finalUrl}`);
    const tieneLocale = /^\/[a-z]{2}-[A-Za-z]{2}\//.test(u.pathname);
    if (idioma === "es") {
      if (!u.pathname.startsWith("/es-ES/"))
        errores.push(`[CHECK4 idioma] ${ctx}: Viator ES sin /es-ES/ → ${finalUrl}`);
    } else {
      if (tieneLocale)
        errores.push(`[CHECK4 idioma] ${ctx}: Viator EN con segmento de locale en la ruta → ${finalUrl}`);
      if (u.searchParams.get("primaryLanguage") !== "en")
        errores.push(`[CHECK4 idioma] ${ctx}: Viator EN sin primaryLanguage=en → ${finalUrl}`);
    }
  }
}

// ── Fichas ───────────────────────────────────────────────────────────────────
for (const idioma of ["es", "en"] as Idi[]) {
  for (const file of listar(path.join(ROOT, "actividades", idioma))) {
    const { data } = matter(fs.readFileSync(file, "utf8"));
    const url = (data as Record<string, unknown>).urlReserva as string | undefined;
    if (!url) continue;
    const prov = proveedorDe((data as Record<string, unknown>).proveedor, url);
    if (prov === "otro" || prov === "civitatis") continue;
    const slug = String((data as Record<string, unknown>).slug || path.basename(file, ".md"));
    // Replica el runtime: urlReservaBase (server) + construirUrlViatorFicha (click).
    const base = construirUrlReserva(prov as "getyourguide" | "viator", url, idioma);
    const final = construirUrlViatorFicha(base, slug);
    comprobar(final, prov, idioma, `ficha/${idioma}/${path.basename(file)}`);
  }
}

// ── Landings SEM (ES en content/sem/*.md, EN en content/sem/en/*.md) ──────────
for (const file of listar(path.join(ROOT, "sem"))) {
  const idioma: Idi = file.includes(`${path.sep}en${path.sep}`) ? "en" : "es";
  const { data } = matter(fs.readFileSync(file, "utf8"));
  const landing = String((data as Record<string, unknown>).slug || path.basename(file, ".md"));
  const tours = ((data as Record<string, unknown>).tours as unknown[]) || [];
  for (const t of tours) {
    const tour = t as Record<string, unknown>;
    const url = (tour.url_reserva as string) || (tour.viator_url as string) || "";
    if (!url) continue;
    const prov = proveedorDe(tour.proveedor, url);
    if (prov === "otro" || prov === "civitatis") continue;
    let final: string;
    try {
      // construirUrlAfiliado espera un SemTour; el frontmatter ya trae los campos.
      final = construirUrlAfiliado(tour as never, landing, idioma);
    } catch (e) {
      errores.push(`[builder] sem/${idioma}/${path.basename(file)} tour ${String(tour.id)}: ${(e as Error).message}`);
      continue;
    }
    comprobar(final, prov, idioma, `sem/${idioma}/${path.basename(file)}#${String(tour.id)}`);
  }
}

// ── Resultado ────────────────────────────────────────────────────────────────
if (errores.length > 0) {
  console.error(`\n❌ Audit enlaces afiliados: ${errores.length} error(es) en ${revisados} enlaces revisados:\n`);
  for (const e of errores) console.error("  - " + e);
  console.error("\nArréglalo (ID/idioma) antes de desplegar. Ver SOP-verificacion-enlaces-afiliados.md\n");
  process.exit(1);
}
console.log(`✅ Audit enlaces afiliados: ${revisados} enlaces OK (ID + idioma correctos en GYG y Viator).`);
