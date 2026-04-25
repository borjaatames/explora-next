import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ExploraSpain | Tours, actividades y guías de viaje por España",
    template: "%s | ExploraSpain",
  },
  description:
    "Tours y actividades en las mejores ciudades de España, junto con guías editoriales honestas: rutas con criterio, comparativas reales y consejos prácticos.",
  applicationName: "ExploraSpain",
  authors: [{ name: "SKYWARD PARTNERS, S.L." }],
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
      "Tours y actividades en las mejores ciudades de España. Guías honestas, rutas con criterio y comparativas reales.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-inter bg-white text-slate-900 antialiased">
        <Navbar />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
