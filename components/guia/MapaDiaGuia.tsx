"use client";

import { useEffect, useRef, useState } from "react";
import type { ParadaMapa } from "@/lib/mapasGuias";

type IdiomaMapa = "es" | "en" | "de";

type Props = {
  dia: number;
  paradas: ParadaMapa[];
  idioma: IdiomaMapa;
};

/* Tipos mínimos de Leaflet: la librería se sirve desde /vendor y solo se
   descarga cuando el lector abre un mapa (o se acerca a él en escritorio). */
type LatLng = [number, number];
type CapaLeaflet = { addTo: (m: MapaLeaflet) => CapaLeaflet };
type MarcadorLeaflet = CapaLeaflet & { bindPopup: (html: string) => MarcadorLeaflet };
type MapaLeaflet = {
  fitBounds: (b: LatLng[], o: { padding: [number, number]; maxZoom: number }) => void;
  remove: () => void;
};
type Leaflet = {
  map: (el: HTMLElement, o: { scrollWheelZoom: boolean }) => MapaLeaflet;
  tileLayer: (url: string, o: { maxZoom: number; attribution: string }) => CapaLeaflet;
  marker: (p: LatLng, o: { icon: unknown; title: string; alt: string }) => MarcadorLeaflet;
  divIcon: (o: { html: string; className: string; iconSize: [number, number]; iconAnchor: [number, number] }) => unknown;
  polyline: (p: LatLng[], o: { color: string; weight: number; opacity: number; dashArray: string }) => CapaLeaflet;
};

const BASE = "/vendor/leaflet-1.9.4";
let cargaLeaflet: Promise<Leaflet> | null = null;

