"use client";

import { useEffect, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n/types";
import { textoUnidadBokun } from "@/lib/reservaBokun";

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
 *
 * Rendimiento: el loader arrastra ~1,3 MB de JavaScript de Bokun y monta un
 * botón flotante que provocaba un CLS de 0,47 en móvil (PageSpeed 17-24).
 * Por eso NO se inyecta al cargar la página: se espera a que el bloque de
 * reserva esté a MARGEN_CARGA de entrar en pantalla (IntersectionObserver).
 */

const LOADER_BASE =
  "https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js";
const WIDGET_BASE = "https://widgets.bokun.io/online-sales";

/** Antelación con la que se empieza a cargar el widget antes de verse. */
const MARGEN_CARGA = "600px 0px";

type Props = {
  /** ID de experiencia en Bokun (frontmatter `bokunProductId`). */
  productId: number;
  idioma: Idioma;
  /** Precio "desde" (frontmatter `precioDesde`). Si se pasa, se muestra. */
  precioDesde?: number;
  /** Moneda ISO (frontmatter `moneda`). Por defecto EUR. */
  moneda?: string;
  /** true → "por grupo" (experiencias privadas); false → "por persona". */
  porGrupo?: boolean;
  /** Nota media del proveedor (frontmatter `ratingProveedor`). */
  ratingProveedor?: number;
  /** Nº de opiniones (frontmatter `numeroOpiniones`). */
  numeroOpiniones?: number;
  /** Mínimo de personas por reserva (frontmatter `minimoPersonas`). */
  minimoPersonas?: number;
  /**
   * El calendario de Bókun arranca con 0 o 1 persona y, por debajo del
   * mínimo, no pinta precios (frontmatter `bokunPedirPersonas`). Se avisa
   * encima para que no parezca que no hay fechas.
   */
  pedirPersonas?: boolean;
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

export default function BokunWidget({
  productId,
  idioma,
  precioDesde,
  moneda,
  porGrupo,
  ratingProveedor,
  numeroOpiniones,
  minimoPersonas,
  pedirPersonas,
}: Props) {
  const channelUuid = process.env.NEXT_PUBLIC_BOKUN_CHANNEL_UUID;
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [cerca, setCerca] = useState(false);
  const [interaccion, setInteraccion] = useState(false);
  // En escritorio el widget está a la vista desde el principio (columna
  // lateral): cargarlo al abrir la página metía ~2,4 s de JS y un TBT de
  // 700-890 ms (PageSpeed escritorio 45-50, 28-10-2026). Se espera además a
  // la primera interacción (ratón, teclado, toque o scroll), que en una
  // visita real llega en el primer segundo.
  const activo = cerca && interaccion;

  useEffect(() => {
    if (cerca) return;
    const nodo = contenedorRef.current;
    if (!nodo) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setCerca(true);
          observer.disconnect();
        }
      },
      { rootMargin: MARGEN_CARGA }
    );
    observer.observe(nodo);
    return () => observer.disconnect();
  }, [cerca]);

  useEffect(() => {
    if (interaccion) return;
    const eventos = ["pointerdown", "pointermove", "keydown", "touchstart", "wheel", "scroll"];
    const marcar = () => setInteraccion(true);
    eventos.forEach((ev) => window.addEventListener(ev, marcar, { passive: true }));
    return () => eventos.forEach((ev) => window.removeEventListener(ev, marcar));
  }, [interaccion]);

  useEffect(() => {
    if (!channelUuid || !activo) return;
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
  }, [channelUuid, productId, idioma, activo]);

  if (!channelUuid) {
    return (
      <div className="bg-white border border-piedra-200 rounded-lg p-5 text-sm text-piedra-500">
        {idioma === "es"
          ? "Reserva temporalmente no disponible."
          : "Booking temporarily unavailable."}
      </div>
    );
  }

  const dataSrc = `${WIDGET_BASE}/${channelUuid}/experience-calendar/${productId}?lang=${idioma}`;

  const localeNota = idioma === "es" ? "es-ES" : "en-GB";
  const tieneRating =
    typeof ratingProveedor === "number" &&
    typeof numeroOpiniones === "number" &&
    numeroOpiniones > 0;
  const ratingValor = (ratingProveedor ?? 0).toLocaleString(localeNota, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const ratingOpiniones =
    numeroOpiniones === 1
      ? idioma === "es"
        ? "1 opinión"
        : "1 review"
      : `${(numeroOpiniones ?? 0).toLocaleString(localeNota)} ${
          idioma === "es" ? "opiniones" : "reviews"
        }`;

  return (
    <div className="bg-white border border-piedra-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-anil-500 text-white px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide">
          {idioma === "es" ? "Reservar tu visita" : "Book your visit"}
        </span>
        <span className="text-xs opacity-90">
          {idioma === "es" ? "Reserva directa" : "Direct booking"}
        </span>
      </div>

      {typeof precioDesde === "number" && precioDesde > 0 && (
        <div className="px-4 pt-3">
          <p className="text-xs text-piedra-500">
            {idioma === "es" ? "Desde" : idioma === "de" ? "Ab" : "From"}
          </p>
          <p className="text-4xl font-bold text-piedra-900 mt-0.5">
            {new Intl.NumberFormat(idioma === "es" ? "es-ES" : idioma === "de" ? "de-DE" : "en-GB", {
              style: "currency",
              currency: moneda || "EUR",
              maximumFractionDigits: 0,
            }).format(precioDesde)}
          </p>
          <p className="text-xs text-piedra-500">
            {textoUnidadBokun({ porGrupo: Boolean(porGrupo), minimoPersonas }, idioma)}
          </p>
          {tieneRating && (
            <div className="mt-3 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md bg-azafran-50 px-2.5 py-1.5 text-sm">
              <span className="inline-flex items-center gap-1 font-semibold text-piedra-900">
                <span aria-hidden="true" className="text-azafran-500 text-base leading-none">
                  ★
                </span>
                <span>{ratingValor}</span>
              </span>
              <span aria-hidden="true" className="text-piedra-300">
                ·
              </span>
              <span className="text-piedra-700">{ratingOpiniones}</span>
            </div>
          )}
        </div>
      )}

      {pedirPersonas && (
        <p className="mx-4 mt-3 rounded-md border border-azafran-200 bg-azafran-50 px-3 py-2 text-sm text-piedra-800">
          {idioma === "es"
            ? typeof minimoPersonas === "number" && minimoPersonas > 1
              ? `Elige ${minimoPersonas} personas o más en el calendario para ver las fechas y el precio.`
              : "Indica en el calendario cuántas personas sois para ver las fechas y el precio."
            : typeof minimoPersonas === "number" && minimoPersonas > 1
              ? `Choose ${minimoPersonas} or more people in the calendar to see dates and prices.`
              : "Set the number of people in the calendar to see dates and prices."}
        </p>
      )}

      <div
        className="p-4 min-h-[560px]"
        ref={contenedorRef}
      >
        {!activo && (
          <p className="pt-24 text-center text-sm text-piedra-500">
            {idioma === "es" ? "Cargando el calendario de fechas…" : "Loading the availability calendar…"}
          </p>
        )}
        {/* `key` con idioma+producto: fuerza a React a crear un nodo nuevo y
            limpio en cada cambio, para que Bokun lo re-hidrate con el lang
            correcto (un div ya hidratado no vuelve a leer su data-src). */}
        <div key={`${productId}-${idioma}`} className="bokunWidget" data-src={dataSrc} />
        <noscript>
          {idioma === "es"
            ? "Habilita JavaScript en tu navegador para reservar."
            : "Please enable JavaScript in your browser to book."}
        </noscript>
      </div>

      <div className="border-t border-piedra-100 px-4 py-2.5">
        <p className="flex items-center justify-center gap-1.5 text-xs text-piedra-500 text-center leading-snug">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-anil-600 flex-shrink-0"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {idioma === "es"
            ? "Pago 100% seguro · Confirmación inmediata"
            : "100% secure payment · Instant confirmation"}
        </p>
      </div>
    </div>
  );
}
