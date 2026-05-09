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
    return [];
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
