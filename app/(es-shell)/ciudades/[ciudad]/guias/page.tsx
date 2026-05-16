import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { obtenerCiudad } from "@/lib/ciudades";
import {
  obtenerCiudadesConGuias,
  obtenerGuiasDeCiudad,
} from "@/lib/guias";
import { slugParejaCiudad } from "@/lib/i18n/slugs";
import {
  formatearFecha,
  hreflangAlternates,
  urlCiudad,
  urlGuiasDeCiudad,
} from "@/lib/i18n/utils";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

type Props = {
  params: { ciudad: string };
};

export async function generateStaticParams() {
  return obtenerCiudadesConGuias("es").map(({ ciudad }) => ({ ciudad }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) return { title: "Ciudad no encontrada" };

  const url = `${SITE_URL}${urlGuiasDeCiudad("es", params.ciudad)}`;
  const titulo = `Guías de ${ciudad.nombre}`;
  const descripcion = `Rutas con criterio y consejos prácticos para visitar ${ciudad.nombre} sin postureo turístico.`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: `${titulo} | ExploraSpain`,
    description: descripcion,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaCiudad("es", params.ciudad, l);
        return slugPareja ? urlGuiasDeCiudad(l, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "website",
      url,
      title: `${titulo} | ExploraSpain`,
      description: descripcion,
      siteName: "ExploraSpain",
      locale: "es_ES",
    },
  };
}

export default async function GuiasDeCiudadPage({ params }: Props) {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) notFound();

  const guias = obtenerGuiasDeCiudad("es", params.ciudad);
  if (guias.length === 0) notFound();

  const ciudadUrl = `${SITE_URL}${ciudad.url}`;
  const indiceGuiasCiudadUrl = `${SITE_URL}${urlGuiasDeCiudad("es", params.ciudad)}`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ciudades", item: `${SITE_URL}/ciudades` },
      { "@type": "ListItem", position: 3, name: ciudad.nombre, item: ciudadUrl },
      { "@type": "ListItem", position: 4, name: "Guías", item: indiceGuiasCiudadUrl },
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
            <Link href={urlCiudad("es", params.ciudad)} className="hover:text-white">
              {ciudad.nombre}
            </Link>
            {" › "}
            <span className="text-white">Guías</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-3 leading-tight">
            Guías de {ciudad.nombre}
          </h1>
          <p className="text-lg md:text-xl text-sky-50">
            Rutas con criterio y consejos prácticos para conocer {ciudad.nombre} sin postales.
          </p>
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
                <span>{formatearFecha(guia.fecha, "es")}</span>
                <span>{guia.tiempoLectura} min lectura</span>
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
          ← Volver a {ciudad.nombre}
        </Link>
      </div>
    </main>
  );
}
