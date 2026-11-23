import type { MetadataRoute } from "next";
import { IDIOMAS_ACTIVOS, IDIOMA_DEFECTO } from "@/lib/i18n/config";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

/**
 * Robots policy.
 *
 * - En producción (NEXT_PUBLIC_ALLOW_INDEXING="true"): permitimos indexación
 *   completa salvo rutas técnicas y declaramos el sitemap.
 * - En preview / desarrollo: bloqueamos todo el sitio para evitar que Google
 *   indexe URLs de Vercel preview o de localhost.
 *
 * Las landings SEM van con noindex en todos los idiomas activos: una entrada
 * `/<idioma>/sem/` por idioma (sin prefijo en español).
 *
 * `meta-externalagent` (rastreador de Meta para entrenar IA) queda excluido:
 * no trae visitas y llegó a ser el 40 % de las peticiones (nov. 2026). No
 * afecta a `facebookexternalhit` (vistas previas de enlaces) ni a
 * `meta-webindexer`.
 *
 * `GPTBot` (rastreador de OpenAI para entrenar modelos) también queda fuera:
 * ~17k peticiones/día sin traer visitas (nov. 2026). No afecta a
 * `OAI-SearchBot` (buscador de ChatGPT) ni a `ChatGPT-User`.
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
          "/sem/",
          ...IDIOMAS_ACTIVOS.filter((l) => l !== IDIOMA_DEFECTO).map((l) => `/${l}/sem/`),
          "/admin/",
          "/*.backup$",
          "/*?*utm_",
        ],
      },
      { userAgent: "meta-externalagent", disallow: "/" },
      { userAgent: "GPTBot", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
