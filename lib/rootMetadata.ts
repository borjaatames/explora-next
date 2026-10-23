import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const rootMetadata: Metadata = {
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
