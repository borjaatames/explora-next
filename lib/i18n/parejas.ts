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
  urlIndiceCiudades,
  urlIndiceGuias,
  urlPrivacidad,
} from "./utils";
import { obtenerTodosLosCaminos } from "../guias";
import { obtenerTodosLosCaminosCiudades } from "../ciudades";
import { obtenerTodosLosCaminosActividades } from "../actividades";

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

  for (const idioma of IDIOMAS_ACTIVOS) {
    // Home
    const home = prefijoIdioma(idioma) || "/";
    mapa[home] = Object.fromEntries(
      IDIOMAS_ACTIVOS.map((l) => [l, prefijoIdioma(l) || "/"])
    );

    // Hubs
    mapa[urlIndiceGuias(idioma)] = Object.fromEntries(
      IDIOMAS_ACTIVOS.map((l) => [l, urlIndiceGuias(l)])
    );
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
  mapa["/sobre-nosotros"] = { es: "/sobre-nosotros", en: "/en/about" };
  mapa["/en/about"] = { es: "/sobre-nosotros", en: "/en/about" };

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

  // Listado de actividades por ciudad. La pareja existe si la ciudad
  // existe en el idioma destino (mismo slug invariante de ciudad).
  for (const { idioma, ciudad } of obtenerTodosLosCaminosCiudades()) {
    const url = urlActividadesDeCiudad(idioma, ciudad);
    const [k, v] = construirEntrada(url, idioma, (destino) => {
      const slugCiudad = slugParejaCiudad(idioma, ciudad, destino);
      return slugCiudad ? urlActividadesDeCiudad(destino, slugCiudad) : null;
    });
    mapa[k] = v;
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
