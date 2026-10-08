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
 * título encima. Sin portada, cae a un bloque slate-900 sobrio.
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
    <header className="relative isolate bg-slate-900 text-white overflow-hidden">
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
            className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-900/90 via-slate-900/45 to-slate-900/15"
            aria-hidden="true"
          />
        </>
      ) : null}
      <div
        className={
          "max-w-6xl mx-auto px-4 flex flex-col justify-end pb-10 md:pb-12 " +
          (imagen ? "min-h-[420px] md:min-h-[520px] pt-24" : "pt-14 md:pt-16")
        }
      >
        <nav aria-label={migasLabel} className="text-sm text-sky-100 mb-4">
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
        <span className="self-start inline-block bg-amber-400 text-slate-900 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-4">
          {etiqueta}
        </span>
        <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight max-w-4xl mb-4">
          {titulo}
        </h1>
        <p className="text-lg md:text-xl text-sky-50 max-w-3xl leading-relaxed mb-5">
          {descripcion}
        </p>
        <p className="text-sm text-sky-100 flex flex-wrap gap-x-2 gap-y-1">
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
      <div className="sticky top-28 border-t-2 border-slate-900 pt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
          {titulo}
        </p>
        <ol className="space-y-2 text-sm">
          {entradas.map((e) => (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                className="text-slate-600 hover:text-sky-700 transition-colors leading-snug block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
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
