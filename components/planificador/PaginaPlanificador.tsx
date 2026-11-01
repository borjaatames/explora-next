import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";
import type { PreguntaFrecuente } from "@/lib/actividades";
import FaqActividad from "@/components/FaqActividad";
import Planificador, { type CiudadOpcion } from "@/components/planificador/Planificador";
import { obtenerCiudadesPlanificador } from "@/lib/planificadorDatos";
import { urlActividadesDeCiudad, urlGuiasDeCiudad } from "@/lib/i18n/utils";
import { urlPlanificador } from "@/lib/planificador";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

export const TEXTOS_PLANIFICADOR = {
  es: {
    titulo: "¿Qué hacer en tu viaje? Planificador de actividades",
    metaTitulo: "Planificador: qué hacer en tu viaje por España",
    intro:
      "Dinos a qué ciudad vas, con quién y cuánto quieres gastar, y te proponemos las actividades que mejor encajan entre las que vendemos. Sin registro y en 30 segundos.",
    migas: [{ label: "Inicio", href: "/" }, { label: "Planificador" }],
    migasAria: "Migas de pan",
    comoFunciona: "¿Cómo elegimos las propuestas?",
    comoFuncionaTexto: [
      "Partimos de todas las actividades publicadas en la ciudad, con su precio real. Si es un privado que se paga por grupo, usamos lo que sale por persona en un grupo de 4.",
      "Quitamos las que superan tu presupuesto y, si viajas con niños, las de alcohol, ocio nocturno o con edad mínima de 12 años o más.",
      "Ordenamos por lo que encaja con tus intereses, por la nota y el número de opiniones y, en grupos grandes, damos prioridad a los privados, que salen a mejor precio por persona. Como mucho tres de cada tipo, para que el plan sea variado.",
    ],
    faq: [
      {
        pregunta: "¿El planificador es gratis?",
        respuesta:
          "Sí. Es gratis y no hace falta registrarse. Solo pagas la actividad que reserves, al mismo precio que en la ficha.",
      },
      {
        pregunta: "¿Los precios son por persona?",
        respuesta:
          "Sí. En las visitas en grupo es el precio por persona. En los privados que se pagan por grupo mostramos lo que sale por persona si sois 4; en la ficha está la tabla completa según cuántos seáis.",
      },
      {
        pregunta: "¿Qué pasa si viajo con niños?",
        respuesta:
          "Al marcar «En familia con niños» no te proponemos catas, rutas de bares, ocio nocturno ni actividades con edad mínima de 12 años o más, y damos más peso a parques, barcos y visitas aptas para todos.",
      },
      {
        pregunta: "¿Puedo reservar varias actividades a la vez?",
        respuesta:
          "Cada actividad se reserva en su ficha, con su calendario. Si quieres montar un viaje de varios días, escríbenos por WhatsApp y te ayudamos a cuadrar horarios.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  en: {
    titulo: "What to do on your trip: activity planner",
    metaTitulo: "Trip planner: what to do in Spain",
    intro:
      "Tell us which city you're visiting, who you're with and how much you want to spend, and we'll suggest the activities that fit best from the ones we sell. No sign-up, and it takes 30 seconds.",
    migas: [{ label: "Home", href: "/en" }, { label: "Trip planner" }],
    migasAria: "Breadcrumb",
    comoFunciona: "How do we pick the suggestions?",
    comoFuncionaTexto: [
      "We start from every activity published for the city, with its real price. For private tours priced per group, we use the price per person in a group of 4.",
      "We drop anything over your budget and, if you're travelling with kids, anything involving alcohol, nightlife or a minimum age of 12 or more.",
      "We rank by how well each one matches your interests, its rating and number of reviews, and for large groups we favour private tours, which work out cheaper per person. At most three of each type, so the plan has some variety.",
    ],
    faq: [
      {
        pregunta: "Is the planner free?",
        respuesta:
          "Yes. It's free and you don't need to sign up. You only pay for the activity you book, at the same price shown on its page.",
      },
      {
        pregunta: "Are the prices per person?",
        respuesta:
          "Yes. Group tours show the price per person. For private tours priced per group, we show the price per person if there are 4 of you; the activity page has the full table by group size.",
      },
      {
        pregunta: "What if I'm travelling with children?",
        respuesta:
          "If you choose 'Family with kids', we leave out tastings, bar crawls, nightlife and anything with a minimum age of 12 or more, and give more weight to parks, boat trips and family-friendly tours.",
      },
      {
        pregunta: "Can I book several activities at once?",
        respuesta:
          "Each activity is booked on its own page, with its own calendar. If you're planning a trip of several days, message us on WhatsApp and we'll help you fit the timings together.",
      },
    ] satisfies PreguntaFrecuente[],
  },
} as const;

export function ciudadesParaPlanificador(idioma: Idioma): CiudadOpcion[] {
  return obtenerCiudadesPlanificador(idioma).map((c) => ({
    ...c,
    urlActividades: urlActividadesDeCiudad(idioma, c.slug),
    urlGuias: urlGuiasDeCiudad(idioma, c.slug),
  }));
}

export default function PaginaPlanificador({ idioma }: { idioma: "es" | "en" }) {
  const t = TEXTOS_PLANIFICADOR[idioma];
  const ciudades = ciudadesParaPlanificador(idioma);

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: t.migas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.label,
      ...("href" in m ? { item: `${SITE_URL}${m.href}` } : { item: `${SITE_URL}${urlPlanificador(idioma)}` }),
    })),
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <header className="bg-anil-500 py-12 text-white md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <nav aria-label={t.migasAria} className="mb-4 text-sm text-anil-100">
            {t.migas.map((m, i) => (
              <span key={m.label}>
                {i > 0 ? " › " : null}
                {"href" in m ? (
                  <Link href={m.href} className="hover:text-white">
                    {m.label}
                  </Link>
                ) : (
                  <span className="text-white">{m.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mb-4 font-fraunces text-3xl font-bold leading-tight md:text-5xl">{t.titulo}</h1>
          <p className="max-w-3xl text-lg text-anil-50 md:text-xl">{t.intro}</p>
        </div>
      </header>

      <section className="bg-piedra-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <Planificador idioma={idioma} ciudades={ciudades} />
        </div>
      </section>

      <section className="border-t border-piedra-200">
        <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 md:py-16">
          <div>
            <h2 className="mb-4 font-fraunces text-xl font-bold text-piedra-900 md:text-2xl">{t.comoFunciona}</h2>
            <ol className="list-decimal space-y-3 pl-5 text-piedra-700">
              {t.comoFuncionaTexto.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </div>
          <FaqActividad idioma={idioma} preguntas={[...t.faq]} />
        </div>
      </section>
    </main>
  );
}
