import type { PuntoEncuentroDetallado } from "@/lib/actividades";

type Props = {
  punto: PuntoEncuentroDetallado;
};

/**
 * Bloque del punto de encuentro con mapa interactivo OpenStreetMap +
 * descripción visual del guía + botón para abrir Google Maps.
 *
 * Estrategia (mayo 2026):
 *  - El MAPA usa el iframe oficial de openstreetmap.org/export/embed.html.
 *    No requiere API key, no tiene límites, está mantenido por la
 *    Fundación OSM y es interactivo (zoom + arrastrar).
 *  - El BOTÓN abre Google Maps (que es donde el usuario querrá navegar
 *    desde su móvil con la app oficial de Google instalada).
 *
 * Notas técnicas:
 *  - El bbox del iframe se calcula con un delta proporcional al zoom
 *    pedido (zoom alto → bbox pequeño). Es una aproximación pragmática:
 *    OSM no acepta zoom directo en el embed, solo bounding box.
 *  - El marker se pinta en las coordenadas exactas con el parámetro
 *    `marker=lat,lon`.
 *  - loading="lazy" para no penalizar el LCP.
 *
 * Si la actividad no tiene coordenadas, se muestra solo el texto
 * y el botón con búsqueda por dirección. Si no tiene texto, no se
 * renderiza nada.
 */
export default function MapaPuntoEncuentro({ punto }: Props) {
  if (!punto.texto) return null;

  const tieneCoordenadas =
    typeof punto.latitud === "number" && typeof punto.longitud === "number";

  // Cálculo del bounding box para el iframe de OSM.
  // OSM embed espera: bbox=west,south,east,north (lon_min,lat_min,lon_max,lat_max)
  // Convertimos el zoom (10-19) a un delta angular aproximado.
  // zoom 17 (default) → delta ≈ 0.003° (≈300m de lado en Madrid)
  const mapaSrc = tieneCoordenadas ? construirUrlEmbed(punto) : null;

  // Para abrir Google Maps preferimos coordenadas (más precisas) y, si
  // no hay, hacemos búsqueda por texto del punto de encuentro.
  const urlGoogleMaps = tieneCoordenadas
    ? `https://www.google.com/maps/search/?api=1&query=${punto.latitud},${punto.longitud}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(punto.texto)}`;

  return (
    <section
      aria-labelledby="punto-encuentro-titulo"
      className="bg-white border border-slate-200 rounded-lg overflow-hidden"
    >
      <div className="p-6 md:p-7 border-b border-slate-200">
        <h2
          id="punto-encuentro-titulo"
          className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-2"
        >
          Punto de encuentro
        </h2>
        <p className="text-slate-800 leading-relaxed">{punto.texto}</p>
        {punto.descripcionGuia && (
          <p className="mt-3 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
            <span aria-hidden="true" className="text-amber-500 mr-1">
              ★
            </span>
            {punto.descripcionGuia}
          </p>
        )}
      </div>

      {mapaSrc && (
        <div className="relative w-full aspect-[2/1] bg-slate-100">
          <iframe
            src={mapaSrc}
            title={`Mapa de ${punto.texto}`}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <div className="p-4 border-t border-slate-200">
        <a
          href={urlGoogleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-md px-4 py-2.5 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
        >
          Abrir en Google Maps ↗
        </a>
      </div>
    </section>
  );
}

/**
 * Construye la URL del iframe oficial de OSM con bounding box y marker.
 * El zoom se traduce a un delta angular aproximado (no es lineal pero
 * es suficiente para puntos de encuentro turísticos).
 */
function construirUrlEmbed(punto: PuntoEncuentroDetallado): string {
  const lat = punto.latitud as number;
  const lon = punto.longitud as number;
  const zoom = punto.zoom ?? 17;

  // Tabla de deltas por zoom: a mayor zoom, menor delta.
  // Calibrado para que zoom=17 muestre ~2 manzanas alrededor del punto.
  const deltasPorZoom: Record<number, number> = {
    13: 0.04,
    14: 0.02,
    15: 0.01,
    16: 0.005,
    17: 0.003,
    18: 0.0015,
    19: 0.0008,
  };
  const delta = deltasPorZoom[zoom] ?? 0.003;

  const west = lon - delta;
  const south = lat - delta / 2;
  const east = lon + delta;
  const north = lat + delta / 2;

  const bbox = `${west},${south},${east},${north}`;
  const marker = `${lat},${lon}`;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
}
