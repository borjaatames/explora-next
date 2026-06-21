import type { ProveedorActividad } from "@/lib/afiliados";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Sello de confianza "Pago seguro" con icono de candado.
 *
 * Unificado para todos los proveedores (Bokun, Viator, GetYourGuide): se
 * muestra siempre el mismo distintivo "Pago seguro", sin logos externos ni
 * el texto "Reserva directa". Server Component puro (sin JS al cliente).
 *
 * Se mantiene la prop `proveedor` por compatibilidad con los puntos de
 * llamada, aunque ya no afecta al render.
 */

type Props = {
  proveedor: ProveedorActividad;
  idioma: Idioma;
  /** Clases extra para el contenedor (márgenes, alineación). */
  className?: string;
};

export default function SelloProveedor({ idioma, className }: Props) {
  const texto = idioma === "es" ? "Pago seguro" : "Secure payment";

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 ${
        className ?? ""
      }`}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-sky-600"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span>{texto}</span>
    </div>
  );
}
