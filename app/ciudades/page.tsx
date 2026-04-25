import type { Metadata } from "next";
import Link from "next/link";
import { obtenerListaCiudades } from "@/lib/ciudades";

export const metadata: Metadata = {
  title: "Ciudades de España",
  description:
    "Guías de viaje por las principales ciudades de España: Madrid, Barcelona, Sevilla y más. Información práctica, qué visitar y consejos con criterio.",
  alternates: {
    canonical: "https://exploraspain.com/ciudades",
  },
};

export default function CiudadesPage() {
  const ciudades = obtenerListaCiudades();

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
            Ciudades de España
          </h1>
          <p className="text-lg text-sky-50">
            Guías prácticas para entender cada ciudad antes de visitarla.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {ciudades.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-lg">
            Próximamente publicaremos guías de las principales ciudades.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ciudades.map((ciudad) => (
              <Link
                key={ciudad.url}
                href={ciudad.url}
                className="group block border border-slate-200 rounded-lg overflow-hidden hover:border-sky-400 hover:shadow-md transition-all"
              >
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={`/ciudades/${ciudad.slug}.jpg`}
                    alt={`${ciudad.nombre}, ${ciudad.comunidad}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                    {ciudad.comunidad}
                  </span>
                  <h2 className="font-playfair text-2xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                    {ciudad.nombre}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {ciudad.descripcion}
                  </p>
                  <div className="mt-4 text-sm font-semibold text-sky-600 group-hover:text-sky-700">
                    Ver guía →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
