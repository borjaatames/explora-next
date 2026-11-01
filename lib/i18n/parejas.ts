import type { Idioma } from "./types";
import { IDIOMAS_ACTIVOS } from "./config";
import {
  slugParejaActividad,
  slugParejaCiudad,
  slugParejaGuia,
} from "./slugs";
import {
  prefijoIdioma,
  urlActividad,
  urlActividadesDeCiudad,
  urlAvisoLegal,
  urlCiudad,
  urlContacto,
  urlCookies,
  urlGuia,
  urlGuiasDeCiudad,
  urlIndiceCiudades,
  urlIndiceGuias,
  urlPrivacidad,
} from "./utils";
import {
  idiomasConGuias,
  obtenerCiudadesConGuias,
  obtenerTodosLosCaminos,
} from "../guias";
import { obtenerTodosLosCaminosCiudades } from "../ciudades";
import {
  obtenerCiudadesConActividades,
  obtenerTodosLosCaminosActividades,
  urlListadoActividadesSiExiste,
} from "../actividades";

/**
 * Mapa de URL del sitio → URLs pareja en cada idioma activo.
 *
 * Construido en build time leyendo filesystem (`content/`) y aplicando los
 * helpers `slugParejaX`. El resultado es un objeto JSON puro que viaja al
 * cliente embebido en el bundle del Navbar.
 *
 * Estructura:
 *
 *   {
 *     "/ciudades/madrid/actividades/tour-prado": {
 *       es: "/ciudades/madrid/actividades/tour-prado",
 *       en: "/en/cities/madrid/activities/prado-tour"
 *     },
 *     "/en/cities/madrid/activities/prado-tour": {
 *       es: "/ciudades/madrid/actividades/tour-prado",
 *       en: "/en/cities/madrid/activities/prado-tour"
 *     },
 *     ...
 *   }
 *
 * Política:
 *   - Cada URL se incluye SIEMPRE como entrada (clave) en el mapa.
 *   - Para cada idioma destino, se incluye el valor solo si existe pareja
 *     real (slug declarado en frontmatter o slug invariante con archivo
 *     físico). Si no, ese idioma se omite y el `LanguageSwitcher` cae al
 *     fallback "home del idioma destino".
 *   - El propio idioma de origen siempre se mapea a la URL de origen
 *     (identidad), para que el switcher pueda mostrar el idioma actual
 *     como "seleccionado" sin lookups extra.
 *
 * Coste:
 *   - Generación: O(N) donde N = número total de URLs del sitio (~80).
 *   - Tamaño en cliente: ~6-10 KB JSON sin comprimir, <2 KB gzipped.
 */

export type ParejaUrls = Partial<Record<Idioma, string>>;
export type MapaParejas = Record<string, ParejaUrls>;

/**
 * Construye una entrada del mapa para una URL dada y una función que sabe
 * cómo resolver la pareja en cada idioma destino.
 */
function construirEntrada(
  urlOrigen: string,
  idiomaOrigen: Idioma,
  resolverPareja: (idiomaDestino: Idioma) => string | null
): [string, ParejaUrls] {
  const pareja: ParejaUrls = { [idiomaOrigen]: urlOrigen };
  for (const idiomaDestino of IDIOMAS_ACTIVOS) {
    if (idiomaDestino === idiomaOrigen) continue;
    const urlDestino = resolverPareja(idiomaDestino);
    if (urlDestino) pareja[idiomaDestino] = urlDestino;
  }
  return [urlOrigen, pareja];
}

/**
 * URLs del sitio cuyas parejas son fijas (no dependen de contenido).
 * Hubs, legales, contacto, sobre-nosotros, home.
 */
