"use client";

import type { Idioma } from "@/lib/i18n/types";

type Props = {
  idioma: Idioma;
  titulo: string;
  /** Precio ya formateado («30 €») o null si no hay. */
  precio: string | null;
  /** Ruta interna de la ficha (`/en/cities/...`). */
  ruta: string;
  slugEs: string;
};

const TEXTOS: Record<Idioma, { boton: string; mensaje: (t: string, p: string | null) => string }> = {
  es: { boton: "Guardar o compartir", mensaje: (t, p) => `Mira esta actividad: ${t}${p ? `, desde ${p}` : ""}` },
  en: { boton: "Save or share", mensaje: (t, p) => `Have a look at this: ${t}${p ? `, from ${p}` : ""}` },
  de: { boton: "Merken oder teilen", mensaje: (t, p) => `Schau mal: ${t}${p ? `, ab ${p}` : ""}` },
  fr: { boton: "Garder ou partager", mensaje: (t, p) => `Regarde cette activité : ${t}${p ? `, dès ${p}` : ""}` },
  it: { boton: "Salva o condividi", mensaje: (t, p) => `Guarda questa attività: ${t}${p ? `, da ${p}` : ""}` },
  pt: { boton: "Guardar ou partilhar", mensaje: (t, p) => `Vê esta atividade: ${t}${p ? `, desde ${p}` : ""}` },
};

type Gtag = (comando: "event", nombre: string, parametros: Record<string, string>) => void;

function medir(metodo: string, idioma: Idioma, slugEs: string): void {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", "click_compartir_ficha", { metodo, idioma, ficha_slug: slugEs });
}

/**
 * Botón «Guardar o compartir» de la ficha: quien duda se la manda a sí mismo
 * o a su pareja y vuelve más tarde (en Clarity se ven muchas visitas
 * repetidas antes de reservar). Móvil: hoja de compartir del sistema;
 * si no existe, WhatsApp con el mensaje ya escrito.
 */
export default function CompartirFicha({ idioma, titulo, precio, ruta, slugEs }: Props) {
  const t = TEXTOS[idioma];

  async function compartir(): Promise<void> {
    const url = `${window.location.origin}${ruta}`;
    const texto = t.mensaje(titulo, precio);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: titulo, text: texto, url });
        medir("nativo", idioma, slugEs);
      } catch {
        // El usuario cerró la hoja de compartir: no es un error.
      }
      return;
    }
    medir("whatsapp", idioma, slugEs);
    window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={compartir}
      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M12 3v12m0-12-4 4m4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      </svg>
      {t.boton}
    </button>
  );
}
