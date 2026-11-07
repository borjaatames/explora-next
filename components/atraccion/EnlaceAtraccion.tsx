import Link from "next/link";
import type { EnlaceAtraccion as Enlace } from "@/lib/atracciones";
import type { Idioma } from "@/lib/i18n/types";

const TEXTOS: Record<Idioma, { titulo: (n: string) => string; texto: string }> = {
  es: {
    titulo: (n) => `Todas las formas de visitar ${n.replace(/^La /, "la ").replace(/^El /, "el ")}`,
    texto: "Entradas, visitas guiadas, nocturnas y privadas comparadas, con horarios y cómo llegar.",
  },
  en: {
    titulo: (n) => `Every way to visit ${n.replace(/^The /, "the ")}`,
    texto: "Tickets, guided, night and private tours compared, with opening hours and how to get there.",
  },
  de: { titulo: (n) => `Every way to visit ${n}`, texto: "" },
  fr: { titulo: (n) => `Every way to visit ${n}`, texto: "" },
  it: { titulo: (n) => `Every way to visit ${n}`, texto: "" },
  pt: { titulo: (n) => `Every way to visit ${n}`, texto: "" },
};

/** Enlace destacado a la página de la atracción (desde guías y fichas). */
export default function EnlaceAtraccion({
  idioma,
  enlace,
  enColumna = false,
}: {
  idioma: Idioma;
  enlace: Enlace | null;
  /** Dentro de la columna de lectura de la guía: sin contenedor propio. */
  enColumna?: boolean;
}) {
  if (!enlace) return null;
  const t = TEXTOS[idioma];
  return (
    <div className={enColumna ? "" : "mx-auto max-w-3xl px-4 py-6"}>
      <Link
        href={enlace.url}
        className="group flex items-center justify-between gap-4 rounded-xl border border-anil-100 bg-anil-50 p-5 transition-all hover:border-anil-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
      >
        <span>
          <span className="block font-fraunces text-lg font-bold text-piedra-900 group-hover:text-anil-700">
            {t.titulo(enlace.nombre)}
          </span>
          {t.texto ? <span className="mt-1 block text-sm text-piedra-600">{t.texto}</span> : null}
        </span>
        <span aria-hidden="true" className="text-xl font-semibold text-anil-600">
          →
        </span>
      </Link>
    </div>
  );
}