function entradasFijas(): MapaParejas {
  const mapa: MapaParejas = {};
  // El hub de guías solo existe (y es pareja) en los idiomas con alguna guía publicada.
  const hubGuias = Object.fromEntries(idiomasConGuias().map((l) => [l, urlIndiceGuias(l)]));
  for (const ruta of Object.values(hubGuias)) mapa[ruta] = hubGuias;

  for (const idioma of IDIOMAS_ACTIVOS) {
    // Home
    const home = prefijoIdioma(idioma) || "/";
    mapa[home] = Object.fromEntries(
      IDIOMAS_ACTIVOS.map((l) => [l, prefijoIdioma(l) || "/"])
    );

    // Hubs
    mapa[urlIndiceCiudades(idioma)] = Object.fromEntries(
      IDIOMAS_ACTIVOS.map((l) => [l, urlIndiceCiudades(l)])
    );

    // Legales y contacto
    mapa[urlAvisoLegal(idioma)] = Object.fromEntries(
      IDIOMAS_ACTIVOS.map((l) => [l, urlAvisoLegal(l)])
    );
    mapa[urlPrivacidad(idioma)] = Object.fromEntries(
      IDIOMAS_ACTIVOS.map((l) => [l, urlPrivacidad(l)])
    );
    mapa[urlCookies(idioma)] = Object.fromEntries(
      IDIOMAS_ACTIVOS.map((l) => [l, urlCookies(l)])
    );
    mapa[urlContacto(idioma)] = Object.fromEntries(
      IDIOMAS_ACTIVOS.map((l) => [l, urlContacto(l)])
    );
  }

  // Sobre-nosotros / About: el slug NO está en URL_SEGMENTS, está hardcoded
  // en utils ad-hoc. Mantener aquí el mapeo manual hasta que se mueva al
  // sistema unificado de URL_SEGMENTS.
  const sobreNosotros = Object.fromEntries(
    IDIOMAS_ACTIVOS.map((l) => [l, l === "es" ? "/sobre-nosotros" : `/${l}/about`])
  );
  for (const ruta of Object.values(sobreNosotros)) mapa[ruta] = sobreNosotros;

  // Proveedores locales / Local partners
  const proveedores = Object.fromEntries(
    IDIOMAS_ACTIVOS.map((l) => [l, l === "es" ? "/proveedores" : `/${l}/partners`])
  );
  for (const ruta of Object.values(proveedores)) mapa[ruta] = proveedores;

  // Planificador de actividades (solo ES/EN)
  const planificador = { es: "/planificador", en: "/en/planner" };
  for (const ruta of Object.values(planificador)) mapa[ruta] = planificador;
  const cruceros = { es: "/cruceros", en: "/en/cruise-excursions" };
  for (const ruta of Object.values(cruceros)) mapa[ruta] = cruceros;

  return mapa;
}

/**
 * Genera el mapa completo. Se llama una sola vez en build, el resultado
 * es estable (no varía dentro del mismo deploy) y se puede cachear como
 * módulo singleton.
 */
function generarMapa(): MapaParejas {
  const mapa: MapaParejas = entradasFijas();

  // Ciudades
  for (const { idioma, ciudad } of obtenerTodosLosCaminosCiudades()) {
    const url = urlCiudad(idioma, ciudad);
    const [k, v] = construirEntrada(url, idioma, (destino) => {
      const slug = slugParejaCiudad(idioma, ciudad, destino);
      return slug ? urlCiudad(destino, slug) : null;
    });
    mapa[k] = v;
  }

  // Listado de actividades por ciudad: existe (y es pareja) en cada idioma
  // con al menos una ficha publicada en esa ciudad, haya o no página de
  // ciudad en ese idioma (FR/IT/PT pueden tener fichas sin guía de ciudad).
  // Mismo criterio que el sitemap y el generateStaticParams del listado.
  for (const idioma of IDIOMAS_ACTIVOS) {
    for (const ciudad of obtenerCiudadesConActividades(idioma)) {
      const url = urlActividadesDeCiudad(idioma, ciudad);
      const [k, v] = construirEntrada(url, idioma, (destino) =>
        urlListadoActividadesSiExiste(destino, ciudad)
      );
      mapa[k] = v;
    }
  }

  // Guías de cada ciudad: pareja en los idiomas con guías en esa ciudad.
  const ciudadesConGuias = new Map(
    IDIOMAS_ACTIVOS.map(
      (l) => [l, new Set(obtenerCiudadesConGuias(l).map((c) => c.ciudad))] as const
    )
  );
  for (const idioma of IDIOMAS_ACTIVOS) {
    for (const ciudad of Array.from(ciudadesConGuias.get(idioma) ?? [])) {
      const [k, v] = construirEntrada(urlGuiasDeCiudad(idioma, ciudad), idioma, (destino) =>
        ciudadesConGuias.get(destino)?.has(ciudad) ? urlGuiasDeCiudad(destino, ciudad) : null
      );
      mapa[k] = v;
    }
  }

  // Guías
  for (const { idioma, categoria, slug } of obtenerTodosLosCaminos()) {
    const url = urlGuia(idioma, categoria, slug);
    const [k, v] = construirEntrada(url, idioma, (destino) => {
      const slugAlt = slugParejaGuia(idioma, categoria, slug, destino);
      return slugAlt ? urlGuia(destino, categoria, slugAlt) : null;
    });
    mapa[k] = v;
  }

  // Actividades (fichas individuales)
  for (const { idioma, ciudad, slug } of obtenerTodosLosCaminosActividades()) {
    const url = urlActividad(idioma, ciudad, slug);
    const [k, v] = construirEntrada(url, idioma, (destino) => {
      const slugAlt = slugParejaActividad(idioma, ciudad, slug, destino);
      return slugAlt ? urlActividad(destino, ciudad, slugAlt) : null;
    });
    mapa[k] = v;
  }

  return mapa;
}

// Singleton: se genera una sola vez al primer import.
export const MAPA_PAREJAS: MapaParejas = generarMapa();
