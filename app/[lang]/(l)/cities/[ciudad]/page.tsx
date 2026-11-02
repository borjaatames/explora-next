import { obtenerCiudadesConPrivadas, urlPrivadasDeCiudad } from "@/lib/privados";
import OtrosIdiomas from "@/components/layout/OtrosIdiomas";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  obtenerCiudad,
  obtenerTodosLosCaminosCiudades,
} from "@/lib/ciudades";
import { obtenerGuiasDeCiudad } from "@/lib/guias";
import { obtenerActividadesParaPaginaCiudad } from "@/lib/actividades";
import EscaparateActividades from "@/components/ciudad/EscaparateActividades";
import CtaCiudadCard from "@/components/ciudad/CtaCiudadCard";
import MasActividadesEnIngles, {
  esIdiomaCatalogoParcial,
} from "@/components/ciudad/MasActividadesEnIngles";
import GuiasDeCiudadLista from "@/components/ciudad/GuiasDeCiudadLista";
import { slugParejaCiudad } from "@/lib/i18n/slugs";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  hreflangAlternates,
  rutasPorIdioma,
  urlActividadesDeCiudad,
  urlAtraccionesDeCiudad,
  urlCiudad,
  urlGuiasDeCiudad,
  urlIndiceCiudades,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import HeroCiudad, { DatosClaveCiudad } from "@/components/ciudad/HeroCiudad";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

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
  const titleSuffix = SUFIJO_TITULO[lang] ?? ` | ${getDictionary(lang).ciudades.tituloIndice}`;

  return {
    title: ciudad.metaTitle ?? `${ciudad.nombre}${titleSuffix}`,
    description: ciudad.metaDescription ?? ciudad.descripcion,
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

/** Con menos fichas en el idioma, la página de ciudad añade las de inglés. */
const MIN_FICHAS_SIN_COMPLETAR = 6;

const SUFIJO_TITULO: Partial<Record<Idioma, string>> = {
  en: " | Travel guide",
  de: " | Reiseführer",
  fr: " | Guide de voyage",
  it: " | Guida di viaggio",
  pt: " | Guia de viagem",
};

const SOBRE_CIUDAD: Partial<Record<Idioma, (nombre: string) => string>> = {
  en: (n) => `About ${n}`,
  de: (n) => `Über ${n}`,
  fr: (n) => `À propos de ${n}`,
  it: (n) => `Su ${n}`,
  pt: (n) => `Sobre ${n}`,
};

type Strings = {
  guiasTitulo: string;
  guiasDescripcion: string;
  guiasCta: string;
  guiasListaTitulo: string;
  guiasVerTodas: string;
  minLectura: string;
  actividadesTitulo: string;
  actividadesDescripcion: string;
  actividadesCta: string;
  atraccionesTitulo: string;
  atraccionesDescripcion: string;
  atraccionesCta: string;
};

const STRINGS: Record<Idioma, (nombreCiudad: string) => Strings> = {
  en: (nombreCiudad) => ({
    guiasTitulo: `Guides for ${nombreCiudad}`,
    guiasDescripcion: "Honest itineraries and practical advice to plan your trip with intent.",
    guiasCta: "View guides",
    guiasListaTitulo: `${nombreCiudad} travel guides`,
    guiasVerTodas: `All guides for ${nombreCiudad}`,
    minLectura: "min read",
    actividadesTitulo: `Things to do in ${nombreCiudad}`,
    actividadesDescripcion: "Hand-picked tours and experiences. Free cancellation included.",
    actividadesCta: "View activities",
    atraccionesTitulo: `Attractions in ${nombreCiudad}`,
    atraccionesDescripcion: "The must-see sights of the city, with photos and context.",
    atraccionesCta: "View attractions",
  }),
  de: (nombreCiudad) => ({
    guiasTitulo: `Reiseführer für ${nombreCiudad}`,
    guiasDescripcion: "Ehrliche Routen und praktische Tipps, um deine Reise gezielt zu planen.",
    guiasCta: "Reiseführer ansehen",
    guiasListaTitulo: `Reiseführer für ${nombreCiudad}`,
    guiasVerTodas: `Alle Reiseführer für ${nombreCiudad}`,
    minLectura: "Min. Lesezeit",
    actividadesTitulo: `Aktivitäten in ${nombreCiudad}`,
    actividadesDescripcion: "Handverlesene Touren und Erlebnisse. Kostenlose Stornierung inklusive.",
    actividadesCta: "Aktivitäten ansehen",
    atraccionesTitulo: `Sehenswürdigkeiten in ${nombreCiudad}`,
    atraccionesDescripcion: "Die wichtigsten Sehenswürdigkeiten der Stadt, mit Fotos und Hintergrundinfos.",
    atraccionesCta: "Sehenswürdigkeiten ansehen",
  }),
  fr: (nombreCiudad) => ({
    guiasTitulo: `Guides de ${nombreCiudad}`,
    guiasDescripcion: "Des itinéraires honnêtes et des conseils pratiques pour bien préparer votre voyage.",
    guiasCta: "Voir les guides",
    guiasListaTitulo: `Guides de voyage de ${nombreCiudad}`,
    guiasVerTodas: `Tous les guides de ${nombreCiudad}`,
    minLectura: "min de lecture",
    actividadesTitulo: `Activités à ${nombreCiudad}`,
    actividadesDescripcion: "Visites et expériences sélectionnées avec soin. Annulation gratuite incluse.",
    actividadesCta: "Voir les activités",
    atraccionesTitulo: `Sites à voir à ${nombreCiudad}`,
    atraccionesDescripcion: "Les incontournables de la ville, avec photos et contexte.",
    atraccionesCta: "Voir les sites",
  }),
  it: (nombreCiudad) => ({
    guiasTitulo: `Guide di ${nombreCiudad}`,
    guiasDescripcion: "Itinerari onesti e consigli pratici per organizzare il tuo viaggio con criterio.",
    guiasCta: "Vedi le guide",
    guiasListaTitulo: `Guide di viaggio di ${nombreCiudad}`,
    guiasVerTodas: `Tutte le guide di ${nombreCiudad}`,
    minLectura: "min di lettura",
    actividadesTitulo: `Attività a ${nombreCiudad}`,
    actividadesDescripcion: "Tour ed esperienze selezionati con cura. Cancellazione gratuita inclusa.",
    actividadesCta: "Vedi le attività",
    atraccionesTitulo: `Attrazioni di ${nombreCiudad}`,
    atraccionesDescripcion: "Le tappe imperdibili della città, con foto e contesto.",
    atraccionesCta: "Vedi le attrazioni",
  }),
  pt: (nombreCiudad) => ({
    guiasTitulo: `Guias de ${nombreCiudad}`,
    guiasDescripcion: "Roteiros honestos e conselhos práticos para planear a sua viagem com critério.",
    guiasCta: "Ver guias",
    guiasListaTitulo: `Guias de viagem de ${nombreCiudad}`,
    guiasVerTodas: `Todos os guias de ${nombreCiudad}`,
    minLectura: "min de leitura",
    actividadesTitulo: `Atividades em ${nombreCiudad}`,
    actividadesDescripcion: "Tours e experiências selecionados com critério. Cancelamento gratuito incluído.",
    actividadesCta: "Ver atividades",
    atraccionesTitulo: `Atrações de ${nombreCiudad}`,
    atraccionesDescripcion: "O imperdível da cidade, com fotos e contexto.",
    atraccionesCta: "Ver atrações",
  }),
  es: (nombreCiudad) => ({
    guiasTitulo: `Guías de ${nombreCiudad}`,
    guiasDescripcion: "Rutas con criterio y consejos honestos para planificar tu viaje.",
    guiasCta: "Ver guías",
    guiasListaTitulo: `Guías de ${nombreCiudad}`,
    guiasVerTodas: `Ver todas las guías de ${nombreCiudad}`,
    minLectura: "min lectura",
    actividadesTitulo: `Actividades y tours en ${nombreCiudad}`,
    actividadesDescripcion: "Tours seleccionados con criterio editorial. Reserva con cancelación gratis.",
    actividadesCta: "Ver actividades",
    atraccionesTitulo: `Atracciones de ${nombreCiudad}`,
    atraccionesDescripcion: "Lo imprescindible que ver en la ciudad, con foto y contexto.",
    atraccionesCta: "Ver atracciones",
  }),
};

function getStrings(lang: Idioma, nombreCiudad: string): Strings {
  return STRINGS[lang](nombreCiudad);
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
  // La ficha de actividades solo existe (generateStaticParams) para
  // ciudades con al menos una actividad publicada — si no hay ninguna,
  // esa ruta hace notFound(). Por eso ocultamos el botón aquí en vez de
  // enlazar a una página que no existe (mismo criterio que hayGuias /
  // hayAtracciones más abajo).
  const actividadesCiudad = obtenerActividadesParaPaginaCiudad(lang, params.ciudad);
  const hayActividades = actividadesCiudad.length > 0;
  const urlGuias = urlGuiasDeCiudad(lang, params.ciudad);
  const urlActividades = urlActividadesDeCiudad(lang, params.ciudad);
  const urlAtracciones = urlAtraccionesDeCiudad(lang, params.ciudad);
  const hayAtracciones = (ciudad.atracciones?.length ?? 0) > 0;
  const numCards = (hayActividades ? 1 : 0) + (hayAtracciones ? 1 : 0);
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

      <HeroCiudad
        idioma={lang}
        nombre={ciudad.nombre}
        descripcion={ciudad.descripcion}
        comunidad={ciudad.comunidad}
        imagen={ciudad.imagen}
        imagenAlt={ciudad.imagenAlt}
        migas={[
          { label: dict.navegacion.inicio, href: prefijoIdioma(lang) || "/" },
          { label: dict.navegacion.ciudades, href: urlIndiceCiudades(lang) },
          { label: ciudad.nombre },
        ]}
        urlActividades={hayActividades ? urlActividades : undefined}
        urlPrivados={(lang === "en" && obtenerCiudadesConPrivadas("en").some((c) => c.ciudad === params.ciudad)) ? urlPrivadasDeCiudad("en", params.ciudad) : undefined}
        urlGuias={hayGuias ? urlGuias : undefined}
        urlAtracciones={hayAtracciones ? urlAtracciones : undefined}
      />


      {hayActividades ? (
        <EscaparateActividades
          idioma={lang}
          nombreCiudad={ciudad.nombre}
          actividades={actividadesCiudad}
          chips={ciudad.chipsFiltros ?? []}
          urlActividades={urlActividades}
        />
      ) : null}

      {/* Catálogo corto en el idioma: se completa con las fichas en inglés. */}
      {esIdiomaCatalogoParcial(lang) && actividadesCiudad.length < MIN_FICHAS_SIN_COMPLETAR ? (
        <MasActividadesEnIngles
          idioma={lang}
          ciudad={params.ciudad}
          nombreCiudad={ciudad.nombre}
          max={4}
        />
      ) : null}

      <GuiasDeCiudadLista
        guias={guiasDeCiudad}
        titulo={strings.guiasListaTitulo}
        urlTodas={urlGuias}
        textoVerTodas={strings.guiasVerTodas}
        textoMinLectura={strings.minLectura}
      />

      <DatosClaveCiudad idioma={lang} datos={ciudad.datosClave ?? []} />
      <article className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-4">
          {SOBRE_CIUDAD[lang]?.(ciudad.nombre) ?? ciudad.nombre}
        </h2>
        <div
          className="prose-guia text-justify hyphens-auto"
          dangerouslySetInnerHTML={{ __html: ciudad.contenidoHtml }}
        />
      </article>

      <section className="bg-piedra-50 border-t border-piedra-200">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className={gridClass}>
            {hayActividades ? (
              <CtaCiudadCard
                href={urlActividades}
                imagen={ciudad.imagenActividades}
                imagenAlt={ciudad.imagenActividadesAlt}
                titulo={strings.actividadesTitulo}
                descripcion={strings.actividadesDescripcion}
                cta={strings.actividadesCta}
                acento="amber"
              />
            ) : null}
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
          className="text-anil-600 hover:text-anil-700 font-semibold"
        >
          ← {dict.ciudades.volverACiudades}
        </Link>
      </div>
      <OtrosIdiomas
        idioma={lang}
        rutas={rutasPorIdioma((l) => {
          const slugPareja = slugParejaCiudad(lang, params.ciudad, l);
          return slugPareja ? urlCiudad(l, slugPareja) : null;
        })}
      />
    </main>
  );
}
