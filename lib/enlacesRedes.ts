/**
 * Enlaces de la página /links (el «enlace en la bio» de Instagram).
 * Cada vez que se publica en redes, se añade arriba la entrada nueva
 * con su guía o ficha en inglés y en español. Las más antiguas salen
 * de la lista al pasar de MAX_ENLACES.
 */

export interface EnlaceRedes {
  /** Fecha de la publicación en redes (AAAA-MM-DD). */
  fecha: string;
  tituloEn: string;
  tituloEs: string;
  /** Ruta de la página en inglés (con /en). */
  urlEn: string;
  /** Ruta de la página en español; null si solo existe en inglés. */
  urlEs: string | null;
  imagen: string;
  imagenAlt: string;
}

export const MAX_ENLACES = 12;

export const ENLACES_REDES: readonly EnlaceRedes[] = [
  {
    fecha: "2026-11-11",
    tituloEn: "Romantic things to do in Barcelona, with prices",
    tituloEs: "Planes románticos en Barcelona, con precios",
    urlEn: "/en/guides/barcelona/romantic-things-to-do-in-barcelona",
    urlEs: null,
    imagen: "/images/actividades/barcelona/barcos/barcos-velero-atardecer.webp",
    imagenAlt: "Velero al atardecer frente a la costa de Barcelona",
  },
  {
    fecha: "2026-11-11",
    tituloEn: "Roque Nublo and Pico de las Nieves from Las Palmas",
    tituloEs: "Roque Nublo y Pico de las Nieves desde Las Palmas",
    urlEn: "/en/cities/gran-canaria/activities/roque-nublo-pico-de-las-nieves-tour-from-las-palmas",
    urlEs: "/ciudades/gran-canaria/actividades/roque-nublo-pico-nieves-desde-las-palmas",
    imagen: "/images/actividades/gran-canaria/roque-nublo/roque-nublo-monolito.webp",
    imagenAlt: "El monolito del Roque Nublo, en las cumbres de Gran Canaria",
  },
  {
    fecha: "2026-11-11",
    tituloEn: "Christmas in Málaga: Calle Larios light shows",
    tituloEs: "Navidad en Málaga: luces de calle Larios",
    urlEn: "/en/guides/malaga/christmas-in-malaga",
    urlEs: "/guias/malaga/navidad-malaga",
    imagen: "/images/actividades/malaga/calle-larios/calle-larios-unsplash-ZZEjI6yNxd0.webp",
    imagenAlt: "La calle Larios de Málaga, en el centro histórico",
  },
  {
    fecha: "2026-11-10",
    tituloEn: "Visiting Timanfaya, Lanzarote",
    tituloEs: "Timanfaya: cómo visitarlo",
    urlEn: "/en/guides/lanzarote/visiting-timanfaya",
    urlEs: "/guias/lanzarote/timanfaya-como-visitarlo",
    imagen: "/images/actividades/lanzarote/zonas/timanfaya-montanas-del-fuego.webp",
    imagenAlt: "Las Montañas del Fuego, en el Parque Nacional de Timanfaya",
  },
  {
    fecha: "2026-11-08",
    tituloEn: "Málaga in one day",
    tituloEs: "Qué ver en Málaga en un día",
    urlEn: "/en/guides/malaga/malaga-in-one-day",
    urlEs: "/guias/malaga/que-ver-en-malaga-en-un-dia",
    imagen: "/images/actividades/malaga/alcazaba/panoramica-malaga.webp",
    imagenAlt: "Vista panorámica de Málaga desde la Alcazaba",
  },
  {
    fecha: "2026-11-06",
    tituloEn: "Prado Museum free entry",
    tituloEs: "Museo del Prado gratis",
    urlEn: "/en/guides/madrid/prado-museum-free-entry",
    urlEs: "/guias/madrid/museo-del-prado-gratis",
    imagen: "/images/guias/museo-del-prado-entradas-agotadas.jpg",
    imagenAlt: "Fachada del Museo del Prado en Madrid",
  },
];
