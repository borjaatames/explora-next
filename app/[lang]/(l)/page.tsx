import { FranjaNavidad, ConQuienViajas, RutasPorDias, FranjaCruceros } from "@/components/home/SeccionesPlan";
import PrivadosHome from "@/components/home/PrivadosHome";
import FranjaAtracciones from "@/components/home/FranjaAtracciones";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { obtenerGuiasDestacadas } from "@/lib/guias";
import { obtenerListaCiudades } from "@/lib/ciudades";
import {
  obtenerActividadesHome,
  obtenerListaActividades,
  urlListadoActividadesSiExiste,
  type ActividadListItem,
} from "@/lib/actividades";
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
  urlCiudad,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import SelloProveedor from "@/components/SelloProveedor";
import HeroHome from "@/components/home/HeroHome";
import FranjaConfianza, { FranjaPartners } from "@/components/home/FranjaConfianza";
import { SAME_AS_REDES } from "@/lib/redesSociales";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

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

type Copy = {
  metaTitle: string;
  metaDescription: string;
  ogDescription: string;
  websiteJsonLdDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  exploreDestinos: string;
  seeActivitiesCta: string;
  topDestinosHeading: string;
  topDestinosSubheading: string;
  seeAllCities: string;
  featuredActHeading: string;
  featuredActSubheading: string;
  freeCancellation: string;
  fromLabel: string;
  viewActivity: string;
  guidesHeading: string;
  guidesSubheading: string;
  seeAllGuides: string;
};

