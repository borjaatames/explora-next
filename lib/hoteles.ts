import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Idioma } from "@/lib/i18n/types";
import type { PreguntaFrecuente } from "@/lib/actividades";

/**
 * Páginas de hotel (afiliación Iberostar vía CJ).
 *
 * Contenido en content/hoteles/{es,en}/{ciudad}/{slug}.md. El slug es el de
 * iberostar.com, igual en los dos idiomas, para no mantener parejas.
 * Solo ES y EN: el resto de idiomas no tiene páginas de hotel.
 */

export const IDIOMAS_HOTELES = ["es", "en"] as const;
export type IdiomaHotel = (typeof IDIOMAS_HOTELES)[number];

export function esIdiomaHotel(idioma: string): idioma is IdiomaHotel {
  return (IDIOMAS_HOTELES as ReadonlyArray<string>).includes(idioma);
}

export const ETIQUETAS_HOTEL = ["adultos", "familias", "cinco", "mar", "todo-incluido", "spa"] as const;
export type EtiquetaHotel = (typeof ETIQUETAS_HOTEL)[number];

export type FotoHotel = {
  /** `{id}.{ext}` de apiimg.iberostar.com, p. ej. `49667.jpeg`. */
  src: string;
  alt: string;
};

export type HabitacionHotel = {
  nombre: string;
  /** Superficie tal como la da Iberostar, p. ej. «31» o «60-90». */
  m2?: string;
  nota?: string;
};

export type DistanciaHotel = { lugar: string; valor: string };

export type HotelFrontmatter = {
  nombre: string;
  ciudad: string;
  /** Id de zona dentro de la ciudad (ZONAS_HOTELES). */
  zona: string;
  /** Localidad o playa, p. ej. «Costa Adeje». */
  lugar: string;
  estrellas: number;
  soloAdultos: boolean;
  etiquetas: EtiquetaHotel[];
  direccion: string;
  lat: number;
  lng: number;
  /** Ruta de destino en iberostar.com sin idioma, p. ej. `tenerife/iberostar-grand-mencey`. */
  iberostar: string;
  /** URL completa de Iberostar cuando la que sale de `iberostar` no funciona en ese idioma. */
  urlIberostar?: string;
  titulo: string;
  descripcion: string;
  resumen: string;
  idealPara: string;
  siEsParaTi: string[];
  mejorOtro: string[];
  porQue: string[];
  servicios: string[];
  habitaciones: HabitacionHotel[];
  regimen?: string;
  entrada?: string;
  salida?: string;
  distancias: DistanciaHotel[];
  fotos: FotoHotel[];
  faq: PreguntaFrecuente[];
  fecha: string;
  publicado?: boolean;
};

export type Hotel = HotelFrontmatter & {
  slug: string;
  url: string;
  urlReserva: string;
};

export type HotelCompleto = Hotel & { contenidoHtml: string };

export type ZonaHoteles = {
  id: string;
  nombre: Record<IdiomaHotel, string>;
  texto: Record<IdiomaHotel, string>;
};

export type CiudadHoteles = {
  intro: Record<IdiomaHotel, string>;
  zonas: ZonaHoteles[];
};

/**
 * Zonas por ciudad, en el orden en que se pintan. Cada hotel apunta a una
 * con `zona`; una zona sin hoteles no se muestra.
 */
