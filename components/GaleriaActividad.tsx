"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "yet-another-react-lightbox/styles.css";
import type { Idioma } from "@/lib/i18n/types";

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
 * Desktop: imagen grande a la izquierda (50%) + grid 2x2 a la derecha.
 * Mobile: imagen grande arriba + fila horizontal scrollable debajo.
 *
 * Usa next/image para optimización automática (AVIF/WebP, lazy loading,
 * tamaños responsive). La imagen principal lleva priority para mejorar LCP.
 *
 * Al hacer clic en cualquier imagen abre un lightbox a pantalla completa
 * con navegación por flechas, swipe en móvil y cierre con Esc.
 *
 * Si hay más de 5 imágenes en total, la última muestra un overlay con
 * el contador "+N más".
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

  const todas: ImagenGaleria[] = [principal, ...galeria];
  const enGrid = todas.slice(0, 8);
  const restantes = Math.max(0, todas.length - 8);

  const slidesLightbox = todas.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  function abrirEn(indice: number) {
    setIndiceInicial(indice);
    setAbierto(true);
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 rounded-lg overflow-hidden">
        {enGrid.map((img, i) => {
          const esUltima = i === enGrid.length - 1 && restantes > 0;
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => abrirEn(i)}
              className="relative aspect-[4/3] bg-slate-100 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label={
                esUltima ? t.verFotosRestantes(restantes + 1) : t.abrirGaleriaEn(img.alt)
              }
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Sello editorial: solo en la primera imagen y si destacada */}
              {destacada && i === 0 && (
                <div
                  className="absolute top-3 left-3 inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-md shadow-lg pointer-events-none select-none"
                  aria-label={t.selloAriaLabel}
                >
                  <span aria-hidden="true" className="text-amber-400 text-base leading-none">
                    ★
                  </span>
                  <span className="hidden sm:inline">{t.selloLargo}</span>
                  <span className="sm:hidden">{t.selloCorto}</span>
                </div>
              )}

              {esUltima && (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-10">
                  <span className="text-white font-semibold text-base md:text-lg">
                    {t.fotos(restantes + 1)}
                  </span>
                </div>
              )}
            </button>
          );
        })}
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
