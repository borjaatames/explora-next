import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerListaGuias } from "@/lib/guias";
import {
  esIdiomaActivo,
  IDIOMAS_ACTIVOS,
  IDIOMA_LOCALE,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  formatearFecha,
  hreflangAlternates,
  urlIndiceGuias,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

type Props = {
  params: { lang: string };
};

export function generateStaticParams() {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const canonical = `${SITE_URL}${urlIndiceGuias(lang)}`;
  return {
    title: dict.guias.tituloIndice,
    description: dict.guias.descripcionIndice,
    alternates: {
      canonical,
      languages: hreflangAlternates((l) => urlIndiceGuias(l)),
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: dict.guias.tituloIndice,
      description: dict.guias.descripcionIndice,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

export default function GuiasPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const guias = obtenerListaGuias(lang);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
            {dict.guias.tituloIndice}
          </h1>
          <p className="text-lg text-sky-50">
            {dict.guias.descripcionIndice}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {guias.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-lg">
            {dict.comun.cargando}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guias.map((guia) => (
              <Link
                key={guia.url}
                href={guia.url}
                className="group block border border-slate-200 rounded-lg p-6 hover:border-sky-400 hover:shadow-md transition-all"
              >
                <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                  {guia.categoria}
                </span>
                <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                  {guia.titulo}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {guia.descripcion}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{formatearFecha(guia.fecha, lang)}</span>
                  <span>
                    {guia.tiempoLectura} {dict.guias.minutosLectura}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
