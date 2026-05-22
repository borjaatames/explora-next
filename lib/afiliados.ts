/**
 * Configuración centralizada de los 3 programas de afiliados con los
 * que trabajamos: Civitatis, GetYourGuide y Viator.
 *
 * Los IDs reales se cargan desde variables de entorno (.env.local) y
 * NUNCA se hardcodean en código fuente. Si una variable no está
 * definida, la URL se construye sin ID de afiliado (no rompe la web,
 * pero tampoco genera comisión).
 */

import { normalizarUrlGetYourGuide } from "./afiliados-gyg";
import { normalizarUrlViator } from "./afiliados-viator";

export type ProveedorActividad = "civitatis" | "getyourguide" | "viator";

export const PROVEEDORES_ACTIVOS: ProveedorActividad[] = [
  "civitatis",
  "getyourguide",
  "viator",
];

type ConfigProveedor = {
  /** Nombre comercial mostrado al usuario en la ficha. */
  nombre: string;
  /** True si está dado de alta y tiene ID configurado. */
  activo: boolean;
};

const CONFIG: Record<ProveedorActividad, ConfigProveedor> = {
  civitatis: {
    nombre: "Civitatis",
    activo: Boolean(process.env.AID_CIVITATIS),
  },
  getyourguide: {
    nombre: "GetYourGuide",
    activo: Boolean(process.env.AID_GETYOURGUIDE),
  },
  viator: {
    nombre: "Viator",
    activo: Boolean(process.env.AID_VIATOR_PID),
  },
};

/**
 * Devuelve el nombre comercial del proveedor para mostrar al usuario.
 */
export function nombreProveedor(proveedor: ProveedorActividad): string {
  return CONFIG[proveedor].nombre;
}

/**
 * Indica si el programa de afiliados de ese proveedor está activo
 * (es decir, tenemos su ID configurado en .env.local).
 */
export function proveedorActivo(proveedor: ProveedorActividad): boolean {
  return CONFIG[proveedor].activo;
}

/**
 * Construye la URL final de reserva añadiendo los parámetros de
 * afiliación correspondientes al proveedor.
 *
 * Acepta una URL "limpia" desde el .md (sin parámetros de afiliado)
 * y devuelve la URL con tu ID añadido. Respeta los parámetros que
 * ya pudieran existir en la URL original.
 *
 * Si el proveedor no está activo (no hay ID en .env.local), devuelve
 * la URL tal cual sin tracking. La web sigue funcionando.
 *
 * `idioma` (por defecto "es") fija el idioma del sitio del proveedor:
 * para GetYourGuide fuerza el segmento de locale en la ruta (en-us /
 * es-es) y normaliza el partner_id. Sin él, GYG cae a geolocalización y
 * sirve español a visitantes de páginas en inglés.
 */
export function construirUrlReserva(
  proveedor: ProveedorActividad,
  urlBase: string,
  idioma: "es" | "en" = "es"
): string {
  if (!urlBase) return "";

  switch (proveedor) {
    case "civitatis":
      return construirUrlCivitatis(urlBase);
    case "getyourguide":
      return normalizarUrlGetYourGuide(urlBase, idioma);
    case "viator":
      return construirUrlViator(normalizarUrlViator(urlBase, idioma));
    default:
      return urlBase;
  }
}

/* ─────────────────────────────────────────────────────────
   Constructores específicos de cada proveedor
   ───────────────────────────────────────────────────────── */

/**
 * Civitatis: añade ?aid=XXXX a la URL.
 * Ejemplo: civitatis.com/es/madrid/tour/?aid=12345
 */
function construirUrlCivitatis(urlBase: string): string {
  const aid = process.env.AID_CIVITATIS;
  if (!aid) return urlBase;
  return añadirParametros(urlBase, { aid });
}

/**
 * Viator: añade ?pid=XXX&mcid=XX&medium=link a la URL.
 * Los 3 parámetros son fijos por cuenta y vienen de .env.local.
 */
function construirUrlViator(urlBase: string): string {
  const pid = process.env.AID_VIATOR_PID;
  const mcid = process.env.AID_VIATOR_MCID;
  const medium = process.env.AID_VIATOR_MEDIUM || "link";

  if (!pid) return urlBase;

  const params: Record<string, string> = { pid, medium };
  if (mcid) params.mcid = mcid;

  return añadirParametros(urlBase, params);
}

/* ─────────────────────────────────────────────────────────
   Helper genérico
   ───────────────────────────────────────────────────────── */

/**
 * Añade parámetros de query string a una URL respetando los que
 * ya pudiera tener. Si la URL ya contiene un parámetro con el
 * mismo nombre, NO lo sobrescribe (la URL del .md tiene prioridad).
 */
function añadirParametros(
  urlBase: string,
  params: Record<string, string>
): string {
  try {
    const url = new URL(urlBase);
    for (const [clave, valor] of Object.entries(params)) {
      if (!url.searchParams.has(clave)) {
        url.searchParams.set(clave, valor);
      }
    }
    return url.toString();
  } catch {
    // Si la URL no es válida, devolverla sin tocar.
    return urlBase;
  }
}
