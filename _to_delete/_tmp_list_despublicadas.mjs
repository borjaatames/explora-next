import fs from "fs";
import path from "path";
import matter from "gray-matter";

const root = process.argv[2];
const resultados = { es: [], en: [] };

for (const idioma of ["es", "en"]) {
  const dir = path.join(root, "content", "actividades", idioma);
  const ciudades = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory());
  for (const c of ciudades) {
    const ciudadDir = path.join(dir, c.name);
    const archivos = fs.readdirSync(ciudadDir).filter((f) => f.endsWith(".md"));
    for (const archivo of archivos) {
      const raw = fs.readFileSync(path.join(ciudadDir, archivo), "utf8");
      const { data } = matter(raw);
      if (data.publicada === false && data.proveedor === "viator") {
        resultados[idioma].push({ ciudad: data.ciudad, slug: data.slug });
      }
    }
  }
}

console.log(JSON.stringify(resultados, null, 2));
