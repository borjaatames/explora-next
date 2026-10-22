"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_DEFECTO,
  IDIOMA_LABELS,
  COOKIE_LOCALE,
} from "@/lib/i18n/config";
import type { Idioma } from "@/lib/i18n/types";
import type { MapaParejas, ParejaUrls } from "@/lib/i18n/parejas";

/**
 * URL home del idioma destino. Fallback cuando la página actual no tiene
 * pareja definida en ese idioma.
 */
function urlHomeIdioma(destino: Idioma): string {
  return destino === IDIOMA_DEFECTO ? "/" : `/${destino}`;
}

/**
 * Etiquetas accesibles del botón del selector, una por idioma.
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
 * Carga perezosa y compartida del mapa de parejas (`/parejas.json`, estático).
 * Se pide al primer gesto sobre el selector, no en cada visita.
 */
let mapaPromesa: Promise<MapaParejas | null> | null = null;
function cargarMapa(): Promise<MapaParejas | null> {
  if (!mapaPromesa) {
    mapaPromesa = fetch("/parejas.json")
      .then((r) => (r.ok ? (r.json() as Promise<MapaParejas>) : null))
      .catch(() => {
        mapaPromesa = null;
        return null;
      });
  }
  return mapaPromesa;
}

/**
 * Selector de idioma autoreferencial (sin banderas).
 *
 * No recibe las parejas del servidor: leerlas con `headers()` hacía
 * dinámicas todas las páginas. Las resuelve en cliente con `usePathname`
 * y el mapa estático; mientras no carga, los enlaces apuntan a la home de
 * cada idioma (las alternativas reales ya están en los `hreflang` del head).
 */
type Props = {
  /** Idioma activo en esta página — lo conoce el servidor. */
  idioma: Idioma;
};

export default function LanguageSwitcher({ idioma }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [parejas, setParejas] = useState<ParejaUrls | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() ?? "/";

  const precargar = useCallback(() => {
    void cargarMapa().then((mapa) => setParejas(mapa?.[pathname] ?? null));
  }, [pathname]);

  useEffect(() => {
    setParejas(null);
  }, [pathname]);

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

  const etiquetaActual = IDIOMA_LABELS[idioma];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => {
          precargar();
          setAbierto((v) => !v);
        }}
        onPointerEnter={precargar}
        onFocus={precargar}
        className="flex items-center gap-1 text-slate-900 hover:text-sky-700 font-semibold transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-label={ARIA_LABEL_CAMBIAR_IDIOMA[idioma]}
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
            const seleccionado = lang === idioma;
            const destino = parejas?.[lang] ?? urlHomeIdioma(lang);
            return (
              <li key={lang} role="option" aria-selected={seleccionado}>
                <Link
                  href={destino}
                  prefetch={false}
                  onClick={(e) => {
                    // Persistir la elección de idioma en cookie.
                    document.cookie = `${COOKIE_LOCALE}=${lang}; path=/; max-age=31536000; samesite=lax`;
                    setAbierto(false);

                    // Navegación DURA para evitar el bug de prefetch-cache
                    // del router (ver comentario original en el historial).
                    e.preventDefault();
                    void cargarMapa().then((mapa) => {
                      window.location.assign(
                        mapa?.[pathname]?.[lang] ?? destino,
                      );
                    });
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
