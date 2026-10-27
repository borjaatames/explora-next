import type { Idioma } from "@/lib/i18n/types";
import type { TrozoGuia } from "@/lib/guiasReservas";

/**
 * Mapas por día de las guías de itinerario.
 *
 * Clave: `ciudad/slug-es` de la guía. Las versiones EN/DE usan la misma
 * entrada a través de `slugs.es`. Las coordenadas se comprobaron una a una
 * con Nominatim (OpenStreetMap) el 27 oct 2026; el orden de las paradas es
 * el del texto de cada día.
 */
export type ParadaMapa = {
  nombre: Record<"es" | "en" | "de", string>;
  lat: number;
  lng: number;
};

export type DiaMapa = { dia: number; paradas: ParadaMapa[] };

type Fila = [es: string, en: string, de: string, lat: number, lng: number];

const p = ([es, en, de, lat, lng]: Fila): ParadaMapa => ({
  nombre: { es, en, de },
  lat,
  lng,
});

const dias = (d: Record<number, Fila[]>): DiaMapa[] =>
  Object.entries(d).map(([dia, filas]) => ({
    dia: Number(dia),
    paradas: filas.map(p),
  }));

const MAPAS: Record<string, DiaMapa[]> = {
  "madrid/madrid-en-3-dias": dias({
    1: [
      ["Museo del Prado", "Prado Museum", "Prado-Museum", 40.41379, -3.69204],
      ["Barrio de las Letras (Plaza de Santa Ana)", "Barrio de las Letras (Plaza de Santa Ana)", "Barrio de las Letras (Plaza de Santa Ana)", 40.4148, -3.70079],
      ["Plaza Mayor", "Plaza Mayor", "Plaza Mayor", 40.41539, -3.707],
      ["Palacio Real", "Royal Palace", "Königspalast", 40.41674, -3.71362],
      ["Templo de Debod", "Temple of Debod", "Tempel von Debod", 40.42407, -3.71761],
    ],
    2: [
      ["Monasterio de El Escorial", "El Escorial Monastery", "Kloster El Escorial", 40.58907, -4.14739],
      ["Valle de Cuelgamuros", "Valley of Cuelgamuros", "Valle de Cuelgamuros", 40.64074, -4.15715],
    ],
    3: [
      ["Retiro (Palacio de Cristal)", "Retiro Park (Crystal Palace)", "Retiro-Park (Kristallpalast)", 40.4136, -3.68206],
      ["Chamberí (Plaza de Olavide)", "Chamberí (Plaza de Olavide)", "Chamberí (Plaza de Olavide)", 40.43277, -3.70103],
      ["Museo Reina Sofía", "Reina Sofía Museum", "Museum Reina Sofía", 40.40805, -3.69442],
    ],
  }),
  "barcelona/barcelona-en-3-dias": dias({
    1: [
      ["Sagrada Família", "Sagrada Família", "Sagrada Família", 41.4035, 2.17443],
      ["Casa Batlló", "Casa Batlló", "Casa Batlló", 41.39154, 2.1647],
      ["La Pedrera", "La Pedrera", "La Pedrera", 41.3954, 2.16176],
    ],
    2: [
      ["Park Güell", "Park Güell", "Park Güell", 41.41423, 2.15246],
      ["Gràcia (Plaça del Sol)", "Gràcia (Plaça del Sol)", "Gràcia (Plaça del Sol)", 41.40162, 2.15671],
      ["Bunkers del Carmel", "Carmel Bunkers", "Bunker del Carmel", 41.41926, 2.16154],
    ],
    3: [
      ["Catedral de Barcelona", "Barcelona Cathedral", "Kathedrale von Barcelona", 41.38393, 2.17655],
      ["Plaça del Rei", "Plaça del Rei", "Plaça del Rei", 41.38416, 2.17739],
      ["Santa Maria del Mar", "Santa Maria del Mar", "Santa Maria del Mar", 41.38378, 2.18201],
      ["MNAC", "MNAC", "MNAC", 41.3686, 2.15346],
      ["Castillo de Montjuïc", "Montjuïc Castle", "Burg Montjuïc", 41.36338, 2.16614],
    ],
  }),
  "granada/granada-en-2-dias": dias({
    1: [
      ["Alhambra", "Alhambra", "Alhambra", 37.17726, -3.58962],
      ["Carrera del Darro", "Carrera del Darro", "Carrera del Darro", 37.17858, -3.59199],
      ["Mirador de San Nicolás", "San Nicolás viewpoint", "Aussichtspunkt San Nicolás", 37.18104, -3.59266],
      ["Sacromonte", "Sacromonte", "Sacromonte", 37.18161, -3.57924],
    ],
    2: [
      ["Capilla Real", "Royal Chapel", "Königliche Kapelle", 37.1763, -3.59857],
      ["Alcaicería y Corral del Carbón", "Alcaicería and Corral del Carbón", "Alcaicería und Corral del Carbón", 37.17491, -3.59788],
      ["Realejo (Campo del Príncipe)", "Realejo (Campo del Príncipe)", "Realejo (Campo del Príncipe)", 37.17331, -3.59211],
      ["Monasterio de la Cartuja", "La Cartuja Monastery", "Kartause La Cartuja", 37.19199, -3.5993],
    ],
  }),
  "granada/granada-con-ninos": dias({
    1: [
      ["Generalife", "Generalife", "Generalife", 37.17699, -3.58523],
      ["Alcazaba y Torre de la Vela", "Alcazaba and Torre de la Vela", "Alcazaba und Torre de la Vela", 37.17706, -3.59231],
      ["Palacios Nazaríes", "Nasrid Palaces", "Nasridenpaläste", 37.17726, -3.58962],
    ],
    2: [
      ["Parque de las Ciencias", "Science Park", "Wissenschaftspark", 37.1627, -3.60576],
    ],
  }),
  "malaga/malaga-en-dos-dias": dias({
    1: [
      ["Alcazaba y Teatro Romano", "Alcazaba and Roman Theatre", "Alcazaba und Römisches Theater", 36.72101, -4.41592],
      ["Castillo de Gibralfaro", "Gibralfaro Castle", "Burg Gibralfaro", 36.72339, -4.41182],
      ["Catedral", "Cathedral", "Kathedrale", 36.72018, -4.41941],
      ["Museo Picasso", "Picasso Museum", "Picasso-Museum", 36.72155, -4.41828],
      ["Muelle Uno", "Muelle Uno", "Muelle Uno", 36.71599, -4.4138],
      ["Playa de la Malagueta", "Malagueta beach", "Strand La Malagueta", 36.71644, -4.41094],
    ],
    2: [
      ["Caminito del Rey", "Caminito del Rey", "Caminito del Rey", 36.93115, -4.78674],
    ],
  }),
  "sevilla/sevilla-en-3-dias": dias({
    1: [
      ["Real Alcázar", "Royal Alcázar", "Königlicher Alcázar", 37.38321, -5.99018],
      ["Catedral y Giralda", "Cathedral and Giralda", "Kathedrale und Giralda", 37.38591, -5.99314],
      ["Barrio de Santa Cruz", "Santa Cruz quarter", "Viertel Santa Cruz", 37.38484, -5.99059],
      ["Plaza de España", "Plaza de España", "Plaza de España", 37.37697, -5.98694],
    ],
    2: [
      ["Puente de Isabel II (Triana)", "Isabel II Bridge (Triana)", "Brücke Isabel II (Triana)", 37.38628, -6.00243],
      ["Mercado de Triana", "Triana Market", "Markt von Triana", 37.38575, -6.00355],
      ["Iglesia de Santa Ana", "Santa Ana Church", "Kirche Santa Ana", 37.38284, -6.00009],
      ["Plaza del Salvador", "Plaza del Salvador", "Plaza del Salvador", 37.39007, -5.99269],
      ["Museo de Bellas Artes", "Fine Arts Museum", "Museum der Schönen Künste", 37.39242, -6.00001],
      ["Torre del Oro", "Torre del Oro", "Torre del Oro", 37.3824, -5.99632],
    ],
    3: [
      ["Casa de Pilatos (opción A)", "Casa de Pilatos (option A)", "Casa de Pilatos (Option A)", 37.39024, -5.98725],
      ["Itálica (opción B)", "Itálica (option B)", "Itálica (Option B)", 37.4419, -6.04532],
    ],
  }),
  "alicante/que-ver-en-alicante": dias({
    1: [
      ["Castillo de Santa Bárbara", "Santa Bárbara Castle", "Burg Santa Bárbara", 38.34911, -0.47751],
      ["Barrio de Santa Cruz", "Santa Cruz quarter", "Viertel Santa Cruz", 38.34781, -0.48322],
      ["Concatedral de San Nicolás", "Co-cathedral of San Nicolás", "Kokathedrale San Nicolás", 38.34562, -0.48234],
      ["Basílica de Santa María", "Basilica of Santa María", "Basilika Santa María", 38.34621, -0.47921],
      ["Explanada de España", "Explanada de España", "Explanada de España", 38.34314, -0.48329],
      ["MARQ", "MARQ", "MARQ", 38.35388, -0.47621],
      ["Playa del Postiguet", "Postiguet beach", "Strand Postiguet", 38.3462, -0.47631],
    ],
    2: [
      ["Isla de Tabarca", "Tabarca Island", "Insel Tabarca", 38.16492, -0.47317],
    ],
  }),
  "valencia/valencia-en-2-dias": dias({
    1: [
      ["Mercado Central", "Central Market", "Zentralmarkt", 39.47349, -0.37891],
      ["Lonja de la Seda", "Silk Exchange", "Seidenbörse", 39.47443, -0.37826],
      ["Catedral y Miguelete", "Cathedral and Miguelete", "Kathedrale und Miguelete", 39.47557, -0.37511],
      ["Plaza de la Virgen", "Plaza de la Virgen", "Plaza de la Virgen", 39.47639, -0.37528],
      ["Torres de Serranos (Barrio del Carmen)", "Serranos Towers (El Carmen)", "Torres de Serranos (El Carmen)", 39.47928, -0.37617],
      ["Ciudad de las Artes y las Ciencias", "City of Arts and Sciences", "Stadt der Künste und Wissenschaften", 39.45576, -0.35255],
      ["Ruzafa", "Ruzafa", "Ruzafa", 39.46204, -0.37139],
    ],
    2: [
      ["El Palmar (Albufera)", "El Palmar (Albufera)", "El Palmar (Albufera)", 39.3116, -0.31768],
      ["Playa de la Malvarrosa", "Malvarrosa beach", "Strand Malvarrosa", 39.47939, -0.32372],
      ["Plaza Redonda", "Plaza Redonda", "Plaza Redonda", 39.47358, -0.3766],
      ["Mercado de Colón", "Colón Market", "Markt Colón", 39.46895, -0.36836],
    ],
  }),
};

