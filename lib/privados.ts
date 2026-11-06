import "server-only";
import {
  obtenerCiudadesConActividades,
  obtenerListaActividadesPorCiudad,
  type ActividadListItem,
} from "@/lib/actividades";
import { obtenerListaCiudades } from "@/lib/ciudades";
import type { Idioma } from "@/lib/i18n/types";
import type { PreguntaFrecuente } from "@/lib/actividades";
import { precioComparable } from "@/lib/precioComparable";

/**
 * Páginas de excursiones privadas (venta directa): una por ciudad y un hub.
 * En los seis idiomas: cada uno lista las privadas publicadas en su idioma.
 */
export const IDIOMAS_PRIVADOS = ["es", "en", "de", "fr", "it", "pt"] as const;
export type IdiomaPrivados = (typeof IDIOMAS_PRIVADOS)[number];

/** Por debajo de esto la página de ciudad sería contenido fino. */
export const MIN_PRIVADAS_CIUDAD = 3;

export function esIdiomaPrivados(idioma: string): idioma is IdiomaPrivados {
  return (IDIOMAS_PRIVADOS as readonly string[]).includes(idioma);
}

export { urlHubPrivados, urlPrivadasDeCiudad } from "@/lib/privadosUrls";

const RE_VARIOS_DIAS = /\d+\s*(días|dias|days)\b/i;

/** Privadas de un día de la ciudad: venta directa primero, luego opiniones. */
export function obtenerPrivadasDeCiudad(idioma: Idioma, ciudad: string): ActividadListItem[] {
  return obtenerListaActividadesPorCiudad(idioma, ciudad)
    .filter((a) => a.privada === true && !RE_VARIOS_DIAS.test(a.duracion ?? ""))
    .sort(
      (a, b) =>
        Number(b.proveedor === "bokun") - Number(a.proveedor === "bokun") ||
        (b.numeroOpiniones ?? 0) - (a.numeroOpiniones ?? 0) ||
        precioComparable(a).porPersona - precioComparable(b).porPersona
    );
}

export type CiudadConPrivadas = {
  ciudad: string;
  nombre: string;
  actividades: ActividadListItem[];
};

export function obtenerCiudadesConPrivadas(idioma: Idioma): CiudadConPrivadas[] {
  const nombres = new Map(obtenerListaCiudades(idioma).map((c) => [c.slug, c.nombre]));
  return obtenerCiudadesConActividades(idioma)
    .map((ciudad) => ({
      ciudad,
      nombre: nombres.get(ciudad) ?? ciudad,
      actividades: obtenerPrivadasDeCiudad(idioma, ciudad),
    }))
    .filter((c) => c.actividades.length >= MIN_PRIVADAS_CIUDAD)
    .sort((a, b) => b.actividades.length - a.actividades.length);
}

/**
 * Privadas de las ciudades que no llegan a MIN_PRIVADAS_CIUDAD (sin página
 * propia). En DE/FR/IT/PT son buena parte de la oferta, así que el hub las
 * agrupa al final en «Otras ciudades».
 */
export function obtenerPrivadasOtrasCiudades(idioma: Idioma): ActividadListItem[] {
  const conPagina = new Set(obtenerCiudadesConPrivadas(idioma).map((c) => c.ciudad));
  return obtenerCiudadesConActividades(idioma)
    .filter((ciudad) => !conPagina.has(ciudad))
    .flatMap((ciudad) => obtenerPrivadasDeCiudad(idioma, ciudad));
}

/**
 * Preguntas frecuentes con datos calculados de las fichas (nada inventado):
 * cuántas tienen cancelación gratis, rango de precio por persona, etc.
 */
