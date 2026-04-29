import "server-only";

import type { Diccionario, Idioma } from "./types";
import { IDIOMA_DEFECTO } from "./config";

import es from "@/lib/dictionaries/es.json";
import en from "@/lib/dictionaries/en.json";
import de from "@/lib/dictionaries/de.json";
import fr from "@/lib/dictionaries/fr.json";
import it from "@/lib/dictionaries/it.json";
import pt from "@/lib/dictionaries/pt.json";

const DICCIONARIOS: Record<Idioma, Diccionario> = {
  es: es as Diccionario,
  en: en as Diccionario,
  de: de as Diccionario,
  fr: fr as Diccionario,
  it: it as Diccionario,
  pt: pt as Diccionario,
};

export function getDictionary(idioma: Idioma): Diccionario {
  return DICCIONARIOS[idioma] ?? DICCIONARIOS[IDIOMA_DEFECTO];
}