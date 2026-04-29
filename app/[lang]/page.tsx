import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerGuiasDestacadas } from "@/lib/guias";
import { obtenerListaCiudades } from "@/lib/ciudades";
import { esIdiomaActivo } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  formatearFecha,
  urlIndiceGuias,
  urlIndiceCiudades,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  params: { lang: string };
};

export default function HomePage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const guias = obtenerGuiasDestacadas(lang, 3);
  const ciudades = obtenerListaCiudades(lang);

  return (
    <main>
      <section className="bg-sky-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {dict.home.heroTitulo}
          </h1>
          <p className="text-lg md:text-xl text-sky-50 mb-8 max-w-2xl mx-auto leading-relaxed">
            {dict.home.heroSubtitulo}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={urlIndiceGuias(lang)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              {dict.home.ctaExplorar}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="mb-10">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {dict.home.seccionGuiasDestacadas}
          </h2>
        </div>

        {guias.length === 0 ? null : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guias.map((guia) => (
              <Link
                key={guia.url}
                href={guia.url}
                className="group block border border-slate-200 rounded-lg p-6 hover:border-sky-400 hover:shadow-md transition-all"
              >
                <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded mb-3">
                  {guia.categoria}
                </span>
                <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                  {guia.titulo}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {guia.descripcion}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{formatearFecha(guia.fecha, lang)}</span>
                  <span>
                    {guia.tiempoLectura} {dict.guias.minutosLectura}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href={urlIndiceGuias(lang)}
            className="inline-block text-sky-600 hover:text-sky-700 font-semibold"
          >
            {dict.home.verTodas} →
          </Link>
        </div>
      </section>

      {ciudades.length > 0 && (
        <section className="bg-amber-50 border-y border-amber-200">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
            <div className="mb-10">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {dict.home.seccionCiudades}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ciudades.map((ciudad) => (
                <Link
                  key={ciudad.url}
                  href={ciudad.url}
                  className="group block bg-white border border-amber-200 rounded-lg overflow-hidden hover:border-sky-400 hover:shadow-md transition-all"
                >
                  <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
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
                    <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                      {ciudad.nombre}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {ciudad.descripcion}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href={urlIndiceCiudades(lang)}
                className="inline-block text-sky-600 hover:text-sky-700 font-semibold"
              >
                {dict.home.verTodas} →
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
