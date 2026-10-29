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
 * Solo ES y EN: en alemán no hay fichas propias.
 */
export const IDIOMAS_PRIVADOS = ["es", "en"] as const;
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
  const formato = new Intl.NumberFormat(idioma === "es" ? "es-ES" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const lugar = nombreCiudad ?? (idioma === "es" ? "España" : "Spain");
  const plazos = Array.from(
    new Set(actividades.filter((a) => a.cancelacionGratuita && a.horasCancelacion).map((a) => a.horasCancelacion as number))
  ).sort((a, b) => a - b);
  const plazoEs =
    plazos.length === 1 ? `hasta ${plazos[0]} horas antes` : plazos.length > 1 ? `hasta ${plazos[0]}-${plazos[plazos.length - 1]} horas antes según la excursión` : "con el plazo que indica cada una";
  const plazoEn =
    plazos.length === 1 ? `up to ${plazos[0]} hours before` : plazos.length > 1 ? `up to ${plazos[0]}-${plazos[plazos.length - 1]} hours before depending on the tour` : "within the period each one states";

  if (idioma === "es") {
    return [
      {
        pregunta: "¿Qué diferencia hay entre una excursión privada y una en grupo?",
        respuesta: `En la privada vais solo vosotros: el guía o el conductor es para vuestro grupo y no compartís con desconocidos. Lo que incluye cada una de las de ${lugar} (entradas, recogida en el alojamiento, comida) está en su ficha.`,
      },
      {
        pregunta: "¿El precio es por persona o por grupo?",
        respuesta: `Depende de la excursión: ${porGrupo} de las ${total} se venden por grupo y el resto por persona. En las tarjetas mostramos lo que sale por persona en un grupo de 4, y en la ficha de las que van por grupo tienes el total según cuántos seáis.${minimo ? ` Las más asequibles salen desde ${formato.format(minimo)} por persona.` : ""}`,
      },
      {
        pregunta: "¿Puedo cancelar?",
        respuesta: `${conCancelacion} de las ${total} tienen cancelación gratuita ${plazoEs}. Las condiciones exactas de cada una están en su ficha, junto al calendario.`,
      },
      {
        pregunta: "¿Cómo se reserva?",
        respuesta: "Eliges fecha y número de personas en el calendario de la ficha y pagas con tarjeta en la pasarela segura de Bókun. La confirmación llega por email y, si tienes dudas antes o después, te atendemos por WhatsApp.",
      },
    ];
  }
  return [
    {
      pregunta: "What's the difference between a private tour and a group tour?",
      respuesta: `On a private tour it's just your group: the guide or driver is yours alone and you don't share with strangers. What each tour in ${lugar} includes (tickets, pickup from your accommodation, meals) is on its page.`,
    },
    {
      pregunta: "Is the price per person or per group?",
      respuesta: `It depends on the tour: ${porGrupo} of the ${total} are sold per group and the rest per person. On the cards we show the price per person for a group of 4, and the per-group ones list the total by group size on their page.${minimo ? ` The most affordable start from ${formato.format(minimo)} per person.` : ""}`,
    },
    {
      pregunta: "Can I cancel?",
      respuesta: `${conCancelacion} of the ${total} offer free cancellation ${plazoEn}. The exact terms are on each tour's page, next to the calendar.`,
    },
    {
      pregunta: "How do I book?",
      respuesta: "Pick a date and the number of people in the calendar on the tour page and pay by card through Bókun's secure gateway. Confirmation arrives by email, and if you have questions before or after, we're on WhatsApp.",
    },
  ];
}
