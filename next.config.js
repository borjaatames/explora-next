/** @type {import('next').NextConfig} */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

/**
 * Actividades despublicadas de CUALQUIER proveedor (leídas en vivo del
 * frontmatter en build time, no una lista hardcodeada). Originalmente
 * cubría solo Viator (despublicado el 22 de junio de 2026, ver
 * listado-tareas-2026-06-22.md, para migrar comisión a Bokun donde hay
 * proveedor equivalente), pero fichas despublicadas de OTROS
 * proveedores (GetYourGuide, Bokun) tenían el mismo problema y se
 * quedaban sin redirect. Caso real confirmado en Search Console
 * (septiembre 2026): la ficha de GetYourGuide de Park Güell en
 * Barcelona seguía indexada y devolvía 404 puro. Generalizado en
 * septiembre 2026 para cubrir cualquier `proveedor` (ver
 * claude/handoff-exploraspain-2026-09-05-ga4-fixes-404-viator.md).
 *
 * Sin redirect, esas URLs devuelven 404 puro (confirmado: la página
 * "404" aparecía en el top de páginas más vistas en GA4 en agosto).
 * Redirigimos cada una a la página índice de actividades de su ciudad
 * en vez de tratar de adivinar la categoría — el campo `categoria` en
 * fichas despublicadas puede llevar meses sin migrar a la taxonomía
 * nueva (ver pendiente "reformular taxonomía de categorías") y no es
 * fiable para construir la URL de destino.
 *
 * Calculado dinámicamente para que cualquier despublicación futura, de
 * cualquier proveedor, quede cubierta automáticamente en el siguiente
 * build, sin tener que tocar este archivo a mano. Ver
 * auditoria-seo-organico-2026-08-15.md, sección 2.
 */
function obtenerActividadesDespublicadas() {
  const raiz = path.join(process.cwd(), "content", "actividades");
  const resultado = { es: [], en: [] };

  for (const idioma of ["es", "en"]) {
    const dirIdioma = path.join(raiz, idioma);
    if (!fs.existsSync(dirIdioma)) continue;

    const ciudades = fs
      .readdirSync(dirIdioma, { withFileTypes: true })
      .filter((entrada) => entrada.isDirectory());

    for (const ciudadDir of ciudades) {
      const dirCiudad = path.join(dirIdioma, ciudadDir.name);
      const archivos = fs
        .readdirSync(dirCiudad)
        .filter((archivo) => archivo.endsWith(".md"));

      for (const archivo of archivos) {
        const ruta = path.join(dirCiudad, archivo);
        const { data } = matter(fs.readFileSync(ruta, "utf8"));

        if (data.publicada === false) {
          resultado[idioma].push({ ciudad: data.ciudad, slug: data.slug });
        }
      }
    }
  }

  return resultado;
}

/**
 * Guías editoriales despublicadas (leídas en vivo del frontmatter, mismo
 * motivo que la función de arriba). Confirmado con `git log`: las 25
 * guías ES actualmente sin publicar (Bilbao, Mallorca, Alicante, Cádiz,
 * Salamanca, Santiago de Compostela, Tarragona) estuvieron publicadas
 * antes del commit `ed58bfd` (2026-06-19, "despublicar las de ciudades
 * sin actividades") — así que es razonable asumir que Google llegó a
 * indexarlas.
 *
 * Redirigimos al índice general de guías (`/guias` / `/en/guides`) en
 * vez de al hub de la ciudad: comprobado en `content/ciudades/{idioma}/
 * {ciudad}.md` que esas mismas 7 ciudades tienen SU PROPIO hub también
 * despublicado (`publicada: false`), así que redirigir ahí encadenaría
 * un redirect a un 404 — peor que no redirigir. El índice de guías
 * siempre existe.
 *
 * El frontmatter de guías usa `categoria` (no `ciudad`) para el slug de
 * ciudad en la URL — es el mismo campo que ya usa
 * app/(es-shell)/guias/[categoria]/[slug]/page.tsx para generar rutas.
 */
function obtenerGuiasDespublicadas() {
  const raiz = path.join(process.cwd(), "content", "guias");
  const resultado = { es: [], en: [] };

  for (const idioma of ["es", "en"]) {
    const dirIdioma = path.join(raiz, idioma);
    if (!fs.existsSync(dirIdioma)) continue;

    const ciudades = fs
      .readdirSync(dirIdioma, { withFileTypes: true })
      .filter((entrada) => entrada.isDirectory());

    for (const ciudadDir of ciudades) {
      const dirCiudad = path.join(dirIdioma, ciudadDir.name);
      const archivos = fs
        .readdirSync(dirCiudad)
        .filter((archivo) => archivo.endsWith(".md"));

      for (const archivo of archivos) {
        const ruta = path.join(dirCiudad, archivo);
        const { data } = matter(fs.readFileSync(ruta, "utf8"));

        if (data.publicada === false) {
          resultado[idioma].push({ categoria: data.categoria, slug: data.slug });
        }
      }
    }
  }

  return resultado;
}

