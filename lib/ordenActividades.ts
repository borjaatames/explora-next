import type { PrecioComparable } from "@/lib/precioComparable";

type Ordenable = {
  privada: boolean;
  destacada: boolean;
  numeroOpiniones?: number;
  ratingProveedor?: number;
  precio: PrecioComparable;
};

/**
 * Las privadas tienen pocas opiniones y, ordenando por reseñas, acaban en las
 * últimas páginas. Subimos las dos mejores a las posiciones 3 y 6 para que se
 * vean sin desordenar el resto.
 */
const POSICIONES_PRIVADAS = [2, 5] as const;

export function intercalarPrivadas<T extends Ordenable>(lista: T[]): T[] {
  const privadas = lista
    .filter((a) => a.privada)
    .sort(
      (a, b) =>
        (b.numeroOpiniones ?? 0) - (a.numeroOpiniones ?? 0) ||
        Number(b.destacada) - Number(a.destacada) ||
        a.precio.porPersona - b.precio.porPersona
    )
    .slice(0, POSICIONES_PRIVADAS.length);
  if (privadas.length === 0 || privadas.length === lista.length) return lista;
  const resto = lista.filter((a) => !privadas.includes(a));
  privadas.forEach((p, i) => {
    resto.splice(Math.min(POSICIONES_PRIVADAS[i], resto.length), 0, p);
  });
  return resto;
}

/** Con nota publicada primero; después, más opiniones. */
export function porPopularidad<T extends Ordenable>(a: T, b: T): number {
  const conNota = (x: T) =>
    typeof x.ratingProveedor === "number" && (x.numeroOpiniones ?? 0) > 0 ? 1 : 0;
  return conNota(b) - conNota(a) || (b.numeroOpiniones ?? 0) - (a.numeroOpiniones ?? 0);
}
