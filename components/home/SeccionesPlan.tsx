import Link from "next/link";
import Image from "next/image";
import type { Idioma } from "@/lib/i18n/types";
import type { GuiaListItem } from "@/lib/guias";
import {
  CIUDADES_NAVIDAD,
  enTemporadaNavidad,
  guiaPorSlugEs,
  guiasDePuertos,
  guiasDeTipo,
  nombresCiudades,
  urlCruceros,
  type TipoGuiaPlan,
} from "@/lib/descubrir";
import { urlPlanificador } from "@/lib/planificador";

type IdiomaPlan = "es" | "en";

function idiomaPlan(idioma: Idioma): IdiomaPlan | null {
  return idioma === "es" || idioma === "en" ? idioma : null;
}

const IMAGEN_RESPALDO = "/images/home/hero.jpg";

function portada(g: GuiaListItem): string {
  return g.imagen_portada || g.imagen || IMAGEN_RESPALDO;
}

// ---------------------------------------------------------------------------
// Franja de Navidad (solo del 1 de noviembre al 6 de enero)
// ---------------------------------------------------------------------------

const T_NAVIDAD = {
  es: {
    etiqueta: "Temporada",
    titulo: "Navidad 2026 en España",
    texto: "Luces, mercadillos, Nochevieja y Reyes: fechas y planes de cada ciudad.",
  },
  en: {
    etiqueta: "Seasonal",
    titulo: "Christmas 2026 in Spain",
    texto: "Lights, markets, New Year's Eve and Three Kings: dates and plans city by city.",
  },
} as const;

