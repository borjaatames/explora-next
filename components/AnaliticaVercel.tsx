"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/**
 * Vercel Web Analytics: cuenta visitas sin cookies ni datos personales, así
 * que incluye a quien rechaza el banner. Sirve para comparar con GA4 y saber
 * qué parte del tráfico no ve Google Analytics.
 *
 * Descarta las visitas propias (?interno=1, mismo flag que GA4) y los robots
 * de medición, igual que el script de consentimiento de RootDocument.
 */
function descartarInternas(evento: BeforeSendEvent): BeforeSendEvent | null {
  try {
    if (window.localStorage.getItem("exploraspain_interno") === "1") return null;
  } catch {
    // localStorage bloqueado: se cuenta la visita.
  }
  if (/Chrome-Lighthouse|HeadlessChrome|PTST|Speed Insights/i.test(navigator.userAgent)) {
    return null;
  }
  return evento;
}

export default function AnaliticaVercel() {
  return <Analytics beforeSend={descartarInternas} />;
}
