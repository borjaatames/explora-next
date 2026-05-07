'use client';

type Props = {
  titulo: string;
  subtitulo: string;
  textoBoton: string;
};

export default function SemCTAFinal({ titulo, subtitulo, textoBoton }: Props) {
  const handleClick = () => {
    const grid = document.getElementById('tours');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-sky-500 px-4 py-12 text-center text-white sm:px-6 lg:px-8">
      {/* Decoración sutil */}
      <div
        className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-white/5"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl">
        <h2 className="font-playfair text-lg font-bold sm:text-xl">{titulo}</h2>
        <p className="mt-2 text-sm text-sky-50">{subtitulo}</p>

        <button
          type="button"
          onClick={handleClick}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-7 py-3 text-sm font-semibold text-slate-900 shadow-md transition-colors hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-500"
        >
          {textoBoton}
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}
