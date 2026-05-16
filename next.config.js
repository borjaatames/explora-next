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
    // Redirects 301 de las URLs viejas de categoría (cultural, gastronomico,
    // aireLibre, nocturno, excursion, familiar) a las nuevas (mayo 2026).
    // Aplica a ES (/ciudades/{ciudad}/actividades/c/{cat}) y a las EN
    // (/{lang}/cities/{ciudad}/activities/c/{cat}).
    const ciudades = ["madrid", "barcelona", "sevilla", "granada", "salamanca"];
    const pares = [
      ["cultural", "visitas-guiadas"],
      ["gastronomico", "tours-gastronomicos"],
      ["excursion", "excursiones-de-un-dia"],
      ["aire-libre", "visitas-guiadas"],
      ["nocturno", "espectaculos"],
      ["familiar", "visitas-guiadas"],
    ];
    const redirects = [];
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
    return redirects;
  },
  async headers() {
    // X-Robots-Tag: blindaje extra a `noindex` además del `<meta>` del layout.
    // Aplica a TODAS las landings SEM en TODOS los idiomas.
    // Cuando se activen DE/FR/IT/PT, añadir aquí una entrada por idioma.
    return [
      {
        source: "/sem/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/en/sem/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
