import type { SemTour } from '@/lib/sem/types';
import SemTourCard from './SemTourCard';

type Props = {
  tours: SemTour[];
  landingSlug: string;
};

export default function SemTourGrid({ tours, landingSlug }: Props) {
  return (
    <section
      id="tours"
      className="bg-white px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
      aria-label="Excursiones disponibles"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-end justify-between">
          <p className="text-sm font-semibold text-slate-900">
            {tours.length} opciones disponibles
          </p>
          <p className="text-xs text-slate-500">
            Ordenadas por más reservadas
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {tours.map((tour) => (
            <SemTourCard
              key={tour.id}
              tour={tour}
              landingSlug={landingSlug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
