/**
 * Cliente SERVER-ONLY de la API de afiliado de Viator.
 *
 * ⚠️ La API key vive SOLO en el servidor (`process.env.VIATOR_API_KEY`).
 * Este módulo NO debe importarse nunca desde un Client Component: la clave
 * jamás puede llegar al navegador. Úsalo desde Server Components o rutas
 * de API (route handlers).
 *
 * Si no hay key configurada o la API falla, todas las funciones devuelven
 * `null` y la UI debe caer a su comportamiento orientativo (calendario
 * decorativo). Así la web nunca se rompe por la API.
 *
 * Variables de entorno (en .env.local, NUNCA en git):
 *   VIATOR_API_KEY   = clave de afiliado (sandbox para desarrollo; producción para datos reales)
 *   VIATOR_API_BASE  = (opcional) base URL. Por defecto sandbox.
 *                      Producción: https://api.viator.com/partner
 *                      Sandbox:    https://api.sandbox.viator.com/partner
 */

const BASE = process.env.VIATOR_API_BASE || "https://api.sandbox.viator.com/partner";
const KEY = process.env.VIATOR_API_KEY;

export type DisponibilidadViator = {
  /** Precio "desde" por persona, en la divisa de la cuenta (EUR). */
  precioDesde: number | null;
  moneda: string | null;
  /** Fechas reservables (YYYY-MM-DD). Vacío si no se pudo determinar. */
  fechasDisponibles: string[];
  /** false si el producto está descatalogado / sin disponibilidad. */
  activa: boolean;
};

function headers(idioma: "es" | "en"): HeadersInit {
  return {
    "exp-api-key": KEY as string,
    Accept: "application/json;version=2.0",
    "Accept-Language": idioma === "es" ? "es-ES" : "en-US",
  };
}

/**
 * Devuelve precio "desde" + estado de un producto Viator (CHECK 1 y 2).
 * Usa /products/{product-code}. `null` si no hay key o falla la API.
 */
export async function obtenerProductoViator(
  codigo: string,
  idioma: "es" | "en" = "es",
): Promise<DisponibilidadViator | null> {
  if (!KEY || !codigo) return null;
  try {
    const r = await fetch(`${BASE}/products/${encodeURIComponent(codigo)}`, {
      headers: headers(idioma),
      next: { revalidate: 60 * 60 * 12 }, // cachea 12 h
    });
    if (r.status === 404) return { precioDesde: null, moneda: null, fechasDisponibles: [], activa: false };
    if (!r.ok) return null;
    const data: unknown = await r.json();
    return normalizarProducto(data);
  } catch {
    return null;
  }
}

/**
 * Devuelve las fechas reservables de un producto (para el calendario).
 * Usa /availability/schedules/{product-code}. `null` si no hay key o falla.
 *
 * TODO(confirmar-forma): el mapeo exacto de `bookableItems`/`seasons`/
 * `pricingRecords` se ajusta tras ver una respuesta real (sandbox basta).
 */
export async function obtenerHorariosViator(
  codigo: string,
  idioma: "es" | "en" = "es",
): Promise<DisponibilidadViator | null> {
  if (!KEY || !codigo) return null;
  try {
    const r = await fetch(`${BASE}/availability/schedules/${encodeURIComponent(codigo)}`, {
      headers: headers(idioma),
      next: { revalidate: 60 * 60 * 12 },
    });
    if (r.status === 404) return { precioDesde: null, moneda: null, fechasDisponibles: [], activa: false };
    if (!r.ok) return null;
    const data: unknown = await r.json();
    return normalizarHorarios(data);
  } catch {
    return null;
  }
}

/**
 * Comprueba en tiempo real el precio EXACTO de una fecha + nº de personas
 * (CHECK del calendario "completo"). Usa POST /availability/check.
 * Devuelve `null` si no hay key o falla; `{disponible:false}` si esa
 * combinación no es reservable.
 *
 * Forma de respuesta (Viator Partner API v2.0, /availability/check):
 *   {
 *     "available": true,
 *     "totalPrice": { "price": {
 *         "recommendedRetailPrice": 264.32,   ← lo que paga el cliente (PVP)
 *         "partnerNetPrice": 224.67,
 *         "bookingFee": 0.0,
 *         "partnerTotalPrice": 224.67
 *     } },
 *     "currency": "EUR",
 *     "lineItems": [ { "ageBand": "ADULT", "numberOfTravelers": 2, ... } ]
 *   }
 * Mostramos al cliente el `recommendedRetailPrice` (PVP), nunca el neto.
 */
export async function comprobarDisponibilidadViator(
  codigo: string,
  fecha: string,
  adultos: number,
  ninos: number,
  idioma: "es" | "en" = "es",
): Promise<{ disponible: boolean; precioTotal: number | null; moneda: string | null } | null> {
  if (!KEY || !codigo || !fecha) return null;
  const paxMix: Array<{ ageBand: string; numberOfTravelers: number }> = [];
  if (adultos > 0) paxMix.push({ ageBand: "ADULT", numberOfTravelers: adultos });
  if (ninos > 0) paxMix.push({ ageBand: "CHILD", numberOfTravelers: ninos });
  try {
    const r = await fetch(`${BASE}/availability/check`, {
      method: "POST",
      headers: { ...headers(idioma), "Content-Type": "application/json" },
      body: JSON.stringify({ productCode: codigo, travelDate: fecha, paxMix }),
      cache: "no-store",
    });
    if (!r.ok) return null;
    const d = (await r.json()) as Record<string, any>;

    // El precio que paga el cliente es el PVP (recommendedRetailPrice).
    // Fallbacks defensivos por si la cuenta devuelve otra forma.
    const price = d.totalPrice?.price ?? d.totalPrice ?? {};
    const precioTotal = num(
      price.recommendedRetailPrice ??
        price.partnerTotalPrice ??
        price.price ??
        d.recommendedRetailPrice,
    );

    // `available` es el campo canónico de v2.0. Si no viniera pero sí hay
    // precio, lo tratamos como disponible; solo `available:false` lo niega.
    const disponible =
      d.available === true || (d.available == null && precioTotal != null);

    const moneda = (d.currency ?? price.currency ?? null) as string | null;
    return { disponible, precioTotal, moneda };
  } catch {
    return null;
  }
}

/* ── Normalizadores (defensivos; se afinan con la respuesta real) ────────── */

function num(v: unknown): number | null {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
}

function normalizarProducto(data: unknown): DisponibilidadViator {
  const d = (data ?? {}) as Record<string, any>;
  // /products devuelve `status` (ACTIVE/INACTIVE) pero NO el precio "desde":
  // el precio se obtiene de /availability/schedules. Aquí solo el estado (CHECK 2).
  const activa = String(d.status ?? "").toUpperCase() === "ACTIVE";
  return { precioDesde: null, moneda: null, fechasDisponibles: [], activa };
}

function normalizarHorarios(data: unknown): DisponibilidadViator {
  const d = (data ?? {}) as Record<string, any>;
  // Forma real confirmada: { currency, summary: { fromPrice }, bookableItems: [...] }
  const precioDesde = num(d.summary?.fromPrice);
  const moneda = (d.currency ?? null) as string | null;
  const items: any[] = Array.isArray(d.bookableItems) ? d.bookableItems : [];
  return { precioDesde, moneda, fechasDisponibles: [], activa: items.length > 0 };
}
