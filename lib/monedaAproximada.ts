import type { Idioma } from "@/lib/i18n/types";

/**
 * Tipos de referencia del euro publicados por el BCE. Se actualizan a mano
 * (una vez al mes basta): el importe es orientativo y el cobro siempre es en
 * euros en GetYourGuide o Bókun.
 * Fuente: https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/
 */
export const TIPOS_CAMBIO_EUR = {
  fecha: "2026-11-03",
  USD: 1.1179,
  BRL: 6.1411,
} as const;

type MonedaAproximada = "USD" | "BRL";

/**
 * Moneda que se enseña como referencia en cada idioma: dólares en inglés
 * (clientes de EE. UU.) y reales en portugués (Brasil entra por /pt).
 */
const MONEDA_POR_IDIOMA: Partial<
  Record<Idioma, { codigo: MonedaAproximada; locale: string; etiqueta: string }>
> = {
  en: { codigo: "USD", locale: "en-US", etiqueta: "approx." },
  pt: { codigo: "BRL", locale: "pt-BR", etiqueta: "aprox." },
};

/**
 * Devuelve el precio convertido ya formateado («≈ $67 approx.») o `undefined`
 * si el idioma no lleva moneda de referencia o el precio no está en euros.
 */
export function precioAproximado(
  idioma: Idioma,
  importe: number,
  moneda: string | undefined
): string | undefined {
  const destino = MONEDA_POR_IDIOMA[idioma];
  if (!destino) return undefined;
  if ((moneda || "EUR").toUpperCase() !== "EUR") return undefined;
  if (!Number.isFinite(importe) || importe <= 0) return undefined;

  const convertido = importe * TIPOS_CAMBIO_EUR[destino.codigo];
  const texto = new Intl.NumberFormat(destino.locale, {
    style: "currency",
    currency: destino.codigo,
    maximumFractionDigits: 0,
  }).format(convertido);
  return `≈ ${texto} ${destino.etiqueta}`;
}