export const ZONAS_HOTELES: Record<string, CiudadHoteles> = {
  tenerife: {
    intro: {
      es: "En Tenerife casi todos los hoteles Iberostar están en Costa Adeje, en el sur, donde suele hacer más sol y están las playas de arena. El único en el norte es el Grand Mencey, en la capital.",
      en: "Almost all of Tenerife's Iberostar hotels are in Costa Adeje, in the sunnier south where the sandy beaches are. The only one up north is the Grand Mencey, in the capital.",
    },
    zonas: [
      {
        id: "sur",
        nombre: { es: "Sur · Costa Adeje", en: "South · Costa Adeje" },
        texto: {
          es: "Playas de arena (Fañabé, Torviscas, El Duque), paseo marítimo y el aeropuerto Sur cerca. Lo mejor para playa y piscina.",
          en: "Sandy beaches (Fañabé, Torviscas, El Duque), a seafront promenade and the South airport close by. Best for beach and pool time.",
        },
      },
      {
        id: "norte",
        nombre: { es: "Norte · Santa Cruz", en: "North · Santa Cruz" },
        texto: {
          es: "Ciudad, tiendas y vida local. Para quien quiere moverse por Anaga, La Laguna y el norte, o viaja por trabajo.",
          en: "City life, shopping and a local feel. For travellers exploring Anaga, La Laguna and the north, or visiting on business.",
        },
      },
    ],
  },
  mallorca: {
    intro: {
      es: "Iberostar tiene en Mallorca tres núcleos: los alrededores de Palma (Playa de Palma, junto a la ciudad y el aeropuerto, y Costa de la Calma); el norte, en la bahía de Alcudia y Playa de Muro; y varias calas del sur y el este.",
      en: "Iberostar's Mallorca hotels sit in three areas: around Palma (Playa de Palma, next to the city and the airport, plus Costa de la Calma); the north, on Alcudia Bay and Playa de Muro; and a handful of coves in the south and east.",
    },
    zonas: [
      {
        id: "palma",
        nombre: { es: "Palma y alrededores", en: "Palma and around" },
        texto: {
          es: "Playa de Palma, un arenal largo junto a la ciudad y el aeropuerto, y la tranquila Costa de la Calma, al oeste. Cómodo para combinar playa y ciudad.",
          en: "Playa de Palma, a long beach by the city and the airport, and quiet Costa de la Calma to the west. Easy to mix beach days with the city.",
        },
      },
      {
        id: "norte",
        nombre: { es: "Norte · Alcudia y Playa de Muro", en: "North · Alcudia & Playa de Muro" },
        texto: {
          es: "La bahía de Alcudia: playa amplia, agua poco profunda y el parque natural de s'Albufera al lado. Muy de familias.",
          en: "Alcudia Bay: a wide beach, shallow water and the s'Albufera nature park next door. A family favourite.",
        },
      },
      {
        id: "sur-este",
        nombre: { es: "Sur y este · Calas", en: "South & east · Coves" },
        texto: {
          es: "Calas del sureste, Es Trenc y Font de sa Cala, junto a Cala Ratjada. Más tranquilo y lejos de Palma: mejor con coche.",
          en: "South-east coves, Es Trenc and Font de sa Cala, near Cala Ratjada. Quieter and further from Palma: easier with a car.",
        },
      },
    ],
  },
  fuerteventura: {
    intro: {
      es: "Los tres hoteles Iberostar de Fuerteventura están en Jandía, en el extremo sur de la isla, frente a las playas largas de Morro Jable.",
      en: "All three Iberostar hotels in Fuerteventura are in Jandía, at the island's southern tip, facing the long beaches of Morro Jable.",
    },
    zonas: [
      {
        id: "jandia",
        nombre: { es: "Sur · Jandía", en: "South · Jandía" },
        texto: {
          es: "Kilómetros de arena blanca y agua tranquila. Lejos del aeropuerto (alrededor de una hora en coche) y del norte de la isla.",
          en: "Miles of white sand and calm water. A long way from the airport (about an hour's drive) and from the north of the island.",
        },
      },
    ],
  },
  lanzarote: {
    intro: {
      es: "Iberostar tiene un hotel en Lanzarote, en Playa Blanca, en el sur, el núcleo más tranquilo de la isla y salida de los ferris a Fuerteventura.",
      en: "Iberostar has one hotel in Lanzarote, in Playa Blanca in the south: the island's quietest resort and the ferry port for Fuerteventura.",
    },
    zonas: [
      {
        id: "playa-blanca",
        nombre: { es: "Sur · Playa Blanca", en: "South · Playa Blanca" },
        texto: {
          es: "Paseo marítimo, playas pequeñas y Papagayo cerca. Buena base para Timanfaya y Los Hervideros.",
          en: "A seafront promenade, small beaches and Papagayo nearby. A good base for Timanfaya and Los Hervideros.",
        },
      },
    ],
  },
  ibiza: {
    intro: {
      es: "El hotel Iberostar de Ibiza está en Santa Eulària des Riu, en la costa este, una zona más tranquila que Sant Antoni o Platja d'en Bossa.",
      en: "Iberostar's Ibiza hotel is in Santa Eulària des Riu, on the east coast: a calmer area than Sant Antoni or Platja d'en Bossa.",
    },
    zonas: [
      {
        id: "santa-eulalia",
        nombre: { es: "Este · Santa Eulària", en: "East · Santa Eulària" },
        texto: {
          es: "Paseo marítimo, puerto deportivo y calas cercanas. Ambiente tranquilo y para adultos.",
          en: "A seafront promenade, a marina and coves nearby. A relaxed, grown-up atmosphere.",
        },
      },
    ],
  },
  malaga: {
    intro: {
      es: "En la provincia de Málaga hay dos hoteles Iberostar, en lados opuestos de la capital: uno en Marbella, al oeste, y otro en Torrox Costa, en la Axarquía, al este.",
      en: "There are two Iberostar hotels in Málaga province, on opposite sides of the city: one in Marbella to the west and one in Torrox Costa, in the Axarquía, to the east.",
    },
    zonas: [
      {
        id: "marbella",
        nombre: { es: "Oeste · Marbella", en: "West · Marbella" },
        texto: {
          es: "Costa del Sol occidental: playas, Puerto Banús y golf. Buena base para Ronda y Gibraltar.",
          en: "The western Costa del Sol: beaches, Puerto Banús and golf. A good base for Ronda and Gibraltar.",
        },
      },
      {
        id: "axarquia",
        nombre: { es: "Este · Torrox Costa", en: "East · Torrox Costa" },
        texto: {
          es: "Costa más tranquila, cerca de Nerja y de sus cuevas, y de los pueblos blancos de la Axarquía.",
          en: "A quieter coast near Nerja and its caves, and the white villages of the Axarquía.",
        },
      },
    ],
  },
  cadiz: {
    intro: {
      es: "Los dos hoteles Iberostar de Cádiz están juntos en Novo Sancti Petri (Chiclana de la Frontera), frente a la playa de La Barrosa.",
      en: "Both Iberostar hotels in Cádiz province stand side by side in Novo Sancti Petri (Chiclana de la Frontera), on La Barrosa beach.",
    },
    zonas: [
      {
        id: "chiclana",
        nombre: { es: "Chiclana · Novo Sancti Petri", en: "Chiclana · Novo Sancti Petri" },
        texto: {
          es: "Playa larga de arena fina y campos de golf. Cádiz, Jerez y Vejer quedan a menos de una hora en coche.",
          en: "A long fine-sand beach and golf courses. Cádiz, Jerez and Vejer are all under an hour's drive away.",
        },
      },
    ],
  },
};