/**
 * Comprueba si a una ciudad le queda al menos una actividad publicada en
 * el idioma dado. Se usa para decidir el destino del redirect de fichas
 * despublicadas de Viator (ver más abajo): si a una ciudad no le queda
 * NINGUNA actividad publicada, su propio índice de actividades
 * (`/ciudades/{ciudad}/actividades`) es también un 404 — redirigir ahí
 * encadenaría un redirect a otro 404, en vez de arreglarlo.
 *
 * Caso real detectado en Search Console (sección "No se ha encontrado
 * (404)", septiembre 2026): las 3 fichas de actividad de Málaga (ES y EN)
 * eran todas de Viator y se despublicaron a la vez, así que
 * `/ciudades/malaga/actividades` y `/en/cities/malaga/activities` se
 * quedaron sin ninguna actividad que listar y devuelven 404 ellos mismos
 * — el redirect de la sección 3 (tal cual estaba) mandaba a los usuarios
 * y a Google directamente a ese 404.
 */
function tieneActividadesPublicadas(idioma, ciudad) {
  const dirCiudad = path.join(
    process.cwd(),
    "content",
    "actividades",
    idioma,
    ciudad
  );
  if (!fs.existsSync(dirCiudad)) return false;

  const archivos = fs
    .readdirSync(dirCiudad)
    .filter((archivo) => archivo.endsWith(".md"));

  return archivos.some((archivo) => {
    const { data } = matter(
      fs.readFileSync(path.join(dirCiudad, archivo), "utf8")
    );
    return Boolean(data.publicada);
  });
}

/**
 * Comprueba si el hub de una ciudad (`content/ciudades/{idioma}/{ciudad}.md`)
 * está publicado. Es el siguiente escalón de la cascada de fallback
 * cuando una ciudad se queda sin actividades publicadas — mismo criterio
 * que ya usa obtenerGuiasDespublicadas() más abajo para las guías.
 */
function ciudadPublicada(idioma, ciudad) {
  const ruta = path.join(
    process.cwd(),
    "content",
    "ciudades",
    idioma,
    `${ciudad}.md`
  );
  if (!fs.existsSync(ruta)) return false;

  const { data } = matter(fs.readFileSync(ruta, "utf8"));
  return Boolean(data.publicada);
}

/**
 * Destino de fallback cuando una ciudad ya no tiene ninguna actividad
 * publicada: su hub si sigue publicado, o si no, el índice general de
 * ciudades (que siempre existe).
 */
