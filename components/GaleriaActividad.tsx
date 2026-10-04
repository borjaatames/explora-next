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
 * Desktop: imagen grande a la izquierda (50%) + hasta 4 fotos iguales a la
 * derecha (2x2). Con menos fotos la rejilla se adapta para no dejar huecos;
 * con una sola foto, ocupa todo el ancho.
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
  const enGrid = todas.slice(0, 5);
  const restantes = Math.max(0, todas.length - 5);

  const slidesLightbox = todas.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  function abrirEn(indice: number) {
    setIndiceInicial(indice);
    setAbierto(true);
  }

  const secundarias = enGrid.slice(1);
  const haySecundarias = secundarias.length > 0;

  // Rejilla de la columna derecha (desktop) según cuántas fotos pequeñas
  // haya, para que nunca quede un hueco vacío: 1 → una foto, 2 → dos
  // apiladas, 3 → una ancha arriba y dos abajo, 4 → 2x2.
  const rejillaSecundarias =
    secundarias.length >= 3
      ? "md:grid-cols-2 md:grid-rows-2"
      : secundarias.length === 2
      ? "md:grid-cols-1 md:grid-rows-2"
      : "md:grid-cols-1 md:grid-rows-1";

  return (
    <>
      <div
        className={
          "grid grid-cols-1 gap-2 rounded-lg overflow-hidden md:aspect-[2/1] " +
          (haySecundarias ? "md:grid-cols-2" : "")
        }
      >
        {/* Imagen principal con badge editorial opcional */}
        <div className="relative md:h-full">
          <button
            type="button"
            onClick={() => abrirEn(0)}
            className="relative aspect-[4/3] md:aspect-auto md:h-full w-full bg-slate-100 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label={t.abrirGaleriaEn(principal.alt)}
          >
            <Image
              src={principal.src}
              alt={principal.alt}
              fill
              priority
              sizes={haySecundarias ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
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

        {/* Resto de imágenes (móvil: scroll horizontal; desktop: rejilla de igual tamaño) */}
        {haySecundarias && (
          <div
            className={
              "flex gap-2 overflow-x-auto snap-x snap-mandatory md:grid md:gap-2 md:h-full md:overflow-visible md:snap-none " +
              rejillaSecundarias
            }
          >
            {secundarias.map((img, i) => {
              const indiceReal = i + 1;
              const esUltimaConRestantes =
                i === secundarias.length - 1 && restantes > 0;
              const ocupaAncho = secundarias.length === 3 && i === 0;

              return (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => abrirEn(indiceReal)}
                  className={
                    "relative aspect-square md:aspect-auto md:h-full bg-slate-100 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 flex-shrink-0 w-2/3 md:w-auto snap-center " +
                    (ocupaAncho ? "md:col-span-2" : "")
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
                    sizes={ocupaAncho ? "(max-width: 768px) 66vw, 50vw" : "(max-width: 768px) 66vw, 25vw"}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {esUltimaConRestantes && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-10">
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
