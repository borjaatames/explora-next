import type { Idioma } from "@/lib/i18n/types";
import type { ResenaCliente } from "@/lib/actividades";

type Props = {
  idioma: Idioma;
  resenas: ResenaCliente[];
};

const TEXTOS = {
  es: {
    titulo: "Lo que dicen nuestros clientes",
    subtitulo: "Opiniones de viajeros que reservaron esta actividad con ExploraSpain.",
    locale: "es-ES",
  },
  en: {
    titulo: "What our customers say",
    subtitulo: "Feedback from travellers who booked this activity with ExploraSpain.",
    locale: "en-GB",
  },
  de: {
    titulo: "Das sagen unsere Kunden",
    subtitulo: "Stimmen von Reisenden, die diese Aktivität bei ExploraSpain gebucht haben.",
    locale: "de-DE",
  },
  fr: {
    titulo: "Ce que disent nos clients",
    subtitulo: "Avis de voyageurs qui ont réservé cette activité avec ExploraSpain.",
    locale: "fr-FR",
  },
  it: {
    titulo: "Cosa dicono i nostri clienti",
    subtitulo: "Opinioni di viaggiatori che hanno prenotato questa attività con ExploraSpain.",
    locale: "it-IT",
  },
  pt: {
    titulo: "O que dizem os nossos clientes",
    subtitulo: "Opiniões de viajantes que reservaram esta atividade com a ExploraSpain.",
    locale: "pt-PT",
  },
} as const satisfies Record<Idioma, unknown>;

/**
 * Reseñas propias: clientes de ExploraSpain que han dado permiso para
 * publicar su opinión. Vienen del frontmatter (`resenasClientes`). Sin
 * estrellas: solo se muestra lo que el cliente dijo, no una nota inventada.
 */
export default function ResenasClientes({ idioma, resenas }: Props) {
  if (resenas.length === 0) return null;
  const t = TEXTOS[idioma];

  return (
    <section id="opiniones-clientes" className="scroll-mt-24" aria-labelledby="resenas-clientes-titulo">
      <h2
        id="resenas-clientes-titulo"
        className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-1"
      >
        {t.titulo}
      </h2>
      <p className="text-sm text-piedra-500 mb-4">{t.subtitulo}</p>
      <ul className="flex flex-col gap-3">
        {resenas.map((r) => (
          <li key={`${r.autor}-${r.fecha ?? ""}`} className="border border-piedra-200 rounded-lg p-4">
            <figure>
              {r.valoracion !== undefined && (
                <p className="text-azafran-500 text-sm mb-2" aria-label={`${r.valoracion}/5`}>
                  {"★".repeat(r.valoracion)}
                  <span className="text-piedra-300">{"★".repeat(5 - r.valoracion)}</span>
                </p>
              )}
              <blockquote className="text-piedra-800 leading-relaxed">«{r.texto}»</blockquote>
              <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-piedra-500">
                <span>
                  <span className="font-semibold text-piedra-900">{r.autor}</span>
                  {r.pais ? ` · ${r.pais}` : ""}
                </span>
                {r.fecha && (
                  <time dateTime={r.fecha}>
                    {new Date(r.fecha).toLocaleDateString(t.locale, { month: "long", year: "numeric" })}
                  </time>
                )}
              </figcaption>
              {r.nota && <p className="mt-1 text-xs text-piedra-500">{r.nota}</p>}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
