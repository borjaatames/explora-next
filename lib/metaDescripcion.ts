import type { Idioma } from "@/lib/i18n/types";

/**
 * Metadescripciones de listados (ciudad, actividades, categorías, guías).
 *
 * Bing marcaba como «demasiado cortas» (<110 caracteres) unas 650 páginas
 * generadas con una frase fija. Aquí se amplían con datos reales del listado
 * (número de opciones, precio mínimo y ejemplos) hasta 140-160 caracteres.
 */

const MAX = 160;
const OBJETIVO = 140;

type ItemConPrecio = { titulo: string; precioDesde?: number };
type ItemConTitulo = { titulo: string };

const FORMATO_NUMERO: Record<Idioma, string> = {
  es: "es-ES",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
};

const TEXTOS: Record<
  Idioma,
  {
    opciones: (n: number, desde: string | null) => string;
    como: string;
    guias: (n: number) => string;
  }
> = {
  es: {
    opciones: (n, d) => `${n} ${n === 1 ? "opción" : "opciones"}${d ? ` desde ${d}` : ""}`,
    como: "como",
    guias: (n) => `${n} ${n === 1 ? "guía" : "guías"}`,
  },
  en: {
    opciones: (n, d) => `${n} ${n === 1 ? "option" : "options"}${d ? ` from ${d}` : ""}`,
    como: "such as",
    guias: (n) => `${n} ${n === 1 ? "guide" : "guides"}`,
  },
  de: {
    opciones: (n, d) => `${n} ${n === 1 ? "Angebot" : "Angebote"}${d ? ` ab ${d}` : ""}`,
    como: "z. B.",
    guias: (n) => `${n} ${n === 1 ? "Reiseführer" : "Reiseführer"}`,
  },
  fr: {
    opciones: (n, d) => `${n} ${n === 1 ? "option" : "options"}${d ? ` dès ${d}` : ""}`,
    como: "comme",
    guias: (n) => `${n} ${n === 1 ? "guide" : "guides"}`,
  },
  it: {
    opciones: (n, d) => `${n} ${n === 1 ? "opzione" : "opzioni"}${d ? ` da ${d}` : ""}`,
    como: "come",
    guias: (n) => `${n} ${n === 1 ? "guida" : "guide"}`,
  },
  pt: {
    opciones: (n, d) => `${n} ${n === 1 ? "opção" : "opções"}${d ? ` desde ${d}` : ""}`,
    como: "como",
    guias: (n) => `${n} ${n === 1 ? "guia" : "guias"}`,
  },
};

const PALABRAS_DEBILES =
  /\s+(con|y|de|del|la|el|los|las|a|al|en|por|para|with|and|of|the|to|in|for|mit|und|von|der|die|das|zum|zur|avec|et|de|du|des|le|les|pour|con|e|di|del|della|il|lo|per|com|do|da|dos|das|o|em|para)$/i;

/**
 * Título corto para listar ejemplos. En actividades quita el prefijo
 * «Ciudad: » de GYG; en guías se queda con lo que va antes de los dos puntos.
 */
function tituloCorto(titulo: string, tipo: "actividad" | "guia"): string {
  const i = titulo.indexOf(":");
  let base =
    i < 0 ? titulo : tipo === "actividad" ? titulo.slice(i + 1).trim() || titulo : titulo.slice(0, i).trim();
  // Corta en el primer separador («—», «|», «(», « + »): lo que sigue suele ser detalle.
  base = base.split(/\s[—–|+]\s?|\s\(/)[0].trim();
  if (base.length > 42) base = base.slice(0, 42).replace(/[\s,;:.-]+\S*$/, "");
  while (PALABRAS_DEBILES.test(base)) base = base.replace(PALABRAS_DEBILES, "");
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** Recorta en un límite de palabra sin pasar de `max`. */
function recortar(texto: string, max: number = MAX): string {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1).replace(/[\s,;:]+\S*$/, "").replace(/[\s,;:.…—-]+$/, "");
  return `${corte}…`;
}

/**
 * Añade frases a `base` mientras no llegue a ~140 caracteres y sin pasar de
 * 160. Si `base` ya es suficiente, se devuelve tal cual.
 */
export type ExtraDescripcion = string | ((espacio: number) => string);

export function ampliarDescripcion(base: string, extras: readonly ExtraDescripcion[]): string {
  let texto = base.trim();
  for (const extra of extras) {
    if (texto.length >= OBJETIVO) break;
    const espacio = MAX - texto.length - 2;
    const limpio = (typeof extra === "function" ? extra(espacio) : extra).trim();
    if (!limpio) continue;
    const candidato = `${texto.replace(/\.?$/, ".")} ${limpio}`;
    texto = candidato.length <= MAX ? candidato : recortar(candidato);
  }
  return recortar(texto);
}

/** «12 opciones desde 18 €, como Catedral y Giralda, Alcázar…» */
export function resumenActividades(
  idioma: Idioma,
  items: readonly ItemConPrecio[]
): ExtraDescripcion {
  if (items.length === 0) return "";
  const t = TEXTOS[idioma];
  const precios = items
    .map((a) => a.precioDesde ?? 0)
    .filter((p) => p > 0);
  const min = precios.length > 0 ? Math.min(...precios) : null;
  const desde =
    min !== null
      ? `${new Intl.NumberFormat(FORMATO_NUMERO[idioma], { maximumFractionDigits: 2 }).format(min)} €`
      : null;
  const cabeza = t.opciones(items.length, desde);
  const ejemplos = items.slice(0, 3).map((a) => tituloCorto(a.titulo, "actividad"));
  return (espacio: number) => conEjemplos(`${cabeza}, ${t.como} `, `${cabeza}.`, ejemplos, espacio);
}

/** Añade ejemplos enteros mientras quepan; si no cabe ninguno, solo la cabeza. */
function conEjemplos(prefijo: string, soloCabeza: string, ejemplos: string[], espacio: number): string {
  const elegidos: string[] = [];
  for (const e of ejemplos) {
    const prueba = `${prefijo}${[...elegidos, e].join(", ")}.`;
    if (prueba.length > espacio) break;
    elegidos.push(e);
  }
  return elegidos.length > 0 ? `${prefijo}${elegidos.join(", ")}.` : soloCabeza;
}

/** «8 guías: Granada en 2 días, Alhambra…» */
export function resumenGuias(idioma: Idioma, items: readonly ItemConTitulo[]): ExtraDescripcion {
  if (items.length === 0) return "";
  const t = TEXTOS[idioma];
  const ejemplos = items.slice(0, 3).map((g) => tituloCorto(g.titulo, "guia"));
  return (espacio: number) =>
    conEjemplos(`${t.guias(items.length)}: `, `${t.guias(items.length)}.`, ejemplos, espacio);
}
