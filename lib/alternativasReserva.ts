import type { ActividadListItem } from "./actividades";
import { obtenerGuiasDeCiudad, type GuiaListItem } from "./guias";
import type { Idioma } from "./i18n/types";
import { indexarFichasCiudad } from "./guiasReservas";

/** El aviso de la propia ficha ya dice que se agota (en cualquiera de los 6 idiomas). */
const RE_SE_AGOTA = /agot|sells? out|sold out|ausverkauft|complet|esaur|esgot/i;

const MAX_ALTERNATIVAS = 2;

const RE_GUIA_AGOTADAS_ES = /-entradas-agotadas$/;
const PALABRAS_VACIAS = new Set(["de", "del", "la", "el", "los", "las"]);

/**
 * Guía de «entradas agotadas» del mismo monumento que la ficha: aquella cuyo
 * tema (slug ES sin «-entradas-agotadas») está entero en el slug ES de la
 * ficha («alhambra», «alcazar sevilla»…) o, si ninguna, la que la cita.
 */
function guiaAgotadaDelMonumento(
  idioma: Idioma,
  ciudad: string,
  slugEsFicha: string
): GuiaListItem | undefined {
  const guias = obtenerGuiasDeCiudad(idioma, ciudad).filter(
    (g) => g.opciones && RE_GUIA_AGOTADAS_ES.test(g.slugs?.es ?? g.slug)
  );
  // Si la ficha combina dos monumentos, gana el que aparece antes en su slug.
  const palabrasFicha = slugEsFicha.split("-");
  let mejor: { guia: GuiaListItem; posicion: number } | undefined;
  for (const g of guias) {
    const tema = (g.slugs?.es ?? g.slug)
      .replace(RE_GUIA_AGOTADAS_ES, "")
      .split("-")
      .filter((p) => !PALABRAS_VACIAS.has(p));
    if (tema.length === 0 || !tema.every((p) => palabrasFicha.includes(p))) continue;
    const posicion = palabrasFicha.indexOf(tema[0]);
    if (!mejor || posicion < mejor.posicion) mejor = { guia: g, posicion };
  }
  if (mejor) return mejor.guia;
  return guias.find(
    (g) =>
      (g.actividades ?? []).includes(slugEsFicha) ||
      (g.opciones ?? []).some((o) => o.ficha === slugEsFicha)
  );
}

const MOTIVO_AGOTA: Record<Idioma, string> = {
  es: "Suele agotarse con antelación. Si no hay fecha para tu día, prueba estas opciones:",
  en: "It often sells out in advance. If your date is gone, try these options:",
  de: "Oft schon im Voraus ausverkauft. Ist dein Datum weg, probiere diese Optionen:",
  fr: "Souvent complet à l'avance. Si votre date n'est plus disponible, essayez ces options :",
  it: "Spesso esaurito in anticipo. Se la tua data non c'è più, prova queste opzioni:",
  pt: "Esgota muitas vezes com antecedência. Se a sua data já não estiver disponível, experimente estas opções:",
};

export type AlternativasFicha = {
  alternativas: ActividadListItem[];
  motivo: string;
};

/**
 * Alternativas que se ofrecen arriba en la ficha: la manual del frontmatter
 * (`alternativa:`) si la hay; si no, cuando la ficha avisa de que se agota y
 * su monumento tiene guía de «entradas agotadas», dos opciones de esa guía.
 * Solo afirma que se agota cuando el aviso de la propia ficha ya lo dice.
 */
export function obtenerAlternativasFicha(
  idioma: Idioma,
  ciudad: string,
  actividad: ActividadListItem,
  manual: ActividadListItem | undefined
): AlternativasFicha | null {
  // La alternativa escrita a mano lleva su propio motivo: se respeta tal cual.
  if (manual && actividad.alternativa) {
    return { alternativas: [manual], motivo: actividad.alternativa.motivo };
  }
  const alternativas: ActividadListItem[] = [];
  const slugEsPropio = actividad.slugs?.es ?? actividad.slug;

  const guiaAgotada = RE_SE_AGOTA.test(actividad.avisoReserva ?? "")
    ? guiaAgotadaDelMonumento(idioma, ciudad, slugEsPropio)
    : undefined;
  if (guiaAgotada?.opciones) {
    const indice = indexarFichasCiudad(idioma, ciudad);
    for (const opcion of guiaAgotada.opciones) {
      if (alternativas.length >= MAX_ALTERNATIVAS) break;
      if (opcion.ficha === slugEsPropio) continue;
      const candidata = indice.get(opcion.ficha);
      if (!candidata || candidata.url === actividad.url) continue;
      if (alternativas.some((a) => a.url === candidata.url)) continue;
      alternativas.push(candidata);
    }
  }

  if (alternativas.length === 0) return null;
  return {
    alternativas,
    motivo: MOTIVO_AGOTA[idioma],
  };
}
