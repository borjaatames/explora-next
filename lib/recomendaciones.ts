import { obtenerListaActividadesPorCiudad } from "./actividades";
import type { ActividadListItem } from "./actividades";
import { tokensDe } from "./guias";
import type { Idioma } from "./i18n/types";

// =============================================================================
// Actividades recomendadas al pie de una guía editorial
// -----------------------------------------------------------------------------
// Enlaza la guía (tráfico informacional) con fichas propias de la misma ciudad
// (tráfico transaccional). Nunca enlaza a afiliados: el lector llega a la
// ficha y reserva desde allí.
//
// Regla: la guía declara en su frontmatter `actividades` (slugs ES) las
// fichas de las que habla, y el carrusel muestra exactamente esas, en ese
// orden. Nunca se rellena con otras fichas de la ciudad: cada guía ofrece lo
// que recomienda, no lo que haya.
//
// Compatibilidad: si una guía aún no declara `actividades`, se usa el
// criterio antiguo (fichas que la citan en `guiasRelacionadas`, afinidad
// temática y opiniones).
// =============================================================================

type GuiaReferencia = {
  slug: string;
  titulo: string;
  keywords?: string[];
  actividades?: string[];
};

function puntosAfinidad(
  tokensGuia: Set<string>,
  actividad: ActividadListItem
): number {
  const tokensActividad = tokensDe(
    [
      actividad.slug,
      actividad.titulo,
      ...(actividad.keywords ?? []),
      ...(actividad.atraccionesRelacionadas ?? []),
    ].join(" ")
  );
  let puntos = 0;
  tokensGuia.forEach((t) => {
    if (tokensActividad.has(t)) puntos += 1;
  });
  return puntos;
}

export function obtenerActividadesParaGuia(
  idioma: Idioma,
  ciudad: string,
  guia: GuiaReferencia,
  limite: number = 6
): ActividadListItem[] {
  const actividades = obtenerListaActividadesPorCiudad(idioma, ciudad);
  if (actividades.length === 0) return [];

  if (guia.actividades && guia.actividades.length > 0) {
    const porSlugEs = new Map<string, ActividadListItem>();
    actividades.forEach((a) => {
      porSlugEs.set(a.slugs?.es ?? a.slug, a);
      porSlugEs.set(a.slug, a);
    });
    const vistas = new Set<string>();
    const curadas: ActividadListItem[] = [];
    guia.actividades.forEach((slugEs) => {
      const a = porSlugEs.get(slugEs);
      if (a && !vistas.has(a.url)) {
        vistas.add(a.url);
        curadas.push(a);
      }
    });
    return curadas.slice(0, 10);
  }

  const tokensGuia = tokensDe(
    [guia.slug, guia.titulo, ...(guia.keywords ?? [])].join(" ")
  );

  const ordenadas = actividades
    .map((a) => ({
      a,
      citada: a.guiasRelacionadas?.includes(guia.slug) ? 1 : 0,
      puntos: puntosAfinidad(tokensGuia, a),
      opiniones: a.numeroOpiniones ?? 0,
    }))
    .sort(
      (x, y) =>
        y.citada - x.citada ||
        y.puntos - x.puntos ||
        y.opiniones - x.opiniones ||
        x.a.precioDesde - y.a.precioDesde
    );

  // Las fichas curadas para esta guía salen todas aunque superen el límite
  // (con un tope de 8 para no alargar el carrusel sin fin).
  const curadas = ordenadas.filter((x) => x.citada === 1).length;
  const total = Math.min(Math.max(limite, curadas), 8);

  return ordenadas.slice(0, total).map(({ a }) => a);
}


// =============================================================================
// Actividades parecidas al pie de una ficha
// -----------------------------------------------------------------------------
// Para no perder al lector que no se convence con la ficha (mejor una comisión
// pequeña que ninguna), pero solo con fichas MUY parecidas: tienen que
// compartir tema: una palabra del slug/título o dos de las keywords (sin el
// nombre de la ciudad ni genéricas como "tour" o "entrada"). Orden: palabras
// del título en común, luego de keywords, después atracción compartida, misma categoría y, a
// igualdad, más opiniones. Primero solo las casi iguales (misma atracción y
// tema); si no hay ninguna, actividades parecidas de la ciudad (misma
// categoría o atracción) para no dejar el hueco.
// =============================================================================

type FichaReferencia = {
  slug: string;
  titulo: string;
  categoria: string;
  keywords?: string[];
  atraccionesRelacionadas?: string[];
};

// Palabras que aparecen en casi todas las fichas y no dicen de qué va.
const GENERICAS_FICHA = new Set([
  "tour", "tours", "visita", "visitas", "guiada", "guiado", "guided", "visit",
  "entrada", "entradas", "ticket", "tickets", "desde", "from", "with", "incluida",
  "incluido", "incluidas", "included", "horas", "hours", "hour", "experiencia",
  "experience", "excursion", "trip", "dia", "day", "completo", "full", "half",
  "medio", "grupo", "group", "small", "reducido", "opcion", "option",
  "centro", "historico", "historic", "noche", "night", "nocturna", "nocturno",
  "ciudad", "city", "mejor", "best", "pase", "pass",
]);

