"use client";

import { useMemo, useState } from "react";
import {
  CardActividad,
  type ActividadCardData,
  type ActividadesFiltradasStrings,
} from "@/components/ciudad/ActividadesFiltradas";
import type { TipoOpcion } from "@/lib/atracciones";

export type OpcionCard = { card: ActividadCardData; tipo: TipoOpcion };

type Props = {
  opciones: OpcionCard[];
  etiquetasTipo: Record<TipoOpcion, string>;
  textos: { todas: string; verTodas: string; filtrar: string };
  strings: Pick<ActividadesFiltradasStrings, "desde" | "verActividad" | "cancelacionGratuita">;
  locale: string;
};

const ORDEN_TIPOS: TipoOpcion[] = ["entrada", "guiada", "privada", "nocturna", "jardines"];
const VISIBLES_INICIO = 6;

const CHIP =
  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2";
const CHIP_ACTIVO = "border-anil-500 bg-anil-500 text-white";
const CHIP_INACTIVO = "border-piedra-300 bg-white text-piedra-900 hover:border-anil-400";

/** Rejilla de fichas de una atracción con filtro por tipo de visita. */
export default function OpcionesAtraccion({ opciones, etiquetasTipo, textos, strings, locale }: Props) {
  const [tipo, setTipo] = useState<TipoOpcion | null>(null);
  const [todas, setTodas] = useState(false);

  const conteo = useMemo(() => {
    const m = new Map<TipoOpcion, number>();
    for (const o of opciones) m.set(o.tipo, (m.get(o.tipo) ?? 0) + 1);
    return m;
  }, [opciones]);

  const filtradas = tipo ? opciones.filter((o) => o.tipo === tipo) : opciones;
  // Todas las fichas van en el HTML (enlaces rastreables); las que exceden
  // las primeras 6 solo se ocultan hasta pulsar «Ver todas».
  const plegado = !todas && !tipo;
  const tiposPresentes = ORDEN_TIPOS.filter((t) => (conteo.get(t) ?? 0) > 0);

  return (
    <div>
      {tiposPresentes.length > 1 ? (
        <div role="group" aria-label={textos.filtrar} className="mb-7 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={tipo === null}
            onClick={() => setTipo(null)}
            className={`${CHIP} ${tipo === null ? CHIP_ACTIVO : CHIP_INACTIVO}`}
          >
            {textos.todas} · {opciones.length}
          </button>
          {tiposPresentes.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tipo === t}
              onClick={() => setTipo(t)}
              className={`${CHIP} ${tipo === t ? CHIP_ACTIVO : CHIP_INACTIVO}`}
            >
              {etiquetasTipo[t]} · {conteo.get(t)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {filtradas.map((o, i) => (
          <div key={o.card.url} className={plegado && i >= VISIBLES_INICIO ? "hidden" : "flex"}>
            <CardActividad actividad={o.card} strings={strings} locale={locale} />
          </div>
        ))}
      </div>

      {plegado && filtradas.length > VISIBLES_INICIO ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setTodas(true)}
            className="inline-flex items-center justify-center rounded-lg border border-piedra-300 bg-white px-6 py-3 font-semibold text-piedra-900 transition-colors hover:border-anil-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
          >
            {textos.verTodas.replace("{n}", String(opciones.length))}
          </button>
        </div>
      ) : null}
    </div>
  );
}
