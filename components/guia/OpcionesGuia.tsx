import Image from "next/image";
import Link from "next/link";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import type { WebOficialFrontmatter } from "@/lib/guias";
import {
  formatearOpiniones,
  formatearPrecio,
  formatearRating,
} from "@/lib/guiasReservas";

export type OpcionGuia = {
  /** Etiqueta editorial de la opción («La más barata», «Con guía»…). */
  etiqueta: string;
  actividad: ActividadListItem;
};

type Props = {
  opciones: OpcionGuia[];
  idioma: Idioma;
  webOficial?: WebOficialFrontmatter;
};

const TEXTOS = {
  es: {
    titulo: (n: number) => `Nuestras ${n} opciones`,
    subtitulo: "Elige según tu presupuesto y cómo quieres visitarlo",
    cancelacion: "Cancelación gratis",
    cta: "Ver disponibilidad",
    aria: "Opciones recomendadas para reservar",
    oficial: "¿Prefieres la web oficial?",
    verOficial: "Ver la web oficial",
  },
  en: {
    titulo: (n: number) => `Our ${n} picks`,
    subtitulo: "Choose by budget and how you want to visit",
    cancelacion: "Free cancellation",
    cta: "Check availability",
    aria: "Recommended options to book",
    oficial: "Prefer the official website?",
    verOficial: "Go to the official website",
  },
  de: {
    titulo: (n: number) => `Unsere ${n} Empfehlungen`,
    subtitulo: "Wähle nach Budget und Art des Besuchs",
    cancelacion: "Kostenlose Stornierung",
    cta: "Verfügbarkeit prüfen",
    aria: "Empfohlene Buchungsoptionen",
    oficial: "Lieber über die offizielle Website?",
    verOficial: "Zur offiziellen Website",
  },
  fr: {
    titulo: (n: number) => `Nos ${n} options`,
    subtitulo: "Choisissez selon votre budget et votre façon de visiter",
    cancelacion: "Annulation gratuite",
    cta: "Voir les disponibilités",
    aria: "Options recommandées à réserver",
    oficial: "Vous préférez le site officiel ?",
    verOficial: "Voir le site officiel",
  },
  it: {
    titulo: (n: number) => `Le nostre ${n} opzioni`,
    subtitulo: "Scegli in base al budget e a come vuoi visitarlo",
    cancelacion: "Cancellazione gratuita",
    cta: "Verifica disponibilità",
    aria: "Opzioni consigliate da prenotare",
    oficial: "Preferisci il sito ufficiale?",
    verOficial: "Vai al sito ufficiale",
  },
  pt: {
    titulo: (n: number) => `As nossas ${n} opções`,
    subtitulo: "Escolha consoante o orçamento e a forma como quer visitar",
    cancelacion: "Cancelamento gratuito",
    cta: "Ver disponibilidade",
    aria: "Opções recomendadas para reservar",
    oficial: "Prefere o site oficial?",
    verOficial: "Ver o site oficial",
  },
} as const satisfies Record<Idioma, unknown>;

function textos(idioma: Idioma) {
  return TEXTOS[idioma];
}

/**
 * Bloque «Nuestras 3 opciones» bajo la respuesta corta en guías de un solo
 * monumento (`opciones:` en el frontmatter). Cada tarjeta lleva una etiqueta
 * editorial que dice para quién es, para que el lector elija en segundos.
 * Los clics se miden como `click_reserva` con `posicion = opciones`.
 */
function dominio(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

export default function OpcionesGuia({ opciones, idioma, webOficial }: Props) {
  if (opciones.length === 0) return null;
  const t = textos(idioma);

  return (
    <section id="opciones" aria-label={t.aria} className="bg-piedra-50 border-b border-piedra-200 scroll-mt-4">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="mb-5">
          <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900">
            {t.titulo(opciones.length)}
          </h2>
          <p className="text-sm text-piedra-500 mt-1">{t.subtitulo}</p>
        </div>
        <ol className={`grid grid-cols-1 gap-4 ${opciones.length % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {opciones.map(({ etiqueta, actividad: a }) => {
            const rating = formatearRating(a, idioma);
            const opiniones = formatearOpiniones(a, idioma);
            const slugEs = a.slugs?.es ?? a.slug;
            return (
              <li
                key={a.url}
                className="flex flex-col overflow-hidden bg-white border border-piedra-200 rounded-lg hover:border-anil-400 hover:shadow-md transition-all"
              >
                {/* Móvil: miniatura a la izquierda (como el listado de GYG); escritorio: foto arriba. */}
                <div className="flex gap-3 p-4 md:flex-col md:gap-0 md:p-0">
                  {a.imagen ? (
                    <Link
                      href={a.url}
                      data-reserva="opciones"
                      data-ficha={slugEs}
                      tabIndex={-1}
                      aria-hidden
                      className="relative h-24 w-24 flex-none overflow-hidden rounded-md bg-piedra-100 md:h-auto md:w-full md:aspect-[16/9] md:rounded-none"
                    >
                      <Image
                        src={a.imagen}
                        alt={a.imagenAlt}
                        fill
                        sizes="(min-width: 768px) 320px, 96px"
                        className="object-cover"
                      />
                    </Link>
                  ) : null}
                  <div className="min-w-0 flex-1 md:px-4 md:pt-4">
                    <span className="inline-block bg-anil-100 text-anil-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-2">
                      {etiqueta}
                    </span>
                    <Link
                      href={a.url}
                      data-reserva="opciones"
                      data-ficha={slugEs}
                      className="block font-semibold text-piedra-900 hover:text-anil-700 transition-colors leading-snug line-clamp-3"
                    >
                      {a.titulo}
                    </Link>
                    <p className="text-xs text-piedra-500 mt-1">
                      {rating ? (
                        <>
                          <span className="text-azafran-600" aria-hidden>
                            ★
                          </span>{" "}
                          {rating}
                          {opiniones ? ` (${opiniones})` : null}
                        </>
                      ) : null}
                      {a.cancelacionGratuita ? (
                        <>
                          {rating ? " · " : null}
                          {t.cancelacion}
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
                <div className="mt-auto px-4 pb-4 md:pt-4 flex items-center justify-between gap-3">
                  <span className="font-bold text-piedra-900">
                    {formatearPrecio(a, idioma)}
                  </span>
                  <Link
                    href={a.url}
                    data-reserva="opciones"
                    data-ficha={slugEs}
                    className="inline-flex items-center justify-center bg-azafran-500 hover:bg-azafran-600 text-piedra-900 font-semibold text-sm px-4 py-2.5 min-h-[44px] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2"
                  >
                    {t.cta}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
        {webOficial ? (
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg border border-piedra-200 bg-white px-4 py-3 text-sm text-piedra-700">
            <span className="font-semibold text-piedra-900">{t.oficial}</span>
            <span>
              {webOficial.precio} · {dominio(webOficial.url)}
              {webOficial.nota ? `. ${webOficial.nota}` : null}
            </span>
            <a
              href={webOficial.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="font-semibold text-anil-600 hover:text-anil-700 underline underline-offset-2 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
            >
              {t.verOficial} ↗
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