export function FranjaNavidad({ idioma }: { idioma: Idioma }) {
  const l = idiomaPlan(idioma);
  if (!l || !enTemporadaNavidad()) return null;
  const nombres = nombresCiudades(idioma);
  const guias = CIUDADES_NAVIDAD.flatMap((c) => {
    const g = guiasDeTipo(idioma, c, "navidad")[0];
    return g ? [{ ciudad: c, guia: g }] : [];
  });
  if (guias.length < 3) return null;
  const t = T_NAVIDAD[l];

  return (
    <section aria-labelledby="navidad-home" className="bg-anil-500 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="mb-6 max-w-2xl">
          <span className="inline-block bg-azafran-400 text-piedra-900 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
            {t.etiqueta}
          </span>
          <h2 id="navidad-home" className="font-fraunces text-2xl md:text-3xl font-bold mb-2">
            {t.titulo}
          </h2>
          <p className="text-anil-50">{t.texto}</p>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {guias.map(({ ciudad, guia }) => (
            <li key={guia.url}>
              <Link
                href={guia.url}
                className="group block rounded-lg overflow-hidden bg-white/10 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-anil-500"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={portada(guia)}
                    alt={guia.imagen_alt ?? guia.titulo}
                    fill
                    sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <span className="block px-3 py-2 font-semibold">
                  {nombres.get(ciudad) ?? ciudad}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ¿Con quién viajas?
// ---------------------------------------------------------------------------

type Perfil = {
  con: "pareja" | "familia" | "amigos" | "grupo";
  tipo: TipoGuiaPlan;
  /** Subcadena del slug que distingue la guía dentro de su tipo. */
  filtro: RegExp;
  titulo: Record<IdiomaPlan, string>;
  texto: Record<IdiomaPlan, string>;
};

const PERFILES: ReadonlyArray<Perfil> = [
  {
    con: "pareja",
    tipo: "ocasion",
    filtro: /pareja|romantic/,
    titulo: { es: "En pareja", en: "As a couple" },
    texto: {
      es: "Atardeceres, cenas con espectáculo y planes para dos con precio.",
      en: "Sunsets, dinner shows and plans for two, with prices.",
    },
  },
  {
    con: "familia",
    tipo: "familia",
    filtro: /./,
    titulo: { es: "En familia", en: "With kids" },
    texto: {
      es: "Lo que gusta a los niños, edades mínimas y cómo no agotarlos.",
      en: "What kids enjoy, minimum ages and how not to wear them out.",
    },
  },
  {
    con: "amigos",
    tipo: "ocasion",
    filtro: /despedida|hen-and-stag/,
    titulo: { es: "Amigos y despedidas", en: "Friends, hen and stag" },
    texto: {
      es: "Planes de día y de noche para grupos, con las normas de cada ciudad.",
      en: "Day and night plans for groups, with each city's rules.",
    },
  },
  {
    con: "grupo",
    tipo: "ocasion",
    filtro: /empresas|team/,
    titulo: { es: "Grupos y empresas", en: "Groups and teams" },
    texto: {
      es: "Actividades privadas con precio por grupo y factura.",
      en: "Private activities priced per group, with an invoice.",
    },
  },
];

const CIUDADES_PERFIL = ["madrid", "barcelona", "sevilla", "malaga", "valencia", "granada"] as const;

const T_CON_QUIEN = {
  es: {
    titulo: "¿Con quién viajas?",
    subtitulo: "Guías pensadas para cada tipo de viaje, o deja que el planificador te proponga actividades.",
    planificador: "Proponme actividades",
  },
  en: {
    titulo: "Who are you travelling with?",
    subtitulo: "Guides for each kind of trip, or let the planner suggest activities for you.",
    planificador: "Suggest activities",
  },
} as const;

export function ConQuienViajas({ idioma }: { idioma: Idioma }) {
  const l = idiomaPlan(idioma);
  if (!l) return null;
  const t = T_CON_QUIEN[l];
  const nombres = nombresCiudades(idioma);
  const planificador = urlPlanificador(idioma);

  const perfiles = PERFILES.map((p) => ({
    ...p,
    guias: CIUDADES_PERFIL.flatMap((c) => {
      const g = guiasDeTipo(idioma, c, p.tipo).find((x) => p.filtro.test(x.slug));
      return g ? [{ ciudad: c, guia: g }] : [];
    }).slice(0, 3),
  }));

  return (
    <section aria-labelledby="con-quien-home" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <div className="mb-8 max-w-2xl">
        <h2 id="con-quien-home" className="font-fraunces text-3xl md:text-4xl font-bold text-piedra-900 mb-3">
          {t.titulo}
        </h2>
        <p className="text-piedra-600 text-lg">{t.subtitulo}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {perfiles.map((p) => (
          <article key={p.con} className="flex flex-col border border-piedra-200 rounded-lg p-6">
            <h3 className="font-fraunces text-xl font-bold text-piedra-900 mb-2">{p.titulo[l]}</h3>
            <p className="text-piedra-600 text-sm leading-relaxed mb-4">{p.texto[l]}</p>
            {p.guias.length > 0 && (
              <ul className="mb-5 space-y-1.5 text-sm">
                {p.guias.map(({ ciudad, guia }) => (
                  <li key={guia.url}>
                    <Link
                      href={guia.url}
                      className="text-anil-600 hover:text-anil-700 font-semibold transition-colors"
                    >
                      {nombres.get(ciudad) ?? ciudad} →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`${planificador}?con=${p.con}`}
              prefetch={false}
              className="mt-auto inline-flex items-center justify-center bg-white border border-piedra-300 hover:border-anil-400 text-piedra-900 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
            >
              {t.planificador}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Rutas por días
// ---------------------------------------------------------------------------

const RUTA_DESTACADA = { ciudad: "sevilla", slugEs: "andalucia-en-7-dias" } as const;

const RUTAS: ReadonlyArray<{ ciudad: string; slugEs: string; dias: number }> = [
  { ciudad: "madrid", slugEs: "madrid-toledo-segovia-en-4-dias", dias: 4 },
  { ciudad: "madrid", slugEs: "madrid-en-2-dias", dias: 2 },
  { ciudad: "barcelona", slugEs: "barcelona-en-2-dias", dias: 2 },
  { ciudad: "sevilla", slugEs: "sevilla-en-2-dias", dias: 2 },
  { ciudad: "granada", slugEs: "granada-en-1-dia", dias: 1 },
];

const T_RUTAS = {
  es: {
    titulo: "Rutas por días",
    subtitulo: "Itinerarios hora a hora, con trenes, entradas y lo que conviene reservar antes.",
    destacada: "Ruta estrella",
    dias: (n: number) => (n === 1 ? "1 día" : `${n} días`),
    verTodas: "Ver todas las guías",
    url: "/guias",
  },
  en: {
    titulo: "Itineraries by days",
    subtitulo: "Hour-by-hour plans with trains, tickets and what to book ahead.",
    destacada: "Top route",
    dias: (n: number) => (n === 1 ? "1 day" : `${n} days`),
    verTodas: "See all guides",
    url: "/en/guides",
  },
} as const;

export function RutasPorDias({ idioma }: { idioma: Idioma }) {
  const l = idiomaPlan(idioma);
  if (!l) return null;
  const t = T_RUTAS[l];
  const destacada = guiaPorSlugEs(idioma, RUTA_DESTACADA.ciudad, RUTA_DESTACADA.slugEs);
  const rutas = RUTAS.flatMap((r) => {
    const g = guiaPorSlugEs(idioma, r.ciudad, r.slugEs);
    return g ? [{ ...r, guia: g }] : [];
  });
  if (!destacada && rutas.length < 3) return null;

  return (
    <section aria-labelledby="rutas-home" className="bg-piedra-50 border-y border-piedra-200">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="max-w-2xl">
            <h2 id="rutas-home" className="font-fraunces text-3xl md:text-4xl font-bold text-piedra-900 mb-3">
              {t.titulo}
            </h2>
            <p className="text-piedra-600 text-lg">{t.subtitulo}</p>
          </div>
          <Link href={t.url} className="text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors">
            {t.verTodas} →
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {destacada && (
            <Link
              href={destacada.url}
              className="group relative block min-h-[320px] rounded-xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
            >
              <Image
                src={portada(destacada)}
                alt={destacada.imagen_alt ?? destacada.titulo}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-piedra-900/55 group-hover:bg-piedra-900/45 transition-colors" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="inline-block bg-azafran-400 text-piedra-900 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                  {t.destacada} · {t.dias(7)}
                </span>
                <h3 className="font-fraunces text-2xl md:text-3xl font-bold leading-tight mb-2">
                  {destacada.titulo}
                </h3>
                <p className="text-sm text-white/90 line-clamp-2">{destacada.descripcion}</p>
              </div>
            </Link>
          )}
          <ul className="grid grid-cols-1 gap-3">
            {rutas.map((r) => (
              <li key={r.guia.url}>
                <Link
                  href={r.guia.url}
                  className="group flex items-center gap-4 bg-white border border-piedra-200 rounded-lg p-3 hover:border-anil-400 hover:shadow-md transition-all"
                >
                  <div className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={portada(r.guia)}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-anil-700">
                      {t.dias(r.dias)}
                    </span>
                    <h3 className="font-semibold text-piedra-900 group-hover:text-anil-700 transition-colors line-clamp-2">
                      {r.guia.titulo}
                    </h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Franja de cruceros
// ---------------------------------------------------------------------------

const T_CRUCEROS = {
  es: {
    titulo: "¿Llegas en crucero?",
    subtitulo: "Qué ver en tu escala, cómo ir del muelle al centro y excursiones que te recogen en el puerto.",
    verTodos: "Guía de cruceros por puertos",
  },
  en: {
    titulo: "Arriving by cruise ship?",
    subtitulo: "What to see on your port day, getting from the pier to town, and tours with port pickup.",
    verTodos: "Cruise guide by port",
  },
} as const;

export function FranjaCruceros({ idioma }: { idioma: Idioma }) {
  const l = idiomaPlan(idioma);
  if (!l) return null;
  const puertos = guiasDePuertos(idioma);
  if (puertos.length < 4) return null;
  const t = T_CRUCEROS[l];

  return (
    <section aria-labelledby="cruceros-home" className="max-w-6xl mx-auto px-4 py-14 md:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          <h2 id="cruceros-home" className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-2">
            {t.titulo}
          </h2>
          <p className="text-piedra-600">{t.subtitulo}</p>
        </div>
        <Link
          href={urlCruceros(idioma)}
          className="text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors"
        >
          {t.verTodos} →
        </Link>
      </div>
      <ul className="flex flex-wrap gap-2">
        {puertos.map((p) => (
          <li key={p.guia.url}>
            <Link
              href={p.guia.url}
              className="inline-flex items-center bg-white border border-piedra-200 hover:border-anil-400 text-piedra-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
            >
              {p.puerto}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
