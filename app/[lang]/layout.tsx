import type { Metadata } from "next";
import { esIdiomaActivo, IDIOMAS_ACTIVOS } from "@/lib/i18n/config";
import type { Idioma } from "@/lib/i18n/types";
import RootDocument from "@/components/layout/RootDocument";
import NavbarServer from "@/components/layout/NavbarServer";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButton from "@/components/WhatsAppButton";
import { rootMetadata } from "@/lib/rootMetadata";

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export const metadata: Metadata = rootMetadata;

export function generateStaticParams() {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

/**
 * Layout raíz de las rutas con prefijo de idioma (`/en/...`, `/de/...`).
 * Es uno de los dos layouts raíz (el otro es app/(es-shell)/layout.tsx),
 * así que `<html lang>` sale con el idioma correcto en el HTML estático.
 */
export default function LangLayout({ children, params }: Props) {
  // Un primer segmento que no es idioma (p. ej. /esto-no-existe) también cae
  // aquí: las páginas hijas devuelven 404 y este layout lo pinta con el
  // marco en español, que es el idioma de las URLs sin prefijo.
  const lang: Idioma =
    esIdiomaActivo(params.lang) && params.lang !== "es" ? params.lang : "es";
  return (
    <RootDocument lang={lang}>
      <NavbarServer idioma={lang} />
      <div className="min-h-screen">{children}</div>
      <Footer idioma={lang} />
      <WhatsAppButton idioma={lang} />
      <CookieBanner idioma={lang} />
    </RootDocument>
  );
}
