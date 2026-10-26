import type { ActividadListItem } from "@/lib/actividades";
import type { ActividadCardData } from "@/components/ciudad/ActividadesFiltradas";

/** Datos mínimos de una actividad para pintar su tarjeta en el cliente. */
export function aCardData(a: ActividadListItem): ActividadCardData {
  return {
    slug: a.slug,
    titulo: a.titulo,
    url: a.url,
    imagen: a.imagen,
    imagenAlt: a.imagenAlt,
    duracion: a.duracion,
    precioDesde: a.precioDesde,
    moneda: a.moneda || "EUR",
    ratingProveedor: a.ratingProveedor,
    numeroOpiniones: a.numeroOpiniones,
    cancelacionGratuita: a.cancelacionGratuita,
    atraccionesRelacionadas: a.atraccionesRelacionadas ?? [],
    proveedor: a.proveedor,
    categoria: a.categoria,
    privada: a.privada === true,
    destacada: a.destacada ?? false,
  };
}
