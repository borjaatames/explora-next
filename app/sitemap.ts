import type { MetadataRoute } from "next";
import { obtenerCiudadesConGuias, obtenerListaGuias } from "@/lib/guias";
import { obtenerListaCiudades } from "@/lib/ciudades";
import {
  obtenerListaActividades,
  obtenerCiudadesConActividades,
  urlListadoActividadesSiExiste,
} from "@/lib/actividades";
import { IDIOMAS_ACTIVOS, IDIOMA_DEFECTO } from "@/lib/i18n/config";
import {
  urlGuia,
  urlCiudad,
  urlActividad,
  urlActividadesDeCiudad,
  urlGuiasDeCiudad,
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
import { rutaIndexable } from "@/lib/i18n/indexacion";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

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
    if (ruta !== null && rutaIndexable(ruta)) {
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

type IdiomaActivo = (typeof IDIOMAS_ACTIVOS)[number];

/** Fecha más reciente entre `fecha_actualizacion` y `fecha` (ISO). */
function fechaDe(item: { fecha?: string; fecha_actualizacion?: string }): Date | undefined {
  const iso = item.fecha_actualizacion || item.fecha;
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** La más reciente de una lista de fechas (o undefined si no hay ninguna). */
function masReciente(fechas: Array<Date | undefined>): Date | undefined {
  let max: Date | undefined;
  for (const f of fechas) if (f && (!max || f > max)) max = f;
  return max;
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

  // lastmod real: cada URL lleva la fecha editorial más reciente de su
  // contenido (fecha_actualizacion o fecha del .md). Los índices y listados
  // toman la más reciente de lo que enlazan. Las páginas legales no llevan
  // lastmod: no hay fecha fiable y una fecha inventada resta credibilidad.
  const entries: MetadataRoute.Sitemap = [];
  const guiasPorIdioma = new Map(
    IDIOMAS_ACTIVOS.map((l) => [l, obtenerListaGuias(l)] as const)
  );
  const actividadesPorIdioma = new Map(
    IDIOMAS_ACTIVOS.map((l) => [l, obtenerListaActividades(l)] as const)
  );
  const fechaGuias = (lang: IdiomaActivo, ciudad?: string) =>
    masReciente(
      (guiasPorIdioma.get(lang) ?? [])
        .filter((g) => !ciudad || g.categoria === ciudad)
        .map(fechaDe)
    );
  const fechaActividades = (lang: IdiomaActivo, ciudad?: string) =>
    masReciente(
      (actividadesPorIdioma.get(lang) ?? [])
        .filter((a) => !ciudad || a.ciudad === ciudad)
        .map(fechaDe)
    );

  // ─── Rutas fijas (home, índices) ─────────────────────────────────
  for (const lang of IDIOMAS_ACTIVOS) {
    const prefijo = prefijoIdioma(lang);

    // Home
    entries.push({
      url: `${SITE_URL}${prefijo || "/"}`,
      lastModified: masReciente([fechaGuias(lang), fechaActividades(lang)]),
      changeFrequency: "weekly",
      priority: 1,
      alternates: alternatesPara((l) => prefijoIdioma(l) || "/"),
    });

    // Índice de guías
    entries.push({
      url: `${SITE_URL}${urlIndiceGuias(lang)}`,
      lastModified: fechaGuias(lang),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: alternatesPara((l) => urlIndiceGuias(l)),
    });

    // Índice de ciudades
    entries.push({
      url: `${SITE_URL}${urlIndiceCiudades(lang)}`,
      lastModified: masReciente([fechaGuias(lang), fechaActividades(lang)]),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: alternatesPara((l) => urlIndiceCiudades(l)),
    });
  }

  // ─── Páginas legales (todos los idiomas activos, con hreflang) ───
  for (const lang of IDIOMAS_ACTIVOS) {
    entries.push({
      url: `${SITE_URL}${urlAvisoLegal(lang)}`,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: alternatesPara((l) => urlAvisoLegal(l)),
    });
    entries.push({
      url: `${SITE_URL}${urlPrivacidad(lang)}`,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: alternatesPara((l) => urlPrivacidad(l)),
    });
    entries.push({
      url: `${SITE_URL}${urlCookies(lang)}`,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: alternatesPara((l) => urlCookies(l)),
    });
  }

  // ─── Página de contacto (todos los idiomas activos, con hreflang) ─
  for (const lang of IDIOMAS_ACTIVOS) {
    entries.push({
      url: `${SITE_URL}${urlContacto(lang)}`,
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
    ["/proveedores", 0.4, "monthly"],
  ];
  for (const [path, priority, changeFrequency] of paginasFijasEs) {
    entries.push({
      url: `${SITE_URL}${path}`,
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
        lastModified: fechaDe(guia),
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
        lastModified: masReciente([
          fechaGuias(lang, ciudad.slug),
          fechaActividades(lang, ciudad.slug),
        ]),
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
        lastModified: fechaActividades(lang, ciudad),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: alternatesPara((l) => urlListadoActividadesSiExiste(l, ciudad)),
      });
    }
  }

  // ─── Listados de guías por ciudad ────────────────────────────────
  for (const lang of IDIOMAS_ACTIVOS) {
    const ciudadesConGuias = obtenerCiudadesConGuias(lang);
    for (const { ciudad } of ciudadesConGuias) {
      entries.push({
        url: `${SITE_URL}${urlGuiasDeCiudad(lang, ciudad)}`,
        lastModified: fechaGuias(lang, ciudad),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: alternatesPara((l) => urlGuiasDeCiudad(l, ciudad)),
      });
    }
  }

  // ─── Fichas de actividad ─────────────────────────────────────────
  for (const lang of IDIOMAS_ACTIVOS) {
    const actividades = obtenerListaActividades(lang);
    for (const actividad of actividades) {
      if (actividad.indexar === false) continue;
      entries.push({
        url: `${SITE_URL}${actividad.url}`,
        lastModified: fechaDe(actividad),
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

  // Fuera las URLs con noindex (alemán salvo islas): ver lib/i18n/indexacion.ts.
  return entries.filter((e) =>
    rutaIndexable(e.url.slice(SITE_URL.length) || "/")
  );
}
