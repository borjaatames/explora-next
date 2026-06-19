import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import CtaCiudadCard from "@/components/ciudad/CtaCiudadCard";
import {
  hreflangAlternates,
  urlActividadesDeCiudad,
  urlGuiasDeCiudad,
  urlAtraccionesDeCiudad,
} from "@/lib/i18n/utils";
import ActividadesFiltradas, {
  type ActividadCardData,
  type ActividadesFiltradasStrings,
  type CategoriaOpcion,
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
  categorias: "Categorías",
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
    proveedor: a.proveedor,
    categoria: a.categoria,
    destacada: a.destacada ?? false,
  };
}

/**
 * Calcula las categorías presentes en las actividades de esta ciudad
 * (con al menos una actividad). Solo aparecen en el sidebar las que tienen
 * contenido — las vacías se omiten para evitar chips muertos.
 */
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
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) notFound();

  const actividades = obtenerListaActividadesPorCiudad("es", params.ciudad);
  if (actividades.length === 0) notFound();

  const cardsActividades = actividades.map(aCardData);
  const chipsFiltros = ciudad.chipsFiltros ?? [];
  const ratingMedio = calcularRatingMedio(actividades);
  const guiasDeCiudad = obtenerGuiasDeCiudad("es", params.ciudad);
  const hayGuias = guiasDeCiudad.length > 0;
  const hayAtracciones = (ciudad.atracciones?.length ?? 0) > 0;
  const hayExtras = hayGuias || hayAtracciones;
  const urlGuias = urlGuiasDeCiudad("es", params.ciudad);
  const urlAtracciones = urlAtraccionesDeCiudad("es", params.ciudad);
  const gridExtras =
    hayGuias && hayAtracciones
      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
      : "grid grid-cols-1 gap-6";
  // Foto para la sección "Sobre la ciudad": la primera imagen disponible que
  // NO sea la que ya usa la cabecera (imagenActividades || imagen), para no
  // repetir foto en la misma página. Si no hay ninguna distinta, va sin foto.
  const imagenCabecera = ciudad.imagenActividades || ciudad.imagen;
  const imagenSobre =
    ciudad.imagenResumen ||
    [ciudad.imagen, ciudad.imagenAtracciones, ciudad.imagenGuias].find(
      (img) => img && img !== imagenCabecera
    );
  const dict = getDictionary("es");
  const categorias = categoriasPresentes(
    actividades,
    dict.actividades.categorias
  );

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

      <header className="relative isolate overflow-hidden bg-sky-500 text-white py-12 md:py-16">
        {ciudad.imagenActividades || ciudad.imagen ? (
          <>
            <Image
              src={(ciudad.imagenActividades || ciudad.imagen) as string}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
          </>
        ) : null}
        <div className="relative max-w-5xl mx-auto px-4">
          <nav aria-label="Migas de pan" className="text-sm text-slate-200 mb-4">
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
          <p className="text-lg md:text-xl text-slate-100 max-w-3xl mb-6">
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
        categorias={categorias}
        strings={FILTROS_STRINGS_ES}
        locale="es-ES"
      />

      {/* Texto introductorio de la ciudad, como contexto secundario al pie de
          la página de actividades (la ficha de actividades es ahora la entrada
          principal a cada ciudad). */}
      {ciudad.resumenActividades || ciudad.contenidoHtml ? (
        <section className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            {ciudad.resumenActividades ? (
              <div
                className={
                  imagenSobre
                    ? "grid md:grid-cols-2 gap-8 lg:gap-10 items-center"
                    : "max-w-3xl"
                }
              >
                {imagenSobre ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm">
                    <Image
                      src={imagenSobre}
                      alt={ciudad.imagenResumenAlt || "Vista de " + ciudad.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div>
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    Sobre {ciudad.nombre}
                  </h2>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                    {ciudad.resumenActividades}
                  </p>
                </div>
              </div>
            ) : (
              <article className="max-w-3xl">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                  Sobre {ciudad.nombre}
                </h2>
                <div
                  className="prose-guia text-justify hyphens-auto"
                  dangerouslySetInnerHTML={{ __html: ciudad.contenidoHtml }}
                />
              </article>
            )}
          </div>
        </section>
      ) : null}

      {/* Sigue explorando: enlaces a guías y atracciones de la ciudad, para
          que la página de actividades funcione como hub completo. */}
      {hayExtras ? (
        <section className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Sigue explorando {ciudad.nombre}
          </h2>
          <div className={gridExtras}>
            {hayGuias ? (
              <CtaCiudadCard
                href={urlGuias}
                imagen={ciudad.imagenGuias}
                imagenAlt={ciudad.imagenGuiasAlt}
                titulo={"Guías de " + ciudad.nombre}
                descripcion="Rutas con criterio y consejos honestos para planificar tu viaje."
                cta="Ver guías"
                acento="sky"
              />
            ) : null}
            {hayAtracciones ? (
              <CtaCiudadCard
                href={urlAtracciones}
                imagen={ciudad.imagenAtracciones}
                imagenAlt={ciudad.imagenAtraccionesAlt}
                titulo={"Atracciones de " + ciudad.nombre}
                descripcion="Lo imprescindible que ver en la ciudad, con foto y contexto."
                cta="Ver atracciones"
                acento="slate"
              />
            ) : null}
          </div>
        </section>
      ) : null}
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
          <span className="text-sm font-normal text-slate-200">{sufijo}</span>
        ) : null}
      </div>
      <div className="text-xs text-slate-200 mt-1">{etiqueta}</div>
    </div>
  );
}
