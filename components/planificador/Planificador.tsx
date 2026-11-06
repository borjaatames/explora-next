"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";
import {
  ACOMPANANTES,
  INTERESES,
  PRESUPUESTOS,
  recomendar,
  urlDatosPlanificador,
  type Acompanantes,
  type ActividadPlanificador,
  type Interes,
  type Presupuesto,
} from "@/lib/planificador";

export type CiudadOpcion = {
  slug: string;
  nombre: string;
  total: number;
  urlActividades: string;
  urlGuias: string;
};

type Textos = {
  pasoCiudad: string;
  elegirCiudad: string;
  pasoAcompanantes: string;
  pasoPresupuesto: string;
  pasoIntereses: string;
  interesesAyuda: string;
  acompanantes: Record<Acompanantes, string>;
  presupuestos: Record<Presupuesto, string>;
  intereses: Record<Interes, string>;
  cargando: string;
  error: string;
  resultadoTitulo: string;
  resultadoIntro: string;
  sinResultados: string;
  verTodas: string;
  verGuias: string;
  desde: string;
  verActividad: string;
  cancelacionGratuita: string;
  actividades: string;
};

const TEXTOS: Record<Idioma, Textos> = {
  es: {
    pasoCiudad: "¿A qué ciudad vas?",
    elegirCiudad: "Elige una ciudad",
    pasoAcompanantes: "¿Con quién viajas?",
    pasoPresupuesto: "Presupuesto por persona y actividad",
    pasoIntereses: "¿Qué os apetece?",
    interesesAyuda: "Marca todo lo que quieras. Si no marcas nada, te proponemos lo mejor valorado.",
    acompanantes: { pareja: "En pareja", familia: "En familia con niños", amigos: "Con amigos", grupo: "Grupo de 6 o más" },
    presupuestos: { "30": "Hasta 30 €", "60": "Hasta 60 €", "120": "Hasta 120 €", sinLimite: "Sin límite" },
    intereses: {
      monumentos: "Monumentos y visitas",
      gastronomia: "Comer y beber",
      noche: "Flamenco y noche",
      naturaleza: "Naturaleza y agua",
      excursiones: "Excursiones de un día",
      ninos: "Planes para niños",
    },
    cargando: "Preparando tu plan…",
    error: "No hemos podido cargar las actividades. Vuelve a intentarlo en un momento.",
    resultadoTitulo: "Tu plan en {ciudad}",
    resultadoIntro: "{n} actividades que encajan con lo que buscas, de entre las {total} que tenemos en {ciudad}. Los precios son por persona; en los privados, lo que sale por persona en un grupo de 4.",
    sinResultados: "No hay actividades con esos filtros. Prueba a subir el presupuesto o a marcar otros intereses.",
    verTodas: "Ver las {total} actividades de {ciudad}",
    verGuias: "Guías de {ciudad}",
    desde: "Desde",
    verActividad: "Ver actividad",
    cancelacionGratuita: "Cancelación gratis",
    actividades: "actividades",
  },
  en: {
    pasoCiudad: "Which city are you visiting?",
    elegirCiudad: "Choose a city",
    pasoAcompanantes: "Who are you travelling with?",
    pasoPresupuesto: "Budget per person, per activity",
    pasoIntereses: "What are you in the mood for?",
    interesesAyuda: "Tick as many as you like. If you tick none, we suggest the best-rated activities.",
    acompanantes: { pareja: "As a couple", familia: "Family with kids", amigos: "With friends", grupo: "Group of 6 or more" },
    presupuestos: { "30": "Up to €30", "60": "Up to €60", "120": "Up to €120", sinLimite: "No limit" },
    intereses: {
      monumentos: "Sights and tours",
      gastronomia: "Food and drink",
      noche: "Flamenco and nightlife",
      naturaleza: "Nature and water",
      excursiones: "Day trips",
      ninos: "Kids' activities",
    },
    cargando: "Putting your plan together…",
    error: "We couldn't load the activities. Please try again in a moment.",
    resultadoTitulo: "Your plan for {ciudad}",
    resultadoIntro: "{n} activities that match what you're after, out of the {total} we have in {ciudad}. Prices are per person; for private tours, the price per person in a group of 4.",
    sinResultados: "Nothing matches those filters. Try a higher budget or other interests.",
    verTodas: "See all {total} activities in {ciudad}",
    verGuias: "{ciudad} travel guides",
    desde: "From",
    verActividad: "View activity",
    cancelacionGratuita: "Free cancellation",
    actividades: "activities",
  },
  de: {
    pasoCiudad: "Welche Stadt besuchst du?",
    elegirCiudad: "Stadt wählen",
    pasoAcompanantes: "Mit wem reist du?",
    pasoPresupuesto: "Budget pro Person und Aktivität",
    pasoIntereses: "Worauf habt ihr Lust?",
    interesesAyuda: "Wähle so viel du willst. Wenn du nichts wählst, schlagen wir die bestbewerteten Aktivitäten vor.",
    acompanantes: { pareja: "Zu zweit", familia: "Familie mit Kindern", amigos: "Mit Freunden", grupo: "Gruppe ab 6 Personen" },
    presupuestos: { "30": "Bis 30 €", "60": "Bis 60 €", "120": "Bis 120 €", sinLimite: "Ohne Limit" },
    intereses: {
      monumentos: "Sehenswürdigkeiten und Führungen",
      gastronomia: "Essen und Trinken",
      noche: "Flamenco und Nachtleben",
      naturaleza: "Natur und Wasser",
      excursiones: "Tagesausflüge",
      ninos: "Aktivitäten für Kinder",
    },
    cargando: "Wir stellen deinen Plan zusammen…",
    error: "Die Aktivitäten konnten nicht geladen werden. Bitte versuch es gleich noch einmal.",
    resultadoTitulo: "Dein Plan für {ciudad}",
    resultadoIntro: "{n} Aktivitäten, die zu deinen Wünschen passen, von {total} in {ciudad}. Preise pro Person; bei Privattouren der Preis pro Person bei 4 Personen.",
    sinResultados: "Mit diesen Filtern gibt es keine Aktivitäten. Erhöhe das Budget oder wähle andere Interessen.",
    verTodas: "Alle {total} Aktivitäten in {ciudad} ansehen",
    verGuias: "Reiseführer für {ciudad}",
    desde: "Ab",
    verActividad: "Aktivität ansehen",
    cancelacionGratuita: "Kostenlose Stornierung",
    actividades: "Aktivitäten",
  },
  fr: {
    pasoCiudad: "Quelle ville visitez-vous ?",
    elegirCiudad: "Choisissez une ville",
    pasoAcompanantes: "Avec qui voyagez-vous ?",
    pasoPresupuesto: "Budget par personne et par activité",
    pasoIntereses: "De quoi avez-vous envie ?",
    interesesAyuda: "Cochez tout ce qui vous tente. Si vous ne cochez rien, nous proposons les activités les mieux notées.",
    acompanantes: { pareja: "En couple", familia: "En famille avec enfants", amigos: "Entre amis", grupo: "Groupe de 6 ou plus" },
    presupuestos: { "30": "Jusqu’à 30 €", "60": "Jusqu’à 60 €", "120": "Jusqu’à 120 €", sinLimite: "Sans limite" },
    intereses: {
      monumentos: "Monuments et visites",
      gastronomia: "Manger et boire",
      noche: "Flamenco et soirées",
      naturaleza: "Nature et eau",
      excursiones: "Excursions d’une journée",
      ninos: "Activités pour enfants",
    },
    cargando: "Nous préparons votre programme…",
    error: "Impossible de charger les activités. Réessayez dans un instant.",
    resultadoTitulo: "Votre programme à {ciudad}",
    resultadoIntro: "{n} activités qui correspondent à vos envies, parmi les {total} que nous proposons à {ciudad}. Prix par personne ; pour les visites privées, le prix par personne pour un groupe de 4.",
    sinResultados: "Aucune activité avec ces filtres. Augmentez le budget ou cochez d’autres envies.",
    verTodas: "Voir les {total} activités à {ciudad}",
    verGuias: "Guides de {ciudad}",
    desde: "À partir de",
    verActividad: "Voir l’activité",
    cancelacionGratuita: "Annulation gratuite",
    actividades: "activités",
  },
  it: {
    pasoCiudad: "Quale città visiti?",
    elegirCiudad: "Scegli una città",
    pasoAcompanantes: "Con chi viaggi?",
    pasoPresupuesto: "Budget a persona per attività",
    pasoIntereses: "Cosa vi va di fare?",
    interesesAyuda: "Seleziona tutto ciò che vuoi. Se non selezioni nulla, ti proponiamo le attività con il voto migliore.",
    acompanantes: { pareja: "In coppia", familia: "In famiglia con bambini", amigos: "Con amici", grupo: "Gruppo di 6 o più" },
    presupuestos: { "30": "Fino a 30 €", "60": "Fino a 60 €", "120": "Fino a 120 €", sinLimite: "Senza limite" },
    intereses: {
      monumentos: "Monumenti e visite",
      gastronomia: "Mangiare e bere",
      noche: "Flamenco e vita notturna",
      naturaleza: "Natura e acqua",
      excursiones: "Escursioni di un giorno",
      ninos: "Attività per bambini",
    },
    cargando: "Stiamo preparando il tuo piano…",
    error: "Non è stato possibile caricare le attività. Riprova tra un momento.",
    resultadoTitulo: "Il tuo piano a {ciudad}",
    resultadoIntro: "{n} attività in linea con ciò che cerchi, tra le {total} che abbiamo a {ciudad}. Prezzi a persona; per i tour privati, il prezzo a persona per un gruppo di 4.",
    sinResultados: "Nessuna attività con questi filtri. Prova ad aumentare il budget o a scegliere altri interessi.",
    verTodas: "Vedi tutte le {total} attività a {ciudad}",
    verGuias: "Guide di {ciudad}",
    desde: "Da",
    verActividad: "Vedi attività",
    cancelacionGratuita: "Cancellazione gratuita",
    actividades: "attività",
  },
  pt: {
    pasoCiudad: "Que cidade vai visitar?",
    elegirCiudad: "Escolha uma cidade",
    pasoAcompanantes: "Com quem viaja?",
    pasoPresupuesto: "Orçamento por pessoa e atividade",
    pasoIntereses: "O que lhes apetece?",
    interesesAyuda: "Marque tudo o que quiser. Se não marcar nada, propomos as atividades mais bem avaliadas.",
    acompanantes: { pareja: "Em casal", familia: "Em família com crianças", amigos: "Com amigos", grupo: "Grupo de 6 ou mais" },
    presupuestos: { "30": "Até 30 €", "60": "Até 60 €", "120": "Até 120 €", sinLimite: "Sem limite" },
    intereses: {
      monumentos: "Monumentos e visitas",
      gastronomia: "Comer e beber",
      noche: "Flamenco e noite",
      naturaleza: "Natureza e água",
      excursiones: "Excursões de um dia",
      ninos: "Atividades para crianças",
    },
    cargando: "A preparar o seu plano…",
    error: "Não foi possível carregar as atividades. Tente novamente daqui a pouco.",
    resultadoTitulo: "O seu plano em {ciudad}",
    resultadoIntro: "{n} atividades que correspondem ao que procura, entre as {total} que temos em {ciudad}. Preços por pessoa; nas visitas privadas, o preço por pessoa num grupo de 4.",
    sinResultados: "Não há atividades com esses filtros. Experimente aumentar o orçamento ou escolher outros interesses.",
    verTodas: "Ver as {total} atividades em {ciudad}",
    verGuias: "Guias de {ciudad}",
    desde: "Desde",
    verActividad: "Ver atividade",
    cancelacionGratuita: "Cancelamento gratuito",
    actividades: "atividades",
  },
};

