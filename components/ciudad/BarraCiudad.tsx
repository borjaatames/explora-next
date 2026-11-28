import Link from "next/link";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { obtenerCiudadesConGuias } from "@/lib/guias";
import { obtenerCiudadesConPrivadas, urlPrivadasDeCiudad } from "@/lib/privados";
import { urlListadoActividadesSiExiste } from "@/lib/actividades";
import { urlAtraccionesDeCiudad, urlCiudad, urlGuiasDeCiudad } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

export type SeccionCiudad = "resumen" | "que-ver" | "actividades" | "privados" | "guias";

type Textos = Record<SeccionCiudad, string> & { aria: (ciudad: string) => string };

const TEXTOS: Record<Idioma, Textos> = {
  es: { resumen: "Resumen", "que-ver": "Qué ver", actividades: "Actividades", privados: "Privados", guias: "Guías", aria: (c) => `Secciones de ${c}` },
  en: { resumen: "Overview", "que-ver": "What to see", actividades: "Activities", privados: "Private tours", guias: "Guides", aria: (c) => `${c} sections` },
  de: { resumen: "Überblick", "que-ver": "Sehenswertes", actividades: "Aktivitäten", privados: "Privattouren", guias: "Reiseführer", aria: (c) => `Bereiche: ${c}` },
  fr: { resumen: "Aperçu", "que-ver": "À voir", actividades: "Activités", privados: "Excursions privées", guias: "Guides", aria: (c) => `Rubriques : ${c}` },
  it: { resumen: "Panoramica", "que-ver": "Cosa vedere", actividades: "Attività", privados: "Tour privati", guias: "Guide", aria: (c) => `Sezioni: ${c}` },
  pt: { resumen: "Visão geral", "que-ver": "O que ver", actividades: "Atividades", privados: "Tours privados", guias: "Guias", aria: (c) => `Secções: ${c}` },
};

type Props = {
  idioma: Idioma;
  ciudad: string;
  /** Pestaña marcada; sin valor en guías sueltas, fichas y atracciones. */
  activa?: SeccionCiudad;
};

/**
 * Barra de secciones de una ciudad, bajo el menú. Une en todas las páginas de
 * la ciudad el resumen, las atracciones, las actividades, los privados y las
 * guías. Solo muestra las pestañas cuya página existe en ese idioma.
 */
export default function BarraCiudad({ idioma, ciudad, activa }: Props) {
  const datos = obtenerListaCiudades(idioma).find((c) => c.slug === ciudad);
  if (!datos) return null;

  const t = TEXTOS[idioma];
  const conGuias = obtenerCiudadesConGuias(idioma).some((c) => c.ciudad === ciudad);
  const conPrivados = obtenerCiudadesConPrivadas(idioma).some((c) => c.ciudad === ciudad);
  const urlActividades = urlListadoActividadesSiExiste(idioma, ciudad);

  const secciones: { id: SeccionCiudad; href: string | null }[] = [
    { id: "resumen", href: urlCiudad(idioma, ciudad) },
    { id: "que-ver", href: (datos.atracciones ?? []).length > 0 ? urlAtraccionesDeCiudad(idioma, ciudad) : null },
    { id: "actividades", href: urlActividades },
    { id: "privados", href: conPrivados ? urlPrivadasDeCiudad(idioma, ciudad) : null },
    { id: "guias", href: conGuias ? urlGuiasDeCiudad(idioma, ciudad) : null },
  ];
  const visibles = secciones.filter((s): s is { id: SeccionCiudad; href: string } => s.href !== null);
  if (visibles.length < 2) return null;

  return (
    <div className="bg-white border-b border-piedra-200">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-4 md:gap-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="font-fraunces text-base md:text-lg font-bold text-anil-700 pr-4 md:pr-6 border-r border-piedra-200">
          {datos.nombre}
        </span>
        <nav aria-label={t.aria(datos.nombre)} className="flex items-center gap-4 md:gap-6">
          {visibles.map((s) => {
            const esActiva = s.id === activa;
            return (
              <Link
                key={s.id}
                href={s.href}
                aria-current={esActiva ? "page" : undefined}
                className={`py-3 text-sm border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 ${
                  esActiva
                    ? "border-anil-500 text-anil-700 font-semibold"
                    : "border-transparent text-piedra-700 hover:text-anil-700"
                }`}
              >
                {t[s.id]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
