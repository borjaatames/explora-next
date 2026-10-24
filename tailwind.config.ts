import type { Config } from "tailwindcss";

/**
 * Paleta de marca «Añil y Cal» (rediseño oct 2026).
 *
 * Escalas propias que sustituyen a las de serie de Tailwind:
 *   - anil    (antes sky)    → color de marca: heros, enlaces, navegación.
 *   - azafran (antes amber)  → CTA comercial (Reservar) SIEMPRE con texto
 *                              oscuro (piedra-900); blanco sobre azafran-500
 *                              no pasa WCAG AA.
 *   - piedra  (antes slate)  → neutros cálidos (cal/piedra) en 50–700 y
 *                              azul noche en 800–950 (texto y footer).
 *   - cobre   (antes emerald)→ acento positivo/✓.
 *   - teja    (antes rose)   → errores y ✗.
 *
 * Contrastes verificados (WCAG AA):
 *   blanco sobre anil-500 11,1:1 · piedra-900 sobre azafran-500 7,2:1 ·
 *   piedra-500 sobre blanco 4,9:1 · blanco sobre cobre-600 5,6:1 ·
 *   blanco sobre teja-500 5,4:1.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/guiasReservas.ts",
  ],
  theme: {
    extend: {
      colors: {
        anil: {
          50: "#F3F6FB",
          100: "#E4EBF6",
          200: "#C9D6EC",
          300: "#A3B8DB",
          400: "#6C89BE",
          500: "#1F3A6E",
          600: "#1B3463",
          700: "#152A52",
          800: "#112244",
          900: "#0D1A36",
          950: "#091226",
        },
        azafran: {
          50: "#FCF7EA",
          100: "#F8EDD2",
          200: "#F1DCA6",
          300: "#EAC878",
          400: "#E7B342",
          500: "#E3A21A",
          600: "#C08708",
          700: "#9C6D06",
          800: "#7E5708",
          900: "#66460B",
          950: "#3F2B06",
        },
        piedra: {
          50: "#FAF7F0",
          100: "#F2EEE3",
          200: "#E7E1D4",
          300: "#D5CDBC",
          400: "#A89F8F",
          500: "#7B7466",
          600: "#5D574B",
          700: "#46413A",
          800: "#24324F",
          900: "#14213D",
          950: "#0C1528",
        },
        cobre: {
          50: "#EDF4F1",
          100: "#D8E7E2",
          200: "#B5D1C8",
          300: "#8CB5A9",
          400: "#5E9486",
          500: "#3B7A6B",
          600: "#2F6B5E",
          700: "#27584E",
          800: "#20463E",
          900: "#1A3A34",
          950: "#0F2320",
        },
        teja: {
          50: "#FBF0ED",
          100: "#F6DED7",
          200: "#EBBCAF",
          300: "#DE937F",
          400: "#CD6A50",
          500: "#B8432A",
          600: "#9C3722",
          700: "#7E2C1C",
          800: "#652418",
          900: "#521E15",
          950: "#2D0F0A",
        },
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)"],
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
