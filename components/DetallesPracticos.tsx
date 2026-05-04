import type { DetallesPracticos as DetallesPracticosTipo } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  idioma: Idioma;
  duracion: string;
  idiomas: string[];
  detalles?: DetallesPracticosTipo;
  cancelacionGratuita?: boolean;
  horasCancelacion?: number;
};

type Fila = {
  icono: JSX.Element;
  titulo: string;
  valor: string;
};

type Strings = {
  titulo: string;
  duracion: string;
  idiomasGuia: string;
  ticketMovil: string;
  ticketMovilValor: string;
  confirmacion: string;
  confirmacionValor: string;
  accesibleSilla: string;
  accesibleSillaSi: string;
  accesibleSillaNo: string;
  edadMinima: string;
  edadSinRestriccion: string;
  edadAnios: (n: number) => string;
  mascotas: string;
  mascotasSi: string;
  mascotasNo: string;
  cancelacion: string;
  cancelacionConHoras: (h: number) => string;
  cancelacionGratuita: string;
  nombresIdioma: Record<string, string>;
};

/**
 * Diccionario interno del componente. Sigue el patrón ya usado por Navbar,
 * Footer y CookieBanner para evitar prop drilling del diccionario global y
 * mantener cada componente autocontenido. Si en el futuro se activan más
 * idiomas, se añaden aquí — el tipo `Strings` garantiza paridad de claves.
 */
const DICT: Record<"es" | "en", Strings> = {
  es: {
    titulo: "Detalles prácticos",
    duracion: "Duración",
    idiomasGuia: "Idiomas del guía",
    ticketMovil: "Ticket en el móvil",
    ticketMovilValor: "No hace falta imprimir",
    confirmacion: "Confirmación al instante",
    confirmacionValor: "Tras la reserva",
    accesibleSilla: "Accesible en silla",
    accesibleSillaSi: "Sí · indícalo al reservar",
    accesibleSillaNo: "No",
    edadMinima: "Edad mínima",
    edadSinRestriccion: "Sin restricción",
    edadAnios: (n: number) => `${n} años`,
    mascotas: "Mascotas",
    mascotasSi: "Permitidas",
    mascotasNo: "No permitidas",
    cancelacion: "Cancelación",
    cancelacionConHoras: (h: number) => `Gratuita hasta ${h}h antes`,
    cancelacionGratuita: "Gratuita",
    nombresIdioma: {
      es: "Español",
      en: "Inglés",
      fr: "Francés",
      de: "Alemán",
      it: "Italiano",
      pt: "Portugués",
    },
  },
  en: {
    titulo: "Practical details",
    duracion: "Duration",
    idiomasGuia: "Guide languages",
    ticketMovil: "Mobile ticket",
    ticketMovilValor: "No need to print",
    confirmacion: "Instant confirmation",
    confirmacionValor: "Right after booking",
    accesibleSilla: "Wheelchair accessible",
    accesibleSillaSi: "Yes · flag it when booking",
    accesibleSillaNo: "No",
    edadMinima: "Minimum age",
    edadSinRestriccion: "No restriction",
    edadAnios: (n: number) => `${n}+`,
    mascotas: "Pets",
    mascotasSi: "Allowed",
    mascotasNo: "Not allowed",
    cancelacion: "Cancellation",
    cancelacionConHoras: (h: number) => `Free up to ${h}h before`,
    cancelacionGratuita: "Free cancellation",
    nombresIdioma: {
      es: "Spanish",
      en: "English",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
    },
  },
};

/**
 * Selector defensivo: si llega un idioma no cubierto en `DICT` (caso futuro
 * cuando se activen DE/FR/IT/PT antes de añadir sus traducciones aquí),
 * cae a inglés en vez de romper el render.
 */
function dictFor(idioma: Idioma): Strings {
  if (idioma === "es") return DICT.es;
  return DICT.en;
}

function formatearIdiomas(
  idiomas: string[],
  nombres: Record<string, string>
): string {
  if (idiomas.length === 0) return "—";
  return idiomas.map((id) => nombres[id] || id).join(" · ");
}

const ICONO_BASE = "w-5 h-5 text-sky-600 flex-none mt-0.5";