const COPY: Record<Exclude<Idioma, "es">, Copy> = {
  en: {
    metaTitle: "ExploraSpain · Spain Travel Guides, Tours & Activities",
    metaDescription:
      "Spain travel guides, tours and activities with the best advice from local experts: Madrid, Barcelona, Seville, Granada and more. Free cancellation and trusted partners.",
    ogDescription:
      "Spain travel guides, tours and activities with the best advice from local experts. Free cancellation and booking through trusted partners.",
    websiteJsonLdDescription:
      "Spain travel guides, tours and activities with the best advice from local experts: book with free cancellation and trusted partners.",
    heroTitle:
      "Spain travel guides, tours and activities, with the best advice from local experts",
    heroSubtitle:
      "Direct, secure booking for tours and activities across Spain — no tourist filler, just what's actually worth it.",
    exploreDestinos: "Explore destinations",
    seeActivitiesCta: "See featured activities",
    topDestinosHeading: "Top destinations",
    topDestinosSubheading:
      "Pick your city and discover the best activities in each one.",
    seeAllCities: "See all cities →",
    featuredActHeading: "Featured activities",
    featuredActSubheading:
      "The best of each city: free cancellation and instant confirmation.",
    freeCancellation: "Free cancellation",
    fromLabel: "From",
    viewActivity: "View activity →",
    guidesHeading: "Guides to travel better",
    guidesSubheading: "Practical tips and routes with judgment before you book.",
    seeAllGuides: "See all guides →",
  },
  de: {
    metaTitle: "ExploraSpain · Reiseführer, Touren & Aktivitäten Spanien",
    metaDescription:
      "Reiseführer, Touren und Aktivitäten für Spanien mit den besten Tipps von lokalen Experten: Madrid, Barcelona, Sevilla, Granada und mehr. Kostenlose Stornierung und vertrauenswürdige Partner.",
    ogDescription:
      "Reiseführer, Touren und Aktivitäten für Spanien mit den besten Tipps von lokalen Experten. Kostenlose Stornierung und Buchung über vertrauenswürdige Partner.",
    websiteJsonLdDescription:
      "Reiseführer, Touren und Aktivitäten für Spanien mit den besten Tipps von lokalen Experten: buche mit kostenloser Stornierung und vertrauenswürdigen Partnern.",
    heroTitle:
      "Reiseführer, Touren und Aktivitäten für Spanien, mit den besten Tipps von lokalen Experten",
    heroSubtitle:
      "Direkte und sichere Buchung von Touren und Aktivitäten in ganz Spanien — kein touristischer Fülltext, nur das, was sich wirklich lohnt.",
    exploreDestinos: "Reiseziele entdecken",
    seeActivitiesCta: "Beliebte Aktivitäten ansehen",
    topDestinosHeading: "Top-Reiseziele",
    topDestinosSubheading:
      "Wähle deine Stadt und entdecke die besten Aktivitäten in jeder von ihnen.",
    seeAllCities: "Alle Städte ansehen →",
    featuredActHeading: "Beliebte Aktivitäten",
    featuredActSubheading:
      "Das Beste aus jeder Stadt: kostenlose Stornierung und sofortige Bestätigung.",
    freeCancellation: "Kostenlose Stornierung",
    fromLabel: "Ab",
    viewActivity: "Aktivität ansehen →",
    guidesHeading: "Reiseführer für bessere Reisen",
    guidesSubheading:
      "Praktische Tipps und Routen mit Kriterium, bevor du buchst.",
    seeAllGuides: "Alle Reiseführer ansehen →",
  },
  fr: {
    metaTitle: "ExploraSpain · Visites et activités en Espagne",
    metaDescription:
      "Visites, excursions et activités en Espagne sélectionnées par des experts locaux : Madrid, Barcelone, Séville, Grenade et plus encore. Réservation sécurisée et partenaires de confiance.",
    ogDescription:
      "Visites, excursions et activités en Espagne sélectionnées par des experts locaux. Réservation sécurisée auprès de partenaires de confiance.",
    websiteJsonLdDescription:
      "Visites, excursions et activités en Espagne sélectionnées par des experts locaux : réservez en toute sécurité auprès de partenaires de confiance.",
    heroTitle:
      "Visites et activités en Espagne, sélectionnées par des experts locaux",
    heroSubtitle:
      "Réservation directe et sécurisée de visites et d’activités dans toute l’Espagne — sans remplissage touristique, uniquement ce qui en vaut vraiment la peine.",
    exploreDestinos: "Découvrir les destinations",
    seeActivitiesCta: "Voir les activités à la une",
    topDestinosHeading: "Destinations phares",
    topDestinosSubheading:
      "Choisissez votre ville et découvrez ses meilleures activités.",
    seeAllCities: "Voir toutes les villes →",
    featuredActHeading: "Activités à la une",
    featuredActSubheading:
      "Le meilleur de chaque ville : annulation gratuite et confirmation immédiate.",
    freeCancellation: "Annulation gratuite",
    fromLabel: "À partir de",
    viewActivity: "Voir l’activité →",
    guidesHeading: "Des guides pour mieux voyager",
    guidesSubheading: "Conseils pratiques et itinéraires réfléchis avant de réserver.",
    seeAllGuides: "Voir tous les guides →",
  },
  it: {
    metaTitle: "ExploraSpain · Tour e attività in Spagna",
    metaDescription:
      "Tour, escursioni e attività in Spagna selezionati da esperti locali: Madrid, Barcellona, Siviglia, Granada e molto altro. Prenotazione sicura e partner affidabili.",
    ogDescription:
      "Tour, escursioni e attività in Spagna selezionati da esperti locali. Prenotazione sicura tramite partner affidabili.",
    websiteJsonLdDescription:
      "Tour, escursioni e attività in Spagna selezionati da esperti locali: prenota in sicurezza con partner affidabili.",
    heroTitle: "Tour e attività in Spagna, selezionati da esperti locali",
    heroSubtitle:
      "Prenotazione diretta e sicura di tour e attività in tutta la Spagna — niente riempitivi turistici, solo ciò che vale davvero la pena.",
    exploreDestinos: "Scopri le destinazioni",
    seeActivitiesCta: "Vedi le attività in evidenza",
    topDestinosHeading: "Destinazioni top",
    topDestinosSubheading:
      "Scegli la tua città e scopri le sue migliori attività.",
    seeAllCities: "Vedi tutte le città →",
    featuredActHeading: "Attività in evidenza",
    featuredActSubheading:
      "Il meglio di ogni città: cancellazione gratuita e conferma immediata.",
    freeCancellation: "Cancellazione gratuita",
    fromLabel: "Da",
    viewActivity: "Vedi l’attività →",
    guidesHeading: "Guide per viaggiare meglio",
    guidesSubheading: "Consigli pratici e itinerari ragionati prima di prenotare.",
    seeAllGuides: "Vedi tutte le guide →",
  },
  pt: {
    metaTitle: "ExploraSpain · Tours e atividades em Espanha",
    metaDescription:
      "Tours, excursões e atividades em Espanha selecionados por especialistas locais: Madrid, Barcelona, Sevilha, Granada e muito mais. Reserva segura e parceiros de confiança.",
    ogDescription:
      "Tours, excursões e atividades em Espanha selecionados por especialistas locais. Reserva segura através de parceiros de confiança.",
    websiteJsonLdDescription:
      "Tours, excursões e atividades em Espanha selecionados por especialistas locais: reserve em segurança com parceiros de confiança.",
    heroTitle:
      "Tours e atividades em Espanha, selecionados por especialistas locais",
    heroSubtitle:
      "Reserva direta e segura de tours e atividades em toda a Espanha — sem enchimento turístico, apenas o que realmente vale a pena.",
    exploreDestinos: "Explorar destinos",
    seeActivitiesCta: "Ver atividades em destaque",
    topDestinosHeading: "Destinos em destaque",
    topDestinosSubheading:
      "Escolha a sua cidade e descubra as melhores atividades de cada uma.",
    seeAllCities: "Ver todas as cidades →",
    featuredActHeading: "Atividades em destaque",
    featuredActSubheading:
      "O melhor de cada cidade: cancelamento gratuito e confirmação imediata.",
    freeCancellation: "Cancelamento gratuito",
    fromLabel: "Desde",
    viewActivity: "Ver atividade →",
    guidesHeading: "Guias para viajar melhor",
    guidesSubheading: "Conselhos práticos e roteiros pensados antes de reservar.",
    seeAllGuides: "Ver todos os guias →",
  },
};

