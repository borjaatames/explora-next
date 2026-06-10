import fs from "node:fs";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const p = "content/actividades/es/barcelona/entrada-sagrada-familia-audioguia.md";
const buf = fs.readFileSync(p, "utf8");
console.log("len chars:", buf.length, "last 30 chars repr:", JSON.stringify(buf.slice(-30)));

try {
  const { data, content } = matter(buf);
  console.log("gray-matter OK. slug:", data.slug, "publicada:", data.publicada);
  console.log("content length:", content.length, "last 30 of content:", JSON.stringify(content.slice(-30)));
  // Ahora probar remark sobre el cuerpo con NULs (mismo pipeline que obtenerActividad)
  remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content)
    .then((res) => {
      const out = res.toString();
      console.log("remark OK. html length:", out.length, "last 30 of html:", JSON.stringify(out.slice(-30)));
    })
    .catch((e) => console.log("remark ERROR:", e.message));
} catch (e) {
  console.log("gray-matter ERROR:", e.message);
}
