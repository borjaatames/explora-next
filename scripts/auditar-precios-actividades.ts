/**
 * Auditor de precios y vigencia de actividades.
 *
 * Recorre las fichas ES de las 4 landings que anunciamos en Ads (Sagrada
 * Familia, Alhambra, Toledo y Excursiones desde Madrid) y verifica contra
 * la API real de Viator:
 *
 *   - VIGENCIA: ACTIVE / INACTIVE / no encontrado (`obtenerProductoViator`).
 *   - PRECIO "DESDE" REAL en EUR (`obtenerHorariosViator`) frente al
 *     `precioDesde` que tenemos en el frontmatter.
 *   - DELTA absoluto y % de cambio.
 *
 * Para GetYourGuide no hay API afiliado de precios en el proyecto, así que
 * sus fichas se listan con un OJO ⚠️ para que las revises a mano.
 *
 * Uso:
 *   - Requiere VIATOR_API_KEY (y opcionalmente VIATOR_API_BASE) en .env.local.
 *     Si no hay key, las llamadas a Viator devuelven null y se marca como
 *     "sin verificar".
 *   - Lanzar con:  npx tsx scripts/auditar-precios-actividades.ts
 *   - Genera también un CSV en  scripts/auditoria-precios-<fecha>.csv
 *     para que abras en Excel/Numbers.
 *
 * El script NO falla el build (solo informa). Para ejecutar antes del
 * deploy y bloquear, añade `npm run audit:precios` al prebuild si quieres.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import "dotenv/config";
import {
  obtenerHorariosViator,
  obtenerProductoViator,
} from "../lib/viator-api";

const ATRACCIONES = [
  { tag: "sagrada-familia", ciudad: "barcelona", nombre: "Sagrada Familia" },
  { tag: "alhambra", ciudad: "granada", nombre: "Alhambra" },
  { tag: "toledo", ciudad: "madrid", nombre: "Toledo" },
  {
    tag: "excursiones-desde-madrid",
    ciudad: "madrid",
    nombre: "Excursiones desde Madrid",
  },
] as const;

type Fila = {
  landing: string;
  slug: string;
  titulo: string;
  proveedor: string;
  precioNuestro: number | null;
  precioReal: number | null;
  vigente: "ACTIVO" | "INACTIVO" | "404" | "sin-verificar" | "n/a";
  delta: number | null;
  deltaPct: number | null;
  alerta: string;
  url: string;
};

function leerFrontmatter(file: string) {
  const fm = matter(fs.readFileSync(file, "utf8")).data as Record<
    string,
    unknown
  >;
  return fm;
}

function tagPresente(fm: Record<string, unknown>, tag: string): boolean {
  const arr = fm.atraccionesRelacionadas;
  return Array.isArray(arr) && arr.some((t) => String(t) === tag);
}

/**
 * Saca el productCode Viator de la urlReserva. Ej:
 *   https://www.viator.com/es-ES/tours/Madrid/.../d566-110971P5?...
 *   → "110971P5"
 */
