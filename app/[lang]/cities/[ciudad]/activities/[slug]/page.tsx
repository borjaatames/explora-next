import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { obtenerCiudad } from "@/lib/ciudades";
import {
  obtenerActividad,
  obtenerTodosLosCaminosActividades,
  type ActividadCompleta,
} from "@/lib/actividades";
import { slugParejaActividad } from "@/lib/i18n/slugs";
import { obtenerListaGuias } from "@/lib/guias";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  hreflangAlternates,
  urlActividad,
  urlActividadesDeCiudad,
} from "@/lib/i18n/utils";
import { construirUrlReserva, nombreProveedor } from "@/lib/afiliados";
import { obtenerHorariosViator } from "@/lib/viator-api";
import GaleriaActividad from "@/components/GaleriaActividad";
import StickyReservaMovil from "@/components/StickyReservaMovil";
import CalendarioReserva from "@/components/CalendarioReserva";
import BokunWidget from "@/components/BokunWidget";
import SelloProveedor from "@/components/SelloProveedor";
import DetallesPracticos from "@/components/DetallesPracticos";
import InformacionImportante from "@/components/InformacionImportante";
import MapaPuntoEncuentro from "@/components/MapaPuntoEncuentro";
import FaqActividad from "@/components/FaqActividad";
import BotonVolverFicha from "@/components/ficha/BotonVolverFicha";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

const IDIOMA = "en" as const;

type Props = {
  params: { lang: string; ciudad: string; slug: string };
};

