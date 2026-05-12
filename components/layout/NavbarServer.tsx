import { MAPA_PAREJAS } from "@/lib/i18n/parejas";
import type { Idioma } from "@/lib/i18n/types";
import Navbar from "./Navbar";

/**
 * Wrapper del Navbar que inyecta el mapa de parejas hreflang (generado en
 * build leyendo filesystem). Existe como pieza separada por motivos
 * históricos: cuando el Navbar era Client Component, este wrapper era
 * necesario para hacer el bridge fs → props. Ahora que el Navbar es Server,
 * podría inlinearse, pero se mantiene para no romper imports existentes.
 */
type Props = {
  idioma: Idioma;
};

export default function NavbarServer({ idioma }: Props) {
  return <Navbar idioma={idioma} mapaParejas={MAPA_PAREJAS} />;
}
