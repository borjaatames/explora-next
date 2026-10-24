"use client";

import { useState, type UIEvent } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Idioma } from "@/lib/i18n/types";
import "yet-another-react-lightbox/styles.css";

// El lightbox pesa ~50 KiB gzipped y solo se necesita cuando el usuario
// pulsa una imagen para ampliarla. Lo cargamos con `next/dynamic` para
// sacarlo del bundle inicial de la página. `ssr: false` evita intentar
// renderizarlo en servidor (no aporta nada al HTML inicial y rompería).
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

export type ImagenGaleria = {
  src: string;
  alt: string;
};

type Props = {
  idioma: Idioma;
  /** Imagen principal (la grande de la izquierda en desktop). */
  principal: ImagenGaleria;
  /** Resto de imágenes (van en el grid 2x2 a la derecha). */
  galeria?: ImagenGaleria[];
  /** Si true, muestra el sello "Recomendado por la redacción" en la esquina. */
  destacada?: boolean;
};

type Strings = {
  selloLargo: string;
  selloCorto: string;
  selloAriaLabel: string;
  abrirGaleriaEn: (alt: string) => string;
  verFotosRestantes: (n: number) => string;
  fotos: (n: number) => string;
};

const DICT: Record<"es" | "en", Strings> = {
  es: {
    selloLargo: "Recomendado por la redacción",
    selloCorto: "Recomendado",
    selloAriaLabel: "Recomendado por la redacción",
    abrirGaleriaEn: (alt: string) => `Abrir galería en ${alt}`,
    verFotosRestantes: (n: number) => `Ver las ${n} fotos restantes`,
    fotos: (n: number) => `+${n} fotos`,
  },
  en: {
    selloLargo: "Editor's pick",
    selloCorto: "Editor's pick",
    selloAriaLabel: "Editor's pick",
    abrirGaleriaEn: (alt: string) => `Open gallery at ${alt}`,
    verFotosRestantes: (n: number) => `See the remaining ${n} photos`,
    fotos: (n: number) => `+${n} photos`,
  },
};

function dictFor(idioma: Idioma): Strings {
  if (idioma === "es") return DICT.es;
  return DICT.en;
}

/**
 * Galería de imágenes tipo Civitatis/GetYourGuide.
 *
 * Desktop: imagen grande a la izquierda (50%) + 2 fotos grandes apiladas a
 * la derecha (mismo formato en todas las actividades). Con 2 fotos, la
 * secundaria ocupa toda la columna; con una sola foto, ocupa todo el ancho.
 * Mobile: carrusel deslizable a todo el ancho con todas las fotos y
 * contador "1/N" (como Civitatis y GetYourGuide).
 *
 * Usa next/image para optimización automática (AVIF/WebP, lazy loading,
 * tamaños responsive). La imagen principal lleva priority para mejorar LCP.
 *
 * Al hacer clic en cualquier imagen abre un lightbox a pantalla completa
 * con navegación por flechas, swipe en móvil y cierre con Esc.
 *
 * Si hay más de 3 imágenes en total, la última visible muestra un overlay
 * con el contador "+N fotos".
 *
 * Si la actividad está marcada como `destacada`, muestra un sello
 * editorial en la esquina superior izquierda de la imagen principal.
 */
