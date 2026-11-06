import Link from "next/link";
import Image from "next/image";
import type { PreguntaFrecuente } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import FaqActividad from "@/components/FaqActividad";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";
import { aCardData } from "@/lib/cardActividad";
import {
  EXCURSIONES_DESDE_PUERTO,
  actividadPorSlugEs,
  guiasDePuertos,
  urlCruceros,
} from "@/lib/descubrir";

const CRITERIO: Record<Idioma, string> = {
  es: "Criterio",
  en: "Criterion",
  de: "Kriterium",
  fr: "Critère",
  it: "Criterio",
  pt: "Critério",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Fila = { criterio: string; barco: string; grupo: string; privada: string };

export const TEXTOS_CRUCEROS = {
  es: {
    metaTitulo: "Excursiones en crucero por España: guía por puertos (2026)",
    metaDescripcion:
      "Qué hacer en tu escala en Barcelona, Málaga, Cádiz, Valencia, Palma, Tenerife, Las Palmas y Bilbao: cómo llegar del muelle al centro, qué ver en 4, 6 u 8 horas y excursiones con recogida en el puerto.",
    titulo: "Excursiones en crucero: qué hacer en cada puerto de España",
    intro:
      "Cómo ir del muelle al centro, qué da tiempo a ver según las horas de escala y qué excursiones te recogen en el mismo puerto. Una guía por puerto, actualizada para 2026.",
    migas: [{ label: "Inicio", href: "/" }, { label: "Cruceros" }],
    migasAria: "Migas de pan",
    puertos: "Guías por puerto",
    verGuia: "Ver guía del puerto",
    comparativa: "¿Excursión del barco, en grupo o privada?",
    comparativaIntro:
      "Las tres sirven; lo que cambia es el precio, el ritmo y quién responde si algo se retrasa.",
    columnas: { criterio: "", barco: "Excursión del barco", grupo: "En grupo por tu cuenta", privada: "Privada con recogida en el muelle" },
    filas: [
      {
        criterio: "Precio",
        barco: "El más alto por persona",
        grupo: "El más bajo",
        privada: "Se paga por grupo: cuantos más seáis, más barata sale por persona",
      },
      {
        criterio: "Recogida",
        barco: "Al pie del barco",
        grupo: "Tienes que llegar al punto de encuentro",
        privada: "En la terminal o el muelle (indica el barco al reservar)",
      },
      {
        criterio: "Si hay retraso",
        barco: "El barco espera a sus excursiones",
        grupo: "Corre de tu cuenta volver a tiempo",
        privada: "La vuelta se pacta con margen sobre tu hora de embarque",
      },
      {
        criterio: "Ritmo y grupo",
        barco: "Autobuses grandes",
        grupo: "Grupo mediano, horario fijo",
        privada: "Solo vosotros, a vuestro ritmo",
      },
    ] satisfies Fila[],
    excursiones: "Excursiones que te recogen en el puerto",
    excursionesIntro:
      "Fichas en las que el operador confirma la recogida en el muelle. Indica el nombre del barco al reservar.",
    tarjeta: { desde: "Desde", verActividad: "Ver actividad", cancelacionGratuita: "Cancelación gratis" },
    locale: "es-ES",
    faq: [
      {
        pregunta: "¿Cuánto tiempo hace falta para una excursión desde el puerto?",
        respuesta:
          "Para ver el centro de la ciudad del puerto bastan 4 horas. Para ir a otra ciudad (de Cádiz a Sevilla o de Málaga a Granada) necesitas una escala de al menos 9 o 10 horas, porque la excursión dura unas 8 horas y conviene volver con margen.",
      },
      {
        pregunta: "¿Qué pasa si la excursión llega tarde y el barco se va?",
        respuesta:
          "El barco solo espera a las excursiones que vende la naviera. En una excursión independiente la vuelta es responsabilidad tuya, por eso conviene pactar el regreso con margen sobre la hora de embarque.",
      },
      {
        pregunta: "¿Puedo ir por libre del muelle al centro?",
        respuesta:
          "En casi todos los puertos sí: hay lanzaderas, autobús urbano o se llega andando. En la guía de cada puerto explicamos la opción más rápida y cuánto cuesta.",
      },
      {
        pregunta: "¿Hay que reservar la excursión antes del crucero?",
        respuesta:
          "Conviene. Las fechas con varios barcos en puerto se llenan, y en las privadas el operador necesita saber el nombre del barco y la hora de llegada para organizar la recogida.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  en: {
    metaTitulo: "Spain cruise excursions: port-by-port guide (2026)",
    metaDescripcion:
      "What to do on your port day in Barcelona, Málaga, Cádiz, Valencia, Palma, Tenerife, Las Palmas and Bilbao: getting from the pier to town, what to see in 4, 6 or 8 hours, and tours with port pickup.",
    titulo: "Cruise excursions: what to do in each Spanish port",
    intro:
      "How to get from the pier to town, what you can see depending on your time ashore, and which tours pick you up at the port. One guide per port, updated for 2026.",
    migas: [{ label: "Home", href: "/en" }, { label: "Cruise excursions" }],
    migasAria: "Breadcrumb",
    puertos: "Port guides",
    verGuia: "Read the port guide",
    comparativa: "Ship excursion, group tour or private tour?",
    comparativaIntro:
      "All three work; what changes is the price, the pace and who is responsible if something runs late.",
    columnas: { criterio: "", barco: "Ship excursion", grupo: "Group tour on your own", privada: "Private tour with pier pickup" },
    filas: [
      {
        criterio: "Price",
        barco: "Highest per person",
        grupo: "Lowest",
        privada: "Priced per group: the more of you, the cheaper per person",
      },
      {
        criterio: "Pickup",
        barco: "Next to the ship",
        grupo: "You make your own way to the meeting point",
        privada: "At the terminal or pier (give your ship's name when booking)",
      },
      {
        criterio: "If it runs late",
        barco: "The ship waits for its own excursions",
        grupo: "Getting back on time is up to you",
        privada: "The return is agreed with a margin before all-aboard time",
      },
      {
        criterio: "Pace and group",
        barco: "Large coaches",
        grupo: "Medium group, fixed schedule",
        privada: "Just your party, at your own pace",
      },
    ] satisfies Fila[],
    excursiones: "Tours that pick you up at the port",
    excursionesIntro:
      "Tours where the operator confirms pickup at the pier. Give your ship's name when you book.",
    tarjeta: { desde: "From", verActividad: "View tour", cancelacionGratuita: "Free cancellation" },
    locale: "en-GB",
    faq: [
      {
        pregunta: "How much time do I need for a shore excursion?",
        respuesta:
          "Four hours is enough to see the centre of the port city. To visit another city (Cádiz to Seville or Málaga to Granada) you need at least 9 or 10 hours in port, because the tour lasts about 8 hours and you want a margin to get back.",
      },
      {
        pregunta: "What happens if my tour is late and the ship leaves?",
        respuesta:
          "Ships only wait for excursions sold by the cruise line. On an independent tour, getting back is your responsibility, so agree a return time with a comfortable margin before all-aboard.",
      },
      {
        pregunta: "Can I get from the pier to town on my own?",
        respuesta:
          "In almost every port, yes: there are shuttles, city buses or you can walk. Each port guide explains the quickest option and what it costs.",
      },
      {
        pregunta: "Should I book my excursion before the cruise?",
        respuesta:
          "It's a good idea. Days with several ships in port fill up, and for private tours the operator needs your ship's name and arrival time to arrange the pickup.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  de: {
    metaTitulo: "Landausflüge in Spanien: Kreuzfahrt-Guide nach Häfen (2026)",
    metaDescripcion:
      "Was du beim Landgang in Spaniens Kreuzfahrthäfen machen kannst: vom Kai ins Zentrum, was du in 4, 6 oder 8 Stunden siehst und Ausflüge mit Abholung am Hafen.",
    titulo: "Landausflüge: was du in jedem spanischen Hafen machen kannst",
    intro:
      "Wie du vom Kai ins Zentrum kommst, was du je nach Liegezeit sehen kannst und welche Ausflüge dich direkt am Hafen abholen. Ein Guide pro Hafen, aktualisiert für 2026.",
    migas: [{ label: "Startseite", href: "/de" }, { label: "Landausflüge" }],
    migasAria: "Brotkrumen",
    puertos: "Guides nach Hafen",
    verGuia: "Hafen-Guide lesen",
    comparativa: "Ausflug der Reederei, Gruppentour oder Privattour?",
    comparativaIntro:
      "Alle drei funktionieren; der Unterschied liegt im Preis, im Tempo und darin, wer verantwortlich ist, wenn sich etwas verspätet.",
    columnas: { criterio: "", barco: "Ausflug der Reederei", grupo: "Gruppentour auf eigene Faust", privada: "Privattour mit Abholung am Kai" },
    filas: [
      {
        criterio: "Preis",
        barco: "Am teuersten pro Person",
        grupo: "Am günstigsten",
        privada: "Preis pro Gruppe: je mehr ihr seid, desto günstiger pro Person",
      },
      {
        criterio: "Abholung",
        barco: "Direkt am Schiff",
        grupo: "Du musst selbst zum Treffpunkt kommen",
        privada: "Am Terminal oder Kai (Schiffsnamen bei der Buchung angeben)",
      },
      {
        criterio: "Bei Verspätung",
        barco: "Das Schiff wartet auf seine eigenen Ausflüge",
        grupo: "Rechtzeitig zurück zu sein liegt bei dir",
        privada: "Die Rückkehr wird mit Puffer vor der Alle-an-Bord-Zeit vereinbart",
      },
      {
        criterio: "Tempo und Gruppe",
        barco: "Große Busse",
        grupo: "Mittelgroße Gruppe, feste Zeiten",
        privada: "Nur ihr, in eurem Tempo",
      },
    ] satisfies Fila[],
    excursiones: "Ausflüge mit Abholung am Hafen",
    excursionesIntro:
      "Touren, bei denen der Anbieter die Abholung am Kai bestätigt. Gib bei der Buchung den Namen deines Schiffs an.",
    tarjeta: { desde: "Ab", verActividad: "Tour ansehen", cancelacionGratuita: "Kostenlose Stornierung" },
    locale: "de-DE",
    faq: [
      {
        pregunta: "Wie viel Zeit brauche ich für einen Landausflug?",
        respuesta:
          "Für das Zentrum der Hafenstadt reichen 4 Stunden. Für eine andere Stadt (von Cádiz nach Sevilla oder von Málaga nach Granada) brauchst du mindestens 9 bis 10 Stunden Liegezeit, denn der Ausflug dauert etwa 8 Stunden und du solltest mit Puffer zurück sein.",
      },
      {
        pregunta: "Was passiert, wenn mein Ausflug zu spät kommt und das Schiff ablegt?",
        respuesta:
          "Das Schiff wartet nur auf Ausflüge, die die Reederei verkauft. Bei einem unabhängigen Ausflug bist du selbst für die Rückkehr verantwortlich; vereinbare deshalb eine Rückkehrzeit mit genügend Puffer vor der Alle-an-Bord-Zeit.",
      },
      {
        pregunta: "Komme ich auf eigene Faust vom Kai ins Zentrum?",
        respuesta:
          "In fast allen Häfen ja: Es gibt Shuttles, Stadtbusse oder du gehst zu Fuß. In jedem Hafen-Guide erklären wir die schnellste Möglichkeit und was sie kostet.",
      },
      {
        pregunta: "Sollte ich den Ausflug vor der Kreuzfahrt buchen?",
        respuesta:
          "Ja, das ist sinnvoll. Tage mit mehreren Schiffen im Hafen sind schnell ausgebucht, und bei Privattouren braucht der Anbieter den Schiffsnamen und die Ankunftszeit, um die Abholung zu organisieren.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  fr: {
    metaTitulo: "Excursions en croisière en Espagne : guide port par port (2026)",
    metaDescripcion:
      "Que faire pendant votre escale dans les ports de croisière d’Espagne : aller du quai au centre, que voir en 4, 6 ou 8 heures et excursions avec prise en charge au port.",
    titulo: "Excursions en croisière : que faire dans chaque port d’Espagne",
    intro:
      "Comment aller du quai au centre, ce que vous avez le temps de voir selon la durée de l’escale et quelles excursions viennent vous chercher au port. Un guide par port, mis à jour pour 2026.",
    migas: [{ label: "Accueil", href: "/fr" }, { label: "Croisières" }],
    migasAria: "Fil d’Ariane",
    puertos: "Guides par port",
    verGuia: "Lire le guide du port",
    comparativa: "Excursion du bateau, en groupe ou privée ?",
    comparativaIntro:
      "Les trois conviennent ; ce qui change, c’est le prix, le rythme et qui est responsable en cas de retard.",
    columnas: { criterio: "", barco: "Excursion du bateau", grupo: "En groupe par vos propres moyens", privada: "Privée avec prise en charge au quai" },
    filas: [
      {
        criterio: "Prix",
        barco: "Le plus élevé par personne",
        grupo: "Le plus bas",
        privada: "Prix par groupe : plus vous êtes nombreux, moins c’est cher par personne",
      },
      {
        criterio: "Prise en charge",
        barco: "Au pied du bateau",
        grupo: "Vous devez rejoindre le point de rendez-vous",
        privada: "Au terminal ou au quai (indiquez le nom du bateau à la réservation)",
      },
      {
        criterio: "En cas de retard",
        barco: "Le bateau attend ses propres excursions",
        grupo: "Revenir à l’heure est votre responsabilité",
        privada: "Le retour est convenu avec une marge avant l’heure d’embarquement",
      },
      {
        criterio: "Rythme et groupe",
        barco: "Grands autocars",
        grupo: "Groupe moyen, horaires fixes",
        privada: "Rien que vous, à votre rythme",
      },
    ] satisfies Fila[],
    excursiones: "Excursions avec prise en charge au port",
    excursionesIntro:
      "Visites pour lesquelles l’organisateur confirme la prise en charge au quai. Indiquez le nom de votre bateau lors de la réservation.",
    tarjeta: { desde: "À partir de", verActividad: "Voir la visite", cancelacionGratuita: "Annulation gratuite" },
    locale: "fr-FR",
    faq: [
      {
        pregunta: "Combien de temps faut-il pour une excursion depuis le port ?",
        respuesta:
          "Quatre heures suffisent pour voir le centre de la ville portuaire. Pour aller dans une autre ville (de Cadix à Séville ou de Malaga à Grenade), il faut une escale d’au moins 9 ou 10 heures, car l’excursion dure environ 8 heures et il vaut mieux revenir avec de la marge.",
      },
      {
        pregunta: "Que se passe-t-il si l’excursion est en retard et que le bateau part ?",
        respuesta:
          "Le bateau n’attend que les excursions vendues par la compagnie. Avec une excursion indépendante, le retour est sous votre responsabilité : convenez d’une heure de retour avec une bonne marge avant l’embarquement.",
      },
      {
        pregunta: "Puis-je aller seul du quai au centre-ville ?",
        respuesta:
          "Dans presque tous les ports, oui : navettes, bus urbains ou à pied. Le guide de chaque port explique l’option la plus rapide et son prix.",
      },
      {
        pregunta: "Faut-il réserver l’excursion avant la croisière ?",
        respuesta:
          "C’est conseillé. Les jours où plusieurs bateaux sont à quai se remplissent vite, et pour les visites privées l’organisateur a besoin du nom du bateau et de l’heure d’arrivée pour organiser la prise en charge.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  it: {
    metaTitulo: "Escursioni in crociera in Spagna: guida porto per porto (2026)",
    metaDescripcion:
      "Cosa fare durante lo scalo nei porti crocieristici della Spagna: dal molo al centro, cosa vedere in 4, 6 o 8 ore ed escursioni con prelievo al porto.",
    titulo: "Escursioni in crociera: cosa fare in ogni porto della Spagna",
    intro:
      "Come andare dal molo al centro, cosa riesci a vedere in base alle ore di scalo e quali escursioni ti vengono a prendere al porto. Una guida per porto, aggiornata al 2026.",
    migas: [{ label: "Home", href: "/it" }, { label: "Crociere" }],
    migasAria: "Percorso di navigazione",
    puertos: "Guide per porto",
    verGuia: "Leggi la guida del porto",
    comparativa: "Escursione della nave, di gruppo o privata?",
    comparativaIntro:
      "Vanno bene tutte e tre; cambiano il prezzo, il ritmo e chi risponde se qualcosa va in ritardo.",
    columnas: { criterio: "", barco: "Escursione della nave", grupo: "Di gruppo per conto tuo", privada: "Privata con prelievo al molo" },
    filas: [
      {
        criterio: "Prezzo",
        barco: "Il più alto a persona",
        grupo: "Il più basso",
        privada: "Prezzo a gruppo: più siete, meno costa a persona",
      },
      {
        criterio: "Prelievo",
        barco: "Sotto la nave",
        grupo: "Devi raggiungere tu il punto d’incontro",
        privada: "Al terminal o al molo (indica il nome della nave alla prenotazione)",
      },
      {
        criterio: "In caso di ritardo",
        barco: "La nave aspetta le proprie escursioni",
        grupo: "Tornare in tempo è a carico tuo",
        privada: "Il rientro si concorda con margine sull’orario d’imbarco",
      },
      {
        criterio: "Ritmo e gruppo",
        barco: "Pullman grandi",
        grupo: "Gruppo medio, orario fisso",
        privada: "Solo voi, al vostro ritmo",
      },
    ] satisfies Fila[],
    excursiones: "Escursioni con prelievo al porto",
    excursionesIntro:
      "Tour in cui l’operatore conferma il prelievo al molo. Indica il nome della nave quando prenoti.",
    tarjeta: { desde: "Da", verActividad: "Vedi il tour", cancelacionGratuita: "Cancellazione gratuita" },
    locale: "it-IT",
    faq: [
      {
        pregunta: "Quanto tempo serve per un’escursione dal porto?",
        respuesta:
          "Per vedere il centro della città portuale bastano 4 ore. Per andare in un’altra città (da Cadice a Siviglia o da Malaga a Granada) serve uno scalo di almeno 9 o 10 ore, perché l’escursione dura circa 8 ore e conviene rientrare con margine.",
      },
      {
        pregunta: "Cosa succede se l’escursione arriva tardi e la nave parte?",
        respuesta:
          "La nave aspetta solo le escursioni vendute dalla compagnia. In un’escursione indipendente il rientro è responsabilità tua, quindi conviene concordare l’orario di ritorno con un buon margine sull’imbarco.",
      },
      {
        pregunta: "Posso andare da solo dal molo al centro?",
        respuesta:
          "In quasi tutti i porti sì: ci sono navette, autobus urbani oppure si arriva a piedi. Nella guida di ogni porto spieghiamo l’opzione più rapida e quanto costa.",
      },
      {
        pregunta: "Bisogna prenotare l’escursione prima della crociera?",
        respuesta:
          "È consigliabile. Le date con più navi in porto si riempiono e, nei tour privati, l’operatore ha bisogno del nome della nave e dell’orario d’arrivo per organizzare il prelievo.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  pt: {
    metaTitulo: "Excursões de cruzeiro em Espanha: guia porto a porto (2026)",
    metaDescripcion:
      "O que fazer na escala nos portos de cruzeiro de Espanha: do cais ao centro, o que ver em 4, 6 ou 8 horas e excursões com recolha no porto.",
    titulo: "Excursões de cruzeiro: o que fazer em cada porto de Espanha",
    intro:
      "Como ir do cais ao centro, o que dá tempo para ver consoante as horas de escala e que excursões o vão buscar ao porto. Um guia por porto, atualizado para 2026.",
    migas: [{ label: "Início", href: "/pt" }, { label: "Cruzeiros" }],
    migasAria: "Navegação estrutural",
    puertos: "Guias por porto",
    verGuia: "Ler o guia do porto",
    comparativa: "Excursão do navio, em grupo ou privada?",
    comparativaIntro:
      "As três servem; o que muda é o preço, o ritmo e quem responde se algo se atrasar.",
    columnas: { criterio: "", barco: "Excursão do navio", grupo: "Em grupo por conta própria", privada: "Privada com recolha no cais" },
    filas: [
      {
        criterio: "Preço",
        barco: "O mais alto por pessoa",
        grupo: "O mais baixo",
        privada: "Preço por grupo: quantos mais forem, mais barato por pessoa",
      },
      {
        criterio: "Recolha",
        barco: "Junto ao navio",
        grupo: "Tem de chegar ao ponto de encontro",
        privada: "No terminal ou no cais (indique o navio ao reservar)",
      },
      {
        criterio: "Em caso de atraso",
        barco: "O navio espera pelas suas excursões",
        grupo: "Voltar a tempo é responsabilidade sua",
        privada: "O regresso é combinado com margem sobre a hora de embarque",
      },
      {
        criterio: "Ritmo e grupo",
        barco: "Autocarros grandes",
        grupo: "Grupo médio, horário fixo",
        privada: "Só vocês, ao vosso ritmo",
      },
    ] satisfies Fila[],
    excursiones: "Excursões com recolha no porto",
    excursionesIntro:
      "Visitas em que o operador confirma a recolha no cais. Indique o nome do navio ao reservar.",
    tarjeta: { desde: "Desde", verActividad: "Ver visita", cancelacionGratuita: "Cancelamento gratuito" },
    locale: "pt-PT",
    faq: [
      {
        pregunta: "Quanto tempo é preciso para uma excursão a partir do porto?",
        respuesta:
          "Para ver o centro da cidade portuária bastam 4 horas. Para ir a outra cidade (de Cádis a Sevilha ou de Málaga a Granada) precisa de uma escala de pelo menos 9 ou 10 horas, porque a excursão dura cerca de 8 horas e convém regressar com margem.",
      },
      {
        pregunta: "O que acontece se a excursão se atrasar e o navio partir?",
        respuesta:
          "O navio só espera pelas excursões vendidas pela companhia. Numa excursão independente, o regresso é da sua responsabilidade, por isso convém combinar a hora de regresso com boa margem sobre o embarque.",
      },
      {
        pregunta: "Posso ir por conta própria do cais ao centro?",
        respuesta:
          "Em quase todos os portos, sim: há vaivéns, autocarro urbano ou chega-se a pé. No guia de cada porto explicamos a opção mais rápida e quanto custa.",
      },
      {
        pregunta: "É preciso reservar a excursão antes do cruzeiro?",
        respuesta:
          "Convém. As datas com vários navios no porto esgotam e, nas privadas, o operador precisa do nome do navio e da hora de chegada para organizar a recolha.",
      },
    ] satisfies PreguntaFrecuente[],
  },
} as const;

export default function PaginaCruceros({ idioma }: { idioma: Idioma }) {
  const t = TEXTOS_CRUCEROS[idioma];
  const puertos = guiasDePuertos(idioma);
  const excursiones = EXCURSIONES_DESDE_PUERTO.flatMap(({ ciudad, slugEs }) => {
    const a = actividadPorSlugEs(idioma, ciudad, slugEs);
    return a ? [a] : [];
  });

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: t.migas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.label,
      item: `${SITE_URL}${"href" in m ? m.href : urlCruceros(idioma)}`,
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
  const columnas = ["barco", "grupo", "privada"] as const;

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

      <section aria-labelledby="puertos" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 id="puertos" className="mb-6 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">
          {t.puertos}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {puertos.map((p) => (
            <Link
              key={p.guia.url}
              href={p.guia.url}
              className="group block overflow-hidden rounded-lg border border-piedra-200 transition-all hover:border-anil-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.guia.imagen_portada || p.guia.imagen || "/images/home/hero.jpg"}
                  alt={p.guia.imagen_alt ?? p.puerto}
                  fill
                  sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-2 font-fraunces text-xl font-bold text-piedra-900 transition-colors group-hover:text-anil-700">
                  {p.puerto}
                </h3>
                <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-piedra-600">{p.guia.descripcion}</p>
                <span className="text-sm font-semibold text-anil-600">{t.verGuia} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="comparativa" className="border-y border-piedra-200 bg-piedra-50">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          <h2 id="comparativa" className="mb-3 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">
            {t.comparativa}
          </h2>
          <p className="mb-6 text-piedra-600">{t.comparativaIntro}</p>
          <div className="overflow-x-auto rounded-lg border border-piedra-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-piedra-100 text-piedra-900">
                <tr>
                  <th scope="col" className="p-4">
                    <span className="sr-only">{CRITERIO[idioma]}</span>
                  </th>
                  {columnas.map((c) => (
                    <th key={c} scope="col" className="p-4 font-semibold">
                      {t.columnas[c]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.filas.map((f) => (
                  <tr key={f.criterio} className="border-t border-piedra-200">
                    <th scope="row" className="p-4 font-semibold text-piedra-900">
                      {f.criterio}
                    </th>
                    {columnas.map((c) => (
                      <td key={c} className="p-4 text-piedra-700">
                        {f[c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {excursiones.length > 0 && (
        <section aria-labelledby="excursiones-puerto" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 id="excursiones-puerto" className="mb-3 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">
            {t.excursiones}
          </h2>
          <p className="mb-6 text-piedra-600">{t.excursionesIntro}</p>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {excursiones.map((a) => (
              <CardActividad key={a.url} actividad={aCardData(a)} strings={t.tarjeta} locale={t.locale} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-piedra-200">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <FaqActividad idioma={idioma} preguntas={[...t.faq]} />
        </div>
      </section>
    </main>
  );
}
