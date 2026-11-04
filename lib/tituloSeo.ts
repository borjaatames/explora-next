/**
^ * <title> de guías y fichas sin pasar de ~70 caracteres (Bing marca «Title too
 * long» por encima de 70). La plantilla raíz añade « | ExploraSpain» (15).
 *
 * Orden: metaTitle o título si caben con la plantilla; si no, la parte
 * principal (antes de «:») más la primera idea de la segunda parte; si aun
 * así no cabe, el título sin plantilla (title.absolute) recortado.
 */

const SUFIJO = 15;
const MAX = 70;

export type TituloSeo = string | { absolute: string };

function cortarPalabra(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  return texto.slice(0, max).replace(/[\s,;:(–—-]+\S*$/, "").replace(/[\s,;:(–—-]+$/, "");
}

export function tituloSeoGuia(titulo: string, metaTitle?: string): TituloSeo {
  const base = (metaTitle ?? titulo).trim();
  if (base.length + SUFIJO <= MAX) return base;

  const i = base.search(/[:?]/);
  if (i > 12) {
    const principal = base.slice(0, i + (base[i] === "?" ? 1 : 0)).trim();
    const resto = base.slice(i + 1).trim();
    // Añade ideas de la segunda parte (separadas por comas) mientras quepan.
    const ideas = base[i] === ":" ? resto.split(/,|\(/).map((x) => x.trim()).filter(Boolean) : [];
    let conIdeas = principal;
    for (let n = 0; n < ideas.length; n++) {
      const prueba = `${principal}: ${ideas.slice(0, n + 1).join(", ")}`;
      if (prueba.length + SUFIJO > MAX) break;
      conIdeas = prueba;
    }
    if (conIdeas.length + SUFIJO <= MAX) return conIdeas;
    if (principal.length + SUFIJO <= MAX) return principal;
  }
  return { absolute: cortarPalabra(base, MAX) };
}
