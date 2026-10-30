"use client";

import { useReportWebVitals } from "next/web-vitals";

type Gtag = (comando: "event", nombre: string, parametros: Record<string, unknown>) => void;

const METRICAS = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);

/**
 * Envía las Core Web Vitals reales de los usuarios a GA4 (evento `web_vitals`).
 * Google aún no tiene datos de campo (CrUX) de este sitio, así que esta es la
 * única medida real de velocidad. Respeta el Consent Mode ya configurado.
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (!METRICAS.has(metric.name)) return;
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag !== "function") return;
    gtag("event", "web_vitals", {
      metric_name: metric.name,
      // CLS es un número pequeño sin unidades: se multiplica para conservar decimales en GA4.
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_rating: metric.rating,
      page_path: window.location.pathname,
      non_interaction: true,
    });
  });
  return null;
}