const ICONOS = {
  reloj: (
    <svg
      className={ICONO_BASE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  globo: (
    <svg
      className={ICONO_BASE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </svg>
  ),
  movil: (
    <svg
      className={ICONO_BASE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M11 18h2" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg
      className={ICONO_BASE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  silla: (
    <svg
      className={ICONO_BASE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="9" cy="6" r="2" />
      <path
        d="M9 8v4h6l2 5M9 12a5 5 0 105 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  edad: (
    <svg
      className={ICONO_BASE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" strokeLinecap="round" />
    </svg>
  ),
  mascota: (
    <svg
      className={ICONO_BASE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="6" cy="9" r="1.5" />
      <circle cx="10" cy="6" r="1.5" />
      <circle cx="14" cy="6" r="1.5" />
      <circle cx="18" cy="9" r="1.5" />
      <path d="M12 11c-3 0-5 3-5 6 0 2 2 3 5 3s5-1 5-3c0-3-2-6-5-6z" />
    </svg>
  ),
  refresh: (
    <svg
      className={ICONO_BASE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        d="M3 12a9 9 0 0115-6.7L21 8M21 4v4h-4M21 12a9 9 0 01-15 6.7L3 16M3 20v-4h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/**
 * Bloque "Detalles prácticos" — grid 2 columnas con 4-8 datos clave.
 *
 * Las filas que no tienen información en el frontmatter se omiten,
 * de forma que el bloque siempre se ve completo aunque la actividad
 * no tenga todos los campos. Si NO hay ninguna fila renderizable
 * (caso extremo), el bloque entero no se renderiza.
 */
export default function DetallesPracticos({
  idioma,
  duracion,
  idiomas,
  detalles,
  cancelacionGratuita,
  horasCancelacion,
}: Props) {
  const t = dictFor(idioma);
  const filas: Fila[] = [];

  if (duracion) {
    filas.push({
      icono: ICONOS.reloj,
      titulo: t.duracion,
      valor: duracion,
    });
  }

  if (idiomas && idiomas.length > 0) {
    filas.push({
      icono: ICONOS.globo,
      titulo: t.idiomasGuia,
      valor: formatearIdiomas(idiomas, t.nombresIdioma),
    });
  }

  if (detalles?.ticketMovil) {
    filas.push({
      icono: ICONOS.movil,
      titulo: t.ticketMovil,
      valor: t.ticketMovilValor,
    });
  }

  if (detalles?.confirmacionInmediata) {
    filas.push({
      icono: ICONOS.check,
      titulo: t.confirmacion,
      valor: t.confirmacionValor,
    });
  }

  if (detalles?.accesibleSilla === true) {
    filas.push({
      icono: ICONOS.silla,
      titulo: t.accesibleSilla,
      valor: t.accesibleSillaSi,
    });
  } else if (detalles?.accesibleSilla === false) {
    filas.push({
      icono: ICONOS.silla,
      titulo: t.accesibleSilla,
      valor: t.accesibleSillaNo,
    });
  }

  if (detalles?.edadMinima !== undefined) {
    filas.push({
      icono: ICONOS.edad,
      titulo: t.edadMinima,
      valor:
        detalles.edadMinima === 0
          ? t.edadSinRestriccion
          : t.edadAnios(detalles.edadMinima),
    });
  }

  if (detalles?.mascotasPermitidas !== undefined) {
    filas.push({
      icono: ICONOS.mascota,
      titulo: t.mascotas,
      valor: detalles.mascotasPermitidas ? t.mascotasSi : t.mascotasNo,
    });
  }

  if (cancelacionGratuita) {
    filas.push({
      icono: ICONOS.refresh,
      titulo: t.cancelacion,
      valor: horasCancelacion
        ? t.cancelacionConHoras(horasCancelacion)
        : t.cancelacionGratuita,
    });
  }

  if (filas.length === 0) return null;

  return (
    <section
      aria-labelledby="detalles-practicos-titulo"
      className="bg-slate-50 border border-slate-200 rounded-lg p-6 md:p-7"
    >
      <h2
        id="detalles-practicos-titulo"
        className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-5"
      >
        {t.titulo}
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {filas.map((fila) => (
          <div key={fila.titulo} className="flex items-start gap-3">
            {fila.icono}
            <div className="text-sm">
              <dt className="font-semibold text-slate-900">{fila.titulo}</dt>
              <dd className="text-slate-600 mt-0.5">{fila.valor}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
