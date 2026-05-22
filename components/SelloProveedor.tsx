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
