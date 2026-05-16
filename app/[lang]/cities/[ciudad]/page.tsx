import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  obtenerCiudad,
  obtenerTodosLosCaminosCiudades,
} from "@/lib/ciudades";
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
    lang === "en" ? " | Travel guide" : ` | ${getDictionary(lang).ciudades.tituloIndice}`;

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
};

function getStrings(lang: Idioma, nombreCiudad: string): Strings {
  if (lang === "en") {
    return {
      guiasTitulo: `Guides for ${nombreCiudad}`,
      guiasDescripcion: "Honest itineraries and practical advice to plan your trip with intent.",
      guiasCta: "View guides",
      actividadesTitulo: `Things to do in ${nombreCiudad}`,
      actividadesDescripcion: "Hand-picked tours and experiences. Free cancellation included.",
      actividadesCta: "View activities",
      atraccionesTitulo: `Attractions in ${nombreCiudad}`,
      atraccionesDescripcion: "The must-see sights of the city, with photos and context.",
      atraccionesCta: "View attractions",
    };
  }
  return {
    guiasTitulo: `Guías de ${nombreCiudad}`,
    guiasDescripcion: "Rutas con criterio y consejos honestos para planificar tu viaje.",
    guiasCta: "Ver guías",
    actividadesTitulo: `Actividades y tours en ${nombreCiudad}`,
    actividadesDescripcion: "Tours seleccionados con criterio editorial. Reserva con cancelación gratis.",
    actividadesCta: "Ver actividades",
    atraccionesTitulo: `Atracciones de ${nombreCiudad}`,
    atraccionesDescripcion: "Lo imprescindible que ver en la ciudad, con foto y contexto.",
    atraccionesCta: "Ver atracciones",
  };
}

export default async function CiudadPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) notFound();

  const homeUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const indiceUrl = `${SITE_URL}${urlIndiceCiudades(lang)}`;
  const ciudadUrl = `${SITE_URL}${ciudad.url}`;

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
      { "@type": "ListItem", position: 1, name: dict.navegacion.inicio, item: homeUrl },
      { "@type": "ListItem", position: 2, name: dict.navegacion.ciudades, item: indiceUrl },
      { "@type": "ListItem", position: 3, name: ciudad.nombre, item: ciudadUrl },
    ],
  };

  const strings = getStrings(lang, ciudad.nombre);
  const guiasDeCiudad = obtenerGuiasDeCiudad(lang, params.ciudad);
  const hayGuias = guiasDeCiudad.length > 0;
  const urlGuias = urlGuiasDeCiudad(lang, params.ciudad);
  const urlActividades = urlActividadesDeCiudad(lang, params.ciudad);
  const urlAtracciones = urlAtraccionesDeCiudad(lang, params.ciudad);
  const hayAtracciones = (ciudad.atracciones?.length ?? 0) > 0;
  const numCards = (hayGuias ? 1 : 0) + 1 + (hayAtracciones ? 1 : 0);
  const gridClass =
    numCards === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-6"
      : numCards === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
      : "grid grid-cols-1 gap-6";

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

      <header className="relative bg-sky-500 text-white py-16 md:py-24 overflow-hidden">
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
            <div className="absolute inset-0 bg-sky-500/75" aria-hidden="true" />
          </>
        ) : null}
        <div className="relative max-w-3xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-sky-100 mb-4">
            <Link href={prefijoIdioma(lang) || "/"} className="hover:text-white">
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
          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {ciudad.nombre}
          </h1>
          <p className="text-lg md:text-xl text-sky-50">{ciudad.descripcion}</p>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div
          className="prose-guia text-justify hyphens-auto"
          dangerouslySetInnerHTML={{ __html: ciudad.contenidoHtml }}
        />
      </article>

      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className={gridClass}>
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
            <CtaCiudadCard
              href={urlActividades}
              imagen={ciudad.imagenActividades}
              imagenAlt={ciudad.imagenActividadesAlt}
              titulo={strings.actividadesTitulo}
              descripcion={strings.actividadesDescripcion}
              cta={strings.actividadesCta}
              acento="amber"
            />
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
    gradientClass = "bg-gradient-to-t from-amber-900/90 via-amber-700/55 to-transparent";
    descripcionClass = "text-amber-50";
    solidBgClass = "bg-amber-500 hover:bg-amber-600";
  } else if (acento === "slate") {
    ringClass = "focus-visible:ring-slate-500";
    gradientClass = "bg-gradient-to-t from-slate-900/90 via-slate-700/55 to-transparent";
    descripcionClass = "text-slate-200";
    solidBgClass = "bg-slate-800 hover:bg-slate-900";
  } else {
    ringClass = "focus-visible:ring-sky-500";
    gradientClass = "bg-gradient-to-t from-sky-900/90 via-sky-700/55 to-transparent";
    descripcionClass = "text-sky-100";
    solidBgClass = "bg-sky-500 hover:bg-sky-600";
  }

  if (imagen) {
    return (
      <Link
        href={href}
        className={"group relative block aspect-[4/3] md:aspect-[5/3] overflow-hidden rounded-xl border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " + ringClass}
      >
        <Image
          src={imagen}
          alt={imagenAlt ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className={"absolute inset-0 " + gradientClass} aria-hidden="true" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7 text-white">
          <h2 className="font-playfair text-xl md:text-2xl font-bold mb-2 leading-tight">
            {titulo}
          </h2>
          <p className={descripcionClass + " text-sm md:text-base mb-3 max-w-md"}>
            {descripcion}
          </p>
          <span className="inline-flex items-center font-semibold text-base">
            {cta} <span aria-hidden="true" className="ml-2">→</span>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={"group block aspect-[4/3] md:aspect-[5/3] overflow-hidden rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " + solidBgClass + " " + ringClass}
    >
      <div className="flex flex-col justify-end h-full p-6 md:p-7 text-white">
        <h2 className="font-playfair text-xl md:text-2xl font-bold mb-2 leading-tight">
          {titulo}
        </h2>
        <p className={descripcionClass + " text-sm md:text-base mb-3 max-w-md"}>
          {descripcion}
        </p>
        <span className="inline-flex items-center font-semibold text-base">
          {cta} <span aria-hidden="true" className="ml-2">→</span>
        </span>
      </div>
    </Link>
  );
}
