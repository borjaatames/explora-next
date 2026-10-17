"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
};

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
        "md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-slate-200 shadow-md transition-transform duration-200 " +
        (visible ? "translate-y-0" : "translate-y-full")
      }
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{titulo}</p>
          <p className="text-xs text-slate-500">
            {rating ? (
              <>
                <span className="text-amber-500" aria-hidden>
                  ★
                </span>{" "}
                {rating} ·{" "}
              </>
            ) : null}
            {textoDesde} <span className="font-bold text-slate-900">{precio}</span>
          </p>
        </div>
        <Link
          href={url}
          data-reserva="sticky"
          data-ficha={slugEs}
          tabIndex={visible ? 0 : -1}
          className="flex-none inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-5 py-3 min-h-[44px] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          {textoCta}
        </Link>
      </div>
    </div>
  );
}
