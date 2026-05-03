import type { MetadataRoute } from "next";
import { obtenerListaGuias } from "@/lib/guias";
import { obtenerListaCiudades } from "@/lib/ciudades";
import {
  obtenerListaActividades,
  obtenerCiudadesConActividades,
} from "@/lib/actividades";
import { IDIOMAS_ACTIVOS, IDIOMA_DEFECTO } from "@/lib/i18n/config";
import {
  urlGuia,
  urlCiudad,
  urlActividad,
  urlActividadesDeCiudad,
  urlIndiceGuias,
  urlIndiceCiudades,
  urlAvisoLegal,
  urlPrivacidad,
  urlCookies,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

/**
 * Devuelve el bloque hreflang `alternates.languages` para una entrada
 * del sitemap, incluyendo también x-default. Usa la convención del
 * Metadata Sitemap API de Next 14.
 */
function alternatesPara(
  constructor: (idioma: Idioma) => string
): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const lang of IDIOMAS_ACTIVOS) {
    languages[lang] = `${SITE_URL}${constructor(lang)}`;
  }
  languages["x-default"] = `${SITE_URL}${constructor(IDIOMA_DEFECTO)}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ─── Rutas fijas (home, índices) ─────────────────────────────────
  for (const lang of IDIOMAS_ACTIVOS) {
    const prefijo = prefijoIdioma(lang);

    // Home
    entries.push({
      url: `${SITE_URL}${prefijo || "/"}`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
      alternates: alternatesPara((l) => `${prefijoIdioma(l)}/`),
    });

    // Índice de guías
    entries.push({
      url: `${SITE_URL}${urlIndiceGuias(lang)}`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: alternatesPara((l) => urlIndiceGuias(l)),
    });

    // Índice de ciudades
    entries.push({
      url: `${SITE_URL}${urlIndiceCiudades(lang)}`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: alternatesPara((l) => urlIndiceCiudades(l)),
    });
  }

  // ─── Páginas legales (todos los idiomas activos, con hreflang) ───
  for (const lang of IDIOMAS_ACTIVOS) {
    entries.push({
      url: `${SITE_URL}${urlAvisoLegal(lang)}`,
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: alternatesPara((l) => urlAvisoLegal(l)),
    });
    entries.push({
      url: `${SITE_URL}${urlPrivacidad(lang)}`,
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: alternatesPara((l) => urlPrivacidad(l)),
    });
    entries.push({
      url: `${SITE_URL}${urlCookies(lang)}`,
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: alternatesPara((l) => urlCookies(l)),
    });
  }

  // "Sobre nosotros" y "Contacto" (solo español por ahora — pendientes
  // de Sprint C-about-final y C-contacto). El About EN sí existe en
  // /en/about, pero el sitemap aún no lo incluye porque el handoff
  // recomienda completar Fase C antes de tocar canonicales SEO.
  const paginasFijasEs: Array<[string, number, "monthly" | "yearly"]> = [
    ["/sobre-nosotros", 0.6, "monthly"],
    ["/contacto", 0.5, "yearly"],
  ];
  for (const [path, priority, changeFrequency] of paginasFijasEs) {
    entries.push({
      url: `${SITE_URL}${path}`,
      lastModified: ahora,
      changeFrequency,
      priority,
    });
  }

  // ─── Guías de cada idioma activo ─────────────────────────────────
  for (const lang of IDIOMAS_ACTIVOS) {
    const guias = obtenerListaGuias(lang);
    for (const guia of guias) {
      entries.push({
        url: `${SITE_URL}${guia.url}`,
        lastModified: guia.fecha ? new Date(guia.fecha) : ahora,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: alternatesPara((l) =>
          urlGuia(l, guia.categoria, guia.slug)
        ),
      });
    }
  }

  // ─── Ciudades de cada idioma activo ──────────────────────────────
  for (const lang of IDIOMAS_ACTIVOS) {
    const ciudades = obtenerListaCiudades(lang);
    for (const ciudad of ciudades) {
      entries.push({
        url: `${SITE_URL}${ciudad.url}`,
        lastModified: ahora,
        changeFrequency: "monthly",
        priority: 0.85,
        alternates: alternatesPara((l) => urlCiudad(l, ciudad.slug)),
      });
    }
  }

  // ─── Listados de actividades por ciudad ──────────────────────────
  for (const lang of IDIOMAS_ACTIVOS) {
    const ciudadesConActividades = obtenerCiudadesConActividades(lang);
    for (const ciudad of ciudadesConActividades) {
      entries.push({
        url: `${SITE_URL}${urlActividadesDeCiudad(lang, ciudad)}`,
        lastModified: ahora,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: alternatesPara((l) => urlActividadesDeCiudad(l, ciudad)),
      });
    }
  }

  // ─── Fichas de actividad ─────────────────────────────────────────
  for (const lang of IDIOMAS_ACTIVOS) {
    const actividades = obtenerListaActividades(lang);
    for (const actividad of actividades) {
      entries.push({
        url: `${SITE_URL}${actividad.url}`,
        lastModified: actividad.fecha ? new Date(actividad.fecha) : ahora,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: alternatesPara((l) =>
          urlActividad(l, actividad.ciudad, actividad.slug)
        ),
      });
    }
  }

  return entries;
}
