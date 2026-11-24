/**
 * Calendario de disponibilidad de GetYourGuide en las fichas.
 *
 * Desde el 24 nov de 2026 lo llevan TODAS las fichas de GetYourGuide cuya
 * URL de reserva trae el ID del tour (`…-t362290/`). Antes era una prueba
 * con una lista cerrada: 30 tours desde octubre y 59 ese mismo día (la
 * lista está en el historial de git de este archivo, por si hay que volver).
 *
 * Motivo: en el panel de GYG el calendario convertía un 9,6 % frente al
 * 7,0 % de los enlaces de fichas en inglés (20 oct-18 nov, pocas reservas),
 * y con fichas de 4-13 visitas una prueba parcial no llega a ser concluyente.
 *
 * El precio propio no se quita: va encima del calendario con
 * `<PrecioDestacado>` (ver `cabecera` en `WidgetDisponibilidadGyg`).
 *
 * Se mide con el evento «Widget interaccion» de Vercel y las campañas
 * `widget-…` del panel de GYG. Referencia antes del cambio (20-24 nov):
 * 20 personas tocaron un calendario, 30 pulsaron un enlace a GYG y hubo
 * 4 reservas.
 */

import { GYG_PARTNER_ID } from "./afiliados-gyg";

export { GYG_PARTNER_ID };

export const CAMPANA_WIDGET_GYG = "widget-fichas";

/** Id del bloque del widget: destino del botón de la barra fija en móvil. */
export const ANCLA_WIDGET_GYG = "disponibilidad-gyg";

/** Extrae el ID de tour de una URL de GYG (`…-t362290/`). */
export function extraerTourIdGyg(url: string | undefined): string | null {
  if (!url) return null;
  const m = /-t(\d+)(?:\/|\?|$)/.exec(url);
  return m ? m[1] : null;
}

/**
 * Devuelve el ID de tour si la ficha es de GetYourGuide y su URL lo trae;
 * `null` en cualquier otro caso (otro proveedor o URL sin ID), y entonces
 * la ficha sigue con <CalendarioReserva>.
 */
export function tourWidgetGyg(
  proveedor: string | undefined,
  urlReserva: string | undefined
): string | null {
  if (proveedor !== "getyourguide") return null;
  return extraerTourIdGyg(urlReserva);
}
