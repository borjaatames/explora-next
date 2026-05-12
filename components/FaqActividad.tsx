import type { PreguntaFrecuente } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  idioma: Idioma;
  preguntas: PreguntaFrecuente[];
};

type Strings = {
  titulo: string;
};

const DICT: Record<"es" | "en", Strings> = {
  es: { titulo: "Preguntas frecuentes" },
  en: { titulo: "Frequently asked questions" },
};

function dictFor(idioma: Idioma): Strings {
  if (idioma === "es") return DICT.es;
  return DICT.en;
}

/**
 * Bloque de Preguntas frecuentes específicas de la actividad.
 *
 * Implementación con <details>/<summary> nativo HTML: no requiere
 * 'use client' ni JavaScript propio. Se respeta así la regla del
 * proyecto de mantener Server Components siempre que sea posible.
 *
 * Decisión de producto: NO se inyecta JSON-LD `FAQPage` hasta que las
 * actividades tengan 4+ preguntas. Con 1-2 preguntas el rich snippet
 * de Google rara vez se acaba mostrando y dilata el HTML innecesariamente.
 *
 * Si la lista está vacía, devuelve null.
 */
export default function FaqActividad({ idioma, preguntas }: Props) {
  if (!preguntas || preguntas.length === 0) return null;
  const t = dictFor(idioma);

  return (
    <section aria-labelledby="faq-titulo">
      <h2
        id="faq-titulo"
        className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-4"
      >
        {t.titulo}
      </h2>
      <div className="border-t border-slate-200">
        {preguntas.map((p) => (
          <details
            key={p.pregunta}
            className="group border-b border-slate-200 py-4"
          >
            <summary
              className="
                flex items-start justify-between gap-4 cursor-pointer
                list-none [&::-webkit-details-marker]:hidden
                font-semibold text-slate-900
                hover:text-sky-700 transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded
              "
            >
              <span className="leading-snug">{p.pregunta}</span>
              <span
                aria-hidden="true"
                className="
                  flex-none mt-1 text-slate-400
                  transition-transform duration-200
                  group-open:rotate-45
                "
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>
            <div className="mt-3 text-sm text-slate-700 leading-relaxed">
              {p.respuesta}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
