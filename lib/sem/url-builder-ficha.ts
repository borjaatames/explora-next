/**
 * Constructor de URLs Viator con tracking de afiliado para FICHAS PROPIAS.
 *
 * Análogo a `lib/sem/url-builder.ts` pero adaptado a fichas:
 * - No requiere `landingSlug` (la ficha no tiene landing parent)
 * - El campaign se construye como `ficha-{slug}-{gclid?}`
 *
 * Función pura, sin imports de Node. Se puede llamar desde Server
 * Components, Client Components o cualquier sitio.
 *
 * Idempotente: si la URL base ya trae `pid`/`mcid`/`medium`, los nuevos valores
 * los sobrescriben (consistencia garantizada). El `gclid` y el `campaign` se
 * añaden siempre que el `gclid` esté disponible.
 */

const PARTNER_ID = 'P00298823';
const MCID = '42383';

/**
 * Construye la URL de afiliado de Viator para una ficha propia.
 *
 * @param viatorUrl URL del producto en Viator (puede traer ya params de afiliado)
 * @param slug Slug interno de la ficha (ej: "excursion-toledo-dia-completo")
 * @param gclid gclid de Google Ads capturado en sessionStorage (opcional)
 * @returns URL final con todos los params de tracking aplicados
 */
export function construirUrlViatorFicha(
  viatorUrl: string,
  slug: string,
  gclid?: string,
): string {
  const url = new URL(viatorUrl);
  url.searchParams.set('pid', PARTNER_ID);
  url.searchParams.set('mcid', MCID);
  url.searchParams.set('medium', 'link');

  const campaignParts = ['ficha', slug];
  if (gclid) {
    campaignParts.push(gclid);
  }
  url.searchParams.set('campaign', campaignParts.join('-'));

  return url.toString();
}
