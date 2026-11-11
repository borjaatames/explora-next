"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { COOKIE_CONSENT_EVENT, leerConsentimiento } from "@/lib/cookies";

type Props = {
  /** Project ID de Microsoft Clarity. Sin él, el componente no renderiza nada. */
  projectId: string | undefined;
};

type ClarityFn = (comando: string, ...args: unknown[]) => void;

/** Mismos filtros que GA4 y Vercel: visitas propias y robots de medición. */
function esVisitaExcluida(): boolean {
  if (/Chrome-Lighthouse|HeadlessChrome|PTST|Speed Insights/i.test(navigator.userAgent)) {
    return true;
  }
  try {
    return window.localStorage.getItem("exploraspain_interno") === "1";
  } catch {
    return false;
  }
}

/**
 * Microsoft Clarity (mapas de calor y grabaciones) SOLO con consentimiento
 * de análisis. A diferencia de GA4, no se carga en modo cookieless: si el
 * usuario no ha aceptado, el script no se descarga.
 *
 * `lazyOnload` lo deja para cuando el navegador está ocioso, después del
 * widget de reserva y los botones.
 *
 * Si el usuario retira el consentimiento con Clarity ya cargado, se le
 * avisa con la Consent API (`clarity("consent", false)`), que borra sus
 * cookies y deja de grabar.
 */
export default function Clarity({ projectId }: Props) {
  const [permitido, setPermitido] = useState<boolean>(false);

  useEffect(() => {
    if (!projectId || esVisitaExcluida()) return;

    const sincronizar = (): void => {
      const concedido = leerConsentimiento() === "granted";
      setPermitido((antes) => antes || concedido);
      const clarity = (window as unknown as { clarity?: ClarityFn }).clarity;
      if (clarity) clarity("consent", concedido);
    };

    sincronizar();
    window.addEventListener(COOKIE_CONSENT_EVENT, sincronizar);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sincronizar);
  }, [projectId]);

  if (!projectId || !/^[a-z0-9]+$/i.test(projectId) || !permitido) return null;

  return (
    <Script id="ms-clarity" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");window.clarity("consent");`}
    </Script>
  );
}
