import type { Idioma } from "@/lib/i18n/types";
import { getCreditosFotos } from "@/lib/creditos-fotos";

interface Props {
  idioma: Idioma;
  srcs: string[];
}

const TEXTOS = {
  es: { titulo: "Créditos de las fotos", webOficial: "Foto cedida por el establecimiento (web oficial)", fuente: "fuente", foto: "Foto" },
  en: { titulo: "Photo credits", webOficial: "Photo courtesy of the venue (official website)", fuente: "source", foto: "Photo" },
} as const;

/**
 * Créditos de las fotos de la galería (autor, licencia y fuente), leídos de
 * los CREDITOS.md en build. Las licencias CC BY / CC BY-SA exigen mostrarlos.
 */
export default function CreditosFotos({ idioma, srcs }: Props) {
  const t = idioma === "es" ? TEXTOS.es : TEXTOS.en;
  const creditos = getCreditosFotos(srcs, { webOficial: t.webOficial, fuente: t.fuente });
  if (creditos.length === 0) return null;

  return (
    <details className="mt-2 text-xs text-piedra-500">
      <summary className="cursor-pointer w-fit hover:text-anil-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded">
        {t.titulo}
      </summary>
      <ol className="mt-2 space-y-1 list-decimal list-inside">
        {creditos.map((c) => (
          <li key={c.src}>
            {idioma === "es" ? c.texto : c.texto.replace(/», por /g, "», by ")}
            {c.url && (
              <>
                {" · "}
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-anil-600 hover:text-anil-700 underline"
                >
                  {t.fuente}
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </details>
  );
}
