type Props = {
  texto: string;
};

export default function SemBannerGarantia({ texto }: Props) {
  return (
    <div className="border-b border-amber-300 bg-amber-100 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 text-center">
        <ShieldIcon className="h-5 w-5 flex-shrink-0 text-amber-700" />
        <p className="text-sm text-amber-900">
          <strong className="font-semibold">Reserva sin riesgo:</strong>{' '}
          {texto.replace(/^Reserva sin riesgo:\s*/i, '')}
        </p>
      </div>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}
