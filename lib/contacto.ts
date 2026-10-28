/**
 * Número de WhatsApp Business en formato internacional, solo dígitos
 * (sin "+", espacios ni guiones), como exige la API de wa.me.
 */
export const WHATSAPP_NUMERO = "34917647730";

export function urlWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