function cargarLeaflet(): Promise<Leaflet> {
  const w = window as unknown as { L?: Leaflet };
  if (w.L) return Promise.resolve(w.L);
  if (cargaLeaflet) return cargaLeaflet;
  cargaLeaflet = new Promise<Leaflet>((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${BASE}/leaflet.css`;
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = `${BASE}/leaflet.js`;
    js.async = true;
    js.onload = () => (w.L ? resolve(w.L) : reject(new Error("Leaflet no disponible")));
    js.onerror = () => {
      cargaLeaflet = null;
      reject(new Error("No se pudo cargar Leaflet"));
    };
    document.head.appendChild(js);
  });
  return cargaLeaflet;
}

const TEXTOS: Record<IdiomaMapa, {
  ver: (d: number, n: number) => string;
  ocultar: (d: number) => string;
  aria: (d: number) => string;
  google: (d: number) => string;
  error: string;
}> = {
  es: {
    ver: (d, n) => `Ver mapa del día ${d} (${n} ${n === 1 ? "parada" : "paradas"})`,
    ocultar: (d) => `Ocultar mapa del día ${d}`,
    aria: (d) => `Mapa del día ${d}`,
    google: (d) => `Abrir el día ${d} en Google Maps`,
    error: "No se ha podido cargar el mapa.",
  },
  en: {
    ver: (d, n) => `Show day ${d} map (${n} ${n === 1 ? "stop" : "stops"})`,
    ocultar: (d) => `Hide day ${d} map`,
    aria: (d) => `Day ${d} map`,
    google: (d) => `Open day ${d} in Google Maps`,
    error: "The map could not be loaded.",
  },
  de: {
    ver: (d, n) => `Karte für Tag ${d} anzeigen (${n} ${n === 1 ? "Station" : "Stationen"})`,
    ocultar: (d) => `Karte für Tag ${d} ausblenden`,
    aria: (d) => `Karte für Tag ${d}`,
    google: (d) => `Tag ${d} in Google Maps öffnen`,
    error: "Die Karte konnte nicht geladen werden.",
  },
};

/** `dia: 0` es el mapa único de una guía de un día: textos de «ruta». */
const TEXTOS_RUTA: Record<IdiomaMapa, typeof TEXTOS.es> = {
  es: {
    ver: (_d, n) => `Ver el mapa de la ruta (${n} ${n === 1 ? "parada" : "paradas"})`,
    ocultar: () => "Ocultar el mapa de la ruta",
    aria: () => "Mapa de la ruta",
    google: () => "Abrir la ruta en Google Maps",
    error: TEXTOS.es.error,
  },
  en: {
    ver: (_d, n) => `Show the route map (${n} ${n === 1 ? "stop" : "stops"})`,
    ocultar: () => "Hide the route map",
    aria: () => "Route map",
    google: () => "Open the route in Google Maps",
    error: TEXTOS.en.error,
  },
  de: {
    ver: (_d, n) => `Karte der Route anzeigen (${n} ${n === 1 ? "Station" : "Stationen"})`,
    ocultar: () => "Karte der Route ausblenden",
    aria: () => "Karte der Route",
    google: () => "Route in Google Maps öffnen",
    error: TEXTOS.de.error,
  },
};

function urlGoogleMaps(paradas: ParadaMapa[]): string {
  const punto = (p: ParadaMapa) => `${p.lat},${p.lng}`;
  if (paradas.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${punto(paradas[0])}`;
  }
  const params = new URLSearchParams({
    api: "1",
    origin: punto(paradas[0]),
    destination: punto(paradas[paradas.length - 1]),
    travelmode: "walking",
  });
  const intermedias = paradas.slice(1, -1).map(punto).join("|");
  if (intermedias) params.set("waypoints", intermedias);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function escapar(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Escritorio: el mapa se abre solo al acercarse; móvil: tras pulsar el botón. */
const MQ_ESCRITORIO = "(min-width: 1024px)";

export default function MapaDiaGuia({ dia, paradas, idioma }: Props) {
  const t = dia === 0 ? TEXTOS_RUTA[idioma] : TEXTOS[idioma];
  const bloqueRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<HTMLDivElement>(null);
  const [abierto, setAbierto] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (abierto || !window.matchMedia(MQ_ESCRITORIO).matches) return;
    const nodo = bloqueRef.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          setAbierto(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    obs.observe(nodo);
    return () => obs.disconnect();
  }, [abierto]);

  useEffect(() => {
    if (!abierto || !mapaRef.current) return;
    let mapa: MapaLeaflet | null = null;
    let cancelado = false;
    cargarLeaflet()
      .then((L) => {
        if (cancelado || !mapaRef.current) return;
        mapa = L.map(mapaRef.current, { scrollWheelZoom: false });
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapa);
        const puntos: LatLng[] = paradas.map((p) => [p.lat, p.lng]);
        if (puntos.length > 1) {
          L.polyline(puntos, { color: "#1F3A6E", weight: 3, opacity: 0.5, dashArray: "6 6" }).addTo(mapa);
        }
        paradas.forEach((p, i) => {
          const nombre = p.nombre[idioma];
          const icono = L.divIcon({
            html: `<span class="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-anil-500 text-white text-sm font-bold border-2 border-white shadow-md">${i + 1}</span>`,
            className: "mapa-dia-icono",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });
          L.marker([p.lat, p.lng], { icon: icono, title: nombre, alt: `${i + 1}. ${nombre}` })
            .bindPopup(`<strong>${i + 1}.</strong> ${escapar(nombre)}`)
            .addTo(mapa as MapaLeaflet);
        });
        mapa.fitBounds(puntos, { padding: [30, 30], maxZoom: 16 });
      })
      .catch(() => setError(true));
    return () => {
      cancelado = true;
      mapa?.remove();
    };
  }, [abierto, paradas, idioma]);

  return (
    <div ref={bloqueRef} className="not-prose my-6">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        className="lg:hidden flex w-full items-center justify-between min-h-[48px] px-4 rounded-lg border border-piedra-300 bg-white text-anil-700 font-semibold transition-colors hover:border-anil-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
      >
        <span>{abierto ? t.ocultar(dia) : t.ver(dia, paradas.length)}</span>
        <span aria-hidden="true">{abierto ? "▲" : "▼"}</span>
      </button>

      {abierto && (
        <div className="mt-3 lg:mt-0">
          {error ? (
            <p className="text-sm text-piedra-600">{t.error}</p>
          ) : (
            <div
              ref={mapaRef}
              role="region"
              aria-label={t.aria(dia)}
              className="w-full aspect-[4/3] lg:aspect-[16/9] rounded-xl border border-piedra-200 bg-piedra-100 overflow-hidden z-0"
            />
          )}
          <a
            href={urlGoogleMaps(paradas)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors"
          >
            {t.google(dia)} →
          </a>
        </div>
      )}

      {!abierto && (
        <div className="hidden lg:block w-full aspect-[16/9] rounded-xl border border-piedra-200 bg-piedra-100" aria-hidden="true" />
      )}
    </div>
  );
}
