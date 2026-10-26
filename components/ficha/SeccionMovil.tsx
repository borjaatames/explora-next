"use client";

import { useId, useState, type ReactNode } from "react";
import type { Idioma } from "@/lib/i18n/types";

export type SeccionFicha =
  | "incluye"
  | "info"
  | "encuentro"
  | "experiencia"
  | "accesibilidad"
  | "cancelacion"
  | "faq";

const TITULOS: Record<"es" | "en", Record<SeccionFicha, string>> = {
  es: {
    incluye: "Qué incluye y qué no",
    info: "Información importante",
    encuentro: "Punto de encuentro",
    experiencia: "La experiencia",
    accesibilidad: "Accesibilidad",
    cancelacion: "Política de cancelación",
    faq: "Preguntas frecuentes",
  },
  en: {
    incluye: "What's included",
    info: "Important information",
    encuentro: "Meeting point",
    experiencia: "The experience",
    accesibilidad: "Accessibility",
    cancelacion: "Cancellation policy",
    faq: "FAQs",
  },
};

type Props = {
  idioma: Idioma;
  seccion: SeccionFicha;
  /** Oculta en móvil el H2 propio de la sección (el botón ya lo nombra). */
  ocultarTitulo?: boolean;
  children: ReactNode;
};

/**
 * Sección plegable de la ficha. En móvil es un acordeón cerrado (cabecera con
 * el nombre de la sección); desde md se ve siempre abierta, como antes. El
 * contenido está siempre en el HTML (solo se oculta con CSS), así que no se
 * pierde SEO.
 */
export default function SeccionMovil({
  idioma,
  seccion,
  ocultarTitulo = true,
  children,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  const titulo = (idioma === "es" ? TITULOS.es : TITULOS.en)[seccion];

  return (
    <div className="border-b border-piedra-200 md:border-0">
      <h2 className="md:hidden">
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls={id}
          onClick={() => setAbierto((v) => !v)}
          className="flex w-full min-h-[52px] items-center justify-between gap-4 text-left text-base font-semibold text-piedra-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded"
        >
          <span>{titulo}</span>
          <span aria-hidden="true" className="text-xl leading-none text-piedra-500">
            {abierto ? "−" : "+"}
          </span>
        </button>
      </h2>
      <div
        id={id}
        className={
          (abierto ? "block pb-5 " : "hidden ") +
          // En móvil la tarjeta interior pierde borde y relleno: ya la
          // enmarca el acordeón.
          "md:block max-md:[&>*]:border-0 max-md:[&>*]:p-0 max-md:[&>*]:rounded-none" +
          (ocultarTitulo
            ? " max-md:[&>*>h2:first-child]:hidden max-md:[&>*>*:first-child>h2:first-child]:hidden"
            : "")
        }
      >
        {children}
      </div>
    </div>
  );
}
