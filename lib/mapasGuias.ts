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

/** Guías de un día sin títulos «Día N»: un único mapa de la ruta (`dia: 0`). */
const ruta = (filas: Fila[]): DiaMapa[] => [{ dia: 0, paradas: filas.map(p) }];

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
  "barcelona/barcelona-en-1-dia": ruta([
    ["Sagrada Família", "Sagrada Família", "Sagrada Família", 41.4035, 2.17443],
    ["Casa Batlló y Passeig de Gràcia", "Casa Batlló and Passeig de Gràcia", "Casa Batlló und Passeig de Gràcia", 41.39154, 2.1647],
    ["Barrio Gótico (Plaça de Sant Jaume)", "Gothic Quarter (Plaça de Sant Jaume)", "Gotisches Viertel (Plaça de Sant Jaume)", 41.38245, 2.1768],
    ["El Born", "El Born", "El Born", 41.38476, 2.18281],
    ["Búnkers del Carmel", "Carmel Bunkers", "Bunker del Carmel", 41.41926, 2.16154],
    ["Park Güell", "Park Güell", "Park Güell", 41.41423, 2.15246],
  ]),
  "bilbao/bilbao-en-un-dia": ruta([
    ["Museo Guggenheim", "Guggenheim Museum", "Guggenheim-Museum", 43.26843, -2.93406],
    ["Puente Zubizuri", "Zubizuri Bridge", "Zubizuri-Brücke", 43.26632, -2.9278],
    ["Casco Viejo (Catedral de Santiago)", "Old Town (Santiago Cathedral)", "Altstadt (Kathedrale Santiago)", 43.25721, -2.9237],
    ["Plaza Nueva", "Plaza Nueva", "Plaza Nueva", 43.25901, -2.92269],
    ["Mercado de la Ribera", "La Ribera Market", "Markt La Ribera", 43.25555, -2.92434],
    ["Azkuna Zentroa", "Azkuna Zentroa", "Azkuna Zentroa", 43.25969, -2.93712],
    ["Funicular de Artxanda", "Artxanda funicular", "Standseilbahn Artxanda", 43.2728, -2.92123],
  ]),
  "cadiz/cadiz-en-un-dia": ruta([
    ["Catedral y Torre del Reloj", "Cathedral and Clock Tower", "Kathedrale und Uhrturm", 36.52895, -6.29532],
    ["Teatro Romano (El Pópulo)", "Roman Theatre (El Pópulo)", "Römisches Theater (El Pópulo)", 36.52826, -6.29367],
    ["Torre Tavira", "Torre Tavira", "Torre Tavira", 36.53196, -6.2984],
    ["Mercado Central", "Central Market", "Zentralmarkt", 36.53041, -6.29821],
    ["La Caleta", "La Caleta beach", "Strand La Caleta", 36.52848, -6.3065],
    ["Castillo de San Sebastián", "San Sebastián Castle", "Burg San Sebastián", 36.52829, -6.31561],
  ]),
  "cordoba/cordoba-en-un-dia": ruta([
    ["Mezquita-Catedral", "Mosque-Cathedral", "Mezquita-Kathedrale", 37.87903, -4.77945],
    ["Judería y Sinagoga", "Jewish Quarter and Synagogue", "Judenviertel und Synagoge", 37.87981, -4.78338],
    ["Alcázar de los Reyes Cristianos", "Alcázar of the Christian Monarchs", "Alcázar der Christlichen Könige", 37.87523, -4.78306],
    ["Puente Romano y Calahorra", "Roman Bridge and Calahorra", "Römische Brücke und Calahorra", 37.87563, -4.77659],
    ["Palacio de Viana", "Viana Palace", "Palast von Viana", 37.88867, -4.77432],
  ]),
  "girona/que-ver-en-girona-en-un-dia": ruta([
    ["Casas del Onyar (puente de Eiffel)", "Onyar houses (Eiffel bridge)", "Häuser am Onyar (Eiffel-Brücke)", 41.98455, 2.8239],
    ["Catedral", "Cathedral", "Kathedrale", 41.98751, 2.82627],
    ["El Call (barrio judío)", "El Call (Jewish quarter)", "El Call (jüdisches Viertel)", 41.98601, 2.82544],
    ["Baños Árabes", "Arab Baths", "Arabische Bäder", 41.98806, 2.8257],
    ["Sant Pere de Galligants", "Sant Pere de Galligants", "Sant Pere de Galligants", 41.98873, 2.82661],
    ["Paseo de la muralla", "City walls walk", "Stadtmauer-Rundgang", 41.98662, 2.82943],
  ]),
  "salamanca/salamanca-en-1-dia": ruta([
    ["Plaza Mayor", "Plaza Mayor", "Plaza Mayor", 40.96503, -5.66406],
    ["Casa de las Conchas y Clerecía", "House of Shells and Clerecía", "Muschelhaus und Clerecía", 40.96296, -5.66565],
    ["Universidad (Edificio Histórico)", "University (Historic Building)", "Universität (historisches Gebäude)", 40.96147, -5.66733],
    ["Catedrales Nueva y Vieja", "New and Old Cathedrals", "Neue und Alte Kathedrale", 40.96058, -5.66598],
    ["Casa Lis", "Casa Lis", "Casa Lis", 40.9595, -5.66686],
    ["Convento de San Esteban", "San Esteban Convent", "Kloster San Esteban", 40.96011, -5.66259],
    ["Puente Romano", "Roman Bridge", "Römische Brücke", 40.95769, -5.67024],
  ]),
  "santiago-de-compostela/santiago-en-un-dia": ruta([
    ["Plaza del Obradoiro y Catedral", "Praza do Obradoiro and Cathedral", "Praza do Obradoiro und Kathedrale", 42.8805, -8.54576],
    ["Plaza de la Quintana", "Praza da Quintana", "Praza da Quintana", 42.88034, -8.54379],
    ["Rúa do Franco", "Rúa do Franco", "Rúa do Franco", 42.87816, -8.54532],
    ["Mercado de Abastos", "Abastos Market", "Markt Abastos", 42.87998, -8.54121],
    ["San Martiño Pinario", "San Martiño Pinario", "San Martiño Pinario", 42.88213, -8.54428],
    ["Parque de la Alameda", "Alameda Park", "Alameda-Park", 42.87787, -8.54947],
  ]),
  "sevilla/sevilla-en-1-dia": ruta([
    ["Real Alcázar", "Royal Alcázar", "Königlicher Alcázar", 37.38321, -5.99018],
    ["Catedral y Giralda", "Cathedral and Giralda", "Kathedrale und Giralda", 37.38591, -5.99314],
    ["Plaza de España", "Plaza de España", "Plaza de España", 37.37697, -5.98694],
    ["Puente de Triana", "Triana Bridge", "Triana-Brücke", 37.38628, -6.00243],
    ["Mercado de Triana", "Triana Market", "Markt von Triana", 37.38575, -6.00355],
    ["Calle Betis", "Calle Betis", "Calle Betis", 37.3833, -5.99969],
  ]),
  "tarragona/tarragona-en-un-dia": ruta([
    ["Anfiteatro Romano", "Roman Amphitheatre", "Römisches Amphitheater", 41.11444, 1.25881],
    ["Circo y Torre del Pretori", "Circus and Praetorium Tower", "Circus und Prätoriumsturm", 41.11654, 1.25801],
    ["Catedral y Part Alta", "Cathedral and Part Alta", "Kathedrale und Part Alta", 41.11935, 1.25807],
    ["Passeig Arqueològic (murallas)", "Archaeological Walk (walls)", "Archäologischer Spaziergang (Mauern)", 41.12037, 1.25794],
    ["Balcó del Mediterrani", "Balcony of the Mediterranean", "Balkon des Mittelmeers", 41.11377, 1.25652],
    ["El Serrallo", "El Serrallo", "El Serrallo", 41.11, 1.24083],
  ]),
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

/** H2 tras el que va el mapa de la ruta en las guías de un día (`dia: 0`). */
const RE_TITULO_RUTA: Partial<Record<Idioma, RegExp>> = {
  es: /^(La ruta|El plan)\b/i,
  en: /\b(route|day plan)\b|^The plan\b/i,
  de: /(Route|Tagesroute|Tagesplan|organisiert)/i,
};

const RE_TITULO = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/g;

/**
 * Inserta un trozo `mapa` justo después de cada H2 o H3 «Día N» que tenga mapa
 * (algunas guías DE agrupan los días como H3 bajo un H2 de ruta). El mapa de
 * ruta (`dia: 0`) de las guías de un día va tras el H2 «La ruta / El plan».
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
  const reRuta = RE_TITULO_RUTA[idioma] ?? RE_TITULO_RUTA.es!;
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
      const numero = dia
        ? Number(dia[1])
        : m[1] === "2" && reRuta.test(texto)
          ? 0
          : null;
      if (numero === null) continue;
      const mapa = porDia.get(numero);
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
