export type EntradaIndice = {
  id: string;
  texto: string;
};

function decodificarEntidades(texto: string): string {
  return texto
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function slugificar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Añade un `id` a cada <h2> del HTML generado por remark-html y devuelve el
 * índice de secciones para la tabla de contenidos de la guía. Los ids son
 * estables (derivados del texto) y únicos dentro de la página.
 */
export function anadirAnclasH2(html: string): {
  html: string;
  indice: EntradaIndice[];
} {
  const indice: EntradaIndice[] = [];
  const usados = new Set<string>();

  const conAnclas = html.replace(
    /<h2>([\s\S]*?)<\/h2>/g,
    (_coincidencia: string, interior: string) => {
      const texto = decodificarEntidades(interior.replace(/<[^>]+>/g, "")).trim();
      const base = slugificar(texto) || "seccion";
      let id = base;
      let n = 2;
      while (usados.has(id)) id = `${base}-${n++}`;
      usados.add(id);
      indice.push({ id, texto });
      return `<h2 id="${id}" class="scroll-mt-28">${interior}</h2>`;
    }
  );

  return { html: conAnclas, indice };
}
