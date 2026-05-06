/**
 * Constructor de URLs Viator con tracking de afiliado.
 *
 * Función pura, sin imports de Node. Se puede llamar desde Server
 * Components, Client Components o cualquier sitio.
 */

const PARTNER_ID = 'P00298823';
const MCID = '42383';

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
  url.searchParams.set('pid', PARTNER_ID);
  url.searchParams.set('mcid', MCID);
  url.searchParams.set('medium', 'link');

  const campaignParts = ['sem', landingSlug, tourId];
  if (gclid) {
    campaignParts.push(gclid);
  }
  url.searchParams.set('campaign', campaignParts.join('-'));

  return url.toString();
}
