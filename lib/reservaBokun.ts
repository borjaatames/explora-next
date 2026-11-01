import type { Idioma } from "@/lib/i18n/types";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";

/** Ancla del bloque de reserva Bókun en la ficha (CTA de cabecera y barra móvil). */
export const ANCLA_RESERVA = "reservar";

export type DatosPrecioBokun = {
  precioDesde: number;
  moneda?: string;
  /** true → precio por grupo (experiencias privadas con tarifa cerrada). */
  porGrupo: boolean;
  /** Mínimo de personas por reserva cuando el precio es por persona. */
  minimoPersonas?: number;
};

/** Precio total de una privada para un tamaño de grupo (tarifa más barata de Bókun). */
export type PrecioGrupo = { personas: number; total: number };

export type TextosPrecioBokun = {
  desde: string;
  precio: string;
  unidad: string;
  verFechas: string;
};

const TEXTOS: Record<
  Idioma,
  {
    desde: string;
    porGrupo: string;
    porPersona: string;
    minimo: (n: number) => string;
    verFechas: string;
  }
> = {
  es: {
    desde: "Desde",
    porGrupo: "por grupo",
    porPersona: "por persona",
    minimo: (n) => `mínimo ${n}`,
    verFechas: "Ver fechas disponibles",
  },
  en: {
    desde: "From",
    porGrupo: "per group",
    porPersona: "per person",
    minimo: (n) => `min. ${n} people`,
    verFechas: "Check availability",
  },
  de: {
    desde: "Ab",
    porGrupo: "pro Gruppe",
    porPersona: "pro Person",
    minimo: (n) => `mind. ${n} Personen`,
    verFechas: "Verfügbare Termine ansehen",
  },
  fr: {
    desde: "À partir de",
    porGrupo: "par groupe",
    porPersona: "par personne",
    minimo: (n) => `min. ${n} personnes`,
    verFechas: "Voir les disponibilités",
  },
  it: {
    desde: "Da",
    porGrupo: "a gruppo",
    porPersona: "a persona",
    minimo: (n) => `min. ${n} persone`,
    verFechas: "Vedi le date disponibili",
  },
  pt: {
    desde: "Desde",
    porGrupo: "por grupo",
    porPersona: "por pessoa",
    minimo: (n) => `mín. ${n} pessoas`,
    verFechas: "Ver datas disponíveis",
  },
};

/** Locale de precios: en inglés se mantiene en-GB (formato europeo de la web). */
function localePrecio(idioma: Idioma): string {
  return idioma === "en" ? "en-GB" : IDIOMA_LOCALE[idioma];
}

export function formatearPrecioBokun(
  precio: number,
  moneda: string | undefined,
  idioma: Idioma
): string {
  return new Intl.NumberFormat(localePrecio(idioma), {
    style: "currency",
    currency: moneda || "EUR",
    maximumFractionDigits: 0,
  }).format(precio);
}

/** "por persona · mínimo 2" / "per person · min. 2 people" / "por grupo". */
export function textoUnidadBokun(
  datos: Pick<DatosPrecioBokun, "porGrupo" | "minimoPersonas">,
  idioma: Idioma
): string {
  const t = TEXTOS[idioma];
  if (datos.porGrupo) return t.porGrupo;
  const minimo = datos.minimoPersonas;
  if (typeof minimo !== "number" || minimo < 2) return t.porPersona;
  return `${t.porPersona} · ${t.minimo(minimo)}`;
}

export function textosPrecioBokun(
  datos: DatosPrecioBokun,
  idioma: Idioma
): TextosPrecioBokun {
  const t = TEXTOS[idioma];
  return {
    desde: t.desde,
    precio: formatearPrecioBokun(datos.precioDesde, datos.moneda, idioma),
    unidad: textoUnidadBokun(datos, idioma),
    verFechas: t.verFechas,
  };
}
