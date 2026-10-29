"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ChipFiltro } from "@/lib/ciudades";
import type { Idioma } from "@/lib/i18n/types";
import type { ProveedorActividad } from "@/lib/afiliados";
import SelloProveedor from "@/components/SelloProveedor";
import { CLAVE_FILTRO_PRIVADOS } from "@/lib/filtrosActividades";
import { TEXTO_ETIQUETA, type EtiquetaActividad } from "@/lib/etiquetasActividad";
import type { PrecioComparable } from "@/lib/precioComparable";
import { intercalarPrivadas } from "@/lib/ordenActividades";

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
  /** Precio por persona comparable (privadas por grupo: grupo de 4). */
  precio: PrecioComparable;
  moneda: string;
  ratingProveedor?: number;
  numeroOpiniones?: number;
  cancelacionGratuita?: boolean;
  atraccionesRelacionadas: string[];
  /** Proveedor (viator / getyourguide) para el sello "Ofrecida por…". */
  proveedor: ProveedorActividad;
  /**
   * Clave de tipo de actividad (`CATEGORIAS_ACTIVIDAD` en lib/actividades.ts:
   * visitasGuiadas, entradas, toursCiudad, excursionesDia…).
   * Se usa para el filtro lateral de categorías.
   */
  categoria: string;
  /** Tour privado: lo recoge el botón «Privados» del filtro de tipos. */
  privada: boolean;
  destacada: boolean;
  /** Etiqueta calculada en servidor (ver lib/etiquetasActividad.ts). */
  etiqueta?: EtiquetaActividad;
};

type Orden = "recomendadas" | "precio" | "valoracion";


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

/** Enlace rastreable a la landing de una categoría (`/…/actividades/c/…`). */
export type EnlaceCategoria = {
  href: string;
  label: string;
  total: number;
};

type Props = {
  actividades: ActividadCardData[];
  chips: ChipFiltro[];
  categorias: CategoriaOpcion[];
  strings: ActividadesFiltradasStrings;
  locale: string;
  /** Landings de categoría a enlazar bajo el listado (solo las indexables). */
  enlacesCategorias?: EnlaceCategoria[];
};

/** Actividades por página. Múltiplo de 3 para cuadrar con la rejilla. */
const POR_PAGINA = 12;

/**
 * Lista de páginas a mostrar en la barra de paginación. Hasta 7 páginas se
 * muestran todas; con más, se compacta con elipsis: 1 … (n-1) n (n+1) … total.
 */
function paginasVisibles(actual: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: (number | "…")[] = [1];
  const inicio = Math.max(2, actual - 1);
  const fin = Math.min(total - 1, actual + 1);
  if (inicio > 2) out.push("…");
  for (let i = inicio; i <= fin; i++) out.push(i);
  if (fin < total - 1) out.push("…");
  out.push(total);
  return out;
}

