import type { Idioma } from "@/lib/i18n/types";

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

function esEspanol(idioma: Idioma): boolean {
  return idioma === "es";
}

export function formatearPrecioBokun(
  precio: number,
  moneda: string | undefined,
  idioma: Idioma
): string {
  return new Intl.NumberFormat(esEspanol(idioma) ? "es-ES" : idioma === "de" ? "de-DE" : "en-GB", {
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
  const es = esEspanol(idioma);
  const de = idioma === "de";
  if (datos.porGrupo) return es ? "por grupo" : de ? "pro Gruppe" : "per group";
  const base = es ? "por persona" : de ? "pro Person" : "per person";
  const minimo = datos.minimoPersonas;
  if (typeof minimo !== "number" || minimo < 2) return base;
  if (de) return `${base} · mind. ${minimo} Personen`;
  return es ? `${base} · mínimo ${minimo}` : `${base} · min. ${minimo} people`;
}

export function textosPrecioBokun(
  datos: DatosPrecioBokun,
  idioma: Idioma
): TextosPrecioBokun {
  const es = esEspanol(idioma);
  return {
    desde: es ? "Desde" : idioma === "de" ? "Ab" : "From",
    precio: formatearPrecioBokun(datos.precioDesde, datos.moneda, idioma),
    unidad: textoUnidadBokun(datos, idioma),
    verFechas: es ? "Ver fechas disponibles" : idioma === "de" ? "Verfügbare Termine ansehen" : "Check availability",
  };
}
