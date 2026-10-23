import type { Metadata } from "next";
import RootDocument from "@/components/layout/RootDocument";
import NavbarServer from "@/components/layout/NavbarServer";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButton from "@/components/WhatsAppButton";
import { rootMetadata } from "@/lib/rootMetadata";

export const metadata: Metadata = rootMetadata;

/**
 * Layout raíz de todas las rutas en español (idioma por defecto).
 * El route group `(es-shell)` no afecta a la URL: las páginas dentro
 * siguen sirviéndose en `/`, `/guias`, `/contacto`, etc.
 *
 * Es uno de los dos layouts raíz (el otro es app/[lang]/layout.tsx), así
 * que monta su propio `<html lang="es">` a través de RootDocument.
 */
export default function EsShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootDocument lang="es">
      <NavbarServer idioma="es" />
      <div className="min-h-screen">{children}</div>
      <Footer idioma="es" />
      <WhatsAppButton idioma="es" />
      <CookieBanner idioma="es" />
    </RootDocument>
  );
}
