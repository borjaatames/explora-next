"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  title: string;
  /** Texto del botón para cargar el mapa a mano (sin esperar al scroll). */
  textoCargar: string;
};

/** Antelación con la que se monta el iframe antes de entrar en pantalla. */
const MARGEN_CARGA = "300px 0px";

/**
 * Iframe de OpenStreetMap montado solo cuando el bloque se acerca a la
 * pantalla. El `loading="lazy"` nativo no bastaba: Chrome lo descarga con
 * 1.250-2.500 px de antelación, así que en móvil entraba en la carga
 * inicial (~294 KB de JS de OSM, 177 KB sin usar según PageSpeed).
 * El hueco tiene su relación de aspecto fija para no provocar CLS.
 */
export default function MapaIframeDiferido({ src, title, textoCargar }: Props) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [montado, setMontado] = useState<boolean>(false);

  useEffect(() => {
    if (montado) return;
    const nodo = contenedorRef.current;
    if (!nodo || typeof IntersectionObserver === "undefined") {
      setMontado(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setMontado(true);
          observer.disconnect();
        }
      },
      { rootMargin: MARGEN_CARGA }
    );
    observer.observe(nodo);
    return () => observer.disconnect();
  }, [montado]);

  return (
    <div ref={contenedorRef} className="relative w-full aspect-[2/1] bg-slate-100">
      {montado ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setMontado(true)}
            className="inline-flex items-center justify-center bg-white border border-slate-300 hover:border-sky-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            {textoCargar}
          </button>
        </div>
      )}
    </div>
  );
}
