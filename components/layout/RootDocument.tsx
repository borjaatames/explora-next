import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Analytics from "@/components/Analytics";
import WebVitals from "@/components/WebVitals";
import { inter, fraunces } from "@/lib/fonts";
import { allowIndexing } from "@/lib/rootMetadata";
import type { Idioma } from "@/lib/i18n/types";
import "@/app/globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

type Props = {
  lang: Idioma;
  children: React.ReactNode;
};

/**
 * Documento HTML común (<html>, <head>, <body>) de los dos layouts raíz:
 *   - app/(es-shell)/layout.tsx → lang="es"
 *   - app/[lang]/layout.tsx     → lang="en" | "de"
 *
 * Al tener un layout raíz por idioma, `<html lang>` sale correcto en el
 * HTML estático (SSG) sin JS ni headers().
 *
 * Inicializa Consent Mode v2 con todos los parámetros en "denied" antes de
 * que cargue gtag.js. Esto cumple GDPR y permite que Google Ads reciba
 * señales modeladas aunque el usuario rechace cookies.
 */
export default function RootDocument({ lang, children }: Props) {
  return (
    <html lang={lang} className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 500
            });
            gtag('set', 'ads_data_redaction', true);
            gtag('set', 'url_passthrough', true);

            // Visitas propias: abrir la web una vez con ?interno=1 en cada
            // navegador/dispositivo desactiva GA4 ahí para siempre (no depende
            // de la IP, que cambia). ?interno=0 lo revierte.
            try {
              var interno = new URLSearchParams(window.location.search).get('interno');
              if (interno === '1') window.localStorage.setItem('exploraspain_interno', '1');
              if (interno === '0') window.localStorage.removeItem('exploraspain_interno');
              // Robots de medición (PageSpeed/Lighthouse, WebPageTest, Chrome headless)
              // abrían sesiones de 0 s que inflaban el rebote en los informes.
              var robot = /Chrome-Lighthouse|HeadlessChrome|PTST|Speed Insights/i.test(navigator.userAgent);
              if (robot || window.localStorage.getItem('exploraspain_interno') === '1') {
                window['ga-disable-${gaId ?? ""}'] = true;
              }
            } catch (e) {}
          `}
        </Script>

        {/*
         * Solo dns-prefetch hacia widgets.bokun.io: el widget de reserva se
         * carga en diferido (ver BokunWidget.tsx), así que un preconnect
         * abría una conexión TLS que nadie usaba en la carga inicial y
         * PageSpeed lo marcaba como "preconnect no usado".
         */}
        <link rel="dns-prefetch" href="https://widgets.bokun.io" />
      </head>
      <body className="font-inter bg-white text-piedra-900 antialiased">
        {children}
        <Analytics gaId={gaId} />
        {gaId ? <WebVitals /> : null}
        {/*
         * Vercel Speed Insights: recoge Core Web Vitals (LCP, INP, CLS,
         * FCP, TTFB) de usuarios reales en sus dispositivos reales y los
         * envía al dashboard de Vercel. Sin cookies, sin PII, anonimizado
         * — no requiere consentimiento bajo GDPR.
         *
         * Solo emite señales cuando NEXT_PUBLIC_ALLOW_INDEXING="true"
         * (producción real); en preview/staging quedaría desactivado para
         * no contaminar las métricas con tráfico interno.
         */}
        {allowIndexing && <SpeedInsights />}
      </body>
    </html>
  );
}
