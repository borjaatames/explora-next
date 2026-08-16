import fs from "fs";
import path from "path";
import matter from "gray-matter";

const root = process.argv[2];
const ciudades = ["bilbao", "mallorca", "alicante", "cadiz", "salamanca", "santiago-de-compostela", "tarragona"];

function revisarArchivo(ruta) {
  const raw = fs.readFileSync(ruta, "utf8");
  const { data, content } = matter(raw);
  const texto = content.trim();
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  const ultimaLinea = texto.split("\n").filter((l) => l.trim()).pop() || "";
  const terminaBien = /[.!?:)"'’”]$/.test(ultimaLinea.trim()) || ultimaLinea.trim().endsWith("|");
  return { ruta, publicada: data.publicada, palabras, terminaBien, ultimaLinea: ultimaLinea.slice(-80) };
}

console.log("=== GUIAS ES ===");
for (const c of ciudades) {
  const dir = path.join(root, "content", "guias", "es", c);
  if (!fs.existsSync(dir)) { console.log(c, "-> CARPETA NO EXISTE"); continue; }
  for (const archivo of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const r = revisarArchivo(path.join(dir, archivo));
    console.log(`${r.publicada === false ? "[OFF]" : "[ON] "} ${c}/${archivo} · ${r.palabras}p · ${r.terminaBien ? "OK" : "⚠ CORTADA?"} · fin: "...${r.ultimaLinea}"`);
  }
}

console.log("\n=== GUIAS EN ===");
for (const c of ciudades) {
  const dir = path.join(root, "content", "guias", "en", c);
  if (!fs.existsSync(dir)) { console.log(c, "-> CARPETA NO EXISTE"); continue; }
  for (const archivo of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const r = revisarArchivo(path.join(dir, archivo));
    console.log(`${r.publicada === false ? "[OFF]" : "[ON] "} ${c}/${archivo} · ${r.palabras}p · ${r.terminaBien ? "OK" : "⚠ CORTADA?"} · fin: "...${r.ultimaLinea}"`);
  }
}

console.log("\n=== CIUDADES ES/EN ===");
for (const idioma of ["es", "en"]) {
  for (const c of ciudades) {
    const ruta = path.join(root, "content", "ciudades", idioma, `${c}.md`);
    if (!fs.existsSync(ruta)) { console.log(idioma, c, "-> NO EXISTE"); continue; }
    const { data } = matter(fs.readFileSync(ruta, "utf8"));
    console.log(`${idioma} ${c}: publicada=${data.publicada} imagen=${data.imagen}`);
  }
}
