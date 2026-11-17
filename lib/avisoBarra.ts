import type { Idioma } from "@/lib/i18n/types";

/**
 * Versión corta (≤24 caracteres) del aviso de reserva para la barra fija del
 * móvil, donde solo cabe una línea junto al precio. El aviso completo sigue
 * en la ficha. Si el aviso no encaja en ningún patrón y es largo, devuelve
 * null y la barra enseña su segunda línea normal (nota y duración).
 */

// En un móvil de 375 px caben unos 24 caracteres junto al precio y los botones.
const MAX = 24;

const MESES: Record<Idioma, string[]> = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
};

const TEXTOS: Record<
  Idioma,
  {
    cola: string;
    feria: string;
    semanaSanta: string;
    mediadosDic: string;
    agota: string;
    fechasDesde: (mes: string, anio: string) => string;
    temporada: string;
    precioPor: string;
    sinIdioma: string;
    idiomaNoGarantizado: string;
  }
> = {
  es: {
    cola: "Colas de más de 2 h",
    feria: "Solo en Feria de Abril",
    semanaSanta: "Para Semana Santa",
    mediadosDic: "Fechas desde mitad dic.",
    agota: "Se agota pronto",
    fechasDesde: (m, a) => `Fechas desde ${m} ${a}`,
    temporada: "Actividad de temporada",
    precioPor: "Precio no por persona",
    sinIdioma: "Guía no en español",
    idiomaNoGarantizado: "Español no garantizado",
  },
  en: {
    cola: "Queues of 2+ hours",
    feria: "Only during April Fair",
    semanaSanta: "Designed for Holy Week",
    mediadosDic: "Dates from mid-December",
    agota: "Sells out fast",
    fechasDesde: (m, a) => `Dates from ${m} ${a}`,
    temporada: "Seasonal activity",
    precioPor: "Price not per person",
    sinIdioma: "No live guide in English",
    idiomaNoGarantizado: "English not guaranteed",
  },
  de: {
    cola: "Lange Kassenschlangen",
    feria: "Nur zur Feria de Abril",
    semanaSanta: "Für die Karwoche gedacht",
    mediadosDic: "Termine ab Mitte Dez.",
    agota: "Schnell ausverkauft",
    fechasDesde: (m, a) => `Termine ab ${m} ${a}`,
    temporada: "Saisonale Aktivität",
    precioPor: "Preis nicht pro Person",
    sinIdioma: "Ohne deutsche Erklärung",
    idiomaNoGarantizado: "Deutsch nicht garantiert",
  },
  fr: {
    cola: "Longues files au guichet",
    feria: "Uniquement à la Feria",
    semanaSanta: "Pour la Semaine sainte",
    mediadosDic: "Dates dès mi-décembre",
    agota: "Part très vite",
    fechasDesde: (m, a) => `Dates dès ${m} ${a}`,
    temporada: "Activité saisonnière",
    precioPor: "Prix pas par personne",
    sinIdioma: "Pas de guide en français",
    idiomaNoGarantizado: "Français non garanti",
  },
  it: {
    cola: "Lunghe code alla cassa",
    feria: "Solo durante la Feria",
    semanaSanta: "Per la Settimana Santa",
    mediadosDic: "Date da metà dicembre",
    agota: "Si esaurisce presto",
    fechasDesde: (m, a) => `Date da ${m} ${a}`,
    temporada: "Attività stagionale",
    precioPor: "Prezzo non a persona",
    sinIdioma: "Niente guida in italiano",
    idiomaNoGarantizado: "Italiano non garantito",
  },
  pt: {
    cola: "Longas filas à entrada",
    feria: "Só na Feira de Abril",
    semanaSanta: "Para a Semana Santa",
    mediadosDic: "Datas desde meados dez.",
    agota: "Esgota depressa",
    fechasDesde: (m, a) => `Datas desde ${m} ${a}`,
    temporada: "Atividade sazonal",
    precioPor: "Preço não é por pessoa",
    sinIdioma: "Sem guia em português",
    idiomaNoGarantizado: "Português não garantido",
  },
};

