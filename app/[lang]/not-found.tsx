import type { Metadata } from "next";
import NotFoundLangContent from "@/components/layout/NotFoundLangContent";

/**
 * 404 del shell no-español (vive dentro de app/[lang]/, que hoy sirve
 * "en" y "de" — generateStaticParams de LangLayout expone
 * IDIOMAS_ACTIVOS sin "es" — y cualquier idioma activo futuro sin
 * tocar este archivo).
 *
 * Next.js NO pasa los params del segmento dinámico padre a
 * not-found.tsx (limitación conocida del framework), así que el
 * idioma real no se puede leer aquí en el servidor. Se detecta en
 * cliente a partir de la URL con usePathname(), dentro de
 * NotFoundLangContent (mismo patrón que components/layout/
 * LanguageSwitcher.tsx). El layout padre (LangLayout) SÍ tiene
 * params.lang y monta el Navbar/Footer en el idioma correcto
 * alrededor de este contenido.
 *
 * Bug corregido el 2026-08-16: antes de este cambio, este archivo
 * fijaba el idioma a "en" a mano (válido cuando [lang] solo servía
 * inglés) y mostraba SIEMPRE textos en inglés — incluso bajo /de/...
 * una vez se activó alemán en IDIOMAS_ACTIVOS. El usuario lo detectó
 * visitando /de/cities/madrid/activities (404 esperado: no hay
 * contenido de actividades en alemán) y viendo el navbar en alemán
 * pero el cuerpo del 404 en inglés.
 *
 * Ver auditoria-seo-organico-2026-08-15.md para el contexto original
 * de por qué existe este archivo (antes, las fichas despublicadas
 * caían en el 404 por defecto de Next, sin navegación de vuelta al
 * sitio).
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFoundLang() {
  return <NotFoundLangContent />;
}
