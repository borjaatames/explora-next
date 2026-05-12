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
  urlContacto,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import {
  slugParejaActividad,
  slugParejaGuia,
  slugParejaCiudad,
} from "@/lib/i18n/slugs";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

/**
 * Devuelve el bloque hreflang `alternates.languages` para una entrada
 * del sitemap, incluyendo también x-default. Usa la convención del
 * Metadata Sitemap API de Next 14.
 *
 * Si `constructor` devuelve `null` para un idioma, ese idioma se omite
 * (caso típico: una actividad publicada solo en inglés sin pareja en
 * español). `x-default` apunta al idioma por defecto si tiene URL; en
 * caso contrario, al primer idioma con URL disponible.
 */
function alternatesPara(
  constructor: (idioma: Idioma) => string | null
): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const lang of IDIOMAS_ACTIVOS) {
    const ruta = constructor(lang);
    if (ruta !== null) {
      languages[lang] = `${SITE_URL}${ruta}`;
    }
  }
  const rutaDefault = constructor(IDIOMA_DEFECTO);
  if (rutaDefault !== null) {
    languages["x-default"] = `${SITE_URL}${rutaDefault}`;
  } else {
    const primera = IDIOMAS_ACTIVOS.find((l) => constructor(l) !== null);
    if (primera) {
      const ruta = constructor(primera);
      if (ruta !== null) languages["x-default"] = `${SITE_URL}${ruta}`;
    }
  }
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Guard de indexación: si la flag no está activa (preview, staging,
  // desarrollo), devolvemos sitemap vacío. Mantiene coherencia con
  // `robots.ts`, que ya devuelve `disallow: "/"` en ese mismo caso.
  // Sin este guard, `/sitemap.xml` expone toda la arquitectura URL aunque
  // robots.txt diga disallow, lo que filtra el árbol de URLs antes de
  // tiempo a Google y a cualquier scraper que pida el endpoint.
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") {
    return [];
  }

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

  // ─── Página de contacto (todos los idiomas activos, con hreflang) ─
  for (const lang of IDIOMAS_ACTIVOS) {
    entries.push({
      url: `${SITE_URL}${urlContacto(lang)}`,
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.5,
      alternates: alternatesPara((l) => urlContacto(l)),
    });
  }

  // "Sobre nosotros" (solo español por ahora — pendiente de Sprint
  // C-about-final). El About EN sí existe en /en/about, pero el sitemap
  // aún no lo incluye porque el handoff recomienda completar Fase C antes
  // de tocar canonicales SEO.
  const paginasFijasEs: Array<[string, number, "monthly" | "yearly"]> = [
    ["/sobre-nosotros", 0.6, "monthly"],
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
        alternates: alternatesPara((l) => {
          const slugPareja = slugParejaGuia(
            lang,
            guia.categoria,
            guia.slug,
            l
          );
          return slugPareja
            ? urlGuia(l, guia.categoria, slugPareja)
            : null;
        }),
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
        alternates: alternatesPara((l) => {
          const slugPareja = slugParejaCiudad(lang, ciudad.slug, l);
          return slugPareja ? urlCiudad(l, slugPareja) : null;
        }),
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
        alternates: alternatesPara((l) => {
          const slugPareja = slugParejaActividad(
            lang,
            actividad.ciudad,
            actividad.slug,
            l
          );
          return slugPareja
            ? urlActividad(l, actividad.ciudad, slugPareja)
            : null;
        }),
      });
    }
  }

  return entries;
}
