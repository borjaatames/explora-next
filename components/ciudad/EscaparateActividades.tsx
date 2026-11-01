import Link from "next/link";
import type { ChipFiltro } from "@/lib/ciudades";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";
import { calcularEtiquetas } from "@/lib/etiquetasActividad";
import { aCardData } from "@/lib/cardActividad";
import { intercalarPrivadas, porPopularidad } from "@/lib/ordenActividades";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";

const TEXTOS = {
  es: {
    titulo: (c: string, conPrivadas: boolean) =>
      conPrivadas ? `Lo más popular en ${c} y nuestras excursiones privadas` : `Las actividades más populares en ${c}`,
    todas: "Todas",
    verTodas: (n: number) => `Ver las ${n} actividades`,
    tarjeta: { desde: "Desde", verActividad: "Ver actividad", cancelacionGratuita: "Cancelación gratis" },
  },
  en: {
    titulo: (c: string, conPrivadas: boolean) =>
      conPrivadas ? `Most popular in ${c}, plus our private tours` : `Most popular things to do in ${c}`,
    todas: "All",
    verTodas: (n: number) => `See all ${n} activities`,
    tarjeta: { desde: "From", verActividad: "View activity", cancelacionGratuita: "Free cancellation" },
  },
  de: {
    titulo: (c: string, conPrivadas: boolean) =>
      conPrivadas ? `Am beliebtesten in ${c} und unsere Privattouren` : `Die beliebtesten Aktivitäten in ${c}`,
    todas: "Alle",
    verTodas: (n: number) => `Alle ${n} Aktivitäten ansehen`,
    tarjeta: { desde: "Ab", verActividad: "Aktivität ansehen", cancelacionGratuita: "Kostenlose Stornierung" },
  },
  fr: {
    titulo: (c: string, conPrivadas: boolean) =>
      conPrivadas ? `Les plus populaires à ${c} et nos visites privées` : `Les activités les plus populaires à ${c}`,
    todas: "Toutes",
    verTodas: (n: number) => `Voir les ${n} activités`,
    tarjeta: { desde: "À partir de", verActividad: "Voir l'activité", cancelacionGratuita: "Annulation gratuite" },
  },
  it: {
    titulo: (c: string, conPrivadas: boolean) =>
      conPrivadas ? `Le più popolari a ${c} e i nostri tour privati` : `Le attività più popolari a ${c}`,
    todas: "Tutte",
    verTodas: (n: number) => `Vedi tutte le ${n} attività`,
    tarjeta: { desde: "Da", verActividad: "Vedi l'attività", cancelacionGratuita: "Cancellazione gratuita" },
  },
  pt: {
    titulo: (c: string, conPrivadas: boolean) =>
      conPrivadas ? `O mais popular em ${c} e os nossos tours privados` : `As atividades mais populares em ${c}`,
    todas: "Todas",
    verTodas: (n: number) => `Ver as ${n} atividades`,
    tarjeta: { desde: "Desde", verActividad: "Ver atividade", cancelacionGratuita: "Cancelamento gratuito" },
  },
} as const satisfies Record<Idioma, unknown>;

/** Tarjetas visibles: 8 en escritorio (dos filas de 4) y 6 en móvil. */
const MAX_ESCRITORIO = 8;
const MAX_MOVIL = 6;

type Props = {
  idioma: Idioma;
  nombreCiudad: string;
  actividades: ActividadListItem[];
  chips: ReadonlyArray<ChipFiltro>;
  urlActividades: string;
};

/**
 * Escaparate de la página de ciudad: las actividades con más opiniones,
 * justo bajo la cabecera, con accesos por atracción al listado filtrado.
 */
export default function EscaparateActividades({
  idioma,
  nombreCiudad,
  actividades,
  chips,
  urlActividades,
}: Props) {
  if (actividades.length === 0) return null;
  const t = TEXTOS[idioma];
  const etiquetas = calcularEtiquetas(actividades);
  const top = intercalarPrivadas(
    actividades
      .map((a) => ({ ...aCardData(a), etiqueta: etiquetas.get(a.slug) }))
      .sort(porPopularidad)
  ).slice(0, MAX_ESCRITORIO);
  const claseChip =
    "shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2";

  return (
    <section className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-4">
        <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900">
          {t.titulo(nombreCiudad, top.some((a) => a.privada))}
        </h2>
        <Link
          href={urlActividades}
          prefetch={false}
          className="hidden md:inline-flex text-anil-600 hover:text-anil-700 font-semibold transition-colors"
        >
          {t.verTodas(actividades.length)} →
        </Link>
      </div>

      {chips.length > 0 ? (
        <nav
          aria-label={t.titulo(nombreCiudad, top.some((a) => a.privada))}
          className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1 mb-5 [scrollbar-width:none]"
        >
          <span className={claseChip + " bg-anil-500 border-anil-500 text-white"}>
            {t.todas}
          </span>
          {chips.map((c) => (
            <Link
              key={c.tag}
              href={`${urlActividades}?atraccion=${encodeURIComponent(c.tag)}`}
              prefetch={false}
              className={claseChip + " bg-white border-piedra-300 text-piedra-900 hover:border-anil-400"}
            >
              {c.label}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-6 border-t border-piedra-200 md:border-0">
        {top.map((a, i) => (
          <div key={a.slug} className={i < MAX_MOVIL ? "flex" : "hidden md:flex"}>
            <CardActividad actividad={a} strings={t.tarjeta} locale={IDIOMA_LOCALE[idioma]} />
          </div>
        ))}
      </div>

      <div className="mt-5 md:mt-8 text-center">
        <Link
          href={urlActividades}
          prefetch={false}
          className="inline-flex w-full md:w-auto items-center justify-center rounded-lg bg-azafran-500 hover:bg-azafran-600 px-6 py-3 font-semibold text-piedra-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2"
        >
          {t.verTodas(actividades.length)}
        </Link>
      </div>
    </section>
  );
}
