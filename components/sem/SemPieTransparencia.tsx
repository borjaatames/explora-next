import type { SemIdioma } from '@/lib/sem/types';

type Props = {
  /** Idioma de la landing. Default 'es' por retrocompatibilidad. */
  idioma?: SemIdioma;
};

/**
 * Pie de transparencia editorial y de afiliación.
 *
 * - ES: copy original validado (Ley 3/1991 Competencia Desleal). Menciona
 *       Viator como partner concreto (estado real al 8 mayo 2026).
 * - EN: copy partner-agnóstico ("our trusted partners") cara a la futura
 *       pasada multi-partner Viator + GetYourGuide. Cumple los mismos
 *       requisitos legales (UK ASA / FTC USA / EU Directive 2005/29/EC):
 *       (1) declarar relación comercial, (2) explicar comisión, (3) aclarar
 *       que no hay coste extra para el usuario.
 */
export default function SemPieTransparencia({ idioma = 'es' }: Props) {
  const texto = idioma === 'es' ? TEXTO_ES : TEXTO_EN;
  const ariaLabel =
    idioma === 'es'
      ? 'Información editorial y de afiliación'
      : 'Editorial disclosure and affiliate information';

  return (
    <section
      aria-label={ariaLabel}
      className="bg-slate-50 border-t border-b border-slate-200 py-8 md:py-10"
    >
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-sm text-slate-600 leading-relaxed text-center">
          {texto}
        </p>
      </div>
    </section>
  );
}

const TEXTO_ES =
  'ExploraSpain es una guía editorial de viajes por España. Recomendamos solo las experiencias que consideramos que merecen la pena, no todo lo disponible. Las reservas se gestionan a través de Viator, nuestro partner de pagos. Recibimos una comisión por cada reserva confirmada, sin coste adicional para ti.';

const TEXTO_EN =
  'ExploraSpain is an editorial travel guide to Spain. We only recommend experiences we consider worth your time, not everything that exists. Bookings are processed by our trusted partners. We earn a commission on each confirmed booking at no additional cost to you.';
