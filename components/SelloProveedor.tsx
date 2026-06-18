import Image from "next/image";
import { nombreProveedor, type ProveedorActividad } from "@/lib/afiliados";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Sello "Ofrecida por {proveedor}" con el logo oficial.
 *
 * Da continuidad de marca y transparencia: el cliente sabe en qué
 * plataforma (Viator / GetYourGuide) completará y pagará la reserva antes
 * de pulsar. Server Component puro (sin JS al cliente).
 *
 * Logos en /public/logos (SVG). Se sirven sin optimizar (un SVG no se
 * optimiza) y con width/height explícitos para no provocar layout shift.
 */

type LogoInfo = { src: string; width: number; height: number };

const LOGOS: Partial<Record<ProveedorActividad, LogoInfo>> = {
  viator: { src: "/logos/viator.svg", width: 72, height: 18 },
  getyourguide: { src: "/logos/getyourguide.svg", width: 47, height: 40 },
};

type Props = {
  proveedor: ProveedorActividad;
  idioma: Idioma;
  /** Clases extra para el contenedor (márgenes, alineación). */
  className?: string;
};

export default function SelloProveedor({ proveedor, idioma, className }: Props) {
  // Bokun = reserva directa en ExploraSpain (pago seguro con Stripe), no es
  // afiliación. En vez de un logo externo, mostramos un sello de confianza
  // propio: la reserva y el pago se completan aquí mismo.
  if (proveedor === "bokun") {
    const texto =
      idioma === "es"
        ? "Reserva directa · Pago seguro"
        : "Direct booking · Secure payment";
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

  const logo = LOGOS[proveedor];
  if (!logo) return null;

  const texto = idioma === "es" ? "Ofrecida por" : "Offered by";
  const nombre = nombreProveedor(proveedor);

  return (
    <div
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
    >
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
