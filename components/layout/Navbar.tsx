import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import NavbarMobileMenu from "./NavbarMobileMenu";
import {
  urlIndiceCiudades,
  urlContacto,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import type { MapaParejas } from "@/lib/i18n/parejas";

const DICT = {
  es: {
    inicioMenu: "Inicio",
    guias: "Guías",
    ciudades: "Ciudades",
    sobreNosotros: "Sobre nosotros",
    contacto: "Contacto",
    inicio: "ExploraSpain - Inicio",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
  },
  en: {
    inicioMenu: "Home",
    guias: "Guides",
    ciudades: "Cities",
    sobreNosotros: "About us",
    contacto: "Contact",
    inicio: "ExploraSpain - Home",
    abrirMenu: "Open menu",
    cerrarMenu: "Close menu",
  },
} as const;

function urlHome(idioma: Idioma): string {
  return prefijoIdioma(idioma) || "/";
}

type Props = {
  idioma: Idioma;
  mapaParejas: MapaParejas;
};

/**
 * Cabecera global del sitio. Server Component: todo el contenido estático
 * (logo, enlaces, idioma desktop) se renderiza en servidor sin enviar JS
 * al cliente. La única interactividad — toggle del menú móvil — vive en
 * `NavbarMobileMenu`, una isla Client mínima. El `LanguageSwitcher`
 * también es Client pero se monta como isla independiente.
 */
export default function Navbar({ idioma, mapaParejas }: Props) {
  const t = DICT[idioma === "en" ? "en" : "es"];

  // Guías y "Sobre nosotros" se han sacado del menú principal: viven solo
  // en el footer (columna ExploraSpain). El menú queda más limpio y enfocado
  // en navegar a ciudades / contactar.
  const enlaces = [
    { href: urlHome(idioma), label: t.inicioMenu },
    { href: urlIndiceCiudades(idioma), label: t.ciudades },
    { href: urlContacto(idioma), label: t.contacto },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href={urlHome(idioma)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label={t.inicio}
        >
          <Image
            src="/logo-icon-dark.svg"
            alt=""
            width={40}
            height={40}
            priority
            className="w-[27px] h-[27px] md:w-[30px] md:h-[30px]"
          />
          <span className="font-playfair text-2xl md:text-3xl font-bold text-slate-900">
            ExploraSpain
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="text-slate-700 hover:text-amber-600 font-medium transition-colors"
            >
              {e.label}
            </Link>
          ))}
          <LanguageSwitcher mapaParejas={mapaParejas} />
        </nav>

        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher mapaParejas={mapaParejas} />
          <NavbarMobileMenu
            enlaces={enlaces}
            abrirLabel={t.abrirMenu}
            cerrarLabel={t.cerrarMenu}
          />
        </div>
      </div>
    </header>
  );
}
