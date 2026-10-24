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
  es: {
    errorLabel: "Error 404",
    titulo: "Esta página no existe (o ya no)",
    descripcion:
      "El enlace puede estar desactualizado o la actividad que buscabas ya no está disponible. Seguimos teniendo guías y actividades por toda España — empieza por aquí.",
    volver: "Volver al inicio",
    verGuias: "Ver todas las guías →",
    verCiudades: "Ver todas las ciudades →",
    destinos: "Destinos con más contenido",
    ciudades: [
      { slug: "madrid", nombre: "Madrid" },
      { slug: "barcelona", nombre: "Barcelona" },
      { slug: "sevilla", nombre: "Sevilla" },
      { slug: "granada", nombre: "Granada" },
    ],
  },
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

const IDIOMA_FALLBACK: Idioma = IDIOMA_DEFECTO;

/**
 * Detecta el idioma real leyendo la URL con usePathname() (mismo patrón
 * que components/layout/LanguageSwitcher.tsx), porque not-found.tsx no
 * recibe los params del segmento dinámico padre. Si el primer segmento
 * no es un idioma activo distinto de "es" (URL que no existe, como
 * /esto-no-existe, que cae en app/[lang]/(l)/[...resto]), muestra el
 * texto en español, igual que el marco que pinta app/[lang]/layout.tsx.
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
  const homeHref = idioma === IDIOMA_DEFECTO ? "/" : `/${idioma}`;

  return (
    <main className="min-h-screen bg-white flex items-center">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
        <p className="font-fraunces text-anil-600 text-lg font-semibold mb-2">
          {t.errorLabel}
        </p>
        <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-piedra-900 mb-4 leading-tight">
          {t.titulo}
        </h1>
        <p className="text-lg text-piedra-600 mb-10 max-w-xl mx-auto">
          {t.descripcion}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center bg-white border border-piedra-300 hover:border-anil-400 text-piedra-900 font-semibold px-6 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
          >
            {t.volver}
          </Link>
          <Link
            href={urlIndiceGuias(idioma)}
            className="inline-flex items-center text-anil-600 hover:text-anil-700 font-medium transition-colors"
          >
            {t.verGuias}
          </Link>
          <Link
            href={urlIndiceCiudades(idioma)}
            className="inline-flex items-center text-anil-600 hover:text-anil-700 font-medium transition-colors"
          >
            {t.verCiudades}
          </Link>
        </div>

        <div className="pt-10 border-t border-piedra-200">
          <p className="text-sm font-semibold uppercase tracking-wider text-piedra-500 mb-4">
            {t.destinos}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {t.ciudades.map((c) => (
              <Link
                key={c.slug}
                href={urlCiudad(idioma, c.slug)}
                className="inline-block bg-anil-100 text-anil-700 text-sm font-semibold px-3 py-1.5 rounded hover:bg-anil-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
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
