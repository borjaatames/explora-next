import type { DetallesPracticos as DetallesPracticosTipo } from "@/lib/actividades";

type Props = {
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

const NOMBRES_IDIOMA: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  fr: "Francés",
  de: "Alemán",
  it: "Italiano",
  pt: "Portugués",
};

function formatearIdiomas(idiomas: string[]): string {
  if (idiomas.length === 0) return "—";
  return idiomas.map((id) => NOMBRES_IDIOMA[id] || id).join(" · ");
}

/**
 * Bloque "Detalles prácticos" — grid 2 columnas con 4-8 datos clave.
 *
 * Las filas que no tienen información en el frontmatter se omiten,
 * de forma que el bloque siempre se ve completo aunque la actividad
 * no tenga todos los campos. Si NO hay ninguna fila renderizable
 * (caso extremo), el bloque entero no se renderiza desde el page.
 */
export default function DetallesPracticos({
  duracion,
  idiomas,
  detalles,
  cancelacionGratuita,
  horasCancelacion,
}: Props) {
  const filas: Fila[] = [];

  if (duracion) {
    filas.push({
      icono: ICONOS.reloj,
      titulo: "Duración",
      valor: duracion,
    });
  }

  if (idiomas && idiomas.length > 0) {
    filas.push({
      icono: ICONOS.globo,
      titulo: "Idiomas del guía",
      valor: formatearIdiomas(idiomas),
    });
  }

  if (detalles?.ticketMovil) {
    filas.push({
      icono: ICONOS.movil,
      titulo: "Ticket en el móvil",
      valor: "No hace falta imprimir",
    });
  }

  if (detalles?.confirmacionInmediata) {
    filas.push({
      icono: ICONOS.check,
      titulo: "Confirmación al instante",
      valor: "Tras la reserva",
    });
  }

  if (detalles?.accesibleSilla === true) {
    filas.push({
      icono: ICONOS.silla,
      titulo: "Accesible en silla",
      valor: "Sí · indícalo al reservar",
    });
  } else if (detalles?.accesibleSilla === false) {
    filas.push({
      icono: ICONOS.silla,
      titulo: "Accesible en silla",
      valor: "No",
    });
  }

  if (detalles?.edadMinima !== undefined) {
    filas.push({
      icono: ICONOS.edad,
      titulo: "Edad mínima",
      valor:
        detalles.edadMinima === 0
          ? "Sin restricción"
          : `${detalles.edadMinima} años`,
    });
  }

  if (detalles?.mascotasPermitidas !== undefined) {
    filas.push({
      icono: ICONOS.mascota,
      titulo: "Mascotas",
      valor: detalles.mascotasPermitidas ? "Permitidas" : "No permitidas",
    });
  }

  if (cancelacionGratuita) {
    filas.push({
      icono: ICONOS.refresh,
      titulo: "Cancelación",
      valor: horasCancelacion
        ? `Gratuita hasta ${horasCancelacion}h antes`
        : "Gratuita",
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
        Detalles prácticos
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
