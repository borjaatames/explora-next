"use client";

import { useEffect } from "react";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  lang: Idioma;
};

/**
 * Corrige `document.documentElement.lang` en el cliente para los subárboles
 * de idioma (`/en/...`).
 *
 * Por qué existe: el `<html lang="es">` vive en el RootLayout global y en
 * Next 14 App Router un layout anidado no puede sobreescribir atributos de
 * `<html>`. Usar `headers()` en el RootLayout para derivar el idioma del
 * pathname forzaría rendering dinámico en TODAS las rutas y rompería el SSG
 * (prioridad del proyecto). Este componente lo corrige en cliente sin coste:
 * Google indexa el DOM renderizado, Chrome deja de ofrecer "traducir esta
 * página" en las páginas EN y los lectores de pantalla reciben el idioma
 * correcto a nivel de documento.
 *
 * El `<div lang>` del LangLayout se mantiene como señal estática en el HTML
 * inicial (válido y leído por crawlers sin JS).
 *
 * Limpieza: al desmontar (navegación cliente EN → ES) restaura "es".
 */
export default function SetHtmlLang({ lang }: Props) {
  useEffect(() => {
    const previo = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = previo || "es";
    };
  }, [lang]);

  return null;
}
