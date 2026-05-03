import Link from "next/link";
import Image from "next/image";
import {
  urlIndiceGuias,
  urlIndiceCiudades,
  urlContacto,
  urlAvisoLegal,
  urlPrivacidad,
  urlCookies,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const DICT = {
  es: {
    tagline:
      "Tours, actividades y guías editoriales para viajar por España con criterio.",
    sectionWeb: "Web",
    sectionLegal: "Legal",
    guias: "Guías",
    ciudades: "Ciudades",
    sobreNosotros: "Sobre nosotros",
    contacto: "Contacto",
    avisoLegal: "Aviso legal",
    privacidad: "Política de privacidad",
    cookies: "Política de cookies",
    derechos: "Todos los derechos reservados.",
    direccion: "Calle Castelló 117, 28006 Madrid, España",
  },
  en: {
    tagline:
      "Tours, activities and editorial guides for traveling Spain with judgment.",
    sectionWeb: "Site",
    sectionLegal: "Legal",
    guias: "Guides",
    ciudades: "Cities",
    sobreNosotros: "About us",
    contacto: "Contact",
    avisoLegal: "Legal notice",
    privacidad: "Privacy policy",
    cookies: "Cookie policy",
    derechos: "All rights reserved.",
    direccion: "Calle Castelló 117, 28006 Madrid, Spain",
  },
} as const;

function urlAbout(idioma: Idioma): string {
  return idioma === "es" ? "/sobre-nosotros" : `/${idioma}/about`;
}

type Props = {
  idioma: Idioma;
};

export default function Footer({ idioma }: Props) {
  const t = DICT[idioma === "en" ? "en" : "es"];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/logo-icon.svg"
                alt=""
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <h3 className="font-playfair text-2xl font-bold text-white">
                ExploraSpain
              </h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.tagline}
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              {t.sectionWeb}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={urlIndiceGuias(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.guias}
                </Link>
              </li>
              <li>
                <Link
                  href={urlIndiceCiudades(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.ciudades}
                </Link>
              </li>
              <li>
                <Link
                  href={urlAbout(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.sobreNosotros}
                </Link>
              </li>
              <li>
                <Link
                  href={urlContacto(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.contacto}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              {t.sectionLegal}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={urlAvisoLegal(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.avisoLegal}
                </Link>
              </li>
              <li>
                <Link
                  href={urlPrivacidad(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.privacidad}
                </Link>
              </li>
              <li>
                <Link
                  href={urlCookies(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.cookies}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-xs text-slate-500 flex flex-col md:flex-row md:justify-between gap-2">
          <p>
            © {year} SKYWARD PARTNERS, S.L. — NIF B26629576. {t.derechos}
          </p>
          <p>{t.direccion}</p>
        </div>
      </div>
    </footer>
  );
}
