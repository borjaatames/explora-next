/**
 * Audit de foto principal única.
 *
 * Se ejecuta como prebuild. Falla el build si dos fichas publicadas del
 * mismo idioma comparten `imagen` (foto principal). Las fotos de galería
 * sí pueden repetirse entre fichas. Regla de Borja, 31 oct 2026.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const RAIZ = path.join(process.cwd(), "content", "actividades");

function listarMd(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return listarMd(p);
    return e.name.endsWith(".md") && !e.name.startsWith("_") ? [p] : [];
  });
}

let errores = 0;
for (const idioma of fs.readdirSync(RAIZ, { withFileTypes: true })) {
  if (!idioma.isDirectory()) continue;
  const porImagen = new Map<string, string[]>();
  for (const archivo of listarMd(path.join(RAIZ, idioma.name))) {
    const { data } = matter(fs.readFileSync(archivo, "utf8"));
    if (data.publicada !== true || typeof data.imagen !== "string") continue;
    const imagen = data.imagen.trim();
    const lista = porImagen.get(imagen) ?? [];
    lista.push(path.relative(RAIZ, archivo));
    porImagen.set(imagen, lista);
  }
  for (const [imagen, fichas] of porImagen) {
    if (fichas.length < 2) continue;
    errores++;
    console.error(`ERROR foto principal repetida (${idioma.name}): ${imagen}\n  - ${fichas.join("\n  - ")}`);
  }
}

if (errores > 0) {
  console.error(`\n${errores} foto(s) principal(es) repetida(s). Cada ficha publicada necesita una principal única; en galería sí se pueden repetir.`);
  process.exit(1);
}
console.log("audit-imagen-principal: OK, ninguna foto principal repetida.");
