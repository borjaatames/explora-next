import type { Idioma } from "@/lib/i18n/types";

/**
 * Etiqueta corta de la política de cancelación para los datos clave de la
 * ficha. Antes solo se enseñaba si era gratuita; ahora también se avisa de
 * las no reembolsables o con reembolso parcial (como Civitatis y GYG).
 * Solo se deduce de lo que dice el frontmatter: si no está claro, `null`.
 */

type Entrada = {
  cancelacionGratuita?: boolean;
  horasCancelacion?: number;
  politicaCancelacion?: string;
};

type Textos = {
  gratis: (h?: number) => string;
  noReembolsable: string;
  parcial: string;
};

const TEXTOS: Record<Idioma, Textos> = {
  es: {
    gratis: (h) => (h ? `Cancelación gratis hasta ${h} h antes` : "Cancelación gratis"),
    noReembolsable: "No reembolsable",
    parcial: "Reembolso parcial si cancelas",
  },
  en: {
    gratis: (h) => (h ? `Free cancellation up to ${h}h before` : "Free cancellation"),
    noReembolsable: "Non-refundable",
    parcial: "Partial refund if you cancel",
  },
  de: {
    gratis: (h) => (h ? `Kostenlose Stornierung bis ${h} Std. vorher` : "Kostenlose Stornierung"),
    noReembolsable: "Nicht erstattungsfähig",
    parcial: "Teilerstattung bei Stornierung",
  },
  fr: {
    gratis: (h) => (h ? `Annulation gratuite jusqu'à ${h} h avant` : "Annulation gratuite"),
    noReembolsable: "Non remboursable",
    parcial: "Remboursement partiel en cas d'annulation",
  },
  it: {
    gratis: (h) => (h ? `Cancellazione gratuita fino a ${h} ore prima` : "Cancellazione gratuita"),
    noReembolsable: "Non rimborsabile",
    parcial: "Rimborso parziale se cancelli",
  },
  pt: {
    gratis: (h) => (h ? `Cancelamento gratuito até ${h} h antes` : "Cancelamento gratuito"),
    noReembolsable: "Não reembolsável",
    parcial: "Reembolso parcial se cancelar",
  },
};

const RE_NO_REEMBOLSABLE =
  /no reembolsable|sin reembolso|non[- ]refundable|no refund|all sales final|nicht erstattungsf|keine (rück)?erstattung|non rembours|aucun remboursement|non rimborsabil|nessun rimborso|não reembols|sem reembolso/i;
const RE_PARCIAL = /\b[1-9]\d?\s?%|parcial|partial|teilerstatt|partiel|parzial/i;

export function etiquetaCancelacion(idioma: Idioma, a: Entrada): string | null {
  const t = TEXTOS[idioma];
  if (a.cancelacionGratuita) return t.gratis(a.horasCancelacion);
  const politica = a.politicaCancelacion ?? "";
  if (RE_NO_REEMBOLSABLE.test(politica)) return t.noReembolsable;
  if (RE_PARCIAL.test(politica)) return t.parcial;
  return null;
}

const RESERVA_SIN_PAGAR: Record<Idioma, string> = {
  es: "Reserva ahora y paga después",
  en: "Reserve now, pay later",
  de: "Jetzt reservieren, später zahlen",
  fr: "Réservez maintenant, payez plus tard",
  it: "Prenota ora, paga dopo",
  pt: "Reserve agora, pague depois",
};

/** «Reserva ahora y paga después» (solo fichas GYG con `reservaSinPagar: true`). */
export function etiquetaReservaSinPagar(idioma: Idioma, reservaSinPagar?: boolean): string | null {
  return reservaSinPagar ? RESERVA_SIN_PAGAR[idioma] : null;
}
