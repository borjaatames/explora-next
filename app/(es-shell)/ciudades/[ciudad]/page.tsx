import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  obtenerCiudad,
  obtenerTodosLosCaminosCiudades,
} from "@/lib/ciudades";
import { slugParejaCiudad } from "@/lib/i18n/slugs";
import {
  hreflangAlternates,
  urlActividadesDeCiudad,
  urlCiudad,
  urlIndiceGuias,
} from "@/lib/i18n/utils";

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

export default async function CiudadPage({ params }: Props) {
  const ciudad = await obtenerCiudad("es", params.ciudad);
  if (!ciudad) notFound();

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

  const urlGuias = urlIndiceGuias("es");
  const urlActividades = urlActividadesDeCiudad("es", params.ciudad);

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
            <div
              className="absolute inset-0 bg-sky-500/75"
              aria-hidden="true"
            />
          </>
        ) : null}
        <div className="relative max-w-3xl mx-auto px-4">
          <nav aria-label="Migas de pan" className="text-sm text-sky-100 mb-4">
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

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div
          className="prose-guia text-justify hyphens-auto"
          dangerouslySetInnerHTML={{ __html: ciudad.contenidoHtml }}
        />
      </article>

      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CtaCiudadCard
              href={urlGuias}
              imagen={ciudad.imagenGuias}
              imagenAlt={ciudad.imagenGuiasAlt}
              titulo={"Guías de " + ciudad.nombre}
              descripcion="Rutas con criterio y consejos honestos para planificar tu viaje."
              cta="Ver guías"
              acento="sky"
            />
            <CtaCiudadCard
              href={urlActividades}
              imagen={ciudad.imagenActividades}
              imagenAlt={ciudad.imagenActividadesAlt}
              titulo={"Actividades y tours en " + ciudad.nombre}
              descripcion="Tours seleccionados con criterio editorial. Reserva con cancelación gratis."
              cta="Ver actividades"
              acento="amber"
            />
          </div>
        </div>
      </section>

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

type CtaCiudadCardProps = {
  href: string;
  imagen?: string;
  imagenAlt?: string;
  titulo: string;
  descripcion: string;
  cta: string;
  acento: "sky" | "amber";
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
  const isAmber = acento === "amber";
  const ringClass = isAmber
    ? "focus-visible:ring-amber-500"
    : "focus-visible:ring-sky-500";
  const descripcionClass = isAmber ? "text-amber-50" : "text-sky-100";

  if (imagen) {
    const gradientClass = isAmber
      ? "bg-gradient-to-t from-amber-900/90 via-amber-700/55 to-transparent"
      : "bg-gradient-to-t from-sky-900/90 via-sky-700/55 to-transparent";

    return (
      <Link
        href={href}
        className={"group relative block aspect-[4/3] md:aspect-[5/3] overflow-hidden rounded-xl border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " + ringClass}
      >
        <Image
          src={imagen}
          alt={imagenAlt ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className={"absolute inset-0 " + gradientClass}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-2 leading-tight">
            {titulo}
          </h2>
          <p className={descripcionClass + " text-sm md:text-base mb-4 max-w-md"}>
            {descripcion}
          </p>
          <span className="inline-flex items-center font-semibold text-base">
            {cta} <span aria-hidden="true" className="ml-2">→</span>
          </span>
        </div>
      </Link>
    );
  }

  const bgClass = isAmber
    ? "bg-amber-500 hover:bg-amber-600"
    : "bg-sky-500 hover:bg-sky-600";

  return (
    <Link
      href={href}
      className={"group block aspect-[4/3] md:aspect-[5/3] overflow-hidden rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " + bgClass + " " + ringClass}
    >
      <div className="flex flex-col justify-end h-full p-6 md:p-8 text-white">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-2 leading-tight">
          {titulo}
        </h2>
        <p className={descripcionClass + " text-sm md:text-base mb-4 max-w-md"}>
          {descripcion}
        </p>
        <span className="inline-flex items-center font-semibold text-base">
          {cta} <span aria-hidden="true" className="ml-2">→</span>
        </span>
      </div>
    </Link>
  );
}
