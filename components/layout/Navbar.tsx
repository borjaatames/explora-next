import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-amber-400 border-b-4 border-sky-500 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label="ExploraSpain - Inicio"
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

        <nav className="flex items-center gap-6">
          <Link
            href="/guias"
            className="text-slate-900 hover:text-sky-700 font-medium transition-colors"
          >
            Guías
          </Link>
          <Link
            href="/ciudades"
            className="text-slate-900 hover:text-sky-700 font-medium transition-colors"
          >
            Ciudades
          </Link>
          <Link
            href="/sobre-nosotros"
            className="text-slate-900 hover:text-sky-700 font-medium transition-colors hidden sm:inline"
          >
            Sobre nosotros
          </Link>
          <Link
            href="/contacto"
            className="text-slate-900 hover:text-sky-700 font-medium transition-colors hidden sm:inline"
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}
