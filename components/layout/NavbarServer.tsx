import { MAPA_PAREJAS } from "@/lib/i18n/parejas";
import type { Idioma } from "@/lib/i18n/types";
import Navbar from "./Navbar";

/**
 * Wrapper Server Component del Navbar. Su única responsabilidad es
 * importar el mapa de parejas (que se genera leyendo filesystem en build)
 * y pasárselo al Navbar Client como prop estática.
 *
 * Este indireccionado es necesario porque el Navbar es un Client Component
 * (necesita useState, useEffect para el menú móvil) y los Client Components
 * no pueden importar directamente módulos que usen `fs`/`path`.
 */
type Props = {
  idioma: Idioma;
};

export default function NavbarServer({ idioma }: Props) {
  return <Navbar idioma={idioma} mapaParejas={MAPA_PAREJAS} />;
}
