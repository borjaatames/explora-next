import { urlPlanificador } from "@/lib/planificador";
import { BotonesGuiasCiudad, PlanificaCiudad } from "@/components/ciudad/PlanCiudad";
import { MIN_PRIVADAS_CIUDAD, obtenerPrivadasDeCiudad, urlPrivadasDeCiudad } from "@/lib/privados";
import { aCardData } from "@/lib/cardActividad";
import { calcularEtiquetas } from "@/lib/etiquetasActividad";
import type { Metadata } from "next";
import { CLAVE_FILTRO_PRIVADOS } from "@/lib/filtrosActividades";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { obtenerCiudad } from "@/lib/ciudades";
import {
  CATEGORIAS_ACTIVIDAD,
  obtenerCiudadesConActividades,
  obtenerListaActividadesPorCiudad,
  obtenerActividadesParaPaginaCiudad,
  type ActividadListItem,
  type CategoriaActividad,
  urlListadoActividadesSiExiste,
  categoriaAUrl,
  MIN_FICHAS_CATEGORIA_INDEXABLE,
} from "@/lib/actividades";
import { obtenerGuiasDeCiudad } from "@/lib/guias";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { esIdiomaActivo, IDIOMAS_ACTIVOS, IDIOMA_LOCALE } from "@/lib/i18n/config";
import {
  hreflangAlternates,
  prefijoIdioma,
  urlActividadesDeCiudad,
  urlActividadesDeCiudadPorCategoria,
  urlGuiasDeCiudad,
  urlAtraccionesDeCiudad,
  urlIndiceCiudades,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import CtaCiudadCard from "@/components/ciudad/CtaCiudadCard";
import MasActividadesEnIngles, {
  esIdiomaCatalogoParcial,
} from "@/components/ciudad/MasActividadesEnIngles";
import ActividadesFiltradas, {
  type ActividadCardData,
  type ActividadesFiltradasStrings,
  type CategoriaOpcion,
  type EnlaceCategoria,
} from "@/components/ciudad/ActividadesFiltradas";
import { ampliarDescripcion, resumenActividades, resumenGuias } from "@/lib/metaDescripcion";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = {
  params: { lang: string; ciudad: string };
};

/**
 * Solo generamos esta ruta para (idioma, ciudad) con actividades
 * publicadas de verdad. Hoy en día solo `en` tiene contenido de
 * actividades (content/actividades/en/...); si en el futuro se añade
 * contenido en otro idioma activo, esto lo recoge automáticamente sin
 * tocar código. Los idiomas sin contenido (de/fr/it/pt por ahora)
 * simplemente no generan ninguna ruta — visitarla a mano hace notFound().
 */
export async function generateStaticParams() {
  const params: { lang: string; ciudad: string }[] = [];
  for (const lang of IDIOMAS_ACTIVOS) {
    if (lang === "es") continue;
    for (const ciudad of obtenerCiudadesConActividades(lang)) {
      params.push({ lang, ciudad });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) return { title: "City not found" };

  // Mismo criterio que el componente de página (más abajo): si no hay
  // actividades para este idioma+ciudad, la página hace notFound() y el
  // <title>/robots deben reflejarlo, no anunciar contenido inexistente.
  if (obtenerListaActividadesPorCiudad(lang, params.ciudad).length === 0) {
    return { title: textosListado(lang).noEncontrada, robots: { index: false, follow: false } };
  }

  const tl = textosListado(lang);
  const titulo = tl.titulo(ciudad.nombre);
  const descripcion = tl.descripcionMeta(ciudad.nombre);
  const metaDescripcion = ampliarDescripcion(descripcion, [
    resumenActividades(lang, obtenerListaActividadesPorCiudad(lang, params.ciudad)),
  ]);
  const url = `${SITE_URL}${urlActividadesDeCiudad(lang, params.ciudad)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    title: titulo,
    description: metaDescripcion,
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) =>
        urlListadoActividadesSiExiste(l, params.ciudad)
      ),
    },
    openGraph: {
      type: "website",
      url,
      title: `${titulo} | ExploraSpain`,
      description: metaDescripcion,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

type TextosListado = {
  noEncontrada: string;
  ariaMigas: string;
  titulo: (c: string) => string;
  descripcionMeta: (c: string) => string;
  subtitulo: string;
  actividades: string;
  atracciones: string;
  guias: string;
  valoracionMedia: string;
  soloPrivadas: (n: number) => string;
  probarPlanificador: string;
  media: string;
  migaActividades: string;
  vistaDe: string;
  sobre: (c: string) => string;
  sigue: (c: string) => string;
  guiasDe: (c: string) => string;
  guiasDescripcion: string;
  verGuias: string;
  atraccionesDe: (c: string) => string;
  atraccionesDescripcion: string;
  verAtracciones: string;
  filtros: ActividadesFiltradasStrings;
};

const TEXTOS_LISTADO: Record<Exclude<Idioma, "es">, TextosListado> = {
  en: {
    noEncontrada: "Page not found",
    ariaMigas: "Breadcrumb",
    titulo: (c) => `Things to do in ${c}`,
    descripcionMeta: (c) => `Tours, guided visits and day trips in ${c}. Hand-picked with editorial criteria.`,
    subtitulo: "Tours, guided visits and day trips hand-picked with editorial criteria.",
    actividades: "activities",
    atracciones: "attractions",
    guias: "guides",
    valoracionMedia: "average rating",
    soloPrivadas: (n) => `See only the ${n} private tours`,
    probarPlanificador: "Not sure what to pick? Try the planner",
    media: "average",
    migaActividades: "Activities",
    vistaDe: "View of ",
    sobre: (c) => `About ${c}`,
    sigue: (c) => `Keep exploring ${c}`,
    guiasDe: (c) => `Guides for ${c}`,
    guiasDescripcion: "Honest itineraries and practical advice to plan your trip with intent.",
    verGuias: "View guides",
    atraccionesDe: (c) => `Attractions in ${c}`,
    atraccionesDescripcion: "The must-see sights of the city, with photos and context.",
    verAtracciones: "View attractions",
    filtros: {
      filtrarPor: "Filter by",
      atracciones: "Attractions",
      categorias: "Categories",
      limpiarFiltros: "Clear filters",
      actividadesUna: "1 activity",
      actividadesPlural: "{n} activities",
      filtrosActivosUno: "1 active filter",
      filtrosActivosPlural: "{n} active filters",
      desde: "From",
      verActividad: "View activity",
      sinResultados: "No activities match these filters. Try removing some.",
      cancelacionGratuita: "Free cancellation",
    },
  },
  de: {
    noEncontrada: "Seite nicht gefunden",
    ariaMigas: "Brotkrümel",
    titulo: (c) => `Aktivitäten in ${c} auf Deutsch`,
    descripcionMeta: (c) =>
      `Touren, Führungen und Ausflüge in ${c} mit deutschsprachigem Guide, Audioguide oder App. Von unserer Redaktion ausgewählt.`,
    subtitulo: "Touren, Führungen und Ausflüge, die auch auf Deutsch angeboten werden, von unserer Redaktion ausgewählt.",
    actividades: "Aktivitäten",
    atracciones: "Sehenswürdigkeiten",
    guias: "Reiseführer",
    valoracionMedia: "Durchschnittsbewertung",
    soloPrivadas: (n) => `Nur die ${n} Privattouren ansehen`,
    probarPlanificador: "Unsicher, was du wählen sollst? Probier den Reiseplaner",
    media: "Durchschnitt",
    migaActividades: "Aktivitäten",
    vistaDe: "Blick auf ",
    sobre: (c) => `Über ${c}`,
    sigue: (c) => `Mehr über ${c}`,
    guiasDe: (c) => `Reiseführer für ${c}`,
    guiasDescripcion: "Ehrliche Routen und praktische Tipps, um deine Reise zu planen.",
    verGuias: "Reiseführer ansehen",
    atraccionesDe: (c) => `Sehenswürdigkeiten in ${c}`,
    atraccionesDescripcion: "Was du in der Stadt gesehen haben musst, mit Fotos und Hintergrund.",
    verAtracciones: "Sehenswürdigkeiten ansehen",
    filtros: {
      filtrarPor: "Filtern nach",
      atracciones: "Sehenswürdigkeiten",
      categorias: "Kategorien",
      limpiarFiltros: "Filter zurücksetzen",
      actividadesUna: "1 Aktivität",
      actividadesPlural: "{n} Aktivitäten",
      filtrosActivosUno: "1 aktiver Filter",
      filtrosActivosPlural: "{n} aktive Filter",
      desde: "Ab",
      verActividad: "Aktivität ansehen",
      sinResultados: "Keine Aktivitäten passen zu diesen Filtern. Entferne einige davon.",
      cancelacionGratuita: "Kostenlose Stornierung",
    },
  },
  fr: {
    noEncontrada: "Page introuvable",
    ariaMigas: "Fil d'Ariane",
    titulo: (c) => `Activités à ${c} en français`,
    descripcionMeta: (c) =>
      `Visites, excursions et visites guidées à ${c} avec guide francophone, audioguide ou application. Sélectionnées par notre rédaction.`,
    subtitulo: "Visites, excursions et visites guidées également proposées en français, sélectionnées par notre rédaction.",
    actividades: "activités",
    atracciones: "sites à voir",
    guias: "guides",
    valoracionMedia: "note moyenne",
    soloPrivadas: (n) => `Voir uniquement les ${n} visites privées`,
    probarPlanificador: "Vous hésitez ? Essayez le planificateur",
    media: "en moyenne",
    migaActividades: "Activités",
    vistaDe: "Vue de ",
    sobre: (c) => `À propos de ${c}`,
    sigue: (c) => `Continuez à découvrir ${c}`,
    guiasDe: (c) => `Guides de ${c}`,
    guiasDescripcion: "Des itinéraires honnêtes et des conseils pratiques pour préparer votre voyage.",
    verGuias: "Voir les guides",
    atraccionesDe: (c) => `Sites à voir à ${c}`,
    atraccionesDescripcion: "Les incontournables de la ville, avec photos et contexte.",
    verAtracciones: "Voir les sites",
    filtros: {
      filtrarPor: "Filtrer par",
      atracciones: "Sites à voir",
      categorias: "Catégories",
      limpiarFiltros: "Effacer les filtres",
      actividadesUna: "1 activité",
      actividadesPlural: "{n} activités",
      filtrosActivosUno: "1 filtre actif",
      filtrosActivosPlural: "{n} filtres actifs",
      desde: "À partir de",
      verActividad: "Voir l'activité",
      sinResultados: "Aucune activité ne correspond à ces filtres. Essayez d'en retirer quelques-uns.",
      cancelacionGratuita: "Annulation gratuite",
    },
  },
  it: {
    noEncontrada: "Pagina non trovata",
    ariaMigas: "Percorso di navigazione",
    titulo: (c) => `Attività a ${c} in italiano`,
    descripcionMeta: (c) =>
      `Tour, visite guidate ed escursioni a ${c} con guida in italiano, audioguida o app. Selezionati dalla nostra redazione.`,
    subtitulo: "Tour, visite guidate ed escursioni disponibili anche in italiano, selezionati dalla nostra redazione.",
    actividades: "attività",
    atracciones: "attrazioni",
    guias: "guide",
    valoracionMedia: "valutazione media",
    soloPrivadas: (n) => `Vedi solo i ${n} tour privati`,
    probarPlanificador: "Non sai cosa scegliere? Prova il pianificatore",
    media: "di media",
    migaActividades: "Attività",
    vistaDe: "Veduta di ",
    sobre: (c) => `Su ${c}`,
    sigue: (c) => `Continua a scoprire ${c}`,
    guiasDe: (c) => `Guide di ${c}`,
    guiasDescripcion: "Itinerari onesti e consigli pratici per organizzare il tuo viaggio.",
    verGuias: "Vedi le guide",
    atraccionesDe: (c) => `Attrazioni di ${c}`,
    atraccionesDescripcion: "Le tappe imperdibili della città, con foto e contesto.",
    verAtracciones: "Vedi le attrazioni",
    filtros: {
      filtrarPor: "Filtra per",
      atracciones: "Attrazioni",
      categorias: "Categorie",
      limpiarFiltros: "Rimuovi i filtri",
      actividadesUna: "1 attività",
      actividadesPlural: "{n} attività",
      filtrosActivosUno: "1 filtro attivo",
      filtrosActivosPlural: "{n} filtri attivi",
      desde: "Da",
      verActividad: "Vedi l'attività",
      sinResultados: "Nessuna attività corrisponde a questi filtri. Prova a toglierne qualcuno.",
      cancelacionGratuita: "Cancellazione gratuita",
    },
  },
  pt: {
    noEncontrada: "Página não encontrada",
    ariaMigas: "Navegação estrutural",
    titulo: (c) => `Atividades em ${c} em português`,
    descripcionMeta: (c) =>
      `Tours, visitas guiadas e excursões em ${c} com guia em português, audioguia ou aplicação. Selecionados pela nossa redação.`,
    subtitulo: "Tours, visitas guiadas e excursões também disponíveis em português, selecionados pela nossa redação.",
    actividades: "atividades",
    atracciones: "atrações",
    guias: "guias",
    valoracionMedia: "avaliação média",
    soloPrivadas: (n) => `Ver só as ${n} visitas privadas`,
    probarPlanificador: "Não sabe o que escolher? Experimente o planeador",
    media: "de média",
    migaActividades: "Atividades",
    vistaDe: "Vista de ",
    sobre: (c) => `Sobre ${c}`,
    sigue: (c) => `Continue a descobrir ${c}`,
    guiasDe: (c) => `Guias de ${c}`,
    guiasDescripcion: "Roteiros honestos e conselhos práticos para planear a sua viagem.",
    verGuias: "Ver guias",
    atraccionesDe: (c) => `Atrações de ${c}`,
    atraccionesDescripcion: "O imperdível da cidade, com fotos e contexto.",
    verAtracciones: "Ver atrações",
    filtros: {
      filtrarPor: "Filtrar por",
      atracciones: "Atrações",
      categorias: "Categorias",
      limpiarFiltros: "Limpar filtros",
      actividadesUna: "1 atividade",
      actividadesPlural: "{n} atividades",
      filtrosActivosUno: "1 filtro ativo",
      filtrosActivosPlural: "{n} filtros ativos",
      desde: "Desde",
      verActividad: "Ver atividade",
      sinResultados: "Nenhuma atividade corresponde a estes filtros. Experimente remover alguns.",
      cancelacionGratuita: "Cancelamento gratuito",
    },
  },
};

function textosListado(lang: Idioma): TextosListado {
  return lang === "es" ? TEXTOS_LISTADO.en : TEXTOS_LISTADO[lang];
}


function categoriasPresentes(
  actividades: ActividadListItem[],
  dictCategorias: Record<CategoriaActividad | typeof CLAVE_FILTRO_PRIVADOS, string>
): CategoriaOpcion[] {
  const presentes = new Set(actividades.map((a) => a.categoria));
  const opciones: CategoriaOpcion[] = CATEGORIAS_ACTIVIDAD.filter((c) =>
    presentes.has(c)
  ).map((c) => ({
    key: c,
    label: dictCategorias[c],
  }));
  // «Privados» va como un botón más al final; filtra por `privada`.
  if (actividades.some((a) => a.privada === true)) {
    opciones.push({
      key: CLAVE_FILTRO_PRIVADOS,
      label: dictCategorias[CLAVE_FILTRO_PRIVADOS],
    });
  }
  return opciones;
}

function calcularRatingMedio(actividades: ActividadListItem[]): number | null {
  const ratings = actividades
    .map((a) => a.ratingProveedor)
    .filter((r): r is number => typeof r === "number" && r > 0);
  if (ratings.length === 0) return null;
  const media = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
  return Math.round(media * 10) / 10;
}

export default async function ActividadesCiudadIndicePage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }
  const lang: Idioma = params.lang;
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) notFound();

  const actividades = obtenerActividadesParaPaginaCiudad(lang, params.ciudad);
  if (actividades.length === 0) notFound();

  const etiquetas = calcularEtiquetas(actividades);
  const privadasCiudad = obtenerPrivadasDeCiudad(lang, params.ciudad);
  const cardsActividades = actividades.map((a) => ({
    ...aCardData(a),
    etiqueta: etiquetas.get(a.slug),
  }));
  const chipsFiltros = ciudad.chipsFiltros ?? [];
  const ratingMedio = calcularRatingMedio(actividades);
  const guiasDeCiudad = obtenerGuiasDeCiudad(lang, params.ciudad);
  const hayGuias = guiasDeCiudad.length > 0;
  const hayAtracciones = (ciudad.atracciones?.length ?? 0) > 0;
  const hayExtras = hayGuias || hayAtracciones;
  const urlGuias = urlGuiasDeCiudad(lang, params.ciudad);
  const urlAtracciones = urlAtraccionesDeCiudad(lang, params.ciudad);
  const gridExtras =
    hayGuias && hayAtracciones
      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
      : "grid grid-cols-1 gap-6";
  const imagenCabecera = ciudad.imagenActividades || ciudad.imagen;
  const imagenSobre =
    ciudad.imagenResumen ||
    [ciudad.imagen, ciudad.imagenAtracciones, ciudad.imagenGuias].find(
      (img) => img && img !== imagenCabecera
    );
  const dict = getDictionary(lang);
  const tl = textosListado(lang);
  const categorias = categoriasPresentes(
    actividades,
    dict.actividades.categorias
  );
  const enlacesCategorias: EnlaceCategoria[] = categorias
    .filter((c) => c.key !== CLAVE_FILTRO_PRIVADOS)
    .map((c) => ({
      href: urlActividadesDeCiudadPorCategoria(
        lang,
        params.ciudad,
        categoriaAUrl(c.key as CategoriaActividad)
      ),
      label: c.label,
      total: actividades.filter((a) => a.categoria === c.key).length,
    }))
    .filter((c) => c.total >= MIN_FICHAS_CATEGORIA_INDEXABLE);

  const homeUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const indiceCiudadesUrl = `${SITE_URL}${urlIndiceCiudades(lang)}`;

  // Lista de las fichas del listado (ItemList para buscadores).
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: cardsActividades.length,
    itemListElement: cardsActividades.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${a.url}`,
      name: a.titulo,
    })),
  };
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.navegacion.inicio,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.navegacion.ciudades,
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
        name: tl.migaActividades,
        item: `${SITE_URL}${urlActividadesDeCiudad(lang, params.ciudad)}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />

      <header className="relative isolate overflow-hidden bg-anil-500 text-white py-6 md:py-16">
        {ciudad.imagenActividades || ciudad.imagen ? (
          <>
            <Image
              src={(ciudad.imagenActividades || ciudad.imagen) as string}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-piedra-900/60" aria-hidden="true" />
          </>
        ) : null}
        <div className="relative max-w-5xl mx-auto px-4">
          <nav aria-label={tl.ariaMigas} className="text-sm text-piedra-200 mb-4">
            <Link href={prefijoIdioma(lang) || "/"} className="hover:text-white">
              {dict.navegacion.inicio}
            </Link>
            {" › "}
            <Link href={urlIndiceCiudades(lang)} className="hover:text-white">
              {dict.navegacion.ciudades}
            </Link>
            {" › "}
            <Link href={ciudad.url} className="hover:text-white">
              {ciudad.nombre}
            </Link>
            {" › "}
            <span className="text-white">{tl.migaActividades}</span>
          </nav>

          <h1 className="font-fraunces text-2xl md:text-5xl font-bold mb-1 md:mb-3 leading-tight">
            {tl.titulo(ciudad.nombre)}
          </h1>
          <p className="hidden md:block text-lg md:text-xl text-piedra-100 max-w-3xl mb-6">
            {tl.subtitulo}
          </p>

          <p className="md:hidden text-sm text-piedra-100">
            {actividades.length} {tl.actividades}{ratingMedio !== null ? ` · ★ ${ratingMedio.toLocaleString(IDIOMA_LOCALE[lang])} ${tl.media}` : ""}
          </p>
          <div className="hidden md:grid md:grid-cols-4 gap-x-6 gap-y-3 max-w-3xl">
            <Metrica valor={actividades.length} etiqueta={tl.actividades} />
            <Metrica
              valor={ciudad.atracciones?.length ?? 0}
              etiqueta={tl.atracciones}
            />
            {hayGuias ? <Metrica valor={guiasDeCiudad.length} etiqueta={tl.guias} /> : null}
            {ratingMedio !== null ? (
              <Metrica
                valor={ratingMedio.toLocaleString(IDIOMA_LOCALE[lang])}
                etiqueta={tl.valoracionMedia}
                sufijo=" / 5"
              />
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {privadasCiudad.length >= MIN_PRIVADAS_CIUDAD ? (
              <Link
                href={urlPrivadasDeCiudad(lang, params.ciudad)}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-piedra-900"
              >
                {tl.soloPrivadas(privadasCiudad.length)} →
              </Link>
            ) : null}
            <Link
              href={`${urlPlanificador(lang)}?city=${params.ciudad}`}
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-piedra-900"
            >
              {tl.probarPlanificador} →
            </Link>
            <BotonesGuiasCiudad idioma={lang} ciudad={params.ciudad} />
          </div>
        </div>
      </header>

      <ActividadesFiltradas
        actividades={cardsActividades}
        chips={chipsFiltros}
        categorias={categorias}
        strings={tl.filtros}
        locale={IDIOMA_LOCALE[lang]}
        enlacesCategorias={enlacesCategorias}
      />

      {esIdiomaCatalogoParcial(lang) ? (
        <MasActividadesEnIngles
          idioma={lang}
          ciudad={params.ciudad}
          nombreCiudad={ciudad.nombre}
          max={12}
        />
      ) : null}

      <PlanificaCiudad idioma={lang} ciudad={params.ciudad} />

      {/* City intro text as secondary context at the foot of the page. */}
      {ciudad.resumenActividades || ciudad.contenidoHtml ? (
        <section className="bg-piedra-50 border-t border-piedra-200">
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            {ciudad.resumenActividades ? (
              <div
                className={
                  imagenSobre
                    ? "grid md:grid-cols-2 gap-8 lg:gap-10 items-center"
                    : "max-w-3xl"
                }
              >
                {imagenSobre ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-piedra-100 shadow-sm">
                    <Image
                      src={imagenSobre}
                      alt={ciudad.imagenResumenAlt || tl.vistaDe + ciudad.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div>
                  <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-4">
                    {tl.sobre(ciudad.nombre)}
                  </h2>
                  <p className="text-piedra-600 text-base md:text-lg leading-relaxed">
                    {ciudad.resumenActividades}
                  </p>
                </div>
              </div>
            ) : (
              <article className="max-w-3xl">
                <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-6">
                  {tl.sobre(ciudad.nombre)}
                </h2>
                <div
                  className="prose-guia text-justify hyphens-auto"
                  dangerouslySetInnerHTML={{ __html: ciudad.contenidoHtml }}
                />
              </article>
            )}
          </div>
        </section>
      ) : null}

      {/* Keep exploring: links to guides and attractions, so the activities
          page works as a complete hub for the city. */}
      {hayExtras ? (
        <section className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
          <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-6">
            {tl.sigue(ciudad.nombre)}
          </h2>
          <div className={gridExtras}>
            {hayGuias ? (
              <CtaCiudadCard
                href={urlGuias}
                imagen={ciudad.imagenGuias}
                imagenAlt={ciudad.imagenGuiasAlt}
                titulo={tl.guiasDe(ciudad.nombre)}
                descripcion={tl.guiasDescripcion}
                cta={tl.verGuias}
                acento="sky"
              />
            ) : null}
            {hayAtracciones ? (
              <CtaCiudadCard
                href={urlAtracciones}
                imagen={ciudad.imagenAtracciones}
                imagenAlt={ciudad.imagenAtraccionesAlt}
                titulo={tl.atraccionesDe(ciudad.nombre)}
                descripcion={tl.atraccionesDescripcion}
                cta={tl.verAtracciones}
                acento="slate"
              />
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Metrica({
  valor,
  etiqueta,
  sufijo,
}: {
  valor: number | string;
  etiqueta: string;
  sufijo?: string;
}) {
  return (
    <div className="border-l-2 border-azafran-400 pl-3">
      <div className="text-2xl md:text-3xl font-bold text-white leading-none">
        {valor}
        {sufijo ? (
          <span className="text-sm font-normal text-piedra-200">{sufijo}</span>
        ) : null}
      </div>
      <div className="text-xs text-piedra-200 mt-1">{etiqueta}</div>
    </div>
  );
}