function viatorCodeDeUrl(url: string): string | null {
  const m = url.match(/\/d\d+-([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

async function auditar(): Promise<Fila[]> {
  const ROOT = path.join(process.cwd(), "content", "actividades", "es");
  const filas: Fila[] = [];

  for (const atr of ATRACCIONES) {
    const dir = path.join(ROOT, atr.ciudad);
    if (!fs.existsSync(dir)) continue;
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => path.join(dir, f));

    for (const f of files) {
      const fm = leerFrontmatter(f);
      if (!tagPresente(fm, atr.tag)) continue;
      if (fm.publicada === false) continue;

      const slug = String(fm.slug ?? path.basename(f, ".md"));
      const titulo = String(fm.titulo ?? "(sin título)");
      const proveedor = String(fm.proveedor ?? "?").toLowerCase();
      const precioNuestro = num(fm.precioDesde);
      const url = String(fm.urlReserva ?? "");

      const fila: Fila = {
        landing: atr.nombre,
        slug,
        titulo,
        proveedor,
        precioNuestro,
        precioReal: null,
        vigente: "n/a",
        delta: null,
        deltaPct: null,
        alerta: "",
        url,
      };

      if (proveedor === "viator") {
        const code = viatorCodeDeUrl(url);
        if (!code) {
          fila.vigente = "sin-verificar";
          fila.alerta = "no se pudo extraer productCode de la URL";
        } else {
          const prod = await obtenerProductoViator(code, "es");
          const hor = await obtenerHorariosViator(code, "es");
          if (prod == null && hor == null) {
            fila.vigente = "sin-verificar";
            fila.alerta = "VIATOR_API_KEY no configurada o API caída";
          } else {
            if (prod) fila.vigente = prod.activa ? "ACTIVO" : "INACTIVO";
            if (hor) {
              fila.precioReal = hor.precioDesde;
              if (hor.activa === false && fila.vigente === "n/a") {
                fila.vigente = "INACTIVO";
              }
            }
            // Calcular delta
            if (precioNuestro != null && fila.precioReal != null) {
              fila.delta = +(fila.precioReal - precioNuestro).toFixed(2);
              fila.deltaPct = +(
                (fila.delta / precioNuestro) *
                100
              ).toFixed(1);
              if (Math.abs(fila.deltaPct) >= 10) {
                fila.alerta = `⚠️ desvío ${
                  fila.deltaPct > 0 ? "+" : ""
                }${fila.deltaPct}%`;
              }
            }
            if (fila.vigente === "INACTIVO") fila.alerta = "🚫 INACTIVO";
            if (fila.precioReal == null && fila.vigente === "ACTIVO") {
              fila.alerta = "activo pero sin precio en /availability/schedules";
            }
          }
        }
      } else if (proveedor === "getyourguide") {
        fila.vigente = "sin-verificar";
        fila.alerta = "GetYourGuide → revisar a mano (no hay API en proyecto)";
      }

      filas.push(fila);
    }
  }
  return filas;
}

function imprimir(filas: Fila[]): void {
  // Ordenar por landing y luego por delta% (mayores primero)
  filas.sort((a, b) => {
    if (a.landing !== b.landing) return a.landing.localeCompare(b.landing);
    const da = Math.abs(a.deltaPct ?? 0);
    const db = Math.abs(b.deltaPct ?? 0);
    return db - da;
  });

  let landingActual = "";
  for (const f of filas) {
    if (f.landing !== landingActual) {
      console.log("\n══════════════════════════════════════════════");
      console.log(`  ${f.landing.toUpperCase()}`);
      console.log("══════════════════════════════════════════════");
      landingActual = f.landing;
    }
    const precioN =
      f.precioNuestro != null ? `${f.precioNuestro.toFixed(2)} €` : "?";
    const precioR =
      f.precioReal != null ? `${f.precioReal.toFixed(2)} €` : "?";
    const deltaStr =
      f.delta != null
        ? `${f.delta > 0 ? "+" : ""}${f.delta.toFixed(2)} € (${
            f.deltaPct! > 0 ? "+" : ""
          }${f.deltaPct}%)`
        : "—";
    const vigStr = (
      {
        ACTIVO: "✅",
        INACTIVO: "🚫",
        "404": "❌404",
        "sin-verificar": "—",
        "n/a": "—",
      } as Record<string, string>
    )[f.vigente];

    console.log(
      `\n${vigStr}  [${f.proveedor.padEnd(13)}] ${f.slug}`,
    );
    console.log(`    ${f.titulo}`);
    console.log(
      `    nuestro: ${precioN.padStart(10)}  →  real: ${precioR.padStart(
        10,
      )}  ${deltaStr ? `Δ ${deltaStr}` : ""}`,
    );
    if (f.alerta) console.log(`    ${f.alerta}`);
  }
}

function exportarCsv(filas: Fila[]): string {
  const hoy = new Date().toISOString().slice(0, 10);
  const dir = path.join(process.cwd(), "auditorias");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const fichero = path.join(dir, `auditoria-precios-${hoy}.csv`);
  const head = [
    "landing",
    "slug",
    "titulo",
    "proveedor",
    "vigente",
    "precio_nuestro_eur",
    "precio_real_eur",
    "delta_eur",
    "delta_pct",
    "alerta",
    "url",
  ].join(",");
  const rows = filas.map((f) =>
    [
      `"${f.landing}"`,
      f.slug,
      `"${f.titulo.replace(/"/g, '""')}"`,
      f.proveedor,
      f.vigente,
      f.precioNuestro ?? "",
      f.precioReal ?? "",
      f.delta ?? "",
      f.deltaPct ?? "",
      `"${f.alerta.replace(/"/g, '""')}"`,
      f.url,
    ].join(","),
  );
  fs.writeFileSync(fichero, [head, ...rows].join("\n"), "utf8");
  return fichero;
}

async function main() {
  console.log("\n🔍 Auditando precios y vigencia de actividades…");
  console.log(
    process.env.VIATOR_API_KEY
      ? `   Viator API: ${
          process.env.VIATOR_API_BASE ?? "https://api.sandbox.viator.com/partner"
        }`
      : "   ⚠️ VIATOR_API_KEY no configurada — las verificaciones Viator saldrán como 'sin-verificar'.",
  );

  const filas = await auditar();
  imprimir(filas);

  const csv = exportarCsv(filas);
  console.log(`\n✅ Reporte completo en ${csv}`);

  const probl = filas.filter((f) => {
    if (f.vigente === "INACTIVO" || f.vigente === "404") return true;
    if (f.deltaPct != null && Math.abs(f.deltaPct) >= 10) return true;
    return false;
  });
  if (probl.length > 0) {
    console.log(`\n🚨 ${probl.length} actividad(es) con problemas:`);
    for (const f of probl)
      console.log(
        `   - ${f.slug}: ${f.alerta} (precio nuestro ${f.precioNuestro} € / real ${
          f.precioReal ?? "?"
        } €)`,
      );
    // Solo en CI: salir con código 1 para que el workflow falle y envíe
    // notificación por email al dueño del repo. En local seguimos en 0
    // para no asustar mientras se ejecuta a mano.
    if (process.env.CI === "true") {
      process.exit(1);
    }
  } else {
    console.log("\n👍 Sin alertas críticas (vigencia OK + precios dentro de ±10%).");
  }
}

main().catch((e) => {
  console.error("\n❌ Error inesperado:", e);
  process.exit(1);
});
