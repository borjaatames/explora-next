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
  de: {
    titulo: "Was tun auf deiner Reise? Aktivitätenplaner",
    metaTitulo: "Reiseplaner: was du in Spanien unternehmen kannst",
    intro:
      "Sag uns, welche Stadt du besuchst, mit wem du reist und wie viel du ausgeben möchtest, und wir schlagen dir die passendsten Aktivitäten aus unserem Angebot vor. Ohne Anmeldung, in 30 Sekunden.",
    migas: [{ label: "Startseite", href: "/de" }, { label: "Reiseplaner" }],
    migasAria: "Brotkrumen",
    comoFunciona: "Wie wählen wir die Vorschläge aus?",
    comoFuncionaTexto: [
      "Wir gehen von allen Aktivitäten aus, die für die Stadt veröffentlicht sind, mit ihrem echten Preis. Bei Privattouren mit Gruppenpreis nehmen wir den Preis pro Person bei 4 Personen.",
      "Wir streichen alles, was über deinem Budget liegt, und – wenn du mit Kindern reist – alles mit Alkohol, Nachtleben oder einem Mindestalter ab 12 Jahren.",
      "Wir sortieren danach, wie gut sie zu deinen Interessen passen, nach Bewertung und Anzahl der Bewertungen; bei großen Gruppen bevorzugen wir Privattouren, die pro Person günstiger sind. Höchstens drei pro Art, damit der Plan abwechslungsreich ist.",
    ],
    faq: [
      {
        pregunta: "Ist der Reiseplaner kostenlos?",
        respuesta:
          "Ja. Er ist kostenlos und du musst dich nicht anmelden. Du bezahlst nur die Aktivität, die du buchst, zum selben Preis wie auf ihrer Seite.",
      },
      {
        pregunta: "Sind die Preise pro Person?",
        respuesta:
          "Ja. Bei Gruppentouren ist es der Preis pro Person. Bei Privattouren mit Gruppenpreis zeigen wir den Preis pro Person bei 4 Personen; auf der Seite der Aktivität steht die vollständige Tabelle nach Gruppengröße.",
      },
      {
        pregunta: "Was ist, wenn ich mit Kindern reise?",
        respuesta:
          "Wenn du „Familie mit Kindern“ wählst, schlagen wir keine Verkostungen, Kneipentouren, kein Nachtleben und nichts mit einem Mindestalter ab 12 Jahren vor und gewichten Parks, Bootsfahrten und familienfreundliche Touren stärker.",
      },
      {
        pregunta: "Kann ich mehrere Aktivitäten auf einmal buchen?",
        respuesta:
          "Jede Aktivität wird auf ihrer eigenen Seite mit ihrem Kalender gebucht. Wenn du eine Reise über mehrere Tage planst, schreib uns per WhatsApp und wir helfen dir, die Zeiten abzustimmen.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  fr: {
    titulo: "Que faire pendant votre voyage ? Planificateur d’activités",
    metaTitulo: "Planificateur : que faire en Espagne",
    intro:
      "Dites-nous quelle ville vous visitez, avec qui vous voyagez et combien vous voulez dépenser, et nous vous proposons les activités les plus adaptées parmi celles que nous vendons. Sans inscription, en 30 secondes.",
    migas: [{ label: "Accueil", href: "/fr" }, { label: "Planificateur" }],
    migasAria: "Fil d’Ariane",
    comoFunciona: "Comment choisissons-nous les propositions ?",
    comoFuncionaTexto: [
      "Nous partons de toutes les activités publiées pour la ville, avec leur prix réel. Pour les visites privées au prix par groupe, nous prenons le prix par personne pour un groupe de 4.",
      "Nous écartons celles qui dépassent votre budget et, si vous voyagez avec des enfants, celles avec de l’alcool, de la vie nocturne ou un âge minimum de 12 ans ou plus.",
      "Nous les classons selon leur adéquation à vos envies, leur note et leur nombre d’avis ; pour les grands groupes, nous privilégions les visites privées, plus avantageuses par personne. Trois au maximum de chaque type, pour un programme varié.",
    ],
    faq: [
      {
        pregunta: "Le planificateur est-il gratuit ?",
        respuesta:
          "Oui. Il est gratuit et sans inscription. Vous ne payez que l’activité que vous réservez, au même prix que sur sa page.",
      },
      {
        pregunta: "Les prix sont-ils par personne ?",
        respuesta:
          "Oui. Pour les visites en groupe, c’est le prix par personne. Pour les visites privées au prix par groupe, nous affichons le prix par personne si vous êtes 4 ; la page de l’activité indique le tableau complet selon le nombre de participants.",
      },
      {
        pregunta: "Et si je voyage avec des enfants ?",
        respuesta:
          "En choisissant « En famille avec enfants », nous ne proposons ni dégustations, ni tournées des bars, ni vie nocturne, ni activités avec un âge minimum de 12 ans ou plus, et nous privilégions les parcs, les sorties en bateau et les visites adaptées à tous.",
      },
      {
        pregunta: "Puis-je réserver plusieurs activités à la fois ?",
        respuesta:
          "Chaque activité se réserve sur sa propre page, avec son calendrier. Si vous préparez un voyage de plusieurs jours, écrivez-nous sur WhatsApp et nous vous aiderons à organiser les horaires.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  it: {
    titulo: "Cosa fare durante il viaggio? Pianificatore di attività",
    metaTitulo: "Pianificatore: cosa fare in Spagna",
    intro:
      "Dicci quale città visiti, con chi viaggi e quanto vuoi spendere, e ti proponiamo le attività più adatte tra quelle che vendiamo. Senza registrazione, in 30 secondi.",
    migas: [{ label: "Home", href: "/it" }, { label: "Pianificatore" }],
    migasAria: "Percorso di navigazione",
    comoFunciona: "Come scegliamo le proposte?",
    comoFuncionaTexto: [
      "Partiamo da tutte le attività pubblicate per la città, con il loro prezzo reale. Per i tour privati con prezzo a gruppo usiamo il prezzo a persona per un gruppo di 4.",
      "Escludiamo quelle che superano il tuo budget e, se viaggi con bambini, quelle con alcol, vita notturna o età minima di 12 anni o più.",
      "Le ordiniamo in base a quanto corrispondono ai tuoi interessi, al voto e al numero di recensioni; per i gruppi numerosi diamo priorità ai tour privati, più convenienti a persona. Al massimo tre per tipo, perché il piano sia vario.",
    ],
    faq: [
      {
        pregunta: "Il pianificatore è gratuito?",
        respuesta:
          "Sì. È gratuito e non serve registrarsi. Paghi solo l’attività che prenoti, allo stesso prezzo indicato nella sua pagina.",
      },
      {
        pregunta: "I prezzi sono a persona?",
        respuesta:
          "Sì. Nei tour di gruppo è il prezzo a persona. Nei tour privati con prezzo a gruppo mostriamo il prezzo a persona se siete in 4; nella pagina dell’attività c’è la tabella completa in base al numero di partecipanti.",
      },
      {
        pregunta: "E se viaggio con bambini?",
        respuesta:
          "Scegliendo «In famiglia con bambini» non ti proponiamo degustazioni, giri dei bar, vita notturna né attività con età minima di 12 anni o più, e diamo più peso a parchi, gite in barca e visite adatte a tutti.",
      },
      {
        pregunta: "Posso prenotare più attività insieme?",
        respuesta:
          "Ogni attività si prenota nella sua pagina, con il suo calendario. Se organizzi un viaggio di più giorni, scrivici su WhatsApp e ti aiutiamo a far quadrare gli orari.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  pt: {
    titulo: "O que fazer na sua viagem? Planeador de atividades",
    metaTitulo: "Planeador: o que fazer em Espanha",
    intro:
      "Diga-nos que cidade vai visitar, com quem viaja e quanto quer gastar, e propomos-lhe as atividades mais adequadas entre as que vendemos. Sem registo e em 30 segundos.",
    migas: [{ label: "Início", href: "/pt" }, { label: "Planeador" }],
    migasAria: "Navegação estrutural",
    comoFunciona: "Como escolhemos as propostas?",
    comoFuncionaTexto: [
      "Partimos de todas as atividades publicadas na cidade, com o seu preço real. Nas visitas privadas com preço por grupo, usamos o preço por pessoa num grupo de 4.",
      "Retiramos as que ultrapassam o seu orçamento e, se viajar com crianças, as que envolvem álcool, vida noturna ou idade mínima de 12 anos ou mais.",
      "Ordenamos pelo que melhor corresponde aos seus interesses, pela nota e pelo número de avaliações e, em grupos grandes, damos prioridade às visitas privadas, que ficam mais baratas por pessoa. No máximo três de cada tipo, para o plano ser variado.",
    ],
    faq: [
      {
        pregunta: "O planeador é gratuito?",
        respuesta:
          "Sim. É gratuito e não é preciso registo. Só paga a atividade que reservar, ao mesmo preço da respetiva página.",
      },
      {
        pregunta: "Os preços são por pessoa?",
        respuesta:
          "Sim. Nas visitas em grupo é o preço por pessoa. Nas visitas privadas com preço por grupo mostramos o preço por pessoa se forem 4; na página da atividade está a tabela completa consoante o número de pessoas.",
      },
      {
        pregunta: "E se viajar com crianças?",
        respuesta:
          "Ao escolher «Em família com crianças», não propomos provas, roteiros de bares, vida noturna nem atividades com idade mínima de 12 anos ou mais, e damos mais peso a parques, passeios de barco e visitas para todos.",
      },
      {
        pregunta: "Posso reservar várias atividades de uma vez?",
        respuesta:
          "Cada atividade reserva-se na sua página, com o seu calendário. Se está a preparar uma viagem de vários dias, escreva-nos por WhatsApp e ajudamos a conciliar os horários.",
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

export default function PaginaPlanificador({ idioma }: { idioma: Idioma }) {
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
