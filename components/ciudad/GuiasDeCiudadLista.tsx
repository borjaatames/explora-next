import Link from "next/link";
import type { GuiaListItem } from "@/lib/guias";

type Props = {
  guias: GuiaListItem[];
  titulo: string;
  urlTodas: string;
  textoVerTodas: string;
  textoMinLectura: string;
  /** Máximo de guías a mostrar; el resto queda accesible vía `urlTodas`. */
  limite?: number;
};

/**
 * Listado de guías de una ciudad con enlace directo a cada guía.
 * Existe para el enlazado interno: la tarjeta CTA de la ciudad solo enlaza
 * al índice de guías, y Google necesita enlaces directos para descubrir e
 * indexar cada guía.
 */
export default function GuiasDeCiudadLista({
  guias,
  titulo,
  urlTodas,
  textoVerTodas,
  textoMinLectura,
  limite = 6,
}: Props) {
  if (guias.length === 0) return null;
  const visibles = guias.slice(0, limite);

  return (
    <section className="border-t border-slate-200" aria-labelledby="guias-ciudad">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <h2
          id="guias-ciudad"
          className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-6"
        >
          {titulo}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibles.map((guia) => (
            <Link
              key={guia.url}
              href={guia.url}
              className="group block border border-slate-200 rounded-lg p-6 hover:border-sky-400 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                {guia.titulo}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {guia.descripcion}
              </p>
              <span className="text-xs text-slate-500">
                {guia.tiempoLectura} {textoMinLectura}
              </span>
            </Link>
          ))}
        </div>
        {guias.length > visibles.length && (
          <div className="mt-8">
            <Link
              href={urlTodas}
              className="inline-flex items-center text-sky-600 hover:text-sky-700 font-semibold transition-colors"
            >
              {textoVerTodas} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
