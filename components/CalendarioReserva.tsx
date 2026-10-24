"use client";

import { useCallback, useMemo, useState } from "react";
import type { Idioma } from "@/lib/i18n/types";
import { construirUrlViatorFicha } from "@/lib/sem/url-builder-ficha";
import SelloProveedor from "./SelloProveedor";
import type { ProveedorActividad } from "@/lib/afiliados";

type Props = {
  idioma: Idioma;
  /** Proveedor de la actividad: muestra el sello "Ofrecida por …" con su logo. */
  proveedor?: ProveedorActividad;
  precio: string;
  /**
   * Valor numérico "desde" de la actividad (sin formatear), usado como
   * `value` del evento outbound_click.
   */
  valorEstimado?: number;
  /** Moneda ISO (ej. "EUR") asociada a `valorEstimado`. */
  monedaEstimada?: string;
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

type Strings = {
  headerReservar: string;
  via: string;
  compruebaDisponibilidad: string;
  mesAnterior: string;
  mesSiguiente: string;
  enProveedorConfirma: (proveedor: string) => string;
  ariaDia: (dia: number, mes: string) => string;
  opinionSingular: string;
  opinionPlural: string;
  meses: readonly string[];
  diasSemana: readonly string[];
  locale: string;
};

const DICT: Record<"es" | "en", Strings> = {
  es: {
    headerReservar: "Reservar tu visita",
    via: "vía",
    compruebaDisponibilidad: "Comprueba la disponibilidad",
    mesAnterior: "Mes anterior",
    mesSiguiente: "Mes siguiente",
    enProveedorConfirma: (p: string) =>
      `En ${p} confirma fecha, viajeros y disponibilidad.`,
    ariaDia: (d: number, m: string) => `${d} de ${m}`,
    opinionSingular: "1 opinión",
    opinionPlural: "opiniones",
    meses: [
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
    ],
    diasSemana: ["L", "M", "X", "J", "V", "S", "D"],
    locale: "es-ES",
  },
  en: {
    headerReservar: "Book your visit",
    via: "via",
    compruebaDisponibilidad: "Check availability",
    mesAnterior: "Previous month",
    mesSiguiente: "Next month",
    enProveedorConfirma: (p: string) =>
      `Confirm date, travellers and availability on ${p}.`,
    ariaDia: (d: number, m: string) => `${m} ${d}`,
    opinionSingular: "1 review",
    opinionPlural: "reviews",
    meses: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    diasSemana: ["M", "T", "W", "T", "F", "S", "S"],
    locale: "en-US",
  },
};

function dictFor(idioma: Idioma): Strings {
  if (idioma === "es") return DICT.es;
  return DICT.en;
}

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
 *
 * Tracking SEM: al hacer clic en Reservar, el handler lee el `gclid`
 * de sessionStorage (capturado en landings SEM por GclidCapture) y lo
 * añade a la URL Viator junto con el `campaign=ficha-{slug}-{gclid}`.
 * Si no hay `gclid` (usuario orgánico/directo) se omite y la URL final
 * solo lleva los params estándar de afiliado.
 */
export default function CalendarioReserva({
  idioma,
  precio,
  valorEstimado,
  monedaEstimada,
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
  proveedor,
}: Props) {
  const t = dictFor(idioma);
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

  // Click handler para CTA Reservar: añade gclid + campaign y redirige.
  const handleReservarClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (typeof window === "undefined") return;

      const gclid =
        window.sessionStorage.getItem("gclid") ?? undefined;

      // Slug = último segmento de la ruta (ej. "excursion-toledo-dia-completo")
      const slug =
        window.location.pathname.split("/").filter(Boolean).pop() ?? "unknown";

      const url = construirUrlViatorFicha(urlReservaBase, slug, gclid);

      // Dominio y URL de destino del clic de salida. Sin esto, GA4 registra
      // el evento outbound_click pero con link_domain/link_url vacíos,
      // impidiendo saber a qué proveedor concreto (Viator, GetYourGuide...)
      // se dirigió cada clic (ver análisis tráfico IA 2026-10-02).
      let linkDomain: string | null = null;
      try {
        linkDomain = new URL(url).hostname;
      } catch {
        linkDomain = null;
      }

      if ("gtag" in window) {
        const gtag = (
          window as unknown as {
            gtag: (
              event: string,
              name: string,
              params: Record<string, unknown>,
            ) => void;
          }
        ).gtag;

        // Valor de conversión = precio "desde" de la ficha. Sin esto GA4
        // registra la conversión con 0 € de ingresos e impide medir ROAS
        // real (ver auditoría GA4 2026-09-05).
        const valorConversion = valorEstimado ?? null;
        const monedaConversion = monedaEstimada ?? null;

        gtag("event", "outbound_click", {
          event_category: "ficha",
          event_label: slug,
          item_name: slug,
          ficha_slug: slug,
          gclid: gclid ?? null,
          link_domain: linkDomain,
          link_url: url,
          ...(valorConversion !== null ? { value: valorConversion } : {}),
          ...(monedaConversion !== null ? { currency: monedaConversion } : {}),
        });
      }

      window.open(url, "_blank", "noopener,noreferrer");
    },
    [urlReservaBase, valorEstimado, monedaEstimada]
  );

  // Rating como dato agregado del proveedor (Viator). NO se renderizan
  // opiniones individuales: la API de afiliación lo prohíbe y, además,
  // ExploraSpain no es el operador de la actividad.
  const tieneRating =
    typeof ratingProveedor === "number" &&
    typeof numeroOpiniones === "number" &&
    numeroOpiniones > 0;

  const ratingTextoValor = (ratingProveedor ?? 0).toLocaleString(t.locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const ratingTextoOpiniones =
    numeroOpiniones === 1
      ? t.opinionSingular
      : `${(numeroOpiniones ?? 0).toLocaleString(t.locale)} ${t.opinionPlural}`;

  return (
    <div className="bg-white border border-piedra-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-anil-500 text-white px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide">
          {t.headerReservar}
        </span>
        <span className="text-[10px] opacity-90">
          {t.via} {nombreProveedor}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs text-piedra-500">{textoDesde}</p>
        <p className="text-4xl font-bold text-piedra-900 mt-0.5">{precio}</p>
        <p className="text-xs text-piedra-500">{textoPorPersona}</p>

        {tieneRating && (
          <div className="mt-3 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md bg-azafran-50 px-2.5 py-1.5 text-sm">
            <span className="inline-flex items-center gap-1 font-semibold text-piedra-900">
              <span aria-hidden="true" className="text-azafran-500 text-base leading-none">
                ★
              </span>
              <span>{ratingTextoValor}</span>
            </span>
            <span aria-hidden="true" className="text-piedra-300">
              ·
            </span>
            <span className="text-piedra-700">{ratingTextoOpiniones}</span>
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs font-semibold text-piedra-700 mb-2">
            {t.compruebaDisponibilidad}
          </p>
          <div className="border border-piedra-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => navegar(-1)}
                disabled={!puedeIrAtras}
                className="px-2 py-1 text-piedra-400 hover:text-anil-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 rounded"
                aria-label={t.mesAnterior}
              >
                ‹
              </button>
              <span className="text-sm font-semibold text-piedra-900">
                {t.meses[mesVisible.month]} {mesVisible.year}
              </span>
              <button
                type="button"
                onClick={() => navegar(1)}
                className="px-2 py-1 text-anil-600 hover:text-anil-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 rounded"
                aria-label={t.mesSiguiente}
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {t.diasSemana.map((d, idx) => (
                <div
                  key={idx}
                  className="text-[10px] text-piedra-400 font-semibold py-1"
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
                  meses={t.meses}
                  ariaDia={t.ariaDia}
                />
              ))}
            </div>
          </div>
        </div>

        <a
          href={urlReservaBase}
          onClick={handleReservarClick}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-azafran-400 hover:bg-azafran-500 px-5 py-3 text-base font-semibold text-piedra-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-azafran-500"
        >
          {textoReservar} →
        </a>

        {proveedor && (
          <div className="mt-3 text-center">
            <SelloProveedor proveedor={proveedor} idioma={idioma} />
          </div>
        )}

        <p className="mt-3 text-center text-[11px] text-piedra-500 leading-relaxed">
          {t.enProveedorConfirma(nombreProveedor)}
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

        <dl className="mt-4 pt-4 border-t border-piedra-100 space-y-2 text-xs">
          <div className="flex justify-between">
            <dt className="text-piedra-500">{textoDuracion}</dt>
            <dd className="font-semibold text-piedra-900">{duracion}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-piedra-500">{textoIdiomas}</dt>
            <dd className="font-semibold text-piedra-900">
              {idiomas.map((i) => i.toUpperCase()).join(", ")}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Subcomponentes
   ───────────────────────────────────────────────────────────────────────── */

type BotonDiaProps = {
  dia: Date | null;
  hoy: Date;
  fechaSeleccionada: Date | null;
  onClick: () => void;
  meses: readonly string[];
  ariaDia: (dia: number, mes: string) => string;
};

function BotonDia({
  dia,
  hoy,
  fechaSeleccionada,
  onClick,
  meses,
  ariaDia,
}: BotonDiaProps) {
  if (!dia) return <div aria-hidden="true" className="py-2" />;

  const enPasado = esPasado(dia, hoy);
  const seleccionado =
    fechaSeleccionada !== null && esMismaFecha(dia, fechaSeleccionada);

  const baseClass =
    "py-2 text-xs rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-anil-500";
  const enabledClass = "text-piedra-900 hover:bg-anil-50 cursor-pointer";
  const disabledClass = "text-piedra-300 cursor-not-allowed";
  const selectedClass = "bg-azafran-400 text-piedra-900 font-semibold";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={enPasado}
      aria-pressed={seleccionado}
      aria-label={ariaDia(dia.getDate(), meses[dia.getMonth()])}
      className={`${baseClass} ${
        seleccionado ? selectedClass : enPasado ? disabledClass : enabledClass
      }`}
    >
      {dia.getDate()}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────────────── */

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
