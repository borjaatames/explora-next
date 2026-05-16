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
import {
  hreflangAlternates,
  urlActividadesDeCiudad,
  urlAtraccionesDeCiudad,
  urlCiudad,
  urlGuiasDeCiudad,
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

export async function generateStaticParams() {
  return obtenerTodosLosCaminosCiudades()
    .filter((c) => c.idioma === "es")
    .map(({ ciudad }) => ({ ciudad }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) return { title: "Ciudad no encontrada" };

  const url = `${SITE_URL}${ciudad.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: `${ciudad.nombre} | Guía de viaje`,
    description: ciudad.descripcion,
    keywords: ciudad.keywords,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaCiudad("es", params.ciudad, l);
        return slugPareja ? urlCiudad(l, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "website",
      url,
      title: `${ciudad.nombre} | ExploraSpain`,
      description: ciudad.descripcion,
      siteName: "ExploraSpain",
      locale: "es_ES",
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

export default async function CiudadPage({ params }: Props) {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) notFound();

  const actividades = obtenerListaActividadesPorCiudad("es", params.ciudad);
  const guiasDeCiudad = obtenerGuiasDeCiudad("es", params.ciudad);
  const cardsActividades = actividades.map(aCardData);
  const chipsFiltros = ciudad.chipsFiltros ?? [];
  const ratingMedio = calcularRatingMedio(actividades);

  const hayActividades = actividades.length > 0;
  const hayAtracciones = (ciudad.atracciones?.length ?? 0) > 0;
  const hayGuias = guiasDeCiudad.length > 0;

  const urlGuias = urlGuiasDeCiudad("es", params.ciudad);
  const urlActividades = urlActividadesDeCiudad("es", params.ciudad);
  const urlAtracciones = urlAtraccionesDeCiudad("es", params.ciudad);

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
    url: `https://exploraspain.com${ciudad.url}`,
    ...(ciudad.imagen
      ? { image: `https://exploraspain.com${ciudad.imagen}` }
      : {}),
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://exploraspain.com" },
      { "@type": "ListItem", position: 2, name: "Ciudades", item: "https://exploraspain.com/ciudades" },
      { "@type": "ListItem", position: 3, name: ciudad.nombre, item: `https://exploraspain.com${ciudad.url}` },
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
          <nav aria-label="Migas de pan" className="text-sm text-sky-100 mb-4">
            <Link href="/" className="hover:text-white">Inicio</Link>
            {" › "}
            <Link href="/ciudades" className="hover:text-white">Ciudades</Link>
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

      {hayActividades ? (
        <ActividadesFiltradas
          actividades={cardsActividades}
          chips={chipsFiltros}
          strings={FILTROS_STRINGS_ES}
          locale="es-ES"
        />
      ) : null}

      {numCards > 0 ? (
        <section className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              Explora más de {ciudad.nombre}
            </h2>
            <div className={gridCtaClass}>
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
              {hayActividades ? (
                <CtaCiudadCard
                  href={urlActividades}
                  imagen={ciudad.imagenActividades}
                  imagenAlt={ciudad.imagenActividadesAlt}
                  titulo={"Actividades por categoría"}
                  descripcion="Visitas, excursiones, gastronomía y más. Filtra por temática."
                  cta="Ver categorías"
                  acento="amber"
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
          </div>
        </section>
      ) : null}

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Sobre {ciudad.nombre}
        </h2>
        <div
          className="prose-guia text-justify hyphens-auto"
          dangerouslySetInnerHTML={{ __html: ciudad.contenidoHtml }}
        />
      </article>

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Link
          href="/ciudades"
          className="text-sky-600 hover:text-sky-700 font-semibold"
        >
          ← Ver todas las ciudades
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