function destinoParaCiudadSinActividad(idioma, ciudad) {
  if (idioma === "es") {
    return ciudadPublicada("es", ciudad) ? `/ciudades/${ciudad}` : "/ciudades";
  }
  return ciudadPublicada("en", ciudad) ? `/en/cities/${ciudad}` : "/en/cities";
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.civitatis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.getyourguide.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.tacdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgcdn.bokun.tools",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    const redirects = [];

    // ── 0. Canonicalización de host: www.exploraspain.com -> exploraspain.com.
    //    El canonical tag de cada página ya apunta a la version sin "www"
    //    (ver `SITE_URL` en app/sitemap.ts, app/robots.ts, etc.), pero sin
    //    este redirect a nivel de host, exploraspain.com y
    //    www.exploraspain.com sirven la MISMA pagina 200 OK en paralelo
    //    (verificado con WebFetch el 6 sept 2026). Google acaba
    //    consolidando via canonical (bucket "pagina alternativa con
    //    etiqueta canonica adecuada" en Search Console, 230 paginas), pero
    //    tiene que rastrear las dos versiones de cada URL para llegar ahi,
    //    duplicando el gasto de crawl budget en un dominio pequeno que no
    //    le sobra. Ver claude/auditoria-trafico-organico-2026-09-06-profundizacion.md,
    //    seccion 1.3.
    redirects.push({
      source: "/:path*",
      has: [{ type: "host", value: "www.exploraspain.com" }],
      destination: "https://exploraspain.com/:path*",
      permanent: true,
    });

    // ── 1. Redirects 301 de las URLs viejas de categoría (cultural, gastronomico,
    //    aireLibre, nocturno, excursion, familiar) a las nuevas (mayo 2026).
    //    Aplica a ES (/ciudades/{ciudad}/actividades/c/{cat}) y a las EN
    //    (/{lang}/cities/{ciudad}/activities/c/{cat}).
    const ciudades = ["madrid", "barcelona", "sevilla", "granada", "salamanca"];
    const pares = [
      ["cultural", "visitas-guiadas"],
      ["gastronomico", "tours-gastronomicos"],
      ["excursion", "excursiones-de-un-dia"],
      ["aire-libre", "visitas-guiadas"],
      ["nocturno", "espectaculos"],
      ["familiar", "visitas-guiadas"],
    ];
    for (const ciudad of ciudades) {
      for (const [viejo, nuevo] of pares) {
        redirects.push({
          source: `/ciudades/${ciudad}/actividades/c/${viejo}`,
          destination: `/ciudades/${ciudad}/actividades/c/${nuevo}`,
          permanent: true,
        });
        redirects.push({
          source: `/en/cities/${ciudad}/activities/c/${viejo}`,
          destination: `/en/cities/${ciudad}/activities/c/${nuevo}`,
          permanent: true,
        });
      }
    }

    // ── 2. Retiramos las 6 landings SEM dedicadas (ES + EN) y dirigimos su
    //    tráfico a la página real de actividad o categoría (junio 2026).
    //    Las campañas de Ads pasan a apuntar directamente a estas mismas URLs.
    const semPares = [
      // [URL vieja ES, URL vieja EN, destino ES, destino EN]
      [
        "/sem/entradas-sagrada-familia-barcelona",
        "/en/sem/sagrada-familia-tickets-barcelona",
        "/ciudades/barcelona/actividades/entrada-sagrada-familia-audioguia",
        "/en/cities/barcelona/activities/sagrada-familia-ticket-audio-guide",
      ],
      [
        "/sem/entradas-alhambra-granada",
        "/en/sem/alhambra-tickets-granada",
        "/ciudades/granada/actividades/alhambra-palacios-nazaries-sin-colas",
        "/en/cities/granada/activities/alhambra-nasrid-palaces-skip-the-line",
      ],
      [
        "/sem/excursiones-toledo-madrid",
        "/en/sem/toledo-day-trips-from-madrid",
        "/ciudades/madrid/actividades/excursion-toledo-dia-completo",
        "/en/cities/madrid/activities/toledo-full-day-from-madrid",
      ],
      [
        "/sem/excursiones-desde-madrid",
        "/en/sem/day-trips-from-madrid",
        "/ciudades/madrid/actividades/c/excursiones-de-un-dia",
        "/en/cities/madrid/activities/c/excursiones-de-un-dia",
      ],
      [
        "/sem/excursiones-montserrat-barcelona",
        "/en/sem/montserrat-day-trips-barcelona",
        "/ciudades/barcelona/actividades/c/excursiones-de-un-dia",
        "/en/cities/barcelona/activities/c/excursiones-de-un-dia",
      ],
      [
        "/sem/tour-tapas-madrid",
        "/en/sem/madrid-tapas-tour",
        "/ciudades/madrid/actividades/c/tours-gastronomicos",
        "/en/cities/madrid/activities/c/tours-gastronomicos",
      ],
    ];
    for (const [viejaEs, viejaEn, destinoEs, destinoEn] of semPares) {
      redirects.push({ source: viejaEs, destination: destinoEs, permanent: true });
      redirects.push({ source: viejaEn, destination: destinoEn, permanent: true });
    }

    // ── 3. Fichas de actividad despublicadas de CUALQUIER proveedor →
    //    índice de actividades de su ciudad, salvo que a esa ciudad no le
    //    quede ninguna actividad publicada — en ese caso el índice es
    //    también un 404, así que caemos al hub de la ciudad (o al índice
    //    general si el hub también está despublicado). Generalizado en
    //    septiembre 2026 para cubrir GetYourGuide y Bokun además de
    //    Viator. Ver funciones obtenerActividadesDespublicadas() /
    //    tieneActividadesPublicadas() / destinoParaCiudadSinActividad()
    //    arriba para el porqué.
    const despublicadas = obtenerActividadesDespublicadas();
    for (const { ciudad, slug } of despublicadas.es) {
      const destino = tieneActividadesPublicadas("es", ciudad)
        ? `/ciudades/${ciudad}/actividades`
        : destinoParaCiudadSinActividad("es", ciudad);
      redirects.push({
        source: `/ciudades/${ciudad}/actividades/${slug}`,
        destination: destino,
        permanent: true,
      });
    }
    for (const { ciudad, slug } of despublicadas.en) {
      const destino = tieneActividadesPublicadas("en", ciudad)
        ? `/en/cities/${ciudad}/activities`
        : destinoParaCiudadSinActividad("en", ciudad);
      redirects.push({
        source: `/en/cities/${ciudad}/activities/${slug}`,
        destination: destino,
        permanent: true,
      });
    }

    // ── 4. Guías editoriales despublicadas (agosto 2026) → índice general
    //    de guías. Ver función obtenerGuiasDespublicadas() arriba para el
    //    porqué del destino (no se puede usar el hub de ciudad: también
    //    está despublicado para estas mismas 7 ciudades).
    const guiasDespublicadas = obtenerGuiasDespublicadas();
    for (const { categoria, slug } of guiasDespublicadas.es) {
      redirects.push({
        source: `/guias/${categoria}/${slug}`,
        destination: "/guias",
        permanent: true,
      });
    }
    for (const { categoria, slug } of guiasDespublicadas.en) {
      redirects.push({
        source: `/en/guides/${categoria}/${slug}`,
        destination: "/en/guides",
        permanent: true,
      });
    }

    return redirects;
  },
};
module.exports = nextConfig;
