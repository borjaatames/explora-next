import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { obtenerCiudad } from "@/lib/ciudades";
import {
  obtenerActividadesDeCiudadPorCategoria,
  obtenerCategoriasConActividades,
  obtenerCiudadesConActividades,
  categoriaDesdeUrl,
  type ActividadListItem,
  type CategoriaActividad,
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

/**
 * Plural label used as both the user-facing category name and inside the
 * H1 / meta. The new categories are already commercial nouns in plural,
 * so we reuse the same label for both purposes.
 */
const LABEL_CATEGORIA: Record<CategoriaActividad, string> = {
  visitasGuiadas: "Guided tours",
  entradas: "Tickets",
  excursionesDia: "Day trips",
  espectaculos: "Shows",
  toursGastronomicos: "Food tours",
  serviciosAdicionales: "Add-ons",
  transporte: "Transport",
};

/**
 * Builds editorial copy (h1, description, meta) for a given category.
 * Special case `excursionesDia`: "Day trips from {city}" reads more
 * naturally than "Day trips in {city}".
 */
function textosCategoria(
  categoria: CategoriaActividad,
  nombreCiudad: string
): { titulo: string; descripcion: string } {
  const label = LABEL_CATEGORIA[categoria];
  const preposicion =
    categoria === "excursionesDia"
      ? `from ${nombreCiudad}`
      : `in ${nombreCiudad}`;

  return {
    titulo: `${label} ${preposicion}`,
    descripcion: `${label} ${preposicion}, hand-picked with editorial criteria. No filler.`,
  };
}

type Props = {
  params: { lang: string; ciudad: string; categoria: string };
};

/**
 * Only generate category pages for (city, category) combinations with at
 * least one activity published in English. Avoids empty indexable pages
 * and 404 paths.
 */
export async function generateStaticParams() {
  const params: { lang: string; ciudad: string; categoria: string }[] = [];
  for (const ciudad of obtenerCiudadesConActividades(IDIOMA)) {
    for (const cat of obtenerCategoriasConActividades(IDIOMA, ciudad)) {
      params.push({ lang: IDIOMA, ciudad, categoria: cat.urlSlug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const ciudad = await obtenerCiudad(IDIOMA, params.ciudad);
  if (!ciudad) return { title: "City not found" };

  const categoria = categoriaDesdeUrl(params.categoria);
  if (!categoria) return { title: "Category not found" };

  const { titulo, descripcion } = textosCategoria(categoria, ciudad.nombre);
  const url = `${SITE_URL}${urlActividadesDeCiudadPorCategoria(
    IDIOMA,
    params.ciudad,
    params.categoria
  )}`;
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
        urlActividadesDeCiudadPorCategoria(l, params.ciudad, params.categoria)
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

export default async function ActividadesCategoriaPage({ params }: Props) {
  const ciudad = await obtenerCiudad(IDIOMA, params.ciudad);
  if (!ciudad) notFound();

  const categoria = categoriaDesdeUrl(params.categoria);
  if (!categoria) notFound();

  const actividades = obtenerActividadesDeCiudadPorCategoria(
    IDIOMA,
    params.ciudad,
    categoria
  );
  if (actividades.length === 0) notFound();

  const dict = getDictionary(IDIOMA);
  const labelCategoria = dict.actividades.categorias[categoria];
  const { titulo: tituloPagina, descripcion: descripcionPagina } =
    textosCategoria(categoria, ciudad.nombre);

  const urlIndice = urlActividadesDeCiudad(IDIOMA, params.ciudad);
  const urlCategoria = urlActividadesDeCiudadPorCategoria(
    IDIOMA,
    params.ciudad,
    params.categoria
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
        item: `${SITE_URL}${urlIndice}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: labelCategoria,
        item: `${SITE_URL}${urlCategoria}`,
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: actividades.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${a.url}`,
      name: a.titulo,
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
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
              <li>
                <Link href={urlIndice} className="hover:text-slate-700">
                  Things to do
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700">{labelCategoria}</li>
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
          {actividades.map((actividad) => (
            <TarjetaActividad
              key={actividad.slug}
              actividad={actividad}
              dict={dict}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function TarjetaActividad({
  actividad,
  dict,
}: {
  actividad: ActividadListItem;
  dict: ReturnType<typeof getDictionary>;
}) {
  const formatoPrecio = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: actividad.moneda,
    maximumFractionDigits: 0,
  });

  return (
    <Link
      href={actividad.url}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
    >
      {actividad.imagen ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={actividad.imagen}
            alt={actividad.imagenAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-slate-100" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          {actividad.titulo}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          {actividad.duracion ? <span>{actividad.duracion}</span> : null}
          {typeof actividad.ratingProveedor === "number" &&
          typeof actividad.numeroOpiniones === "number" ? (
            <span>
              {actividad.ratingProveedor.toFixed(1)} ★ (
              {actividad.numeroOpiniones})
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between pt-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {dict.actividades.desde}
            </p>
            <p className="text-xl font-semibold text-slate-900">
              {formatoPrecio.format(actividad.precioDesde)}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="text-sm font-semibold text-sky-600 group-hover:text-sky-700"
          >
            {dict.actividades.verActividad} →
          </span>
        </div>
      </div>
    </Link>
  );
}
