'use client';

import type { SemLandingFrontmatter, SemTour } from '@/lib/sem/types';

type Props = {
  titulo: string;
  categorias: SemLandingFrontmatter['comparador']['categorias'];
};

export default function SemComparador({ titulo, categorias }: Props) {
  const handleClick = (categoria: SemTour['categoria']) => {
    const target = document.querySelector(
      `[data-categoria="${categoria}"]`,
    ) as HTMLElement | null;

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('ring-2', 'ring-sky-400', 'ring-offset-2');
      setTimeout(() => {
        target.classList.remove('ring-2', 'ring-sky-400', 'ring-offset-2');
      }, 1500);
    }
  };

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {titulo}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categorias.map((cat) => {
            const isDestacada = cat.categoria === 'dia-completo';

            return (
              <button
                key={cat.categoria}
                type="button"
                onClick={() => handleClick(cat.categoria)}
                className={
                  isDestacada
                    ? 'flex flex-col items-center rounded-lg bg-sky-500 px-3 py-3 text-center shadow-md shadow-sky-500/30 transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2'
                    : 'flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center transition-colors hover:border-sky-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2'
                }
              >
                <CategoryIcon
                  name={cat.icono}
                  className={
                    isDestacada
                      ? 'h-5 w-5 text-white'
                      : 'h-5 w-5 text-slate-600'
                  }
                />
                <span
                  className={
                    isDestacada
                      ? 'mt-1.5 text-sm font-semibold text-white'
                      : 'mt-1.5 text-sm font-semibold text-slate-900'
                  }
                >
                  {cat.label}
                </span>
                <span
                  className={
                    isDestacada
                      ? 'text-xs text-sky-50'
                      : 'text-xs text-slate-500'
                  }
                >
                  Desde {cat.precio_desde} €
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoryIcon({
  name,
  className,
}: {
  name: 'clock' | 'sun' | 'map' | 'crown';
  className?: string;
}) {
  const props = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true,
  } as const;

  if (name === 'clock') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === 'sun') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        />
      </svg>
    );
  }

  if (name === 'map') {
    return (
      <svg {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3"
        />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 16l-2-9 5 4 4-7 4 7 5-4-2 9H5zM5 20h14"
      />
    </svg>
  );
}
