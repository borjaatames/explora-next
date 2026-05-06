'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SemTour } from '@/lib/sem/types';
import { construirUrlViator } from '@/lib/sem/url-builder';

type Props = {
  label: string;
  textoBoton: string;
  tourAncla: SemTour;
  landingSlug: string;
};

/**
 * Sticky CTA flotante en móvil. Desktop lo oculta.
 * Aparece tras hacer scroll de ~300px para no estorbar el hero.
 * Apunta al tour ancla (definido por `ancla: true` en el frontmatter).
 */
export default function SemStickyMobile({
  label,
  textoBoton,
  tourAncla,
  landingSlug,
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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      const gclid =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem('gclid') ?? undefined
          : undefined;

      const url = construirUrlViator(
        tourAncla.viator_url,
        landingSlug,
        tourAncla.id,
        gclid,
      );

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
          item_id: tourAncla.viator_product_id,
          item_name: tourAncla.titulo,
          landing_slug: landingSlug,
          gclid: gclid ?? null,
          source: 'sticky_mobile',
        });
      }

      window.location.href = url;
    },
    [tourAncla, landingSlug],
  );

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-sky-500 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
            Más reservado
          </p>
          <p className="truncate text-sm font-semibold text-white">
            {label}
          </p>
        </div>

        <a
          href={tourAncla.viator_url}
          onClick={handleClick}
          rel="sponsored noopener noreferrer"
          target="_blank"
          className="flex-shrink-0 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-sky-500"
        >
          {textoBoton}
        </a>
      </div>
    </div>
  );
}
