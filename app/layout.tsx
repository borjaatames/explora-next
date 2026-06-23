import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Analytics from "@/components/Analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ExploraSpain | Tours, actividades y guías de viaje por España",
    template: "%s | ExploraSpain",
  },
  description:
    "Tours y actividades en las mejores ciudades de España, junto con guías editoriales honestas: rutas con criterio, selección honesta y consejos prácticos.",
  applicationName: "ExploraSpain",
  authors: [{ name: "SKYWARD PARTNERS, S.L." }],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    googleBot: {
      index: allowIndexing,
      follow: allowIndexing,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "ExploraSpain",
    title: "ExploraSpain | Tours, actividades y guías de viaje por España",
    description:
      "Tours y actividades en las mejores ciudades de España. Guías honestas, rutas con criterio y selección editorial.",
  },
};

/**
 * RootLayout global. NO monta Navbar/Footer/CookieBanner — eso lo hace
 * cada layout segmentado:
 *   - app/(es-shell)/layout.tsx → shell ES (home, guías, ciudades)
 *   - app/[lang]/layout.tsx     → shell EN
 *   - app/sem/layout.tsx        → shell SEM (solo CookieBanner, sin nav/footer)
 *
 * Inicializa Consent Mode v2 con todos los parámetros en "denied" antes de
 * que cargue gtag.js. Esto cumple GDPR y permite que Google Ads reciba
 * señales modeladas aunque el usuario rechace cookies.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
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
          `}
        </Script>

        {/*
         * Calienta la conexión con el host del widget de reserva de Bokun
         * (widgets.bokun.io). El calendario de las fichas `proveedor: bokun`
         * es un iframe externo que tarda en montar porque requiere varias
         * idas y vueltas a Bokun (loader → iframe → disponibilidad). Abrir
         * el DNS + TLS por adelantado recorta ese arranque. Es solo una
         * pista de conexión, sin coste apreciable en páginas sin Bokun.
         */}
        <link rel="preconnect" href="https://widgets.bokun.io" />
        <link rel="dns-prefetch" href="https://widgets.bokun.io" />

        {/*
         * Fraud Blocker — detección de clic fraudulento en campañas de Ads.
         * Registra IP, ubicación, device fingerprint y origen del clic de los
         * visitantes para que Fraud Blocker pueda excluir automáticamente las
         * IPs fraudulentas en Google Ads. sid = identificador del sitio.
         */}
        <link rel="preconnect" href="https://monitor.fraudblocker.com" />
        <Script
          id="fraud-blocker"
          strategy="afterInteractive"
          src="https://monitor.fraudblocker.com/fbt.js?sid=8YRRIOE9RVopNfa3izfp0"
        />
      </head>
      <body className="font-inter bg-white text-slate-900 antialiased">
        {/* Fraud Blocker: respaldo sin JavaScript (beacon de imagen). */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <a href="https://fraudblocker.com" rel="nofollow">
            <img
              src="https://monitor.fraudblocker.com/fbt.gif?sid=8YRRIOE9RVopNfa3izfp0"
              alt="Fraud Blocker"
            />
          </a>
        </noscript>
        {children}
        <Analytics gaId={gaId} />
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
