import OtrosIdiomas from "@/components/layout/OtrosIdiomas";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  obtenerGuia,
  obtenerTodosLosCaminos,
  obtenerGuiasRelacionadas,
} from "@/lib/guias";
import { slugParejaGuia } from "@/lib/i18n/slugs";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  formatearFecha,
  hreflangAlternates,
  rutasPorIdioma,
  urlActividadesDeCiudad,
  urlGuia,
  urlIndiceGuias,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import FaqActividad from "@/components/FaqActividad";
import ActividadesRecomendadasGuia from "@/components/guia/ActividadesRecomendadasGuia";
import { obtenerActividadesParaGuia } from "@/lib/recomendaciones";
import { obtenerListaCiudades } from "@/lib/ciudades";
import HeroGuia, { IndiceGuia } from "@/components/guia/HeroGuia";
import { anadirAnclasH2 } from "@/lib/indiceGuia";
import ReservasGuia from "@/components/guia/ReservasGuia";
import OpcionesGuia, { type OpcionGuia } from "@/components/guia/OpcionesGuia";
import RespuestaCorta from "@/components/guia/RespuestaCorta";
import TarjetaReservaInline from "@/components/guia/TarjetaReservaInline";
import CtaStickyGuia from "@/components/guia/CtaStickyGuia";
import TrackingReservasGuia from "@/components/guia/TrackingReservasGuia";
import {
  enriquecerEnlacesFichas,
  formatearPrecio,
  formatearRating,
  idiomaFichas,
  indexarFichasCiudad,
  partirHtmlPorShortcodes,
  slugsInline,
} from "@/lib/guiasReservas";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

/**
 * Labels de breadcrumb por idioma. Se usan tanto en el BreadcrumbList
 * JSON-LD como en el <nav aria-label> visible (cuando se renderice).
 * Hoy solo EN está activo; al añadir DE/FR/IT/PT, completar este mapa.
 */
const BREADCRUMB_LABELS: Record<Idioma, { home: string; guias: string }> = {
  es: { home: "Inicio", guias: "Guías" },
  en: { home: "Home", guias: "Guides" },
  de: { home: "Home", guias: "Guides" },
  fr: { home: "Home", guias: "Guides" },
  it: { home: "Home", guias: "Guides" },
  pt: { home: "Home", guias: "Guides" },
};

type Props = {
  params: { lang: string; categoria: string; slug: string };
};

