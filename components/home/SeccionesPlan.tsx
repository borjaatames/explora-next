import Link from "next/link";
import Image from "next/image";
import type { Idioma } from "@/lib/i18n/types";
import type { GuiaListItem } from "@/lib/guias";
import {
  CIUDADES_NAVIDAD,
  diasDeRuta,
  enTemporadaNavidad,
  guiaPorSlugEs,
  guiasDePuertos,
  guiasDeTipo,
  guiasDeTipoEnIdioma,
  nombresCiudades,
  slugTipoGuia,
  urlCruceros,
  idiomaConCruceros,
  type TipoGuiaPlan,
} from "@/lib/descubrir";
import { urlPlanificador } from "@/lib/planificador";
import { urlIndiceGuias } from "@/lib/i18n/utils";

type IdiomaPlan = "es" | "en";

/** ES y EN tienen planificador, índice de cruceros y la selección manual de rutas. */
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
  de: {
    etiqueta: "Saison",
    titulo: "Weihnachten 2026 in Spanien",
    texto: "Lichter, Weihnachtsmärkte, Silvester und Heilige Drei Könige: Termine und Pläne für jede Stadt.",
  },
  fr: {
    etiqueta: "Saison",
    titulo: "Noël 2026 en Espagne",
    texto: "Illuminations, marchés de Noël, Saint-Sylvestre et fête des Rois : dates et idées ville par ville.",
  },
  it: {
    etiqueta: "Stagione",
    titulo: "Natale 2026 in Spagna",
    texto: "Luminarie, mercatini, Capodanno e Re Magi: date e programmi città per città.",
  },
  pt: {
    etiqueta: "Época festiva",
    titulo: "Natal 2026 em Espanha",
    texto: "Iluminações, mercados de Natal, passagem de ano e Dia de Reis: datas e planos cidade a cidade.",
  },
} as const satisfies Record<Idioma, unknown>;

export function FranjaNavidad({ idioma }: { idioma: Idioma }) {
  if (!enTemporadaNavidad()) return null;
  const nombres = nombresCiudades(idioma);
  const guias = CIUDADES_NAVIDAD.flatMap((c) => {
    const g = guiasDeTipo(idioma, c, "navidad")[0];
    return g ? [{ ciudad: c, guia: g }] : [];
  });
  // Fuera de ES/EN hay menos guías traducidas: basta con dos ciudades.
  if (guias.length < (idiomaPlan(idioma) ? 3 : 2)) return null;
  const t = T_NAVIDAD[idioma];

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
  titulo: Record<Idioma, string>;
  texto: Record<Idioma, string>;
};

