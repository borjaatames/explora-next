'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
 * Por qué `useEffect` y NO `useSearchParams`:
 * La página de la ficha se genera estáticamente con `generateStaticParams`.
 * Usar `useSearchParams` dentro de un Client Component sin envolverlo en
 * `<Suspense>` provoca un error de build en Next.js 14. Leer el query
 * desde `window.location.search` tras la hidratación es suficiente y
 * mantiene la SSG limpia.
 */
export default function BotonVolverFicha({
  urlActividadesCiudad,
  textoActividadesCiudad,
  landingsConocidas,
  textoVolverLanding,
}: Props) {
  const [from, setFrom] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setFrom(params.get('from'));
  }, []);

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
