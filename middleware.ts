/**
 * Middleware de internacionalización.
 *
 * INVARIANTE CRÍTICA — leer antes de modificar:
 *
 *   Este middleware NUNCA reescribe URLs explícitas distintas de "/".
 *
 *   Cualquier URL distinta de la home se sirve EXACTAMENTE en el idioma
 *   que su path dicta:
 *     - URL con prefijo `/en/...` → contenido EN.
 *     - URL sin prefijo (`/ciudades/...`, `/guias/...`, etc.) → contenido ES.
 *
 *   La auto-detección de idioma por cookie/Accept-Language SOLO se aplica
 *   en la home ("/"). Esto es deliberado: una URL profunda es siempre
 *   intención explícita del usuario (click en LanguageSwitcher, link
 *   compartido, navegación interna), y reescribirla rompe:
 *     - El switcher de idioma (cookie EN forzaba que cualquier vuelta a
 *       /ciudades/... fuese reescrita como /en/ciudades/... → 404).
 *     - El sharing de links entre usuarios con preferencias distintas.
 *     - El SEO: Googlebot ES no debe ser redirigido a /en por su
 *       Accept-Language.
 *
 *   Histórico del bug: hasta el 4 mayo 2026, el caso 2 aplicaba redirect
 *   por cookie a TODA URL sin prefijo. El switcher generaba el href
 *   correcto, pero el middleware lo secuestraba antes de llegar al SSG.
 *   Diagnóstico y fix: handoff-exploraspain-2026-05-04-noche-cierre.md.
 *
 *   Si necesitas redirigir una URL profunda por motivos no relacionados
 *   con idioma (canonicalización de slugs, A/B testing, etc.), hazlo en
 *   un middleware aparte o en `next.config.js > redirects`. NO añadas
 *   excepciones al guard del caso 2.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_DEFECTO,
  IDIOMAS_CONFIGURADOS,
  COOKIE_LOCALE,
  esIdiomaActivo,
} from "@/lib/i18n/config";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Excluye assets, API y archivos estáticos del middleware.
 * Lo que pase por aquí va a ser tratado como una ruta de página.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};

/**
 * Resuelve el idioma preferido del navegador comparando contra los idiomas
 * configurados (no solo activos). Devuelve el primero que matchee, o
 * IDIOMA_DEFECTO si no hay ninguno.
 */
function detectarIdiomaNavegador(req: NextRequest): Idioma {
  const acceptLanguage = req.headers.get("accept-language");
  if (!acceptLanguage) return IDIOMA_DEFECTO;

  // accept-language tipo "de-DE,de;q=0.9,en;q=0.8,es;q=0.7"
  const idiomasPedidos = acceptLanguage
    .split(",")
    .map((parte) => parte.split(";")[0].trim().toLowerCase().split("-")[0]);

  for (const pedido of idiomasPedidos) {
    if ((IDIOMAS_CONFIGURADOS as readonly string[]).includes(pedido)) {
      return pedido as Idioma;
    }
  }

  return IDIOMA_DEFECTO;
}

/**
 * Extrae el primer segmento del pathname si es un código de idioma de 2 letras
 * configurado, sea o no activo. Sirve para detectar URLs como /en/... aunque
 * "en" no esté todavía en IDIOMAS_ACTIVOS.
 */
function extraerIdiomaDePath(pathname: string): Idioma | null {
  const segmento = pathname.split("/")[1];
  if (!segmento) return null;
  if ((IDIOMAS_CONFIGURADOS as readonly string[]).includes(segmento)) {
    return segmento as Idioma;
  }
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const idiomaEnPath = extraerIdiomaDePath(pathname);

  // CASO 1: la URL ya lleva un código de idioma como prefijo.
  if (idiomaEnPath) {
    // 1a. El idioma de la URL es español: redirect a la versión sin prefijo
    //     (canonicalización: /es/guias -> /guias).
    if (idiomaEnPath === IDIOMA_DEFECTO) {
      const restoPath = pathname.replace(/^\/es/, "") || "/";
      return NextResponse.redirect(new URL(restoPath, req.url), 308);
    }

    // 1b. El idioma de la URL no está activo todavía: redirect a la home
    //     española. Útil mientras solo está activo "es".
    if (!esIdiomaActivo(idiomaEnPath)) {
      return NextResponse.redirect(new URL("/", req.url), 307);
    }

    // 1c. El idioma de la URL está activo: dejar pasar y guardar cookie.
    const res = NextResponse.next();
    res.cookies.set(COOKIE_LOCALE, idiomaEnPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  // CASO 2: la URL no lleva prefijo de idioma → es contenido en español.
  //
  // Ver INVARIANTE CRÍTICA al inicio del archivo: la auto-detección SOLO
  // se aplica en la home. Cualquier otra URL ES sin prefijo es intención
  // explícita y se sirve tal cual.
  if (pathname !== "/") {
    return NextResponse.next();
  }

  // En home: respetar cookie explícita, después detectar por navegador.
  const cookiePreferido = req.cookies.get(COOKIE_LOCALE)?.value;
  if (cookiePreferido && esIdiomaActivo(cookiePreferido)) {
    if (cookiePreferido !== IDIOMA_DEFECTO) {
      return NextResponse.redirect(new URL(`/${cookiePreferido}`, req.url), 307);
    }
    // cookie es "es" → dejar pasar tal cual.
    return NextResponse.next();
  }

  // Sin cookie: detectar idioma del navegador.
  const idiomaNavegador = detectarIdiomaNavegador(req);

  if (
    idiomaNavegador !== IDIOMA_DEFECTO &&
    (IDIOMAS_ACTIVOS as readonly string[]).includes(idiomaNavegador)
  ) {
    const res = NextResponse.redirect(new URL(`/${idiomaNavegador}`, req.url), 307);
    res.cookies.set(COOKIE_LOCALE, idiomaNavegador, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  // Navegador en español o no detectable → home ES tal cual.
  return NextResponse.next();
}
