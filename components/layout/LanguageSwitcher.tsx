"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_DEFECTO,
  IDIOMA_LABELS,
  esIdiomaActivo,
} from "@/lib/i18n/config";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Reemplaza el prefijo de idioma en un pathname por el del idioma destino.
 * /guias/madrid -> /en/guides/madrid (ojo: los slugs no se traducen aquí,
 * solo el prefijo de idioma; los segmentos traducibles los gestiona la
 * estructura de rutas).
 */
function cambiarPrefijoIdioma(pathname: string, destino: Idioma): string {
  const segmentos = pathname.split("/").filter(Boolean);
  const primero = segmentos[0];
  const yaTienePrefijo =
    primero && esIdiomaActivo(primero) && primero !== IDIOMA_DEFECTO;

  const resto = yaTienePrefijo ? segmentos.slice(1) : segmentos;
  const restoPath = resto.length === 0 ? "" : "/" + resto.join("/");

  if (destino === IDIOMA_DEFECTO) {
    return restoPath || "/";
  }
  return `/${destino}${restoPath}`;
}

/**
 * Selector de idioma autoreferencial (sin banderas).
 * Muestra cada idioma escrito en su propio idioma: "English", "Español", etc.
 * Se renderiza solo si hay más de un idioma activo.
 */
export default function LanguageSwitcher() {
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

  // Si solo hay un idioma activo, no renderizar nada.
  if (IDIOMAS_ACTIVOS.length <= 1) return null;

  // Detectar idioma actual a partir del primer segmento del pathname.
  const primerSegmento = pathname.split("/").filter(Boolean)[0];
  const idiomaActual: Idioma =
    primerSegmento && esIdiomaActivo(primerSegmento)
      ? primerSegmento
      : IDIOMA_DEFECTO;

  const etiquetaActual = IDIOMA_LABELS[idiomaActual];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex items-center gap-1 text-slate-900 hover:text-sky-700 font-medium transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-label="Change language"
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
            const destino = cambiarPrefijoIdioma(pathname, lang);
            const seleccionado = lang === idiomaActual;
            return (
              <li key={lang} role="option" aria-selected={seleccionado}>
                <Link
                  href={destino}
                  onClick={() => setAbierto(false)}
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
