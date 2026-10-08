import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  obtenerGuia,
  obtenerTodosLosCaminos,
  obtenerGuiasRelacionadas,
} from "@/lib/guias";
import { slugParejaGuia } from "@/lib/i18n/slugs";
import {
  formatearFecha,
  hreflangAlternates,
  urlActividadesDeCiudad,
  urlGuia,
} from "@/lib/i18n/utils";
import FaqActividad from "@/components/FaqActividad";
import ActividadesRecomendadasGuia from "@/components/guia/ActividadesRecomendadasGuia";
import { obtenerActividadesParaGuia } from "@/lib/recomendaciones";
import { obtenerListaCiudades } from "@/lib/ciudades";
import HeroGuia, { IndiceGuia } from "@/components/guia/HeroGuia";
import { anadirAnclasH2 } from "@/lib/indiceGuia";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = {
  params: { categoria: string; slug: string };
};

export async function generateStaticParams() {
  return obtenerTodosLosCaminos()
    .filter((c) => c.idioma === "es")
    .map(({ categoria, slug }) => ({ categoria, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guia = await obtenerGuia("es", params.categoria, params.slug);
  if (!guia) return { title: "Guía no encontrada" };

  const url = `${SITE_URL}${guia.url}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  // Imagen absoluta para Open Graph (necesaria en WhatsApp, Twitter, LinkedIn).
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
          "es",
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
      locale: "es_ES",
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
  const guia = await obtenerGuia("es", params.categoria, params.slug);
  if (!guia) notFound();

  const relacionadas = obtenerGuiasRelacionadas(
    "es",
    guia.categoria,
    guia.slug,
    3
  );

  const actividadesRecomendadas = obtenerActividadesParaGuia(
    "es",
    guia.categoria,
    { slug: guia.slug, titulo: guia.titulo, keywords: guia.keywords },
    6
  );
  const nombreCiudad =
    obtenerListaCiudades("es").find((c) => c.slug === guia.categoria)?.nombre ??
    guia.categoria.charAt(0).toUpperCase() + guia.categoria.slice(1);

  // Imagen absoluta para JSON-LD (Google la requiere completa).
  const imagenRelativa =
    guia.imagen_portada || guia.imagen || "/images/actividades/barcelona/sagrada-familia/pexels-11565894-og.jpg";
  const imagenAbsoluta = imagenRelativa.startsWith("http")
    ? imagenRelativa
    : `${SITE_URL}${imagenRelativa}`;

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
      url: "https://www.exploraspain.com",
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
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guías",
        item: `${SITE_URL}/guias`,
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
        migasLabel="Migas de pan"
        migas={[
          { label: "Inicio", href: "/" },
          { label: "Guías", href: "/guias" },
          { label: guia.titulo },
        ]}
        meta={[
          ...(guia.autor ? [`Por ${guia.autor}`] : []),
          ...(guia.fecha_actualizacion && guia.fecha_actualizacion !== guia.fecha
            ? [`Actualizado el ${formatearFecha(guia.fecha_actualizacion, "es")}`]
            : guia.fecha
              ? [formatearFecha(guia.fecha, "es")]
              : []),
          `${guia.tiempoLectura} min de lectura`,
        ]}
      />

      <div
        className={
          "max-w-6xl mx-auto px-4 py-12 md:py-16 " +
          (indice.length > 2 ? "lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16" : "")
        }
      >
        {indice.length > 2 && <IndiceGuia titulo="En esta guía" entradas={indice} />}
        <article className={"max-w-3xl " + (indice.length > 2 ? "" : "mx-auto")}>
          <div
            className="prose-guia"
            dangerouslySetInnerHTML={{ __html: htmlConAnclas }}
          />
          {faq.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <FaqActividad idioma="es" preguntas={faq} />
            </div>
          )}
        </article>
      </div>

      <ActividadesRecomendadasGuia
        actividades={actividadesRecomendadas}
        idioma={"es"}
        nombreCiudad={nombreCiudad}
        urlTodas={urlActividadesDeCiudad("es", guia.categoria)}
      />

      {relacionadas.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              Guías relacionadas
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
          href="/guias"
          className="text-sky-600 hover:text-sky-700 font-semibold"
        >
          ← Volver a todas las guías
        </Link>
      </div>
    </main>
  );
}
