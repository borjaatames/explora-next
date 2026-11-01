import Link from "next/link";
import type { ActividadListItem } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";
import { precioComparable } from "@/lib/precioComparable";

type Props = {
  privada: ActividadListItem | undefined;
  idioma: Idioma;
};

const LOCALE: Record<Idioma, string> = { ...IDIOMA_LOCALE, en: "en-GB" };

type Textos = {
  porPersonaGrupo: (precio: string, personas: number) => string;
  porGrupo: (precio: string) => string;
  porPersona: (precio: string) => string;
  pregunta: string;
  version: string;
  ver: string;
};

const TEXTOS: Record<Idioma, Textos> = {
  es: {
    porPersonaGrupo: (f, n) => `desde ${f}/pers. si sois ${n}`,
    porGrupo: (f) => `desde ${f} por grupo`,
    porPersona: (f) => `desde ${f}/pers.`,
    pregunta: "¿Preferís ir solo con vuestro grupo?",
    version: "Versión privada",
    ver: "Ver la privada →",
  },
  en: {
    porPersonaGrupo: (f, n) => `from ${f} per person for ${n}`,
    porGrupo: (f) => `from ${f} per group`,
    porPersona: (f) => `from ${f} per person`,
    pregunta: "Prefer just your own group?",
    version: "Private version",
    ver: "See private tour →",
  },
  de: {
    porPersonaGrupo: (f, n) => `ab ${f} pro Person bei ${n} Personen`,
    porGrupo: (f) => `ab ${f} pro Gruppe`,
    porPersona: (f) => `ab ${f} pro Person`,
    pregunta: "Lieber nur mit deiner Gruppe?",
    version: "Private Variante",
    ver: "Privat ansehen →",
  },
  fr: {
    porPersonaGrupo: (f, n) => `à partir de ${f} par personne pour ${n} personnes`,
    porGrupo: (f) => `à partir de ${f} par groupe`,
    porPersona: (f) => `à partir de ${f} par personne`,
    pregunta: "Vous préférez être seulement entre vous ?",
    version: "Version privée",
    ver: "Voir la version privée →",
  },
  it: {
    porPersonaGrupo: (f, n) => `da ${f} a persona se siete in ${n}`,
    porGrupo: (f) => `da ${f} a gruppo`,
    porPersona: (f) => `da ${f} a persona`,
    pregunta: "Preferisci andare solo con il tuo gruppo?",
    version: "Versione privata",
    ver: "Vedi il tour privato →",
  },
  pt: {
    porPersonaGrupo: (f, n) => `desde ${f} por pessoa para ${n} pessoas`,
    porGrupo: (f) => `desde ${f} por grupo`,
    porPersona: (f) => `desde ${f} por pessoa`,
    pregunta: "Prefere ir apenas com o seu grupo?",
    version: "Versão privada",
    ver: "Ver o tour privado →",
  },
};

/**
 * En fichas de grupo (afiliado) con una privada equivalente: quien viaja en
 * familia o con amigos suele salir mejor en privado por persona.
 */
export default function BandaVersionPrivada({ privada, idioma }: Props) {
  if (!privada) return null;
  const precio = precioComparable(privada);
  const formato = new Intl.NumberFormat(LOCALE[idioma], {
    style: "currency",
    currency: privada.moneda || "EUR",
    maximumFractionDigits: 0,
  }).format(precio.porPersona);
  const t = TEXTOS[idioma];
  const cifra = precio.personasReferencia
    ? t.porPersonaGrupo(formato, precio.personasReferencia)
    : precio.porGrupo
      ? t.porGrupo(formato)
      : t.porPersona(formato);

  return (
    <Link
      href={privada.url}
      data-reserva="version-privada"
      data-ficha={privada.slugs?.es ?? privada.slug}
      className="group flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border border-anil-200 bg-anil-50 px-4 py-3 transition-colors hover:border-anil-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
    >
      <span className="text-sm text-piedra-800">
        <strong className="font-semibold text-piedra-900">
          {t.pregunta}
        </strong>{" "}
        {t.version}: {cifra}.
      </span>
      <span className="text-sm font-semibold text-anil-600 group-hover:text-anil-700">
        {t.ver}
      </span>
    </Link>
  );
}