const LOCALES: Record<Idioma, string> = {
  es: "es-ES",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
};

function rellenar(plantilla: string, valores: Record<string, string | number>): string {
  return plantilla.replace(/\{(\w+)\}/g, (_, k: string) => String(valores[k] ?? ""));
}

const CLASE_CHIP =
  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2";
const CHIP_ACTIVO = "border-anil-600 bg-anil-600 text-white";
const CHIP_INACTIVO = "border-piedra-300 bg-white text-piedra-900 hover:border-anil-400";

const ACOMPANANTES_VALIDOS: ReadonlyArray<Acompanantes> = ["pareja", "familia", "amigos", "grupo"];

type Estado = "inicio" | "cargando" | "listo" | "error";

export default function Planificador({
  idioma,
  ciudades,
  ciudadInicial,
}: {
  idioma: Idioma;
  ciudades: ReadonlyArray<CiudadOpcion>;
  ciudadInicial?: string;
}) {
  const t = TEXTOS[idioma];
  const locale = LOCALES[idioma];
  const [ciudad, setCiudad] = useState<string>(ciudadInicial ?? "");
  const [acompanantes, setAcompanantes] = useState<Acompanantes>("pareja");
  const [presupuesto, setPresupuesto] = useState<Presupuesto>("sinLimite");
  const [intereses, setIntereses] = useState<Interes[]>([]);
  const [estado, setEstado] = useState<Estado>("inicio");
  const [actividades, setActividades] = useState<ActividadPlanificador[]>([]);
  const cache = useRef(new Map<string, ActividadPlanificador[]>());

  // Ciudad preseleccionable por URL (?ciudad=sevilla o ?city=seville-slug).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    // «Con quién» preseleccionable (?con=familia / ?with=familia) desde la portada.
    const con = p.get("con") ?? p.get("with");
    if (con && (ACOMPANANTES_VALIDOS as ReadonlyArray<string>).includes(con)) {
      setAcompanantes(con as Acompanantes);
    }
    if (ciudadInicial) return;
    const desdeUrl = p.get("ciudad") ?? p.get("city");
    if (desdeUrl && ciudades.some((c) => c.slug === desdeUrl)) setCiudad(desdeUrl);
  }, [ciudadInicial, ciudades]);

  useEffect(() => {
    if (!ciudad) return;
    const guardadas = cache.current.get(ciudad);
    if (guardadas) {
      setActividades(guardadas);
      setEstado("listo");
      return;
    }
    let cancelado = false;
    setEstado("cargando");
    fetch(urlDatosPlanificador(idioma, ciudad))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<{ actividades: ActividadPlanificador[] }>;
      })
      .then((datos) => {
        if (cancelado) return;
        cache.current.set(ciudad, datos.actividades);
        setActividades(datos.actividades);
        setEstado("listo");
      })
      .catch(() => {
        if (!cancelado) setEstado("error");
      });
    return () => {
      cancelado = true;
    };
  }, [ciudad, idioma]);

  const propuesta = useMemo(
    () => (estado === "listo" ? recomendar(actividades, { acompanantes, presupuesto, intereses }) : []),
    [estado, actividades, acompanantes, presupuesto, intereses]
  );

  const ciudadActual = ciudades.find((c) => c.slug === ciudad);

  function alternarInteres(i: Interes) {
    setIntereses((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  return (
    <div className="space-y-10">
      <div className="space-y-8 rounded-xl border border-piedra-200 bg-white p-5 md:p-8">
        <fieldset>
          <legend className="mb-3 font-fraunces text-xl font-bold text-piedra-900">1. {t.pasoCiudad}</legend>
          <label htmlFor="planificador-ciudad" className="sr-only">
            {t.elegirCiudad}
          </label>
          <select
            id="planificador-ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full rounded-lg border border-piedra-300 bg-white px-4 py-3 text-base text-piedra-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 md:w-96"
          >
            <option value="">{t.elegirCiudad}</option>
            {ciudades.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre} ({c.total} {t.actividades})
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-fraunces text-xl font-bold text-piedra-900">2. {t.pasoAcompanantes}</legend>
          <div className="flex flex-wrap gap-2">
            {ACOMPANANTES.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={acompanantes === a}
                onClick={() => setAcompanantes(a)}
                className={`${CLASE_CHIP} ${acompanantes === a ? CHIP_ACTIVO : CHIP_INACTIVO}`}
              >
                {t.acompanantes[a]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-fraunces text-xl font-bold text-piedra-900">3. {t.pasoPresupuesto}</legend>
          <div className="flex flex-wrap gap-2">
            {PRESUPUESTOS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={presupuesto === p}
                onClick={() => setPresupuesto(p)}
                className={`${CLASE_CHIP} ${presupuesto === p ? CHIP_ACTIVO : CHIP_INACTIVO}`}
              >
                {t.presupuestos[p]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1 font-fraunces text-xl font-bold text-piedra-900">4. {t.pasoIntereses}</legend>
          <p className="mb-3 text-sm text-piedra-600">{t.interesesAyuda}</p>
          <div className="flex flex-wrap gap-2">
            {INTERESES.map((i) => (
              <button
                key={i}
                type="button"
                aria-pressed={intereses.includes(i)}
                onClick={() => alternarInteres(i)}
                className={`${CLASE_CHIP} ${intereses.includes(i) ? CHIP_ACTIVO : CHIP_INACTIVO}`}
              >
                {t.intereses[i]}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <section aria-live="polite" aria-busy={estado === "cargando"}>
        {estado === "cargando" && <p className="text-piedra-600">{t.cargando}</p>}
        {estado === "error" && <p className="text-piedra-900">{t.error}</p>}
        {estado === "listo" && ciudadActual && (
          <>
            <h2 className="mb-2 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">
              {rellenar(t.resultadoTitulo, { ciudad: ciudadActual.nombre })}
            </h2>
            {propuesta.length > 0 ? (
              <>
                <p className="mb-6 text-piedra-600">
                  {rellenar(t.resultadoIntro, {
                    n: propuesta.length,
                    total: ciudadActual.total,
                    ciudad: ciudadActual.nombre,
                  })}
                </p>
                <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {propuesta.map((a) => (
                    <CardActividad
                      key={a.slug}
                      actividad={a}
                      locale={locale}
                      strings={{ desde: t.desde, verActividad: t.verActividad, cancelacionGratuita: t.cancelacionGratuita }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-piedra-600">{t.sinResultados}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href={ciudadActual.urlActividades}
                prefetch={false}
                className="inline-flex items-center font-semibold text-anil-600 transition-colors hover:text-anil-700"
              >
                {rellenar(t.verTodas, { total: ciudadActual.total, ciudad: ciudadActual.nombre })} →
              </Link>
              <Link
                href={ciudadActual.urlGuias}
                prefetch={false}
                className="inline-flex items-center font-semibold text-anil-600 transition-colors hover:text-anil-700"
              >
                {rellenar(t.verGuias, { ciudad: ciudadActual.nombre })} →
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
