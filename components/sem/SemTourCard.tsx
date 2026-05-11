'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import type { SemIdioma, SemTour } from '@/lib/sem/types';
import { construirUrlAfiliado } from '@/lib/sem/url-builder';

type Props = {
  tour: SemTour;
  landingSlug: string;
  /** Idioma de la landing. Default 'es' por retrocompatibilidad. */
  idioma?: SemIdioma;
};

/**
 * Tarjeta de un tour en una landing SEM.
 *
 * Plan A — Si el tour declara `ficha_propia_slug`, el CTA "Ver detalles"
 * apunta a la ficha propia (interno, sin abandonar el dominio). La conversión
 * a Viator/GYG ocurre en la propia ficha.
 *
 * Fallback — Si no hay `ficha_propia_slug`, el CTA "Reservar" apunta al
 * proveedor afiliado (Viator o GetYourGuide según `tour.proveedor`) en nueva
 * pestaña con tracking y gclid.
 *
 * UX — La tarjeta entera es clickable mediante un overlay `<span absolute inset-0>`
 * dentro del `<Link>`/`<a>`. Esto permite seleccionar texto, mantiene un único
 * enlace para lectores de pantalla y deja sitio a futuros elementos interactivos.
 */
export default function SemTourCard({ tour, landingSlug, idioma = 'es' }: Props) {
  const tieneFichaPropia = Boolean(tour.ficha_propia_slug);
  const labels = LABELS_BY_LANG[idioma];
  const fichaBase = FICHA_BASE_BY_LANG[idioma];
  const localeNumero = idioma === 'es' ? 'es-ES' : 'en-US';

  // Nombre del partner para el aviso "Continúa en X".
  // Default 'Viator' (retrocompatibilidad Toledo, donde `proveedor` es undefined).
  const partnerName =
    tour.proveedor === 'getyourguide' ? 'GetYourGuide' : 'Viator';

  // URL externa precomputada para SEO/SSR (el click la rebuild con gclid).
  const urlExternaFallback = tour.url_reserva ?? tour.viator_url ?? '#';

  // Código del producto a registrar en analytics (Viator o GYG).
  const productoCodigo =
    tour.viator_product_id ?? tour.proveedor_codigo ?? tour.id;

  const handleClickExterno = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      const gclid =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem('gclid') ?? undefined
          : undefined;

      const url = construirUrlAfiliado(tour, landingSlug, idioma, gclid);

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
          event_label: tour.id,
          value: tour.precio_desde,
          currency: 'EUR',
          item_id: productoCodigo,
          item_name: tour.titulo,
          landing_slug: landingSlug,
          partner: tour.proveedor ?? 'viator',
          gclid: gclid ?? null,
        });
      }

      // Nueva pestaña para conservar la landing viva (estándar afiliación).
      // 'noopener,noreferrer' previene reverse tabnabbing y oculta referrer.
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [tour, landingSlug, idioma, productoCodigo],
  );

  const handleClickInterno = useCallback(() => {
    if (typeof window === 'undefined' || !('gtag' in window)) return;

    const gtag = (
      window as unknown as {
        gtag: (
          event: string,
          name: string,
          params: Record<string, unknown>,
        ) => void;
      }
    ).gtag;

    gtag('event', 'sem_to_ficha_click', {
      event_category: 'sem',
      event_label: tour.id,
      value: tour.precio_desde,
      currency: 'EUR',
      item_id: productoCodigo,
      item_name: tour.titulo,
      landing_slug: landingSlug,
      ficha_slug: tour.ficha_propia_slug,
    });
  }, [tour, landingSlug, productoCodigo]);

  // Estilos según estado: ancla > premium > normal
  const cardClass = tour.ancla
    ? 'group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-sky-500 bg-white transition-all hover:shadow-md'
    : tour.premium
      ? 'group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-amber-400 bg-white transition-all hover:border-amber-500 hover:shadow-md'
      : 'group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:border-sky-400 hover:shadow-md';

  const ctaBaseClass =
    'relative inline-flex items-center gap-1 rounded-lg bg-amber-400 px-3.5 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2';

  const overlaySpan = (
    <span className="absolute inset-0 z-0" aria-hidden="true" />
  );

  return (
    <article className={cardClass} data-categoria={tour.categoria}>
      {/* Banda superior "MÁS RESERVADO" si es la ancla */}
      {tour.ancla && (
        <div className="bg-sky-500 px-3 py-1 text-center text-xs font-semibold uppercase tracking-wider text-white">
          ★ {labels.masReservado} · {tour.resenas.toLocaleString(localeNumero)}{' '}
          {labels.viajeros}
        </div>
      )}

      {/* Badge "RECOMENDADO" amber si es ancla */}
      {tour.ancla && (
        <div className="absolute right-3 top-10 z-10 rounded bg-amber-400 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-900 shadow-sm">
          {labels.recomendado}
        </div>
      )}

      {/* Badge "PREMIUM" amber si es premium */}
      {tour.premium && (
        <div className="absolute right-3 top-3 z-10 rounded bg-amber-400 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-900 shadow-sm">
          {labels.premium}
        </div>
      )}

      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={tour.imagen}
          alt={tour.imagen_alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-slate-900">
          {tieneFichaPropia ? (
            <Link
              href={`${fichaBase}/${tour.ficha_propia_slug}`}
              onClick={handleClickInterno}
              className="focus-visible:outline-none focus-visible:underline"
            >
              {overlaySpan}
              <span className="relative">{tour.titulo}</span>
            </Link>
          ) : (
            <a
              href={urlExternaFallback}
              onClick={handleClickExterno}
              rel="sponsored noopener noreferrer"
              target="_blank"
              className="focus-visible:outline-none focus-visible:underline"
            >
              {overlaySpan}
              <span className="relative">{tour.titulo}</span>
            </a>
          )}
        </h3>

        <p className="mt-1 text-sm leading-snug text-slate-600">
          {tour.descripcion}
        </p>

        <p className="mt-2 text-xs text-slate-500">{tour.operador}</p>

        <div className="mt-3 flex items-center gap-1.5 text-sm">
          <StarIcon />
          <span className="font-semibold text-slate-900">
            {tour.rating.toFixed(1)}
          </span>
          <span className="text-slate-500">
            ({tour.resenas.toLocaleString(localeNumero)} {labels.opiniones})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <span className="text-xs text-slate-500">{labels.desde} </span>
            <span className="text-lg font-semibold text-slate-900">
              {tour.precio_desde} €
            </span>
          </div>

          <span className={ctaBaseClass} aria-hidden="true">
            {labels.verDetalles}
            <ArrowRightIcon />
          </span>
        </div>

        {!tieneFichaPropia && (
          <p className="mt-2 text-xs text-slate-400">
            {labels.continuaPartner.replace('{partner}', partnerName)}
          </p>
        )}
      </div>
    </article>
  );
}

const FICHA_BASE_BY_LANG: Record<SemIdioma, string> = {
  es: '/ciudades/madrid/actividades',
  en: '/en/cities/madrid/activities',
};

const LABELS_BY_LANG: Record<
  SemIdioma,
  {
    masReservado: string;
    viajeros: string;
    recomendado: string;
    premium: string;
    opiniones: string;
    desde: string;
    verDetalles: string;
    continuaPartner: string;
  }
> = {
  es: {
    masReservado: 'Más reservado',
    viajeros: 'viajeros',
    recomendado: 'Recomendado',
    premium: 'Premium',
    opiniones: 'opiniones',
    desde: 'Desde',
    verDetalles: 'Ver detalles',
    continuaPartner: 'Continúa en {partner}',
  },
  en: {
    masReservado: 'Most booked',
    viajeros: 'travelers',
    recomendado: 'Recommended',
    premium: 'Premium',
    opiniones: 'reviews',
    desde: 'From',
    verDetalles: 'See details',
    continuaPartner: 'Continues on {partner}',
  },
};

function StarIcon() {
  return (
    <svg
      className="h-4 w-4 text-amber-500"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8l-6.3 4.4L8 13.8l-6-4.4h7.6z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
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
