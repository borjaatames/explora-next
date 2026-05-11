/**
 * Constructor de URLs de afiliado con tracking.
 *
 * Soporta Viator y GetYourGuide. Funciones puras, sin imports de Node.
 * Se pueden llamar desde Server Components, Client Components o cualquier sitio.
 */

import type { SemIdioma, SemTour } from './types';

// ─── Viator ──────────────────────────────────────────────────────────────────
const VIATOR_PARTNER_ID = 'P00298823';
const VIATOR_MCID = '42383';

/**
 * Construye la URL de afiliado de Viator para un tour concreto.
 *
 * Añade Partner ID, MCID, medium y campaign tracking.
 * El campaign incluye el slug del landing y opcionalmente el gclid de Google Ads
 * (capturado en cliente) para reconciliación posterior con el CSV de Viator.
 */
export function construirUrlViator(
  viatorUrl: string,
  landingSlug: string,
  tourId: string,
  gclid?: string,
): string {
  const url = new URL(viatorUrl);
  url.searchParams.set('pid', VIATOR_PARTNER_ID);
  url.searchParams.set('mcid', VIATOR_MCID);
  url.searchParams.set('medium', 'link');

  const campaignParts = ['sem', landingSlug, tourId];
  if (gclid) {
    campaignParts.push(gclid);
  }
  url.searchParams.set('campaign', campaignParts.join('-'));

  return url.toString();
}

// ─── GetYourGuide ────────────────────────────────────────────────────────────
const GYG_PARTNER_ID = 'C71NOAW';

/**
 * Construye la URL de afiliado de GetYourGuide para un tour concreto.
 *
 * Reglas:
 *  - Locale 'es' → fuerza dominio `www.getyourguide.es`.
 *  - Locale 'en' → fuerza dominio `www.getyourguide.com`.
 *  - Añade `partner_id` y `cmp` granular: `{locale}_sem_{landingSlug}_{tourId}[_{gclid}]`.
 */
export function construirUrlGetYourGuide(
  gygUrl: string,
  landingSlug: string,
  tourId: string,
  locale: SemIdioma,
  gclid?: string,
): string {
  const url = new URL(gygUrl);

  // Forzar dominio según locale.
  if (locale === 'es' && url.hostname !== 'www.getyourguide.es') {
    url.hostname = 'www.getyourguide.es';
  } else if (locale === 'en' && url.hostname !== 'www.getyourguide.com') {
    url.hostname = 'www.getyourguide.com';
  }

  url.searchParams.set('partner_id', GYG_PARTNER_ID);

  const cmpParts = [locale, 'sem', landingSlug, tourId];
  if (gclid) {
    cmpParts.push(gclid);
  }
  url.searchParams.set('cmp', cmpParts.join('_'));

  return url.toString();
}

// ─── Dispatcher unificado ────────────────────────────────────────────────────
/**
 * Construye la URL de afiliado para un tour, despachando al proveedor correcto.
 *
 * - Si `tour.proveedor === 'getyourguide'` → GYG (usa `url_reserva`).
 * - En cualquier otro caso (incluido `proveedor` undefined) → Viator
 *   (usa `url_reserva ?? viator_url` y `proveedor_codigo ?? viator_product_id`).
 *
 * Esto garantiza retrocompatibilidad con Toledo SEM, cuyos tours no declaran
 * `proveedor` y siguen usando los campos legacy `viator_url` / `viator_product_id`.
 */
export function construirUrlAfiliado(
  tour: SemTour,
  landingSlug: string,
  locale: SemIdioma,
  gclid?: string,
): string {
  const proveedor = tour.proveedor ?? 'viator';

  if (proveedor === 'getyourguide') {
    const urlBase = tour.url_reserva ?? tour.viator_url;
    const codigo = tour.proveedor_codigo ?? tour.viator_product_id ?? tour.id;
    if (!urlBase) {
      throw new Error(
        `[construirUrlAfiliado] Tour ${tour.id} declara proveedor 'getyourguide' pero no tiene url_reserva ni viator_url.`,
      );
    }
    return construirUrlGetYourGuide(urlBase, landingSlug, codigo, locale, gclid);
  }

  // Default: Viator.
  const urlBase = tour.viator_url ?? tour.url_reserva;
  const codigo = tour.viator_product_id ?? tour.proveedor_codigo ?? tour.id;
  if (!urlBase) {
    throw new Error(
      `[construirUrlAfiliado] Tour ${tour.id} no tiene viator_url ni url_reserva.`,
    );
  }
  return construirUrlViator(urlBase, landingSlug, codigo, gclid);
}
