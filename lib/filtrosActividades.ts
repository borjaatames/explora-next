/**
 * Clave del botón «Privados» en el filtro de tipos de actividad. No es una
 * categoría: filtra por el campo `privada` y se combina con los tipos (AND).
 * Vive aparte de `lib/actividades.ts` porque este módulo lo importa también
 * el componente cliente, y aquel usa `fs`.
 */
export const CLAVE_FILTRO_PRIVADOS = "privados";
