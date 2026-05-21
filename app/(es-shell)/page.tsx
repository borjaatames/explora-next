import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { obtenerGuiasDestacadas } from "@/lib/guias";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { obtenerActividadesHome } from "@/lib/actividades";
import {
  formatearFecha,
  hreflangAlternates,
  prefijoIdioma,
  urlActividadesDeCiudad,
} from "@/lib/i18n/utils";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

export const metadata: Metadata = {
  title: "ExploraSpain · Actividades, tours y entradas en España",
  description:
    "Reserva las mejores actividades, tours y entradas en España: Madrid, Barcelona, Sevilla, Granada y más. Selección con criterio, cancelación gratuita y partners de confianza.",
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: hreflangAlternates((l) => `${prefijoIdioma(l)}/`),
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/`,
    siteName: "ExploraSpain",
    title: "ExploraSpain · Actividades, tours y entradas en España",
    description:
      "Actividades, tours y entradas en España elegidos con criterio. Cancelación gratuita y reserva con partners de confianza.",
  },
};

/** Formatea un precio en euros sin decimales (es-ES). */
function formatearPrecio(precio: number, moneda: string): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: moneda || "EUR",
    maximumFractionDigits: 0,
  }).format(precio);
}

export default function HomePage() {
  const ciudades = obtenerListaCiudades("es");
  const guias = obtenerGuiasDestacadas("es", 3);

  // Mapa slug -> nombre de ciudad para etiquetar las tarjetas.
  const nombrePorCiudad = new Map(ciudades.map((c) => [c.slug, c.nombre]));

  // Actividades estrella de la home: las que promocionamos en Google Ads.
  // Selección curada en lib/actividades.ts (obtenerActividadesHome).
  const actividadesHome = obtenerActividadesHome("es");

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ExploraSpain",
    url: SITE_URL,
    inLanguage: "es-ES",
    description:
      "Actividades, tours y entradas en España elegidos con criterio: reserva con cancelación gratuita y partners de confianza.",
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
            Actividades y tours en España, elegidos con criterio
          </h1>
          <p className="text-lg md:text-xl text-sky-50 mb-8 max-w-2xl mx-auto leading-relaxed">
            Entradas, visitas guiadas y excursiones seleccionadas a mano. Con
            cancelación gratuita y reserva con partners de confianza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#actividades"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Ver actividades destacadas
            </Link>
            <Link
              href="/ciudades"
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-8 py-3 rounded-lg transition-colors border border-white/30"
            >
              Explorar destinos
            </Link>
          </div>
        </div>
      </section>

      {/* Actividades y tours destacados */}
      {actividadesHome.length > 0 && (
        <section
          id="actividades"
          className="max-w-6xl mx-auto px-4 py-16 md:py-20 scroll-mt-24"
        >
          <div className="mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Actividades y tours destacados
            </h2>
            <p className="text-slate-600 text-lg">
              Lo mejor de cada ciudad: cancelación gratuita y confirmación
              inmediata.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actividadesHome.map((a) => (
              <Link
                key={a.url}
                href={a.url}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-sky-400 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {a.imagen ? (
                    <Image
                      src={a.imagen}
                      alt={a.imagenAlt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : null}
                  {a.cancelacionGratuita ? (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Cancelación gratuita
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {nombrePorCiudad.get(a.ciudad) ? (
                    <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-2">
                      {nombrePorCiudad.get(a.ciudad)}
                    </span>
                  ) : null}
                  <h3 className="font-playfair text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors leading-tight line-clamp-2">
                    {a.titulo}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 mb-4">
                    {a.duracion ? <span>{a.duracion}</span> : null}
                    {typeof a.ratingProveedor === "number" &&
                    typeof a.numeroOpiniones === "number" ? (
                      <span>
                        <span className="text-amber-500" aria-hidden="true">
                          ★
                        </span>{" "}
                        {a.ratingProveedor.toFixed(1)} ({a.numeroOpiniones})
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Desde
                      </p>
                      <p className="text-xl font-bold text-slate-900">
                        {formatearPrecio(a.precioDesde, a.moneda)}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="text-sm font-semibold text-sky-600 group-hover:text-sky-700"
                    >
                      Ver actividad →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/ciudades"
              className="inline-block text-sky-600 hover:text-sky-700 font-semibold"
            >
              Ver todas las actividades por ciudad →
            </Link>
          </div>
        </section>
      )}

      {/* Ciudades / destinos */}
      {ciudades.length > 0 && (
        <section className="bg-amber-50 border-y border-amber-200">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
            <div className="mb-10">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Explora por destino
              </h2>
              <p className="text-slate-700 text-lg">
                Elige tu ciudad y descubre las mejores actividades en cada una.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ciudades.map((ciudad, index) => (
                <Link
                  key={ciudad.url}
                  href={urlActividadesDeCiudad("es", ciudad.slug)}
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

      {/* Guías (accesorio) */}
      {guias.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-14 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Guías para viajar mejor
              </h2>
              <p className="text-slate-600">
                Consejos prácticos y rutas con criterio antes de reservar.
              </p>
            </div>
            <Link
              href="/guias"
              className="text-sky-600 hover:text-sky-700 font-semibold whitespace-nowrap"
            >
              Ver todas las guías →
            </Link>
          </div>

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
                <h3 className="font-playfair text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
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
        </section>
      )}
    </main>
  );
}
