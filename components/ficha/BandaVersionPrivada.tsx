import Link from "next/link";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import { precioComparable } from "@/lib/precioComparable";

type Props = {
  privada: ActividadListItem | undefined;
  idioma: Idioma;
};

const LOCALE: Record<string, string> = { es: "es-ES", en: "en-GB", de: "de-DE" };

/**
 * En fichas de grupo (afiliado) con una privada equivalente: quien viaja en
 * familia o con amigos suele salir mejor en privado por persona.
 */
export default function BandaVersionPrivada({ privada, idioma }: Props) {
  if (!privada) return null;
  const precio = precioComparable(privada);
  const formato = new Intl.NumberFormat(LOCALE[idioma] ?? "es-ES", {
    style: "currency",
    currency: privada.moneda || "EUR",
    maximumFractionDigits: 0,
  }).format(precio.porPersona);
  const es = idioma === "es";
  const de = idioma === "de";
  const cifra = precio.personasReferencia
    ? es
      ? `desde ${formato}/pers. si sois ${precio.personasReferencia}`
      : de
        ? `ab ${formato} pro Person bei ${precio.personasReferencia} Personen`
        : `from ${formato} per person for ${precio.personasReferencia}`
    : precio.porGrupo
      ? es
        ? `desde ${formato} por grupo`
        : de
          ? `ab ${formato} pro Gruppe`
          : `from ${formato} per group`
      : es
        ? `desde ${formato}/pers.`
        : de
          ? `ab ${formato} pro Person`
          : `from ${formato} per person`;

  return (
    <Link
      href={privada.url}
      data-reserva="version-privada"
      data-ficha={privada.slugs?.es ?? privada.slug}
      className="group flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border border-anil-200 bg-anil-50 px-4 py-3 transition-colors hover:border-anil-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
    >
      <span className="text-sm text-piedra-800">
        <strong className="font-semibold text-piedra-900">
          {es ? "¿Preferís ir solo con vuestro grupo?" : de ? "Lieber nur mit deiner Gruppe?" : "Prefer just your own group?"}
        </strong>{" "}
        {es ? "Versión privada" : de ? "Private Variante" : "Private version"}: {cifra}.
      </span>
      <span className="text-sm font-semibold text-anil-600 group-hover:text-anil-700">
        {es ? "Ver la privada →" : de ? "Privat ansehen →" : "See private tour →"}
      </span>
    </Link>
  );
}
