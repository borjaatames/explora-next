import type { Idioma } from "@/lib/i18n/types";
import { formatearPrecioBokun, type PrecioGrupo } from "@/lib/reservaBokun";

type Props = {
  precios: ReadonlyArray<PrecioGrupo> | undefined;
  moneda?: string;
  idioma: Idioma;
};

const TEXTOS = {
  es: {
    titulo: "Precio por persona según cuántos seáis",
    personas: (n: number) => (n === 1 ? "1 persona" : `${n} personas`),
    porPersona: "/pers.",
    total: "total",
    nota: "Precio total del grupo; puede variar según la fecha.",
  },
  en: {
    titulo: "Price per person by group size",
    personas: (n: number) => (n === 1 ? "1 person" : `${n} people`),
    porPersona: "/person",
    total: "total",
    nota: "Total price for the group; it may vary by date.",
  },
  de: {
    titulo: "Preis pro Person nach Gruppengröße",
    personas: (n: number) => (n === 1 ? "1 Person" : `${n} Personen`),
    porPersona: "/Pers.",
    total: "gesamt",
    nota: "Gesamtpreis für die Gruppe; kann je nach Datum variieren.",
  },
} as const;

/**
 * Privadas con precio por grupo: quien llega desde un anuncio compara con
 * excursiones en grupo, que se anuncian por persona. Enseñamos el total y lo
 * que sale por persona para 2, 4 y 6 (o los tamaños que haya en Bókun).
 */
export default function PreciosPorGrupo({ precios, moneda, idioma }: Props) {
  if (!precios || precios.length < 2) return null;
  const t = TEXTOS[idioma === "en" || idioma === "de" ? idioma : "es"];

  return (
    <div className="w-full rounded-lg border border-piedra-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-piedra-500 mb-2">
        {t.titulo}
      </p>
      <ul className="grid grid-cols-3 gap-2">
        {precios.slice(0, 3).map((p) => (
          <li key={p.personas} className="rounded-md bg-piedra-50 px-2 py-2 text-center">
            <span className="block text-xs text-piedra-600">{t.personas(p.personas)}</span>
            <span className="block text-base font-bold text-piedra-900">
              {formatearPrecioBokun(Math.round(p.total / p.personas), moneda, idioma)}
              <span className="text-xs font-normal text-piedra-500">{t.porPersona}</span>
            </span>
            <span className="block text-xs text-piedra-500">
              {formatearPrecioBokun(p.total, moneda, idioma)} {t.total}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-piedra-500">{t.nota}</p>
    </div>
  );
}
