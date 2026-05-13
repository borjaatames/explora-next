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
import {
  hreflangAlternates,
  urlAtraccionesDeCiudad,
  urlCiudad,
} from "@/lib/i18n/utils";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

type Props = {
  params: { ciudad: string };
};

export async function generateStaticParams() {
  return obtenerTodosLosCaminosCiudades()
    .filter((c) => c.idioma === "es")
    .map(({ ciudad }) => ({ ciudad }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) return { title: "Ciudad no encontrada" };

  const url = `${SITE_URL}${urlAtraccionesDeCiudad("es", params.ciudad)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const titulo = `Las mejores atracciones de ${ciudad.nombre}`;
  const descripcion = `Lo imprescindible que ver en ${ciudad.nombre}: ${(ciudad.atracciones ?? []).map((a) => a.nombre).slice(0, 5).join(", ")}.`;

  return {
    title: titulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaCiudad("es", params.ciudad, l);
        return slugPareja ? urlAtraccionesDeCiudad(l, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "website",
      url,
      title: titulo,
      description: descripcion,
      siteName: "ExploraSpain",
      locale: "es_ES",
    },
  };
}

export default async function AtraccionesCiudadPage({ params }: Props) {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) notFound();
  const atracciones = ciudad.atracciones ?? [];
  if (atracciones.length === 0) notFound();

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://exploraspain.com" },
      { "@type": "ListItem", position: 2, name: "Ciudades", item: "https://exploraspain.com/ciudades" },
      { "@type": "ListItem", position: 3, name: ciudad.nombre, item: `https://exploraspain.com${ciudad.url}` },
      { "@type": "ListItem", position: 4, name: "Atracciones", item: `https://exploraspain.com${urlAtraccionesDeCiudad("es", params.ciudad)}` },
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
          <nav aria-label="Migas de pan" className="text-sm text-sky-100 mb-4">
            <Link href="/" className="hover:text-white">Inicio</Link>
            {" › "}
            <Link href="/ciudades" className="hover:text-white">Ciudades</Link>
            {" › "}
            <Link href={ciudad.url} className="hover:text-white">{ciudad.nombre}</Link>
            {" › "}
            <span className="text-white">Atracciones</span>
          </nav>
          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {"Las mejores atracciones de " + ciudad.nombre}
          </h1>
          <p className="text-lg md:text-xl text-sky-50">
            Lo imprescindible que ver en {ciudad.nombre}, con foto y contexto.
          </p>
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
        <Link href={ciudad.url} className="text-sky-600 hover:text-sky-700 font-semibold">
          ← Volver a {ciudad.nombre}
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
