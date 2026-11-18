"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  titulo: string;
  url: string;
  slugEs: string;
  /** Precio ya formateado ("20 €"). */
  precio: string;
  /** Rating ya formateado ("4,7") o null. */
  rating: string | null;
  textoDesde: string;
  textoCta: string;
  /**
   * Si la guía tiene bloque «Nuestras N opciones», la barra lleva a ese
   * bloque (#opciones) en vez de vender una sola actividad.
   */
  planes?: { numero: number; precioMin: string; idioma: Idioma };
};

const TEXTOS_PLANES = {
  es: { titulo: (n: number) => `Nuestras ${n} opciones`, cta: "Ver planes" },
  en: { titulo: (n: number) => `Our ${n} picks`, cta: "See options" },
  de: { titulo: (n: number) => `Unsere ${n} Empfehlungen`, cta: "Ansehen" },
  fr: { titulo: (n: number) => `Nos ${n} options`, cta: "Voir" },
  it: { titulo: (n: number) => `Le nostre ${n} opzioni`, cta: "Vedi" },
  pt: { titulo: (n: number) => `As nossas ${n} opções`, cta: "Ver opções" },
} as const satisfies Record<Idioma, unknown>;

type Gtag = (comando: "event", nombre: string, parametros: Record<string, string>) => void;

const UMBRAL_SCROLL_PX = 600;

/**
 * Barra de reserva fija al pie en móvil. Aparece tras el primer scroll y se
 * oculta cerca del final de la página (donde ya está el carrusel). Solo en
 * pantallas < md: en escritorio la oferta ya es visible en el cuerpo.
 */
export default function CtaStickyGuia({
  titulo,
  url,
  slugEs,
  precio,
  rating,
  textoDesde,
  textoCta,
  planes,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function evaluar() {
      ticking = false;
      const y = window.scrollY;
      const restante =
        document.documentElement.scrollHeight - (y + window.innerHeight);
      setVisible(y > UMBRAL_SCROLL_PX && restante > 900);
    }
    function alScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(evaluar);
      }
    }
    window.addEventListener("scroll", alScroll, { passive: true });
    evaluar();
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <div
      className={
        "md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-piedra-200 shadow-md transition-transform duration-200 " +
        (visible ? "translate-y-0" : "translate-y-full")
      }
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {planes ? (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-piedra-900 truncate">
                {TEXTOS_PLANES[planes.idioma].titulo(planes.numero)}
              </p>
              <p className="text-xs text-piedra-500">
                {textoDesde} <span className="font-bold text-piedra-900">{planes.precioMin}</span>
              </p>
            </div>
            <a
              href="#opciones"
              tabIndex={visible ? 0 : -1}
              onClick={() => {
                const gtag = (window as unknown as { gtag?: Gtag }).gtag;
                if (typeof gtag === "function") {
                  gtag("event", "click_sticky_opciones", { idioma: planes.idioma });
                }
              }}
              className="flex-none inline-flex items-center justify-center bg-azafran-500 hover:bg-azafran-600 text-piedra-900 font-semibold text-sm px-5 py-3 min-h-[44px] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2"
            >
              {TEXTOS_PLANES[planes.idioma].cta}
            </a>
          </>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-piedra-900 truncate">{titulo}</p>
              <p className="text-xs text-piedra-500">
                {rating ? (
                  <>
                    <span className="text-azafran-600" aria-hidden>
                      ★
                    </span>{" "}
                    {rating} ·{" "}
                  </>
                ) : null}
                {textoDesde} <span className="font-bold text-piedra-900">{precio}</span>
              </p>
            </div>
            <Link
              href={url}
              data-reserva="sticky"
              data-ficha={slugEs}
              tabIndex={visible ? 0 : -1}
              className="flex-none inline-flex items-center justify-center bg-azafran-500 hover:bg-azafran-600 text-piedra-900 font-semibold text-sm px-5 py-3 min-h-[44px] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2"
            >
              {textoCta}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
