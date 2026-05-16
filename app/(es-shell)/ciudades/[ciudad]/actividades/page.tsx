import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { obtenerCiudad } from "@/lib/ciudades";
import {
  obtenerCiudadesConActividades,
  obtenerListaActividadesPorCiudad,
  type ActividadListItem,
} from "@/lib/actividades";
import { obtenerGuiasDeCiudad } from "@/lib/guias";
import {
  hreflangAlternates,
  urlActividadesDeCiudad,
} from "@/lib/i18n/utils";
import ActividadesFiltradas, {
  type ActividadCardData,
  type ActividadesFiltradasStrings,
} from "@/components/ciudad/ActividadesFiltradas";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

type Props = {
  params: { ciudad: string };
};

/**
 * Solo generamos páginas para ciudades con al menos una actividad
 * publicada en español. Si una ciudad no tiene actividades, no creamos
 * la ruta (no hay nada que listar).
 */
export async function generateStaticParams() {
  return obtenerCiudadesConActividades("es").map((ciudad) => ({ ciudad }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) return { title: "Ciudad no encontrada" };

  const titulo = `Actividades y tours en ${ciudad.nombre}`;
  const descripcion = `Tours, visitas guiadas y excursiones en ${ciudad.nombre}. Selección honesta con criterio editorial.`;
  const url = `${SITE_URL}${urlActividadesDeCiudad("es", params.ciudad)}`;
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
      locale: "es_ES",
    },
  };
}

const FILTROS_STRINGS_ES: ActividadesFiltradasStrings = {
  filtrarPor: "Filtrar por",
  atracciones: "Atracciones",
  limpiarFiltros: "Limpiar filtros",
  actividadesUna: "1 actividad",
  actividadesPlural: "{n} actividades",
  filtrosActivosUno: "1 filtro activo",
  filtrosActivosPlural: "{n} filtros activos",
  desde: "Desde",
  verActividad: "Ver actividad",
  sinResultados:
    "No hay actividades con esos filtros. Prueba a quitar alguno.",
  cancelacionGratuita: "Cancelación gratis",
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
    destacada: a.destacada ?? false,
  };
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
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) notFound();

  const actividades = obtenerListaActividadesPorCiudad("es", params.ciudad);
  if (actividades.length === 0) notFound();

  const cardsActividades = actividades.map(aCardData);
  const chipsFiltros = ciudad.chipsFiltros ?? [];
  const ratingMedio = calcularRatingMedio(actividades);
  const guiasDeCiudad = obtenerGuiasDeCiudad("es", params.ciudad);

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ciudades", item: `${SITE_URL}/ciudades` },
      { "@type": "ListItem", position: 3, name: ciudad.nombre, item: `${SITE_URL}${ciudad.url}` },
      { "@type": "ListItem", position: 4, name: "Actividades", item: `${SITE_URL}${urlActividadesDeCiudad("es", params.ciudad)}` },
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
          <nav aria-label="Migas de pan" className="text-sm text-sky-100 mb-4">
            <Link href="/" className="hover:text-white">Inicio</Link>
            {" › "}
            <Link href="/ciudades" className="hover:text-white">Ciudades</Link>
            {" › "}
            <Link href={ciudad.url} className="hover:text-white">{ciudad.nombre}</Link>
            {" › "}
            <span className="text-white">Actividades</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-3 leading-tight">
            Actividades en {ciudad.nombre}
          </h1>
          <p className="text-lg md:text-xl text-sky-50 max-w-3xl mb-6">
            Tours, visitas guiadas y excursiones seleccionadas con criterio editorial.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 max-w-3xl">
            <Metrica valor={actividades.length} etiqueta="actividades" />
            <Metrica
              valor={ciudad.atracciones?.length ?? 0}
              etiqueta="atracciones"
            />
            <Metrica valor={guiasDeCiudad.length} etiqueta="guías" />
            {ratingMedio !== null ? (
              <Metrica
                valor={ratingMedio}
                etiqueta="valoración media"
                sufijo=" / 5"
              />
            ) : null}
          </div>
        </div>
      </header>

      <ActividadesFiltradas
        actividades={cardsActividades}
        chips={chipsFiltros}
        strings={FILTROS_STRINGS_ES}
        locale="es-ES"
      />

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
