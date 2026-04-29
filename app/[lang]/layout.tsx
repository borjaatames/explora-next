import { notFound } from "next/navigation";
import { esIdiomaActivo, IDIOMAS_ACTIVOS } from "@/lib/i18n/config";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

/**
 * Pre-genera estáticamente solo los idiomas activos (no incluye "es",
 * que se sirve desde la raíz sin prefijo).
 */
export function generateStaticParams() {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

export default function LangLayout({ children, params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  // params.lang es Idioma a partir de aquí, garantizado por el guard.
  const lang: Idioma = params.lang;

  return <div data-lang={lang}>{children}</div>;
}
