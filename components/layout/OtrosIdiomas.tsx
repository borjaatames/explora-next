import Link from "next/link";
import { IDIOMAS_ACTIVOS, IDIOMA_LABELS } from "@/lib/i18n/config";
import type { Idioma } from "@/lib/i18n/types";

const ETIQUETA: Record<Idioma, string> = {
  es: "Esta página en otros idiomas",
  en: "This page in other languages",
  de: "Diese Seite in anderen Sprachen",
  fr: "Cette page dans d'autres langues",
  it: "Questa pagina in altre lingue",
  pt: "Esta página noutros idiomas",
};

type Props = {
  idioma: Idioma;
  rutas: Partial<Record<Idioma, string>>;
};

/**
 * Enlaces visibles (en el HTML estático) a la misma página en los otros
 * idiomas. Complementa al selector del navbar, que resuelve las parejas en
 * cliente con /parejas.json y por eso no deja enlaces rastreables.
 */
export default function OtrosIdiomas({ idioma, rutas }: Props) {
  const otros = IDIOMAS_ACTIVOS.filter((l) => l !== idioma && rutas[l]);
  if (otros.length === 0) return null;

  return (
    <nav
      aria-label={ETIQUETA[idioma]}
      className="max-w-3xl mx-auto px-4 pb-12 text-center text-sm text-slate-500"
    >
      <span>{ETIQUETA[idioma]}: </span>
      {otros.map((l, i) => (
        <span key={l}>
          {i > 0 && " · "}
          <Link
            href={rutas[l] as string}
            hrefLang={l}
            lang={l}
            className="text-sky-600 hover:text-sky-700 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
          >
            {IDIOMA_LABELS[l].nombre}
          </Link>
        </span>
      ))}
    </nav>
  );
}
