import { obtenerGuiasDeCiudad, type GuiaListItem } from "./guias";
import { obtenerListaActividadesPorCiudad, type ActividadListItem } from "./actividades";
import { obtenerListaCiudades } from "./ciudades";
import type { Idioma } from "./i18n/types";

/**
 * Tipos de guía «para planificar» que la portada, la página de ciudad y la de
 * cruceros enlazan. Se reconocen por el slug (ES, EN y DE) para no tener que
 * mantener listas a mano: una guía nueva con el patrón aparece sola.
 */
export type TipoGuiaPlan =
  | "navidad"
  | "crucero"
  | "itinerario"
  | "comparativa"
  | "ocasion"
  | "familia";

const PATRONES: Record<TipoGuiaPlan, RegExp> = {
  navidad: /^(navidad|christmas-in|weihnachten)-/,
  crucero: /cruceros-que-hacer|cruise-port-guide|kreuzfahrt-landgang/,
  itinerario:
    /(^|-)(en|in)-(\d+|un|una|one|dos|two|tres|three)-(dias?|days?)(-|$)|-\d+-days?$|\d+-day-itinerary/,
  comparativa:
    /privada-o-en-grupo|private-or-group|tuk-tuk|por-libre-grupo-o-privado|independent-group-or-private/,
  ocasion: /despedida|hen-and-stag|planes-en-pareja|romantic-things|grupos-empresas|group-and-team/,
  familia: /con-ninos|with-kids|mit-kindern/,
};

export function esGuiaDeTipo(slug: string, tipo: TipoGuiaPlan): boolean {
  return PATRONES[tipo].test(slug);
}

export function guiasDeTipo(
  idioma: Idioma,
  ciudad: string,
  tipo: TipoGuiaPlan
): GuiaListItem[] {
  return obtenerGuiasDeCiudad(idioma, ciudad).filter((g) => esGuiaDeTipo(g.slug, tipo));
}

/** Guía publicada de una ciudad por su slug ES (en EN/DE, la gemela vía `slugs.es`). */
export function guiaPorSlugEs(
  idioma: Idioma,
  ciudad: string,
  slugEs: string
): GuiaListItem | null {
  return (
    obtenerGuiasDeCiudad(idioma, ciudad).find((g) =>
      idioma === "es" ? g.slug === slugEs : g.slugs?.es === slugEs
    ) ?? null
  );
}

/** Ficha publicada de una ciudad por su slug ES (en EN, la gemela vía `slugs.es`). */
export function actividadPorSlugEs(
  idioma: Idioma,
  ciudad: string,
  slugEs: string
): ActividadListItem | null {
  return (
    obtenerListaActividadesPorCiudad(idioma, ciudad).find((a) =>
      idioma === "es" ? a.slug === slugEs : a.slugs?.es === slugEs
    ) ?? null
  );
}

export function nombresCiudades(idioma: Idioma): Map<string, string> {
  return new Map(obtenerListaCiudades(idioma).map((c) => [c.slug, c.nombre]));
}

/**
 * Temporada de Navidad: del 1 de noviembre al 6 de enero. Las páginas son
 * estáticas, así que se evalúa al compilar: cualquier despliegue después del
 * 6 de enero retira la franja y los botones.
 */
export function enTemporadaNavidad(hoy: Date = new Date()): boolean {
  const mes = hoy.getMonth();
  const dia = hoy.getDate();
  return mes === 10 || mes === 11 || (mes === 0 && dia <= 6);
}

export const CIUDADES_NAVIDAD = ["madrid", "barcelona", "sevilla", "malaga", "valencia", "granada"] as const;

/** Puertos de crucero con guía, en el orden en que se muestran. */
export const PUERTOS_CRUCERO: ReadonlyArray<{ ciudad: string; puerto: { es: string; en: string } }> = [
  { ciudad: "barcelona", puerto: { es: "Barcelona", en: "Barcelona" } },
  { ciudad: "malaga", puerto: { es: "Málaga", en: "Málaga" } },
  { ciudad: "cadiz", puerto: { es: "Cádiz", en: "Cádiz" } },
  { ciudad: "valencia", puerto: { es: "Valencia", en: "Valencia" } },
  { ciudad: "mallorca", puerto: { es: "Palma de Mallorca", en: "Palma de Mallorca" } },
  { ciudad: "tenerife", puerto: { es: "Santa Cruz de Tenerife", en: "Santa Cruz de Tenerife" } },
  { ciudad: "gran-canaria", puerto: { es: "Las Palmas de Gran Canaria", en: "Las Palmas de Gran Canaria" } },
  { ciudad: "bilbao", puerto: { es: "Bilbao (Getxo)", en: "Bilbao (Getxo)" } },
];

/** Fichas cuyo proveedor recoge en el muelle (comprobado en la descripción de cada una). */
export const EXCURSIONES_DESDE_PUERTO: ReadonlyArray<{ ciudad: string; slugEs: string }> = [
  { ciudad: "cadiz", slugEs: "sevilla-excursion-cruceristas-puerto-cadiz" },
  { ciudad: "malaga", slugEs: "alhambra-granada-excursion-cruceristas-puerto-malaga" },
  { ciudad: "cadiz", slugEs: "sevilla-excursion-privada-desde-cadiz" },
  { ciudad: "cadiz", slugEs: "sevilla-alcazar-catedral-excursion-privada-desde-cadiz" },
  { ciudad: "cadiz", slugEs: "cordoba-excursion-privada-desde-cadiz" },
  { ciudad: "cadiz", slugEs: "malaga-excursion-privada-desde-cadiz" },
  { ciudad: "barcelona", slugEs: "sagrada-familia-visita-privada-guia-entradas" },
];

export type GuiaPuerto = { ciudad: string; puerto: string; guia: GuiaListItem };

export function guiasDePuertos(idioma: Idioma): GuiaPuerto[] {
  const clave = idioma === "en" ? "en" : "es";
  return PUERTOS_CRUCERO.flatMap(({ ciudad, puerto }) => {
    const guia = guiasDeTipo(idioma, ciudad, "crucero")[0];
    return guia ? [{ ciudad, puerto: puerto[clave], guia }] : [];
  });
}

export function urlCruceros(idioma: Idioma): string {
  return idioma === "en" ? "/en/cruise-excursions" : "/cruceros";
}
