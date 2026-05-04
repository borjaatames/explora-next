import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { obtenerCiudad } from "@/lib/ciudades";
import {
  obtenerCategoriasConActividades,
  obtenerCiudadesConActividades,
  type CategoriaConActividades,
} from "@/lib/actividades";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  hreflangAlternates,
  urlActividadesDeCiudad,
  urlActividadesDeCiudadPorCategoria,
} from "@/lib/i18n/utils";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

const IDIOMA = "en" as const;

type Props = {
  params: { lang: string; ciudad: string };
};

/**
 * Only generate pages for cities with at least one activity published in
 * English. If a city has no activities, the route is not created.
 */
export async function generateStaticParams() {
  return obtenerCiudadesConActividades(IDIOMA).map((ciudad) => ({
    lang: IDIOMA,
    ciudad,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const ciudad = await obtenerCiudad(IDIOMA, params.ciudad);
  if (!ciudad) return { title: "City not found" };

  const dict = getDictionary(IDIOMA);
  const titulo = dict.actividades.tituloIndiceCiudad.replace(
    "{ciudad}",
    ciudad.nombre
  );
  const descripcion = dict.actividades.descripcionIndiceCiudad.replace(
    "{ciudad}",
    ciudad.nombre
  );
  const url = `${SITE_URL}${urlActividadesDeCiudad(IDIOMA, params.ciudad)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: titulo,
    description: descripcion,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) =>
        urlActividadesDeCiudad(l, params.ciudad)
      ),
    },
    openGraph: {
      type: "website",
      url,
      title: `${titulo} | ExploraSpain`,
      description: descripcion,
      siteName: "ExploraSpain",
      locale: "en_US",
    },
  };
}

export default async function ActividadesCiudadIndicePage({ params }: Props) {
  const ciudad = await obtenerCiudad(IDIOMA, params.ciudad);
  if (!ciudad) notFound();

  const categorias = obtenerCategoriasConActividades(IDIOMA, params.ciudad);
  if (categorias.length === 0) notFound();

  const dict = getDictionary(IDIOMA);
  const tituloPagina = dict.actividades.tituloIndiceCiudad.replace(
    "{ciudad}",
    ciudad.nombre
  );
  const descripcionPagina = dict.actividades.descripcionIndiceCiudad.replace(
    "{ciudad}",
    ciudad.nombre
  );

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.navegacion.inicio,
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: ciudad.nombre,
        item: `${SITE_URL}${ciudad.url}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Things to do",
        item: `${SITE_URL}${urlActividadesDeCiudad(IDIOMA, params.ciudad)}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <header className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link href="/en" className="hover:text-slate-700">
                  {dict.navegacion.inicio}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ciudad.url} className="hover:text-slate-700">
                  {ciudad.nombre}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700">Things to do</li>
            </ol>
          </nav>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {tituloPagina}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            {descripcionPagina}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categorias.map((cat) => (
            <TarjetaCategoria
              key={cat.categoria}
              ciudadSlug={params.ciudad}
              categoria={cat}
              labelCategoria={dict.actividades.categorias[cat.categoria]}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function TarjetaCategoria({
  ciudadSlug,
  categoria,
  labelCategoria,
}: {
  ciudadSlug: string;
  categoria: CategoriaConActividades;
  labelCategoria: string;
}) {
  const href = urlActividadesDeCiudadPorCategoria(
    IDIOMA,
    ciudadSlug,
    categoria.urlSlug
  );

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
    >
      {categoria.imagenPortada ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={categoria.imagenPortada}
            alt={categoria.imagenPortadaAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-slate-100" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {labelCategoria}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {categoria.total === 1
            ? "1 activity"
            : `${categoria.total} activities`}
        </p>
        <span
          aria-hidden="true"
          className="mt-auto pt-6 text-sm font-medium text-sky-600 group-hover:text-sky-700"
        >
          See activities →
        </span>
      </div>
    </Link>
  );
}
