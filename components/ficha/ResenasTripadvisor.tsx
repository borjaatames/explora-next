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
    subtitulo: "Reseñas de",
    en: "en Tripadvisor",
    leer: "Leer en Tripadvisor",
    mas: "Más en Tripadvisor",
    locale: "es-ES",
  },
  en: {
    titulo: "What travellers say",
    subtitulo: "Reviews of",
    en: "on Tripadvisor",
    leer: "Read on Tripadvisor",
    mas: "More on Tripadvisor",
    locale: "en-GB",
  },
} as const;

type Gtag = (comando: "event", nombre: string, parametros: Record<string, unknown>) => void;

/** Página del proveedor a partir de la URL de una reseña (ShowUserReviews → Attraction_Review). */
function urlProveedor(urlResena: string | undefined): string | null {
  const m = urlResena?.match(/^(https:\/\/[^/]+)\/ShowUserReviews-(g\d+)-(d\d+)-r\d+-(.+)$/);
  return m ? `${m[1]}/Attraction_Review-${m[2]}-${m[3]}-Reviews-${m[4]}` : null;
}

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

  // Mide la fuga hacia Tripadvisor para compararla con click_reserva.
  const medirClic = (ubicacion: "resena" | "proveedor" | "mas") => {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === "function") {
      gtag("event", "click_tripadvisor", { location_id: locationId, idioma, ubicacion });
    }
  };
  const paginaProveedor = urlProveedor(resenas[0]?.url);
  const claseEnlace =
    "font-semibold text-sky-600 hover:text-sky-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded";

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
          <p className="text-sm text-slate-500 mb-4">
            {t.subtitulo}{" "}
            {paginaProveedor ? (
              <a
                href={paginaProveedor}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => medirClic("proveedor")}
                className={claseEnlace}
              >
                {nombreProveedor}
              </a>
            ) : (
              nombreProveedor
            )}{" "}
            {t.en}
          </p>
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
                    onClick={() => medirClic("resena")}
                    className={claseEnlace}
                  >
                    {t.leer} →
                  </a>
                </div>
              </li>
            ))}
          </ul>
          {paginaProveedor && (
            <p className="mt-3 text-sm text-right">
              <a
                href={paginaProveedor}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => medirClic("mas")}
                className={claseEnlace}
              >
                {t.mas} →
              </a>
            </p>
          )}
        </>
      )}
    </section>
  );
}
