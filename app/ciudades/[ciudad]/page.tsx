import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  obtenerCiudad,
  obtenerTodosLosCaminosCiudades,
} from "@/lib/ciudades";
import { obtenerListaGuias } from "@/lib/guias";

type Props = {
  params: { ciudad: string };
};

export async function generateStaticParams() {
  return obtenerTodosLosCaminosCiudades();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ciudad = await obtenerCiudad(params.ciudad);
  if (!ciudad) return { title: "Ciudad no encontrada" };

  const url = `https://exploraspain.com${ciudad.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: `${ciudad.nombre} | Guía de viaje`,
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
      title: `${ciudad.nombre} | ExploraSpain`,
      description: ciudad.descripcion,
      siteName: "ExploraSpain",
      locale: "es_ES",
    },
  };
}

export default async function CiudadPage({ params }: Props) {
  const ciudad = await obtenerCiudad(params.ciudad);
  if (!ciudad) notFound();

  // Guías de la misma categoría que la ciudad (ej: madrid)
  const guiasRelacionadas = obtenerListaGuias().filter(
    (g) => g.categoria.toLowerCase() === params.ciudad.toLowerCase()
  );

  // Schema.org TouristAttraction
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: ciudad.nombre,
    description: ciudad.descripcion,
    addressCountry: "ES",
    url: `https://exploraspain.com${ciudad.url}`,
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://exploraspain.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ciudades",
        item: "https://exploraspain.com/ciudades",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: ciudad.nombre,
        item: `https://exploraspain.com${ciudad.url}`,
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

      {/* Cabecera */}
      <header className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Migas de pan */}
          <nav
            aria-label="Migas de pan"
            className="text-sm text-sky-100 mb-4"
          >
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
            {" › "}
            <Link href="/ciudades" className="hover:text-white">
              Ciudades
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

      {/* Contenido editorial */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div
          className="prose-guia"
          dangerouslySetInnerHTML={{ __html: ciudad.contenidoHtml }}
        />
      </article>

      {/* Guías de la ciudad (si existen) */}
      {guiasRelacionadas.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Guías de {ciudad.nombre}
            </h2>
            <p className="text-slate-600 mb-8">
              Profundiza en {ciudad.nombre} con nuestras rutas y comparativas.
            </p>
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

      {/* Volver */}
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Link
          href="/ciudades"
          className="text-sky-600 hover:text-sky-700 font-medium"
        >
          ← Ver todas las ciudades
        </Link>
      </div>
    </main>
  );
}
