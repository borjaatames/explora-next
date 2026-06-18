"use client";

import { useEffect, useRef } from "react";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Widget de reserva embebido de Bokun (tipo "Booking Calendar").
 *
 * A diferencia de Viator/GetYourGuide (afiliación con salto a una URL
 * externa), con Bokun somos REVENDEDORES: la disponibilidad, la reserva y
 * el pago se completan dentro de exploraspain.com, en el iframe que monta
 * este widget. Por eso las fichas `proveedor: bokun` renderizan este
 * componente en el sidebar en lugar de <CalendarioReserva>.
 *
 * Mecánica del embed (idéntica al snippet que genera el panel de Bokun):
 *   1. Un <script> loader global, parametrizado con el UUID del canal de
 *      reservas. Se inyecta UNA sola vez por sesión (idempotente).
 *   2. Un <div class="bokunWidget" data-src=".../experience-calendar/{id}">
 *      por producto. El loader escanea estos divs y los hidrata.
 *
 * El UUID del canal vive en NEXT_PUBLIC_BOKUN_CHANNEL_UUID (constante por
 * cuenta). El `productId` viene del frontmatter (`bokunProductId`).
 *
 * Consentimiento: por decisión de producto el widget se trata como cookie
 * funcional (necesaria para reservar) y se carga siempre, sin gate del
 * banner de cookies.
 */

const LOADER_BASE =
  "https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js";
const WIDGET_BASE = "https://widgets.bokun.io/online-sales";

type Props = {
  /** ID de experiencia en Bokun (frontmatter `bokunProductId`). */
  productId: number;
  idioma: Idioma;
};

type BokunGlobal = {
  BokunWidgetEmbedder?: { initialize?: () => void };
};

/**
 * Inserta el loader de Bokun una sola vez. Si ya está presente, no hace
 * nada. Devuelve true si el loader ya estaba (para forzar re-escaneo en
 * navegaciones cliente del App Router).
 */
function asegurarLoader(channelUuid: string): boolean {
  if (typeof document === "undefined") return false;
  const yaExiste = document.querySelector<HTMLScriptElement>(
    'script[data-bokun-loader="true"]'
  );
  if (yaExiste) return true;

  const script = document.createElement("script");
  script.src = `${LOADER_BASE}?bookingChannelUUID=${channelUuid}`;
  script.async = true;
  script.dataset.bokunLoader = "true";
  document.body.appendChild(script);
  return false;
}

export default function BokunWidget({ productId, idioma }: Props) {
  const channelUuid = process.env.NEXT_PUBLIC_BOKUN_CHANNEL_UUID;
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!channelUuid) return;
    const loaderYaCargado = asegurarLoader(channelUuid);

    // En navegaciones cliente (App Router no recarga la página), el loader
    // ya está en el DOM pero no re-escanea solo. Forzamos la inicialización
    // si Bokun expone su embedder.
    if (loaderYaCargado) {
      const w = window as unknown as BokunGlobal;
      try {
        w.BokunWidgetEmbedder?.initialize?.();
      } catch {
        /* el loader hidratará en su próximo ciclo */
      }
    }
  }, [channelUuid, productId]);

  // Sin UUID configurado no se puede montar el widget. En vez de romper la
  // ficha, mostramos un aviso discreto (solo se vería en una mala config).
  if (!channelUuid) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 text-sm text-slate-500">
        {idioma === "es"
          ? "Reserva temporalmente no disponible."
          : "Booking temporarily unavailable."}
      </div>
    );
  }

  const dataSrc = `${WIDGET_BASE}/${channelUuid}/experience-calendar/${productId}`;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-sky-500 text-white px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide">
          {idioma === "es" ? "Reservar tu visita" : "Book your visit"}
        </span>
        <span className="text-[10px] opacity-90">
          {idioma === "es" ? "Reserva directa" : "Direct booking"}
        </span>
      </div>

      <div className="p-4" ref={contenedorRef}>
        <div className="bokunWidget" data-src={dataSrc} />
        <noscript>
          {idioma === "es"
            ? "Habilita JavaScript en tu navegador para reservar."
            : "Please enable JavaScript in your browser to book."}
        </noscript>
      </div>
    </div>
  );
}
