import type { Idioma } from "@/lib/i18n/types";
import Navbar from "./Navbar";

type Props = {
  idioma: Idioma;
};

/**
 * Wrapper del Navbar. No lee `headers()` a propósito: hacerlo convertía
 * todas las páginas en dinámicas (`cache-control: no-store`). Las parejas
 * de idioma las resuelve el LanguageSwitcher en cliente con `/parejas.json`.
 */
export default function NavbarServer({ idioma }: Props) {
  return <Navbar idioma={idioma} />;
}
