"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Idioma } from "@/lib/i18n/types";
import {
  ANCLA_WIDGET_GYG,
  CAMPANA_WIDGET_GYG,
  GYG_PARTNER_ID,
} from "@/lib/gyg-widget";

/**
 * Widget de disponibilidad de GetYourGuide (prueba en las fichas de
 * `lib/gyg-widget.ts`). El usuario elige fecha, personas y horario aquí y
 * solo sale a GYG para pagar.
 *
 * - Se carga siempre, sin esperar al banner de cookies: por decisión de
 *   producto (24 oct 2026) se trata como el widget de Bókun, una cookie
 *   funcional necesaria para reservar.
 * - Se monta una sola instancia por ficha: la de escritorio vive en el
 *   aside y la de móvil en la columna principal; cada una se activa solo
 *   en su tamaño de pantalla (`soloEn`); en el otro se pinta `fallback`.
 * - El script (~60 KB) se inyecta cuando el bloque está a MARGEN_CARGA de
 *   entrar en pantalla, como el widget de Bókun. Si ya estaba cargado
 *   (navegación cliente entre fichas) se vuelve a insertar para que
 *   escanee el nuevo `<div data-gyg-widget>`.
 */

const SCRIPT_SRC = "https://widget.getyourguide.com/dist/pa.umd.production.min.js";
const MARGEN_CARGA = "600px 0px";
const MQ_ESCRITORIO = "(min-width: 1024px)";

const LOCALE: Partial<Record<Idioma, string>> = {
  es: "es-ES",
  en: "en-US",
  de: "de-DE",
};

type Textos = { titulo: string; noCarga: string; verEnGyg: string };

const TEXTOS_EN: Textos = {
  titulo: "Choose your date and travellers",
  noCarga: "Calendar not loading?",
  verEnGyg: "View on GetYourGuide →",
};

const TEXTOS: Partial<Record<Idioma, Textos>> = {
  es: {
    titulo: "Elige fecha y personas",
    noCarga: "¿No carga el calendario?",
    verEnGyg: "Ver en GetYourGuide →",
  },
  en: TEXTOS_EN,
  de: {
    titulo: "Datum und Personen wählen",
    noCarga: "Kalender lädt nicht?",
    verEnGyg: "Auf GetYourGuide ansehen →",
  },
};

type Props = {
  tourId: string;
  idioma: Idioma;
  /** URL de reserva normalizada (enlace de respaldo bajo el widget). */
  urlReserva: string;
  soloEn: "movil" | "escritorio";
  /** Lo que se pinta fuera de su tamaño de pantalla (y antes de hidratar). */
  fallback?: ReactNode;
  /** Bloque sobre el widget (precio «desde» y nota): el widget no los enseña. */
  cabecera?: ReactNode;
};

type GtagWindow = Window & {
  gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
};

function inyectarScript(): void {
  document
    .querySelectorAll<HTMLScriptElement>('script[data-gyg-widget-loader="true"]')
    .forEach((s) => s.remove());
  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  script.dataset.gygPartnerId = GYG_PARTNER_ID;
  script.dataset.gygWidgetLoader = "true";
  document.body.appendChild(script);
}

export default function WidgetDisponibilidadGyg({
  tourId,
  idioma,
  urlReserva,
  soloEn,
  fallback = null,
  cabecera = null,
}: Props) {
  const [activo, setActivo] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const t = TEXTOS[idioma] ?? TEXTOS_EN;

  useEffect(() => {
    const mq = window.matchMedia(MQ_ESCRITORIO);
    const evaluar = () => {
      const tamanoOk = soloEn === "escritorio" ? mq.matches : !mq.matches;
      setActivo(tamanoOk);
    };
    evaluar();
    mq.addEventListener("change", evaluar);
    return () => mq.removeEventListener("change", evaluar);
  }, [soloEn]);

  useEffect(() => {
    if (!activo || !contenedorRef.current) return;
    const nodo = contenedorRef.current;
    const observer = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        inyectarScript();
        (window as GtagWindow).gtag?.("event", "widget_gyg_visto", {
          tour_id: tourId,
          dispositivo: soloEn,
        });
      },
      { rootMargin: MARGEN_CARGA }
    );
    observer.observe(nodo);
    return () => observer.disconnect();
  }, [activo, tourId, soloEn]);

  if (!activo) return <>{fallback}</>;

  return (
    <div id={ANCLA_WIDGET_GYG} className="scroll-mt-24">
      {cabecera}
      <p className="text-sm font-semibold text-piedra-900 mb-2">{t.titulo}</p>
      <div ref={contenedorRef} className="min-h-[575px]">
        <div
          data-gyg-href="https://widget.getyourguide.com/default/availability.frame"
          data-gyg-tour-id={tourId}
          data-gyg-locale-code={LOCALE[idioma] ?? "en-US"}
          data-gyg-currency="EUR"
          data-gyg-widget="availability"
          data-gyg-variant="vertical"
          data-gyg-partner-id={GYG_PARTNER_ID}
          data-gyg-cmp={CAMPANA_WIDGET_GYG}
        >
          <span className="text-xs text-piedra-500">
            Powered by{" "}
            <a
              target="_blank"
              rel="sponsored noopener"
              href="https://www.getyourguide.com/"
              className="text-anil-600 hover:text-anil-700"
            >
              GetYourGuide
            </a>
          </span>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-piedra-500">
        {t.noCarga}{" "}
        <a
          href={urlReserva}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-semibold text-anil-600 hover:text-anil-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded"
        >
          {t.verEnGyg}
        </a>
      </p>
    </div>
  );
}