function tokensTema(texto: string, ciudad: string): Set<string> {
  const ciudadTokens = tokensDe(ciudad.replace(/-/g, " "));
  const tokens = tokensDe(texto);
  return new Set(
    Array.from(tokens).filter((t) => !GENERICAS_FICHA.has(t) && !ciudadTokens.has(t))
  );
}

function textoTitulo(a: FichaReferencia): string {
  return [a.slug.replace(/-/g, " "), a.titulo].join(" ");
}

function comunes(a: Set<string>, b: Set<string>): number {
  return Array.from(a).filter((t) => b.has(t)).length;
}

// Palabras negadas en un título: «Jardines y Generalife (sin Palacios
// Nazaríes)» → {palacios, nazaries}. Una ficha que niega lo que otra incluye
// es otra actividad, aunque compartan casi todas las palabras.
const RE_NEGACION = /\b(?:sin|without|excluding|ohne)\b([^),.;]*)/gi;

function tokensNegados(texto: string, ciudad: string): Set<string> {
  const negados = new Set<string>();
  for (const m of texto.matchAll(RE_NEGACION)) {
    tokensTema(m[1] ?? "", ciudad).forEach((t) => negados.add(t));
  }
  return negados;
}

export type TipoParecidas = "casiIguales" | "ciudad" | "mejorValoradas";

export type ResultadoParecidas = {
  tipo: TipoParecidas;
  actividades: ActividadListItem[];
};

export function obtenerActividadesParecidas(
  idioma: Idioma,
  ciudad: string,
  actual: FichaReferencia,
  limite = 4
): ActividadListItem[] {
  return obtenerParecidasConTipo(idioma, ciudad, actual, limite).actividades;
}

/**
 * Igual que `obtenerActividadesParecidas`, pero dice de qué nivel salen:
 * el bloque «Otras versiones de esta visita» solo se muestra con
 * `casiIguales`.
 */
export function obtenerParecidasConTipo(
  idioma: Idioma,
  ciudad: string,
  actual: FichaReferencia,
  limite = 4
): ResultadoParecidas {
  const tituloActual = tokensTema(textoTitulo(actual), ciudad);
  const negadosActual = tokensNegados(actual.titulo, ciudad);
  const keywordsActual = tokensTema((actual.keywords ?? []).join(" "), ciudad);
  // "otros-<ciudad>" es un cajón de sastre: compartirlo no hace parecidas dos fichas.
  const atraccionReal = (x: string) => !x.startsWith("otros");
  const atracciones = new Set((actual.atraccionesRelacionadas ?? []).filter(atraccionReal));

  const puntuadas = obtenerListaActividadesPorCiudad(idioma, ciudad)
    .filter((a) => a.slug !== actual.slug)
    .map((a) => {
      const titulo = tokensTema(textoTitulo(a), ciudad);
      const keywords = tokensTema((a.keywords ?? []).join(" "), ciudad);
      const negadosOtra = tokensNegados(a.titulo, ciudad);
      // Una niega lo que la otra incluye (con/sin Nazaríes): no son la misma.
      const contradice =
        comunes(negadosOtra, tituloActual) > comunes(negadosOtra, negadosActual) ||
        comunes(negadosActual, titulo) > comunes(negadosActual, negadosOtra);
      return {
        a,
        contradice,
        // El título manda: es lo que de verdad dice qué es la actividad.
        temaTitulo: comunes(titulo, tituloActual),
        temaKeywords: comunes(new Set([...titulo, ...keywords]), keywordsActual),
        atraccion: (a.atraccionesRelacionadas ?? []).filter((x) => atracciones.has(x)).length,
        categoria: a.categoria === actual.categoria ? 1 : 0,
      };
    });

  const ordenar = (x: (typeof puntuadas)[number], y: (typeof puntuadas)[number]) =>
    Number(x.contradice) - Number(y.contradice) ||
    y.temaTitulo - x.temaTitulo ||
    y.temaKeywords - x.temaKeywords ||
    y.atraccion - x.atraccion ||
    y.categoria - x.categoria ||
    (y.a.numeroOpiniones ?? 0) - (x.a.numeroOpiniones ?? 0);

  // 1) Casi iguales: misma atracción y tema en el título, y además misma
  //    categoría o dos palabras de título en común (si la ficha no declara
  //    atracción, dos palabras de título). Si las hay, solo se muestran esas.
  const casiIguales = puntuadas
    .filter((p) => {
      if (p.contradice) return false;
      const mismoTipo = p.categoria > 0 || p.temaTitulo > 1;
      return atracciones.size > 0
        ? p.atraccion > 0 && p.temaTitulo > 0 && mismoTipo
        : p.temaTitulo > 1;
    })
    .sort(ordenar);

  // 2) Si no hay ninguna casi igual, mejor actividades parecidas de la ciudad
  //    que un hueco: misma categoría (o misma atracción), ordenadas por
  //    afinidad y opiniones.
  //    Aquí sí entran las que contradicen (p. ej. la Alhambra completa para
  //    quien mira los Jardines sin Nazaríes): misma atracción va primero.
  const parecidasCiudad = puntuadas
    .filter((p) => p.categoria > 0 || p.atraccion > 0)
    .sort(
      (x, y) =>
        y.atraccion - x.atraccion ||
        y.temaTitulo - x.temaTitulo ||
        y.temaKeywords - x.temaKeywords ||
        y.categoria - x.categoria ||
        (y.a.numeroOpiniones ?? 0) - (x.a.numeroOpiniones ?? 0)
    );

  // 3) Último recurso: las mejor valoradas de la ciudad.
  if (casiIguales.length > 0) {
    return { tipo: "casiIguales", actividades: casiIguales.slice(0, limite).map((p) => p.a) };
  }
  if (parecidasCiudad.length > 0) {
    return { tipo: "ciudad", actividades: parecidasCiudad.slice(0, limite).map((p) => p.a) };
  }
  const mejorValoradas = [...puntuadas].sort(
    (x, y) => (y.a.numeroOpiniones ?? 0) - (x.a.numeroOpiniones ?? 0)
  );
  return { tipo: "mejorValoradas", actividades: mejorValoradas.slice(0, limite).map((p) => p.a) };
}


