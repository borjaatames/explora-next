import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  obtenerGuia,
  obtenerTodosLosCaminos,
  obtenerGuiasRelacionadas,
} from "@/lib/guias";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { formatearFecha, urlIndiceGuias } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  params: { lang: string; categoria: string; slug: string };
};

export async function generateStaticParams() {
  return obtenerTodosLosCaminos()
    .filter((c) => c.idioma !== "es")
    .map(({ idioma, categoria, slug }) => ({
      lang: idioma,
      categoria,
      slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const guia = await obtenerGuia(lang, params.categoria, params.slug);
  if (!guia) return { title: "Not found" };

  const url = `https://exploraspain.com${guia.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: guia.titulo,
    description: guia.descripcion,
    keywords: guia.keywords,
    authors: guia.autor ? [{ name: guia.autor }] : undefined,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: guia.titulo,
      description: guia.descripcion,
      publishedTime: guia.fecha,
      authors: guia.autor ? [guia.autor] : undefined,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

export default async function GuiaPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const guia = await obtenerGuia(lang, params.categoria, params.slug);
  if (!guia) notFound();

  const relacionadas = obtenerGuiasRelacionadas(
    lang,
    guia.categoria,
    guia.slug,
    3
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.titulo,
    description: guia.descripcion,
    datePublished: guia.fecha,
    dateModified: guia.fecha,
    author: {
      "@type": "Organization",
      name: guia.autor || "ExploraSpain",
    },
    publisher: {
      "@type": "Organization",
      name: "ExploraSpain",
      url: "https://exploraspain.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://exploraspain.com${guia.url}`,
    },
    keywords: guia.keywords?.join(", "),
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
            {guia.categoria}
          </span>
          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {guia.titulo}
          </h1>
          <p className="text-lg md:text-xl text-sky-50 mb-4">
            {guia.descripcion}
          </p>
          <div className="text-sm text-sky-100 flex flex-wrap gap-x-4 gap-y-1">
            {guia.autor && (
              <span>
                {dict.guias.autorPor} {guia.autor}
              </span>
            )}
            {guia.fecha && (
              <span>· {formatearFecha(guia.fecha, lang)}</span>
            )}
            <span>
              · {guia.tiempoLectura} {dict.guias.minutosLectura}
            </span>
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div
          className="prose-guia"
          dangerouslySetInnerHTML={{ __html: guia.contenidoHtml }}
        />
      </article>

      {relacionadas.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {dict.guias.relacionadas}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relacionadas.map((rel) => (
                <Link
                  key={rel.url}
                  href={rel.url}
                  className="group block bg-white border border-slate-200 rounded-lg p-5 hover:border-sky-400 hover:shadow-md transition-all"
                >
                  <h3 className="font-playfair text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                    {rel.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {rel.descripcion}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Link
          href={urlIndiceGuias(lang)}
          className="text-sky-600 hover:text-sky-700 font-medium"
        >
          ← {dict.guias.volverAGuias}
        </Link>
      </div>
    </main>
  );
}
