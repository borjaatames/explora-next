import Link from "next/link";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import { precioComparable } from "@/lib/precioComparable";

type Props = {
  alternativa: ActividadListItem | undefined;
  motivo: string;
  idioma: Idioma;
};

const LOCALE: Record<string, string> = { es: "es-ES", en: "en-GB", de: "de-DE" };

const TEXTOS: Partial<Record<Idioma, { etiqueta: string; ver: string; desde: string; persona: string; grupo: string }>> = {
  es: { etiqueta: "Alternativa", ver: "Ver esta opción →", desde: "desde", persona: "/pers.", grupo: "por grupo" },
  en: { etiqueta: "Alternative", ver: "See this option →", desde: "from", persona: " per person", grupo: "per group" },
  de: { etiqueta: "Alternative", ver: "Diese Option ansehen →", desde: "ab", persona: " pro Person", grupo: "pro Gruppe" },
};

/**
 * Caja junto a los datos clave de la ficha que ofrece otra ficha de la misma
 * ciudad cuando esta suele agotarse o hay una opción claramente mejor.
 * El motivo viene del frontmatter (`alternativa.motivo`) y debe ser cierto y
 * estático: nunca fechas ni plazas inventadas.
 */
export default function AlternativaReserva({ alternativa, motivo, idioma }: Props) {
  if (!alternativa) return null;
  const t = TEXTOS[idioma] ?? TEXTOS.en!;
  const precio = precioComparable(alternativa);
  const formato = new Intl.NumberFormat(LOCALE[idioma] ?? "es-ES", {
    style: "currency",
    currency: alternativa.moneda || "EUR",
    maximumFractionDigits: 0,
  }).format(precio.porPersona);
  const cifra = precio.porGrupo && !precio.personasReferencia
    ? `${t.desde} ${formato} ${t.grupo}`
    : `${t.desde} ${formato}${t.persona}`;

  return (
    <aside
      aria-label={t.etiqueta}
      className="mt-4 rounded-lg border border-azafran-200 bg-azafran-50 px-4 py-3"
    >
      <p className="text-sm text-piedra-800">{motivo}</p>
      <Link
        href={alternativa.url}
        data-reserva="alternativa"
        data-ficha={alternativa.slugs?.es ?? alternativa.slug}
        className="group mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
      >
        <span className="text-sm font-semibold text-piedra-900 group-hover:text-anil-700 transition-colors">
          {alternativa.titulo} · {cifra}
        </span>
        <span className="text-sm font-semibold text-anil-600 group-hover:text-anil-700 transition-colors">
          {t.ver}
        </span>
      </Link>
    </aside>
  );
}
