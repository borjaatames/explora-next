'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { SemLandingResumen } from '@/lib/sem/landings';

type Props = {
  /** URL del listado de actividades de la ciudad (fallback por defecto). */
  urlActividadesCiudad: string;
  /** Copy del CTA por defecto (ej. "← Ver más actividades en Barcelona"). */
  textoActividadesCiudad: string;
  /**
   * Lista de landings SEM publicadas en el idioma actual. Cada entrada
   * permite resolver un `?from=<slug>` recibido por la URL al destino real.
   */
  landingsConocidas: SemLandingResumen[];
  /** Copy del CTA cuando el usuario viene de una landing SEM. */
  textoVolverLanding: string;
};

/**
 * CTA al final de la ficha de actividad.
 *
 * - Si el usuario llega desde una landing SEM (la card de la landing añade
 *   `?from=<slug>` al href), validamos el slug contra `landingsConocidas` y
 *   mostramos un enlace "← Volver" que apunta a esa landing.
 * - Si no, mostramos el enlace por defecto al listado de actividades de la
 *   ciudad.
 *
 * Client Component a propósito: `useSearchParams` lo exige y mantenemos
 * el resto de la ficha como Server Component (SSG).
 */
export default function BotonVolverFicha({
  urlActividadesCiudad,
  textoActividadesCiudad,
  landingsConocidas,
  textoVolverLanding,
}: Props) {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const landingOrigen = from
    ? landingsConocidas.find((l) => l.slug === from)
    : undefined;

  const href = landingOrigen?.url ?? urlActividadesCiudad;
  const texto = landingOrigen ? textoVolverLanding : textoActividadesCiudad;

  return (
    <Link
      href={href}
      className="text-sky-600 hover:text-sky-700 font-semibold focus-visible:outline-none focus-visible:underline"
    >
      {texto}
    </Link>
  );
}
