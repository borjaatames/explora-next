import type { Idioma } from "@/lib/i18n/types";
import { getCreditosFotos } from "@/lib/creditos-fotos";

interface Props {
  idioma: Idioma;
  srcs: string[];
}

const TEXTOS = {
  es: { titulo: "Créditos de las fotos", webOficial: "Foto cedida por el establecimiento (web oficial)", fuente: "fuente", foto: "Foto" },
  en: { titulo: "Photo credits", webOficial: "Photo courtesy of the venue (official website)", fuente: "source", foto: "Photo" },
  de: { titulo: "Bildnachweise", webOficial: "Foto mit freundlicher Genehmigung des Anbieters (offizielle Website)", fuente: "Quelle", foto: "Foto" },
  fr: { titulo: "Crédits photo", webOficial: "Photo fournie par l'établissement (site officiel)", fuente: "source", foto: "Photo" },
  it: { titulo: "Crediti fotografici", webOficial: "Foto concessa dalla struttura (sito ufficiale)", fuente: "fonte", foto: "Foto" },
  pt: { titulo: "Créditos das fotos", webOficial: "Foto cedida pelo estabelecimento (site oficial)", fuente: "fonte", foto: "Foto" },
} as const satisfies Record<Idioma, unknown>;

/** Los CREDITOS.md están en español; en el resto de idiomas traducimos las fórmulas fijas. */
const TRADUCCIONES_EN: ReadonlyArray<[RegExp, string]> = [
  [/», por /g, "», by "],
  [/\bvía\b/gi, "via"],
  [/\bLicencia (Pexels|Pixabay|Unsplash)\b/g, "$1 License"],
  [/\bDominio público\b/gi, "Public domain"],
  [/\bFoto de\b/g, "Photo by"],
  [/\bFoto del proveedor\b/gi, "Operator photo"],
  [/\bcedida por\b/gi, "courtesy of"],
];

const TRADUCCIONES_DE: ReadonlyArray<[RegExp, string]> = [
  [/», por /g, "», von "],
  [/\bvía\b/gi, "über"],
  [/\bLicencia (Pexels|Pixabay|Unsplash)\b/g, "$1-Lizenz"],
  [/\bDominio público\b/gi, "Gemeinfrei"],
  [/\bFoto de\b/g, "Foto von"],
  [/\bFoto del proveedor\b/gi, "Foto des Anbieters"],
  [/\bcedida por\b/gi, "mit freundlicher Genehmigung von"],
];

const TRADUCCIONES_FR: ReadonlyArray<[RegExp, string]> = [
  [/», por /g, "», par "],
  [/\bvía\b/gi, "via"],
  [/\bLicencia (Pexels|Pixabay|Unsplash)\b/g, "Licence $1"],
  [/\bDominio público\b/gi, "Domaine public"],
  [/\bFoto de\b/g, "Photo de"],
  [/\bFoto del proveedor\b/gi, "Photo du prestataire"],
  [/\bcedida por\b/gi, "fournie par"],
];

const TRADUCCIONES_IT: ReadonlyArray<[RegExp, string]> = [
  [/», por /g, "», di "],
  [/\bvía\b/gi, "tramite"],
  [/\bLicencia (Pexels|Pixabay|Unsplash)\b/g, "Licenza $1"],
  [/\bDominio público\b/gi, "Pubblico dominio"],
  [/\bFoto de\b/g, "Foto di"],
  [/\bFoto del proveedor\b/gi, "Foto dell'operatore"],
  [/\bcedida por\b/gi, "concessa da"],
];

const TRADUCCIONES_PT: ReadonlyArray<[RegExp, string]> = [
  [/», por /g, "», por "],
  [/\bvía\b/gi, "via"],
  [/\bLicencia (Pexels|Pixabay|Unsplash)\b/g, "Licença $1"],
  [/\bDominio público\b/gi, "Domínio público"],
  [/\bFoto de\b/g, "Foto de"],
  [/\bFoto del proveedor\b/gi, "Foto do operador"],
  [/\bcedida por\b/gi, "cedida por"],
];

const TRADUCCIONES: Record<Exclude<Idioma, "es">, ReadonlyArray<[RegExp, string]>> = {
  en: TRADUCCIONES_EN,
  de: TRADUCCIONES_DE,
  fr: TRADUCCIONES_FR,
  it: TRADUCCIONES_IT,
  pt: TRADUCCIONES_PT,
};

function textoCredito(texto: string, idioma: Idioma): string {
  // Restos de nombres de archivo de origen («…foto_123.jpg)») que no aportan nada.
  const limpio = texto.replace(/\S+\.(?:jpe?g|png|webp|tiff?)\)?/gi, "").replace(/\s{2,}/g, " ").trim();
  if (idioma === "es") return limpio;
  return TRADUCCIONES[idioma].reduce((t, [re, por]) => t.replace(re, por), limpio);
}

/**
 * Créditos de las fotos de la galería (autor, licencia y fuente), leídos de
 * los CREDITOS.md en build. Las licencias CC BY / CC BY-SA exigen mostrarlos.
 */
export default function CreditosFotos({ idioma, srcs }: Props) {
  const t = TEXTOS[idioma];
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
            {textoCredito(c.texto, idioma)}
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