const RE_AGOTA =
  /se agota|se agotan|sells? out|ausverkauft|s'épuis|épuisés|affiche complet|partent en quelques|si esauris|esgota/i;
const RE_COLA = /cola de taquilla|queue tops/i;
const RE_FERIA = /feria de abril|feira de abril|april fair/i;
const RE_SEMANA_SANTA = /semana santa|holy week/i;
const RE_MEDIADOS_DIC = /mediados de diciembre|mid-december/i;
const RE_TEMPORADA =
  /temporada|seasonal|season|saison|stagion|sazonal|segelsaison|navegación|navigation|navigazione/i;
const RE_PRECIO_POR =
  /(precio|price|preis|prix|prezzo|preço)[^.:;]{0,40}\b(por|per|pro|par)\s+(buggy|moto|jet|quad|atv|tuk|grupo|group|gruppo|groupe|gruppe|privater|privado|private|privé|mota)/i;
const RE_NO_GARANTIZADO =
  /nicht (bestätigt|garantiert|zugesagt)|n'est pas garanti|non (è )?garantit|não é garantid|nur auf anfrage|solo su richiesta|selon le jour|je nach tag|nur an manchen|que certains jours|dépend du guide|hängt davon ab|ne comptez pas|non sono garantite|nicht angegeben|nennt die sprachen|n'indique pas|non indica|su richiesta|uniquement du|\bkein deutsch\b|vorher anfragen|a seconda del gruppo/i;
const RE_SIN_IDIOMA =
  /nicht (auf )?deutsch|keine erklärungen auf deutsch|pas d'explications en français|pas de version en français|n'est pas donnée en français|pas en fra|non ci sono spiegazioni in italiano|non è in italiano|non italiano|não há explicações em português|in english you get|nicht deutsch|auf deutsch gibt es (an bord )?nicht|auf deutsch bekommst du|en français, les explications|auf deutsch gibt es die erklärungen nur|in italiano avrai|em português terá/i;
const RE_POSITIVO = /auch auf deutsch verfügbar/i;

function mesYAnio(idioma: Idioma, texto: string): { mes: string; anio: string } | null {
  const anio = texto.match(/\b20\d\d\b/)?.[0];
  if (!anio) return null;
  // Todas las listas: un aviso puede nombrar el mes en minúscula o mayúscula.
  for (const [i, nombre] of MESES[idioma].entries()) {
    if (new RegExp(`\\b${nombre}\\b`, "i").test(texto)) {
      return { mes: MESES[idioma][i], anio };
    }
  }
  return null;
}

export function avisoBarra(idioma: Idioma, aviso: string | undefined): string | null {
  if (!aviso) return null;
  const texto = aviso.trim();
  if (texto.length <= MAX) return texto;
  const t = TEXTOS[idioma];
  if (RE_FERIA.test(texto)) return t.feria;
  if (RE_SEMANA_SANTA.test(texto)) return t.semanaSanta;
  if (RE_MEDIADOS_DIC.test(texto)) return t.mediadosDic;
  if (RE_COLA.test(texto)) return t.cola;
  if (RE_AGOTA.test(texto)) return t.agota;
  if (RE_TEMPORADA.test(texto)) {
    const fecha = mesYAnio(idioma, texto);
    if (!fecha) return t.temporada;
    const largo = t.fechasDesde(fecha.mes, fecha.anio);
    return largo.length <= MAX ? largo : t.fechasDesde(`${fecha.mes.slice(0, 3)}.`, fecha.anio);
  }
  if (RE_PRECIO_POR.test(texto)) return t.precioPor;
  if (RE_POSITIVO.test(texto)) return null;
  if (idioma !== "es" && RE_NO_GARANTIZADO.test(texto)) return t.idiomaNoGarantizado;
  if (idioma !== "es" && RE_SIN_IDIOMA.test(texto)) return t.sinIdioma;
  return null;
}
