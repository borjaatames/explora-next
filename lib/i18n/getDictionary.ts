import "server-only";

import type { Diccionario, Idioma } from "./types";
import { IDIOMA_DEFECTO, IDIOMAS_ACTIVOS, esIdiomaActivo } from "./config";

import es from "@/lib/dictionaries/es.json";
import en from "@/lib/dictionaries/en.json";
import de from "@/lib/dictionaries/de.json";
import fr from "@/lib/dictionaries/fr.json";
import it from "@/lib/dictionaries/it.json";
import pt from "@/lib/dictionaries/pt.json";

/**
 * ⚠️ AVISO IMPORTANTE — diccionarios de idiomas INACTIVOS:
 *
 * Los JSON `de.json`, `fr.json`, `it.json` y `pt.json` son actualmente
 * copia byte-a-byte del español (`es.json`). Esto es seguro mientras
 * `IDIOMAS_ACTIVOS = ["es", "en"]` en `config.ts`, porque ninguna ruta
 * los carga.
 *
 * Si en el futuro se añade un idioma a `IDIOMAS_ACTIVOS`, ANTES hay que:
 *   1. Traducir el JSON correspondiente al idioma real.
 *   2. Verificar URLs, hreflang y locales OpenGraph.
 *   3. Comprobar `lib/i18n/parejas.ts` y `slugs.ts`.
 *
 * La función de abajo lanza error en desarrollo si se pide un idioma
 * no activo, para detectar el problema antes de llegar a producción.
 */

const DICCIONARIOS: Record<Idioma, Diccionario> = {
  es: es as Diccionario,
  en: en as Diccionario,
  de: de as Diccionario,
  fr: fr as Diccionario,
  it: it as Diccionario,
  pt: pt as Diccionario,
};

export function getDictionary(idioma: Idioma): Diccionario {
  if (process.env.NODE_ENV !== "production" && !esIdiomaActivo(idioma)) {
    throw new Error(
      `[getDictionary] Solicitado idioma "${idioma}" que NO está en IDIOMAS_ACTIVOS (${IDIOMAS_ACTIVOS.join(
        ", "
      )}). El JSON ${idioma}.json es copia del español — traducir antes de activar.`
    );
  }
  return DICCIONARIOS[idioma] ?? DICCIONARIOS[IDIOMA_DEFECTO];
}