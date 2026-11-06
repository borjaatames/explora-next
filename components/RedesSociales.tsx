import type { Idioma } from "@/lib/i18n/types";
import { REDES_SOCIALES, type RedSocialId } from "@/lib/redesSociales";

/**
 * Fila de iconos con enlaces a los perfiles de ExploraSpain.
 * - "oscuro": sobre el fondo del footer (piedra-900).
 * - "claro": sobre fondo blanco (página de contacto).
 * Server Component: solo enlaces, sin JS en cliente.
 */

const TEXTOS = {
  es: { titulo: "Síguenos", en: "ExploraSpain en" },
  en: { titulo: "Follow us", en: "ExploraSpain on" },
  de: { titulo: "Folge uns", en: "ExploraSpain auf" },
  fr: { titulo: "Suivez-nous", en: "ExploraSpain sur" },
  it: { titulo: "Seguici", en: "ExploraSpain su" },
  pt: { titulo: "Siga-nos", en: "ExploraSpain no" },
} as const satisfies Record<Idioma, { titulo: string; en: string }>;

type Variante = "oscuro" | "claro";

interface Props {
  idioma: Idioma;
  variante: Variante;
  /** Muestra el título "Síguenos" encima de los iconos. */
  conTitulo?: boolean;
  className?: string;
}

const ESTILOS: Record<Variante, { titulo: string; enlace: string }> = {
  oscuro: {
    titulo: "text-white font-semibold text-sm mb-2",
    enlace:
      "border-piedra-700 text-piedra-300 hover:text-white hover:border-piedra-400 focus-visible:ring-offset-piedra-900",
  },
  claro: {
    titulo: "font-fraunces text-xl font-bold text-piedra-900 mb-3",
    enlace:
      "border-piedra-200 text-piedra-700 hover:text-anil-700 hover:border-anil-400 focus-visible:ring-offset-white",
  },
};

export default function RedesSociales({
  idioma,
  variante,
  conTitulo = true,
  className = "",
}: Props) {
  const t = TEXTOS[idioma];
  const estilos = ESTILOS[variante];

  return (
    <div className={className}>
      {conTitulo ? <p className={estilos.titulo}>{t.titulo}</p> : null}
      <ul className="flex items-center gap-3">
        {REDES_SOCIALES.map((red) => (
          <li key={red.id}>
            <a
              href={red.url}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={`${t.en} ${red.nombre}`}
              title={red.nombre}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 ${estilos.enlace}`}
            >
              <IconoRed id={red.id} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconoRed({ id }: { id: RedSocialId }) {
  switch (id) {
    case "instagram":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
          <circle cx="12" cy="12" r="4.25" />
          <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.5 22v-8.2h2.8l.45-3.3H13.5V8.4c0-.95.27-1.6 1.63-1.6h1.72V3.85A23 23 0 0 0 14.33 3.7c-2.5 0-4.2 1.52-4.2 4.32v2.48H7.3v3.3h2.83V22h3.37Z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
        </svg>
      );
  }
}
