import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";

type Props = { url: string; idioma: Idioma };

const TEXTOS: Partial<Record<Idioma, { pregunta: string; enlace: string }>> = {
  es: {
    pregunta: "¿Entradas agotadas en la web oficial?",
    enlace: "Mira qué opciones quedan",
  },
  en: {
    pregunta: "Sold out on the official website?",
    enlace: "See the options left",
  },
  de: {
    pregunta: "Auf der offiziellen Website ausverkauft?",
    enlace: "Diese Optionen bleiben dir",
  },
};

/** Aviso en la ficha que enlaza a la guía de «entradas agotadas» de su monumento. */
export default function AvisoEntradasAgotadas({ url, idioma }: Props) {
  const t = TEXTOS[idioma] ?? TEXTOS.en!;
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-azafran-50 border border-azafran-200 rounded-lg px-4 py-3 text-sm text-piedra-800">
      <span className="font-semibold">{t.pregunta}</span>
      <Link
        href={url}
        className="font-semibold text-anil-700 hover:text-anil-600 underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded"
      >
        {t.enlace} →
      </Link>
    </p>
  );
}