export default function GaleriaActividad({
  idioma,
  principal,
  galeria = [],
  destacada = false,
}: Props) {
  const t = dictFor(idioma);
  const [abierto, setAbierto] = useState(false);
  const [indiceInicial, setIndiceInicial] = useState(0);
  const [fotoActual, setFotoActual] = useState(1);

  const todas: ImagenGaleria[] = [principal, ...galeria];
  const MAX_VISIBLES = 3;
  const enGrid = todas.slice(0, MAX_VISIBLES);
  const restantes = Math.max(0, todas.length - MAX_VISIBLES);

  const slidesLightbox = todas.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  function abrirEn(indice: number) {
    setIndiceInicial(indice);
    setAbierto(true);
  }

  // Desktop: 2 secundarias junto a la principal. Móvil: carrusel deslizable
  // con TODAS las fotos (como Civitatis/GetYourGuide) y contador "1/8".
  const secundarias = todas.slice(1);
  const visiblesDesktop = enGrid.length - 1;
  const haySecundarias = secundarias.length > 0;

  // Columna derecha (desktop): 2 fotos apiladas, o 1 a toda altura.
  const rejillaSecundarias =
    visiblesDesktop === 2
      ? "md:grid-cols-1 md:grid-rows-2"
      : "md:grid-cols-1 md:grid-rows-1";

  function alDeslizar(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.clientWidth === 0) return;
    setFotoActual(Math.round(el.scrollLeft / el.clientWidth) + 1);
  }

  return (
    <>
      <div className="relative">
        <div
          onScroll={alDeslizar}
          className={
            "flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl md:grid md:gap-2 md:overflow-hidden md:snap-none md:aspect-[5/2] " +
            (haySecundarias ? "md:grid-cols-3" : "md:grid-cols-1")
          }
        >
          {/* Imagen principal con badge editorial opcional */}
          <div
            className={
              "relative flex-none w-full snap-center md:w-auto md:h-full " +
              (haySecundarias ? "md:col-span-2" : "")
            }
          >
            <button
              type="button"
              onClick={() => abrirEn(0)}
              style={{ aspectRatio: "4/3" }}
              className="relative aspect-[4/3] md:aspect-auto md:h-full w-full bg-slate-100 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label={t.abrirGaleriaEn(principal.alt)}
            >
              <Image
                src={principal.src}
                alt={principal.alt}
                fill
                priority
                sizes={haySecundarias ? "(max-width: 768px) 100vw, 66vw" : "100vw"}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>

            {/* Sello editorial: solo si destacada */}
            {destacada && (
              <div
                className="absolute top-3 left-3 md:top-4 md:left-4 inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-md shadow-md pointer-events-none select-none"
                aria-label={t.selloAriaLabel}
              >
                <span aria-hidden="true" className="text-amber-400 text-base leading-none">
                  ★
                </span>
                <span className="hidden sm:inline">{t.selloLargo}</span>
                <span className="sm:hidden">{t.selloCorto}</span>
              </div>
            )}
          </div>

          {/* Resto de imágenes. Móvil: siguen en el carrusel a todo el ancho
              (`contents` las mete en la misma fila). Desktop: rejilla con 2. */}
          {haySecundarias && (
            <div className={"contents md:grid md:gap-2 md:h-full " + rejillaSecundarias}>
              {secundarias.map((img, i) => {
                const indiceReal = i + 1;
                const soloMovil = i >= visiblesDesktop;
                const esUltimaConRestantes =
                  i === visiblesDesktop - 1 && restantes > 0;

                return (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => abrirEn(indiceReal)}
                    className={
                      "relative flex-none w-full aspect-[4/3] snap-center md:w-auto md:aspect-auto md:h-full bg-slate-100 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 " +
                      (soloMovil ? "md:hidden" : "")
                    }
                    aria-label={
                      esUltimaConRestantes
                        ? t.verFotosRestantes(restantes + 1)
                        : t.abrirGaleriaEn(img.alt)
                    }
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      // En el carrusel móvil las fotos siguientes están "en
                      // pantalla" en horizontal y Chrome las descarga a la vez
                      // que la principal: baja su prioridad para no frenar el LCP.
                      fetchPriority="low"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {esUltimaConRestantes && (
                      <div className="absolute inset-0 bg-slate-900/60 hidden md:flex items-center justify-center z-10">
                        <span className="text-white font-semibold text-base md:text-lg">
                          {t.fotos(restantes + 1)}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Contador del carrusel (solo móvil) */}
        {haySecundarias && (
          <span
            aria-hidden="true"
            className="md:hidden absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded pointer-events-none"
          >
            {fotoActual}/{todas.length}
          </span>
        )}
      </div>

      <Lightbox
        open={abierto}
        close={() => setAbierto(false)}
        index={indiceInicial}
        slides={slidesLightbox}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: todas.length <= 1 }}
      />
    </>
  );
}