export async function generateStaticParams() {
  return obtenerTodosLosCaminosActividades()
    .filter((c) => c.idioma === IDIOMA)
    .map(({ ciudad, slug }) => ({ lang: IDIOMA, ciudad, slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const actividad = await obtenerActividad(IDIOMA, params.ciudad, params.slug);
  if (!actividad) return { title: "Activity not found" };

  const url = `${SITE_URL}${actividad.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: actividad.metaTitle ?? actividad.titulo,
    description: actividad.metaDescription ?? actividad.descripcion,
    keywords: actividad.keywords,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaActividad(
          IDIOMA,
          params.ciudad,
          params.slug,
          l
        );
        return slugPareja ? urlActividad(l, params.ciudad, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "article",
      url,
      title: `${actividad.titulo} | ExploraSpain`,
      description: actividad.descripcion,
      siteName: "ExploraSpain",
      locale: "en_US",
      images: actividad.imagen
        ? [{ url: actividad.imagen, alt: actividad.imagenAlt }]
        : [],
    },
  };
}

export default async function ActividadPage({ params }: Props) {
  const ciudad = await obtenerCiudad(IDIOMA, params.ciudad);
  const actividad = await obtenerActividad(IDIOMA, params.ciudad, params.slug);
  if (!ciudad || !actividad) notFound();

  const dict = getDictionary(IDIOMA);

  const guiasRelacionadas =
    actividad.guiasRelacionadas && actividad.guiasRelacionadas.length > 0
      ? obtenerListaGuias(IDIOMA).filter((g) =>
          actividad.guiasRelacionadas!.includes(g.slug)
        )
      : [];

  const url = `${SITE_URL}${actividad.url}`;
  // Incremento 1: precio "desde" en vivo de la API de Viator (fallback al del .md).
  const codViator =
    actividad.proveedor === "viator"
      ? actividad.urlReserva.match(/\/d\d+-([A-Za-z0-9]+)/)?.[1] ?? null
      : null;
  const dispViator = codViator ? await obtenerHorariosViator(codViator, IDIOMA) : null;
  const precioDesdeFinal = dispViator?.precioDesde ?? actividad.precioDesde;
  const precio = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: actividad.moneda,
    maximumFractionDigits: 0,
  }).format(precioDesdeFinal);

  const urlReservaBase = construirUrlReserva(
    actividad.proveedor,
    actividad.urlReserva,
    IDIOMA
  );
  const nombreComercialProveedor = nombreProveedor(actividad.proveedor);

  const productLd = buildProductLd(actividad, url, urlReservaBase);

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cities",
        item: `${SITE_URL}/en/cities`,
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
        name: "Things to do",
        item: `${SITE_URL}${urlActividadesDeCiudad(IDIOMA, params.ciudad)}`,
      },
      { "@type": "ListItem", position: 5, name: actividad.titulo, item: url },
    ],
  };

  const tieneRating =
    typeof actividad.ratingProveedor === "number" &&
    typeof actividad.numeroOpiniones === "number" &&
    actividad.numeroOpiniones > 0;

  const ratingTextoOpiniones =
    actividad.numeroOpiniones === 1
      ? `1 ${dict.actividades.opiniones}`
      : `${(actividad.numeroOpiniones ?? 0).toLocaleString("en-US")} ${
          dict.actividades.opiniones
        }`;

  const ratingTextoValor = (actividad.ratingProveedor ?? 0).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  );

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <header className="bg-sky-500 text-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-sky-100 mb-4">
            <Link href="/en" className="hover:text-white">
              Home
            </Link>
            {" › "}
            <Link href={ciudad.url} className="hover:text-white">
              {ciudad.nombre}
            </Link>
            {" › "}
            <Link
              href={urlActividadesDeCiudad(IDIOMA, params.ciudad)}
              className="hover:text-white"
            >
              Things to do
            </Link>
            {" › "}
            <span className="text-white">{actividad.titulo}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-50 mb-4">
            <span className="bg-amber-400 text-slate-900 px-2 py-1 rounded">
              {dict.actividades.categorias[actividad.categoria]}
            </span>
            <span className="bg-white/10 px-2 py-1 rounded">
              {actividad.duracion}
            </span>
            {actividad.cancelacionGratuita && (
              <span className="bg-white/10 px-2 py-1 rounded">
                {actividad.horasCancelacion
                  ? dict.actividades.cancelacionHorasAntes.replace(
                      "{horas}",
                      String(actividad.horasCancelacion)
                    )
                  : dict.actividades.cancelacionGratuita}
              </span>
            )}
          </div>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {actividad.titulo}
          </h1>
          <p className="text-lg text-sky-50 max-w-3xl">
            {actividad.descripcion}
          </p>

          {tieneRating && (
            <p className="mt-5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-sky-50">
              <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                <span aria-hidden="true" className="text-amber-300 text-base">
                  ★
                </span>
                <span>{ratingTextoValor}</span>
              </span>
              <span aria-hidden="true" className="text-sky-200">
                ·
              </span>
              <span>{ratingTextoOpiniones}</span>
            </p>
          )}
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <SelloProveedor proveedor={actividad.proveedor} idioma={IDIOMA} />

            {/* 1. Galería con sello "Recomendado" */}
            {actividad.imagen && (
              <GaleriaActividad
                idioma={IDIOMA}
                principal={{
                  src: actividad.imagen,
                  alt: actividad.imagenAlt,
                }}
                galeria={actividad.galeria}
                destacada={actividad.destacada}
              />
            )}

            {/* 2. Detalles prácticos */}
            <DetallesPracticos
              idioma={IDIOMA}
              duracion={actividad.duracion}
              idiomas={actividad.idiomas}
              detalles={actividad.detallesPracticos}
              cancelacionGratuita={actividad.cancelacionGratuita}
              horasCancelacion={actividad.horasCancelacion}
            />

            {/* 3. Highlights */}
            {actividad.highlights.length > 0 && (
              <div>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  {dict.actividades.highlights}
                </h2>
                <ul className="space-y-2">
                  {actividad.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-base text-slate-800"
                    >
                      <span aria-hidden="true" className="text-sky-600 mt-1">
                        ✓
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Editorial opinion */}
            {actividad.opinionEditorial && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-3">
                  {dict.actividades.nuestraOpinion}
                </h2>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                  {actividad.opinionEditorial}
                </p>
              </div>
            )}

            {/* 5. What's included / not included */}
            {(actividad.incluye.length > 0 ||
              actividad.noIncluye.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {actividad.incluye.length > 0 && (
                  <div>
                    <h2 className="font-playfair text-xl font-bold text-slate-900 mb-3">
                      {dict.actividades.queIncluye}
                    </h2>
                    <ul className="space-y-2">
                      {actividad.incluye.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-slate-800"
                        >
                          <span
                            aria-hidden="true"
                            className="text-emerald-600 font-bold mt-0.5"
                          >
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {actividad.noIncluye.length > 0 && (
                  <div>
                    <h2 className="font-playfair text-xl font-bold text-slate-900 mb-3">
                      {dict.actividades.queNoIncluye}
                    </h2>
                    <ul className="space-y-2">
                      {actividad.noIncluye.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-slate-800"
                        >
                          <span
                            aria-hidden="true"
                            className="text-rose-500 font-bold mt-0.5"
                          >
                            ✗
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 6. Important info — 3 columns */}
            <InformacionImportante idioma={IDIOMA} info={actividad.informacionImportante} />

            {/* 7. Meeting point with OSM map */}
            {actividad.puntoEncuentro.texto && (
              <MapaPuntoEncuentro idioma={IDIOMA} punto={actividad.puntoEncuentro} />
            )}

            {/* 8. The experience (Markdown) */}
            <div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {dict.actividades.laExperiencia}
              </h2>
              <div
                className="prose-guia"
                dangerouslySetInnerHTML={{ __html: actividad.contenidoHtml }}
              />
            </div>

            {/* 9. Accessibility */}
            {actividad.accesibilidad && (
              <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-7">
                <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-3">
                  Accessibility
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  {actividad.accesibilidad}
                </p>
              </div>
            )}

            {/* 11. Cancellation policy */}
            {actividad.politicaCancelacion && (
              <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-7">
                <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-3">
                  Cancellation policy
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  {actividad.politicaCancelacion}
                </p>
              </div>
            )}

            {/* 12. FAQs */}
            <FaqActividad idioma={IDIOMA} preguntas={actividad.preguntasFrecuentes || []} />

            {/* 13. Related guides */}
            {guiasRelacionadas.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-4">
                  {dict.actividades.guiasRelacionadas}
                </h2>
                <div className="space-y-3">
                  {guiasRelacionadas.map((guia) => (
                    <Link
                      key={guia.url}
                      href={guia.url}
                      className="block group"
                    >
                      <h3 className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                        → {guia.titulo}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {guia.descripcion}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 14. Affiliate disclosure */}
            <p className="text-xs text-slate-500 border-t border-slate-200 pt-6">
              {dict.actividades.avisoAfiliacion}
            </p>

            {/* 15. Provider reference (end) */}
            <SelloProveedor proveedor={actividad.proveedor} idioma={IDIOMA} conLogo />
          </div>

          <aside className="hidden lg:block lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              {actividad.proveedor === "bokun" ? (
                <BokunWidget
                  idioma={IDIOMA}
                  productId={actividad.bokunProductId ?? 0}
                  precioDesde={actividad.precioDesde}
                  moneda={actividad.moneda}
                  porGrupo={actividad.categoria === "experienciasPrivadas"}
                  ratingProveedor={actividad.ratingProveedor}
                  numeroOpiniones={actividad.numeroOpiniones}
                />
              ) : (
              <CalendarioReserva
                idioma={IDIOMA}
                proveedor={actividad.proveedor}
                viatorCode={codViator ?? undefined}
                precio={precio}
                precioPorPersona={dict.actividades.porPersona}
                duracion={actividad.duracion}
                idiomas={actividad.idiomas}
                cancelacionGratuita={actividad.cancelacionGratuita}
                horasCancelacion={actividad.horasCancelacion}
                ratingProveedor={actividad.ratingProveedor}
                numeroOpiniones={actividad.numeroOpiniones}
                urlReservaBase={urlReservaBase}
                nombreProveedor={nombreComercialProveedor}
                textoReservar={dict.actividades.reservar}
                textoDesde={dict.actividades.desde}
                textoPorPersona={dict.actividades.porPersona}
                textoDuracion={dict.actividades.duracion}
                textoIdiomas={dict.actividades.idiomas}
                textoCancelacionHorasAntes={
                  dict.actividades.cancelacionHorasAntes
                }
                textoCancelacionGratuita={dict.actividades.cancelacionGratuita}
              />
              )}
              <div className="mt-3 flex justify-center">
                <SelloProveedor proveedor={actividad.proveedor} idioma={IDIOMA} conLogo />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {actividad.proveedor === "bokun" && (
        <div className="lg:hidden max-w-6xl mx-auto px-4 pb-10">
          <BokunWidget
            idioma={IDIOMA}
            productId={actividad.bokunProductId ?? 0}
            precioDesde={actividad.precioDesde}
            moneda={actividad.moneda}
            porGrupo={actividad.categoria === "experienciasPrivadas"}
            ratingProveedor={actividad.ratingProveedor}
            numeroOpiniones={actividad.numeroOpiniones}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <BotonVolverFicha
          urlActividadesCiudad={
            actividad.atraccionesRelacionadas?.[0]
              ? `${urlActividadesDeCiudad(IDIOMA, params.ciudad)}?atraccion=${actividad.atraccionesRelacionadas[0]}`
              : urlActividadesDeCiudad(IDIOMA, params.ciudad)
          }
          textoActividadesCiudad={`← See more things to do in ${ciudad.nombre}`}
        />
      </div>

      {actividad.proveedor !== "bokun" && (
        <StickyReservaMovil
          idioma={IDIOMA}
          precio={`${dict.actividades.desde} ${precio}`}
          precioPorPersona={dict.actividades.porPersona}
          duracion={actividad.duracion}
          idiomas={actividad.idiomas}
          cancelacionGratuita={actividad.cancelacionGratuita}
          horasCancelacion={actividad.horasCancelacion}
          ratingProveedor={actividad.ratingProveedor}
          numeroOpiniones={actividad.numeroOpiniones}
          urlReservaBase={urlReservaBase}
          nombreProveedor={nombreComercialProveedor}
          textoReservar={dict.actividades.reservar}
          textoOpiniones={dict.actividades.opiniones}
          textoDesde={dict.actividades.desde}
          textoPorPersona={dict.actividades.porPersona}
          textoDuracion={dict.actividades.duracion}
          textoIdiomas={dict.actividades.idiomas}
          textoCancelacionHorasAntes={dict.actividades.cancelacionHorasAntes}
          textoCancelacionGratuita={dict.actividades.cancelacionGratuita}
        />
      )}
    </main>
  );
}

function buildProductLd(
  actividad: ActividadCompleta,
  url: string,
  urlReservaFinal: string
) {
  const imagenAbsoluta = actividad.imagen.startsWith("http")
    ? actividad.imagen
    : `${SITE_URL}${actividad.imagen}`;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: actividad.titulo,
    description: actividad.descripcion,
    image: actividad.imagen ? [imagenAbsoluta] : undefined,
    category: actividad.categoria,
    inLanguage: "en",
    url,
    offers: {
      "@type": "Offer",
      url: urlReservaFinal,
      priceCurrency: actividad.moneda,
      price: actividad.precioDesde,
      availability: "https://schema.org/InStock",
    },
  };
  ld.brand = {
    "@type": "Organization",
    name: nombreProveedor(actividad.proveedor),
  };
  if (actividad.ratingProveedor && actividad.numeroOpiniones) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: actividad.ratingProveedor,
      reviewCount: actividad.numeroOpiniones,
    };
  }

  // Editorial review: if the activity has an ExploraSpain editorial
  // opinion, declare it as a self-referential Review to enable rich
  // results. The opinionEditorial field is a real opinion written by
  // the editor, not aggregated user reviews (those are in aggregateRating).
  if (actividad.opinionEditorial) {
    ld.review = {
      "@type": "Review",
      author: {
        "@type": "Organization",
        name: "ExploraSpain",
      },
      reviewBody: actividad.opinionEditorial.trim(),
      inLanguage: "en",
    };
  }

  return ld;
}
