import type { Idioma, SegmentosUrl } from "./types";

export const IDIOMAS_CONFIGURADOS = [
  "es",
  "en",
  "de",
  "fr",
  "it",
  "pt",
] as const;

export const IDIOMAS_ACTIVOS = ["es", "en"] as const satisfies readonly Idioma[];

export const IDIOMA_DEFECTO: Idioma = "es";

/**
 * Segmentos de URL traducibles por idioma.
 * `actividades` está reservado para una futura sección de afiliación
 * (Civitatis/GetYourGuide). No hay rutas todavía, pero el slug ya está
 * definido para no tener que tocar todas las URLs cuando se active.
 */
export const URL_SEGMENTS: Record<Idioma, SegmentosUrl> = {
  es: { guias: "guias", ciudades: "ciudades", actividades: "actividades" },
  en: { guias: "guides", ciudades: "cities", actividades: "activities" },
  de: { guias: "guides", ciudades: "cities", actividades: "activities" },
  fr: { guias: "guides", ciudades: "cities", actividades: "activities" },
  it: { guias: "guides", ciudades: "cities", actividades: "activities" },
  pt: { guias: "guides", ciudades: "cities", actividades: "activities" },
};

export const IDIOMA_LABELS: Record<Idioma, { nombre: string; bandera: string }> =
  {
    es: { nombre: "Español", bandera: "🇪🇸" },
    en: { nombre: "English", bandera: "🇬🇧" },
    de: { nombre: "Deutsch", bandera: "🇩🇪" },
    fr: { nombre: "Français", bandera: "🇫🇷" },
    it: { nombre: "Italiano", bandera: "🇮🇹" },
    pt: { nombre: "Português", bandera: "🇵🇹" },
  };

export const IDIOMA_LOCALE: Record<Idioma, string> = {
  es: "es-ES",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
};

export const COOKIE_LOCALE = "NEXT_LOCALE";

export function esIdiomaValido(valor: string): valor is Idioma {
  return (IDIOMAS_CONFIGURADOS as readonly string[]).includes(valor);
}

export function esIdiomaActivo(valor: string): valor is Idioma {
  return (IDIOMAS_ACTIVOS as readonly string[]).includes(valor);
}
