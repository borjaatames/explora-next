import type { Idioma } from "@/lib/i18n/types";
import { urlActividad } from "@/lib/i18n/utils";

/** Texto en los idiomas activos de la página de proveedores. */
export type TextoIdiomas = Readonly<{ es: string; en: string; de: string }>;

/** Ficha nuestra de una actividad del proveedor (enlace interno). */
export type ActividadProveedor = Readonly<{
  ciudad: string;
  slugEs: string;
  slugEn: string;
  nombre: TextoIdiomas;
}>;

/**
 * Proveedor local con el que trabajamos y que ha aceptado el intercambio
 * de enlaces. La URL externa es la que nos ha indicado el propio proveedor.
 */
export type ProveedorLocal = Readonly<{
  id: string;
  nombre: string;
  web: string;
  ciudades: TextoIdiomas;
  descripcion: TextoIdiomas;
  actividades: ReadonlyArray<ActividadProveedor>;
}>;

export const PROVEEDORES_LOCALES: ReadonlyArray<ProveedorLocal> = [
  {
    id: "daremapp",
    nombre: "DareMapp",
    // URL indicada por DareMapp (Ricardo Hernández) el 28-10-2026.
    web: "https://daremapp.com/es/visitas-guiadas/",
    ciudades: {
      es: "Madrid, Barcelona, Sevilla, Granada, Córdoba, Málaga, Valencia y otras 7 ciudades",
      en: "Madrid, Barcelona, Seville, Granada, Cordoba, Malaga, Valencia and 7 more cities",
      de: "Madrid, Barcelona, Sevilla, Granada, Córdoba, Málaga, Valencia und 7 weitere Städte",
    },
    descripcion: {
      es: "Tours autoguiados con app: recorres la ciudad a tu ritmo con un itinerario, audio y explicaciones en el móvil.",
      en: "App-based self-guided tours: explore the city at your own pace with a route, audio and stories on your phone.",
      de: "Selbstgeführte Touren per App: Du erkundest die Stadt in deinem Tempo, mit Route, Audio und Geschichten auf dem Handy.",
    },
    actividades: [
      {
        ciudad: "madrid",
        slugEs: "tour-autoguiado-daremapp-madrid",
        slugEn: "self-guided-tour-daremapp-madrid",
        nombre: { es: "Madrid", en: "Madrid", de: "Madrid" },
      },
      {
        ciudad: "barcelona",
        slugEs: "tour-autoguiado-daremapp-barcelona",
        slugEn: "self-guided-tour-daremapp-barcelona",
        nombre: { es: "Barcelona", en: "Barcelona", de: "Barcelona" },
      },
      {
        ciudad: "sevilla",
        slugEs: "tour-autoguiado-daremapp-sevilla",
        slugEn: "self-guided-tour-daremapp-sevilla",
        nombre: { es: "Sevilla", en: "Seville", de: "Sevilla" },
      },
      {
        ciudad: "granada",
        slugEs: "tour-autoguiado-daremapp-granada",
        slugEn: "self-guided-tour-daremapp-granada",
        nombre: { es: "Granada", en: "Granada", de: "Granada" },
      },
    ],
  },
];

/** Ruta de la página de proveedores en cada idioma. */
export function urlProveedores(idioma: Idioma): string {
  return idioma === "es" ? "/proveedores" : `/${idioma}/partners`;
}

/**
 * URL de nuestra ficha de una actividad del proveedor. En alemán no hay
 * fichas propias de estas actividades, así que no se enlazan.
 */
export function urlActividadProveedor(
  idioma: Idioma,
  actividad: ActividadProveedor
): string | null {
  if (idioma === "es") {
    return urlActividad("es", actividad.ciudad, actividad.slugEs);
  }
  if (idioma === "en") {
    return urlActividad("en", actividad.ciudad, actividad.slugEn);
  }
  return null;
}

export function textoEn(idioma: Idioma, texto: TextoIdiomas): string {
  if (idioma === "en") return texto.en;
  if (idioma === "de") return texto.de;
  return texto.es;
}
