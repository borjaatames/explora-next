import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import NavbarMobileMenu from "./NavbarMobileMenu";
import {
  urlIndiceGuias,
  urlIndiceCiudades,
  urlContacto,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import type { MapaParejas } from "@/lib/i18n/parejas";

const DICT = {
  es: {
    guias: "Guías",
    ciudades: "Ciudades",
    sobreNosotros: "Sobre nosotros",
    contacto: "Contacto",
    inicio: "ExploraSpain - Inicio",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
  },
  en: {
    guias: "Guides",
    ciudades: "Cities",
    sobreNosotros: "About us",
    contacto: "Contact",
    inicio: "ExploraSpain - Home",
    abrirMenu: "Open menu",
    cerrarMenu: "Close menu",
  },
} as const;

function urlAbout(idioma: Idioma): string {
  return idioma === "es" ? "/sobre-nosotros" : `/${idioma}/about`;
}

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

  const enlaces = [
    { href: urlIndiceGuias(idioma), label: t.guias },
    { href: urlIndiceCiudades(idioma), label: t.ciudades },
    { href: urlAbout(idioma), label: t.sobreNosotros },
    { href: urlContacto(idioma), label: t.contacto },
  ];

  return (
    <header className="sticky top-0 z-50 bg-amber-400 border-b-4 border-sky-500 shadow-sm">
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
            className="w-9 h-9 md:w-10 md:h-10"
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
              className="text-slate-900 hover:text-sky-700 font-semibold transition-colors"
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
