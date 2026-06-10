import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  obtenerCiudad,
  obtenerTodosLosCaminosCiudades,
  type Atraccion,
} from "@/lib/ciudades";
import { slugParejaCiudad } from "@/lib/i18n/slugs";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  hreflangAlternates,
  urlActividadesDeCiudad,
  urlAtraccionesDeCiudad,
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

  const url = `${SITE_URL}${urlAtraccionesDeCiudad(lang, params.ciudad)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const titulo = lang === "en"
    ? `Top attractions in ${ciudad.nombre}`
    : `Las mejores atracciones de ${ciudad.nombre}`;
  const lista = (ciudad.atracciones ?? []).map((a) => a.nombre).slice(0, 5).join(", ");
  const descripcion = lang === "en"
    ? `What you can't miss in ${ciudad.nombre}: ${lista}.`
    : `Lo imprescindible que ver en ${ciudad.nombre}: ${lista}.`;

  return {
    title: titulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaCiudad(lang, params.ciudad, l);
        return slugPareja ? urlAtraccionesDeCiudad(l, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "website",
      url,
      title: titulo,
      description: descripcion,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

export default async function AtraccionesCiudadPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }
  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) notFound();
  const atracciones = ciudad.atracciones ?? [];
  if (atracciones.length === 0) notFound();

  const homeUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const indiceUrl = `${SITE_URL}${urlIndiceCiudades(lang)}`;
  const ciudadUrl = `${SITE_URL}${ciudad.url}`;
  const atraccionesUrl = `${SITE_URL}${urlAtraccionesDeCiudad(lang, params.ciudad)}`;

  const titulo = lang === "en"
    ? `Top attractions in ${ciudad.nombre}`
    : `Las mejores atracciones de ${ciudad.nombre}`;
  const subtitulo = lang === "en"
    ? `What you can't miss in ${ciudad.nombre}, with photos and context.`
    : `Lo imprescindible que ver en ${ciudad.nombre}, con foto y contexto.`;
  const breadcrumbAtracciones = lang === "en" ? "Attractions" : "Atracciones";
  const verActividades = lang === "en"
    ? `See activities in ${ciudad.nombre} →`
    : `Ver actividades en ${ciudad.nombre} →`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.navegacion.inicio, item: homeUrl },
      { "@type": "ListItem", position: 2, name: dict.navegacion.ciudades, item: indiceUrl },
      { "@type": "ListItem", position: 3, name: ciudad.nombre, item: ciudadUrl },
      { "@type": "ListItem", position: 4, name: breadcrumbAtracciones, item: atraccionesUrl },
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
            <Link href={ciudad.url} className="hover:text-white">{ciudad.nombre}</Link>
            {" › "}
            <span className="text-white">{breadcrumbAtracciones}</span>
          </nav>
          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {titulo}
          </h1>
          <p className="text-lg md:text-xl text-sky-50">{subtitulo}</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {atracciones.map((atr, i) => (
            <AtraccionCard key={i} atraccion={atr} />
          ))}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Link href={urlActividadesDeCiudad(lang, params.ciudad)} className="text-sky-600 hover:text-sky-700 font-semibold">
          {verActividades}
        </Link>
      </div>
    </main>
  );
}

function AtraccionCard({ atraccion }: { atraccion: Atraccion }) {
  if (atraccion.imagen) {
    return (
      <article className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-sky-400 hover:shadow-md transition-all">
        <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
          <Image
            src={atraccion.imagen}
            alt={atraccion.imagenAlt ?? atraccion.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-2">
            {atraccion.nombre}
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            {atraccion.descripcion}
          </p>
        </div>
      </article>
    );
  }
  return (
    <article className="bg-sky-50 border border-sky-100 rounded-lg p-6 hover:border-sky-300 transition-colors">
      <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-2">
        {atraccion.nombre}
      </h2>
      <p className="text-slate-600 leading-relaxed text-sm md:text-base">
        {atraccion.descripcion}
      </p>
    </article>
  );
}
