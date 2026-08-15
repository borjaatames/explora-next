import type { Idioma, SegmentosUrl } from "./types";

export const IDIOMAS_CONFIGURADOS = [
  "es",
  "en",
  "de",
  "fr",
  "it",
  "pt",
] as const;

export const IDIOMAS_ACTIVOS = ["es", "en", "de"] as const satisfies readonly Idioma[];

export const IDIOMA_DEFECTO: Idioma = "es";

/**
 * Segmentos de URL traducibles por idioma.
 *
 * Las 3 legales (`avisoLegal`, `privacidad`, `cookies`) y `contacto` usan
 * slugs ES legacy en español y la convención EN estándar (`legal-notice`,
 * `privacy`, `cookies`, `contact`) en el resto de idiomas. Los placeholders
 * DE/FR/IT/PT se mantendrán con la convención EN hasta que se traduzcan
 * específicamente.
 */
export const URL_SEGMENTS: Record<Idioma, SegmentosUrl> = {
  es: {
    guias: "guias",
    ciudades: "ciudades",
    actividades: "actividades",
    atracciones: "atracciones",
    avisoLegal: "aviso-legal",
    privacidad: "privacidad",
    cookies: "cookies",
    contacto: "contacto",
  },
  en: {
    guias: "guides",
    ciudades: "cities",
    actividades: "activities",
    atracciones: "attractions",
    avisoLegal: "legal-notice",
    privacidad: "privacy",
    cookies: "cookies",
    contacto: "contact",
  },
  de: {
    guias: "guides",
    ciudades: "cities",
    actividades: "activities",
    atracciones: "attractions",
    avisoLegal: "legal-notice",
    privacidad: "privacy",
    cookies: "cookies",
    contacto: "contact",
  },
  fr: {
    guias: "guides",
    ciudades: "cities",
    actividades: "activities",
    atracciones: "attractions",
    avisoLegal: "legal-notice",
    privacidad: "privacy",
    cookies: "cookies",
    contacto: "contact",
  },
  it: {
    guias: "guides",
    ciudades: "cities",
    actividades: "activities",
    atracciones: "attractions",
    avisoLegal: "legal-notice",
    privacidad: "privacy",
    cookies: "cookies",
    contacto: "contact",
  },
  pt: {
    guias: "guides",
    ciudades: "cities",
    actividades: "activities",
    atracciones: "attractions",
    avisoLegal: "legal-notice",
    privacidad: "privacy",
    cookies: "cookies",
    contacto: "contact",
  },
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