const PERFILES: ReadonlyArray<Perfil> = [
  {
    con: "pareja",
    tipo: "ocasion",
    filtro: /pareja|romantic/,
    titulo: { es: "En pareja", en: "As a couple", de: "Zu zweit", fr: "En couple", it: "In coppia", pt: "A dois" },
    texto: {
      es: "Atardeceres, cenas con espectáculo y planes para dos con precio.",
      en: "Sunsets, dinner shows and plans for two, with prices.",
      de: "Sonnenuntergänge, Dinner-Shows und Pläne zu zweit, mit Preisen.",
      fr: "Couchers de soleil, dîners-spectacles et idées pour deux, avec les prix.",
      it: "Tramonti, cene con spettacolo e idee per due, con i prezzi.",
      pt: "Pores do sol, jantares com espetáculo e planos a dois, com preços.",
    },
  },
  {
    con: "familia",
    tipo: "familia",
    filtro: /./,
    titulo: { es: "En familia", en: "With kids", de: "Mit Kindern", fr: "En famille", it: "In famiglia", pt: "Em família" },
    texto: {
      es: "Lo que gusta a los niños, edades mínimas y cómo no agotarlos.",
      en: "What kids enjoy, minimum ages and how not to wear them out.",
      de: "Was Kindern gefällt, Mindestalter und wie man sie nicht überfordert.",
      fr: "Ce qui plaît aux enfants, âges minimum et comment ne pas les épuiser.",
      it: "Cosa piace ai bambini, età minime e come non stancarli troppo.",
      pt: "O que as crianças gostam, idades mínimas e como não as cansar.",
    },
  },
  {
    con: "amigos",
    tipo: "ocasion",
    filtro: /despedida|hen-and-stag/,
    titulo: {
      es: "Amigos y despedidas",
      en: "Friends, hen and stag",
      de: "Freunde und Junggesellenabschiede",
      fr: "Entre amis, EVJF et EVG",
      it: "Amici e addii al celibato",
      pt: "Amigos e despedidas de solteiro",
    },
    texto: {
      es: "Planes de día y de noche para grupos, con las normas de cada ciudad.",
      en: "Day and night plans for groups, with each city's rules.",
      de: "Pläne für Gruppen bei Tag und Nacht, mit den Regeln jeder Stadt.",
      fr: "Idées de jour comme de nuit pour les groupes, avec les règles de chaque ville.",
      it: "Programmi di giorno e di sera per gruppi, con le regole di ogni città.",
      pt: "Planos de dia e de noite para grupos, com as regras de cada cidade.",
    },
  },
  {
    con: "grupo",
    tipo: "ocasion",
    filtro: /empresas|team/,
    titulo: {
      es: "Grupos y empresas",
      en: "Groups and teams",
      de: "Gruppen und Firmen",
      fr: "Groupes et entreprises",
      it: "Gruppi e aziende",
      pt: "Grupos e empresas",
    },
    texto: {
      es: "Actividades privadas con precio por grupo y factura.",
      en: "Private activities priced per group, with an invoice.",
      de: "Private Aktivitäten mit Preis pro Gruppe und Rechnung.",
      fr: "Activités privées avec prix par groupe et facture.",
      it: "Attività private con prezzo per gruppo e fattura.",
      pt: "Atividades privadas com preço por grupo e fatura.",
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
  de: {
    titulo: "Mit wem reist du?",
    subtitulo: "Reiseführer für jede Art von Reise, oder lass dir vom Reiseplaner Aktivitäten vorschlagen.",
    planificador: "Aktivitäten vorschlagen",
  },
  fr: {
    titulo: "Avec qui voyagez-vous ?",
    subtitulo: "Des guides pensés pour chaque type de voyage, ou laissez le planificateur vous proposer des activités.",
    planificador: "Proposez-moi des activités",
  },
  it: {
    titulo: "Con chi viaggi?",
    subtitulo: "Guide pensate per ogni tipo di viaggio, oppure lascia che il pianificatore ti proponga delle attività.",
    planificador: "Proponimi delle attività",
  },
  pt: {
    titulo: "Com quem viaja?",
    subtitulo: "Guias pensados para cada tipo de viagem, ou deixe o planeador propor-lhe atividades.",
    planificador: "Proponham-me atividades",
  },
} as const satisfies Record<Idioma, { titulo: string; subtitulo: string; planificador: string | null }>;

function prioridadCiudad(ciudad: string): number {
  const i = (CIUDADES_PERFIL as readonly string[]).indexOf(ciudad);
  return i === -1 ? CIUDADES_PERFIL.length : i;
}

type GuiaDePerfil = { ciudad: string; guia: GuiaListItem };

/** Hasta 3 guías del perfil, una por ciudad; fuera de ES/EN, de cualquier ciudad. */
function guiasDePerfil(idioma: Idioma, p: Perfil): GuiaDePerfil[] {
  if (idiomaPlan(idioma)) {
    return CIUDADES_PERFIL.flatMap((c) => {
      const g = guiasDeTipo(idioma, c, p.tipo).find((x) => p.filtro.test(x.slug));
      return g ? [{ ciudad: c, guia: g }] : [];
    }).slice(0, 3);
  }
  const vistas = new Set<string>();
  return guiasDeTipoEnIdioma(idioma, p.tipo)
    .filter((g) => p.filtro.test(slugTipoGuia(g)))
    .sort((a, b) => prioridadCiudad(a.categoria) - prioridadCiudad(b.categoria))
    .flatMap((g) => {
      if (vistas.has(g.categoria)) return [];
      vistas.add(g.categoria);
      return [{ ciudad: g.categoria, guia: g }];
    })
    .slice(0, 3);
}

export function ConQuienViajas({ idioma }: { idioma: Idioma }) {
  const t = T_CON_QUIEN[idioma];
  const nombres = nombresCiudades(idioma);
  const planificador = urlPlanificador(idioma);

  const todos = PERFILES.map((p) => ({ ...p, guias: guiasDePerfil(idioma, p) }));
  // Se pintan los cuatro perfiles en todos los idiomas: el planificador cubre
  // los que no tienen guía.
  const perfiles = todos;

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
            <h3 className="font-fraunces text-xl font-bold text-piedra-900 mb-2">{p.titulo[idioma]}</h3>
            <p className="text-piedra-600 text-sm leading-relaxed mb-4">{p.texto[idioma]}</p>
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
            {planificador && t.planificador ? (
              <Link
                href={`${planificador}?con=${p.con}`}
                prefetch={false}
                className="mt-auto inline-flex items-center justify-center bg-white border border-piedra-300 hover:border-anil-400 text-piedra-900 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
              >
                {t.planificador}
              </Link>
            ) : null}
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
  de: {
    titulo: "Routen nach Tagen",
    subtitulo: "Reisepläne Tag für Tag, mit Zügen, Eintrittskarten und dem, was man vorab buchen sollte.",
    destacada: "Top-Route",
    dias: (n: number) => (n === 1 ? "1 Tag" : `${n} Tage`),
    verTodas: "Alle Reiseführer ansehen",
    url: urlIndiceGuias("de"),
  },
  fr: {
    titulo: "Itinéraires par jours",
    subtitulo: "Des programmes jour par jour, avec trains, billets et ce qu’il vaut mieux réserver à l’avance.",
    destacada: "Itinéraire phare",
    dias: (n: number) => (n === 1 ? "1 jour" : `${n} jours`),
    verTodas: "Voir tous les guides",
    url: urlIndiceGuias("fr"),
  },
  it: {
    titulo: "Itinerari per giorni",
    subtitulo: "Programmi giorno per giorno, con treni, biglietti e cosa conviene prenotare prima.",
    destacada: "Itinerario top",
    dias: (n: number) => (n === 1 ? "1 giorno" : `${n} giorni`),
    verTodas: "Vedi tutte le guide",
    url: urlIndiceGuias("it"),
  },
  pt: {
    titulo: "Roteiros por dias",
    subtitulo: "Planos dia a dia, com comboios, bilhetes e o que convém reservar antes.",
    destacada: "Roteiro em destaque",
    dias: (n: number) => (n === 1 ? "1 dia" : `${n} dias`),
    verTodas: "Ver todos os guias",
    url: urlIndiceGuias("pt"),
  },
} as const satisfies Record<Idioma, unknown>;

type Ruta = { guia: GuiaListItem; dias: number };

/**
 * Rutas fuera de ES/EN: todas las guías-itinerario del idioma, de más a menos
 * días y por ciudad principal, primero una por ciudad. La destacada es
 * Andalucía en 7 días si está traducida; si no, la primera.
 */
function rutasOtroIdioma(idioma: Idioma): { destacada: Ruta | null; rutas: Ruta[] } {
  const todas = guiasDeTipoEnIdioma(idioma, "itinerario")
    .flatMap((g) => {
      const dias = diasDeRuta(g);
      return dias ? [{ guia: g, dias }] : [];
    })
    .sort(
      (a, b) =>
        b.dias - a.dias ||
        prioridadCiudad(a.guia.categoria) - prioridadCiudad(b.guia.categoria) ||
        a.guia.titulo.localeCompare(b.guia.titulo)
    );
  const ciudades = new Set<string>();
  const primeras: Ruta[] = [];
  const resto: Ruta[] = [];
  for (const r of todas) {
    if (ciudades.has(r.guia.categoria)) resto.push(r);
    else {
      ciudades.add(r.guia.categoria);
      primeras.push(r);
    }
  }
  const ordenadas = [...primeras, ...resto];
  const andalucia = ordenadas.find((r) => r.guia.slugs?.es === RUTA_DESTACADA.slugEs) ?? null;
  const destacada = andalucia ?? ordenadas[0] ?? null;
  return {
    destacada,
    rutas: ordenadas.filter((r) => r !== destacada).slice(0, RUTAS.length),
  };
}

export function RutasPorDias({ idioma }: { idioma: Idioma }) {
  const l = idiomaPlan(idioma);
  const t = T_RUTAS[idioma];
  let destacada: GuiaListItem | null;
  let diasDestacada: number;
  let rutas: Ruta[];
  if (l) {
    destacada = guiaPorSlugEs(idioma, RUTA_DESTACADA.ciudad, RUTA_DESTACADA.slugEs);
    diasDestacada = 7;
    rutas = RUTAS.flatMap((r) => {
      const g = guiaPorSlugEs(idioma, r.ciudad, r.slugEs);
      return g ? [{ dias: r.dias, guia: g }] : [];
    });
    if (!destacada && rutas.length < 3) return null;
  } else {
    const otro = rutasOtroIdioma(idioma);
    if (!otro.destacada || otro.rutas.length + 1 < 3) return null;
    destacada = otro.destacada.guia;
    diasDestacada = otro.destacada.dias;
    rutas = otro.rutas;
  }

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
                  {t.destacada} · {t.dias(diasDestacada)}
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
  de: {
    titulo: "Kommst du mit dem Kreuzfahrtschiff?",
    subtitulo: "Was du beim Landgang sehen kannst, wie du vom Kai ins Zentrum kommst und Ausflüge mit Abholung am Hafen.",
    verTodos: "Kreuzfahrt-Guide nach Häfen",
  },
  fr: {
    titulo: "Vous arrivez en croisière ?",
    subtitulo: "Que voir pendant l’escale, comment aller du quai au centre-ville et excursions avec prise en charge au port.",
    verTodos: "Guide des croisières par port",
  },
  it: {
    titulo: "Arrivi in crociera?",
    subtitulo: "Cosa vedere durante lo scalo, come andare dal molo al centro ed escursioni con prelievo al porto.",
    verTodos: "Guida alle crociere per porto",
  },
  pt: {
    titulo: "Chega de cruzeiro?",
    subtitulo: "O que ver durante a escala, como ir do cais ao centro e excursões com recolha no porto.",
    verTodos: "Guia de cruzeiros por porto",
  },
} as const satisfies Record<Idioma, { titulo: string; subtitulo: string; verTodos: string | null }>;

export function FranjaCruceros({ idioma }: { idioma: Idioma }) {
  const l = idiomaPlan(idioma);
  const puertos = guiasDePuertos(idioma);
  if (puertos.length < (l ? 4 : 2)) return null;
  const t = T_CRUCEROS[idioma];

  return (
    <section aria-labelledby="cruceros-home" className="max-w-6xl mx-auto px-4 py-14 md:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          <h2 id="cruceros-home" className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-2">
            {t.titulo}
          </h2>
          <p className="text-piedra-600">{t.subtitulo}</p>
        </div>
        {idiomaConCruceros(idioma) && t.verTodos ? (
          <Link
            href={urlCruceros(idioma)}
            className="text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors"
          >
            {t.verTodos} →
          </Link>
        ) : null}
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