export async function generateStaticParams() {
  return obtenerTodosLosCaminos()
    .filter((c) => c.idioma !== "es")
    .map(({ idioma, categoria, slug }) => ({
      lang: idioma,
      categoria,
      slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const guia = await obtenerGuia(lang, params.categoria, params.slug);
  if (!guia) return { title: "Not found" };

  const url = `${SITE_URL}${guia.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  // Imagen absoluta para Open Graph y Twitter (necesaria en WhatsApp,
  // X/Twitter, LinkedIn, Facebook). Misma lógica que la versión ES.
  const imagenRelativa =
    guia.imagen_portada || guia.imagen || "/images/actividades/barcelona/sagrada-familia/pexels-11565894-og.jpg";
  const imagenAbsoluta = imagenRelativa.startsWith("http")
    ? imagenRelativa
    : `${SITE_URL}${imagenRelativa}`;

  return {
    title: guia.titulo,
    description: guia.descripcion,
    keywords: guia.keywords,
    authors: guia.autor ? [{ name: guia.autor }] : undefined,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaGuia(
          lang,
          params.categoria,
          params.slug,
          l
        );
        return slugPareja ? urlGuia(l, params.categoria, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "article",
      url,
      title: guia.titulo,
      description: guia.descripcion,
      publishedTime: guia.fecha,
      modifiedTime: guia.fecha_actualizacion || guia.fecha,
      authors: guia.autor ? [guia.autor] : undefined,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
      images: [
        {
          url: imagenAbsoluta,
          alt: guia.imagen_alt || guia.titulo,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guia.titulo,
      description: guia.descripcion,
      images: [imagenAbsoluta],
    },
  };
}

export default async function GuiaPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const guia = await obtenerGuia(lang, params.categoria, params.slug);
  if (!guia) notFound();

  const relacionadas = obtenerGuiasRelacionadas(
    lang,
    guia.categoria,
    guia.slug,
    3
  );

  // Las guías DE usan las fichas EN (no hay fichas DE); ver idiomaFichas.
  const actividadesRecomendadas = obtenerActividadesParaGuia(
    idiomaFichas(lang),
    guia.categoria,
    {
      slug: guia.slug,
      titulo: guia.titulo,
      keywords: guia.keywords,
      actividades: guia.actividades,
    },
    10
  );
  const nombreCiudad =
    obtenerListaCiudades(lang).find((c) => c.slug === guia.categoria)?.nombre ??
    guia.categoria.charAt(0).toUpperCase() + guia.categoria.slice(1);

  // Imagen absoluta para JSON-LD (Google la requiere completa).
  const imagenRelativa =
    guia.imagen_portada || guia.imagen || "/images/actividades/barcelona/sagrada-familia/pexels-11565894-og.jpg";
  const imagenAbsoluta = imagenRelativa.startsWith("http")
    ? imagenRelativa
    : `${SITE_URL}${imagenRelativa}`;

  const breadcrumbs = BREADCRUMB_LABELS[lang];
  // En `app/[lang]/*`, `lang` nunca es "es" (generateStaticParams filtra el
  // idioma por defecto en LangLayout). TS lo detecta como comparación
  // inalcanzable, por eso construimos la URL prefijada directamente.
  const homeUrl = `${SITE_URL}/${lang}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.titulo,
    description: guia.descripcion,
    image: imagenAbsoluta,
    datePublished: guia.fecha,
    dateModified: guia.fecha_actualizacion || guia.fecha,
    author: {
      "@type": "Organization",
      name: guia.autor || "ExploraSpain",
    },
    publisher: {
      "@type": "Organization",
      name: "ExploraSpain",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${guia.url}`,
    },
    keywords: guia.keywords?.join(", "),
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: breadcrumbs.home,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbs.guias,
        item: `${SITE_URL}${urlIndiceGuias(lang)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guia.titulo,
        item: `${SITE_URL}${guia.url}`,
      },
    ],
  };

  // Igual que en FaqActividad: no inyectamos FAQPage hasta tener 4+
  // preguntas reales (con menos, el rich snippet rara vez se muestra y
  // solo añade peso al HTML).
  const faq = guia.faq || [];
  const faqJsonLd =
    faq.length >= 4
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((p) => ({
            "@type": "Question",
            name: p.pregunta,
            acceptedAnswer: {
              "@type": "Answer",
              text: p.respuesta,
            },
          })),
        }
      : null;

  const { html: htmlConAnclas, indice } = anadirAnclasH2(guia.contenidoHtml);

  // Reservas dentro de la guía (ver lib/guiasReservas.ts).
  const fichasCiudad = indexarFichasCiudad(lang, guia.categoria);
  const trozos = partirHtmlPorShortcodes(
    enriquecerEnlacesFichas(htmlConAnclas, fichasCiudad, lang),
    fichasCiudad
  );
  const opcionesGuia: OpcionGuia[] = (guia.opciones ?? []).flatMap((o) => {
    const actividad = fichasCiudad.get(o.ficha);
    return actividad ? [{ etiqueta: o.etiqueta, actividad }] : [];
  });
  // Con «Nuestras 3 opciones» no se repite el bloque de reservas genérico.
  const reservasArriba = guia.reservasArriba && opcionesGuia.length === 0
    ? actividadesRecomendadas.slice(0, 4)
    : [];
  // Carrusel final: todas las fichas de la guía (`actividades:`), en su
  // orden, aunque alguna ya salga arriba. Nunca fichas ajenas a la guía.
  const actividadesCarrusel = actividadesRecomendadas;
  const actividadSticky =
    opcionesGuia[0]?.actividad ??
    reservasArriba[0] ??
    fichasCiudad.get(slugsInline(trozos)[0] ?? "") ??
    actividadesRecomendadas[0];
  const textosSticky =
    lang === "de"
      ? { desde: "ab", cta: "Buchen" }
      : { desde: "from", cta: "Book" };

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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <HeroGuia
        etiqueta={nombreCiudad || guia.categoria}
        titulo={guia.titulo}
        descripcion={guia.descripcion}
        imagen={guia.imagen_portada}
        imagenAlt={guia.imagen_alt}
        migasLabel={lang === "de" ? "Brotkrümel" : "Breadcrumb"}
        migas={[
          { label: dict.navegacion.inicio, href: prefijoIdioma(lang) || "/" },
          { label: dict.navegacion.guias, href: urlIndiceGuias(lang) },
          { label: guia.titulo },
        ]}
        meta={[
          ...(guia.autor ? [`${dict.guias.autorPor} ${guia.autor}`] : []),
          ...(guia.fecha ? [formatearFecha(guia.fecha, lang)] : []),
          `${guia.tiempoLectura} ${dict.guias.minutosLectura}`,
        ]}
      />

      <RespuestaCorta texto={guia.respuestaCorta} idioma={lang} />
      <OpcionesGuia opciones={opcionesGuia} idioma={lang} />
      <ReservasGuia actividades={reservasArriba} idioma={lang} />

      <div
        className={
          "max-w-6xl mx-auto px-4 py-12 md:py-16 " +
          (indice.length > 2 ? "lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16" : "")
        }
      >
        {indice.length > 2 && (
          <IndiceGuia
            titulo={lang === "de" ? "In diesem Reiseführer" : "In this guide"}
            entradas={indice}
          />
        )}
        <article className={"max-w-3xl " + (indice.length > 2 ? "" : "mx-auto")}>
          {trozos.map((trozo, i) =>
            trozo.tipo === "html" ? (
              <div
                key={i}
                className="prose-guia"
                dangerouslySetInnerHTML={{ __html: trozo.html }}
              />
            ) : (
              <TarjetaReservaInline
                key={i}
                actividad={fichasCiudad.get(trozo.slug)!}
                idioma={lang}
              />
            )
          )}
          {faq.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <FaqActividad idioma={lang} preguntas={faq} />
            </div>
          )}
        </article>
      </div>

      <ActividadesRecomendadasGuia
        actividades={actividadesCarrusel}
        idioma={lang}
        nombreCiudad={nombreCiudad}
        urlTodas={urlActividadesDeCiudad(idiomaFichas(lang), guia.categoria)}
      />

      {relacionadas.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {dict.guias.relacionadas}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relacionadas.map((rel) => (
                <Link
                  key={rel.url}
                  href={rel.url}
                  className="group block bg-white border border-slate-200 rounded-lg p-5 hover:border-sky-400 hover:shadow-md transition-all"
                >
                  <h3 className="font-playfair text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                    {rel.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {rel.descripcion}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Link
          href={urlIndiceGuias(lang)}
          className="text-sky-600 hover:text-sky-700 font-semibold"
        >
          ← {dict.guias.volverAGuias}
        </Link>
      </div>

      {actividadSticky && (
        <CtaStickyGuia
          titulo={actividadSticky.titulo}
          url={actividadSticky.url}
          slugEs={actividadSticky.slugs?.es ?? actividadSticky.slug}
          precio={formatearPrecio(actividadSticky, lang)}
          rating={formatearRating(actividadSticky, lang)}
          textoDesde={textosSticky.desde}
          textoCta={textosSticky.cta}
        />
      )}
      <TrackingReservasGuia
        guiaSlug={guia.slug}
        ciudad={guia.categoria}
        idioma={lang}
      />
      <OtrosIdiomas
        idioma={lang}
        rutas={rutasPorIdioma((l) => {
          const slugPareja = slugParejaGuia(lang, params.categoria, params.slug, l);
          return slugPareja ? urlGuia(l, params.categoria, slugPareja) : null;
        })}
      />
    </main>
  );
}
