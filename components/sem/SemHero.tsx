import type { SemTrustSignal } from '@/lib/sem/types';

type Props = {
  titulo: string;
  subtitulo: string;
  pruebaSocialTitular: string;
  trustSignals: SemTrustSignal[];
};

export default function SemHero({
  titulo,
  subtitulo,
  pruebaSocialTitular,
  trustSignals,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-sky-500 px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      {/* Decoración sutil de círculos para dar profundidad */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/5"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Pill amber con la prueba social masiva */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow-sm">
          <StarIcon className="h-3.5 w-3.5 text-slate-900" />
          <span>{pruebaSocialTitular}</span>
        </div>

        {/* H1 sobre fondo azul */}
        <h1 className="font-playfair text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
          {titulo}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm text-sky-50 sm:text-base">
          {subtitulo}
        </p>

        {/* Trust signals translúcidos sobre el azul, con iconos amber */}
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {trustSignals.map((signal) => (
            <li
              key={signal.texto}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur-sm"
            >
              <CheckIcon className="h-3.5 w-3.5 text-amber-300" />
              {signal.texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8l-6.3 4.4L8 13.8l-6-4.4h7.6z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
