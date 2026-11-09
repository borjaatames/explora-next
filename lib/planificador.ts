import type { Idioma } from "@/lib/i18n/types";
import type { ActividadCardData } from "@/components/ciudad/ActividadesFiltradas";

/**
 * Planificador «¿Qué hago en…?»: lógica pura (sin `fs`), compartida entre el
 * servidor (datos estáticos por ciudad) y el componente cliente (puntuación).
 */

export type Acompanantes = "pareja" | "familia" | "amigos" | "grupo";
export type Presupuesto = "30" | "60" | "120" | "sinLimite";
export type Interes =
  | "monumentos"
  | "gastronomia"
  | "noche"
  | "naturaleza"
  | "excursiones"
  | "ninos";

/** Tarjeta de actividad + los datos que usa la puntuación. */
export type ActividadPlanificador = ActividadCardData & {
  /** Edad mínima declarada en la ficha, si la hay. */
  edadMinima?: number;
  /** Lleva alcohol o es de ocio nocturno: no se propone a familias. */
  soloAdultos: boolean;
  duracionMinutos?: number;
};

export type CiudadPlanificador = {
  slug: string;
  nombre: string;
  total: number;
};

export const ACOMPANANTES: ReadonlyArray<Acompanantes> = ["pareja", "familia", "amigos", "grupo"];
export const PRESUPUESTOS: ReadonlyArray<Presupuesto> = ["30", "60", "120", "sinLimite"];
export const INTERESES: ReadonlyArray<Interes> = [
  "monumentos",
  "gastronomia",
  "noche",
  "naturaleza",
  "excursiones",
  "ninos",
];

/** Categorías de ficha (`CATEGORIAS_ACTIVIDAD`) que cubre cada interés. */
const CATEGORIAS_POR_INTERES: Readonly<Record<Interes, ReadonlyArray<string>>> = {
  monumentos: ["visitasGuiadas", "entradas", "toursCiudad"],
  gastronomia: ["toursGastronomicos", "talleres"],
  noche: ["espectaculos", "nocturno"],
  naturaleza: ["aventura", "agua"],
  excursiones: ["excursionesDia"],
  ninos: ["parques", "agua", "entradas"],
};

/** Afinidad extra de cada tipo de grupo con cada categoría (0-2). */
const AFINIDAD: Readonly<Record<Acompanantes, Readonly<Record<string, number>>>> = {
  pareja: { espectaculos: 2, toursGastronomicos: 2, nocturno: 1, talleres: 1, agua: 1, excursionesDia: 1 },
  familia: { parques: 2, agua: 2, entradas: 1, aventura: 1, toursCiudad: 1 },
  amigos: { nocturno: 2, toursGastronomicos: 2, aventura: 2, agua: 1, talleres: 1 },
  grupo: { excursionesDia: 1, toursGastronomicos: 1, talleres: 1, aventura: 1 },
};

const TOPE_PRESUPUESTO: Readonly<Record<Presupuesto, number>> = {
  "30": 30,
  "60": 60,
  "120": 120,
  sinLimite: Number.POSITIVE_INFINITY,
};

export type Respuestas = {
  acompanantes: Acompanantes;
  presupuesto: Presupuesto;
  intereses: ReadonlyArray<Interes>;
};

/**
 * Calidad acotada: la nota pesa más que el volumen de opiniones, y el volumen
 * se satura a partir de ~10.000 para que un tour masivo en grupo no tape
 * siempre a un privado con pocas reseñas.
 */
function calidad(a: ActividadPlanificador): number {
  const nota = a.ratingProveedor ?? 4.5;
  const opiniones = a.numeroOpiniones ?? 0;
  return (nota - 4) * 6 + Math.min(Math.log10(opiniones + 10), 4) * 1.5;
}

function puntuar(a: ActividadPlanificador, r: Respuestas): number {
  const categoriasBuscadas = new Set(r.intereses.flatMap((i) => CATEGORIAS_POR_INTERES[i]));
  const encaja = categoriasBuscadas.size === 0 || categoriasBuscadas.has(a.categoria);
  let puntos = calidad(a);
  if (encaja) puntos += 8;
  puntos += (AFINIDAD[r.acompanantes][a.categoria] ?? 0) * 1.5;
  if (a.destacada) puntos += 1;
  if (a.cancelacionGratuita) puntos += 0.5;
  // En grupo grande, las privadas por grupo salen a buen precio por persona.
  if (r.acompanantes === "grupo" && a.privada) puntos += 4;
  if (r.acompanantes === "pareja" && a.privada) puntos += 2;
  return encaja ? puntos : puntos - 8;
}

function apta(a: ActividadPlanificador, r: Respuestas): boolean {
  if (a.precio.porPersona > TOPE_PRESUPUESTO[r.presupuesto]) return false;
  if (r.acompanantes === "familia") {
    if (a.soloAdultos) return false;
    if (typeof a.edadMinima === "number" && a.edadMinima >= 12) return false;
  }
  return true;
}

/**
 * Propuesta ordenada: lo que encaja con los intereses primero y, como mucho,
 * dos actividades de la misma categoría seguidas para que el plan sea variado.
 */
export function recomendar(
  actividades: ReadonlyArray<ActividadPlanificador>,
  r: Respuestas,
  maximo = 9
): ActividadPlanificador[] {
  const candidatas = actividades
    // Los traslados de aeropuerto no son planes: nunca se proponen.
    .filter((a) => a.categoria !== "traslados" && apta(a, r))
    .map((a) => ({ a, p: puntuar(a, r) }))
    .sort((x, y) => y.p - x.p)
    .map((x) => x.a);

  const porCategoria = new Map<string, number>();
  const elegidas: ActividadPlanificador[] = [];
  const reserva: ActividadPlanificador[] = [];
  for (const a of candidatas) {
    const n = porCategoria.get(a.categoria) ?? 0;
    if (n < 3) {
      elegidas.push(a);
      porCategoria.set(a.categoria, n + 1);
    } else {
      reserva.push(a);
    }
    if (elegidas.length >= maximo) break;
  }
  for (const a of reserva) {
    if (elegidas.length >= maximo) break;
    elegidas.push(a);
  }
  return elegidas;
}

/** Palabras del título que delatan alcohol u ocio nocturno solo para adultos. */
const PATRON_ADULTOS =
  /\b(vino|vinos|wine|wines|winery|bodega|bodegas|cata|catas|tasting|cerveza|cervezas|beer|cava|sangr[ií]a|pub|bares|bar crawl|karaoke|discoteca|club|nightlife|despedida|cocktail|c[oó]ctel|gin)\b/i;

export function esSoloAdultos(titulo: string, categoria: string): boolean {
  return categoria === "nocturno" || PATRON_ADULTOS.test(titulo);
}

export function urlPlanificador(idioma: Idioma): string {
  return idioma === "es" ? "/planificador" : `/${idioma}/planner`;
}

/** JSON estático con las actividades de una ciudad (route handler). */
export function urlDatosPlanificador(idioma: Idioma, ciudad: string): string {
  return `/planificador-datos/${idioma}/${ciudad}`;
}
