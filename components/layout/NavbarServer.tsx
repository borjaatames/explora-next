import { headers } from "next/headers";
import { MAPA_PAREJAS } from "@/lib/i18n/parejas";
import type { ParejaUrls } from "@/lib/i18n/parejas";
import type { Idioma } from "@/lib/i18n/types";
import Navbar from "./Navbar";

type Props = {
  idioma: Idioma;
};

/**
 * Wrapper del Navbar que inyecta SOLO las parejas de la página actual
 * (no el mapa completo). Esto evita serializar ~568 KB de RSC payload
 * en cada página: el Client Component LanguageSwitcher recibe ≤3 URLs.
 */
export default function NavbarServer({ idioma }: Props) {
  // El middleware añade x-pathname en cada NextResponse.next().
  // Fallback a "/" si no está disponible (entornos de test, etc.)
  const pathname = headers().get("x-pathname") ?? "/";
  const parejas: ParejaUrls | null = MAPA_PAREJAS[pathname] ?? null;

  return <Navbar idioma={idioma} parejas={parejas} />;
}
