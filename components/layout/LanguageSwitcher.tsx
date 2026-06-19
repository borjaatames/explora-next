"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_DEFECTO,
  IDIOMA_LABELS,
  esIdiomaActivo,
  COOKIE_LOCALE,
} from "@/lib/i18n/config";
import type { Idioma } from "@/lib/i18n/types";
import type { MapaParejas } from "@/lib/i18n/parejas";

/**
 * URL home del idioma destino. Fallback usado cuando la URL actual no
 * está en el mapa (ruta no contemplada) o no tiene pareja en ese idioma.
 */
function urlHomeIdioma(destino: Idioma): string {
  return destino === IDIOMA_DEFECTO ? "/" : `/${destino}`;
}

/**
 * Etiquetas accesibles del botón del selector, una por idioma.
 * Garantiza que un lector de pantalla en español NO escuche "Change language".
 */
const ARIA_LABEL_CAMBIAR_IDIOMA: Record<Idioma, string> = {
  es: "Cambiar idioma",
  en: "Change language",
  de: "Sprache ändern",
  fr: "Changer de langue",
  it: "Cambia lingua",
  pt: "Mudar idioma",
};

/**
 * Selector de idioma autoreferencial (sin banderas).
 *
 * Resolución de la URL destino:
 *   1. `usePathname()` da la ruta actual (sin search/hash).
 *   2. Lookup en `mapaParejas` (generado en build, sólido y estático).
 *   3. Si la entrada existe y declara el idioma destino → esa URL.
 *   4. Si no, fallback a home del idioma destino.
 */
type Props = {
  mapaParejas: MapaParejas;
};

export default function LanguageSwitcher({ mapaParejas }: Props) {
  const pathname = usePathname() || "/";
  const [abierto, setAbierto] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickFuera(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  if (IDIOMAS_ACTIVOS.length <= 1) return null;

  const primerSegmento = pathname.split("/").filter(Boolean)[0];
  const idiomaActual: Idioma =
    primerSegmento && esIdiomaActivo(primerSegmento)
      ? primerSegmento
      : IDIOMA_DEFECTO;

  const etiquetaActual = IDIOMA_LABELS[idiomaActual];
  const parejas = mapaParejas[pathname];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex items-center gap-1 text-slate-900 hover:text-sky-700 font-semibold transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-label={ARIA_LABEL_CAMBIAR_IDIOMA[idiomaActual]}
      >
        <span>{etiquetaActual.nombre}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {abierto && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-md py-1 z-50"
        >
          {IDIOMAS_ACTIVOS.map((lang) => {
            const etiqueta = IDIOMA_LABELS[lang];
            const seleccionado = lang === idiomaActual;
            const destino = parejas?.[lang] ?? urlHomeIdioma(lang);
            return (
              <li key={lang} role="option" aria-selected={seleccionado}>
                <Link
                  href={destino}
                  prefetch={false}
                  onClick={(e) => {
                    // Persistir la elección de idioma. Sin esto, el middleware
                    // de la home reescribe "/" según la cookie/navegador y la
                    // selección manual se pierde (rebote a /en).
                    document.cookie = `${COOKIE_LOCALE}=${lang}; path=/; max-age=31536000; samesite=lax`;
                    setAbierto(false);

                    // Navegación DURA (recarga completa) en vez del soft-nav de
                    // Next. Motivo del bug recurrente: el router prefetch-cachea
                    // la home "/" resuelta con la cookie/Accept-Language ANTERIOR
                    // (inglés); al volver a "/" para pasar a español usaba esa
                    // versión cacheada y el middleware la rebotaba a /en, de modo
                    // que "no se podía cambiar a ES" desde el inicio en inglés.
                    // window.location obliga a una request real al servidor con
                    // la cookie recién puesta, sin caché de prefetch de por medio.
                    e.preventDefault();
                    window.location.assign(destino);
                  }}
                  className={`block px-3 py-2 text-sm transition-colors ${
                    seleccionado
                      ? "bg-amber-50 text-slate-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {etiqueta.nombre}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
