import Link from "next/link";
import Image from "next/image";

export default function Footer() {
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
              Tours, actividades y guías editoriales para viajar por España con
              criterio.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Web
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guias" className="hover:text-white transition-colors">
                  Guías
                </Link>
              </li>
              <li>
                <Link href="/ciudades" className="hover:text-white transition-colors">
                  Ciudades
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="hover:text-white transition-colors"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/aviso-legal"
                  className="hover:text-white transition-colors"
                >
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="hover:text-white transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-white transition-colors"
                >
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-xs text-slate-500 flex flex-col md:flex-row md:justify-between gap-2">
          <p>
            © {year} SKYWARD PARTNERS, S.L. — NIF B26629576. Todos los derechos
            reservados.
          </p>
          <p>
            Calle Castelló 117, 28006 Madrid, España
          </p>
        </div>
      </div>
    </footer>
  );
}
