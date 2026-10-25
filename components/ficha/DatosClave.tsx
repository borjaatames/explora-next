import type { DetallesPracticos } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  idioma: Idioma;
  titulo: string;
  categoria: string;
  /** Tour privado: muestra el dato «privada». */
  privada?: boolean;
  duracion: string;
  idiomas: string[];
  highlights?: string[];
  cancelacionGratuita?: boolean;
  horasCancelacion?: number;
  detalles?: DetallesPracticos;
};

type Textos = {
  aria: string;
  cancelacion: (h?: number) => string;
  privada: string;
  grupoReducido: string;
  sinColas: string;
  movilConfirmacion: string;
  movil: string;
  confirmacion: string;
  idiomas: Record<string, string>;
};

const TEXTOS: Record<"es" | "en", Textos> = {
  es: {
    aria: "Datos clave de la actividad",
    cancelacion: (h) => (h ? `Cancelación gratis hasta ${h} h antes` : "Cancelación gratis"),
    privada: "Privada: solo tu grupo",
    grupoReducido: "Grupo reducido",
    sinColas: "Acceso sin colas",
    movilConfirmacion: "Entrada en el móvil y confirmación al instante",
    movil: "Entrada en el móvil",
    confirmacion: "Confirmación al instante",
    idiomas: { es: "Español", en: "Inglés", fr: "Francés", de: "Alemán", it: "Italiano", pt: "Portugués" },
  },
  en: {
    aria: "Key facts about this activity",
    cancelacion: (h) => (h ? `Free cancellation up to ${h}h before` : "Free cancellation"),
    privada: "Private: just your group",
    grupoReducido: "Small group",
    sinColas: "Skip-the-line entry",
    movilConfirmacion: "Mobile ticket and instant confirmation",
    movil: "Mobile ticket",
    confirmacion: "Instant confirmation",
    idiomas: { es: "Spanish", en: "English", fr: "French", de: "German", it: "Italian", pt: "Portuguese" },
  },
};

type Icono = "reloj" | "calendario" | "idioma" | "grupo" | "ticket" | "movil";

const TRAZOS: Record<Icono, string> = {
  reloj: "M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  calendario: "M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 9 2 2 4-4",
  idioma: "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  grupo: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m18 0v-1a4 4 0 0 0-3-3.9M14 4.1a4 4 0 0 1 0 7.8M13.5 7.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  ticket: "M3 9V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a2 2 0 0 0 0-4Zm10-3v12",
  movil: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2",
};

function IconoDato({ tipo }: { tipo: Icono }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 flex-none text-anil-600"
    >
      <path d={TRAZOS[tipo]} />
    </svg>
  );
}

const RE_SIN_COLAS = /sin colas|sin hacer cola|skip[- ]the[- ]line|skip[- ]line|acceso prioritario|priority access/i;
const RE_GRUPO_REDUCIDO = /grupo reducido|grupos reducidos|small[- ]group/i;

/**
 * Datos clave con iconos bajo el título de la ficha (patrón de GetYourGuide):
 * duración, cancelación, idiomas, tipo de grupo, sin colas y entrada móvil.
 * Solo muestra lo que el frontmatter confirma; nada se inventa. Solo móvil:
 * en escritorio siguen las etiquetas de duración y cancelación de siempre.
 */
export default function DatosClave({
  idioma,
  titulo,
  privada = false,
  duracion,
  idiomas,
  highlights = [],
  cancelacionGratuita,
  horasCancelacion,
  detalles,
}: Props) {
  const t = idioma === "es" ? TEXTOS.es : TEXTOS.en;
  const textoActividad = [titulo, ...highlights].join(" ");

  const nombresIdiomas = idiomas.map((c) => t.idiomas[c] ?? c.toUpperCase());
  const idiomasTexto =
    nombresIdiomas.length > 3
      ? `${nombresIdiomas.slice(0, 3).join(", ")} +${nombresIdiomas.length - 3}`
      : nombresIdiomas.join(", ");

  const movilYConfirmacion =
    detalles?.ticketMovil && detalles?.confirmacionInmediata
      ? t.movilConfirmacion
      : detalles?.ticketMovil
        ? t.movil
        : detalles?.confirmacionInmediata
          ? t.confirmacion
          : null;

  const datos: { icono: Icono; texto: string }[] = [
    ...(duracion ? [{ icono: "reloj" as const, texto: duracion }] : []),
    ...(cancelacionGratuita
      ? [{ icono: "calendario" as const, texto: t.cancelacion(horasCancelacion) }]
      : []),
    ...(privada
      ? [{ icono: "grupo" as const, texto: t.privada }]
      : RE_GRUPO_REDUCIDO.test(textoActividad)
        ? [{ icono: "grupo" as const, texto: t.grupoReducido }]
        : []),
    ...(RE_SIN_COLAS.test(textoActividad) ? [{ icono: "ticket" as const, texto: t.sinColas }] : []),
    ...(idiomasTexto ? [{ icono: "idioma" as const, texto: idiomasTexto }] : []),
    ...(movilYConfirmacion ? [{ icono: "movil" as const, texto: movilYConfirmacion }] : []),
  ];

  if (datos.length === 0) return null;

  return (
    <ul
      aria-label={t.aria}
      className="md:hidden mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-piedra-700"
    >
      {datos.map((d) => (
        <li key={d.texto} className="flex items-start gap-2.5">
          <IconoDato tipo={d.icono} />
          <span className="leading-snug pt-0.5">{d.texto}</span>
        </li>
      ))}
    </ul>
  );
}
