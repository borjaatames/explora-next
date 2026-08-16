import fs from "fs";
import path from "path";

const root = process.argv[2];
const ciudades = ["bilbao", "mallorca", "alicante", "cadiz", "salamanca", "santiago-de-compostela", "tarragona"];

function flipFile(ruta) {
  const raw = fs.readFileSync(ruta, "utf8");
  // Solo tocamos el bloque de frontmatter (entre las dos primeras líneas "---"),
  // nunca el cuerpo del artículo, y reconstruimos el archivo por slicing de
  // texto (no con gray-matter.stringify) para no arriesgar reformateo de YAML.
  const match = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)/);
  if (!match) {
    console.log(`  ⚠ SIN FRONTMATTER: ${ruta}`);
    return false;
  }
  const [, abre, fm, cierra] = match;
  if (!/publicada:\s*false/.test(fm)) {
    return false; // ya publicada, o el campo no está en ese formato exacto
  }
  const fmNuevo = fm.replace(/publicada:\s*false/, "publicada: true");
  const nuevoRaw =
    raw.slice(0, match.index) +
    abre +
    fmNuevo +
    cierra +
    raw.slice(match.index + match[0].length);
  fs.writeFileSync(ruta, nuevoRaw, "utf8");
  return true;
}

const cambiados = [];

console.log("=== GUIAS ===");
for (const idioma of ["es", "en"]) {
  for (const c of ciudades) {
    const dir = path.join(root, "content", "guias", idioma, c);
    if (!fs.existsSync(dir)) continue;
    for (const archivo of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const ruta = path.join(dir, archivo);
      if (flipFile(ruta)) {
        cambiados.push(ruta);
        console.log(`  ok ${idioma}/${c}/${archivo}`);
      }
    }
  }
}

console.log("\n=== CIUDADES ===");
for (const idioma of ["es", "en"]) {
  for (const c of ciudades) {
    const ruta = path.join(root, "content", "ciudades", idioma, `${c}.md`);
    if (!fs.existsSync(ruta)) continue;
    if (flipFile(ruta)) {
      cambiados.push(ruta);
      console.log(`  ok ${idioma}/${c}.md`);
    }
  }
}

console.log(`\nTotal archivos modificados: ${cambiados.length}`);
