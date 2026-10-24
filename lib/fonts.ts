import { Inter, Fraunces } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

/**
 * Serif de titulares de la marca «Añil y Cal» (sustituye a Playfair
 * Display, oct 2026). Se expone como `font-fraunces` en Tailwind.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
