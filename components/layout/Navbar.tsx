import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-amber-400 border-b-4 border-sky-500 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 hover:text-slate-700 transition-colors"
        >
          ExploraSpain
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
