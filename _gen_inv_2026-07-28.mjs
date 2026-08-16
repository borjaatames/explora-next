import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content", "actividades", "es");

function walk(dir, fn) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, fn);
    else if (e.name.endsWith(".md") && !e.name.startsWith("_")) fn(p);
  }
}

function viaCode(u) {
  const m = (u || "").match(/\/d\d+-([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}
function gygCode(u) {
  const m = (u || "").match(/-t(\d+)\/?/);
  return m ? "t" + m[1] : null;
}

const rows = [];
walk(ROOT, (f) => {
  const { data } = matter(fs.readFileSync(f, "utf8"));
  const prov = (data.proveedor || "").toLowerCase();
  if (prov !== "viator" && prov !== "getyourguide") return;
  const url = data.urlReserva || "";
  const codigo = prov === "viator" ? viaCode(url) : gygCode(url);
  if (!codigo) {
    console.error("SIN CODIGO:", f, url);
    return;
  }
  const horas = data.horasCancelacion ?? (data.cancelacionGratuita ? 24 : 0);
  const cancel = data.cancelacionGratuita
    ? `gratis ${horas}h`
    : "no reembolsable";
  const ratingFmt = data.ratingProveedor != null ? Number(data.ratingProveedor).toFixed(1) : "";
  rows.push({
    proveedor: prov,
    ciudad: data.ciudad || "",
    codigo,
    precio_desde: data.precioDesde ?? "",
    moneda: data.moneda || "",
    rating: ratingFmt,
    opiniones: data.numeroOpiniones ?? "",
    cancelacion: cancel,
    publicada: data.publicada ? "si" : "no",
    url,
    _file: path.relative(process.cwd(), f),
  });
});

rows.sort((a, b) =>
  a.proveedor === b.proveedor
    ? a.ciudad === b.ciudad
      ? a.codigo.localeCompare(b.codigo)
      : a.ciudad.localeCompare(b.ciudad)
    : a.proveedor.localeCompare(b.proveedor)
);

const head = '"proveedor","ciudad","codigo","precio_desde","moneda","rating","opiniones","cancelacion","publicada","url"';
const body = rows
  .map((r) =>
    [r.proveedor, r.ciudad, r.codigo, r.precio_desde, r.moneda, r.rating, r.opiniones, r.cancelacion, r.publicada, r.url]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  )
  .join("\n");

fs.writeFileSync("/tmp/inventario-sem-2026-07-28.csv", head + "\n" + body + "\n", "utf8");
fs.writeFileSync("/tmp/rows.json", JSON.stringify(rows, null, 2), "utf8");

const byProv = {};
for (const r of rows) {
  byProv[r.proveedor] = byProv[r.proveedor] || { total: 0, publicada: 0 };
  byProv[r.proveedor].total++;
  if (r.publicada === "si") byProv[r.proveedor].publicada++;
}
console.log("TOTAL:", rows.length);
console.log(JSON.stringify(byProv, null, 2));
