import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  obtenerCiudad,
  obtenerTodosLosCaminosCiudades,
} from "@/lib/ciudades";
import {
  obtenerListaActividadesPorCiudad,
  type ActividadListItem,
} from "@/lib/actividades";
import { obtenerGuiasDeCiudad } from "@/lib/guias";
import { slugParejaCiudad } from "@/lib/i18n/slugs";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  hreflangAlternates,
  urlActividadesDeCiudad,
  urlAtraccionesDeCiudad,
  urlCiudad,
  urlGuiasDeCiudad,
  urlIndiceCiudades,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import ActividadesFiltradas, {
  type ActividadCardData,
  type ActividadesFiltradasStrings,
} from "@/components/ciudad/ActividadesFiltradas";

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

  const url = `${SITE_URL}${ciudad.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const titleSuffix =
    lang === "en"
      ? " | Travel guide"
      : ` | ${getDictionary(lang).ciudades.tituloIndice}`;

  return {
    title: `${ciudad.nombre}${titleSuffix}`,
    description: ciudad.descripcion,
    keywords: ciudad.keywords,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: { index: allowIndexing, follow: allowIndexing },
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaCiudad(lang, params.ciudad, l);
        return slugPareja ? urlCiudad(l, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "website",
      url,
      title: `${ciudad.nombre} | ExploraSpain`,
      description: ciudad.descripcion,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
      ...(ciudad.imagen
        ? {
            images: [
              {
                url: `${SITE_URL}${ciudad.imagen}`,
                alt: ciudad.imagenAlt ?? ciudad.nombre,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ciudad.nombre,
      description: ciudad.descripcion,
    },
  };
}

type Strings = {
  guiasTitulo: string;
  guiasDescripcion: string;
  guiasCta: string;
  actividadesTitulo: string;
  actividadesDescripcion: string;
  actividadesCta: string;
  atraccionesTitulo: string;
  atraccionesDescripcion: string;
  atraccionesCta: string;
  exploraMas: string;
  sobre: string;
  metricaActividades: string;
  metricaAtracciones: string;
  metricaGuias: string;
  metricaRating: string;
  filtros: ActividadesFiltradasStrings;
};

function getStrings(lang: Idioma, nombreCiudad: string): Strings {
  if (lang === "en") {
    return {
      guiasTitulo: `Guides for ${nombreCiudad}`,
      guiasDescripcion:
        "Honest itineraries and practical advice to plan your trip with intent.",
      guiasCta: "View guides",
      actividadesTitulo: `Activities by category`,
      actividadesDescripcion:
        "Tours, day trips, food experiences. Browse by theme.",
      actividadesCta: "Browse categories",
      atraccionesTitulo: `Attractions in ${nombreCiudad}`,
      atraccionesDescripcion:
        "The must-see sights of the city, with photos and context.",
      atraccionesCta: "View attractions",
      exploraMas: `Explore more of ${nombreCiudad}`,
      sobre: `About ${nombreCiudad}`,
      metricaActividades: "activities",
      metricaAtracciones: "attractions",
      metricaGuias: "guides",
      metricaRating: "average rating",
      filtros: {
        filtrarPor: "Filter by",
        atracciones: "Attractions",
        limpiarFiltros: "Clear filters",
        actividadesUna: "1 activity",
        actividadesPlural: "{n} activities",
        filtrosActivosUno: "1 active filter",
        filtrosActivosPlural: "{n} active filters",
        desde: "From",
        verActividad: "View activity",
        sinResultados:
          "No activities match these filters. Try removing some.",
        cancelacionGratuita: "Free cancellation",
      },
    };
  }
  return {
    guiasTitulo: `Guías de ${nombreCiudad}`,
    guiasDescripcion:
      "Rutas con criterio y consejos honestos para planificar tu viaje.",
    guiasCta: "Ver guías",
    actividadesTitulo: `Actividades por categoría`,
    actividadesDescripcion:
      "Visitas, excursiones, gastronomía y más. Filtra por temática.",
    actividadesCta: "Ver categorías",
    atraccionesTitulo: `Atracciones de ${nombreCiudad}`,
    atraccionesDescripcion:
      "Lo imprescindible que ver en la ciudad, con foto y contexto.",
    atraccionesCta: "Ver atracciones",
    exploraMas: `Explora más de ${nombreCiudad}`,
    sobre: `Sobre ${nombreCiudad}`,
    metricaActividades: "actividades",
    metricaAtracciones: "atracciones",
    metricaGuias: "guías",
    metricaRating: "valoración media",
    filtros: {
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
    },
  };
}

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

export default async function CiudadPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) notFound();

  const actividades = obtenerListaActividadesPorCiudad(lang, params.ciudad);
  const guiasDeCiudad = obtenerGuiasDeCiudad(lang, params.ciudad);
  const cardsActividades = actividades.map(aCardData);
  const chipsFiltros = ciudad.chipsFiltros ?? [];
  const ratingMedio = calcularRatingMedio(actividades);

  const hayActividades = actividades.length > 0;
  const hayAtracciones = (ciudad.atracciones?.length ?? 0) > 0;
  const hayGuias = guiasDeCiudad.length > 0;

  const homeUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const indiceUrl = `${SITE_URL}${urlIndiceCiudades(lang)}`;
  const ciudadUrl = `${SITE_URL}${ciudad.url}`;

  const strings = getStrings(lang, ciudad.nombre);
  const urlGuias = urlGuiasDeCiudad(lang, params.ciudad);
  const urlActividades = urlActividadesDeCiudad(lang, params.ciudad);
  const urlAtracciones = urlAtraccionesDeCiudad(lang, params.ciudad);

  const numCards =
    (hayGuias ? 1 : 0) + (hayActividades ? 1 : 0) + (hayAtracciones ? 1 : 0);
  const gridCtaClass =
    numCards === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-6"
      : numCards === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
      : "grid grid-cols-1 gap-6";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: ciudad.nombre,
    description: ciudad.descripcion,
    addressCountry: "ES",
    url: ciudadUrl,
    ...(ciudad.imagen ? { image: `${SITE_URL}${ciudad.imagen}` } : {}),
  };

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
        item: indiceUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: ciudad.nombre,
        item: ciudadUrl,
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

      <header className="relative bg-sky-500 text-white py-12 md:py-16 overflow-hidden">
        {ciudad.imagen ? (
          <>
            <Image
              src={ciudad.imagen}
              alt={ciudad.imagenAlt ?? ""}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-sky-500/80" aria-hidden="true" />
          </>
        ) : null}
        <div className="relative max-w-5xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-sky-100 mb-4">
            <Link
              href={prefijoIdioma(lang) || "/"}
              className="hover:text-white"
            >
              {dict.navegacion.inicio}
            </Link>
            {" › "}
            <Link href={urlIndiceCiudades(lang)} className="hover:text-white">
              {dict.navegacion.ciudades}
            </Link>
            {" › "}
            <span className="text-white">{ciudad.nombre}</span>
          </nav>

          <span className="inline-block bg-amber-400 text-slate-900 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-4">
            {ciudad.comunidad}
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-3 leading-tight">
            {ciudad.nombre}
          </h1>
          <p className="text-lg md:text-xl text-sky-50 max-w-3xl mb-6">
            {ciudad.descripcion}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 max-w-3xl">
            <Metrica
              valor={actividades.length}
              etiqueta={strings.metricaActividades}
            />
            <Metrica
              valor={ciudad.atracciones?.length ?? 0}
              etiqueta={strings.metricaAtracciones}
            />
            <Metrica
              valor={guiasDeCiudad.length}
              etiqueta={strings.metricaGuias}
            />
            {ratingMedio !== null ? (
              <Metrica
                valor={ratingMedio}
                etiqueta={strings.metricaRating}
                sufijo=" / 5"
              />
            ) : null}
          </div>
        </div>
      </header>

      {hayActividades ? (
        <ActividadesFiltradas
          actividades={cardsActividades}
          chips={chipsFiltros}
          strings={strings.filtros}
          locale={IDIOMA_LOCALE[lang]}
        />
      ) : null}

      {numCards > 0 ? (
        <section className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {strings.exploraMas}
            </h2>
            <div className={gridCtaClass}>
              {hayGuias ? (
                <CtaCiudadCard
                  href={urlGuias}
                  imagen={ciudad.imagenGuias}
                  imagenAlt={ciudad.imagenGuiasAlt}
                  titulo={strings.guiasTitulo}
                  descripcion={strings.guiasDescripcion}
                  cta={strings.guiasCta}
                  acento="sky"
                />
              ) : null}
              {hayActividades ? (
                <CtaCiudadCard
                  href={urlActividades}
                  imagen={ciudad.imagenActividades}
                  imagenAlt={ciudad.imagenActividadesAlt}
                  titulo={strings.actividadesTitulo}
                  descripcion={strings.actividadesDescripcion}
                  cta={strings.actividadesCta}
                  acento="amber"
                />
              ) : null}
              {hayAtracciones ? (
                <CtaCiudadCard
                  href={urlAtracciones}
                  imagen={ciudad.imagenAtracciones}
                  imagenAlt={ciudad.imagenAtraccionesAlt}
                  titulo={strings.atraccionesTitulo}
                  descripcion={strings.atraccionesDescripcion}
                  cta={strings.atraccionesCta}
                  acento="slate"
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          {strings.sobre}
        </h2>
        <div
          className="prose-guia text-justify hyphens-auto"
          dangerouslySetInnerHTML={{ __html: ciudad.contenidoHtml }}
        />
      </article>

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Link
          href={urlIndiceCiudades(lang)}
          className="text-sky-600 hover:text-sky-700 font-semibold"
        >
          ← {dict.ciudades.volverACiudades}
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

type CtaCiudadCardProps = {
  href: string;
  imagen?: string;
  imagenAlt?: string;
  titulo: string;
  descripcion: string;
  cta: string;
  acento: "sky" | "amber" | "slate";
};

function CtaCiudadCard({
  href,
  imagen,
  imagenAlt,
  titulo,
  descripcion,
  cta,
  acento,
}: CtaCiudadCardProps) {
  let ringClass: string;
  let gradientClass: string;
  let descripcionClass: string;
  let solidBgClass: string;

  if (acento === "amber") {
    ringClass = "focus-visible:ring-amber-500";
    gradientClass =
      "bg-gradient-to-t from-amber-900/90 via-amber-700/55 to-transparent";
    descripcionClass = "text-amber-50";
    solidBgClass = "bg-amber-500 hover:bg-amber-600";
  } else if (acento === "slate") {
    ringClass = "focus-visible:ring-slate-500";
    gradientClass =
      "bg-gradient-to-t from-slate-900/90 via-slate-700/55 to-transparent";
    descripcionClass = "text-slate-200";
    solidBgClass = "bg-slate-800 hover:bg-slate-900";
  } else {
    ringClass = "focus-visible:ring-sky-500";
    gradientClass =
      "bg-gradient-to-t from-sky-900/90 via-sky-700/55 to-transparent";
    descripcionClass = "text-sky-100";
    solidBgClass = "bg-sky-500 hover:bg-sky-600";
  }

  if (imagen) {
    return (
      <Link
        href={href}
        className={
          "group relative block aspect-[4/3] md:aspect-[5/3] overflow-hidden rounded-xl border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
          ringClass
        }
      >
        <Image
          src={imagen}
          alt={imagenAlt ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className={"absolute inset-0 " + gradientClass}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7 text-white">
          <h3 className="font-playfair text-xl md:text-2xl font-bold mb-2 leading-tight">
            {titulo}
          </h3>
          <p className={descripcionClass + " text-sm md:text-base mb-3 max-w-md"}>
            {descripcion}
          </p>
          <span className="inline-flex items-center font-semibold text-base">
            {cta}{" "}
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={
        "group block aspect-[4/3] md:aspect-[5/3] overflow-hidden rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
        solidBgClass +
        " " +
        ringClass
      }
    >
      <div className="flex flex-col justify-end h-full p-6 md:p-7 text-white">
        <h3 className="font-playfair text-xl md:text-2xl font-bold mb-2 leading-tight">
          {titulo}
        </h3>
        <p className={descripcionClass + " text-sm md:text-base mb-3 max-w-md"}>
          {descripcion}
        </p>
        <span className="inline-flex items-center font-semibold text-base">
          {cta}{" "}
          <span aria-hidden="true" className="ml-2">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