// =============================================================================
// Excursiones privadas para una guía
// -----------------------------------------------------------------------------
// Las guías traen la mayoría de las entradas y las privadas (venta directa)
// no recibían ningún enlace. Se eligen por tema (palabras en común entre la
// guía y la ficha, sin genéricas ni el nombre de la ciudad). En guías de
// itinerario o de «qué hacer / excursiones desde», si no hay coincidencia de
// tema se muestran las privadas mejor valoradas de la ciudad.
// =============================================================================

const GENERICAS_PRIVADA = new Set([
  "privado", "privada", "privados", "privadas", "private", "privat", "privaten",
  "privatführung", "solo", "grupo", "dias", "days", "tage", "horas", "hours",
  "real", "espana", "spain", "spanien", "carnaval", "guia", "guide", "guided",
  "oficial", "official", "offiziellen", "local", "lokal",
]);

const RE_GUIA_EXCURSIONES = /(escapadas|excursiones|day-trips|ausfluege)/;

const RE_GUIA_GENERAL =
  /(-en-\d|-in-\d|dias|days|tage|que-ver|que-hacer|things-to-do|escapadas|excursiones|day-trips|ausfluege|sehenswuerdigkeiten|was-tun)/;

export function obtenerPrivadasParaGuia(
  idioma: Idioma,
  ciudad: string,
  guia: GuiaReferencia,
  limite: number = 3,
  minimoPuntos: number = 1
): ActividadListItem[] {
  const yaEnlazadas = new Set(guia.actividades ?? []);
  // Los viajes de varios días no encajan como plan dentro de una guía de ciudad.
  const UN_DIA_MINUTOS = 14 * 60;
  const privadas = obtenerListaActividadesPorCiudad(idioma, ciudad).filter(
    (a) =>
      a.privada === true &&
      !yaEnlazadas.has(a.slugs?.es ?? a.slug) &&
      (a.duracionMinutos ?? 0) <= UN_DIA_MINUTOS &&
      !/\d+\s*(días|dias|days|tage)\b/i.test(a.duracion ?? "")
  );
  if (privadas.length === 0) return [];

  const limpiar = (s: Set<string>) =>
    new Set(Array.from(s).filter((t) => !GENERICAS_PRIVADA.has(t)));
  const tokensGuia = limpiar(
    tokensTema([guia.slug.replace(/-/g, " "), guia.titulo, ...(guia.keywords ?? [])].join(" "), ciudad)
  );

  const puntuadas = privadas
    .map((a) => ({
      a,
      puntos: comunes(
        tokensGuia,
        limpiar(
          tokensTema(
            [a.slug.replace(/-/g, " "), a.titulo, ...(a.atraccionesRelacionadas ?? [])].join(" "),
            ciudad
          )
        )
      ),
      bokun: a.proveedor === "bokun" ? 1 : 0,
      opiniones: a.numeroOpiniones ?? 0,
    }))
    .sort(
      (x, y) =>
        y.puntos - x.puntos ||
        y.bokun - x.bokun ||
        y.opiniones - x.opiniones ||
        Number(y.a.destacada ?? false) - Number(x.a.destacada ?? false)
    );

  const porTema = puntuadas.filter((x) => x.puntos >= minimoPuntos);
  if (porTema.length > 0) return porTema.slice(0, limite).map(({ a }) => a);
  if (minimoPuntos > 1) return [];
  if (!RE_GUIA_GENERAL.test(guia.slug)) return [];
  // En una guía de escapadas solo tiene sentido ofrecer excursiones.
  const candidatas = RE_GUIA_EXCURSIONES.test(guia.slug)
    ? puntuadas.filter((x) => x.a.categoria === "excursionesDia")
    : puntuadas;
  return candidatas.slice(0, limite).map(({ a }) => a);
}
