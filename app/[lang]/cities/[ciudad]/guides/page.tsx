import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { obtenerCiudad } from "@/lib/ciudades";
import {
  obtenerCiudadesConGuias,
  obtenerGuiasDeCiudad,
} from "@/lib/guias";
import {
  esIdiomaActivo,
  IDIOMAS_ACTIVOS,
  IDIOMA_LOCALE,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { slugParejaCiudad } from "@/lib/i18n/slugs";
import {
  formatearFecha,
  hreflangAlternates,
  prefijoIdioma,
  urlCiudad,
  urlGuiasDeCiudad,
  urlIndiceCiudades,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

type Props = {
  params: { lang: string; ciudad: string };
};

export async function generateStaticParams() {
  const caminos: { lang: string; ciudad: string }[] = [];
  for (const lang of IDIOMAS_ACTIVOS) {
    if (lang === "es") continue;
    for (const { ciudad } of obtenerCiudadesConGuias(lang)) {
      caminos.push({ lang, ciudad });
    }
  }
  return caminos;
}

type Strings = {
  titulo: string;
  descripcion: string;
  volver: string;
  guias: string;
};

function getStrings(lang: Idioma, nombreCiudad: string): Strings {
  if (lang === "en") {
    return {
      titulo: `Guides for ${nombreCiudad}`,
      descripcion: `Honest itineraries and practical advice to explore ${nombreCiudad} without the tourist clichés.`,
      volver: `← Back to ${nombreCiudad}`,
      guias: "Guides",
    };
  }
  return {
    titulo: `Guías de ${nombreCiudad}`,
    descripcion: `Rutas con criterio y consejos prácticos para conocer ${nombreCiudad} sin postales.`,
    volver: `← Volver a ${nombreCiudad}`,
    guias: "Guías",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) return { title: "Not found" };

  const url = `${SITE_URL}${urlGuiasDeCiudad(lang, params.ciudad)}`;
  const strings = getStrings(lang, ciudad.nombre);
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: `${strings.titulo} | ExploraSpain`,
    description: strings.descripcion,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaCiudad(lang, params.ciudad, l);
        return slugPareja ? urlGuiasDeCiudad(l, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "website",
      url,
      title: `${strings.titulo} | ExploraSpain`,
      description: strings.descripcion,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

export default async function GuiasDeCiudadPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) notFound();

  const guias = obtenerGuiasDeCiudad(lang, params.ciudad);
  if (guias.length === 0) notFound();

  const strings = getStrings(lang, ciudad.nombre);
  const homeUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const indiceCiudadesUrl = `${SITE_URL}${urlIndiceCiudades(lang)}`;
  const ciudadUrl = `${SITE_URL}${ciudad.url}`;
  const indiceGuiasCiudadUrl = `${SITE_URL}${urlGuiasDeCiudad(lang, params.ciudad)}`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.navegacion.inicio, item: homeUrl },
      { "@type": "ListItem", position: 2, name: dict.navegacion.ciudades, item: indiceCiudadesUrl },
      { "@type": "ListItem", position: 3, name: ciudad.nombre, item: ciudadUrl },
      { "@type": "ListItem", position: 4, name: strings.guias, item: indiceGuiasCiudadUrl },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <header className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-sky-100 mb-4">
            <Link href={prefijoIdioma(lang) || "/"} className="hover:text-white">
              {dict.navegacion.inicio}
            </Link>
            {" › "}
            <Link href={urlIndiceCiudades(lang)} className="hover:text-white">
              {dict.navegacion.ciudades}
            </Link>
            {" › "}
            <Link href={urlCiudad(lang, params.ciudad)} className="hover:text-white">
              {ciudad.nombre}
            </Link>
            {" › "}
            <span className="text-white">{strings.guias}</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-3 leading-tight">
            {strings.titulo}
          </h1>
          <p className="text-lg md:text-xl text-sky-50">{strings.descripcion}</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guias.map((guia) => (
            <Link
              key={guia.url}
              href={guia.url}
              className="group block border border-slate-200 rounded-lg p-6 hover:border-sky-400 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                {ciudad.nombre}
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
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Link
          href={ciudad.url}
          className="text-sky-600 hover:text-sky-700 font-semibold"
        >
          {strings.volver}
        </Link>
      </div>
    </main>
  );
}
