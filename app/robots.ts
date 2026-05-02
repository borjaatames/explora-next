import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

/**
 * Robots policy.
 *
 * - En producción (NEXT_PUBLIC_ALLOW_INDEXING="true"): permitimos indexación
 *   completa salvo rutas técnicas y declaramos el sitemap.
 * - En preview / desarrollo: bloqueamos todo el sitio para evitar que Google
 *   indexe URLs de Vercel preview o de localhost.
 */
export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  if (!allowIndexing) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/*.backup$",
          "/*?*utm_",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
