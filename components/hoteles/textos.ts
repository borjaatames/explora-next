import type { EtiquetaHotel, IdiomaHotel } from "@/lib/hoteles";

export type TextosHoteles = {
  inicio: string;
  migas: string;
  hoteles: string;
  listadoTitulo: (ciudad: string) => string;
  listadoDescripcion: (ciudad: string, n: number) => string;
  avisoAfiliado: string;
  avisoSoloIberostar: string;
  hotelesEnZona: (n: number) => string;
  filtros: string;
  todos: string;
  etiquetas: Record<EtiquetaHotel, string>;
  sinResultados: string;
  estrellas: (n: number) => string;
  idealPara: string;
  verFicha: string;
  verPrecios: string;
  deUnVistazo: string;
  busco: string;
  hotel: string;
  queHacer: (ciudad: string) => string;
  verActividades: string;
  enResumen: string;
  esParaTi: string;
  siSi: string;
  mejorOtro: string;
  porQue: string;
  servicios: string;
  habitaciones: string;
  ubicacion: string;
  verMapa: string;
  infoPractica: string;
  entrada: string;
  salida: string;
  regimen: string;
  publico: string;
  soloAdultos: string;
  todosPublicos: string;
  otrosHoteles: (ciudad: string) => string;
  precioAviso: string;
  fotosDe: string;
  tarjeta: { desde: string; verActividad: string; cancelacionGratuita: string };
  locale: string;
  ogLocale: string;
};

export const TEXTOS_HOTELES: Record<IdiomaHotel, TextosHoteles> = {
  es: {
    inicio: "Inicio",
    migas: "Migas de pan",
    hoteles: "Dónde dormir",
    listadoTitulo: (c) => `Hoteles en ${c}: dónde dormir según tu viaje`,
    listadoDescripcion: (c, n) =>
      `${n} hoteles Iberostar en ${c} por zonas: cuáles son solo para adultos, cuáles para familias, qué tiene cada uno y dónde queda.`,
    avisoAfiliado:
      "Si reservas desde nuestros enlaces, Iberostar nos paga una comisión. A ti no te cuesta más y nos ayuda a mantener la web.",
    avisoSoloIberostar: "De momento solo incluimos hoteles Iberostar. Iremos añadiendo otras cadenas.",
    hotelesEnZona: (n) => (n === 1 ? "1 hotel" : `${n} hoteles`),
    filtros: "Filtrar hoteles",
    todos: "Todos",
    etiquetas: {
      adultos: "Solo adultos",
      familias: "Familias",
      cinco: "5 estrellas",
      mar: "Frente al mar",
      "todo-incluido": "Todo incluido",
      spa: "Spa",
    },
    sinResultados: "Ningún hotel cumple este filtro.",
    estrellas: (n) => `${n} estrellas`,
    idealPara: "Ideal para",
    verFicha: "Ver ficha",
    verPrecios: "Ver precios en Iberostar",
    deUnVistazo: "De un vistazo",
    busco: "Busco…",
    hotel: "Hotel",
    queHacer: (c) => `Qué hacer en ${c} desde tu hotel`,
    verActividades: "Ver todas las actividades",
    enResumen: "En resumen",
    esParaTi: "¿Es para ti?",
    siSi: "Sí, si…",
    mejorOtro: "Mejor otro, si…",
    porQue: "Por qué nos gusta",
    servicios: "Servicios",
    habitaciones: "Habitaciones",
    ubicacion: "Ubicación y qué hay cerca",
    verMapa: "Ver en el mapa",
    infoPractica: "Información práctica",
    entrada: "Entrada",
    salida: "Salida",
    regimen: "Régimen",
    publico: "Público",
    soloAdultos: "Solo adultos",
    todosPublicos: "Familias y parejas",
    otrosHoteles: (c) => `Otros hoteles en ${c}`,
    precioAviso: "El precio depende de fechas y habitación: lo ves en la web de Iberostar.",
    fotosDe: "Fotos",
    tarjeta: { desde: "Desde", verActividad: "Ver actividad", cancelacionGratuita: "Cancelación gratis" },
    locale: "es-ES",
    ogLocale: "es_ES",
  },
  en: {
    inicio: "Home",
    migas: "Breadcrumb",
    hoteles: "Where to stay",
    listadoTitulo: (c) => `Hotels in ${c}: where to stay for your trip`,
    listadoDescripcion: (c, n) =>
      `${n} Iberostar hotels in ${c} by area: which are adults-only, which suit families, what each one offers and where it is.`,
    avisoAfiliado:
      "If you book through our links, Iberostar pays us a commission. It costs you nothing extra and helps keep this site running.",
    avisoSoloIberostar: "For now we only list Iberostar hotels. We will add other chains over time.",
    hotelesEnZona: (n) => (n === 1 ? "1 hotel" : `${n} hotels`),
    filtros: "Filter hotels",
    todos: "All",
    etiquetas: {
      adultos: "Adults only",
      familias: "Families",
      cinco: "5 stars",
      mar: "Beachfront",
      "todo-incluido": "All inclusive",
      spa: "Spa",
    },
    sinResultados: "No hotel matches this filter.",
    estrellas: (n) => `${n} stars`,
    idealPara: "Best for",
    verFicha: "View hotel",
    verPrecios: "Check prices on Iberostar",
    deUnVistazo: "At a glance",
    busco: "I'm looking for…",
    hotel: "Hotel",
    queHacer: (c) => `Things to do in ${c} from your hotel`,
    verActividades: "See all activities",
    enResumen: "In short",
    esParaTi: "Is it for you?",
    siSi: "Yes, if…",
    mejorOtro: "Pick another if…",
    porQue: "Why we like it",
    servicios: "Facilities",
    habitaciones: "Rooms",
    ubicacion: "Location and what's nearby",
    verMapa: "View on map",
    infoPractica: "Practical information",
    entrada: "Check-in",
    salida: "Check-out",
    regimen: "Board",
    publico: "Guests",
    soloAdultos: "Adults only",
    todosPublicos: "Families and couples",
    otrosHoteles: (c) => `Other hotels in ${c}`,
    precioAviso: "Prices depend on dates and room type: you'll see them on Iberostar's website.",
    fotosDe: "Photos",
    tarjeta: { desde: "From", verActividad: "View tour", cancelacionGratuita: "Free cancellation" },
    locale: "en-GB",
    ogLocale: "en_GB",
  },
};
