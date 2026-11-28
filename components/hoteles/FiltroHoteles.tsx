"use client";

import { useState, type ReactNode } from "react";
import type { EtiquetaHotel } from "@/lib/hoteles";

type Grupo = {
  id: string;
  titulo: string;
  texto: string;
  tarjetas: { etiquetas: EtiquetaHotel[]; nodo: ReactNode }[];
};

type Props = {
  grupos: Grupo[];
  etiquetas: { id: EtiquetaHotel; texto: string }[];
  textoTodos: string;
  textoFiltros: string;
  sinResultados: string;
};

/** Chips de filtro sobre las tarjetas, que llegan ya pintadas desde el servidor. */
export default function FiltroHoteles({ grupos, etiquetas, textoTodos, textoFiltros, sinResultados }: Props) {
  const [activa, setActiva] = useState<EtiquetaHotel | null>(null);
  const visibles = grupos
    .map((g) => ({ ...g, tarjetas: g.tarjetas.filter((t) => !activa || t.etiquetas.includes(activa)) }))
    .filter((g) => g.tarjetas.length > 0);

  const chip = (seleccionado: boolean) =>
    `rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 ${
      seleccionado
        ? "border-anil-500 bg-anil-500 text-white"
        : "border-piedra-300 bg-white text-piedra-900 hover:border-anil-400"
    }`;

  return (
    <div>
      {etiquetas.length > 1 ? (
        <div role="group" aria-label={textoFiltros} className="mb-8 flex flex-wrap gap-2">
          <button type="button" className={chip(activa === null)} aria-pressed={activa === null} onClick={() => setActiva(null)}>
            {textoTodos}
          </button>
          {etiquetas.map((e) => (
            <button
              key={e.id}
              type="button"
              className={chip(activa === e.id)}
              aria-pressed={activa === e.id}
              onClick={() => setActiva(activa === e.id ? null : e.id)}
            >
              {e.texto}
            </button>
          ))}
        </div>
      ) : null}
      {visibles.length === 0 ? <p className="text-piedra-600">{sinResultados}</p> : null}
      {visibles.map((g) => (
        <section key={g.id} id={`zona-${g.id}`} className="mb-10 scroll-mt-6 last:mb-0" aria-labelledby={`zona-${g.id}-titulo`}>
          <h2 id={`zona-${g.id}-titulo`} className="font-fraunces text-2xl font-bold text-piedra-900">
            {g.titulo}
          </h2>
          <p className="mb-5 mt-1 text-piedra-600">{g.texto}</p>
          <div className="flex flex-col gap-6">
            {g.tarjetas.map((t, i) => (
              <div key={i}>{t.nodo}</div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
