import Image from "next/image";
import { nombreProveedor, type ProveedorActividad } from "@/lib/afiliados";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Sello de proveedor / confianza.
 *
 * - En **tarjetas** (default, `conLogo` ausente): muestra solo "Pago seguro".
 *   Las tarjetas que enlazan a la actividad no llevan logo externo.
 * - En la **ficha de detalle** (`conLogo`): en actividades de afiliado
 *   (Viator / GetYourGuide) muestra "Ofrecida por {logo}" para dar
 *   transparencia — el cliente sabe en qué plataforma completará y pagará
 *   la reserva antes de pulsar Reservar, y no se siente engañado al ver la
 *   página del proveedor. En Bokun (reserva directa en ExploraSpain) no hay
 *   logo externo: se muestra "Pago seguro".
 *
 * Server Component puro (sin JS al cliente). Logos en /public/logos (SVG).
 */

type LogoInfo = { src: string; width: number; height: number };

const LOGOS: Partial<Record<ProveedorActividad, LogoInfo>> = {
  viator: { src: "/logos/viator.svg", width: 72, height: 18 },
  getyourguide: { src: "/logos/getyourguide.svg", width: 47, height: 40 },
};

type Props = {
  proveedor: ProveedorActividad;
  idioma: Idioma;
  /** true → ficha de detalle: muestra "Ofrecida por {logo}" en afiliados. */
  conLogo?: boolean;
  /** Clases extra para el contenedor (márgenes, alineación). */
  className?: string;
};

function SelloPagoSeguro({
  idioma,
  className,
}: {
  idioma: Idioma;
  className?: string;
}) {
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

export default function SelloProveedor({
  proveedor,
  idioma,
  conLogo,
  className,
}: Props) {
  // Solo en la ficha (conLogo) y solo si el proveedor tiene logo (afiliados).
  const logo = conLogo ? LOGOS[proveedor] : undefined;

  if (!logo) {
    return <SelloPagoSeguro idioma={idioma} className={className} />;
  }

  const texto = idioma === "es" ? "Ofrecida por" : "Offered by";
  const nombre = nombreProveedor(proveedor);

  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span className="text-xs text-slate-500">{texto}</span>
      <Image
        src={logo.src}
        alt={nombre}
        width={logo.width}
        height={logo.height}
        unoptimized
        className="inline-block"
      />
    </div>
  );
}
