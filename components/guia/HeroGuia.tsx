import Image from "next/image";
import Link from "next/link";

export type MigaGuia = { label: string; href?: string };

type Props = {
  etiqueta: string;
  titulo: string;
  descripcion: string;
  imagen?: string;
  imagenAlt?: string;
  meta: ReadonlyArray<string>;
  migas: ReadonlyArray<MigaGuia>;
  migasLabel: string;
};

/**
 * Hero editorial de guía: foto de portada a sangre con velo inferior y el
 * título encima. Sin portada, cae a un bloque piedra-900 sobrio.
 * En móvil solo lleva migas, etiqueta y título (la entradilla y la firma se
 * ven desde md): así la respuesta corta y la primera opción con su botón de
 * reserva entran en la primera pantalla. Los visitantes que llegan desde
 * ChatGPT ya traen la respuesta y salían sin ver nada que pulsar.
 */
export default function HeroGuia({
  etiqueta,
  titulo,
  descripcion,
  imagen,
  imagenAlt,
  meta,
  migas,
  migasLabel,
}: Props) {
  return (
    <header className="relative isolate bg-piedra-900 text-white overflow-hidden">
      {imagen ? (
        <>
          <Image
            src={imagen}
            alt={imagenAlt || titulo}
            fill
            priority
            sizes="100vw"
            className="object-cover -z-10"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-piedra-900/90 via-piedra-900/45 to-piedra-900/15"
            aria-hidden="true"
          />
        </>
      ) : null}
      <div
        className={
          "max-w-6xl mx-auto px-4 flex flex-col justify-end pb-5 md:pb-12 " +
          (imagen ? "min-h-[220px] md:min-h-[520px] pt-12 md:pt-24" : "pt-8 md:pt-16")
        }
      >
        <nav aria-label={migasLabel} className="text-xs md:text-sm text-anil-100 mb-3 md:mb-4 line-clamp-1 md:line-clamp-none">
          {migas.map((m, i) => (
            <span key={`${m.label}-${i}`}>
              {i > 0 ? " › " : null}
              {m.href ? (
                <Link href={m.href} className="hover:text-white transition-colors">
                  {m.label}
                </Link>
              ) : (
                <span className="text-white">{m.label}</span>
              )}
            </span>
          ))}
        </nav>
        <span className="self-start inline-block bg-azafran-400 text-piedra-900 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3 md:mb-4">
          {etiqueta}
        </span>
        <h1 className="font-fraunces text-2xl md:text-5xl font-bold leading-tight max-w-4xl md:mb-4">
          {titulo}
        </h1>
        <p className="hidden md:block text-xl text-anil-50 max-w-3xl leading-relaxed mb-5">
          {descripcion}
        </p>
        <p className="hidden md:flex text-sm text-anil-100 flex-wrap gap-x-2 gap-y-1">
          {meta.map((m, i) => (
            <span key={`${m}-${i}`}>
              {i > 0 ? "· " : null}
              {m}
            </span>
          ))}
        </p>
      </div>
    </header>
  );
}

export function IndiceGuia({
  titulo,
  entradas,
}: {
  titulo: string;
  entradas: ReadonlyArray<{ id: string; texto: string }>;
}) {
  return (
    <>
    {/* Móvil y tableta: índice plegable encima del texto. */}
    <details className="lg:hidden mb-8 rounded-lg border border-piedra-200 bg-white [&_summary::-webkit-details-marker]:hidden group">
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 text-base font-semibold text-piedra-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 rounded-lg">
        <span>
          {titulo} ({entradas.length})
        </span>
        <span aria-hidden="true" className="text-xl leading-none text-piedra-500 group-open:rotate-45 transition-transform">
          +
        </span>
      </summary>
      <ol className="list-decimal space-y-2 px-4 pb-4 pl-9 text-sm">
        {entradas.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className="text-anil-600 hover:text-anil-700 transition-colors leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 rounded"
            >
              {e.texto}
            </a>
          </li>
        ))}
      </ol>
    </details>
    <nav aria-label={titulo} className="hidden lg:block">
      <div className="sticky top-28 border-t-2 border-piedra-900 pt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-piedra-500 mb-3">
          {titulo}
        </p>
        <ol className="space-y-2 text-sm">
          {entradas.map((e) => (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                className="text-piedra-600 hover:text-anil-700 transition-colors leading-snug block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 rounded"
              >
                {e.texto}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
    </>
  );
}
