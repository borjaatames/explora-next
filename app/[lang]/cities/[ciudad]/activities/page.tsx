import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { obtenerCiudad } from "@/lib/ciudades";
import {
  CATEGORIAS_ACTIVIDAD,
  obtenerCiudadesConActividades,
  obtenerListaActividadesPorCiudad,
  type ActividadListItem,
  type CategoriaActividad,
} from "@/lib/actividades";
import { obtenerGuiasDeCiudad } from "@/lib/guias";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";
import {
  hreflangAlternates,
  prefijoIdioma,
  urlActividadesDeCiudad,
  urlIndiceCiudades,
} from "@/lib/i18n/utils";
import ActividadesFiltradas, {
  type ActividadCardData,
  type ActividadesFiltradasStrings,
  type CategoriaOpcion,
} from "@/components/ciudad/ActividadesFiltradas";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

const IDIOMA = "en" as const;

type Props = {
  params: { lang: string; ciudad: string };
};

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

  const titulo = `Things to do in ${ciudad.nombre}`;
  const descripcion = `Tours, guided visits and day trips in ${ciudad.nombre}. Hand-picked with editorial criteria.`;
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
      locale: IDIOMA_LOCALE[IDIOMA],
    },
  };
}

const FILTROS_STRINGS_EN: ActividadesFiltradasStrings = {
  filtrarPor: "Filter by",
  atracciones: "Attractions",
  categorias: "Categories",
  limpiarFiltros: "Clear filters",
  actividadesUna: "1 activity",
  actividadesPlural: "{n} activities",
  filtrosActivosUno: "1 active filter",
  filtrosActivosPlural: "{n} active filters",
  desde: "From",
  verActividad: "View activity",
  sinResultados: "No activities match these filters. Try removing some.",
  cancelacionGratuita: "Free cancellation",
};

function aCardData(a: ActividadListItem): ActividadCardData {
  return {
    slug: a.slug,
    titulo: a.titulo,
    url: a.url,
    imagen: a.imagen,
    imagenAlt: a.imagenAlt,
    duracion: a.duracion,
    precioDesde: a.precioDesde,
    moneda: a.moneda || "EUR",
    ratingProveedor: a.ratingProveedor,
    numeroOpiniones: a.numeroOpiniones,
    cancelacionGratuita: a.cancelacionGratuita,
    atraccionesRelacionadas: a.atraccionesRelacionadas ?? [],
    proveedor: a.proveedor,
    categoria: a.categoria,
    destacada: a.destacada ?? false,
  };
}

function categoriasPresentes(
  actividades: ActividadListItem[],
  dictCategorias: Record<CategoriaActividad, string>
): CategoriaOpcion[] {
  const presentes = new Set(actividades.map((a) => a.categoria));
  return CATEGORIAS_ACTIVIDAD.filter((c) => presentes.has(c)).map((c) => ({
    key: c,
    label: dictCategorias[c],
  }));
}

function calcularRatingMedio(actividades: ActividadListItem[]): number | null {
  const ratings = actividades
    .map((a) => a.ratingProveedor)
    .filter((r): r is number => typeof r === "number" && r > 0);
  if (ratings.length === 0) return null;
  const media = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
  return Math.round(media * 10) / 10;
}

export default async function ActividadesCiudadIndicePage({ params }: Props) {
  const ciudad = await obtenerCiudad(IDIOMA, params.ciudad);
  if (!ciudad) notFound();

  const actividades = obtenerListaActividadesPorCiudad(IDIOMA, params.ciudad);
  if (actividades.length === 0) notFound();

  const cardsActividades = actividades.map(aCardData);
  const chipsFiltros = ciudad.chipsFiltros ?? [];
  const ratingMedio = calcularRatingMedio(actividades);
  const guiasDeCiudad = obtenerGuiasDeCiudad(IDIOMA, params.ciudad);
  const dict = getDictionary(IDIOMA);
  const categorias = categoriasPresentes(
    actividades,
    dict.actividades.categorias
  );

  const homeUrl = `${SITE_URL}${prefijoIdioma(IDIOMA) || "/"}`;
  const indiceCiudadesUrl = `${SITE_URL}${urlIndiceCiudades(IDIOMA)}`;

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
        item: indiceCiudadesUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: ciudad.nombre,
        item: `${SITE_URL}${ciudad.url}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Activities",
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

      <header className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-sky-100 mb-4">
            <Link href={prefijoIdioma(IDIOMA) || "/"} className="hover:text-white">
              {dict.navegacion.inicio}
            </Link>
            {" › "}
            <Link href={urlIndiceCiudades(IDIOMA)} className="hover:text-white">
              {dict.navegacion.ciudades}
            </Link>
            {" › "}
            <Link href={ciudad.url} className="hover:text-white">
              {ciudad.nombre}
            </Link>
            {" › "}
            <span className="text-white">Activities</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-3 leading-tight">
            Things to do in {ciudad.nombre}
          </h1>
          <p className="text-lg md:text-xl text-sky-50 max-w-3xl mb-6">
            Tours, guided visits and day trips hand-picked with editorial criteria.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 max-w-3xl">
            <Metrica valor={actividades.length} etiqueta="activities" />
            <Metrica
              valor={ciudad.atracciones?.length ?? 0}
              etiqueta="attractions"
            />
            <Metrica valor={guiasDeCiudad.length} etiqueta="guides" />
            {ratingMedio !== null ? (
              <Metrica
                valor={ratingMedio}
                etiqueta="average rating"
                sufijo=" / 5"
              />
            ) : null}
          </div>
        </div>
      </header>

      <ActividadesFiltradas
        actividades={cardsActividades}
        chips={chipsFiltros}
        categorias={categorias}
        strings={FILTROS_STRINGS_EN}
        locale={IDIOMA_LOCALE[IDIOMA]}
      />

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Link
          href={urlActividadesDeCiudad(IDIOMA, params.ciudad)}
          className="text-sky-600 hover:text-sky-700 font-semibold"
        >
          See all activities in {ciudad.nombre} →
        </Link>
      </div>
    </main>
  );
}

function Metrica({
  valor,
  etiqueta,
  sufijo,
}: {
  valor: number;
  etiqueta: string;
  sufijo?: string;
}) {
  return (
    <div className="border-l-2 border-amber-400 pl-3">
      <div className="text-2xl md:text-3xl font-bold text-white leading-none">
        {valor}
        {sufijo ? (
          <span className="text-sm font-normal text-sky-100">{sufijo}</span>
        ) : null}
      </div>
      <div className="text-xs text-sky-100 mt-1">{etiqueta}</div>
    </div>
  );
}
