/**
 * Tipos para landings SEM (Search Engine Marketing).
 *
 * Estas landings son páginas dedicadas a campañas de pago (Google Ads / Meta Ads).
 * Van con `noindex` para no competir con SEO orgánico.
 */

export type SemTour = {
  /** Slug interno único, kebab-case */
  id: string;
  /** Título visible en la tarjeta */
  titulo: string;
  /** Descripción corta, 1-2 líneas */
  descripcion: string;
  /** Operador o formato (ej: "Julià · Bus + guía bilingüe") */
  operador: string;
  /** Precio mínimo en EUR. Editar en frontmatter cuando cambie */
  precio_desde: number;
  /** Rating de 0 a 5 */
  rating: number;
  /** Número de reseñas verificadas */
  resenas: number;
  /** Product ID de Viator (ej: "2140JTEMA20") */
  viator_product_id: string;
  /** URL del producto en Viator (sin parámetros de afiliado) */
  viator_url: string;
  /** Imagen propia en /public/images/sem/toledo/ */
  imagen: string;
  /** Texto alt de la imagen para accesibilidad */
  imagen_alt: string;
  /** Categoría para el comparador rápido */
  categoria: 'medio-dia' | 'dia-completo' | 'combinada' | 'privada';
  /** Si es la ancla "Más reservado", se renderiza con borde sky-500 destacado */
  ancla?: boolean;
  /** Si es premium, se renderiza con borde amber sutil */
  premium?: boolean;
  /**
   * Slug de la ficha propia en `/ciudades/madrid/actividades/{slug}`.
   * Cuando existe, el CTA "Ver detalles" apunta a la ficha propia (Plan A).
   * Cuando no existe, fallback a Viator directo con tracking.
   */
  ficha_propia_slug?: string;
};

export type SemFAQ = {
  pregunta: string;
  respuesta: string;
};

export type SemTrustSignal = {
  texto: string;
};

export type SemGarantia = {
  icono: 'shield' | 'clock' | 'mobile' | 'headset';
  titulo: string;
  subtitulo: string;
};

export type SemLandingFrontmatter = {
  /** Slug del landing, debe coincidir con el nombre del fichero .md */
  slug: string;
  /** Si es false, la página devuelve 404 */
  publicada: boolean;

  /** H1 principal */
  titulo: string;
  /** Subtítulo bajo el h1 */
  subtitulo: string;

  /** Pill superior con prueba social masiva */
  prueba_social_titular: string;

  /** Banner azul "reserva sin riesgo" */
  banner_garantia: string;

  /** Meta title para <head> */
  meta_titulo: string;
  /** Meta description para <head> */
  meta_descripcion: string;

  /** 3 trust signals visibles bajo el h1 */
  trust_signals: SemTrustSignal[];

  /** 4 categorías para el comparador "¿Cuál te encaja?" */
  comparador: {
    titulo: string;
    categorias: {
      categoria: SemTour['categoria'];
      icono: 'clock' | 'sun' | 'map' | 'crown';
      label: string;
      precio_desde: number;
    }[];
  };

  /** Tours a mostrar en el grid */
  tours: SemTour[];

  /** 4 cards de garantías */
  garantias: {
    titulo: string;
    items: SemGarantia[];
  };

  /** FAQs colapsables orientadas a objeciones */
  faqs: {
    titulo: string;
    items: SemFAQ[];
  };

  /** CTA final oscuro de re-cierre */
  cta_final: {
    titulo: string;
    subtitulo: string;
    texto_boton: string;
  };

  /** Sticky CTA en móvil */
  sticky_cta: {
    label: string;
    texto_boton: string;
  };
};

export type SemLanding = SemLandingFrontmatter & {
  /** URL relativa, calculada */
  url: string;
};