export default function ActividadesFiltradas({
  actividades,
  chips,
  categorias,
  strings,
  locale,
  enlacesCategorias = [],
}: Props) {
  const [tagsActivos, setTagsActivos] = useState<string[]>([]);
  const [categoriasActivas, setCategoriasActivas] = useState<string[]>([]);
  const [pagina, setPagina] = useState(1);
  const [orden, setOrden] = useState<Orden>("recomendadas");
  // Móvil: los filtros arrancan plegados para no ocupar pantalla. En escritorio
  // (lg+) el sidebar se muestra siempre, independientemente de este estado.
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);

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
    // Orden: número de reseñas del proveedor, de mayor a menor (las fichas
    // sin dato van al final). A igualdad de reseñas, la más barata primero.
    const filtradas = actividades
      .filter((a) => {
        const pasaAtraccion =
          tagsActivos.length === 0 ||
          a.atraccionesRelacionadas.some((t) => tagsActivos.includes(t));
        // «Privados» no es un tipo: se suma a los tipos elegidos (AND).
        const soloPrivados = categoriasActivas.includes(CLAVE_FILTRO_PRIVADOS);
        const tiposActivos = categoriasActivas.filter(
          (c) => c !== CLAVE_FILTRO_PRIVADOS
        );
        const pasaCategoria =
          (tiposActivos.length === 0 || tiposActivos.includes(a.categoria)) &&
          (!soloPrivados || a.privada);
        return pasaAtraccion && pasaCategoria;
      })
      .sort((a, b) => {
        if (orden === "precio") return a.precio.porPersona - b.precio.porPersona;
        if (orden === "valoracion") {
          // Solo cuenta la nota con un mínimo de opiniones; el resto, al final.
          const nota = (x: ActividadCardData) =>
            (x.numeroOpiniones ?? 0) >= 10 ? x.ratingProveedor ?? 0 : 0;
          const porNota = nota(b) - nota(a);
          if (porNota !== 0) return porNota;
        }
        // Sin nota publicada no puede ir por delante de lo que sí la tiene.
        const conNota = (x: ActividadCardData) =>
          typeof x.ratingProveedor === "number" && (x.numeroOpiniones ?? 0) > 0 ? 1 : 0;
        const porNotaPublicada = conNota(b) - conNota(a);
        if (porNotaPublicada !== 0) return porNotaPublicada;
        const porResenas = (b.numeroOpiniones ?? 0) - (a.numeroOpiniones ?? 0);
        if (porResenas !== 0) return porResenas;
        return a.precio.porPersona - b.precio.porPersona;
      });
    return orden === "recomendadas" ? intercalarPrivadas(filtradas) : filtradas;
  }, [actividades, tagsActivos, categoriasActivas, orden]);

  // Al cambiar cualquier filtro, volvemos a la primera página.
  useEffect(() => {
    setPagina(1);
  }, [tagsActivos, categoriasActivas, orden]);

  if (actividades.length === 0) return null;

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicioPagina = (paginaSegura - 1) * POR_PAGINA;
  const finPagina = paginaSegura * POR_PAGINA;

  const en = locale.startsWith("en");
  const txtPaginacion = {
    nav: en ? "Pagination" : "Paginación",
    anterior: en ? "Previous page" : "Página anterior",
    siguiente: en ? "Next page" : "Página siguiente",
    pagina: (n: number) => (en ? `Page ${n}` : `Página ${n}`),
  };

  const txtOrden = {
    label: en ? "Sort by" : "Ordenar por",
    recomendadas: en ? "Recommended" : "Recomendadas",
    precio: en ? "Price: low to high" : "Precio: de menor a mayor",
    valoracion: en ? "Highest rated" : "Mejor valoradas",
  };

  const txtCategorias = locale.startsWith("de")
    ? "Nach Kategorie entdecken"
    : en
      ? "Browse by category"
      : "Explorar por categoría";

  const irAPagina = (p: number) => {
    const destino = Math.min(Math.max(1, p), totalPaginas);
    setPagina(destino);
    if (typeof window !== "undefined") {
      listaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-2 lg:gap-8">
          {chips.length > 0 || categorias.length > 0 ? (
            <aside className="lg:border-r lg:border-piedra-200 lg:pr-6 min-w-0">
              <div className="hidden lg:block text-xs font-semibold text-piedra-900 uppercase tracking-wider mb-3">
                {strings.filtrarPor}
              </div>
              {/* Atracciones: fila deslizable siempre visible en móvil;
                  columna en escritorio. */}
              {chips.length > 0 ? (
                <>
                  <div className="hidden lg:block text-xs text-piedra-500 uppercase tracking-wider mb-2">
                    {strings.atracciones}
                  </div>
                  <div className="flex flex-nowrap overflow-x-auto -mx-4 px-4 pb-1 mb-3 lg:mx-0 lg:px-0 lg:pb-0 lg:mb-5 lg:flex-col lg:overflow-visible gap-2 [scrollbar-width:none]">
                    {chips.map((chip) => {
                      const activo = tagsActivos.includes(chip.tag);
                      return (
                        <button
                          key={chip.tag}
                          type="button"
                          onClick={() => toggleTag(chip.tag)}
                          aria-pressed={activo}
                          className={
                            "shrink-0 whitespace-nowrap lg:whitespace-normal text-left text-sm font-semibold px-3 py-2 rounded-full lg:rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 " +
                            (activo
                              ? "bg-anil-500 border-anil-500 text-white hover:bg-anil-600"
                              : "bg-white border-piedra-300 text-piedra-900 hover:border-anil-400")
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

              {/* Móvil: botón para plegar/desplegar los filtros (en pantalla
                  pequeña los chips ocupan mucho aunque no estén seleccionados). */}
              <button
                type="button"
                onClick={() => setFiltrosAbiertos((v) => !v)}
                aria-expanded={filtrosAbiertos}
                className="lg:hidden w-full flex items-center justify-between gap-2 mb-4 min-h-[44px] px-3 py-2 rounded-lg border border-piedra-300 bg-white text-sm font-semibold text-piedra-900 hover:border-anil-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500"
              >
                <span className="flex items-center gap-2">
                  {strings.categorias}
                  {categoriasActivas.length > 0 ? (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-anil-500 text-white text-xs">
                      {categoriasActivas.length}
                    </span>
                  ) : null}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={"transition-transform " + (filtrosAbiertos ? "rotate-180" : "")}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Contenido de filtros: plegable en móvil, fijo en escritorio. */}
              <div className={(filtrosAbiertos ? "block" : "hidden") + " lg:block"}>
              {categorias.length > 0 ? (
                <>
                  <div className="text-xs text-piedra-500 uppercase tracking-wider mb-2">
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
                            "text-left text-sm font-semibold px-3 py-2 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2 " +
                            (activo
                              ? "bg-azafran-500 border-azafran-500 text-piedra-900 hover:bg-azafran-600"
                              : "bg-white border-piedra-300 text-piedra-900 hover:border-azafran-400")
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
                  className="text-sm text-anil-600 hover:text-anil-700 font-semibold"
                >
                  {strings.limpiarFiltros}
                </button>
              ) : null}
              </div>
            </aside>
          ) : null}

          <div ref={listaRef} className="scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
              <div>
                <div className="text-base font-semibold text-piedra-900">
                  {contador}
                </div>
                {totalFiltros > 0 ? (
                  <div className="text-sm text-piedra-500">
                    {filtrosActivosLabel}
                  </div>
                ) : null}
              </div>
              <label className="flex items-center gap-2 text-sm text-piedra-600">
                <span className="hidden sm:inline">{txtOrden.label}</span>
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as Orden)}
                  aria-label={txtOrden.label}
                  className="min-h-[40px] rounded-lg border border-piedra-300 bg-white px-3 py-2 text-sm font-semibold text-piedra-900 hover:border-anil-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
                >
                  <option value="recomendadas">{txtOrden.recomendadas}</option>
                  <option value="precio">{txtOrden.precio}</option>
                  <option value="valoracion">{txtOrden.valoracion}</option>
                </select>
              </label>
            </div>

            {filtradas.length === 0 ? (
              <div className="text-center py-12 text-piedra-500 text-base">
                {strings.sinResultados}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-6 border-t border-piedra-200 md:border-0">
                  {/* Todas las tarjetas van en el HTML (para que los buscadores
                      lleguen a cada ficha); las de otras páginas se ocultan
                      con CSS y sus imágenes lazy no se descargan. */}
                  {filtradas.map((a, i) => (
                    <div
                      key={a.slug}
                      className={
                        i >= inicioPagina && i < finPagina ? "flex" : "hidden"
                      }
                    >
                      <CardActividad
                        actividad={a}
                        strings={strings}
                        locale={locale}
                      />
                    </div>
                  ))}
                </div>

                {totalPaginas > 1 ? (
                  <nav
                    aria-label={txtPaginacion.nav}
                    className="mt-10 flex items-center justify-center gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => irAPagina(paginaSegura - 1)}
                      disabled={paginaSegura === 1}
                      aria-label={txtPaginacion.anterior}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-piedra-300 text-piedra-700 hover:border-anil-400 hover:text-anil-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500"
                    >
                      ‹
                    </button>

                    {paginasVisibles(paginaSegura, totalPaginas).map((p, i) =>
                      p === "…" ? (
                        <span
                          key={`gap-${i}`}
                          className="px-1.5 text-piedra-400 select-none"
                          aria-hidden="true"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => irAPagina(p)}
                          aria-label={txtPaginacion.pagina(p)}
                          aria-current={p === paginaSegura ? "page" : undefined}
                          className={
                            "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 " +
                            (p === paginaSegura
                              ? "bg-anil-500 border-anil-500 text-white"
                              : "bg-white border-piedra-300 text-piedra-700 hover:border-anil-400 hover:text-anil-700")
                          }
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() => irAPagina(paginaSegura + 1)}
                      disabled={paginaSegura === totalPaginas}
                      aria-label={txtPaginacion.siguiente}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-piedra-300 text-piedra-700 hover:border-anil-400 hover:text-anil-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500"
                    >
                      ›
                    </button>
                  </nav>
                ) : null}
              </>
            )}

            {enlacesCategorias.length > 0 ? (
              <nav
                aria-label={txtCategorias}
                className="mt-12 pt-8 border-t border-piedra-200"
              >
                <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 mb-4">
                  {txtCategorias}
                </h2>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {enlacesCategorias.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        prefetch={false}
                        className="inline-flex items-center text-anil-600 hover:text-anil-700 font-semibold transition-colors"
                      >
                        {c.label} ({c.total}) →
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CardActividad({
  actividad,
  strings,
  locale,
}: {
  actividad: ActividadCardData;
  strings: Pick<ActividadesFiltradasStrings, "desde" | "verActividad" | "cancelacionGratuita">;
  locale: string;
}) {
  const formato = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: actividad.moneda || "EUR",
    maximumFractionDigits: 0,
  });

  const idioma: Idioma = locale.startsWith("en") ? "en" : "es";
  const textoEtiqueta = actividad.etiqueta
    ? TEXTO_ETIQUETA[idioma === "es" ? "es" : "en"][actividad.etiqueta]
    : null;
  const tieneNota =
    typeof actividad.ratingProveedor === "number" &&
    typeof actividad.numeroOpiniones === "number";

  return (
    <Link
      href={actividad.url}
      prefetch={false}
      className="group flex w-full gap-3 border-b border-piedra-200 bg-white py-3 transition md:flex-col md:gap-0 md:overflow-hidden md:rounded-xl md:border md:py-0 md:shadow-sm hover:border-anil-400 md:hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
    >
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-piedra-100 md:aspect-[4/3] md:h-auto md:w-full md:rounded-none">
        {actividad.imagen ? (
          <Image
            src={actividad.imagen}
            alt={actividad.imagenAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 112px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
        {textoEtiqueta ? (
          <span className="absolute top-3 left-3 hidden md:inline-block bg-piedra-900 text-white text-xs font-semibold px-2 py-1 rounded">
            {textoEtiqueta}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col md:p-5">
        {textoEtiqueta ? (
          <span className="md:hidden self-start bg-piedra-900 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded mb-1">
            {textoEtiqueta}
          </span>
        ) : null}
        {actividad.privada ? (
          <span className="self-start inline-block bg-anil-50 text-anil-700 text-[11px] md:text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 md:px-2 md:py-1 rounded mb-1 md:mb-2">
            {idioma === "es" ? "Privado · solo tu grupo" : "Private · just your group"}
          </span>
        ) : null}
        <h3 className="text-[15px] font-semibold leading-snug md:font-fraunces md:text-xl md:font-bold text-piedra-900 mb-1 md:mb-2 group-hover:text-anil-700 transition-colors md:leading-tight line-clamp-2 md:min-h-[2.5em]">
          {actividad.titulo}
        </h3>
        <div className="flex items-center gap-x-3 overflow-hidden whitespace-nowrap text-xs md:text-sm text-piedra-500 md:h-5 md:mb-1">
          {actividad.duracion ? (
            <span className="min-w-0 truncate">{actividad.duracion}</span>
          ) : null}
          {tieneNota ? (
            <span className="shrink-0">
              <span className="text-azafran-600" aria-hidden="true">
                ★
              </span>{" "}
              {actividad.ratingProveedor?.toFixed(1)} ({actividad.numeroOpiniones})
            </span>
          ) : null}
        </div>
        {actividad.cancelacionGratuita ? (
          <p className="text-xs md:text-sm font-semibold text-cobre-600 mt-0.5 md:mb-3">
            ✓ {strings.cancelacionGratuita}
          </p>
        ) : null}
        <div className="mt-auto md:pt-4 md:border-t md:border-piedra-100">
          <div className="hidden md:block mb-3">
            <SelloProveedor proveedor={actividad.proveedor} idioma={idioma} />
          </div>
          <div className="flex items-end justify-end md:justify-between">
            <div className="text-right md:text-left">
              <p className="hidden md:block text-xs uppercase tracking-wider text-piedra-400">
                {strings.desde}
              </p>
              <p className="text-base md:text-xl font-bold text-piedra-900">
                <span className="md:hidden text-xs font-normal text-piedra-500">
                  {strings.desde.toLowerCase()}{" "}
                </span>
                {formato.format(actividad.precio.porPersona)}
                {actividad.precio.personasReferencia ? (
                  <span className="text-xs font-normal text-piedra-500">
                    {idioma === "es" ? "/pers." : "/person"}
                  </span>
                ) : null}
              </p>
              {actividad.precio.porGrupo ? (
                <p className="text-[11px] md:text-xs text-piedra-500">
                  {actividad.precio.personasReferencia && actividad.precio.totalReferencia
                    ? idioma === "es"
                      ? `grupo de ${actividad.precio.personasReferencia}: ${formato.format(actividad.precio.totalReferencia)} en total`
                      : `group of ${actividad.precio.personasReferencia}: ${formato.format(actividad.precio.totalReferencia)} total`
                    : idioma === "es"
                      ? "por grupo"
                      : "per group"}
                </p>
              ) : null}
            </div>
            <span
              aria-hidden="true"
              className="hidden md:inline text-sm font-semibold text-anil-600 group-hover:text-anil-700"
            >
              {strings.verActividad} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
