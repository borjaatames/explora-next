import NavbarServer from "@/components/layout/NavbarServer";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButton from "@/components/WhatsAppButton";

/**
 * Shell para todas las rutas en español (idioma por defecto).
 * El route group `(es-shell)` no afecta a la URL: las páginas dentro
 * siguen sirviéndose en `/`, `/guias`, `/contacto`, etc.
 *
 * Monta NavbarServer/Footer/CookieBanner con idioma="es" explícito para
 * desacoplar el shell del idioma servido en cada subárbol.
 */
export default function EsShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarServer idioma="es" />
      <div className="min-h-screen">{children}</div>
      <Footer idioma="es" />
      <WhatsAppButton idioma="es" />
      <CookieBanner idioma="es" />
    </>
  );
}
