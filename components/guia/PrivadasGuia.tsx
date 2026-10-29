import Link from "next/link";
import Image from "next/image";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import { precioComparable } from "@/lib/precioComparable";

type Props = {
  actividades: ActividadListItem[];
  idioma: Idioma;
};

const TEXTOS = {
  es: {
    titulo: "En privado, solo con tu grupo",
    subtitulo: "Recogida en tu alojamiento, a tu ritmo y sin compartir con desconocidos. Reserva directa con nosotros.",
    porPersona: "/pers.",
    grupo: (n: number, total: string) => `grupo de ${n}: ${total} en total`,
    porGrupo: "por grupo",
    desde: "desde",
    cta: "Ver fechas",
    aria: "Excursiones privadas relacionadas",
  },
  en: {
    titulo: "Private, just your group",
    subtitulo: "Pickup from your accommodation, at your own pace and with no strangers. Book directly with us.",
    porPersona: "/person",
    grupo: (n: number, total: string) => `group of ${n}: ${total} total`,
    porGrupo: "per group",
    desde: "from",
    cta: "See dates",
    aria: "Related private tours",
  },
  de: {
    titulo: "Privat, nur mit deiner Gruppe",
    subtitulo: "Abholung an deiner Unterkunft, in deinem Tempo und ohne Fremde. Direkt bei uns buchen.",
    porPersona: "/Pers.",
    grupo: (n: number, total: string) => `Gruppe von ${n}: ${total} gesamt`,
    porGrupo: "pro Gruppe",
    desde: "ab",
    cta: "Termine ansehen",
    aria: "Passende Privattouren",
  },
} as const;

const LOCALE: Record<string, string> = { es: "es-ES", en: "en-GB", de: "de-DE" };

/**
 * Bloque de excursiones privadas (venta directa) dentro de una guía, con el
 * precio por persona comparable al de los tours en grupo.
 */
export default function PrivadasGuia({ actividades, idioma }: Props) {
  if (actividades.length === 0) return null;
  const t = idioma === "en" ? TEXTOS.en : idioma === "de" ? TEXTOS.de : TEXTOS.es;

  return (
    <section aria-label={t.aria} className="border-b border-piedra-200">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-10">
        <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900">{t.titulo}</h2>
        <p className="mt-1 mb-4 text-sm text-piedra-600">{t.subtitulo}</p>
        <ul className="grid grid-cols-1 gap-3">
          {actividades.map((a) => {
            const formato = new Intl.NumberFormat(LOCALE[idioma] ?? "es-ES", {
              style: "currency",
              currency: a.moneda || "EUR",
              maximumFractionDigits: 0,
            });
            const precio = precioComparable(a);
            const slugEs = a.slugs?.es ?? a.slug;
            return (
              <li key={a.url}>
                <Link
                  href={a.url}
                  data-reserva="privada"
                  data-ficha={slugEs}
                  className="group flex items-center gap-3 rounded-lg border border-piedra-200 bg-white p-3 transition-all hover:border-anil-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
                >
                  {a.imagen ? (
                    <div className="relative h-16 w-20 flex-none overflow-hidden rounded-md bg-piedra-100">
                      <Image src={a.imagen} alt={a.imagenAlt} fill sizes="80px" className="object-cover" />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug text-piedra-900 group-hover:text-anil-700 transition-colors line-clamp-2">
                      {a.titulo}
                    </p>
                    <p className="mt-0.5 text-xs text-piedra-500">
                      {a.duracion ? `${a.duracion} · ` : null}
                      {precio.porGrupo
                        ? precio.personasReferencia && precio.totalReferencia
                          ? t.grupo(precio.personasReferencia, formato.format(precio.totalReferencia))
                          : t.porGrupo
                        : null}
                    </p>
                  </div>
                  <div className="flex-none text-right">
                    <p className="text-xs text-piedra-500">{t.desde}</p>
                    <p className="font-bold text-piedra-900">
                      {formato.format(precio.porPersona)}
                      {precio.personasReferencia || !precio.porGrupo ? (
                        <span className="text-xs font-normal text-piedra-500">{t.porPersona}</span>
                      ) : null}
                    </p>
                    <span className="hidden sm:inline text-sm font-semibold text-anil-600">{t.cta} →</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
