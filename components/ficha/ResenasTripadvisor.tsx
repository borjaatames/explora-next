"use client";

import { useEffect, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n/types";
import type { ResenaTripadvisor } from "@/lib/tripadvisor";

type Props = {
  idioma: Idioma;
  locationId: string;
  nombreProveedor: string;
};

const TEXTOS = {
  es: {
    titulo: "Lo que dicen los viajeros",
    subtitulo: (p: string) => `Reseñas de ${p} en Tripadvisor`,
    leer: "Leer en Tripadvisor",
    locale: "es-ES",
  },
  en: {
    titulo: "What travellers say",
    subtitulo: (p: string) => `Reviews of ${p} on Tripadvisor`,
    leer: "Read on Tripadvisor",
    locale: "en-GB",
  },
} as const;

/**
 * Últimas reseñas reales del proveedor en Tripadvisor (Content API oficial),
 * con atribución y enlace a cada reseña. Se piden solo cuando el bloque se
 * acerca a la pantalla, para no cargar nada en la primera vista. Si no hay
 * clave o no hay reseñas, no pinta nada.
 */
export default function ResenasTripadvisor({ idioma, locationId, nombreProveedor }: Props) {
  const t = idioma === "es" ? TEXTOS.es : TEXTOS.en;
  const ref = useRef<HTMLElement>(null);
  const [resenas, setResenas] = useState<ResenaTripadvisor[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelado = false;
    const cargar = () => {
      fetch(`/api/tripadvisor/${locationId}?idioma=${idioma === "es" ? "es" : "en"}`)
        .then((r) => (r.ok ? r.json() : { resenas: [] }))
        .then((d: { resenas?: ResenaTripadvisor[] }) => {
          if (!cancelado) setResenas(d.resenas ?? []);
        })
        .catch(() => undefined);
    };
    if (typeof IntersectionObserver === "undefined") {
      cargar();
      return () => {
        cancelado = true;
      };
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          obs.disconnect();
          cargar();
        }
      },
      { rootMargin: "400px" }
    );
    obs.observe(el);
    return () => {
      cancelado = true;
      obs.disconnect();
    };
  }, [locationId, idioma]);

  return (
    <section ref={ref} aria-labelledby={resenas.length ? "resenas-titulo" : undefined}>
      {resenas.length > 0 && (
        <>
          <h2 id="resenas-titulo" className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-1">
            {t.titulo}
          </h2>
          <p className="text-sm text-slate-500 mb-4">{t.subtitulo(nombreProveedor)}</p>
          <ul className="flex flex-col gap-3">
            {resenas.map((r) => (
              <li key={r.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-amber-500 text-sm" aria-label={`${r.rating}/5`}>
                    {"★".repeat(Math.round(r.rating))}
                    <span className="text-slate-300">{"★".repeat(5 - Math.round(r.rating))}</span>
                  </span>
                  {r.fecha && (
                    <time dateTime={r.fecha} className="text-xs text-slate-500">
                      {new Date(r.fecha).toLocaleDateString(t.locale, { month: "long", year: "numeric" })}
                    </time>
                  )}
                </div>
                {r.titulo && <p className="font-semibold text-slate-900 mb-1">{r.titulo}</p>}
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">{r.texto}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    {r.autor}
                    {r.lugarAutor ? ` · ${r.lugarAutor}` : ""}
                  </span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-semibold text-sky-600 hover:text-sky-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
                  >
                    {t.leer} →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
