import Link from "next/link";
import Image from "next/image";
import type { CiudadListItem } from "@/lib/ciudades";
import { obtenerListaActividadesPorCiudad } from "@/lib/actividades";
import { obtenerGuiasDeCiudad } from "@/lib/guias";
import {
  prefijoIdioma,
  urlActividadesDeCiudad,
  urlIndiceCiudades,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import {
  CIUDADES_PRINCIPALES,
  TEXTOS_ZONAS,
  ZONAS_ORDEN,
  ZONA_DE_CIUDAD,
} from "@/lib/zonas-ciudades";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

/**
 * Página índice de ciudades (ES y resto de idiomas comparten este componente).
 *  1. Hero sky con migas de pan, título, subtítulo y cifras globales.
 *  2. "Destinos principales": las ciudades de CIUDADES_PRINCIPALES.
 *  3. Un bloque por zona (ZONAS_ORDEN) con el resto de ciudades.
 * Todas las tarjetas tienen la misma altura y muestran nº de actividades y guías.
 */

type Textos = {
  inicio: string;
  titulo: string;
  subtitulo: string;
  destinos: string;
  actividades: string;
  guias: string;
  principales: string;
  principalesSub: string;
  ver: string;
  vacio: string;
};

const DICT: Readonly<Record<Idioma, Textos>> = {
  es: {
    inicio: "Inicio",
    titulo: "Ciudades de España",
    subtitulo: "Guías propias, tours y actividades para cada ciudad.",
    destinos: "destinos",
    actividades: "actividades",
    guias: "guías propias",
    principales: "Destinos principales",
    principalesSub: "Las ciudades con más actividades y guías.",
    ver: "Ver",
    vacio: "Próximamente publicaremos guías de las principales ciudades.",
  },
  en: {
    inicio: "Home",
    titulo: "Cities of Spain",
    subtitulo: "Our own guides, tours and activities for every city.",
    destinos: "destinations",
    actividades: "activities",
    guias: "own guides",
    principales: "Main destinations",
    principalesSub: "The cities with the most activities and guides.",
    ver: "Explore",
    vacio: "Guides to the main cities are coming soon.",
  },
  de: {
    inicio: "Start",
    titulo: "Städte in Spanien",
    subtitulo: "Eigene Reiseführer, Touren und Aktivitäten für jede Stadt.",
    destinos: "Reiseziele",
    actividades: "Aktivitäten",
    guias: "eigene Reiseführer",
    principales: "Wichtigste Reiseziele",
    principalesSub: "Die Städte mit den meisten Aktivitäten und Reiseführern.",
    ver: "Ansehen",
    vacio: "Reiseführer zu den wichtigsten Städten folgen in Kürze.",
  },
  fr: {
    inicio: "Accueil",
    titulo: "Villes d'Espagne",
    subtitulo: "Nos guides, tours et activités pour chaque ville.",
    destinos: "destinations",
    actividades: "activités",
    guias: "guides maison",
    principales: "Destinations principales",
    principalesSub: "Les villes avec le plus d'activités et de guides.",
    ver: "Voir",
    vacio: "Les guides des principales villes arrivent bientôt.",
  },
  it: {
    inicio: "Home",
    titulo: "Città della Spagna",
    subtitulo: "Guide proprie, tour e attività per ogni città.",
    destinos: "destinazioni",
    actividades: "attività",
    guias: "guide proprie",
    principales: "Destinazioni principali",
    principalesSub: "Le città con più attività e guide.",
    ver: "Vedi",
    vacio: "Le guide delle principali città arrivano presto.",
  },
  pt: {
    inicio: "Início",
    titulo: "Cidades de Espanha",
    subtitulo: "Guias próprios, tours e atividades para cada cidade.",
    destinos: "destinos",
    actividades: "atividades",
    guias: "guias próprios",
    principales: "Destinos principais",
    principalesSub: "As cidades com mais atividades e guias.",
    ver: "Ver",
    vacio: "Em breve publicaremos guias das principais cidades.",
  },
};

interface CiudadConCifras extends CiudadListItem {
  numActividades: number;
  numGuias: number;
  href: string;
}

function conCifras(idioma: Idioma, ciudad: CiudadListItem): CiudadConCifras {
  const numActividades = obtenerListaActividadesPorCiudad(idioma, ciudad.slug).length;
  const numGuias = obtenerGuiasDeCiudad(idioma, ciudad.slug).length;
  return {
    ...ciudad,
    numActividades,
    numGuias,
    href: numActividades > 0 ? urlActividadesDeCiudad(idioma, ciudad.slug) : ciudad.url,
  };
}

function CardCiudad({
  ciudad,
  t,
  priority,
  grande = false,
}: {
  ciudad: CiudadConCifras;
  t: Textos;
  priority: boolean;
  /** Tarjeta del bloque de destinos principales: foto más alta y título mayor. */
  grande?: boolean;
}) {
  const cifras = [
    ciudad.numActividades > 0 ? `${ciudad.numActividades} ${t.actividades}` : null,
    ciudad.numGuias > 0 ? `${ciudad.numGuias} ${t.guias.split(" ")[0]}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={ciudad.href}
      prefetch={false}
      className="group flex flex-col border border-piedra-200 rounded-lg overflow-hidden bg-white hover:border-anil-400 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
    >
      <div
        className={`relative w-full bg-piedra-100 overflow-hidden ${
          grande ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={`/ciudades/${ciudad.slug}.jpg`}
          alt={ciudad.imagenAlt || `${ciudad.nombre}, ${ciudad.comunidad}`}
          fill
          sizes={
            grande
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={priority}
        />
      </div>
      <div className="flex flex-col flex-1 p-6">
        <span className="self-start inline-block bg-anil-100 text-anil-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
          {ciudad.comunidad}
        </span>
        <h3
          className={`font-fraunces font-bold text-piedra-900 mb-2 group-hover:text-anil-700 transition-colors ${
            grande ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
          }`}
        >
          {ciudad.nombre}
        </h3>
        <p className="text-piedra-600 leading-relaxed line-clamp-3">
          {ciudad.descripcion}
        </p>
        <div className="mt-auto pt-5 flex items-center justify-between gap-3 text-sm">
          <span className="text-piedra-500">{cifras}</span>
          <span className="font-semibold text-anil-600 group-hover:text-anil-700 whitespace-nowrap">
            {t.ver} →
          </span>
        </div>
      </div>
    </Link>
  );
}

function GridCiudades({
  ciudades,
  t,
  priorityPrimeras,
  grande = false,
}: {
  ciudades: CiudadConCifras[];
  t: Textos;
  priorityPrimeras: boolean;
  grande?: boolean;
}) {
  return (
    <div
      className={
        grande
          ? "grid grid-cols-1 md:grid-cols-2 gap-6"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      }
    >
      {ciudades.map((ciudad, i) => (
        <CardCiudad
          key={ciudad.slug}
          ciudad={ciudad}
          t={t}
          priority={priorityPrimeras && i < 2}
          grande={grande}
        />
      ))}
    </div>
  );
}

export default function IndiceCiudades({
  idioma,
  ciudades,
}: {
  idioma: Idioma;
  ciudades: CiudadListItem[];
}) {
  const t = DICT[idioma];
  const todas = ciudades.map((c) => conCifras(idioma, c));
  const porSlug = new Map(todas.map((c) => [c.slug, c]));

  const principales = CIUDADES_PRINCIPALES.map((s) => porSlug.get(s)).filter(
    (c): c is CiudadConCifras => Boolean(c),
  );
  const enPrincipales = new Set(principales.map((c) => c.slug));

  const zonas = ZONAS_ORDEN.map((zona) => ({
    zona,
    textos: TEXTOS_ZONAS[idioma][zona],
    ciudades: todas
      .filter((c) => !enPrincipales.has(c.slug) && ZONA_DE_CIUDAD[c.slug] === zona)
      .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999)),
  })).filter((z) => z.ciudades.length > 0);

  // Ciudades publicadas que no estén en ninguna lista: no se pierden.
  const asignadas = new Set([
    ...enPrincipales,
    ...zonas.flatMap((z) => z.ciudades.map((c) => c.slug)),
  ]);
  const sinZona = todas
    .filter((c) => !asignadas.has(c.slug))
    .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));

  const totalActividades = todas.reduce((n, c) => n + c.numActividades, 0);
  const totalGuias = todas.reduce((n, c) => n + c.numGuias, 0);

  const inicioUrl = `${SITE_URL}${prefijoIdioma(idioma) || "/"}`;
  const indiceUrl = `${SITE_URL}${urlIndiceCiudades(idioma)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.inicio, item: inicioUrl },
        { "@type": "ListItem", position: 2, name: t.titulo, item: indiceUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t.titulo,
      numberOfItems: todas.length,
      itemListElement: [...principales, ...zonas.flatMap((z) => z.ciudades), ...sinZona].map(
        (c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.nombre,
          url: `${SITE_URL}${c.href}`,
        }),
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="bg-anil-500 text-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <nav aria-label="Migas de pan" className="text-sm text-anil-100 mb-4">
            <Link href={prefijoIdioma(idioma) || "/"}
      prefetch={false} className="hover:text-white">
              {t.inicio}
            </Link>
            {" › "}
            <span className="text-white">{t.titulo}</span>
          </nav>
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold mb-3 leading-tight">
            {t.titulo}
          </h1>
          <p className="text-lg md:text-xl text-anil-50 mb-6">{t.subtitulo}</p>
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-anil-100">
            <div className="flex items-baseline gap-2">
              <dd className="text-2xl font-bold text-white">{todas.length}</dd>
              <dt className="text-sm">{t.destinos}</dt>
            </div>
            {totalActividades > 0 && (
              <div className="flex items-baseline gap-2">
                <dd className="text-2xl font-bold text-white">{totalActividades}</dd>
                <dt className="text-sm">{t.actividades}</dt>
              </div>
            )}
            {totalGuias > 0 && (
              <div className="flex items-baseline gap-2">
                <dd className="text-2xl font-bold text-white">{totalGuias}</dd>
                <dt className="text-sm">{t.guias}</dt>
              </div>
            )}
          </dl>
        </div>
      </header>

      {todas.length === 0 ? (
        <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <p className="text-center py-12 text-piedra-500 text-lg">{t.vacio}</p>
        </section>
      ) : (
        <>
          {principales.length > 0 && (
            <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
              <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-2">
                {t.principales}
              </h2>
              <p className="text-piedra-500 mb-8">{t.principalesSub}</p>
              <GridCiudades ciudades={principales} t={t} priorityPrimeras grande />
            </section>
          )}

          {zonas.map((z, i) => (
            <section
              key={z.zona}
              className={
                i % 2 === 0
                  ? "bg-piedra-50 border-t border-piedra-200"
                  : "bg-white border-t border-piedra-200"
              }
            >
              <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
                <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-2">
                  {z.textos.titulo}
                </h2>
                <p className="text-piedra-500 mb-8">{z.textos.subtitulo}</p>
                <GridCiudades ciudades={z.ciudades} t={t} priorityPrimeras={false} />
              </div>
            </section>
          ))}

          {sinZona.length > 0 && (
            <section className="border-t border-piedra-200">
              <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
                <GridCiudades ciudades={sinZona} t={t} priorityPrimeras={false} />
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
