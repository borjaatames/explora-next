import type { SemGarantia } from '@/lib/sem/types';

type Props = {
  titulo: string;
  items: SemGarantia[];
};

export default function SemGarantias({ titulo, items }: Props) {
  return (
    <section className="border-y border-sky-200 bg-sky-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-playfair text-xl font-bold text-slate-900 sm:text-2xl">
          {titulo}
        </h2>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.titulo}
              className="flex gap-3 rounded-lg border border-sky-200 bg-white p-4"
            >
              <div className="flex-shrink-0 text-sky-700">
                <GarantiaIcon name={item.icono} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {item.titulo}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {item.subtitulo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GarantiaIcon({
  name,
}: {
  name: 'shield' | 'clock' | 'mobile' | 'headset';
}) {
  const props = {
    className: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true,
  };

  if (name === 'shield') {
    return (
      <svg {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    );
  }

  if (name === 'clock') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === 'mobile') {
    return (
      <svg {...props}>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path strokeLinecap="round" d="M11 18h2" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.364 5.636A9 9 0 0021 12v3a3 3 0 01-3 3h-2v-7h4M3 15v-3a9 9 0 0115.636-5.636M3 15a3 3 0 003 3h2v-7H3"
      />
    </svg>
  );
}
