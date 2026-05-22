"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ChipFiltro } from "@/lib/ciudades";
import type { Idioma } from "@/lib/i18n/types";
import type { ProveedorActividad } from "@/lib/afiliados";
import SelloProveedor from "@/components/SelloProveedor";

/**
 * Datos serializables que el Server Component pasa al Client Component.
 * Es un subconjunto de `ActividadListItem` con solo lo que necesita la card.
 * Limitar el payload reduce el JS enviado al cliente.
 */
export type ActividadCardData = {
  slug: string;
  titulo: string;
  url: string;
  imagen: string;
  imagenAlt: string;
  duracion?: string;
  precioDesde: number;
  moneda: string;
  ratingProveedor?: number;
  numeroOpiniones?: number;
  cancelacionGratuita?: boolean;
  atraccionesRelacionadas: string[];
  /** Proveedor (viator / getyourguide) para el sello "Ofrecida por…". */
  proveedor: ProveedorActividad;
  /**
   * Clave de categoría (visitasGuiadas, entradas, excursionesDia,
   * espectaculos, toursGastronomicos, serviciosAdicionales, transporte).
   * Se usa para el filtro lateral de categorías.
   */
  categoria: string;
  destacada: boolean;
};

/**
 * Opción del bloque de categorías en el sidebar. La key debe coincidir con
 * el valor de `categoria` de cada `ActividadCardData`.
 */
export type CategoriaOpcion = {
  key: string;
  label: string;
};

/**
 * Strings localizables que pasamos del Server Component al Client. Next.js
 * NO permite serializar funciones a través del límite RSC, así que todos
 * los textos con cardinalidad usan el placeholder `{n}` que se sustituye en
 * el cliente.
 */
export type ActividadesFiltradasStrings = {
  filtrarPor: string;
  atracciones: string;
  categorias: string;
  limpiarFiltros: string;
  actividadesUna: string;
  actividadesPlural: string;
  filtrosActivosUno: string;
  filtrosActivosPlural: string;
  desde: string;
  verActividad: string;
  sinResultados: string;
  cancelacionGratuita: string;
};

type Props = {
  actividades: ActividadCardData[];
  chips: ChipFiltro[];
  categorias: CategoriaOpcion[];
  strings: ActividadesFiltradasStrings;
  locale: string;
};

