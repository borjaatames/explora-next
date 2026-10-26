/**
 * Etiquetas de las tarjetas de actividad («Más popular», «Elección
 * ExploraSpain», «Nueva»). Tienen que ser ciertas y escasas: como mucho
 * TOPE_POR_ETIQUETA por ciudad, y cada actividad lleva una sola.
 *
 *  - popular: las que más opiniones tienen en la ciudad (mínimo 500).
 *  - eleccion: destacadas por nosotros (`destacada: true`), las mejor valoradas.
 *  - nueva: publicadas en los últimos DIAS_NUEVA días, las mejor valoradas.
 *
 * Se calcula en build (SSG): «Nueva» caduca sola en el siguiente despliegue.
 */

export type EtiquetaActividad = "popular" | "eleccion" | "nueva";

export type DatosEtiqueta = {
  slug: string;
  destacada?: boolean;
  fecha?: string;
  ratingProveedor?: number;
  numeroOpiniones?: number;
};

const TOPE_POR_ETIQUETA = 3;
const MIN_OPINIONES_POPULAR = 500;
const DIAS_NUEVA = 14;

function puntuacion(a: DatosEtiqueta): number {
  const rating = a.ratingProveedor ?? 0;
  const opiniones = a.numeroOpiniones ?? 0;
  return rating * Math.log10(opiniones + 10);
}

function esReciente(fecha: string | undefined, hoy: Date): boolean {
  if (!fecha) return false;
  const t = Date.parse(fecha);
  if (Number.isNaN(t)) return false;
  return hoy.getTime() - t <= DIAS_NUEVA * 24 * 60 * 60 * 1000;
}

export function calcularEtiquetas(
  actividades: DatosEtiqueta[],
  hoy: Date = new Date()
): Map<string, EtiquetaActividad> {
  const etiquetas = new Map<string, EtiquetaActividad>();
  const asignar = (lista: DatosEtiqueta[], etiqueta: EtiquetaActividad) => {
    lista
      .filter((a) => !etiquetas.has(a.slug))
      .slice(0, TOPE_POR_ETIQUETA)
      .forEach((a) => etiquetas.set(a.slug, etiqueta));
  };

  asignar(
    actividades
      .filter((a) => (a.numeroOpiniones ?? 0) >= MIN_OPINIONES_POPULAR)
      .sort((a, b) => (b.numeroOpiniones ?? 0) - (a.numeroOpiniones ?? 0)),
    "popular"
  );
  asignar(
    actividades
      .filter((a) => a.destacada === true)
      .sort((a, b) => puntuacion(b) - puntuacion(a)),
    "eleccion"
  );
  asignar(
    actividades
      .filter((a) => esReciente(a.fecha, hoy))
      .sort((a, b) => puntuacion(b) - puntuacion(a)),
    "nueva"
  );
  return etiquetas;
}

export const TEXTO_ETIQUETA: Record<"es" | "en", Record<EtiquetaActividad, string>> = {
  es: { popular: "Más popular", eleccion: "Elección ExploraSpain", nueva: "Nueva" },
  en: { popular: "Most popular", eleccion: "ExploraSpain pick", nueva: "New" },
};
