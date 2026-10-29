import type { PrecioGrupo } from "@/lib/reservaBokun";

/**
 * Las privadas de Bókun se venden por grupo (760 € para 1-2) y en los
 * listados conviven con tours en grupo que se anuncian por persona (35 €).
 * Para compararlas de forma honesta usamos lo que sale por persona en un
 * grupo de referencia (4, o el mayor tramo por debajo) con el total de Bókun.
 */
export type PrecioComparable = {
  /** Cifra principal: precio por persona (real o del grupo de referencia). */
  porPersona: number;
  /** El producto se vende por grupo. */
  porGrupo: boolean;
  /** Tamaño del grupo de referencia y su total, si hay tramos de Bókun. */
  personasReferencia?: number;
  totalReferencia?: number;
};

const PERSONAS_REFERENCIA = 4;

/** Corta en el primer total que baja: tramos mal configurados en Bókun. */
export function tramosCoherentes(precios: ReadonlyArray<PrecioGrupo>): PrecioGrupo[] {
  const ordenados = [...precios].sort((a, b) => a.personas - b.personas);
  const resultado: PrecioGrupo[] = [];
  for (const p of ordenados) {
    const anterior = resultado[resultado.length - 1];
    if (anterior && p.total < anterior.total) break;
    resultado.push(p);
  }
  return resultado;
}

export function precioComparable(datos: {
  precioDesde: number;
  precioPorGrupo?: boolean;
  preciosGrupo?: ReadonlyArray<PrecioGrupo>;
}): PrecioComparable {
  if (!datos.precioPorGrupo) {
    return { porPersona: datos.precioDesde, porGrupo: false };
  }
  const tramos = tramosCoherentes(datos.preciosGrupo ?? []).filter(
    (t) => t.personas > 1 && t.personas <= PERSONAS_REFERENCIA
  );
  const referencia = tramos[tramos.length - 1];
  if (!referencia) {
    return { porPersona: datos.precioDesde, porGrupo: true };
  }
  return {
    porPersona: Math.round(referencia.total / referencia.personas),
    porGrupo: true,
    personasReferencia: referencia.personas,
    totalReferencia: referencia.total,
  };
}
