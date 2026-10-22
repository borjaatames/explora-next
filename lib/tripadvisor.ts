import datos from "./tripadvisor-bokun.json";
import datosGyg from "./tripadvisor-gyg.json";
import type { Idioma } from "./i18n/types";

// =============================================================================
// Tripadvisor de los proveedores de Bókun
// -----------------------------------------------------------------------------
// Bókun pasa a los revendedores, para cada producto, el resumen de Tripadvisor
// del proveedor (nota, nº de opiniones, ranking y locationId). Lo guardamos en
// lib/tripadvisor-bokun.json y lo mostramos tal cual, con atribución. El texto
// de las reseñas NO viene de Bókun: se pide a la Content API oficial de
// Tripadvisor (ver app/api/tripadvisor/[locationId]/route.ts).
// =============================================================================

export type RankingTripadvisor = {
  posicion: number;
  total: number;
  categoria: string;
  lugar: string;
};

export type DatosTripadvisor = {
  locationId: string;
  nombre: string;
  rating: number;
  opiniones: number;
  ranking?: RankingTripadvisor;
};

/** Reseña tal como la devuelve nuestra ruta /api/tripadvisor/[locationId]. */
export type ResenaTripadvisor = {
  id: string;
  titulo: string;
  texto: string;
  rating: number;
  fecha: string;
  autor: string;
  lugarAutor: string | null;
  url: string;
};

type Archivo = { productos: Record<string, DatosTripadvisor> };

/** Solo se muestra una nota que ayude a decidir: 4,5+ y al menos 10 opiniones. */
const RATING_MINIMO = 4.5;
const OPINIONES_MINIMAS = 10;
/** El ranking solo aporta si es un puesto alto. */
const PUESTO_MAXIMO = 50;

export function datosTripadvisorBokun(
  bokunProductId: number | undefined
): DatosTripadvisor | null {
  if (!bokunProductId) return null;
  const d = (datos as Archivo).productos[String(bokunProductId)];
  if (!d || d.rating < RATING_MINIMO || d.opiniones < OPINIONES_MINIMAS) return null;
  return d;
}

const CATEGORIAS_ES: Record<string, string> = {
  Tours: "tours",
  "Food & Drink": "gastronomía",
  Nightlife: "ocio nocturno",
  "Boat Tours & Water Sports": "paseos en barco y deportes acuáticos",
  "Outdoor Activities": "actividades al aire libre",
  "Sights & Landmarks": "lugares de interés",
};

const LUGARES_ES: Record<string, string> = {
  Seville: "Sevilla",
  "Eivissa (Ibiza)": "Ibiza",
};

const CATEGORIAS_EN: Record<string, string> = {
  Tours: "tours",
  "Food & Drink": "food & drink",
  Nightlife: "nightlife",
  "Boat Tours & Water Sports": "boat tours & water sports",
  "Outdoor Activities": "outdoor activities",
  "Sights & Landmarks": "sights & landmarks",
};

/** «n.º 14 de 606 en gastronomía en Barcelona» / «#14 of 606 food & drink in Barcelona». */
export function textoRankingTripadvisor(
  r: RankingTripadvisor | undefined,
  idioma: Idioma
): string | null {
  if (!r || r.posicion > PUESTO_MAXIMO) return null;
  if (idioma === "es") {
    const total = r.total.toLocaleString("es-ES");
    const cat = CATEGORIAS_ES[r.categoria] ?? r.categoria.toLowerCase();
    const lugar = LUGARES_ES[r.lugar] ?? r.lugar;
    return `n.º ${r.posicion} de ${total} en ${cat} en ${lugar}`;
  }
  const total = r.total.toLocaleString("en-GB");
  const cat = CATEGORIAS_EN[r.categoria] ?? r.categoria.toLowerCase();
  return `#${r.posicion} of ${total} ${cat} in ${r.lugar}`;
}

// =============================================================================
// Tripadvisor de las actividades de GetYourGuide
// -----------------------------------------------------------------------------
// GYG no pasa datos de Tripadvisor. En lib/tripadvisor-gyg.json guardamos, por
// id de tour de GYG (el «-t123456» de urlReserva), el locationId de la ficha de
// Tripadvisor del proveedor que la organiza o, si la vende la propia GYG, del
// monumento o parque. Solo se usa para pedir las reseñas reales a la API.
// =============================================================================

/** Lo mínimo para pedir y atribuir reseñas: de quién son y su locationId. */
export type FuenteResenas = Pick<DatosTripadvisor, "locationId" | "nombre">;

type ArchivoGyg = { tours: Record<string, FuenteResenas> };

export function fuenteResenasGyg(urlReserva: string | undefined): FuenteResenas | null {
  if (!urlReserva || !urlReserva.includes("getyourguide.")) return null;
  const id = urlReserva.match(/-t(\d+)(?:\/|\?|$)/)?.[1];
  if (!id) return null;
  return (datosGyg as ArchivoGyg).tours[id] ?? null;
}
