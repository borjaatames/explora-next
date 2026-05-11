'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SemIdioma, SemTour } from '@/lib/sem/types';
import { construirUrlAfiliado } from '@/lib/sem/url-builder';

type Props = {
  label: string;
  textoBoton: string;
  tourAncla: SemTour;
  landingSlug: string;
  /** Idioma de la landing. Default 'es' por retrocompatibilidad. */
  idioma?: SemIdioma;
  /**
   * Etiqueta superior en uppercase. Si no se provee, se usa el default por
   * idioma (`ETIQUETA_SUPERIOR_DEFAULT`).
   */
  etiquetaSuperior?: string;
};

/**
 * Sticky CTA flotante en móvil. Desktop lo oculta.
 *
 * Aparece tras hacer scroll de ~300px para no estorbar el hero.
 * Apunta al tour ancla (definido por `ancla: true` en el frontmatter).
 *
 * Comportamiento de apertura: `window.open` en nueva pestaña con
 * `noopener,noreferrer` (igual que `SemTourCard` desde commit 59fcbbd).
 * Mantiene la landing viva: si el usuario decide volver, encuentra el resto
 * del catálogo intacto. Estándar en afiliación.
 *
 * Soporta multi-proveedor: usa `construirUrlAfiliado` que despacha a Viator
 * o GetYourGuide según `tourAncla.proveedor`.
 */
export default function SemStickyMobile({
  label,
  textoBoton,
  tourAncla,
  landingSlug,
  idioma = 'es',
  etiquetaSuperior,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // URL externa precomputada para SEO/SSR. El click la reconstruye con gclid.
  const urlExternaFallback =
    tourAncla.url_reserva ?? tourAncla.viator_url ?? '#';

  // Código del producto a registrar en analytics (Viator o GYG).
  const productoCodigo =
    tourAncla.viator_product_id ?? tourAncla.proveedor_codigo ?? tourAncla.id;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      const gclid =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem('gclid') ?? undefined
          : undefined;

      const url = construirUrlAfiliado(tourAncla, landingSlug, idioma, gclid);

      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (
          window as unknown as {
            gtag: (
              event: string,
              name: string,
              params: Record<string, unknown>,
            ) => void;
          }
        ).gtag;

        gtag('event', 'outbound_click', {
          event_category: 'sem',
          event_label: tourAncla.id,
          value: tourAncla.precio_desde,
          currency: 'EUR',
          item_id: productoCodigo,
          item_name: tourAncla.titulo,
          landing_slug: landingSlug,
          partner: tourAncla.proveedor ?? 'viator',
          gclid: gclid ?? null,
          source: 'sticky_mobile',
        });
      }

      // Nueva pestaña para conservar la landing viva (estándar afiliación).
      // 'noopener,noreferrer' previene reverse tabnabbing y oculta referrer.
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [tourAncla, landingSlug, idioma, productoCodigo],
  );

  if (!visible) return null;

  const etiqueta = etiquetaSuperior ?? ETIQUETA_SUPERIOR_DEFAULT[idioma];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-sky-500 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-100">
            {etiqueta}
          </p>
          <p className="truncate text-sm font-semibold text-white">
            {label}
          </p>
        </div>

        <a
          href={urlExternaFallback}
          onClick={handleClick}
          rel="sponsored noopener noreferrer"
          target="_blank"
          className="flex-shrink-0 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-500"
        >
          {textoBoton}
        </a>
      </div>
    </div>
  );
}

const ETIQUETA_SUPERIOR_DEFAULT: Record<SemIdioma, string> = {
  es: 'Más reservado',
  en: 'Most booked',
};
