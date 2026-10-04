import { obtenerListaActividadesPorCiudad } from "./actividades";
import type { ActividadListItem } from "./actividades";
import { tokensDe } from "./guias";
import type { Idioma } from "./i18n/types";

// =============================================================================
// Actividades recomendadas al pie de una guía editorial
// -----------------------------------------------------------------------------
// Enlaza la guía (tráfico informacional) con fichas propias de la misma ciudad
// (tráfico transaccional). Nunca enlaza a afiliados: el lector llega a la
// ficha y reserva desde allí.
//
// Orden:
//   1. Fichas que citan esta guía en `guiasRelacionadas` (curación manual).
//   2. Afinidad temática entre la ficha y la guía (slug, título, keywords).
//   3. Número de opiniones, de mayor a menor (mismo criterio que la ciudad).
// =============================================================================

type GuiaReferencia = {
  slug: string;
  titulo: string;
  keywords?: string[];
};

function puntosAfinidad(
  tokensGuia: Set<string>,
  actividad: ActividadListItem
): number {
  const tokensActividad = tokensDe(
    [
      actividad.slug,
      actividad.titulo,
      ...(actividad.keywords ?? []),
      ...(actividad.atraccionesRelacionadas ?? []),
    ].join(" ")
  );
  let puntos = 0;
  tokensGuia.forEach((t) => {
    if (tokensActividad.has(t)) puntos += 1;
  });
  return puntos;
}

export function obtenerActividadesParaGuia(
  idioma: Idioma,
  ciudad: string,
  guia: GuiaReferencia,
  limite: number = 6
): ActividadListItem[] {
  const actividades = obtenerListaActividadesPorCiudad(idioma, ciudad);
  if (actividades.length === 0) return [];

  const tokensGuia = tokensDe(
    [guia.slug, guia.titulo, ...(guia.keywords ?? [])].join(" ")
  );

  return actividades
    .map((a) => ({
      a,
      citada: a.guiasRelacionadas?.includes(guia.slug) ? 1 : 0,
      puntos: puntosAfinidad(tokensGuia, a),
      opiniones: a.numeroOpiniones ?? 0,
    }))
    .sort(
      (x, y) =>
        y.citada - x.citada ||
        y.puntos - x.puntos ||
        y.opiniones - x.opiniones ||
        x.a.precioDesde - y.a.precioDesde
    )
    .slice(0, limite)
    .map(({ a }) => a);
}
