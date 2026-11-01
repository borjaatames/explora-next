"use client";

import { useEffect, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n/types";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";
import { textoUnidadBokun, type PrecioGrupo } from "@/lib/reservaBokun";
import { precioComparable } from "@/lib/precioComparable";

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
  /** Totales por tamaño de grupo (privadas por grupo). */
  preciosGrupo?: ReadonlyArray<PrecioGrupo>;
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

type TextosWidget = {
  noDisponible: string;
  unaOpinion: string;
  opiniones: string;
  cabecera: string;
  directa: string;
  desde: string;
  porPersonaGrupo: (personas: number, precio: string) => string;
  elegirMinimo: (minimo: number) => string;
  indicarPersonas: string;
  cargando: string;
  sinJs: string;
  pagoSeguro: string;
};

const TEXTOS: Record<Idioma, TextosWidget> = {
  es: {
    noDisponible: "Reserva temporalmente no disponible.",
    unaOpinion: "1 opinión",
    opiniones: "opiniones",
    cabecera: "Reservar tu visita",
    directa: "Reserva directa",
    desde: "Desde",
    porPersonaGrupo: (n, p) => `Si sois ${n}: ${p} por persona`,
    elegirMinimo: (m) => `Elige ${m} personas o más en el calendario para ver las fechas y el precio.`,
    indicarPersonas: "Indica en el calendario cuántas personas sois para ver las fechas y el precio.",
    cargando: "Cargando el calendario de fechas…",
    sinJs: "Habilita JavaScript en tu navegador para reservar.",
    pagoSeguro: "Pago 100% seguro · Confirmación inmediata",
  },
  en: {
    noDisponible: "Booking temporarily unavailable.",
    unaOpinion: "1 review",
    opiniones: "reviews",
    cabecera: "Book your visit",
    directa: "Direct booking",
    desde: "From",
    porPersonaGrupo: (n, p) => `For ${n} people: ${p} per person`,
    elegirMinimo: (m) => `Choose ${m} or more people in the calendar to see dates and prices.`,
    indicarPersonas: "Set the number of people in the calendar to see dates and prices.",
    cargando: "Loading the availability calendar…",
    sinJs: "Please enable JavaScript in your browser to book.",
    pagoSeguro: "100% secure payment · Instant confirmation",
  },
  de: {
    noDisponible: "Buchung vorübergehend nicht verfügbar.",
    unaOpinion: "1 Bewertung",
    opiniones: "Bewertungen",
    cabecera: "Deinen Besuch buchen",
    directa: "Direkt buchen",
    desde: "Ab",
    porPersonaGrupo: (n, p) => `Bei ${n} Personen: ${p} pro Person`,
    elegirMinimo: (m) => `Wähle im Kalender ${m} oder mehr Personen, um Termine und Preise zu sehen.`,
    indicarPersonas: "Gib im Kalender an, wie viele Personen ihr seid, um Termine und Preise zu sehen.",
    cargando: "Verfügbarkeitskalender wird geladen…",
    sinJs: "Aktiviere JavaScript in deinem Browser, um zu buchen.",
    pagoSeguro: "100 % sichere Zahlung · Sofortige Bestätigung",
  },
  fr: {
    noDisponible: "Réservation temporairement indisponible.",
    unaOpinion: "1 avis",
    opiniones: "avis",
    cabecera: "Réservez votre visite",
    directa: "Réservation directe",
    desde: "À partir de",
    porPersonaGrupo: (n, p) => `Pour ${n} personnes : ${p} par personne`,
    elegirMinimo: (m) => `Choisissez ${m} personnes ou plus dans le calendrier pour voir les dates et le prix.`,
    indicarPersonas: "Indiquez dans le calendrier combien de personnes vous êtes pour voir les dates et le prix.",
    cargando: "Chargement du calendrier des disponibilités…",
    sinJs: "Activez JavaScript dans votre navigateur pour réserver.",
    pagoSeguro: "Paiement 100 % sécurisé · Confirmation immédiate",
  },
  it: {
    noDisponible: "Prenotazione temporaneamente non disponibile.",
    unaOpinion: "1 recensione",
    opiniones: "recensioni",
    cabecera: "Prenota la tua visita",
    directa: "Prenotazione diretta",
    desde: "Da",
    porPersonaGrupo: (n, p) => `Se siete in ${n}: ${p} a persona`,
    elegirMinimo: (m) => `Scegli ${m} o più persone nel calendario per vedere le date e il prezzo.`,
    indicarPersonas: "Indica nel calendario quante persone siete per vedere le date e il prezzo.",
    cargando: "Caricamento del calendario delle disponibilità…",
    sinJs: "Attiva JavaScript nel browser per prenotare.",
    pagoSeguro: "Pagamento sicuro al 100% · Conferma immediata",
  },
  pt: {
    noDisponible: "Reserva temporariamente indisponível.",
    unaOpinion: "1 avaliação",
    opiniones: "avaliações",
    cabecera: "Reserve a sua visita",
    directa: "Reserva direta",
    desde: "Desde",
    porPersonaGrupo: (n, p) => `Para ${n} pessoas: ${p} por pessoa`,
    elegirMinimo: (m) => `Escolha ${m} ou mais pessoas no calendário para ver as datas e o preço.`,
    indicarPersonas: "Indique no calendário quantas pessoas são para ver as datas e o preço.",
    cargando: "A carregar o calendário de disponibilidade…",
    sinJs: "Ative o JavaScript no seu navegador para reservar.",
    pagoSeguro: "Pagamento 100% seguro · Confirmação imediata",
  },
};

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
  preciosGrupo,
}: Props) {
  const channelUuid = process.env.NEXT_PUBLIC_BOKUN_CHANNEL_UUID;
  const comparable = precioComparable({
    precioDesde: precioDesde ?? 0,
    precioPorGrupo: porGrupo,
    preciosGrupo,
  });
  const t = TEXTOS[idioma];
  const localeNota = idioma === "en" ? "en-GB" : IDIOMA_LOCALE[idioma];
  const formatoPrecio = new Intl.NumberFormat(localeNota, {
    style: "currency",
    currency: moneda || "EUR",
    maximumFractionDigits: 0,
  });
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
        {t.noDisponible}
      </div>
    );
  }

  const dataSrc = `${WIDGET_BASE}/${channelUuid}/experience-calendar/${productId}?lang=${idioma}`;

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
      ? t.unaOpinion
      : `${(numeroOpiniones ?? 0).toLocaleString(localeNota)} ${t.opiniones}`;

  return (
    <div className="bg-white border border-piedra-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-anil-500 text-white px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide">
          {t.cabecera}
        </span>
        <span className="text-xs opacity-90">
          {t.directa}
        </span>
      </div>

      {typeof precioDesde === "number" && precioDesde > 0 && (
        <div className="px-4 pt-3">
          <p className="text-xs text-piedra-500">
            {t.desde}
          </p>
          <p className="text-4xl font-bold text-piedra-900 mt-0.5">
            {formatoPrecio.format(precioDesde)}
          </p>
          <p className="text-xs text-piedra-500">
            {textoUnidadBokun({ porGrupo: Boolean(porGrupo), minimoPersonas }, idioma)}
          </p>
          {porGrupo && comparable.personasReferencia ? (
            <p className="mt-1 text-sm font-semibold text-piedra-800">
              {t.porPersonaGrupo(comparable.personasReferencia, formatoPrecio.format(comparable.porPersona))}
            </p>
          ) : null}
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
          {typeof minimoPersonas === "number" && minimoPersonas > 1
            ? t.elegirMinimo(minimoPersonas)
            : t.indicarPersonas}
        </p>
      )}

      <div
        className="p-4 min-h-[560px]"
        ref={contenedorRef}
      >
        {!activo && (
          <p className="pt-24 text-center text-sm text-piedra-500">
            {t.cargando}
          </p>
        )}
        {/* `key` con idioma+producto: fuerza a React a crear un nodo nuevo y
            limpio en cada cambio, para que Bokun lo re-hidrate con el lang
            correcto (un div ya hidratado no vuelve a leer su data-src). */}
        <div key={`${productId}-${idioma}`} className="bokunWidget" data-src={dataSrc} />
        <noscript>
          {t.sinJs}
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
          {t.pagoSeguro}
        </p>
      </div>
    </div>
  );
}
