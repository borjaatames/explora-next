/** @type {import('next').NextConfig} */
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
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    const redirects = [];

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

    return redirects;
  },
};
module.exports = nextConfig;
