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
import { esIdiomaActivo, IDIOMAS_ACTIVOS, IDIOMA_LOCALE } from "@/lib/i18n/config";
import {
  hreflangAlternates,
  prefijoIdioma,
  urlActividadesDeCiudad,
  urlGuiasDeCiudad,
  urlAtraccionesDeCiudad,
  urlIndiceCiudades,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import CtaCiudadCard from "@/components/ciudad/CtaCiudadCard";
import ActividadesFiltradas, {
  type ActividadCardData,
  type ActividadesFiltradasStrings,
  type CategoriaOpcion,
} from "@/components/ciudad/ActividadesFiltradas";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

type Props = {
  params: { lang: string; ciudad: string };
};

/**
 * Solo generamos esta ruta para (idioma, ciudad) con actividades
 * publicadas de verdad. Hoy en día solo `en` tiene contenido de
 * actividades (content/actividades/en/...); si en el futuro se añade
 * contenido en otro idioma activo, esto lo recoge automáticamente sin
 * tocar código. Los idiomas sin contenido (de/fr/it/pt por ahora)
 * simplemente no generan ninguna ruta — visitarla a mano hace notFound().
 */
export async function generateStaticParams() {
  const params: { lang: string; ciudad: string }[] = [];
  for (const lang of IDIOMAS_ACTIVOS) {
    if (lang === "es") continue;
    for (const ciudad of obtenerCiudadesConActividades(lang)) {
      params.push({ lang, ciudad });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) return { title: "City not found" };

  // Mismo criterio que el componente de página (más abajo): si no hay
  // actividades para este idioma+ciudad, la página hace notFound() y el
  // <title>/robots deben reflejarlo, no anunciar contenido inexistente.
  if (obtenerListaActividadesPorCiudad(lang, params.ciudad).length === 0) {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }

  const titulo = `Things to do in ${ciudad.nombre}`;
  const descripcion = `Tours, guided visits and day trips in ${ciudad.nombre}. Hand-picked with editorial criteria.`;
  const url = `${SITE_URL}${urlActividadesDeCiudad(lang, params.ciudad)}`;
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
      locale: IDIOMA_LOCALE[lang],
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
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }
  const lang: Idioma = params.lang;
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) notFound();

  const actividades = obtenerListaActividadesPorCiudad(lang, params.ciudad);
  if (actividades.length === 0) notFound();

  const cardsActividades = actividades.map(aCardData);
  const chipsFiltros = ciudad.chipsFiltros ?? [];
  const ratingMedio = calcularRatingMedio(actividades);
  const guiasDeCiudad = obtenerGuiasDeCiudad(lang, params.ciudad);
  const hayGuias = guiasDeCiudad.length > 0;
  const hayAtracciones = (ciudad.atracciones?.length ?? 0) > 0;
  const hayExtras = hayGuias || hayAtracciones;
  const urlGuias = urlGuiasDeCiudad(lang, params.ciudad);
  const urlAtracciones = urlAtraccionesDeCiudad(lang, params.ciudad);
  const gridExtras =
    hayGuias && hayAtracciones
      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
      : "grid grid-cols-1 gap-6";
  const imagenCabecera = ciudad.imagenActividades || ciudad.imagen;
  const imagenSobre =
    ciudad.imagenResumen ||
    [ciudad.imagen, ciudad.imagenAtracciones, ciudad.imagenGuias].find(
      (img) => img && img !== imagenCabecera
    );
  const dict = getDictionary(lang);
  const categorias = categoriasPresentes(
    actividades,
    dict.actividades.categorias
  );

  const homeUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const indiceCiudadesUrl = `${SITE_URL}${urlIndiceCiudades(lang)}`;

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
        item: `${SITE_URL}${urlActividadesDeCiudad(lang, params.ciudad)}`,
      },
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
          <nav aria-label="Breadcrumb" className="text-sm text-slate-200 mb-4">
            <Link href={prefijoIdioma(lang) || "/"} className="hover:text-white">
              {dict.navegacion.inicio}
            </Link>
            {" › "}
            <Link href={urlIndiceCiudades(lang)} className="hover:text-white">
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
          <p className="text-lg md:text-xl text-slate-100 max-w-3xl mb-6">
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
        locale={IDIOMA_LOCALE[lang]}
      />

      {/* City intro text as secondary context at the foot of the page. */}
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
                      alt={ciudad.imagenResumenAlt || "View of " + ciudad.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div>
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    About {ciudad.nombre}
                  </h2>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                    {ciudad.resumenActividades}
                  </p>
                </div>
              </div>
            ) : (
              <article className="max-w-3xl">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                  About {ciudad.nombre}
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

      {/* Keep exploring: links to guides and attractions, so the activities
          page works as a complete hub for the city. */}
      {hayExtras ? (
        <section className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Keep exploring {ciudad.nombre}
          </h2>
          <div className={gridExtras}>
            {hayGuias ? (
              <CtaCiudadCard
                href={urlGuias}
                imagen={ciudad.imagenGuias}
                imagenAlt={ciudad.imagenGuiasAlt}
                titulo={"Guides for " + ciudad.nombre}
                descripcion="Honest itineraries and practical advice to plan your trip with intent."
                cta="View guides"
                acento="sky"
              />
            ) : null}
            {hayAtracciones ? (
              <CtaCiudadCard
                href={urlAtracciones}
                imagen={ciudad.imagenAtracciones}
                imagenAlt={ciudad.imagenAtraccionesAlt}
                titulo={"Attractions in " + ciudad.nombre}
                descripcion="The must-see sights of the city, with photos and context."
                cta="View attractions"
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
