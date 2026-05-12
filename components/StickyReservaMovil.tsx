"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Idioma } from "@/lib/i18n/types";

// CalendarioReserva pesa ~440 líneas y solo se renderiza cuando el usuario
// abre el modal de reserva en móvil. Lo cargamos con `next/dynamic` para
// que no entre en el bundle inicial de la ficha de actividad: el chunk se
// descarga solo cuando `modalOpen` pasa a true por primera vez.
const CalendarioReserva = dynamic(() => import("./CalendarioReserva"), {
  ssr: false,
});

type Props = {
  idioma: Idioma;
  precio: string;
  precioPorPersona: string;
  duracion: string;
  idiomas: string[];
  cancelacionGratuita?: boolean;
  horasCancelacion?: number;
  ratingProveedor?: number;
  numeroOpiniones?: number;
  urlReservaBase: string;
  nombreProveedor: string;
  textoReservar: string;
  textoOpiniones: string;
  textoDesde: string;
  textoPorPersona: string;
  textoDuracion: string;
  textoIdiomas: string;
  textoCancelacionHorasAntes: string;
  textoCancelacionGratuita: string;
};

type Strings = {
  ariaBarra: string;
  ariaModal: string;
  headerModal: string;
  ariaCerrar: string;
  locale: string;
};

const DICT: Record<"es" | "en", Strings> = {
  es: {
    ariaBarra: "Reservar actividad",
    ariaModal: "Selección de fecha",
    headerModal: "Reservar tu visita",
    ariaCerrar: "Cerrar",
    locale: "es-ES",
  },
  en: {
    ariaBarra: "Book activity",
    ariaModal: "Date selection",
    headerModal: "Book your visit",
    ariaCerrar: "Close",
    locale: "en-US",
  },
};

function dictFor(idioma: Idioma): Strings {
  if (idioma === "es") return DICT.es;
  return DICT.en;
}

/**
 * Barra sticky inferior visible solo en móvil (lg:hidden).
 *
 * Aparece tras hacer scroll de unos 500px (después del hero).
 * Al pulsar el CTA, abre un modal a pantalla completa con el
 * componente CalendarioReserva dentro.
 */
export default function StickyReservaMovil({
  idioma,
  precio,
  precioPorPersona,
  duracion,
  idiomas,
  cancelacionGratuita,
  horasCancelacion,
  ratingProveedor,
  numeroOpiniones,
  urlReservaBase,
  nombreProveedor,
  textoReservar,
  textoOpiniones,
  textoDesde,
  textoPorPersona,
  textoDuracion,
  textoIdiomas,
  textoCancelacionHorasAntes,
  textoCancelacionGratuita,
}: Props) {
  const t = dictFor(idioma);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      const previo = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previo;
      };
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  // Rating como dato agregado del proveedor (Viator). NO se renderizan
  // opiniones individuales: la API de afiliación lo prohíbe y, además,
  // ExploraSpain no es el operador de la actividad.
  const tieneRating =
    typeof ratingProveedor === "number" &&
    typeof numeroOpiniones === "number" &&
    numeroOpiniones > 0;

  const ratingTextoValor = (ratingProveedor ?? 0).toLocaleString(t.locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const ratingTextoOpiniones =
    numeroOpiniones === 1
      ? `1 ${textoOpiniones}`
      : `${(numeroOpiniones ?? 0).toLocaleString(t.locale)} ${textoOpiniones}`;

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-slate-200 shadow-lg transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        role="region"
        aria-label={t.ariaBarra}
        aria-hidden={!visible}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-6xl mx-auto">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-base font-bold text-slate-900 leading-tight">
              {precio}
            </span>
            <span className="text-xs text-slate-500 leading-tight truncate">
              {tieneRating ? (
                <>
                  <span aria-hidden="true" className="text-amber-500">
                    ★
                  </span>{" "}
                  <span className="font-semibold text-slate-900">
                    {ratingTextoValor}
                  </span>
                  {" ("}
                  {ratingTextoOpiniones}
                  {") · "}
                  {duracion}
                </>
              ) : (
                <>
                  {precioPorPersona} · {duracion}
                </>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 whitespace-nowrap"
          >
            {textoReservar} →
          </button>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/40"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t.ariaModal}
        >
          <div
            className="absolute inset-x-0 bottom-0 top-12 bg-slate-50 rounded-t-2xl overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-10">
              <span className="text-sm font-semibold text-slate-900">
                {t.headerModal}
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                aria-label={t.ariaCerrar}
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <CalendarioReserva
                idioma={idioma}
                precio={precio}
                precioPorPersona={precioPorPersona}
                duracion={duracion}
                idiomas={idiomas}
                cancelacionGratuita={cancelacionGratuita}
                horasCancelacion={horasCancelacion}
                ratingProveedor={ratingProveedor}
                numeroOpiniones={numeroOpiniones}
                urlReservaBase={urlReservaBase}
                nombreProveedor={nombreProveedor}
                textoReservar={textoReservar}
                textoDesde={textoDesde}
                textoPorPersona={textoPorPersona}
                textoDuracion={textoDuracion}
                textoIdiomas={textoIdiomas}
                textoCancelacionHorasAntes={textoCancelacionHorasAntes}
                textoCancelacionGratuita={textoCancelacionGratuita}
              />
            </div>
          </div>
        </div>
      )}

    </>
  );
}
