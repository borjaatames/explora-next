import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { obtenerGuiasDestacadas } from "@/lib/guias";
import { obtenerListaCiudades } from "@/lib/ciudades";
import {
  formatearFecha,
  hreflangAlternates,
  prefijoIdioma,
} from "@/lib/i18n/utils";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

export const metadata: Metadata = {
  title: "ExploraSpain · Guías honestas para viajar por España",
  description:
    "Guías editoriales con criterio sobre Madrid, Sevilla, Barcelona, Granada y Salamanca. Rutas reales, selección honesta y consejos prácticos sin postureo turístico.",
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: hreflangAlternates((l) => `${prefijoIdioma(l)}/`),
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/`,
    siteName: "ExploraSpain",
    title: "ExploraSpain · Guías honestas para viajar por España",
    description:
      "Rutas con criterio, selección honesta y consejos prácticos para visitar España sin postureo turístico.",
  },
};

export default function HomePage() {
  const guias = obtenerGuiasDestacadas("es", 3);
  const ciudades = obtenerListaCiudades("es");

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ExploraSpain",
    url: SITE_URL,
    inLanguage: "es-ES",
    description:
      "Guías editoriales honestas sobre viajes por España: rutas con criterio, selección honesta y consejos prácticos.",
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SKYWARD PARTNERS, S.L.",
    legalName: "SKYWARD PARTNERS, S.L.",
    url: SITE_URL,
    email: "contacto@exploraspain.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Castelló 117",
      postalCode: "28006",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
    taxID: "B26629576",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      {/* Hero */}
      <section className="bg-sky-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Guías honestas para viajar por España
          </h1>
          <p className="text-lg md:text-xl text-sky-50 mb-8 max-w-2xl mx-auto leading-relaxed">
            Rutas con criterio, selección honesta y consejos prácticos. Sin
            postureo turístico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/guias"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Ver guías
            </Link>
            <Link
              href="/sobre-nosotros"
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-8 py-3 rounded-lg transition-colors border border-white/30"
            >
              Sobre el proyecto
            </Link>
          </div>
        </div>
      </section>

      {/* Guías destacadas */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="mb-10">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Guías destacadas
          </h2>
          <p className="text-slate-600 text-lg">
            Lo último que hemos publicado: rutas con criterio para viajar bien.
          </p>
        </div>

        {guias.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Próximamente publicaremos nuestras primeras guías. Vuelve pronto.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guias.map((guia) => (
              <Link
                key={guia.url}
                href={guia.url}
                className="group block border border-slate-200 rounded-lg p-6 hover:border-sky-400 hover:shadow-md transition-all"
              >
                <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                  {guia.categoria}
                </span>
                <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                  {guia.titulo}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {guia.descripcion}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{formatearFecha(guia.fecha, "es")}</span>
                  <span>{guia.tiempoLectura} min lectura</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/guias"
            className="inline-block text-sky-600 hover:text-sky-700 font-semibold"
          >
            Ver todas las guías →
          </Link>
        </div>
      </section>

      {/* Ciudades */}
      {ciudades.length > 0 && (
        <section className="bg-amber-50 border-y border-amber-200">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
            <div className="mb-10">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Ciudades de España
              </h2>
              <p className="text-slate-700 text-lg">
                Información práctica sobre cada ciudad antes de visitarla.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ciudades.map((ciudad, index) => (
                <Link
                  key={ciudad.url}
                  href={ciudad.url}
                  className="group block bg-white border border-amber-200 rounded-lg overflow-hidden hover:border-sky-400 hover:shadow-md transition-all"
                >
                  <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
                    <Image
                      src={`/ciudades/${ciudad.slug}.jpg`}
                      alt={`${ciudad.nombre}, ${ciudad.comunidad}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={index === 0}
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                      {ciudad.comunidad}
                    </span>
                    <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                      {ciudad.nombre}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {ciudad.descripcion}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/ciudades"
                className="inline-block text-sky-600 hover:text-sky-700 font-semibold"
              >
                Ver todas las ciudades →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sección sobre el proyecto */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-20">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Qué es ExploraSpain
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed mb-4">
            Un proyecto editorial sobre viajes por España. Escribimos guías
            honestas: rutas con criterio, selección honesta y consejos
            prácticos, sin el tono hinchado del turismo de postal.
          </p>
          <p className="text-slate-700 text-lg leading-relaxed mb-6">
            Hay mucha información sobre qué visitar en España. Poca sobre{" "}
            <strong>qué merece la pena en cada caso</strong>. ExploraSpain
            cubre ese hueco.
          </p>
          <Link
            href="/sobre-nosotros"
            className="inline-block text-sky-600 hover:text-sky-700 font-semibold"
          >
            Conócenos →
          </Link>
        </div>
      </section>
    </main>
  );
}
