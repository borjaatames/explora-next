import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import NavbarMobileMenu from "./NavbarMobileMenu";
import {
  urlIndiceCiudades,
  urlIndiceGuias,
  urlContacto,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import { urlHubPrivados } from "@/lib/privadosUrls";

const DICT = {
  es: {
    inicioMenu: "Inicio",
    privados: "Excursiones privadas",
    privadosCorto: "Privadas",
    guias: "Guías",
    ciudades: "Ciudades",
    sobreNosotros: "Sobre nosotros",
    contacto: "Contacto",
    inicio: "ExploraSpain - Inicio",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
    navPrincipal: "Navegación principal",
  },
  en: {
    inicioMenu: "Home",
    privados: "Private tours",
    privadosCorto: "Private",
    guias: "Guides",
    ciudades: "Cities",
    sobreNosotros: "About us",
    contacto: "Contact",
    inicio: "ExploraSpain - Home",
    abrirMenu: "Open menu",
    cerrarMenu: "Close menu",
    navPrincipal: "Main navigation",
  },
  de: {
    inicioMenu: "Startseite",
    privados: "Privattouren",
    privadosCorto: "Privat",
    guias: "Reiseführer",
    ciudades: "Städte",
    sobreNosotros: "Über uns",
    contacto: "Kontakt",
    inicio: "ExploraSpain - Startseite",
    abrirMenu: "Menü öffnen",
    cerrarMenu: "Menü schließen",
    navPrincipal: "Hauptnavigation",
  },
} as const;

function urlHome(idioma: Idioma): string {
  return prefijoIdioma(idioma) || "/";
}

function urlSobreNosotros(idioma: Idioma): string {
  return idioma === "es" ? "/sobre-nosotros" : `/${idioma}/about`;
}

type Props = {
  idioma: Idioma;
};

/**
 * Cabecera global del sitio. Server Component: todo el contenido estático
 * (logo, enlaces, idioma desktop) se renderiza en servidor sin enviar JS
 * al cliente. La única interactividad — toggle del menú móvil — vive en
 * `NavbarMobileMenu`, una isla Client mínima. El `LanguageSwitcher`
 * también es Client pero se monta como isla independiente.
 */
export default function Navbar({ idioma }: Props) {
  const t = DICT[idioma === "en" ? "en" : idioma === "de" ? "de" : "es"];

  const enlaces = [
    // Sin fichas propias en alemán: el hub solo existe en ES y EN.
    ...(idioma === "es" || idioma === "en"
      ? [{ href: urlHubPrivados(idioma), label: t.privados as string, corto: t.privadosCorto as string }]
      : []),
    { href: urlIndiceCiudades(idioma), label: t.ciudades, corto: undefined as string | undefined },
    { href: urlIndiceGuias(idioma), label: t.guias },
    // Entre 768 y 1024 px no caben todos: «Sobre nosotros» queda en el pie y en el menú móvil.
    { href: urlSobreNosotros(idioma), label: t.sobreNosotros, soloLg: true },
  ];
  const enlacesMovil = [
    { href: urlHome(idioma), label: t.inicioMenu },
    ...enlaces,
    { href: urlContacto(idioma), label: t.contacto },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-piedra-200">
      <div className="max-w-6xl mx-auto px-4 h-16 md:h-[76px] flex items-center justify-between">
        <Link
          href={urlHome(idioma)}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
          aria-label={t.inicio}
        >
          <Image
            src="/logo-mark.svg"
            alt=""
            width={32}
            height={32}
            className="w-7 h-7 md:w-8 md:h-8"
          />
          <span className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 tracking-tight">
            Explora<span className="text-anil-600">Spain</span>
          </span>
        </Link>

        <nav aria-label={t.navPrincipal} className="hidden md:flex items-center gap-4 lg:gap-8">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              prefetch={false}
              className={`${"soloLg" in e && e.soloLg ? "hidden lg:inline " : ""}whitespace-nowrap text-sm lg:text-base font-semibold text-piedra-900 hover:text-anil-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded`}
            >
              {e.corto ? (
                <>
                  <span className="lg:hidden">{e.corto}</span>
                  <span className="hidden lg:inline">{e.label}</span>
                </>
              ) : (
                e.label
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher idioma={idioma} />
          <Link
            href={urlContacto(idioma)}
            prefetch={false}
            className="inline-flex items-center justify-center bg-white border border-piedra-300 hover:border-anil-400 text-piedra-900 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
          >
            {t.contacto}
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher idioma={idioma} />
          <NavbarMobileMenu
            enlaces={enlacesMovil}
            abrirLabel={t.abrirMenu}
            cerrarLabel={t.cerrarMenu}
          />
        </div>
      </div>
    </header>
  );
}
