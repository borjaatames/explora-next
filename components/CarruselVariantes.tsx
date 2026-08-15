import Link from "next/link";
import Image from "next/image";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  variantes: ActividadListItem[];
  /**
   * Texto del título. Por defecto "Otras formas de visitar X" usando el
   * nombre de la atracción. El page se encarga de pasarlo construido.
   */
  titulo: string;
  /**
   * Idioma de la página padre. Determina el copy del CTA mobile, el
   * locale de Intl.NumberFormat (precio) y el texto "Desde".
   */
  idioma: Idioma;
};

const DICT = {
  es: {
    deslizar: "Desliza para ver más →",
    desde: "Desde",
    localePrecio: "es-ES",
  },
  en: {
    deslizar: "Swipe to see more →",
    desde: "From",
    localePrecio: "en-US",
  },
  de: {
    deslizar: "Wischen, um mehr zu sehen →",
    desde: "Ab",
    localePrecio: "de-DE",
  },
} as const;

function textosCarrusel(idioma: Idioma): (typeof DICT)[keyof typeof DICT] {
  if (idioma === "en") return DICT.en;
  if (idioma === "de") return DICT.de;
  return DICT.es;
}

/**
 * Carrusel "Otras formas de visitar el Prado" — ofrece variantes de la
 * MISMA atracción/experiencia (sin guía, privado, combinado, familiar...).
 *
 * Conceptualmente distinto del bloque "Alternativas en Madrid", que
 * propone OTRAS actividades distintas en la misma ciudad. La distinción
 * visual y semántica ayuda al usuario a comparar opciones del mismo
 * museo sin perder el contexto.
 *
 * - Desktop: grid de 3 columnas estático, sin flechas.
 * - Móvil: scroll horizontal con snap, tarjetas de ~75% del viewport.
 *
 * Si la lista está vacía, devuelve null y el page no renderiza la sección.
 */
export default function CarruselVariantes({
  variantes,
  titulo,
  idioma,
}: Props) {
  if (!variantes || variantes.length === 0) return null;

  const t = textosCarrusel(idioma);

  return (
    <section aria-labelledby="variantes-titulo">
      <h2
        id="variantes-titulo"
        className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-2"
      >
        {titulo}
      </h2>
      <p className="text-sm text-slate-500 mb-5 md:hidden">{t.deslizar}</p>

      <div
        className="
          flex md:grid md:grid-cols-3 gap-4
          overflow-x-auto md:overflow-visible
          snap-x snap-mandatory md:snap-none
          -mx-4 px-4 md:mx-0 md:px-0
          pb-4 md:pb-0
          scrollbar-hide
        "
      >
        {variantes.map((variante) => (
          <VarianteCard
            key={variante.url}
            actividad={variante}
            idioma={idioma}
          />
        ))}
      </div>
    </section>
  );
}

type CardProps = { actividad: ActividadListItem; idioma: Idioma };

function VarianteCard({ actividad, idioma }: CardProps) {
  const t = textosCarrusel(idioma);

  const precio = new Intl.NumberFormat(t.localePrecio, {
    style: "currency",
    currency: actividad.moneda,
    maximumFractionDigits: 0,
  }).format(actividad.precioDesde);

  return (
    <Link
      href={actividad.url}
      className="
        group flex-none w-72 md:w-auto
        snap-start
        bg-white border border-slate-200 rounded-lg overflow-hidden
        hover:border-sky-400 hover:shadow-md transition-all
      "
    >
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        {actividad.imagen ? (
          <Image
            src={actividad.imagen}
            alt={actividad.imagenAlt}
            fill
            sizes="(max-width: 768px) 75vw, 22vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-playfair text-base font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-sky-700 transition-colors">
          {actividad.titulo}
        </h3>
        <p className="text-xs text-slate-500 mb-2 line-clamp-2 leading-relaxed">
          {actividad.descripcion}
        </p>
        <p className="text-xs text-slate-500">
          {actividad.duracion} · {t.desde}{" "}
          <span className="font-semibold text-slate-900">{precio}</span>
        </p>
      </div>
    </Link>
  );
}
