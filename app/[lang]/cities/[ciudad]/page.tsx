import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  obtenerCiudad,
  obtenerTodosLosCaminosCiudades,
} from "@/lib/ciudades";
import { obtenerListaGuias } from "@/lib/guias";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { urlIndiceCiudades } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  params: { lang: string; ciudad: string };
};

export async function generateStaticParams() {
  return obtenerTodosLosCaminosCiudades()
    .filter((c) => c.idioma !== "es")
    .map(({ idioma, ciudad }) => ({ lang: idioma, ciudad }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) return { title: "Not found" };

  const url = `https://exploraspain.com${ciudad.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: `${ciudad.nombre}`,
    description: ciudad.descripcion,
    keywords: ciudad.keywords,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: ciudad.nombre,
      description: ciudad.descripcion,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

export default async function CiudadPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) notFound();

  const guiasRelacionadas = obtenerListaGuias(lang).filter(
    (g) => g.categoria.toLowerCase() === params.ciudad.toLowerCase()
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: ciudad.nombre,
    description: ciudad.descripcion,
    addressCountry: "ES",
    url: `https://exploraspain.com${ciudad.url}`,
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <span className="inline-block bg-amber-400 text-slate-900 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-4">
            {ciudad.comunidad}
          </span>
          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {ciudad.nombre}
          </h1>
          <p className="text-lg md:text-xl text-sky-50">
            {ciudad.descripcion}
          </p>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div
          className="prose-guia"
          dangerouslySetInnerHTML={{ __html: ciudad.contenidoHtml }}
        />
      </article>

      {guiasRelacionadas.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              {dict.ciudades.guiasDeCiudad}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guiasRelacionadas.map((guia) => (
                <Link
                  key={guia.url}
                  href={guia.url}
                  className="group block bg-white border border-slate-200 rounded-lg p-5 hover:border-sky-400 hover:shadow-md transition-all"
                >
                  <h3 className="font-playfair text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                    {guia.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {guia.descripcion}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Link
          href={urlIndiceCiudades(lang)}
          className="text-sky-600 hover:text-sky-700 font-medium"
        >
          ← {dict.ciudades.volverACiudades}
        </Link>
      </div>
    </main>
  );
}
