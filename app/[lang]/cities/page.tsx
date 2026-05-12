import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  hreflangAlternates,
  urlIndiceCiudades,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

type Props = {
  params: { lang: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const canonical = `${SITE_URL}${urlIndiceCiudades(lang)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: dict.ciudades.tituloIndice,
    description: dict.ciudades.descripcionIndice,
    alternates: {
      canonical,
      languages: hreflangAlternates((l) => urlIndiceCiudades(l)),
    },
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: { index: allowIndexing, follow: allowIndexing },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: dict.ciudades.tituloIndice,
      description: dict.ciudades.descripcionIndice,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

export default function CiudadesPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const ciudades = obtenerListaCiudades(lang);

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.navegacion.inicio,
        item: `${SITE_URL}${prefijoIdioma(lang) || "/"}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.navegacion.ciudades,
        item: `${SITE_URL}${urlIndiceCiudades(lang)}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <section className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
            {dict.ciudades.tituloIndice}
          </h1>
          <p className="text-lg text-sky-50">
            {dict.ciudades.descripcionIndice}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {ciudades.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-lg">
            {dict.comun.cargando}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ciudades.map((ciudad, index) => (
              <Link
                key={ciudad.url}
                href={ciudad.url}
                className="group block border border-slate-200 rounded-lg overflow-hidden hover:border-sky-400 hover:shadow-md transition-all"
              >
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src={`/ciudades/${ciudad.slug}.jpg`}
                    alt={`${ciudad.nombre}, ${ciudad.comunidad}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={index === 0}
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                    {ciudad.comunidad}
                  </span>
                  <h2 className="font-playfair text-2xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                    {ciudad.nombre}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {ciudad.descripcion}
                  </p>
                  <div className="mt-4 text-sm font-semibold text-sky-600 group-hover:text-sky-700">
                    {dict.ciudades.verCiudad} →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
