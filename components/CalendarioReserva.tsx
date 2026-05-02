"use client";

import { useMemo, useState } from "react";

type Props = {
  precio: string;
  precioPorPersona: string;
  duracion: string;
  idiomas: string[];
  cancelacionGratuita?: boolean;
  horasCancelacion?: number;
  ratingProveedor?: number;
  numeroOpiniones?: number;
  urlReservaBase: string;
  nombreProveedor: string;
  textoReservar: string;
  textoDesde: string;
  textoPorPersona: string;
  textoDuracion: string;
  textoIdiomas: string;
  textoCancelacionHorasAntes: string;
  textoCancelacionGratuita: string;
};

const NOMBRES_MESES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DIAS_SEMANA_ES = ["L", "M", "X", "J", "V", "S", "D"];

/**
 * Bloque de reserva con calendario mensual paginable.
 *
 * El calendario es decorativo y orientativo: no envía la fecha
 * seleccionada al proveedor (Viator no respeta esos parámetros para
 * afiliados básicos y los redirige al listado genérico). El usuario
 * confirma fecha, viajeros y disponibilidad real al saltar.
 *
 * Se mantiene la selección visual para anclar emocionalmente al
 * usuario con una fecha concreta antes de pulsar Reservar.
 */
export default function CalendarioReserva({
  precio,
  precioPorPersona,
  duracion,
  idiomas,
  cancelacionGratuita,
  horasCancelacion,
  ratingProveedor,
  numeroOpiniones,
  urlReservaBase,
  nombreProveedor,
  textoReservar,
  textoDesde,
  textoPorPersona,
  textoDuracion,
  textoIdiomas,
  textoCancelacionHorasAntes,
  textoCancelacionGratuita,
}: Props) {
  const hoy = useMemo(() => new Date(), []);

  const [mesVisible, setMesVisible] = useState<{ year: number; month: number }>(
    { year: hoy.getFullYear(), month: hoy.getMonth() }
  );
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

  const diasDelMes = useMemo(
    () => construirGridMes(mesVisible.year, mesVisible.month),
    [mesVisible]
  );

  const puedeIrAtras =
    mesVisible.year > hoy.getFullYear() ||
    (mesVisible.year === hoy.getFullYear() && mesVisible.month > hoy.getMonth());

  function navegar(delta: number) {
    setMesVisible((prev) => {
      const nuevoMes = prev.month + delta;
      if (nuevoMes < 0) return { year: prev.year - 1, month: 11 };
      if (nuevoMes > 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: nuevoMes };
    });
  }

  function elegirDia(dia: Date | null) {
    if (!dia) return;
    if (esPasado(dia, hoy)) return;
    setFechaSeleccionada(dia);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-sky-500 text-white px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide">
          Reservar tu visita
        </span>
        <span className="text-[10px] opacity-90">vía {nombreProveedor}</span>
      </div>

      <div className="p-5">
        <p className="text-xs text-slate-500">{textoDesde}</p>
        <p className="text-3xl font-bold text-slate-900 mt-0.5">{precio}</p>
        <p className="text-xs text-slate-500">{textoPorPersona}</p>

        {ratingProveedor && (
          <p className="mt-2 text-xs text-slate-600">
            ★ {ratingProveedor.toFixed(1)}
            {numeroOpiniones
              ? ` · ${numeroOpiniones.toLocaleString("es-ES")} opiniones`
              : ""}
          </p>
        )}

        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Comprueba la disponibilidad
          </p>
          <div className="border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => navegar(-1)}
                disabled={!puedeIrAtras}
                className="px-2 py-1 text-slate-400 hover:text-sky-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                aria-label="Mes anterior"
              >
                ‹
              </button>
              <span className="text-sm font-semibold text-slate-900">
                {NOMBRES_MESES_ES[mesVisible.month]} {mesVisible.year}
              </span>
              <button
                type="button"
                onClick={() => navegar(1)}
                className="px-2 py-1 text-sky-600 hover:text-sky-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                aria-label="Mes siguiente"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {DIAS_SEMANA_ES.map((d) => (
                <div
                  key={d}
                  className="text-[10px] text-slate-400 font-medium py-1"
                >
                  {d}
                </div>
              ))}
              {diasDelMes.map((dia, idx) => (
                <BotonDia
                  key={idx}
                  dia={dia}
                  hoy={hoy}
                  fechaSeleccionada={fechaSeleccionada}
                  onClick={() => elegirDia(dia)}
                />
              ))}
            </div>
          </div>
        </div>

        <a
          href={urlReservaBase}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-500 px-5 py-3 text-base font-semibold text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
        >
          {textoReservar} →
        </a>

        <p className="mt-3 text-center text-[11px] text-slate-500 leading-relaxed">
          En {nombreProveedor} confirma fecha, viajeros y disponibilidad.
          {cancelacionGratuita ? (
            <>
              <br />
              {horasCancelacion
                ? textoCancelacionHorasAntes.replace(
                    "{horas}",
                    String(horasCancelacion)
                  )
                : textoCancelacionGratuita}
            </>
          ) : null}
        </p>

        <dl className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between">
            <dt className="text-slate-500">{textoDuracion}</dt>
            <dd className="font-medium text-slate-900">{duracion}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">{textoIdiomas}</dt>
            <dd className="font-medium text-slate-900">
              {idiomas.map((i) => i.toUpperCase()).join(", ")}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Subcomponentes
   ───────────────────────────────────────────────────────── */

type BotonDiaProps = {
  dia: Date | null;
  hoy: Date;
  fechaSeleccionada: Date | null;
  onClick: () => void;
};

function BotonDia({ dia, hoy, fechaSeleccionada, onClick }: BotonDiaProps) {
  if (!dia) return <div aria-hidden="true" className="py-2" />;

  const enPasado = esPasado(dia, hoy);
  const seleccionado =
    fechaSeleccionada !== null && esMismaFecha(dia, fechaSeleccionada);

  const baseClass =
    "py-2 text-xs rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";
  const enabledClass = "text-slate-900 hover:bg-sky-50 cursor-pointer";
  const disabledClass = "text-slate-300 cursor-not-allowed";
  const selectedClass = "bg-amber-400 text-slate-900 font-semibold";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={enPasado}
      aria-pressed={seleccionado}
      aria-label={`${dia.getDate()} de ${NOMBRES_MESES_ES[dia.getMonth()]}`}
      className={`${baseClass} ${
        seleccionado ? selectedClass : enPasado ? disabledClass : enabledClass
      }`}
    >
      {dia.getDate()}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────── */

function construirGridMes(year: number, month: number): (Date | null)[] {
  const primerDia = new Date(year, month, 1);
  const diaSemanaPrimero = (primerDia.getDay() + 6) % 7;
  const diasEnMes = new Date(year, month + 1, 0).getDate();

  const grid: (Date | null)[] = [];
  for (let i = 0; i < diaSemanaPrimero; i++) grid.push(null);
  for (let d = 1; d <= diasEnMes; d++) grid.push(new Date(year, month, d));
  while (grid.length < 42) grid.push(null);

  return grid;
}

function esMismaFecha(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function esPasado(dia: Date, hoy: Date): boolean {
  const inicioHoy = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
  ).getTime();
  return dia.getTime() < inicioHoy;
}