/** Mapas de una guía, a partir de su ciudad y su slug en español. */
export function obtenerMapasGuia(
  ciudad: string,
  slugEs: string | undefined
): DiaMapa[] {
  if (!slugEs) return [];
  return MAPAS[`${ciudad}/${slugEs}`] ?? [];
}

const RE_TITULO_DIA: Partial<Record<Idioma, RegExp>> = {
  es: /^D[ií]a\s+(\d+)\b/i,
  en: /^Day\s+(\d+)\b/i,
  de: /^Tag\s+(\d+)\b/i,
};

const RE_TITULO = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/g;

/**
 * Inserta un trozo `mapa` justo después de cada H2 o H3 «Día N» que tenga mapa
 * (algunas guías DE agrupan los días como H3 bajo un H2 de ruta).
 * Solo toca los trozos de HTML; las tarjetas de reserva quedan donde están.
 */
export function insertarMapasPorDia(
  trozos: TrozoGuia[],
  mapas: DiaMapa[],
  idioma: Idioma
): TrozoGuia[] {
  if (mapas.length === 0) return trozos;
  const porDia = new Map(mapas.map((m) => [m.dia, m] as const));
  const re = RE_TITULO_DIA[idioma] ?? /^D[ií]a\s+(\d+)\b/i;
  const salida: TrozoGuia[] = [];
  const usados = new Set<number>();
  for (const trozo of trozos) {
    if (trozo.tipo !== "html") {
      salida.push(trozo);
      continue;
    }
    let ultimo = 0;
    for (const m of trozo.html.matchAll(RE_TITULO)) {
      const texto = m[2].replace(/<[^>]+>/g, "").trim();
      const dia = re.exec(texto);
      if (!dia) continue;
      const mapa = porDia.get(Number(dia[1]));
      if (!mapa || usados.has(mapa.dia)) continue;
      usados.add(mapa.dia);
      const fin = (m.index ?? 0) + m[0].length;
      salida.push({ tipo: "html", html: trozo.html.slice(ultimo, fin) });
      salida.push({ tipo: "mapa", dia: mapa.dia, paradas: mapa.paradas });
      ultimo = fin;
    }
    if (ultimo < trozo.html.length) {
      salida.push({ tipo: "html", html: trozo.html.slice(ultimo) });
    }
  }
  return salida;
}
