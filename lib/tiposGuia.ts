import type { GuiaListItem } from "@/lib/guias";

/**
 * Tipos de guía para el índice /guias. Se deducen del slug (ES, EN y DE),
 * así que una guía nueva entra sola en su sección si sigue el patrón.
 */
export type TipoGuia = "excursiones" | "agotadas" | "itinerarios" | "elegir" | "comoVisitar";

const PATRONES: ReadonlyArray<[TipoGuia, RegExp]> = [
  ["agotadas", /(entradas-agotadas|tickets-sold-out|tickets-ausverkauft)/],
  ["excursiones", /(escapadas|excursiones|day-trips?|ausfluege|-desde-|-from-|-ab-)/],
  ["elegir", /(elegir|cual-|choose|which|comparativa|-o-en-grupo|or-group|-o-alcazar|-or-alcazar|-oder-)/],
  ["itinerarios", /(-en-\d|-en-un-dia|-en-dos-dias|-in-\d|-in-one-day|-in-two-days|-in-einem-tag|-tagen|-tage)/],
  ["comoVisitar", /(como-visitar|how-to-visit|besichtigen)/],
];

export function tipoDeGuia(slug: string): TipoGuia | null {
  for (const [tipo, re] of PATRONES) if (re.test(slug)) return tipo;
  return null;
}

export const ORDEN_TIPOS: ReadonlyArray<TipoGuia> = ["excursiones", "agotadas", "itinerarios", "elegir", "comoVisitar"];

export function agruparPorTipo(guias: GuiaListItem[]): Record<TipoGuia, GuiaListItem[]> {
  const grupos: Record<TipoGuia, GuiaListItem[]> = {
    excursiones: [],
    agotadas: [],
    itinerarios: [],
    elegir: [],
    comoVisitar: [],
  };
  for (const g of guias) {
    const tipo = tipoDeGuia(g.slug);
    if (tipo) grupos[tipo].push(g);
  }
  return grupos;
}
