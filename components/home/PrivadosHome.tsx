import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";
import { aCardData } from "@/lib/cardActividad";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";
import { obtenerCiudadesConPrivadas, urlHubPrivados } from "@/lib/privados";

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

const MAX_TARJETAS = 4;

/** Una privada (la mejor) de cada una de las ciudades con más oferta. */
export default function PrivadosHome({ idioma }: { idioma: Idioma }) {
  if (idioma !== "es" && idioma !== "en") return null;
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