export default function ActividadesFiltradas({
  actividades,
  chips,
  categorias,
  strings,
  locale,
}: Props) {
  const [tagsActivos, setTagsActivos] = useState<string[]>([]);
  const [categoriasActivas, setCategoriasActivas] = useState<string[]>([]);

  // Filtro pre-seleccionable por URL (?atraccion=bernabeu o ?attraction=...).
  // Permite que un anuncio SEM aterrice ya filtrado en las pocas variantes de
  // una atracción, sin sacar al usuario de la página. Se lee tras el montaje
  // para NO romper el prerender estático (SSG): el HTML sigue trayendo todas
  // las actividades y el filtro se aplica en cliente. Acepta lista separada por
  // comas y valida contra los chips disponibles (insensible a mayúsculas).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("atraccion") ?? params.get("attraction");
    if (!raw) return;
    const validos = new Map(chips.map((c) => [c.tag.toLowerCase(), c.tag]));
    const seleccion = raw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .map((t) => validos.get(t))
      .filter((t): t is string => Boolean(t));
    if (seleccion.length > 0) setTagsActivos(seleccion);
  }, [chips]);

  const toggleTag = (tag: string) => {
    setTagsActivos((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleCategoria = (key: string) => {
    setCategoriasActivas((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const limpiarTodo = () => {
    setTagsActivos([]);
    setCategoriasActivas([]);
  };

  const totalFiltros = tagsActivos.length + categoriasActivas.length;

  /**
   * Cruce AND entre los dos sets: cada bloque (atracciones, categorías) es
   * un OR interno; entre bloques es AND. Coincide con la lógica de
   * Civitatis o Booking — al sumar filtros se restringe progresivamente.
   */
  const filtradas = useMemo(() => {
    return actividades.filter((a) => {
      const pasaAtraccion =
        tagsActivos.length === 0 ||
        a.atraccionesRelacionadas.some((t) => tagsActivos.includes(t));
      const pasaCategoria =
        categoriasActivas.length === 0 ||
        categoriasActivas.includes(a.categoria);
      return pasaAtraccion && pasaCategoria;
    });
  }, [actividades, tagsActivos, categoriasActivas]);

  if (actividades.length === 0) return null;

  const contador =
    filtradas.length === 1
      ? strings.actividadesUna
      : strings.actividadesPlural.replace("{n}", String(filtradas.length));

  const filtrosActivosLabel =
    totalFiltros === 1
      ? strings.filtrosActivosUno
      : strings.filtrosActivosPlural.replace("{n}", String(totalFiltros));

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {chips.length > 0 || categorias.length > 0 ? (
            <aside className="lg:border-r lg:border-slate-200 lg:pr-6">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
                {strings.filtrarPor}
              </div>

              {chips.length > 0 ? (
                <>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    {strings.atracciones}
                  </div>
                  <div className="flex flex-wrap lg:flex-col gap-2 mb-5">
                    {chips.map((chip) => {
                      const activo = tagsActivos.includes(chip.tag);
                      return (
                        <button
                          key={chip.tag}
                          type="button"
                          onClick={() => toggleTag(chip.tag)}
                          aria-pressed={activo}
                          className={
                            "text-left text-sm font-medium px-3 py-2 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 " +
                            (activo
                              ? "bg-sky-500 border-sky-500 text-white hover:bg-sky-600"
                              : "bg-white border-slate-300 text-slate-900 hover:border-sky-400")
                          }
                        >
                          {activo ? "✓ " : ""}
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {categorias.length > 0 ? (
                <>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    {strings.categorias}
                  </div>
                  <div className="flex flex-wrap lg:flex-col gap-2 mb-4">
                    {categorias.map((cat) => {
                      const activo = categoriasActivas.includes(cat.key);
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => toggleCategoria(cat.key)}
                          aria-pressed={activo}
                          className={
                            "text-left text-sm font-medium px-3 py-2 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 " +
                            (activo
                              ? "bg-amber-500 border-amber-500 text-white hover:bg-amber-600"
                              : "bg-white border-slate-300 text-slate-900 hover:border-amber-400")
                          }
                        >
                          {activo ? "✓ " : ""}
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {totalFiltros > 0 ? (
                <button
                  type="button"
                  onClick={limpiarTodo}
                  className="text-sm text-sky-600 hover:text-sky-700 font-semibold"
                >
                  {strings.limpiarFiltros}
                </button>
              ) : null}
            </aside>
          ) : null}

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
              <div className="text-base font-semibold text-slate-900">
                {contador}
              </div>
              {totalFiltros > 0 ? (
                <div className="text-sm text-slate-500">
                  {filtrosActivosLabel}
                </div>
              ) : null}
            </div>

            {filtradas.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-base">
                {strings.sinResultados}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtradas.map((a) => (
                  <CardActividad
                    key={a.slug}
                    actividad={a}
                    strings={strings}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CardActividad({
  actividad,
  strings,
  locale,
}: {
  actividad: ActividadCardData;
  strings: ActividadesFiltradasStrings;
  locale: string;
}) {
  const formato = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: actividad.moneda || "EUR",
    maximumFractionDigits: 0,
  });

  const idioma: Idioma = locale.startsWith("en") ? "en" : "es";

  return (
    <Link
      href={actividad.url}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-sky-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
    >
      {actividad.imagen ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={actividad.imagen}
            alt={actividad.imagenAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {actividad.cancelacionGratuita ? (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {strings.cancelacionGratuita}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-slate-100" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-playfair text-lg md:text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors leading-tight">
          {actividad.titulo}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 mb-4">
          {actividad.duracion ? <span>{actividad.duracion}</span> : null}
          {typeof actividad.ratingProveedor === "number" &&
          typeof actividad.numeroOpiniones === "number" ? (
            <span>
              <span className="text-amber-500" aria-hidden="true">
                ★
              </span>{" "}
              {actividad.ratingProveedor.toFixed(1)} (
              {actividad.numeroOpiniones})
            </span>
          ) : null}
        </div>
        <div className="mt-auto pt-4 border-t border-slate-100">
          <SelloProveedor
            proveedor={actividad.proveedor}
            idioma={idioma}
            className="mb-3"
          />
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                {strings.desde}
              </p>
              <p className="text-xl font-bold text-slate-900">
                {formato.format(actividad.precioDesde)}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="text-sm font-semibold text-sky-600 group-hover:text-sky-700"
            >
              {strings.verActividad} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
