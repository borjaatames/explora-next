import Link from "next/link";
import Image from "next/image";

/**
 * Tarjeta CTA de ciudad (Guías / Actividades / Atracciones).
 *
 * Foto de fondo con degradado y título/descripción superpuestos. Si no hay
 * imagen, cae a un fondo sólido del color de acento. Componente agnóstico de
 * idioma: los textos (título, descripción, CTA) llegan por props.
 *
 * Se usa en la página de ciudad y, como bloque "Sigue explorando", al pie de
 * la página de actividades de cada ciudad.
 */

export type CtaCiudadCardProps = {
  href: string;
  imagen?: string;
  imagenAlt?: string;
  titulo: string;
  descripcion: string;
  cta: string;
  acento: "sky" | "amber" | "slate";
};

export default function CtaCiudadCard({
  href,
  imagen,
  imagenAlt,
  titulo,
  descripcion,
  cta,
  acento,
}: CtaCiudadCardProps) {
  let ringClass: string;
  let gradientClass: string;
  let descripcionClass: string;
  let solidBgClass: string;
  // Texto oscuro sobre ámbar: el blanco sobre azafran-500 no pasa WCAG AA.
  let solidTextClass = "text-white";
  let solidDescripcionClass: string;

  if (acento === "amber") {
    ringClass = "focus-visible:ring-azafran-500";
    gradientClass = "bg-gradient-to-t from-azafran-900/90 via-azafran-700/55 to-transparent";
    descripcionClass = "text-azafran-50";
    solidBgClass = "bg-azafran-500 hover:bg-azafran-600";
    solidTextClass = "text-piedra-900";
    solidDescripcionClass = "text-piedra-800";
  } else if (acento === "slate") {
    ringClass = "focus-visible:ring-piedra-500";
    gradientClass = "bg-gradient-to-t from-piedra-900/90 via-piedra-700/55 to-transparent";
    descripcionClass = "text-piedra-200";
    solidBgClass = "bg-piedra-800 hover:bg-piedra-900";
    solidDescripcionClass = descripcionClass;
  } else {
    ringClass = "focus-visible:ring-anil-500";
    gradientClass = "bg-gradient-to-t from-anil-900/90 via-anil-700/55 to-transparent";
    descripcionClass = "text-anil-100";
    solidBgClass = "bg-anil-500 hover:bg-anil-600";
    solidDescripcionClass = descripcionClass;
  }

  if (imagen) {
    return (
      <Link
        href={href}
      prefetch={false}
        className={"group relative block aspect-[4/3] md:aspect-[5/3] overflow-hidden rounded-xl border border-piedra-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " + ringClass}
      >
        <Image
          src={imagen}
          alt={imagenAlt ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className={"absolute inset-0 " + gradientClass} aria-hidden="true" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7 text-white">
          <h2 className="font-fraunces text-xl md:text-2xl font-bold mb-2 leading-tight">
            {titulo}
          </h2>
          <p className={descripcionClass + " text-sm md:text-base mb-3 max-w-md"}>
            {descripcion}
          </p>
          <span className="inline-flex items-center font-semibold text-base">
            {cta} <span aria-hidden="true" className="ml-2">→</span>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={"group block aspect-[4/3] md:aspect-[5/3] overflow-hidden rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " + solidBgClass + " " + ringClass}
    >
      <div className={"flex flex-col justify-end h-full p-6 md:p-7 " + solidTextClass}>
        <h2 className="font-fraunces text-xl md:text-2xl font-bold mb-2 leading-tight">
          {titulo}
        </h2>
        <p className={solidDescripcionClass + " text-sm md:text-base mb-3 max-w-md"}>
          {descripcion}
        </p>
        <span className="inline-flex items-center font-semibold text-base">
          {cta} <span aria-hidden="true" className="ml-2">→</span>
        </span>
      </div>
    </Link>
  );
}