export function faqPrivadas(
  idioma: Idioma,
  actividades: ActividadListItem[],
  nombreCiudad?: string
): PreguntaFrecuente[] {
  const total = actividades.length;
  const conCancelacion = actividades.filter((a) => a.cancelacionGratuita).length;
  const porGrupo = actividades.filter((a) => a.precioPorGrupo).length;
  const precios = actividades.map((a) => precioComparable(a).porPersona).filter((p) => p > 0);
  const minimo = precios.length ? Math.min(...precios) : 0;
  const formato = new Intl.NumberFormat(LOCALE_PRECIO[idioma], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const lugar = nombreCiudad ?? NOMBRE_ESPANA[idioma];
  const plazos = Array.from(
    new Set(actividades.filter((a) => a.cancelacionGratuita && a.horasCancelacion).map((a) => a.horasCancelacion as number))
  ).sort((a, b) => a - b);
  const plazo = (
    uno: (h: number) => string,
    rango: (a: number, b: number) => string,
    ninguno: string
  ): string =>
    plazos.length === 1 ? uno(plazos[0]) : plazos.length > 1 ? rango(plazos[0], plazos[plazos.length - 1]) : ninguno;
  const desde = minimo ? formato.format(minimo) : "";

  switch (idioma) {
    case "es":
      return [
        {
          pregunta: "¿Qué diferencia hay entre una excursión privada y una en grupo?",
          respuesta: `En la privada vais solo vosotros: el guía o el conductor es para vuestro grupo y no compartís con desconocidos. Lo que incluye cada una de las de ${lugar} (entradas, recogida en el alojamiento, comida) está en su ficha.`,
        },
        {
          pregunta: "¿El precio es por persona o por grupo?",
          respuesta: `Depende de la excursión: ${porGrupo} de las ${total} se venden por grupo y el resto por persona. En las tarjetas mostramos lo que sale por persona en un grupo de 4, y en la ficha de las que van por grupo tienes el total según cuántos seáis.${desde ? ` Las más asequibles salen desde ${desde} por persona.` : ""}`,
        },
        {
          pregunta: "¿Puedo cancelar?",
          respuesta: `${conCancelacion} de las ${total} tienen cancelación gratuita ${plazo((h) => `hasta ${h} horas antes`, (a, b) => `hasta ${a}-${b} horas antes según la excursión`, "con el plazo que indica cada una")}. Las condiciones exactas de cada una están en su ficha, junto al calendario.`,
        },
        {
          pregunta: "¿Cómo se reserva?",
          respuesta: "Eliges fecha y número de personas en el calendario de la ficha y pagas con tarjeta en la pasarela segura de Bókun. La confirmación llega por email y, si tienes dudas antes o después, te atendemos por WhatsApp.",
        },
      ];
    case "en":
      return [
        {
          pregunta: "What's the difference between a private tour and a group tour?",
          respuesta: `On a private tour it's just your group: the guide or driver is yours alone and you don't share with strangers. What each tour in ${lugar} includes (tickets, pickup from your accommodation, meals) is on its page.`,
        },
        {
          pregunta: "Is the price per person or per group?",
          respuesta: `It depends on the tour: ${porGrupo} of the ${total} are sold per group and the rest per person. On the cards we show the price per person for a group of 4, and the per-group ones list the total by group size on their page.${desde ? ` The most affordable start from ${desde} per person.` : ""}`,
        },
        {
          pregunta: "Can I cancel?",
          respuesta: `${conCancelacion} of the ${total} offer free cancellation ${plazo((h) => `up to ${h} hours before`, (a, b) => `up to ${a}-${b} hours before depending on the tour`, "within the period each one states")}. The exact terms are on each tour's page, next to the calendar.`,
        },
        {
          pregunta: "How do I book?",
          respuesta: "Pick a date and the number of people in the calendar on the tour page and pay by card through Bókun's secure gateway. Confirmation arrives by email, and if you have questions before or after, we're on WhatsApp.",
        },
      ];
    case "de":
      return [
        {
          pregunta: "Was ist der Unterschied zwischen einer privaten Tour und einer Gruppentour?",
          respuesta: `Bei einer privaten Tour seid ihr unter euch: Guide oder Fahrer sind nur für eure Gruppe da, ohne fremde Mitreisende. Was jede Tour in ${lugar} beinhaltet (Eintritte, Abholung an der Unterkunft, Essen), steht auf ihrer Seite.`,
        },
        {
          pregunta: "Gilt der Preis pro Person oder pro Gruppe?",
          respuesta: `Das hängt von der Tour ab: ${porGrupo} der ${total} werden pro Gruppe verkauft, der Rest pro Person. Auf den Karten zeigen wir den Preis pro Person bei einer Gruppe von 4; bei Gruppenpreisen findest du auf der Tourseite den Gesamtpreis je nach Gruppengröße.${desde ? ` Die günstigsten gibt es ab ${desde} pro Person.` : ""}`,
        },
        {
          pregunta: "Kann ich stornieren?",
          respuesta: `${conCancelacion} der ${total} sind ${plazo((h) => `bis ${h} Stunden vorher`, (a, b) => `je nach Tour bis ${a}-${b} Stunden vorher`, "innerhalb der jeweils angegebenen Frist")} kostenlos stornierbar. Die genauen Bedingungen stehen auf jeder Tourseite neben dem Kalender.`,
        },
        {
          pregunta: "Wie buche ich?",
          respuesta: "Wähle im Kalender auf der Tourseite Datum und Personenzahl und bezahle mit Karte über das sichere Zahlungssystem von Bókun. Die Bestätigung kommt per E-Mail; bei Fragen vorher oder nachher helfen wir dir per WhatsApp.",
        },
      ];
    case "fr":
      return [
        {
          pregunta: "Quelle différence entre une visite privée et une visite en groupe ?",
          respuesta: `En privé, vous êtes entre vous : le guide ou le chauffeur est réservé à votre groupe, sans inconnus. Ce que comprend chaque visite à ${lugar} (entrées, prise en charge à l’hébergement, repas) est indiqué sur sa page.`,
        },
        {
          pregunta: "Le prix est-il par personne ou par groupe ?",
          respuesta: `Cela dépend de la visite : ${porGrupo} sur ${total} sont vendues par groupe et les autres par personne. Sur les cartes, nous affichons le prix par personne pour un groupe de 4 ; pour les prix par groupe, la page de la visite indique le total selon le nombre de participants.${desde ? ` Les plus abordables commencent à ${desde} par personne.` : ""}`,
        },
        {
          pregunta: "Puis-je annuler ?",
          respuesta: `${conCancelacion} sur ${total} offrent l’annulation gratuite ${plazo((h) => `jusqu’à ${h} heures avant`, (a, b) => `jusqu’à ${a}-${b} heures avant selon la visite`, "dans le délai indiqué pour chacune")}. Les conditions exactes figurent sur la page de chaque visite, à côté du calendrier.`,
        },
        {
          pregunta: "Comment réserver ?",
          respuesta: "Choisissez la date et le nombre de personnes dans le calendrier de la visite et payez par carte via la plateforme sécurisée de Bókun. La confirmation arrive par e-mail et, pour toute question avant ou après, nous répondons sur WhatsApp.",
        },
      ];
    case "it":
      return [
        {
          pregunta: "Che differenza c’è tra un tour privato e uno di gruppo?",
          respuesta: `Nel tour privato ci siete solo voi: la guida o l’autista è dedicato al vostro gruppo, senza estranei. Cosa include ogni tour a ${lugar} (biglietti, prelievo in hotel, pasti) è indicato nella sua pagina.`,
        },
        {
          pregunta: "Il prezzo è a persona o a gruppo?",
          respuesta: `Dipende dal tour: ${porGrupo} su ${total} si vendono a gruppo e gli altri a persona. Nelle schede mostriamo il prezzo a persona per un gruppo di 4; per quelli a gruppo, nella pagina del tour trovi il totale in base a quanti siete.${desde ? ` I più convenienti partono da ${desde} a persona.` : ""}`,
        },
        {
          pregunta: "Posso cancellare?",
          respuesta: `${conCancelacion} su ${total} hanno la cancellazione gratuita ${plazo((h) => `fino a ${h} ore prima`, (a, b) => `fino a ${a}-${b} ore prima a seconda del tour`, "entro il termine indicato da ciascuno")}. Le condizioni esatte sono nella pagina di ogni tour, accanto al calendario.`,
        },
        {
          pregunta: "Come si prenota?",
          respuesta: "Scegli data e numero di persone nel calendario della pagina del tour e paga con carta sulla piattaforma sicura di Bókun. La conferma arriva via e-mail e, per qualsiasi dubbio prima o dopo, ti rispondiamo su WhatsApp.",
        },
      ];
    case "pt":
      return [
        {
          pregunta: "Qual é a diferença entre uma visita privada e uma em grupo?",
          respuesta: `Na visita privada vão só vocês: o guia ou o motorista é exclusivo do vosso grupo, sem desconhecidos. O que inclui cada visita em ${lugar} (entradas, recolha no alojamento, refeições) está na respetiva página.`,
        },
        {
          pregunta: "O preço é por pessoa ou por grupo?",
          respuesta: `Depende da visita: ${porGrupo} das ${total} vendem-se por grupo e as restantes por pessoa. Nos cartões mostramos o preço por pessoa num grupo de 4; nas que são por grupo, a página da visita indica o total consoante o número de pessoas.${desde ? ` As mais acessíveis começam em ${desde} por pessoa.` : ""}`,
        },
        {
          pregunta: "Posso cancelar?",
          respuesta: `${conCancelacion} das ${total} têm cancelamento gratuito ${plazo((h) => `até ${h} horas antes`, (a, b) => `até ${a}-${b} horas antes, conforme a visita`, "no prazo indicado em cada uma")}. As condições exatas estão na página de cada visita, junto ao calendário.`,
        },
        {
          pregunta: "Como se reserva?",
          respuesta: "Escolha a data e o número de pessoas no calendário da página da visita e pague com cartão na plataforma segura da Bókun. A confirmação chega por e-mail e, se tiver dúvidas antes ou depois, respondemos por WhatsApp.",
        },
      ];
  }
}

const LOCALE_PRECIO: Record<Idioma, string> = {
  es: "es-ES",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
};

const NOMBRE_ESPANA: Record<Idioma, string> = {
  es: "España",
  en: "Spain",
  de: "Spanien",
  fr: "Espagne",
  it: "Spagna",
  pt: "Espanha",
};
