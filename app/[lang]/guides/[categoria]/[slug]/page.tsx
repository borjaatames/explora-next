import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  obtenerGuia,
  obtenerTodosLosCaminos,
  obtenerGuiasRelacionadas,
} from "@/lib/guias";
import { slugParejaGuia } from "@/lib/i18n/slugs";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { formatearFecha, hreflangAlternates, urlGuia, urlIndiceGuias } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

/**
 * Labels de breadcrumb por idioma. Se usan tanto en el BreadcrumbList
 * JSON-LD como en el <nav aria-label> visible (cuando se renderice).
 * Hoy solo EN está activo; al añadir DE/FR/IT/PT, completar este mapa.
 */
const BREADCRUMB_LABELS: Record<Idioma, { home: string; guias: string }> = {
  es: { home: "Inicio", guias: "Guías" },
  en: { home: "Home", guias: "Guides" },
  de: { home: "Home", guias: "Guides" },
  fr: { home: "Home", guias: "Guides" },
  it: { home: "Home", guias: "Guides" },
  pt: { home: "Home", guias: "Guides" },
};

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

  const url = `${SITE_URL}${guia.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  // Imagen absoluta para Open Graph y Twitter (necesaria en WhatsApp,
  // X/Twitter, LinkedIn, Facebook). Misma lógica que la versión ES.
  const imagenRelativa =
    guia.imagen_portada || guia.imagen || "/images/og-default.jpg";
  const imagenAbsoluta = imagenRelativa.startsWith("http")
    ? imagenRelativa
    : `${SITE_URL}${imagenRelativa}`;

  return {
    title: guia.titulo,
    description: guia.descripcion,
    keywords: guia.keywords,
    authors: guia.autor ? [{ name: guia.autor }] : undefined,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaGuia(
          lang,
          params.categoria,
          params.slug,
          l
        );
        return slugPareja ? urlGuia(l, params.categoria, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "article",
      url,
      title: guia.titulo,
      description: guia.descripcion,
      publishedTime: guia.fecha,
      modifiedTime: guia.fecha_actualizacion || guia.fecha,
      authors: guia.autor ? [guia.autor] : undefined,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
      images: [
        {
          url: imagenAbsoluta,
          alt: guia.imagen_alt || guia.titulo,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guia.titulo,
      description: guia.descripcion,
      images: [imagenAbsoluta],
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

  // Imagen absoluta para JSON-LD (Google la requiere completa).
  const imagenRelativa =
    guia.imagen_portada || guia.imagen || "/images/og-default.jpg";
  const imagenAbsoluta = imagenRelativa.startsWith("http")
    ? imagenRelativa
    : `${SITE_URL}${imagenRelativa}`;

  const breadcrumbs = BREADCRUMB_LABELS[lang];
  // En `app/[lang]/*`, `lang` nunca es "es" (generateStaticParams filtra el
  // idioma por defecto en LangLayout). TS lo detecta como comparación
  // inalcanzable, por eso construimos la URL prefijada directamente.
  const homeUrl = `${SITE_URL}/${lang}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.titulo,
    description: guia.descripcion,
    image: imagenAbsoluta,
    datePublished: guia.fecha,
    dateModified: guia.fecha_actualizacion || guia.fecha,
    author: {
      "@type": "Organization",
      name: guia.autor || "ExploraSpain",
    },
    publisher: {
      "@type": "Organization",
      name: "ExploraSpain",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${guia.url}`,
    },
    keywords: guia.keywords?.join(", "),
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: breadcrumbs.home,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbs.guias,
        item: `${SITE_URL}${urlIndiceGuias(lang)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guia.titulo,
        item: `${SITE_URL}${guia.url}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
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
          className="text-sky-600 hover:text-sky-700 font-semibold"
        >
          ← {dict.guias.volverAGuias}
        </Link>
      </div>
    </main>
  );
}
