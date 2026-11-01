import type { Idioma } from "@/lib/i18n/types";
import { obtenerCiudadesConActividades, obtenerListaActividadesPorCiudad } from "@/lib/actividades";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { aCardData } from "@/lib/cardActividad";
import {
  esSoloAdultos,
  type ActividadPlanificador,
  type CiudadPlanificador,
} from "@/lib/planificador";

/** Ciudades con un mínimo de actividades para que la propuesta tenga sentido. */
const MIN_ACTIVIDADES = 6;

export function obtenerCiudadesPlanificador(idioma: Idioma): CiudadPlanificador[] {
  const nombres = new Map(obtenerListaCiudades(idioma).map((c) => [c.slug, c.nombre]));
  return obtenerCiudadesConActividades(idioma)
    .map((slug) => ({
      slug,
      nombre: nombres.get(slug) ?? slug,
      total: obtenerListaActividadesPorCiudad(idioma, slug).length,
    }))
    .filter((c) => c.total >= MIN_ACTIVIDADES)
    .sort((a, b) => b.total - a.total);
}

export function obtenerActividadesPlanificador(
  idioma: Idioma,
  ciudad: string
): ActividadPlanificador[] {
  return obtenerListaActividadesPorCiudad(idioma, ciudad).map((a) => ({
    ...aCardData(a),
    edadMinima: a.detallesPracticos?.edadMinima,
    soloAdultos: esSoloAdultos(a.titulo, a.categoria),
    duracionMinutos: a.duracionMinutos,
  }));
}
