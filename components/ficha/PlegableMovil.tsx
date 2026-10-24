"use client";

import { useState, type ReactNode } from "react";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  idioma: Idioma;
  children: ReactNode;
};

const TEXTOS = {
  es: { mas: "Ver más", menos: "Ver menos" },
  en: { mas: "Show more", menos: "Show less" },
} as const;

/**
 * En móvil muestra el principio de la sección (unos 176 px) con un
 * difuminado y un botón «Ver más»; en escritorio, todo abierto. El contenido
 * completo está siempre en el HTML (no se pierde SEO): solo se recorta con CSS.
 */
export default function PlegableMovil({ idioma, children }: Props) {
  const [abierto, setAbierto] = useState(false);
  const t = idioma === "es" ? TEXTOS.es : TEXTOS.en;

  return (
    <div>
      <div
        className={
          "relative md:max-h-none md:overflow-visible " +
          (abierto ? "" : "max-h-44 overflow-hidden")
        }
      >
        {children}
        {!abierto && (
          <div
            aria-hidden="true"
            className="md:hidden pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="md:hidden mt-2 inline-flex items-center gap-1 text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded"
      >
        {abierto ? t.menos : t.mas}
        <span aria-hidden="true">{abierto ? "↑" : "↓"}</span>
      </button>
    </div>
  );
}
