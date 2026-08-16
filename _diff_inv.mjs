import fs from "fs";

function parseCsv(text) {
  const lines = text.trim().split("\n");
  const head = lines[0].split(",").map(h => h.replace(/"/g, ""));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // simple CSV parse (no embedded commas in quoted fields except url which has no commas typically)
    const fields = lines[i].match(/(".*?")(,|$)/g).map(f => f.replace(/,$/, "").replace(/^"|"$/g, ""));
    const obj = {};
    head.forEach((h, idx) => obj[h] = fields[idx]);
    rows.push(obj);
  }
  return rows;
}

const prev = parseCsv(fs.readFileSync("inventario-sem-2026-07-21.csv", "utf8"));
const cur = parseCsv(fs.readFileSync("/tmp/inventario-sem-2026-07-28.csv", "utf8"));

const prevMap = new Map(prev.map(r => [r.proveedor + "|" + r.codigo, r]));
const curMap = new Map(cur.map(r => [r.proveedor + "|" + r.codigo, r]));

const removed = [];
const added = [];
const changed = [];

for (const [k, r] of prevMap) {
  if (!curMap.has(k)) removed.push(r);
}
for (const [k, r] of curMap) {
  if (!prevMap.has(k)) added.push(r);
}
for (const [k, r] of curMap) {
  const p = prevMap.get(k);
  if (!p) continue;
  const fields = ["precio_desde", "rating", "opiniones", "cancelacion", "publicada"];
  const diffs = fields.filter(f => p[f] !== r[f]);
  if (diffs.length) changed.push({ k, before: p, after: r, diffs });
}

console.log("REMOVED:", removed.length);
removed.forEach(r => console.log("  -", r.proveedor, r.codigo, r.ciudad, r.publicada));
console.log("\nADDED:", added.length);
added.forEach(r => console.log("  +", r.proveedor, r.codigo, r.ciudad, r.publicada));
console.log("\nCHANGED:", changed.length);
changed.forEach(c => console.log("  ~", c.k, c.diffs.map(f => `${f}: ${c.before[f]} -> ${c.after[f]}`).join(" | ")));
