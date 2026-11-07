import type { Idioma } from "@/lib/i18n/types";

/**
 * Presentación breve (50-70 palabras) bajo el hero: qué es el monumento, la
 * ciudad o el tema de la guía, antes de precios y reservas. Admite **negrita**.
 */
export default function IntroGuia({
  texto,
  idioma,
  enColumna = false,
}: {
  texto: string | undefined;
  idioma: Idioma;
  /** Dentro de la columna de lectura de la guía: sin contenedor propio. */
  enColumna?: boolean;
}) {
  if (!texto) return null;
  const partes = texto.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== "");
  const parrafo = (
    <p lang={idioma} className="text-lg md:text-xl leading-relaxed text-piedra-900">
          {partes.map((p, i) =>
            p.startsWith("**") && p.endsWith("**") ? (
              <strong key={i} className="font-semibold">
                {p.slice(2, -2)}
              </strong>
            ) : (
              p
            )
          )}
    </p>
  );
  if (enColumna) return parrafo;
  return <div className="max-w-3xl mx-auto px-4 pt-8 md:pt-12">{parrafo}</div>;
}
