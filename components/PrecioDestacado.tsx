type Props = {
  textoDesde: string;
  precio: string;
  textoPorPersona: string;
  /** Nota media ya formateada (p. ej. "4,1"); sin ella no se pinta la caja. */
  rating?: string;
  /** Nº de opiniones ya formateado con su palabra (p. ej. "1.532 opiniones"). */
  opiniones?: string;
};

/**
 * Precio «desde» grande y nota del proveedor encima del widget de GYG, que
 * sustituye al bloque de reserva propio y no enseña el precio hasta elegir
 * fecha. Server Component sin JS.
 */
export default function PrecioDestacado({
  textoDesde,
  precio,
  textoPorPersona,
  rating,
  opiniones,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3 rounded-lg border border-piedra-200 bg-white p-4">
      <div>
        <p className="text-xs text-piedra-500">{textoDesde}</p>
        <p className="text-3xl font-bold leading-tight text-piedra-900">{precio}</p>
        <p className="text-xs text-piedra-500">{textoPorPersona}</p>
      </div>
      {rating ? (
        <p className="inline-flex items-center gap-1.5 rounded-md bg-azafran-50 px-2.5 py-1.5 text-sm">
          <span aria-hidden="true" className="text-azafran-500">
            ★
          </span>
          <span className="font-semibold text-piedra-900">{rating}</span>
          {opiniones ? <span className="text-piedra-600">· {opiniones}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