/** Destino de cada ciudad en las URL de iberostar.com cuando cambia por idioma. */
const DESTINO_EN: Record<string, string> = { mallorca: "majorca", cadiz: "cadis" };

/**
 * Enlace de afiliado CJ (IBEROSTAR EMEA & UK, 6306984).
 * Formato de enlace profundo de CJ: https://www.anrdoezrs.net/click-{PID}-{AID}?url={destino}.
 * PID = propiedad web de ExploraSpain en CJ; AID = anuncio «Deeplink» de cada mercado.
 * Mientras falten los AID, el botón va directo a iberostar.com (sin comisión).
 */
const CJ_PID = "";
const CJ_AID: Record<IdiomaHotel, string> = { es: "", en: "" };

export function urlIberostar(idioma: IdiomaHotel, ruta: string): string {
  const [destino, slug] = ruta.split("/");
  return idioma === "es"
    ? `https://www.iberostar.com/es/hoteles/${destino}/${slug}/`
    : `https://www.iberostar.com/en/hotels/${DESTINO_EN[destino] ?? destino}/${slug}/`;
}

export function urlReservaHotel(idioma: IdiomaHotel, ruta: string, urlPropia?: string): string {
  const destino = urlPropia ?? urlIberostar(idioma, ruta);
  const aid = CJ_AID[idioma];
  if (!CJ_PID || !aid) return destino;
  return `https://www.anrdoezrs.net/click-${CJ_PID}-${aid}?url=${encodeURIComponent(destino)}`;
}