function getCopy(lang: Exclude<Idioma, "es">): Copy {
  return COPY[lang];
}

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

  const copy = getCopy(lang);
  const canonicalUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const languages = hreflangAlternates((l) => prefijoIdioma(l) || "/");

  return {
    title: { absolute: copy.metaTitle },
    description: copy.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      type: "website",
      locale: IDIOMA_LOCALE[lang],
      url: canonicalUrl,
      siteName: "ExploraSpain",
      title: copy.metaTitle,
      description: copy.ogDescription,
    },
  };
}

const MIN_ACTIVIDADES_HOME = 8;
const MAX_POR_CIUDAD_HOME = 2;

/** Destacadas primero; luego nota ponderada por volumen de opiniones. */
function puntuacionActividad(a: ActividadListItem): number {
  const nota = a.ratingProveedor ?? 0;
  return nota * Math.log10(1 + (a.numeroOpiniones ?? 0));
}

/**
 * DE/FR/IT/PT: la selección curada (slugs ES) apenas tiene gemelas en estos
 * idiomas. Se completa hasta 8 con las mejores fichas del idioma, sin
 * repetir y con un máximo de 2 por ciudad (contando las curadas).
 */
function completarActividadesHome(
  lang: Exclude<Idioma, "es">,
  curadas: ActividadListItem[]
): ActividadListItem[] {
  if (lang === "en" || curadas.length >= MIN_ACTIVIDADES_HOME) return curadas;
  const resultado = [...curadas];
  const vistas = new Set(curadas.map((a) => a.url));
  const porCiudad = new Map<string, number>();
  for (const a of curadas) porCiudad.set(a.ciudad, (porCiudad.get(a.ciudad) ?? 0) + 1);

  const candidatas = obtenerListaActividades(lang).sort(
    (a, b) => puntuacionActividad(b) - puntuacionActividad(a)
  );
  // Dos pasadas: primero una por ciudad (para que no salgan solo islas) y,
  // si aún faltan, una segunda por ciudad.
  for (const tope of [1, MAX_POR_CIUDAD_HOME]) {
    for (const a of candidatas) {
      if (resultado.length >= MIN_ACTIVIDADES_HOME) break;
      if (vistas.has(a.url)) continue;
      const n = porCiudad.get(a.ciudad) ?? 0;
      if (n >= tope) continue;
      resultado.push(a);
      vistas.add(a.url);
      porCiudad.set(a.ciudad, n + 1);
    }
  }
  return resultado;
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

  const lang: Exclude<Idioma, "es"> = params.lang;
  const copy = getCopy(lang);
  const locale = IDIOMA_LOCALE[lang];
  const dict = getDictionary(lang);
  // Sin guías publicadas en el idioma, la lista sale vacía y la sección no se pinta.
  const guias = obtenerGuiasDestacadas(lang, 6);
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
  const actividadesHome = completarActividadesHome(lang, obtenerActividadesHome(lang));
  // EN conserva el formato y la etiqueta de siempre; el resto, formato local.
  const formatoLocal = lang !== "en";

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ExploraSpain",
    url: SITE_URL,
    inLanguage: IDIOMA_LOCALE[lang],
    description: copy.websiteJsonLdDescription,
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
    sameAs: SAME_AS_REDES,
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

      <HeroHome
        idioma={lang}
        opciones={ciudades.map((c) => ({
          nombre: c.nombre,
          url:
            urlListadoActividadesSiExiste(lang, c.slug) ??
            urlCiudad(lang, c.slug),
        }))}
        urlTodos={urlIndiceCiudades(lang)}
        anclaDestinos="#destinations"
      />
      <FranjaConfianza idioma={lang} />
      <FranjaNavidad idioma={lang} />

      {/* Top destinations */}
      {destinosHome.length > 0 && (
        <section
          id="destinations"
          className="max-w-6xl mx-auto px-4 py-16 md:py-20 scroll-mt-24"
        >
          <div className="mb-10">
            <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-piedra-900 mb-3">
              {copy.topDestinosHeading}
            </h2>
            <p className="text-piedra-600 text-lg">{copy.topDestinosSubheading}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinosHome.map((ciudad) => (
              <Link
                key={ciudad.url}
                href={
                  urlListadoActividadesSiExiste(lang, ciudad.slug) ??
                  urlCiudad(lang, ciudad.slug)
                }
                className="group relative block h-56 md:h-64 rounded-xl overflow-hidden shadow-sm"
              >
                <Image
                  src={`/ciudades/${ciudad.slug}.jpg`}
                  alt={`${ciudad.nombre}, ${ciudad.comunidad}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="inline-block bg-white/90 text-piedra-800 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mb-2">
                    {ciudad.comunidad}
                  </span>
                  <h3 className="font-fraunces text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow">
                    {ciudad.nombre}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={urlIndiceCiudades(lang)}
              className="inline-block text-anil-600 hover:text-anil-700 font-semibold"
            >
              {copy.seeAllCities}
            </Link>
          </div>
        </section>
      )}

      <FranjaAtracciones idioma={lang} />

      <ConQuienViajas idioma={lang} />

      <PrivadosHome idioma={lang} />

      {actividadesHome.length > 0 && (
        <section
          id="activities"
          className="bg-piedra-50 border-y border-piedra-200 scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
            <div className="mb-10">
              <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-piedra-900 mb-3">
                {copy.featuredActHeading}
              </h2>
              <p className="text-piedra-600 text-lg">{copy.featuredActSubheading}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {actividadesHome.map((a) => (
                <Link
                  key={a.url}
                  href={a.url}
                  className="group flex flex-col overflow-hidden rounded-xl border border-piedra-200 bg-white shadow-sm transition hover:border-anil-400 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-piedra-100">
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
                      <span className="absolute top-3 left-3 bg-azafran-500 text-piedra-900 text-xs font-semibold px-2 py-1 rounded">
                        {copy.freeCancellation}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {/* Siempre se pinta (vacío si no hay ciudad) para que todas las tarjetas midan igual. */}
                    <span className="h-4 text-xs font-semibold uppercase tracking-wider text-anil-700 mb-2">
                      {nombrePorCiudad.get(a.ciudad) ?? ""}
                    </span>
                    <h3 className="font-fraunces text-lg font-bold text-piedra-900 mb-2 group-hover:text-anil-700 transition-colors leading-tight line-clamp-2 min-h-[2.5em]">
                      {a.titulo}
                    </h3>
                    <div className="flex items-center gap-x-3 h-5 overflow-hidden whitespace-nowrap text-sm text-piedra-500 mb-4">
                      {a.duracion ? (
                        <span className="min-w-0 truncate">{a.duracion}</span>
                      ) : null}
                      {typeof a.ratingProveedor === "number" &&
                      typeof a.numeroOpiniones === "number" ? (
                        <span className="shrink-0">
                          <span className="text-azafran-600" aria-hidden="true">
                            ★
                          </span>{" "}
                          {formatoLocal
                            ? `${a.ratingProveedor.toLocaleString(locale, {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1,
                              })} (${a.numeroOpiniones.toLocaleString(locale)})`
                            : <>{a.ratingProveedor.toFixed(1)} ({a.numeroOpiniones})</>}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-auto pt-4 border-t border-piedra-100">
                      <SelloProveedor
                        proveedor={a.proveedor}
                        idioma={lang}
                        className="mb-3"
                      />
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-piedra-400">
                            {copy.fromLabel}
                          </p>
                          <p className="text-xl font-bold text-piedra-900">
                            {formatearPrecio(a.precioDesde, a.moneda, locale)}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="text-sm font-semibold text-anil-600 group-hover:text-anil-700"
                        >
                          {copy.viewActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guides (accessory) */}
      {guias.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-14 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-2">
                {copy.guidesHeading}
              </h2>
              <p className="text-piedra-600">{copy.guidesSubheading}</p>
            </div>
            <Link
              href={urlIndiceGuias(lang)}
              className="text-anil-600 hover:text-anil-700 font-semibold whitespace-nowrap"
            >
              {copy.seeAllGuides}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guias.map((guia) => (
              <Link
                key={guia.url}
                href={guia.url}
                className="group block border border-piedra-200 rounded-lg p-6 hover:border-anil-400 hover:shadow-md transition-all"
              >
                <span className="inline-block bg-anil-100 text-anil-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                  {formatoLocal
                    ? nombrePorCiudad.get(guia.categoria) ?? guia.categoria
                    : guia.categoria}
                </span>
                <h3 className="font-fraunces text-lg font-bold text-piedra-900 mb-2 group-hover:text-anil-700 transition-colors">
                  {guia.titulo}
                </h3>
                <p className="text-piedra-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {guia.descripcion}
                </p>
                <div className="flex items-center justify-between text-xs text-piedra-500">
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
      <RutasPorDias idioma={lang} />
      <FranjaCruceros idioma={lang} />
      <FranjaPartners idioma={lang} />
    </main>
  );
}
