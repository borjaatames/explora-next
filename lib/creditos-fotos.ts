import "server-only";
import fs from "node:fs";
import path from "node:path";

export interface CreditoFoto {
  src: string;
  /** Texto del crédito ya limpio (autor, licencia, fuente). */
  texto: string;
  /** Enlace a la fuente original, si el CREDITOS.md lo indica. */
  url?: string;
}

interface ArchivoCreditos {
  cabecera: string;
  lineas: string[];
}

const cache = new Map<string, ArchivoCreditos | null>();

function leerCreditos(carpeta: string): ArchivoCreditos | null {
  if (cache.has(carpeta)) return cache.get(carpeta) ?? null;
  const ruta = path.join(process.cwd(), "public", carpeta, "CREDITOS.md");
  let datos: ArchivoCreditos | null = null;
  try {
    const texto = fs.readFileSync(ruta, "utf-8");
    const lineas = texto.split(/\r?\n/);
    const primeraEntrada = lineas.findIndex((l) => /^\s*(-|\|)/.test(l));
    datos = {
      cabecera: lineas.slice(0, primeraEntrada === -1 ? lineas.length : primeraEntrada).join(" "),
      lineas,
    };
  } catch {
    datos = null;
  }
  cache.set(carpeta, datos);
  return datos;
}

const RE_URL = /https?:\/\/[^\s)|»]+/;

function limpiar(linea: string, archivo: string): { texto: string; url?: string } {
  const url = linea.match(RE_URL)?.[0];
  let texto: string;
  if (linea.trim().startsWith("|")) {
    // Fila de tabla: nos quedamos con las celdas que no son el archivo ni una URL.
    texto = linea
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c && !c.includes(archivo) && !/^https?:\/\//.test(c))
      .map((c) => c.replace(RE_URL, "").replace(/\(\s*\)/g, "").trim())
      .filter(Boolean)
      .join(" · ");
  } else {
    texto = linea
      .replace(/^\s*-\s*/, "")
      .replace(new RegExp("`?" + archivo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`?"), "")
      .replace(RE_URL, "")
      .replace(/\(\s*\)/g, "")
      .replace(/\(original [^)]*\)/gi, "")
      .replace(/·\s*recortad[ao][^·]*$/i, "")
      .replace(/^[\s:—–-]+/, "")
      .trim();
  }
  texto = texto.replace(/\s{2,}/g, " ").replace(/[\s·,.;:—–-]+$/, "").trim();
  return { texto, url };
}

/**
 * Busca en el CREDITOS.md de la carpeta de cada imagen la línea que la
 * describe y devuelve el crédito listo para mostrar. Las imágenes remotas o
 * sin entrada en su CREDITOS.md se omiten.
 */
export function getCreditosFotos(
  srcs: string[],
  textos: { webOficial: string; fuente: string },
): CreditoFoto[] {
  const vistos = new Set<string>();
  const resultado: CreditoFoto[] = [];
  for (const src of srcs) {
    if (!src.startsWith("/") || vistos.has(src)) continue;
    vistos.add(src);
    const carpeta = path.posix.dirname(src);
    const archivo = path.posix.basename(src);
    const datos = leerCreditos(carpeta);
    if (!datos) continue;
    const linea = datos.lineas.find((l) => l.includes(archivo));
    if (!linea) continue;
    if (/aportada por|origen por confirmar/i.test(linea)) continue;
    const { texto, url } = limpiar(linea, archivo);
    const esWebOficial = /web oficial/i.test(datos.cabecera);
    const final = esWebOficial ? textos.webOficial : texto;
    if (!final) continue;
    resultado.push({ src, texto: final, url });
  }
  return resultado;
}