export function urlFotoHotel(src: string): string {
  const [id, ext] = src.split(".");
  return `https://apiimg.iberostar.com/uploads/image/${id}/crops/16:9/1920/image.${ext}`;
}

export function urlHotelesDeCiudad(idioma: IdiomaHotel, ciudad: string): string {
  return idioma === "es" ? `/ciudades/${ciudad}/hoteles` : `/en/cities/${ciudad}/hotels`;
}

export function urlHotel(idioma: IdiomaHotel, ciudad: string, slug: string): string {
  return `${urlHotelesDeCiudad(idioma, ciudad)}/${slug}`;
}

const RAIZ = path.join(process.cwd(), "content", "hoteles");

function leer(idioma: IdiomaHotel, ciudad: string, archivo: string): { hotel: Hotel; contenido: string } | null {
  const ruta = path.join(RAIZ, idioma, ciudad, archivo);
  const { data, content } = matter(fs.readFileSync(ruta, "utf8"));
  const fm = data as HotelFrontmatter;
  if (fm.publicado === false) return null;
  const slug = archivo.replace(/\.md$/, "");
  return {
    hotel: {
      ...fm,
      slug,
      url: urlHotel(idioma, ciudad, slug),
      urlReserva: urlReservaHotel(idioma, fm.iberostar, fm.urlIberostar),
    },
    contenido: content,
  };
}

export function obtenerCiudadesConHoteles(idioma: Idioma): string[] {
  if (!esIdiomaHotel(idioma)) return [];
  const dir = path.join(RAIZ, idioma);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && obtenerHotelesDeCiudad(idioma, e.name).length > 0)
    .map((e) => e.name);
}

/** Hoteles de una ciudad, por orden de zona y después de estrellas y nombre. */
export function obtenerHotelesDeCiudad(idioma: Idioma, ciudad: string): Hotel[] {
  if (!esIdiomaHotel(idioma)) return [];
  const dir = path.join(RAIZ, idioma, ciudad);
  if (!fs.existsSync(dir)) return [];
  const zonas = ZONAS_HOTELES[ciudad]?.zonas.map((z) => z.id) ?? [];
  return fs
    .readdirSync(dir)
    .filter((a) => a.endsWith(".md"))
    .map((a) => leer(idioma, ciudad, a)?.hotel)
    .filter((h): h is Hotel => Boolean(h))
    .sort(
      (a, b) =>
        zonas.indexOf(a.zona) - zonas.indexOf(b.zona) ||
        b.estrellas - a.estrellas ||
        a.nombre.localeCompare(b.nombre, idioma)
    );
}

export async function obtenerHotel(idioma: Idioma, ciudad: string, slug: string): Promise<HotelCompleto | null> {
  if (!esIdiomaHotel(idioma) || !/^[a-z0-9-]+$/.test(slug)) return null;
  const archivo = `${slug}.md`;
  if (!fs.existsSync(path.join(RAIZ, idioma, ciudad, archivo))) return null;
  const leido = leer(idioma, ciudad, archivo);
  if (!leido) return null;
  const html = await remark().use(remarkGfm).use(remarkHtml).process(leido.contenido);
  return { ...leido.hotel, contenidoHtml: html.toString() };
}

/** Existe la página de listado de hoteles de esa ciudad en ese idioma. */
export function urlHotelesSiExiste(idioma: Idioma, ciudad: string): string | null {
  return esIdiomaHotel(idioma) && obtenerHotelesDeCiudad(idioma, ciudad).length > 0
    ? urlHotelesDeCiudad(idioma, ciudad)
    : null;
}

