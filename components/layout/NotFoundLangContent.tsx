"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { esIdiomaActivo, IDIOMA_DEFECTO } from "@/lib/i18n/config";
import { urlIndiceGuias, urlIndiceCiudades, urlCiudad } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

type CiudadDestacada = { slug: string; nombre: string };

type Strings = {
  errorLabel: string;
  titulo: string;
  descripcion: string;
  volver: string;
  verGuias: string;
  verCiudades: string;
  destinos: string;
  ciudades: CiudadDestacada[];
};

/**
 * Textos del 404 por idioma. Añadir una entrada aquí es todo lo que
 * hace falta cuando se active fr/it/pt en IDIOMAS_ACTIVOS — no hay que
 * tocar el resto del componente.
 */
const STRINGS: Partial<Record<Idioma, Strings>> = {
  en: {
    errorLabel: "Error 404",
    titulo: "This page doesn't exist (anymore)",
    descripcion:
      "The link may be outdated, or the activity you were looking for is no longer available. We still have guides and activities all over Spain — start here.",
    volver: "Back to home",
    verGuias: "See all guides →",
    verCiudades: "See all cities →",
    destinos: "Destinations with the most content",
    ciudades: [
      { slug: "madrid", nombre: "Madrid" },
      { slug: "barcelona", nombre: "Barcelona" },
      { slug: "sevilla", nombre: "Seville" },
      { slug: "granada", nombre: "Granada" },
    ],
  },
  de: {
    errorLabel: "Fehler 404",
    titulo: "Diese Seite existiert nicht (mehr)",
    descripcion:
      "Der Link ist möglicherweise veraltet, oder die gesuchte Aktivität ist nicht mehr verfügbar. Wir haben weiterhin Reiseführer und Aktivitäten in ganz Spanien — hier geht's los.",
    volver: "Zurück zur Startseite",
    verGuias: "Alle Reiseführer ansehen →",
    verCiudades: "Alle Städte ansehen →",
    destinos: "Beliebteste Reiseziele",
    ciudades: [
      { slug: "madrid", nombre: "Madrid" },
      { slug: "barcelona", nombre: "Barcelona" },
      { slug: "sevilla", nombre: "Sevilla" },
      { slug: "granada", nombre: "Granada" },
    ],
  },
};

const IDIOMA_FALLBACK: Idioma = "en";

/**
 * Detecta el idioma real leyendo la URL con usePathname() (mismo patrón
 * que components/layout/LanguageSwitcher.tsx), porque not-found.tsx no
 * recibe los params del segmento dinámico padre. Si el primer segmento
 * no es un idioma activo distinto de "es" (no debería pasar dentro de
 * app/[lang]/, pero por si acaso), cae a inglés en vez de a español,
 * que es el idioma por defecto correcto para este shell.
 */
export default function NotFoundLangContent() {
  const pathname = usePathname() || "/";
  const primerSegmento = pathname.split("/").filter(Boolean)[0];
  const idioma: Idioma =
    primerSegmento &&
    esIdiomaActivo(primerSegmento) &&
    primerSegmento !== IDIOMA_DEFECTO
      ? primerSegmento
      : IDIOMA_FALLBACK;

  const t = STRINGS[idioma] ?? STRINGS[IDIOMA_FALLBACK]!;
  const homeHref = `/${idioma}`;

  return (
    <main className="min-h-screen bg-white flex items-center">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
        <p className="font-playfair text-sky-600 text-lg font-semibold mb-2">
          {t.errorLabel}
        </p>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          {t.titulo}
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
          {t.descripcion}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center bg-white border border-slate-300 hover:border-sky-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            {t.volver}
          </Link>
          <Link
            href={urlIndiceGuias(idioma)}
            className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            {t.verGuias}
          </Link>
          <Link
            href={urlIndiceCiudades(idioma)}
            className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            {t.verCiudades}
          </Link>
        </div>

        <div className="pt-10 border-t border-slate-200">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
            {t.destinos}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {t.ciudades.map((c) => (
              <Link
                key={c.slug}
                href={urlCiudad(idioma, c.slug)}
                className="inline-block bg-sky-100 text-sky-700 text-sm font-semibold px-3 py-1.5 rounded hover:bg-sky-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                {c.nombre}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
