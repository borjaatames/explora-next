import type { Idioma } from "./i18n/types";

/**
 * Agrupación editorial de las ciudades en la página índice /ciudades.
 * Las ciudades `destacada: true` con más contenido van en "principales";
 * el resto se reparte por zona en el orden de este array.
 */
export type ZonaCiudades = "andalucia" | "mediterraneo" | "islas" | "norte";

export const ZONAS_ORDEN: readonly ZonaCiudades[] = [
  "andalucia",
  "mediterraneo",
  "islas",
  "norte",
];

/** Ciudades que van en el bloque grande de "Destinos principales". */
export const CIUDADES_PRINCIPALES: readonly string[] = [
  "madrid",
  "barcelona",
  "sevilla",
  "granada",
];

export const ZONA_DE_CIUDAD: Readonly<Record<string, ZonaCiudades>> = {
  cordoba: "andalucia",
  malaga: "andalucia",
  cadiz: "andalucia",
  "jerez-de-la-frontera": "andalucia",
  valencia: "mediterraneo",
  alicante: "mediterraneo",
  tarragona: "mediterraneo",
  girona: "mediterraneo",
  mallorca: "islas",
  ibiza: "islas",
  tenerife: "islas",
  "gran-canaria": "islas",
  lanzarote: "islas",
  fuerteventura: "islas",
  bilbao: "norte",
  "santiago-de-compostela": "norte",
  salamanca: "norte",
};

type TextosZona = { titulo: string; subtitulo: string };

export const TEXTOS_ZONAS: Readonly<
  Record<Idioma, Record<ZonaCiudades, TextosZona>>
> = {
  es: {
    andalucia: { titulo: "Andalucía", subtitulo: "La Alhambra, la Mezquita, la Costa del Sol y la Tacita de Plata." },
    mediterraneo: { titulo: "Mediterráneo", subtitulo: "Ciudades de costa entre Valencia y la Costa Brava." },
    islas: { titulo: "Islas", subtitulo: "Baleares y Canarias: playa, volcanes y sierra." },
    norte: { titulo: "Norte e interior", subtitulo: "Pintxos, el fin del Camino y la piedra dorada de Castilla." },
  },
  en: {
    andalucia: { titulo: "Andalusia", subtitulo: "The Alhambra, the Mezquita, the Costa del Sol and Cádiz." },
    mediterraneo: { titulo: "Mediterranean", subtitulo: "Coastal cities from Valencia to the Costa Brava." },
    islas: { titulo: "Islands", subtitulo: "Balearics and Canaries: beaches, volcanoes and mountains." },
    norte: { titulo: "North and inland", subtitulo: "Pintxos, the end of the Camino and Castile's golden stone." },
  },
  de: {
    andalucia: { titulo: "Andalusien", subtitulo: "Alhambra, Mezquita, Costa del Sol und Cádiz." },
    mediterraneo: { titulo: "Mittelmeer", subtitulo: "Küstenstädte von Valencia bis zur Costa Brava." },
    islas: { titulo: "Inseln", subtitulo: "Balearen und Kanaren: Strände, Vulkane und Berge." },
    norte: { titulo: "Norden und Landesinnere", subtitulo: "Pintxos, das Ende des Jakobswegs und Kastiliens goldener Stein." },
  },
  fr: {
    andalucia: { titulo: "Andalousie", subtitulo: "L'Alhambra, la Mezquita, la Costa del Sol et Cadix." },
    mediterraneo: { titulo: "Méditerranée", subtitulo: "Villes côtières de Valence à la Costa Brava." },
    islas: { titulo: "Îles", subtitulo: "Baléares et Canaries : plages, volcans et montagnes." },
    norte: { titulo: "Nord et intérieur", subtitulo: "Pintxos, la fin du Camino et la pierre dorée de Castille." },
  },
  it: {
    andalucia: { titulo: "Andalusia", subtitulo: "L'Alhambra, la Mezquita, la Costa del Sol e Cadice." },
    mediterraneo: { titulo: "Mediterraneo", subtitulo: "Città costiere da Valencia alla Costa Brava." },
    islas: { titulo: "Isole", subtitulo: "Baleari e Canarie: spiagge, vulcani e montagne." },
    norte: { titulo: "Nord e interno", subtitulo: "Pintxos, la fine del Cammino e la pietra dorata di Castiglia." },
  },
  pt: {
    andalucia: { titulo: "Andaluzia", subtitulo: "Alhambra, Mesquita, Costa del Sol e Cádis." },
    mediterraneo: { titulo: "Mediterrâneo", subtitulo: "Cidades costeiras de Valência à Costa Brava." },
    islas: { titulo: "Ilhas", subtitulo: "Baleares e Canárias: praias, vulcões e serra." },
    norte: { titulo: "Norte e interior", subtitulo: "Pintxos, o fim do Caminho e a pedra dourada de Castela." },
  },
};
