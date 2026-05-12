import Image from "next/image";

/**
 * Franja de marca para las landings SEM.
 *
 * Postura "B" (identidad sin fuga) — ver
 * `programacion de la pagina/auditoria-unificacion-shells.md`:
 *
 * - Aporta identidad ExploraSpain a las landings SEM (logo + nombre).
 * - **NO es enlace**: no abre fuga del funnel hacia home / nav editorial.
 * - Vive en el shell SEM (`app/sem/layout.tsx`, `app/en/sem/layout.tsx`),
 *   no en cada page. Así toda landing SEM nueva la hereda automáticamente.
 *
 * Paleta y proporciones: misma combinación amber-400 + border sky-500 que
 * el Navbar editorial (consistencia con el resto del sitio), pero con
 * variantes tipográficas más sobrias porque aquí no hay nav que equilibre
 * el espacio horizontal.
 *
 * Accesibilidad: marcado como `<header role="banner" aria-label>`, banner
 * único de la página (las landings SEM no tienen Navbar editorial sobre
 * este componente, así que no se duplica el rol).
 */
export default function SemBrandStrip() {
  return (
    <header
      role="banner"
      aria-label="ExploraSpain"
      className="bg-amber-400 border-b-4 border-sky-500"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2.5">
        <Image
          src="/logo-icon-dark.svg"
          alt=""
          width={32}
          height={32}
          priority
          className="w-7 h-7 md:w-8 md:h-8"
        />
        <span className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
          ExploraSpain
        </span>
      </div>
    </header>
  );
}
