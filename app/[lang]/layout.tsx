import { notFound } from "next/navigation";
import { esIdiomaActivo, IDIOMAS_ACTIVOS } from "@/lib/i18n/config";
import type { Idioma } from "@/lib/i18n/types";
import NavbarServer from "@/components/layout/NavbarServer";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";
import SetHtmlLang from "@/components/layout/SetHtmlLang";
type Props = {
  children: React.ReactNode;
  params: { lang: string };
};
/**
 * Pre-genera estáticamente solo los idiomas activos (no incluye "es",
 * que se sirve desde la raíz sin prefijo).
 */
export function generateStaticParams() {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}
/**
 * Shell para todas las rutas con prefijo de idioma (`/en/...`, futuro
 * `/de/...`, etc.). Monta NavbarServer/Footer/CookieBanner con el idioma
 * del subárbol, y envuelve el contenido en `<div lang={lang}>` para
 * corregir el atributo `lang` heredado del `<html lang="es">` global.
 * Esto es HTML5 válido y los crawlers/screen readers leen el lang del
 * elemento más cercano al contenido.
 */
export default function LangLayout({ children, params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }
  // params.lang es Idioma a partir de aquí, garantizado por el guard.
  const lang: Idioma = params.lang;
  return (
    <div lang={lang}>
      {/* Corrige <html lang> en cliente sin romper SSG — ver SetHtmlLang.tsx */}
      <SetHtmlLang lang={lang} />
      <NavbarServer idioma={lang} />
      <div className="min-h-screen">{children}</div>
      <Footer idioma={lang} />
      <CookieBanner idioma={lang} />
    </div>
  );
}
