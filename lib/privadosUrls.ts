import type { Idioma } from "@/lib/i18n/types";

export function urlPrivadasDeCiudad(idioma: Idioma, ciudad: string): string {
  return idioma === "es"
    ? `/ciudades/${ciudad}/excursiones-privadas`
    : `/${idioma}/cities/${ciudad}/private-tours`;
}

export function urlHubPrivados(idioma: Idioma): string {
  return idioma === "es" ? "/excursiones-privadas" : `/${idioma}/private-tours`;
}
