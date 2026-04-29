"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const enlaces = [
  { href: "/guias", label: "Guías" },
  { href: "/ciudades", label: "Ciudades" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setAbierto(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
    <header className="sticky top-0 z-50 bg-amber-400 border-b-4 border-sky-500 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label="ExploraSpain - Inicio"
          onClick={() => setAbierto(false)}
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

        <nav className="hidden md:flex items-center gap-6">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="text-slate-900 hover:text-sky-700 font-medium transition-colors"
            >
              {e.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="p-2 -mr-2 text-slate-900 hover:bg-amber-500 rounded transition-colors"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
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
        </div>
      </div>

      {abierto && (
        <div
          id="menu-movil"
          className="md:hidden absolute top-full left-0 right-0 bg-amber-400 border-b-4 border-sky-500 shadow-lg"
        >
          <nav className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            {enlaces.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                onClick={() => setAbierto(false)}
                className="py-3 px-2 text-lg text-slate-900 font-medium border-b border-amber-500/40 last:border-b-0 hover:bg-amber-500 rounded transition-colors"
              >
                {e.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
