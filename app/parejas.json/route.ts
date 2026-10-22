import { NextResponse } from "next/server";
import { MAPA_PAREJAS } from "@/lib/i18n/parejas";

/**
 * Mapa completo de parejas de idioma, generado en build y servido como
 * fichero estático. El LanguageSwitcher lo pide solo cuando el usuario
 * interactúa con el selector, así el HTML de cada página no depende de
 * `headers()` y vuelve a ser cacheable en el CDN.
 */
export const dynamic = "force-static";

export function GET(): NextResponse {
  return NextResponse.json(MAPA_PAREJAS, {
    headers: { "X-Robots-Tag": "noindex" },
  });
}
