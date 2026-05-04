import type { InformacionImportante as InfoTipo } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";

type Props = {
  idioma: Idioma;
  info?: InfoTipo;
};

type Columna = {
  titulo: string;
  items: string[];
};

type Strings = {
  titulo: string;
  queTraer: string;
  noAptoPara: string;
  aTenerEnCuenta: string;
};

const DICT: Record<"es" | "en", Strings> = {
  es: {
    titulo: "Información importante",
    queTraer: "Qué traer",
    noAptoPara: "No apto para",
    aTenerEnCuenta: "A tener en cuenta",
  },
  en: {
    titulo: "Good to know",
    queTraer: "What to bring",
    noAptoPara: "Not suitable for",
    aTenerEnCuenta: "Things to keep in mind",
  },
};

function dictFor(idioma: Idioma): Strings {
  if (idioma === "es") return DICT.es;
  return DICT.en;
}

/**
 * Bloque "Información importante" — 3 columnas inspiradas en GetYourGuide:
 *   - Qué traer
 *   - No apto para
 *   - A tener en cuenta
 *
 * Las columnas vacías se omiten, de forma que el bloque puede mostrarse
 * con 1, 2 o 3 columnas según la actividad. Si las tres están vacías,
 * el componente devuelve null.
 */
export default function InformacionImportante({ idioma, info }: Props) {
  if (!info) return null;
  const t = dictFor(idioma);

  const columnas: Columna[] = [];

  if (info.queTraer && info.queTraer.length > 0) {
    columnas.push({ titulo: t.queTraer, items: info.queTraer });
  }
  if (info.noAptoPara && info.noAptoPara.length > 0) {
    columnas.push({ titulo: t.noAptoPara, items: info.noAptoPara });
  }
  if (info.aTenerEnCuenta && info.aTenerEnCuenta.length > 0) {
    columnas.push({ titulo: t.aTenerEnCuenta, items: info.aTenerEnCuenta });
  }

  if (columnas.length === 0) return null;

  // El número de columnas en el grid se ajusta al contenido real, así
  // un bloque con solo 2 columnas no deja un hueco vacío a la derecha.
  const gridCols =
    columnas.length === 1
      ? "md:grid-cols-1"
      : columnas.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <section
      aria-labelledby="info-importante-titulo"
      className="bg-white border border-slate-200 rounded-lg p-6 md:p-7"
    >
      <h2
        id="info-importante-titulo"
        className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-5"
      >
        {t.titulo}
      </h2>
      <div className={`grid grid-cols-1 ${gridCols} gap-6 md:gap-8`}>
        {columnas.map((col) => (
          <div key={col.titulo}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              {col.titulo}
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {col.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="text-slate-400 mt-1.5 leading-none"
                  >
                    •
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
