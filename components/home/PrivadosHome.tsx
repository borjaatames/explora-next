import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";
import { aCardData } from "@/lib/cardActividad";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";
import {
  obtenerCiudadesConPrivadas,
  obtenerPrivadasDeCiudad,
  urlHubPrivados,
} from "@/lib/privados";
import { obtenerCiudadesConActividades, type ActividadListItem } from "@/lib/actividades";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";

const TEXTOS = {
  es: {
    titulo: "Excursiones privadas, solo con tu grupo",
    subtitulo: "Reserva directa con nosotros: sin compartir con desconocidos y con el precio por persona según cuántos seáis.",
    verTodas: (n: number) => `Ver las ${n} excursiones privadas`,
    tarjeta: { desde: "Desde", verActividad: "Ver actividad", cancelacionGratuita: "Cancelación gratis" },
    locale: "es-ES",
  },
  en: {
    titulo: "Private tours, just your group",
    subtitulo: "Book direct with us: no strangers, and the price per person shown by group size.",
    verTodas: (n: number) => `See all ${n} private tours`,
    tarjeta: { desde: "From", verActividad: "View tour", cancelacionGratuita: "Free cancellation" },
    locale: "en-GB",
  },
} as const;

type IdiomaSinHub = Exclude<Idioma, "es" | "en">;

/** DE/FR/IT/PT: fichas privadas en el idioma, sin hub de privados al que enlazar. */
const TEXTOS_SIN_HUB: Record<
  IdiomaSinHub,
  { titulo: string; subtitulo: string; tarjeta: { desde: string; verActividad: string; cancelacionGratuita: string } }
> = {
  de: {
    titulo: "Private Touren, nur für deine Gruppe",
    subtitulo: "Ohne fremde Mitreisende; der Preis pro Person hängt davon ab, wie viele ihr seid.",
    tarjeta: { desde: "Ab", verActividad: "Tour ansehen", cancelacionGratuita: "Kostenlose Stornierung" },
  },
  fr: {
    titulo: "Visites privées, rien que pour votre groupe",
    subtitulo: "Sans inconnus ; le prix par personne dépend du nombre de participants.",
    tarjeta: { desde: "À partir de", verActividad: "Voir la visite", cancelacionGratuita: "Annulation gratuite" },
  },
  it: {
    titulo: "Tour privati, solo per il tuo gruppo",
    subtitulo: "Senza estranei; il prezzo a persona dipende da quanti siete.",
    tarjeta: { desde: "Da", verActividad: "Vedi il tour", cancelacionGratuita: "Cancellazione gratuita" },
  },
  pt: {
    titulo: "Visitas privadas, só para o seu grupo",
    subtitulo: "Sem desconhecidos; o preço por pessoa depende de quantos são.",
    tarjeta: { desde: "Desde", verActividad: "Ver visita", cancelacionGratuita: "Cancelamento gratuito" },
  },
};

const MAX_TARJETAS = 4;
const MIN_TARJETAS_SIN_HUB = 2;

/** La mejor privada de cada ciudad (mismo orden que el hub), hasta 4 ciudades. */
function privadasSinHub(idioma: IdiomaSinHub): ActividadListItem[] {
  return obtenerCiudadesConActividades(idioma)
    .flatMap((c) => obtenerPrivadasDeCiudad(idioma, c).slice(0, 1))
    .sort(
      (a, b) =>
        Number(b.proveedor === "bokun") - Number(a.proveedor === "bokun") ||
        (b.numeroOpiniones ?? 0) - (a.numeroOpiniones ?? 0) ||
        (b.ratingProveedor ?? 0) - (a.ratingProveedor ?? 0)
    )
    .slice(0, MAX_TARJETAS);
}

/** Una privada (la mejor) de cada una de las ciudades con más oferta. */
export default function PrivadosHome({ idioma }: { idioma: Idioma }) {
  if (idioma !== "es" && idioma !== "en") return <PrivadosSinHub idioma={idioma} />;
  const t = TEXTOS[idioma];
  const ciudades = obtenerCiudadesConPrivadas(idioma);
  const total = ciudades.reduce((n, c) => n + c.actividades.length, 0);
  const destacadas = ciudades.slice(0, MAX_TARJETAS).map((c) => c.actividades[0]);
  if (destacadas.length === 0) return null;

  return (
    <section aria-labelledby="privados-home" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          <h2 id="privados-home" className="font-fraunces text-3xl md:text-4xl font-bold text-piedra-900 mb-3">
            {t.titulo}
          </h2>
          <p className="text-piedra-600 text-lg">{t.subtitulo}</p>
        </div>
        <Link
          href={urlHubPrivados(idioma)}
          className="text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors"
        >
          {t.verTodas(total)} →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {destacadas.map((a) => (
          <CardActividad key={a.url} actividad={aCardData(a)} strings={t.tarjeta} locale={t.locale} />
        ))}
      </div>
    </section>
  );
}

function PrivadosSinHub({ idioma }: { idioma: IdiomaSinHub }) {
  const destacadas = privadasSinHub(idioma);
  if (destacadas.length < MIN_TARJETAS_SIN_HUB) return null;
  const t = TEXTOS_SIN_HUB[idioma];

  return (
    <section aria-labelledby="privados-home" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <div className="mb-8 max-w-2xl">
        <h2 id="privados-home" className="font-fraunces text-3xl md:text-4xl font-bold text-piedra-900 mb-3">
          {t.titulo}
        </h2>
        <p className="text-piedra-600 text-lg">{t.subtitulo}</p>
      </div>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {destacadas.map((a) => (
          <CardActividad
            key={a.url}
            actividad={aCardData(a)}
            strings={t.tarjeta}
            locale={IDIOMA_LOCALE[idioma]}
          />
        ))}
      </div>
    </section>
  );
}
