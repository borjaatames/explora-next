import type { InformacionImportante as InfoTipo } from "@/lib/actividades";

type Props = {
  info?: InfoTipo;
};

type Columna = {
  titulo: string;
  items: string[];
};

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
export default function InformacionImportante({ info }: Props) {
  if (!info) return null;

  const columnas: Columna[] = [];

  if (info.queTraer && info.queTraer.length > 0) {
    columnas.push({ titulo: "Qué traer", items: info.queTraer });
  }
  if (info.noAptoPara && info.noAptoPara.length > 0) {
    columnas.push({ titulo: "No apto para", items: info.noAptoPara });
  }
  if (info.aTenerEnCuenta && info.aTenerEnCuenta.length > 0) {
    columnas.push({ titulo: "A tener en cuenta", items: info.aTenerEnCuenta });
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
        Información importante
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
