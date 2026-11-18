/**
 * Prueba del widget de disponibilidad de GetYourGuide (oct 2026).
 *
 * Solo las fichas cuyo tour está en `TOURS_WIDGET_GYG` muestran el widget
 * (las 30 fichas GYG con más usuarios en GA4 entre el 26 jul y el 23 oct
 * de 2026, sumando ES y EN; ampliado a 60 el 18-11-2026). El resto sigue con <CalendarioReserva>.
 * Para extender la prueba basta con añadir IDs aquí.
 *
 * Las reservas del widget se miden en el panel de GYG con la campaña
 * `CAMPANA_WIDGET_GYG`.
 */

import { GYG_PARTNER_ID } from "./afiliados-gyg";

export { GYG_PARTNER_ID };

export const CAMPANA_WIDGET_GYG = "widget-fichas";

/** Id del bloque del widget: destino del botón de la barra fija en móvil. */
export const ANCLA_WIDGET_GYG = "disponibilidad-gyg";

const TOURS_WIDGET_GYG: ReadonlySet<string> = new Set([
  "171177", // alhambra-grupo-reducido
  "54011", // visita-guiada-alhambra-generalife
  "842973", // setas-sevilla-metropol-parasol-entrada-mirador
  "76003", // flamenco-en-el-teatro-city-hall-mas-vendido
  "800561", // sevilla-3-monumentos-acceso-prioritario-catedral-giralda-alcazar
  "67456", // pueblos-blancos-ronda-excursion-dia-desde-sevilla
  "163878", // mallorca-vuelta-isla-tren-soller-tranvia-barco
  "632032", // flamenco-cueva-amayas-sacromonte
  "448209", // ronda-setenil-desde-malaga
  "405115", // palau-dalmases-flamenco-show-palacio-siglo-xvii
  "207921", // caminito-del-rey-guiado-desde-malaga
  "521326", // sevilla-guadalquivir-river-boat-tour
  "70427", // alhambra-tour-privado
  "351351", // teide-teleferico-traslado
  "391310", // wanda-metropolitano-atletico-tour
  "69761", // flamenco-tablao-las-carboneras
  "131913", // catedral-sevilla-giralda-entrada-skip-line
  "700918", // camp-nou-museo-fc-barcelona-pase-total-experience
  "217542", // tour-teide-masca-icod-garachico
  "194657", // bernabeu-ticket-acceso
  "32264", // museo-prado-entrada
  "149528", // girona-juego-de-tronos-tour-grupo-reducido
  "418722", // sevilla-1-hora-guadalquivir-eco-crucero
  "417349", // girona-figueres-dali-cadaques-desde-barcelona
  "48474", // flamenco-cuevas-tarantos-sacromonte
  "419", // cuevas-del-drach-desde-alcudia
  "610177", // taller-paella-sangria-madrid-centro
  "231887", // tablao-de-carmen-flamenco-cena-poble-espanyol
  "953643", // universidad-salamanca-visita-guiada
  "61512", // girona-costa-brava-grupo-reducido-recogida-hotel
  // Ampliación del 18-11-2026: las 30 fichas GYG siguientes por sesiones en
  // GA4 (20 jul-16 nov). El widget convertía ~11 % frente al ~3 % del enlace.
  "131232", // real-alcazar-seville-entry-ticket
  "569659", // caminito-del-rey-ticket-official-guide
  "1123286", // fataga-tejeda-roque-nublo-day-trip-from-south
  "396762", // royal-alcazar-seville-skip-line-guided-tour
  "149066", // roque-nublo-pico-de-las-nieves-tour-from-las-palmas
  "212322", // corralejo-dunes-shore-excursion-puerto-del-rosario
  "534639", // northern-fuerteventura-corralejo-tour-from-south
  "146772", // gran-canaria-day-tour-from-las-palmas
  "53791", // park-guell-admission-ticket
  "139631", // gran-canaria-island-tour-from-las-palmas-bandama-dunes
  "117462", // excursion-toledo-segovia-alcazar
  "58181", // avila-salamanca-day-trip
  "50027", // sagrada-familia-ticket-audio-guide
  "360580", // gran-canaria-island-tour-from-mogan-maspalomas
  "98487", // catedral-giralda-alcazar-sevilla-tour-guiado-entradas
  "652110", // tossa-de-mar-costa-brava-excursion-desde-barcelona
  "49779", // lanzarote-excursion-timanfaya-jameos-cueva-de-los-verdes
  "1101706", // gran-canaria-sunset-stargazing-tour
  "427456", // vejer-conil-excursion-desde-jerez-cadiz
  "840866", // flamenco-show-cueva-la-faraona-sacromonte
  "337026", // cofete-jeep-safari-morro-jable
  "1014836", // small-group-walking-tour-gothic-and-gaudi-gems
  "406165", // no-chase-whale-dolphin-watching-los-cristianos
  "719794", // fuerteventura-island-tour-ajuy-betancuria
  "491580", // seville-alcazar-small-group-guided-tour-premium
  "428891", // cofete-villa-winter-tour
  "430098", // gran-canaria-dolphin-catamaran-snorkeling
  "591591", // royal-palace-skip-line-guided-tour-golden
  "407438", // loro-parque-siam-park-combo
  "194774", // lanzarote-timanfaya-la-geria-el-golfo-half-day
]);

/** Extrae el ID de tour de una URL de GYG (`…-t362290/`). */
export function extraerTourIdGyg(url: string | undefined): string | null {
  if (!url) return null;
  const m = /-t(\d+)(?:\/|\?|$)/.exec(url);
  return m ? m[1] : null;
}

/**
 * Devuelve el ID de tour si la ficha entra en la prueba del widget;
 * `null` en cualquier otro caso (otro proveedor o fuera de la lista).
 */
export function tourWidgetGyg(
  proveedor: string | undefined,
  urlReserva: string | undefined
): string | null {
  if (proveedor !== "getyourguide") return null;
  const id = extraerTourIdGyg(urlReserva);
  return id && TOURS_WIDGET_GYG.has(id) ? id : null;
}
