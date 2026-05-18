import type { SemFichaCiudad, SemIdioma, SemTour } from '@/lib/sem/types';
import SemTourCard from './SemTourCard';

type Props = {
  tours: SemTour[];
  landingSlug: string;
  /** Idioma de la landing. Default 'es' por retrocompatibilidad. */
  idioma?: SemIdioma;
  /**
   * Ciudad donde viven las fichas propias. Default 'madrid'
   * (retrocompatibilidad).
   */
  fichaCiudad?: SemFichaCiudad;
};

export default function SemTourGrid({
  tours,
  landingSlug,
  idioma = 'es',
  fichaCiudad = 'madrid',
}: Props) {
  const labels = LABELS_BY_LANG[idioma];
  const ariaLabel = idioma === 'es' ? 'Excursiones disponibles' : 'Available tours';

  return (
    <section
      id="tours"
      className="bg-white px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
      aria-label={ariaLabel}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-end justify-between">
          <p className="text-sm font-semibold text-slate-900">
            {tours.length} {labels.opcionesDisponibles}
          </p>
          <p className="text-xs text-slate-500">{labels.ordenadasPor}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {tours.map((tour) => (
            <SemTourCard
              key={tour.id}
              tour={tour}
              landingSlug={landingSlug}
              idioma={idioma}
              fichaCiudad={fichaCiudad}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const LABELS_BY_LANG: Record<
  SemIdioma,
  { opcionesDisponibles: string; ordenadasPor: string }
> = {
  es: {
    opcionesDisponibles: 'opciones disponibles',
    ordenadasPor: 'Ordenadas por más reservadas',
  },
  en: {
    opcionesDisponibles: 'options available',
    ordenadasPor: 'Sorted by most booked',
  },
};
