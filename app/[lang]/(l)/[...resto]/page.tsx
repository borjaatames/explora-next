import { notFound } from "next/navigation";

/**
 * Captura cualquier URL que no corresponda a una ruta del sitio y devuelve
 * un 404 con la navegación completa (antes lo hacía app/not-found.tsx,
 * que ya no puede existir con dos layouts raíz).
 */
export default function RutaInexistente(): never {
  notFound();
}
