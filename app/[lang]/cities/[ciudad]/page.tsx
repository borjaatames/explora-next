import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  obtenerCiudad,
  obtenerTodosLosCaminosCiudades,
} from "@/lib/ciudades";
import { slugParejaCiudad } from "@/lib/i18n/slugs";
import { obtenerListaGuias } from "@/lib/guias";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  hreflangAlternates,
  urlCiudad,
  urlIndiceCiudades,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

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

  const url = `${SITE_URL}${ciudad.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const titleSuffix =
    lang === "en" ? " | Travel guide" : ` | ${getDictionary(lang).ciudades.tituloIndice}`;

  return {
    title: `${ciudad.nombre}${titleSuffix}`,
    description: ciudad.descripcion,
    keywords: ciudad.keywords,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: { index: allowIndexing, follow: allowIndexing },
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaCiudad(lang, params.ciudad, l);
        return slugPareja ? urlCiudad(l, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "website",
      url,
      title: `${ciudad.nombre} | ExploraSpain`,
      description: ciudad.descripcion,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
    twitter: {
      card: "summary_large_image",
      title: ciudad.nombre,
      description: ciudad.descripcion,
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

  const homeUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const indiceUrl = `${SITE_URL}${urlIndiceCiudades(lang)}`;
  const ciudadUrl = `${SITE_URL}${ciudad.url}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: ciudad.nombre,
    description: ciudad.descripcion,
    addressCountry: "ES",
    url: ciudadUrl,
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.navegacion.inicio,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.navegacion.ciudades,
        item: indiceUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: ciudad.nombre,
        item: ciudadUrl,
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
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-sky-100 mb-4"
          >
            <Link
              href={prefijoIdioma(lang) || "/"}
              className="hover:text-white"
            >
              {dict.navegacion.inicio}
            </Link>
            {" › "}
            <Link
              href={urlIndiceCiudades(lang)}
              className="hover:text-white"
            >
              {dict.navegacion.ciudades}
            </Link>
            {" › "}
            <span className="text-white">{ciudad.nombre}</span>
          </nav>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
