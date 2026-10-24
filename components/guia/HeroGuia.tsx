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
 * En móvil es más bajo y compacto (descripción a 3 líneas) para que la
 * respuesta corta y el bloque de reservas asomen en la primera pantalla.
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
          "max-w-6xl mx-auto px-4 flex flex-col justify-end pb-6 md:pb-12 " +
          (imagen ? "min-h-[300px] md:min-h-[520px] pt-16 md:pt-24" : "pt-10 md:pt-16")
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
        <h1 className="font-fraunces text-2xl md:text-5xl font-bold leading-tight max-w-4xl mb-3 md:mb-4">
          {titulo}
        </h1>
        <p className="text-base md:text-xl text-anil-50 max-w-3xl leading-relaxed mb-3 md:mb-5 line-clamp-3 md:line-clamp-none">
          {descripcion}
        </p>
        <p className="text-xs md:text-sm text-anil-100 flex flex-wrap gap-x-2 gap-y-1">
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
  );
}
