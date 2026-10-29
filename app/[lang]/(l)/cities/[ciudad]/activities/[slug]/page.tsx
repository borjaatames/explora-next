import OtrosIdiomas from "@/components/layout/OtrosIdiomas";
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
import { obtenerGuiasParaFicha, obtenerGuiaAgotadaParaFicha } from "@/lib/guias";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import {
  hreflangAlternates,
  rutasPorIdioma,
  prefijoIdioma,
  urlActividad,
  urlActividadesDeCiudad,
  urlIndiceCiudades,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import { construirUrlReserva, nombreProveedor } from "@/lib/afiliados";
import { campanaGyg } from "@/lib/afiliados-gyg";
import GaleriaActividad from "@/components/GaleriaActividad";
import CreditosFotos from "@/components/CreditosFotos";
import StickyReservaMovil from "@/components/StickyReservaMovil";
import CalendarioReserva from "@/components/CalendarioReserva";
import WidgetDisponibilidadGyg from "@/components/WidgetDisponibilidadGyg";
import PrecioDestacado from "@/components/PrecioDestacado";
import { ANCLA_WIDGET_GYG, tourWidgetGyg } from "@/lib/gyg-widget";
import BokunWidget from "@/components/BokunWidget";
import ConfianzaReservaBokun from "@/components/ficha/ConfianzaReservaBokun";
import CtaReservaBokun from "@/components/ficha/CtaReservaBokun";
import DatosClave from "@/components/ficha/DatosClave";
import NotaTripadvisor from "@/components/ficha/NotaTripadvisor";
import ResenasTripadvisor from "@/components/ficha/ResenasTripadvisor";
import { datosTripadvisorBokun, fuenteResenasGyg } from "@/lib/tripadvisor";
import SeccionMovil from "@/components/ficha/SeccionMovil";
import StickyReservaBokun from "@/components/ficha/StickyReservaBokun";
import { ANCLA_RESERVA } from "@/lib/reservaBokun";
import SelloProveedor from "@/components/SelloProveedor";
import DetallesPracticos from "@/components/DetallesPracticos";
import InformacionImportante from "@/components/InformacionImportante";
import MapaPuntoEncuentro from "@/components/MapaPuntoEncuentro";
import FaqActividad from "@/components/FaqActividad";
import BotonVolverFicha from "@/components/ficha/BotonVolverFicha";
import ActividadesRecomendadasGuia from "@/components/guia/ActividadesRecomendadasGuia";
import { obtenerParecidasConTipo } from "@/lib/recomendaciones";
import OtrasVersiones from "@/components/ficha/OtrasVersiones";
import AvisoEntradasAgotadas from "@/components/ficha/AvisoEntradasAgotadas";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = {
  params: { lang: string; ciudad: string; slug: string };
};

/**
 * Genera rutas para todas las (idioma, ciudad, slug) de actividades
 * publicadas en idiomas activos != es. Hoy solo `en` tiene contenido de
 * actividades; si se añade contenido en otro idioma activo, se recoge
 * automáticamente. Sin contenido para un idioma, la ruta no se genera y
 * visitarla a mano hace notFound() (ver guard más abajo).
 */
export async function generateStaticParams() {
  return obtenerTodosLosCaminosActividades()
    .filter((c) => c.idioma !== "es")
    .map(({ idioma, ciudad, slug }) => ({ lang: idioma, ciudad, slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const actividad = await obtenerActividad(lang, params.ciudad, params.slug);
  if (!actividad) return { title: "Activity not found" };

  const url = `${SITE_URL}${actividad.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: actividad.metaTitle ?? actividad.titulo,
    description: actividad.metaDescription ?? actividad.descripcion,
    keywords: actividad.keywords,
    robots: {
      index: allowIndexing && actividad.indexar !== false,
      follow: allowIndexing,
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaActividad(
          lang,
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
      locale: IDIOMA_LOCALE[lang],
      images: actividad.imagen
        ? [{ url: actividad.imagen, alt: actividad.imagenAlt }]
        : [],
    },
  };
}

export default async function ActividadPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }
  const lang: Idioma = params.lang;
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  const actividad = await obtenerActividad(lang, params.ciudad, params.slug);
  if (!ciudad || !actividad) notFound();

  const dict = getDictionary(lang);

  const guiasRelacionadas = obtenerGuiasParaFicha(lang, params.ciudad, actividad);
  const guiaAgotada = obtenerGuiaAgotadaParaFicha(lang, params.ciudad, actividad.slugs?.es);

  const parecidas = obtenerParecidasConTipo(lang, params.ciudad, actividad);
  const actividadesParecidas = parecidas.actividades;
  const otrasVersiones = parecidas.tipo === "casiIguales" ? parecidas.actividades : [];
  const tripadvisor =
    actividad.proveedor === "bokun" ? datosTripadvisorBokun(actividad.bokunProductId) : null;
  const fuenteResenas = tripadvisor ?? fuenteResenasGyg(actividad.urlReserva);

  const url = `${SITE_URL}${actividad.url}`;
  // Viator y GetYourGuide solo soportan es/en en su propio sitio (ver
  // docstring de construirUrlReserva en lib/afiliados.ts). Esta ficha solo
  // se genera hoy para lang="en" (sin contenido de actividades en otros
  // idiomas), pero acotamos el tipo aquí explícitamente para no ensanchar
  // la firma de esas funciones con idiomas que el proveedor no entiende.
  const idiomaProveedor: "es" | "en" = lang === "en" ? "en" : "es";
  const precioDesdeFinal = actividad.precioDesde;
  const precio = new Intl.NumberFormat(IDIOMA_LOCALE[lang], {
    style: "currency",
    currency: actividad.moneda,
    maximumFractionDigits: 0,
  }).format(precioDesdeFinal);

  const urlReservaBase = construirUrlReserva(
    actividad.proveedor,
    actividad.urlReserva,
    idiomaProveedor,
    campanaGyg("ficha", lang, params.slug)
  );
  const nombreComercialProveedor = nombreProveedor(actividad.proveedor);

  const productLd = buildProductLd(actividad, url, urlReservaBase, lang);

  const homeUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const indiceCiudadesUrl = `${SITE_URL}${urlIndiceCiudades(lang)}`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cities",
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
        name: "Things to do",
        item: `${SITE_URL}${urlActividadesDeCiudad(lang, params.ciudad)}`,
      },
      { "@type": "ListItem", position: 5, name: actividad.titulo, item: url },
    ],
  };

  /**
   * Igual que en las guías (ver app/(es-shell)/guias/[categoria]/[slug]/page.tsx):
   * NO se inyecta JSON-LD `FAQPage` hasta que la actividad tenga 4+ preguntas
   * reales, siguiendo la misma decisión de producto documentada en
   * components/FaqActividad.tsx.
   */
  const faqActividad = actividad.preguntasFrecuentes || [];
  const faqJsonLd =
    faqActividad.length >= 4
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqActividad.map((p) => ({
            "@type": "Question",
            name: p.pregunta,
            acceptedAnswer: { "@type": "Answer", text: p.respuesta },
          })),
        }
      : null;

  const tieneRating =
    typeof actividad.ratingProveedor === "number" &&
    typeof actividad.numeroOpiniones === "number" &&
    actividad.numeroOpiniones > 0;

  const ratingTextoOpiniones =
    actividad.numeroOpiniones === 1
      ? `1 ${dict.actividades.opiniones}`
      : `${(actividad.numeroOpiniones ?? 0).toLocaleString(IDIOMA_LOCALE[lang])} ${
          dict.actividades.opiniones
        }`;

  const ratingTextoValor = (actividad.ratingProveedor ?? 0).toLocaleString(
    IDIOMA_LOCALE[lang],
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  );


  const tourWidget = tourWidgetGyg(actividad.proveedor, actividad.urlReserva);
  const precioWidget = (
    <PrecioDestacado
      textoDesde={dict.actividades.desde}
      precio={precio}
      textoPorPersona={dict.actividades.porPersona}
      rating={tieneRating ? ratingTextoValor : undefined}
      opiniones={tieneRating ? ratingTextoOpiniones : undefined}
    />
  );
  const bloqueCalendario = (
    <CalendarioReserva
      idioma={lang}
      proveedor={actividad.proveedor}
      precio={precio}
      valorEstimado={precioDesdeFinal}
      monedaEstimada={actividad.moneda}
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
  );

  // Bókun: en móvil el calendario va después del contenido; las guías
  // relacionadas (enlaces que sacan de la ficha) se pintan detrás de él.
  const bloqueGuias = guiasRelacionadas.length > 0 ? (
    <div className="bg-piedra-50 border border-piedra-200 rounded-lg p-6">
      <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 mb-4">
        {dict.actividades.guiasRelacionadas}
      </h2>
      <div className="space-y-3">
        {guiasRelacionadas.map((guia) => (
          <Link
            key={guia.url}
            href={guia.url}
            className="block group"
          >
            <h3 className="font-semibold text-piedra-900 group-hover:text-anil-700 transition-colors">
              → {guia.titulo}
            </h3>
            <p className="text-sm text-piedra-600 mt-1">
              {guia.descripcion}
            </p>
          </Link>
        ))}
      </div>
    </div>
  ) : null;

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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Móvil: foto primero (como Civitatis/GetYourGuide); desde md, cabecera
          y después galería, como siempre (desde md). */}
      <section className="max-w-6xl mx-auto px-4 pb-10 md:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 min-w-0">
      <div className="flex flex-col">
      <header className="bg-white pt-4 md:pt-8">
        <div>
          <nav aria-label="Breadcrumb" className="text-sm text-piedra-500 mb-4">
            <Link href={prefijoIdioma(lang) || "/"} className="hover:text-anil-700">
              Home
            </Link>
            {" › "}
            <Link href={ciudad.url} className="hover:text-anil-700">
              {ciudad.nombre}
            </Link>
            {" › "}
            <Link
              href={urlActividadesDeCiudad(lang, params.ciudad)}
              className="hover:text-anil-700"
            >
              Things to do
            </Link>
            <span className="hidden md:inline">
              {" › "}
              <span className="text-piedra-900">{actividad.titulo}</span>
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-piedra-600 mb-3">
            <span className="bg-anil-100 text-anil-700 px-2 py-1 rounded">
              {dict.actividades.categorias[actividad.categoria]}
            </span>
            <span className="hidden md:inline bg-piedra-100 text-piedra-600 px-2 py-1 rounded">
              {actividad.duracion}
            </span>
            {actividad.cancelacionGratuita && (
              <span className="hidden md:inline bg-piedra-100 text-piedra-600 px-2 py-1 rounded">
                {actividad.horasCancelacion
                  ? dict.actividades.cancelacionHorasAntes.replace(
                      "{horas}",
                      String(actividad.horasCancelacion)
                    )
                  : dict.actividades.cancelacionGratuita}
              </span>
            )}
          </div>

          <h1 className="font-fraunces text-2xl md:text-4xl font-bold text-piedra-900 mb-3 leading-tight">
            {actividad.titulo}
          </h1>
          <p className="text-base md:text-lg text-piedra-600 max-w-3xl leading-relaxed line-clamp-3 md:line-clamp-none">
            {actividad.descripcion}
          </p>

          {tieneRating && !tripadvisor && (
            <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-piedra-600">
              <span className="inline-flex items-center gap-1.5 font-semibold text-piedra-900">
                <span aria-hidden="true" className="text-azafran-500 text-base">
                  ★
                </span>
                <span>{ratingTextoValor}</span>
              </span>
              <span aria-hidden="true" className="text-piedra-400">
                ·
              </span>
              <span>{ratingTextoOpiniones}</span>
            </p>
          )}

          {actividad.proveedor === "bokun" && (
            <NotaTripadvisor
              idioma={lang}
              datos={tripadvisor}
            />
          )}

          {actividad.avisoReserva && (
            <p className="hidden md:flex mt-3 items-center gap-2 text-sm font-semibold text-azafran-900 bg-azafran-50 border border-azafran-200 rounded-lg px-3 py-2 w-fit">
              <span aria-hidden="true" className="text-azafran-500">!</span>
              {actividad.avisoReserva}
            </p>
          )}

          <DatosClave
            idioma={lang}
            titulo={actividad.titulo}
            categoria={actividad.categoria}
            privada={actividad.privada === true}
            duracion={actividad.duracion}
            idiomas={actividad.idiomas}
            highlights={actividad.highlights}
            cancelacionGratuita={actividad.cancelacionGratuita}
            horasCancelacion={actividad.horasCancelacion}
            detalles={actividad.detallesPracticos}
          />

          {actividad.proveedor === "bokun" && (
            <CtaReservaBokun
              cancelacionGratuita={actividad.cancelacionGratuita}
              horasCancelacion={actividad.horasCancelacion}
              confirmacionInmediata={actividad.detallesPracticos?.confirmacionInmediata}
              idioma={lang}
              precioDesde={actividad.precioDesde}
              moneda={actividad.moneda}
              porGrupo={actividad.precioPorGrupo === true}
              minimoPersonas={actividad.minimoPersonas}
              preciosGrupo={actividad.preciosGrupo}
            />
          )}
        </div>
      </header>

      {actividad.imagen && (
        <div className="order-first md:order-none w-full pt-3 md:pt-8">
          <GaleriaActividad
            idioma={lang}
            principal={{
              src: actividad.imagen,
              alt: actividad.imagenAlt,
            }}
            galeria={actividad.galeria}
            destacada={actividad.destacada}
          />
          <CreditosFotos
            idioma={lang}
            srcs={[actividad.imagen, ...(actividad.galeria ?? []).map((g) => g.src)]}
          />
        </div>
      )}

      </div>

          <div className="space-y-12 pt-10 md:pt-14">
            {actividad.proveedor !== "bokun" && (
              <SelloProveedor proveedor={actividad.proveedor} idioma={lang} />
            )}

            {tourWidget && (
              <div className="lg:hidden">
                <WidgetDisponibilidadGyg
                  tourId={tourWidget}
                  idioma={lang}
                  urlReserva={urlReservaBase}
                  cabecera={precioWidget}
                  campana={campanaGyg("widget", lang, params.slug)}
                  soloEn="movil"
                />
              </div>
            )}

            {/* 2. Detalles prácticos */}
            <div className="hidden md:block">
              <DetallesPracticos
                idioma={lang}
                duracion={actividad.duracion}
                idiomas={actividad.idiomas}
                detalles={actividad.detallesPracticos}
                cancelacionGratuita={actividad.cancelacionGratuita}
                horasCancelacion={actividad.horasCancelacion}
              />
            </div>

            {/* 3. Highlights */}
            {actividad.highlights.length > 0 && (
              <div>
                <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-4">
                  {dict.actividades.highlights}
                </h2>
                <ul className="space-y-2">
                  {actividad.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-base text-piedra-800"
                    >
                      <span aria-hidden="true" className="text-anil-600 mt-1">
                        ✓
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {guiaAgotada && (
              <AvisoEntradasAgotadas url={guiaAgotada.url} idioma={lang} />
            )}
          </div>
          </div>

          {/* Bókun: un solo widget. En móvil va entre las dos mitades del
              contenido (tras «Lo más destacado»); la barra fija y el CTA de
              cabecera bajan hasta él. Para afiliados el aside solo existe en
              escritorio y en móvil manda la barra sticky. */}
          <aside
            id={actividad.proveedor === "bokun" ? ANCLA_RESERVA : undefined}
            className={
              actividad.proveedor === "bokun"
                ? "mt-12 lg:mt-0 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2 scroll-mt-24"
                : "hidden lg:block lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2"
            }
          >
            {/* Bókun crece al elegir fecha y hora: con la columna más alta que la
                pantalla, el botón «Reservar» quedaba fuera de la vista. Se
                limita al alto visible y desplaza por dentro. */}
            <div
              className={
                actividad.proveedor === "bokun"
                  ? "lg:sticky lg:top-24 lg:pt-8 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain"
                  : "lg:sticky lg:top-24 lg:pt-8"
              }
            >
              {actividad.proveedor === "bokun" ? (
                <>
                  <BokunWidget
                    idioma={lang}
                    productId={actividad.bokunProductId ?? 0}
                    precioDesde={actividad.precioDesde}
                    moneda={actividad.moneda}
                    porGrupo={actividad.precioPorGrupo === true}
                    ratingProveedor={actividad.ratingProveedor}
                    numeroOpiniones={actividad.numeroOpiniones}
                    minimoPersonas={actividad.minimoPersonas}
                    pedirPersonas={actividad.bokunPedirPersonas}
                  />
                  <ConfianzaReservaBokun
                    idioma={lang}
                    titulo={actividad.titulo}
                    confirmacionInmediata={actividad.detallesPracticos?.confirmacionInmediata}
                    cancelacionGratuita={actividad.cancelacionGratuita}
                    horasCancelacion={actividad.horasCancelacion}
                  />
                </>
              ) : tourWidget ? (
                <WidgetDisponibilidadGyg
                  tourId={tourWidget}
                  idioma={lang}
                  urlReserva={urlReservaBase}
                  cabecera={precioWidget}
                  campana={campanaGyg("widget", lang, params.slug)}
                  soloEn="escritorio"
                  fallback={bloqueCalendario}
                />
              ) : (
                bloqueCalendario
              )}
              {actividad.proveedor !== "bokun" && (
                <div className="mt-3 flex justify-center">
                  <SelloProveedor proveedor={actividad.proveedor} idioma={lang} conLogo />
                </div>
              )}
            </div>
          </aside>

          {/* Segunda mitad del contenido. En móvil va DESPUÉS del aside de
              reserva (Bókun), así el calendario queda tras «Lo más destacado»
              (~1.000 px) en vez de al final (~3.100 px). En escritorio ocupa
              la fila 2 de la columna izquierda y el aside abarca las dos. */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 min-w-0">
          <div className="space-y-12 pt-12">

            {/* 3a. Otras versiones de la misma actividad */}
            <OtrasVersiones idioma={lang} actual={actividad} versiones={otrasVersiones} />

            {/* 4. Editorial opinion */}
            {actividad.opinionEditorial && (
              <div className="bg-azafran-50 border-l-4 border-azafran-400 p-6 rounded-r-lg">
                <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 mb-3">
                  {dict.actividades.nuestraOpinion}
                </h2>
                <p className="text-piedra-800 leading-relaxed whitespace-pre-line">
                  {actividad.opinionEditorial}
                </p>
              </div>
            )}

            <div className="border-t border-piedra-200 md:border-0 md:space-y-12">
            {/* 5. What's included / not included */}
            <SeccionMovil idioma={lang} seccion="incluye" ocultarTitulo={false}>
            {(actividad.incluye.length > 0 ||
              actividad.noIncluye.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {actividad.incluye.length > 0 && (
                  <div>
                    <h2 className="font-fraunces text-xl font-bold text-piedra-900 mb-3">
                      {dict.actividades.queIncluye}
                    </h2>
                    <ul className="space-y-2">
                      {actividad.incluye.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-piedra-800"
                        >
                          <span
                            aria-hidden="true"
                            className="text-cobre-600 font-bold mt-0.5"
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
                    <h2 className="font-fraunces text-xl font-bold text-piedra-900 mb-3">
                      {dict.actividades.queNoIncluye}
                    </h2>
                    <ul className="space-y-2">
                      {actividad.noIncluye.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-piedra-800"
                        >
                          <span
                            aria-hidden="true"
                            className="text-teja-500 font-bold mt-0.5"
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
            </SeccionMovil>

            {/* 6. Important info — 3 columns */}
            <SeccionMovil idioma={lang} seccion="info">
              <InformacionImportante idioma={lang} info={actividad.informacionImportante} />
            </SeccionMovil>

            {/* 7. Meeting point with OSM map */}
            {actividad.puntoEncuentro.texto && (
              <SeccionMovil idioma={lang} seccion="encuentro">
                <MapaPuntoEncuentro idioma={lang} punto={actividad.puntoEncuentro} />
              </SeccionMovil>
            )}

            {/* 8. The experience (Markdown) */}
            <SeccionMovil idioma={lang} seccion="experiencia">
            <div>
              <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-4">
                {dict.actividades.laExperiencia}
              </h2>
              <div
                className="prose-guia"
                dangerouslySetInnerHTML={{ __html: actividad.contenidoHtml }}
              />
            </div>
            </SeccionMovil>

            {/* 9. Accessibility */}
            {actividad.accesibilidad && (
              <SeccionMovil idioma={lang} seccion="accesibilidad">
              <div className="bg-white border border-piedra-200 rounded-lg p-6 md:p-7">
                <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 mb-3">
                  Accessibility
                </h2>
                <p className="text-piedra-700 leading-relaxed">
                  {actividad.accesibilidad}
                </p>
              </div>
              </SeccionMovil>
            )}

            {/* 11. Cancellation policy */}
            {actividad.politicaCancelacion && (
              <SeccionMovil idioma={lang} seccion="cancelacion">
              <div className="bg-white border border-piedra-200 rounded-lg p-6 md:p-7">
                <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 mb-3">
                  Cancellation policy
                </h2>
                <p className="text-piedra-700 leading-relaxed">
                  {actividad.politicaCancelacion}
                </p>
              </div>
              </SeccionMovil>
            )}

            {/* 12. FAQs */}
            {(actividad.preguntasFrecuentes?.length ?? 0) > 0 && (
              <SeccionMovil idioma={lang} seccion="faq">
                <FaqActividad idioma={lang} preguntas={actividad.preguntasFrecuentes || []} />
              </SeccionMovil>
            )}
            </div>

            {/* 13. Related guides */}
            {bloqueGuias && (
              <div>{bloqueGuias}</div>
            )}

            {/* 13b. Reseñas reales del proveedor (Tripadvisor Content API),
                al final del contenido por decisión de Borja (24-10-2026) */}
            {fuenteResenas && (
              <ResenasTripadvisor
                idioma={lang}
                locationId={fuenteResenas.locationId}
                nombreProveedor={fuenteResenas.nombre}
              />
            )}

            {/* 14. Affiliate disclosure */}
            <p className="text-xs text-piedra-500 border-t border-piedra-200 pt-6">
              {actividad.proveedor === "bokun"
                ? dict.actividades.avisoVentaDirecta
                : dict.actividades.avisoAfiliacion}
            </p>

            {/* 15. Provider reference (end) */}
            {actividad.proveedor !== "bokun" && (
              <SelloProveedor proveedor={actividad.proveedor} idioma={lang} conLogo />
            )}
          </div>

          </div>


        </div>
      </section>

      <ActividadesRecomendadasGuia

        actividades={actividadesParecidas}

        idioma={lang}

        nombreCiudad={ciudad.nombre}

        urlTodas={urlActividadesDeCiudad(lang, params.ciudad)}

        variante="ficha"

      />


      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <BotonVolverFicha
          urlActividadesCiudad={
            actividad.atraccionesRelacionadas?.[0]
              ? `${urlActividadesDeCiudad(lang, params.ciudad)}?atraccion=${actividad.atraccionesRelacionadas[0]}`
              : urlActividadesDeCiudad(lang, params.ciudad)
          }
          textoActividadesCiudad={`← See more things to do in ${ciudad.nombre}`}
        />
      </div>

      {actividad.proveedor === "bokun" && (
        <StickyReservaBokun
          aviso={actividad.avisoReserva}
          ratingProveedor={actividad.ratingProveedor}
          numeroOpiniones={actividad.numeroOpiniones}
          idioma={lang}
          precioDesde={actividad.precioDesde}
          moneda={actividad.moneda}
          porGrupo={actividad.precioPorGrupo === true}
          minimoPersonas={actividad.minimoPersonas}
        />
      )}

      {actividad.proveedor !== "bokun" && (
        <StickyReservaMovil
          anclaWidget={tourWidget ? ANCLA_WIDGET_GYG : undefined}
          aviso={actividad.avisoReserva}
          idioma={lang}
          precio={`${dict.actividades.desde} ${precio}`}
          valorEstimado={precioDesdeFinal}
          monedaEstimada={actividad.moneda}
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
      <OtrosIdiomas
        idioma={lang}
        rutas={rutasPorIdioma((l) => {
          const slugPareja = slugParejaActividad(lang, params.ciudad, params.slug, l);
          return slugPareja ? urlActividad(l, params.ciudad, slugPareja) : null;
        })}
      />
    </main>
  );
}

function buildProductLd(
  actividad: ActividadCompleta,
  url: string,
  urlReservaFinal: string,
  lang: Idioma
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
    inLanguage: lang,
    url,
    offers: {
      "@type": "Offer",
      url: urlReservaFinal || url,
      priceCurrency: actividad.moneda,
      price: actividad.precioDesde,
      availability: "https://schema.org/InStock",
    },
  };
  // Sin `brand` (el operador no es la marca del producto), sin
  // `aggregateRating` (Google no admite notas recogidas en otras webs,
  // como las de GetYourGuide) y sin `review` editorial (exige
  // `reviewRating`, que no tenemos). La nota se sigue mostrando en pantalla.
  return ld;
}
