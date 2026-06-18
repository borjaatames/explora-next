"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Enlace = { href: string; label: string };

type Props = {
  enlaces: ReadonlyArray<Enlace>;
  abrirLabel: string;
  cerrarLabel: string;
};

/**
 * Isla Client mínima del Navbar: solo el botón hamburguesa y el dropdown
 * condicional del menú móvil. Se monta dentro del `Navbar` (Server) para
 * mantener el resto de la cabecera fuera del bundle client.
 *
 * El dropdown se posiciona `absolute top-full left-0 right-0` y, gracias
 * a que el `<header>` padre es `position: sticky`, queda anclado al borde
 * inferior de la cabecera ocupando todo su ancho.
 */
export default function NavbarMobileMenu({
  enlaces,
  abrirLabel,
  cerrarLabel,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  // Cierra el menú al navegar a otra ruta (cubre clicks en el logo, los
  // links del propio menú, y cualquier navegación lateral). Más robusto
  // que poner onClick handlers en cada link.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  // Si el viewport pasa a desktop con el menú abierto, lo cerramos para
  // evitar un dropdown fantasma escondido por el media query.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setAbierto(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Bloqueamos el scroll del body cuando el menú está abierto, para que
  // el usuario no haga scroll detrás del overlay.
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="p-2 -mr-2 text-slate-700 hover:bg-slate-100 rounded transition-colors"
        aria-label={abierto ? cerrarLabel : abrirLabel}
        aria-expanded={abierto}
        aria-controls="menu-movil"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7"
        >
          {abierto ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </>
          )}
        </svg>
      </button>

      {abierto && (
        <div
          id="menu-movil"
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg"
        >
          <nav className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            {enlaces.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                onClick={() => setAbierto(false)}
                className="py-3 px-2 text-lg text-slate-800 font-medium border-b border-slate-100 last:border-b-0 hover:bg-slate-50 hover:text-amber-600 rounded transition-colors"
              >
                {e.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
