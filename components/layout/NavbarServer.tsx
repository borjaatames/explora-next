import type { Idioma } from "@/lib/i18n/types";
import Navbar from "./Navbar";
import { idiomaTieneGuias } from "@/lib/guias";

type Props = {
  idioma: Idioma;
};

/**
 * Wrapper del Navbar. No lee `headers()` a propósito: hacerlo convertía
 * todas las páginas en dinámicas (`cache-control: no-store`). Las parejas
 * de idioma las resuelve el LanguageSwitcher en cliente con `/parejas.json`.
 * Aquí (servidor, con acceso a `content/`) se decide si el idioma tiene guías
 * publicadas; el Navbar solo recibe el booleano.
 */
export default function NavbarServer({ idioma }: Props) {
  return <Navbar idioma={idioma} hayGuias={idiomaTieneGuias(idioma)} />;
}
