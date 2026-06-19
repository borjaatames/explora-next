import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { obtenerGuiasDestacadas } from "@/lib/guias";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { obtenerActividadesHome } from "@/lib/actividades";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_LOCALE,
  esIdiomaActivo,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  formatearFecha,
  hreflangAlternates,
  prefijoIdioma,
  urlIndiceGuias,
  urlIndiceCiudades,
  urlActividadesDeCiudad,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import SelloProveedor from "@/components/SelloProveedor";
import TrustStrip from "@/components/TrustStrip";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

/**
 * Destinos principales que se muestran en la home (orden manual). El resto
 * de ciudades sigue accesible desde /cities. Civitatis-style.
 */
const ORDEN_DESTINOS_HOME = [
  "madrid",
  "barcelona",
  "sevilla",
  "granada",
  "valencia",
  "malaga",
] as const;

type Props = {
  params: { lang: string };
};

export function generateStaticParams(): Array<{ lang: Idioma }> {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") {
    return {};
  }

  const canonicalUrl = `${SITE_URL}${prefijoIdioma(lang)}/`;
  const languages = hreflangAlternates((l) => `${prefijoIdioma(l)}/`);

  return {
    title: "ExploraSpain · Activities, tours and tickets in Spain",
    description:
      "Book the best activities, tours and tickets in Spain: Madrid, Barcelona, Seville, Granada and more. Hand-picked, free cancellation and trusted partners.",
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      type: "website",
      locale: IDIOMA_LOCALE[lang],
      url: canonicalUrl,
      siteName: "ExploraSpain",
      title: "ExploraSpain · Activities, tours and tickets in Spain",
      description:
        "Activities, tours and tickets in Spain chosen with judgment. Free cancellation and booking through trusted partners.",
    },
  };
}

/** Formatea un precio en EUR sin decimales para el locale dado. */
function formatearPrecio(precio: number, moneda: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: moneda || "EUR",
    maximumFractionDigits: 0,
  }).format(precio);
}

export default function HomePage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const locale = IDIOMA_LOCALE[lang];
  const dict = getDictionary(lang);
  const guias = obtenerGuiasDestacadas(lang, 3);
  const ciudades = obtenerListaCiudades(lang);

  // Mapa slug -> nombre de ciudad para etiquetar las tarjetas.
  const nombrePorCiudad = new Map(ciudades.map((c) => [c.slug, c.nombre]));

  // Destinos principales de la home: 6 ciudades en orden manual.
  const porSlug = new Map(ciudades.map((c) => [c.slug, c]));
  const destinosHome = ORDEN_DESTINOS_HOME.map((s) => porSlug.get(s)).filter(
    (c): c is NonNullable<typeof c> => c != null
  );

  // Actividades estrella de la home: las que promocionamos en Google Ads.
  // Selección curada en lib/actividades.ts (obtenerActividadesHome).
  const actividadesHome = obtenerActividadesHome(lang);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ExploraSpain",
    url: SITE_URL,
    inLanguage: IDIOMA_LOCALE[lang],
    description:
      "Activities, tours and tickets in Spain chosen with judgment: book with free cancellation and trusted partners.",
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

      {/* Hero with background photo */}
      <section className="relative isolate overflow-hidden text-white">
        <Image
          src="/images/home/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-32 text-center">
          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-6 leading-tight drop-shadow">
            Activities and tours in Spain, chosen with judgment
          </h1>
          <p className="text-lg md:text-xl text-slate-100 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Tickets, guided tours and day trips, hand-picked. With free
            cancellation and booking through trusted partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#destinations"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Explore destinations
            </Link>
            <Link
              href="#activities"
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-8 py-3 rounded-lg transition-colors border border-white/30"
            >
              See featured activities
            </Link>
          </div>
          <TrustStrip idioma={lang} />
        </div>
      </section>

      {/* Top destinations */}
      {destinosHome.length > 0 && (
        <section
          id="destinations"
          className="max-w-6xl mx-auto px-4 py-16 md:py-20 scroll-mt-24"
        >
          <div className="mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Top destinations
            </h2>
            <p className="text-slate-600 text-lg">
              Pick your city and discover the best activities in each one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinosHome.map((ciudad, index) => (
              <Link
                key={ciudad.url}
                href={urlActividadesDeCiudad(lang, ciudad.slug)}
                className="group relative block h-56 md:h-64 rounded-xl overflow-hidden shadow-sm"
              >
                <Image
                  src={`/ciudades/${ciudad.slug}.jpg`}
                  alt={`${ciudad.nombre}, ${ciudad.comunidad}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="inline-block bg-white/90 text-slate-800 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mb-2">
                    {ciudad.comunidad}
                  </span>
                  <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow">
                    {ciudad.nombre}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={urlIndiceCiudades(lang)}
              className="inline-block text-sky-600 hover:text-sky-700 font-semibold"
            >
              See all cities →
            </Link>
          </div>
        </section>
      )}

      {/* Featured activities and tours (below destinations) */}
      {actividadesHome.length > 0 && (
        <section
          id="activities"
          className="bg-slate-50 border-y border-slate-200 scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
            <div className="mb-10">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Featured activities
              </h2>
              <p className="text-slate-600 text-lg">
                The best of each city: free cancellation and instant
                confirmation.
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
                        Free cancellation
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
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <SelloProveedor
                        proveedor={a.proveedor}
                        idioma={lang}
                        className="mb-3"
                      />
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-400">
                            From
                          </p>
                          <p className="text-xl font-bold text-slate-900">
                            {formatearPrecio(a.precioDesde, a.moneda, locale)}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="text-sm font-semibold text-sky-600 group-hover:text-sky-700"
                        >
                          View activity →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href={urlIndiceCiudades(lang)}
                className="inline-block text-sky-600 hover:text-sky-700 font-semibold"
              >
                See all activities by city →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Guides (accessory) */}
      {guias.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-14 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Guides to travel better
              </h2>
              <p className="text-slate-600">
                Practical tips and routes with judgment before you book.
              </p>
            </div>
            <Link
              href={urlIndiceGuias(lang)}
              className="text-sky-600 hover:text-sky-700 font-semibold whitespace-nowrap"
            >
              See all guides →
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
                  <span>{formatearFecha(guia.fecha, lang)}</span>
                  <span>
                    {guia.tiempoLectura} {dict.guias.minutosLectura}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
