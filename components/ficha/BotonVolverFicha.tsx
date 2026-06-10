import Link from 'next/link';

type Props = {
  /** URL del listado de actividades de la ciudad. */
  urlActividadesCiudad: string;
  /** Copy del CTA (ej. "← Ver más actividades en Barcelona"). */
  textoActividadesCiudad: string;
};

/**
 * CTA al final de la ficha de actividad: enlace al listado de actividades
 * de la ciudad. Antes este componente resolvía un `?from=<slug>` heredado
 * de las landings SEM dedicadas; al retirarlas (junio 2026) solo queda el
 * enlace por defecto y el componente vuelve a ser server-rendered puro.
 */
export default function BotonVolverFicha({
  urlActividadesCiudad,
  textoActividadesCiudad,
}: Props) {
  return (
    <Link
      href={urlActividadesCiudad}
      className="text-sky-600 hover:text-sky-700 font-semibold focus-visible:outline-none focus-visible:underline"
    >
      {textoActividadesCiudad}
    </Link>
  );
}
