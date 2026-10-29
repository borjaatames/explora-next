import Image from "next/image";
import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";

export type MigaCiudad = { label: string; href?: string };
export type DatoClave = { etiqueta: string; valor: string };

const DICT = {
  es: { resumen: "Resumen", actividades: "Actividades", privadas: "Privadas", guias: "Guías", atracciones: "Atracciones", secciones: "Secciones de", migas: "Migas de pan", datos: "Datos clave" },
  en: { resumen: "Overview", actividades: "Activities", privadas: "Private tours", guias: "Guides", atracciones: "Attractions", secciones: "Sections of", migas: "Breadcrumb", datos: "Key facts" },
  de: { resumen: "Überblick", actividades: "Aktivitäten", privadas: "Privattouren", guias: "Reiseführer", atracciones: "Sehenswürdigkeiten", secciones: "Bereiche von", migas: "Brotkrümel", datos: "Eckdaten" },
} as const;

type Props = {
  idioma: Idioma;
  nombre: string;
  descripcion: string;
  comunidad: string;
  imagen?: string;
  imagenAlt?: string;
  migas: ReadonlyArray<MigaCiudad>;
  urlActividades?: string;
  /** Página de excursiones privadas de la ciudad, si existe. */
  urlPrivados?: string;
  urlGuias?: string;
  urlAtracciones?: string;
};

/**
 * Hero de la página de ciudad: foto a sangre con velo inferior, texto
 * alineado abajo a la izquierda y barra de pestañas a las subpáginas.
 * El fondo de reserva es piedra-900 (no anil-500) para que no haya un
 * destello azul mientras carga la foto.
 */
export default function HeroCiudad({
  idioma,
  nombre,
  descripcion,
  comunidad,
  imagen,
  imagenAlt,
  migas,
  urlActividades,
  urlPrivados,
  urlGuias,
  urlAtracciones,
}: Props) {
  const t = DICT[idioma === "en" ? "en" : idioma === "de" ? "de" : "es"];
  type Pestana = { label: string; href: string };
  const pestanas: Pestana[] = [
    urlActividades ? { label: t.actividades as string, href: urlActividades } : null,
    urlPrivados ? { label: t.privadas as string, href: urlPrivados } : null,
    urlGuias ? { label: t.guias as string, href: urlGuias } : null,
    urlAtracciones ? { label: t.atracciones as string, href: urlAtracciones } : null,
  ].filter((p): p is Pestana => p !== null);

  return (
    <>
      <header className="relative isolate bg-piedra-900 text-white overflow-hidden">
        {imagen ? (
          <Image
            src={imagen}
            alt={imagenAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover -z-10"
          />
        ) : null}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-piedra-900/90 via-piedra-900/40 to-piedra-900/20"
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto px-4 min-h-[240px] md:min-h-[380px] flex flex-col justify-end pt-12 pb-6 md:pb-10">
          <nav aria-label={t.migas} className="text-sm text-anil-100 mb-4">
            {migas.map((m, i) => (
              <span key={m.label}>
                {i > 0 ? " › " : null}
                {m.href ? (
                  <Link href={m.href}
      prefetch={false} className="hover:text-white transition-colors">
                    {m.label}
                  </Link>
                ) : (
                  <span className="text-white">{m.label}</span>
                )}
              </span>
            ))}
          </nav>
          <span className="self-start inline-block border border-white/60 text-white text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded mb-4">
            {comunidad}
          </span>
          <h1 className="font-fraunces text-4xl md:text-6xl font-bold leading-none mb-3 md:mb-4">
            {nombre}
          </h1>
          <p className="text-base md:text-xl text-anil-50 max-w-2xl leading-relaxed line-clamp-2 md:line-clamp-none">
            {descripcion}
          </p>
        </div>
      </header>

      {pestanas.length > 0 && (
        <nav
          aria-label={`${t.secciones} ${nombre}`}
          className="border-b border-piedra-200 bg-white"
        >
          <div className="max-w-6xl mx-auto px-4 flex gap-6 md:gap-9 overflow-x-auto">
            <span
              aria-current="page"
              className="py-4 text-sm md:text-base font-semibold text-piedra-900 border-b-2 border-piedra-900 whitespace-nowrap"
            >
              {t.resumen}
            </span>
            {pestanas.map((p) => (
              <Link
                key={p.href}
                href={p.href}
      prefetch={false}
                className="py-4 text-sm md:text-base font-semibold text-piedra-600 hover:text-anil-700 border-b-2 border-transparent hover:border-anil-400 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}

export function DatosClaveCiudad({
  idioma,
  datos,
}: {
  idioma: Idioma;
  datos: ReadonlyArray<DatoClave>;
}) {
  if (datos.length === 0) return null;
  const t = DICT[idioma === "en" ? "en" : idioma === "de" ? "de" : "es"];
  return (
    <section aria-label={t.datos} className="max-w-3xl mx-auto px-4 pt-10 md:pt-12">
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 border border-piedra-200 rounded-xl p-5 md:p-6">
        {datos.map((d) => (
          <div key={d.etiqueta}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-piedra-500">
              {d.etiqueta}
            </dt>
            <dd className="mt-1 text-xl md:text-2xl font-bold text-piedra-900">
              {d.valor}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
