import Link from "next/link";
import {
  obtenerActividadesParaPaginaCiudad,
  obtenerListaActividades,
  type ActividadListItem,
} from "@/lib/actividades";
import { aCardData } from "@/lib/cardActividad";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";
import { urlActividadesDeCiudad } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";

/** Idiomas con catálogo parcial: solo las fichas que se hacen en ese idioma. */
export type IdiomaCatalogoParcial = Exclude<Idioma, "es" | "en">;

export function esIdiomaCatalogoParcial(idioma: Idioma): idioma is IdiomaCatalogoParcial {
  return idioma !== "es" && idioma !== "en";
}

type Textos = {
  titulo: (ciudad: string) => string;
  aviso: string;
  verTodas: (n: number) => string;
  tarjeta: { desde: string; verActividad: string; cancelacionGratuita: string };
};

const TEXTOS: Record<IdiomaCatalogoParcial, Textos> = {
  de: {
    titulo: (c) => `Weitere Aktivitäten in ${c}`,
    aviso:
      "Seiten auf Englisch – die Aktivität findet in den auf jeder Seite angegebenen Sprachen statt; gebucht wird wie bei den anderen online.",
    verTodas: (n) => `Alle ${n} Aktivitäten ansehen (auf Englisch)`,
    tarjeta: { desde: "Ab", verActividad: "Aktivität ansehen", cancelacionGratuita: "Kostenlose Stornierung" },
  },
  fr: {
    titulo: (c) => `Plus d’activités à ${c}`,
    aviso:
      "Fiches en anglais — l’activité se déroule dans les langues indiquées sur chaque fiche ; la réservation se fait en ligne, comme pour les autres.",
    verTodas: (n) => `Voir les ${n} activités (en anglais)`,
    tarjeta: { desde: "À partir de", verActividad: "Voir l'activité", cancelacionGratuita: "Annulation gratuite" },
  },
  it: {
    titulo: (c) => `Altre attività a ${c}`,
    aviso:
      "Schede in inglese — l’attività si svolge nelle lingue indicate in ciascuna scheda; si prenota online, come le altre.",
    verTodas: (n) => `Vedi tutte le ${n} attività (in inglese)`,
    tarjeta: { desde: "Da", verActividad: "Vedi l'attività", cancelacionGratuita: "Cancellazione gratuita" },
  },
  pt: {
    titulo: (c) => `Mais atividades em ${c}`,
    aviso:
      "Fichas em inglês — a atividade decorre nos idiomas indicados em cada ficha; a reserva faz-se online, como nas restantes.",
    verTodas: (n) => `Ver as ${n} atividades (em inglês)`,
    tarjeta: { desde: "Desde", verActividad: "Ver atividade", cancelacionGratuita: "Cancelamento gratuito" },
  },
};

export type ActividadesEnIngles = {
  /** Fichas EN sin versión en el idioma, ordenadas (destacadas, nota, opiniones). */
  actividades: ActividadListItem[];
  /** Total del listado EN de la ciudad (para «Ver las N actividades»). */
  totalListadoEn: number;
};

/**
 * Fichas EN de la ciudad que no tienen gemela en `idioma`. Se compara por el
 * slug ES (`slugs.es`) y, de respaldo, por `slugs.en` de la ficha del idioma.
 */
export function actividadesSoloEnIngles(
  idioma: IdiomaCatalogoParcial,
  ciudad: string
): ActividadesEnIngles {
  const listadoEn = obtenerActividadesParaPaginaCiudad("en", ciudad);
  const propias = obtenerListaActividades(idioma);
  const slugsEs = new Set(propias.flatMap((a) => (a.slugs?.es ? [a.slugs.es] : [])));
  const slugsEn = new Set(propias.flatMap((a) => (a.slugs?.en ? [a.slugs.en] : [])));

  const actividades = listadoEn
    .filter((a) => !(a.slugs?.es && slugsEs.has(a.slugs.es)) && !slugsEn.has(a.slug))
    .sort(
      (a, b) =>
        Number(b.destacada === true) - Number(a.destacada === true) ||
        (b.ratingProveedor ?? 0) - (a.ratingProveedor ?? 0) ||
        (b.numeroOpiniones ?? 0) - (a.numeroOpiniones ?? 0)
    );
  return { actividades, totalListadoEn: listadoEn.length };
}

type Props = {
  idioma: IdiomaCatalogoParcial;
  ciudad: string;
  nombreCiudad: string;
  max: number;
};

/** «Más actividades en <ciudad>»: fichas en inglés que no existen en el idioma de la página. */
export default function MasActividadesEnIngles({ idioma, ciudad, nombreCiudad, max }: Props) {
  const { actividades, totalListadoEn } = actividadesSoloEnIngles(idioma, ciudad);
  if (actividades.length === 0) return null;
  const t = TEXTOS[idioma];
  const locale = IDIOMA_LOCALE[idioma];

  return (
    <section aria-labelledby="mas-actividades-en" className="border-t border-piedra-200">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="max-w-2xl">
            <h2
              id="mas-actividades-en"
              className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-2"
            >
              {t.titulo(nombreCiudad)}
            </h2>
            <p className="text-sm text-piedra-500">{t.aviso}</p>
          </div>
          <Link
            href={urlActividadesDeCiudad("en", ciudad)}
            hrefLang="en"
            prefetch={false}
            className="text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors"
          >
            {t.verTodas(totalListadoEn)} →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {actividades.slice(0, max).map((a) => (
            <CardActividad key={a.url} actividad={aCardData(a)} strings={t.tarjeta} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
