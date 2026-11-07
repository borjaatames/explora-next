import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { atraccionPorNombreEnCiudad } from "@/lib/atracciones";
import Image from "next/image";
import {
  obtenerCiudad,
  obtenerTodosLosCaminosCiudades,
  type Atraccion,
} from "@/lib/ciudades";
import { obtenerListaActividadesPorCiudad } from "@/lib/actividades";
import { slugParejaCiudad } from "@/lib/i18n/slugs";
import { esIdiomaActivo, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  hreflangAlternates,
  urlActividadesDeCiudad,
  urlAtraccionesDeCiudad,
  urlCiudad,
  urlIndiceCiudades,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = {
  params: { lang: string; ciudad: string };
};

type TextosAtracciones = {
  noEncontrada: string;
  titulo: (ciudad: string) => string;
  descripcion: (ciudad: string, lista: string) => string;
  subtitulo: (ciudad: string) => string;
  migaAtracciones: string;
  verActividades: (ciudad: string) => string;
  ariaMigas: string;
};

const TEXTOS: Record<Idioma, TextosAtracciones> = {
  es: {
    noEncontrada: "Página no encontrada",
    titulo: (c) => `Las mejores atracciones de ${c}`,
    descripcion: (c, l) => `Lo imprescindible que ver en ${c}: ${l}.`,
    subtitulo: (c) => `Lo imprescindible que ver en ${c}, con foto y contexto.`,
    migaAtracciones: "Atracciones",
    verActividades: (c) => `Ver actividades en ${c} →`,
    ariaMigas: "Migas de pan",
  },
  en: {
    noEncontrada: "Page not found",
    titulo: (c) => `Top attractions in ${c}`,
    descripcion: (c, l) => `What you can't miss in ${c}: ${l}.`,
    subtitulo: (c) => `What you can't miss in ${c}, with photos and context.`,
    migaAtracciones: "Attractions",
    verActividades: (c) => `See activities in ${c} →`,
    ariaMigas: "Breadcrumb",
  },
  de: {
    noEncontrada: "Seite nicht gefunden",
    titulo: (c) => `Die besten Sehenswürdigkeiten in ${c}`,
    descripcion: (c, l) => `Was man in ${c} nicht verpassen sollte: ${l}.`,
    subtitulo: (c) => `Was man in ${c} nicht verpassen sollte, mit Fotos und Hintergrundinfos.`,
    migaAtracciones: "Sehenswürdigkeiten",
    verActividades: (c) => `Aktivitäten in ${c} ansehen →`,
    ariaMigas: "Brotkrümel",
  },
  fr: {
    noEncontrada: "Page introuvable",
    titulo: (c) => `Les plus beaux sites à voir à ${c}`,
    descripcion: (c, l) => `Les incontournables de ${c} : ${l}.`,
    subtitulo: (c) => `Les incontournables de ${c}, avec photos et contexte.`,
    migaAtracciones: "Sites à voir",
    verActividades: (c) => `Voir les activités à ${c} →`,
    ariaMigas: "Fil d'Ariane",
  },
  it: {
    noEncontrada: "Pagina non trovata",
    titulo: (c) => `Le migliori attrazioni di ${c}`,
    descripcion: (c, l) => `Cosa non perdere a ${c}: ${l}.`,
    subtitulo: (c) => `Cosa non perdere a ${c}, con foto e contesto.`,
    migaAtracciones: "Attrazioni",
    verActividades: (c) => `Vedi le attività a ${c} →`,
    ariaMigas: "Percorso di navigazione",
  },
  pt: {
    noEncontrada: "Página não encontrada",
    titulo: (c) => `As melhores atrações de ${c}`,
    descripcion: (c, l) => `O que não pode perder em ${c}: ${l}.`,
    subtitulo: (c) => `O que não pode perder em ${c}, com fotos e contexto.`,
    migaAtracciones: "Atrações",
    verActividades: (c) => `Ver atividades em ${c} →`,
    ariaMigas: "Navegação estrutural",
  },
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

  // Mismo criterio que el componente de página (más abajo): sin
  // atracciones para este idioma+ciudad, la página hace notFound().
  if ((ciudad.atracciones ?? []).length === 0) {
    return { title: TEXTOS[lang].noEncontrada, robots: { index: false, follow: false } };
  }

  const url = `${SITE_URL}${urlAtraccionesDeCiudad(lang, params.ciudad)}`;
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const t = TEXTOS[lang];
  const titulo = t.titulo(ciudad.nombre);
  const lista = (ciudad.atracciones ?? []).map((a) => a.nombre).slice(0, 5).join(", ");
  const descripcion = t.descripcion(ciudad.nombre, lista);

  return {
    title: titulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => {
        const slugPareja = slugParejaCiudad(lang, params.ciudad, l);
        return slugPareja ? urlAtraccionesDeCiudad(l, slugPareja) : null;
      }),
    },
    openGraph: {
      type: "website",
      url,
      title: titulo,
      description: descripcion,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

export default async function AtraccionesCiudadPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }
  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const ciudad = await obtenerCiudad(lang, params.ciudad);
  if (!ciudad) notFound();
  const atracciones = ciudad.atracciones ?? [];
  if (atracciones.length === 0) notFound();
  // El enlace "ver actividades" al final de la página solo debe mostrarse
  // si esa ruta existe de verdad para este idioma+ciudad (mismo criterio
  // que hayActividades en cities/[ciudad]/page.tsx). Hoy solo `en` tiene
  // contenido de actividades: sin este guard, el enlace en alemán (u
  // otro idioma sin contenido) apuntaría a una página que no existe.
  const hayActividades =
    obtenerListaActividadesPorCiudad(lang, params.ciudad).length > 0;

  const homeUrl = `${SITE_URL}${prefijoIdioma(lang) || "/"}`;
  const indiceUrl = `${SITE_URL}${urlIndiceCiudades(lang)}`;
  const ciudadUrl = `${SITE_URL}${ciudad.url}`;
  const atraccionesUrl = `${SITE_URL}${urlAtraccionesDeCiudad(lang, params.ciudad)}`;

  const t = TEXTOS[lang];
  const titulo = t.titulo(ciudad.nombre);
  const subtitulo = t.subtitulo(ciudad.nombre);
  const breadcrumbAtracciones = t.migaAtracciones;
  const verActividades = t.verActividades(ciudad.nombre);

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.navegacion.inicio, item: homeUrl },
      { "@type": "ListItem", position: 2, name: dict.navegacion.ciudades, item: indiceUrl },
      { "@type": "ListItem", position: 3, name: ciudad.nombre, item: ciudadUrl },
      { "@type": "ListItem", position: 4, name: breadcrumbAtracciones, item: atraccionesUrl },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <header className="bg-anil-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <nav aria-label={t.ariaMigas} className="text-sm text-anil-100 mb-4">
            <Link href={prefijoIdioma(lang) || "/"} className="hover:text-white">
              {dict.navegacion.inicio}
            </Link>
            {" › "}
            <Link href={urlIndiceCiudades(lang)} className="hover:text-white">
              {dict.navegacion.ciudades}
            </Link>
            {" › "}
            <Link href={ciudad.url} className="hover:text-white">{ciudad.nombre}</Link>
            {" › "}
            <span className="text-white">{breadcrumbAtracciones}</span>
          </nav>
          <h1 className="font-fraunces text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {titulo}
          </h1>
          <p className="text-lg md:text-xl text-anil-50">{subtitulo}</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* Si el número de atracciones es impar, la última tarjeta se centra en vez de dejar un hueco */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:[&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:justify-self-center md:[&>*:last-child:nth-child(odd)]:w-[calc(50%-0.75rem)]">
          {atracciones.map((atr, i) => {
            const url = atraccionPorNombreEnCiudad(lang, params.ciudad, atr.nombre);
            return url ? (
              <Link key={i} href={url} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2">
                <AtraccionCard atraccion={atr} />
              </Link>
            ) : (
              <AtraccionCard key={i} atraccion={atr} />
            );
          })}
        </div>
      </section>

      {hayActividades ? (
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <Link href={urlActividadesDeCiudad(lang, params.ciudad)} className="text-anil-600 hover:text-anil-700 font-semibold">
            {verActividades}
          </Link>
        </div>
      ) : null}
    </main>
  );
}

function AtraccionCard({ atraccion }: { atraccion: Atraccion }) {
  if (atraccion.imagen) {
    return (
      <article className="group bg-white border border-piedra-200 rounded-lg overflow-hidden hover:border-anil-400 hover:shadow-md transition-all">
        <div className="relative w-full aspect-[4/3] bg-piedra-100 overflow-hidden">
          <Image
            src={atraccion.imagen}
            alt={atraccion.imagenAlt ?? atraccion.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 mb-2">
            {atraccion.nombre}
          </h2>
          <p className="text-piedra-600 leading-relaxed text-sm md:text-base">
            {atraccion.descripcion}
          </p>
        </div>
      </article>
    );
  }
  return (
    <article className="bg-anil-50 border border-anil-100 rounded-lg p-6 hover:border-anil-300 transition-colors">
      <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 mb-2">
        {atraccion.nombre}
      </h2>
      <p className="text-piedra-600 leading-relaxed text-sm md:text-base">
        {atraccion.descripcion}
      </p>
    </article>
  );
}
