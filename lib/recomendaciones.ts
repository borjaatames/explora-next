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
// Regla: la guía declara en su frontmatter `actividades` (slugs ES) las
// fichas de las que habla, y el carrusel muestra exactamente esas, en ese
// orden. Nunca se rellena con otras fichas de la ciudad: cada guía ofrece lo
// que recomienda, no lo que haya.
//
// Compatibilidad: si una guía aún no declara `actividades`, se usa el
// criterio antiguo (fichas que la citan en `guiasRelacionadas`, afinidad
// temática y opiniones).
// =============================================================================

type GuiaReferencia = {
  slug: string;
  titulo: string;
  keywords?: string[];
  actividades?: string[];
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

  if (guia.actividades && guia.actividades.length > 0) {
    const porSlugEs = new Map<string, ActividadListItem>();
    actividades.forEach((a) => {
      porSlugEs.set(a.slugs?.es ?? a.slug, a);
      porSlugEs.set(a.slug, a);
    });
    const vistas = new Set<string>();
    const curadas: ActividadListItem[] = [];
    guia.actividades.forEach((slugEs) => {
      const a = porSlugEs.get(slugEs);
      if (a && !vistas.has(a.url)) {
        vistas.add(a.url);
        curadas.push(a);
      }
    });
    return curadas.slice(0, 10);
  }

  const tokensGuia = tokensDe(
    [guia.slug, guia.titulo, ...(guia.keywords ?? [])].join(" ")
  );

  const ordenadas = actividades
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
    );

  // Las fichas curadas para esta guía salen todas aunque superen el límite
  // (con un tope de 8 para no alargar el carrusel sin fin).
  const curadas = ordenadas.filter((x) => x.citada === 1).length;
  const total = Math.min(Math.max(limite, curadas), 8);

  return ordenadas.slice(0, total).map(({ a }) => a);
}