export function urlHotelSiExiste(idioma: Idioma, ciudad: string, slug: string): string | null {
  if (!esIdiomaHotel(idioma)) return null;
  return obtenerHotelesDeCiudad(idioma, ciudad).some((h) => h.slug === slug) ? urlHotel(idioma, ciudad, slug) : null;
}

/** Zonas de la ciudad que tienen al menos un hotel, con sus hoteles. */
export function agruparPorZona(ciudad: string, hoteles: Hotel[]): { zona: ZonaHoteles; hoteles: Hotel[] }[] {
  return (ZONAS_HOTELES[ciudad]?.zonas ?? [])
    .map((zona) => ({ zona, hoteles: hoteles.filter((h) => h.zona === zona.id) }))
    .filter((g) => g.hoteles.length > 0);
}

const sinMarca = (n: string): string => n.replace(/^Iberostar (Heritage |Selection |Waves )?/, "");

function lista(nombres: string[], idioma: IdiomaHotel): string {
  if (nombres.length <= 1) return nombres.join("");
  const y = idioma === "es" ? " y " : " and ";
  return `${nombres.slice(0, -1).join(", ")}${y}${nombres[nombres.length - 1]}`;
}

/** Preguntas del listado de una ciudad, calculadas a partir de las fichas. */
export function faqHotelesCiudad(idioma: IdiomaHotel, ciudad: string, nombreCiudad: string, hoteles: Hotel[]): PreguntaFrecuente[] {
  const es = idioma === "es";
  const faq: PreguntaFrecuente[] = [];
  const nombres = (hs: Hotel[]) => lista(hs.map((h) => sinMarca(h.nombre)), idioma);
  const grupos = agruparPorZona(ciudad, hoteles);
  faq.push({
    pregunta: es ? `¿Qué hoteles Iberostar hay en ${nombreCiudad}?` : `Which Iberostar hotels are there in ${nombreCiudad}?`,
    respuesta: es
      ? `Hay ${hoteles.length}: ${grupos.map((g) => `${g.zona.nombre.es} (${nombres(g.hoteles)})`).join("; ")}.`
      : `There are ${hoteles.length}: ${grupos.map((g) => `${g.zona.nombre.en} (${nombres(g.hoteles)})`).join("; ")}.`,
  });
  const adultos = hoteles.filter((h) => h.soloAdultos);
  if (adultos.length > 0 && adultos.length < hoteles.length) {
    faq.push({
      pregunta: es ? `¿Qué hoteles Iberostar de ${nombreCiudad} son solo para adultos?` : `Which Iberostar hotels in ${nombreCiudad} are adults-only?`,
      respuesta: es
        ? `${nombres(adultos)}. El resto admite niños.`
        : `${nombres(adultos)}. The others welcome children.`,
    });
  }
  const familias = hoteles.filter((h) => h.etiquetas.includes("familias"));
  if (familias.length > 0) {
    faq.push({
      pregunta: es ? `¿Cuál es mejor para ir con niños?` : `Which is best with children?`,
      respuesta: es
        ? `Los que tienen piscinas o actividades para niños son ${nombres(familias)}. En cada ficha explicamos qué ofrece cada uno.`
        : `The ones with children's pools or kids' activities are ${nombres(familias)}. Each hotel page explains what it offers.`,
    });
  }
  const ti = hoteles.filter((h) => h.etiquetas.includes("todo-incluido"));
  if (ti.length > 0) {
    faq.push({
      pregunta: es ? `¿Cuáles tienen todo incluido?` : `Which offer all-inclusive?`,
      respuesta: es
        ? `Ofrecen régimen de todo incluido ${nombres(ti)}. Conviene comprobar en Iberostar qué incluye para tus fechas.`
        : `All-inclusive is available at ${nombres(ti)}. Check on Iberostar what it includes for your dates.`,
    });
  }
  return faq;
}
