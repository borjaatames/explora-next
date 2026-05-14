/**
 * Tipos para landings SEM (Search Engine Marketing).
 *
 * Estas landings son páginas dedicadas a campañas de pago (Google Ads / Meta Ads).
 * Van con `noindex` para no competir con SEO orgánico.
 */

/** Idioma de una landing SEM. Solo activos los dos primeros. */
export type SemIdioma = 'es' | 'en';

/**
 * Proveedor afiliado del tour. Solo `viator` y `getyourguide` activos.
 * Por defecto `viator` (retrocompatibilidad con Toledo SEM).
 */
export type SemProveedor = 'viator' | 'getyourguide';

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

  // ─── Campos legacy Viator (retrocompatibilidad Toledo SEM) ─────────────
  // Pasan a opcionales para soportar tours GetYourGuide.
  // Para tours Viator clásicos, ambos deben estar presentes.
  /** Product ID de Viator (ej: "2140JTEMA20"). Solo si proveedor === 'viator'. */
  viator_product_id?: string;
  /** URL del producto en Viator (sin parámetros de afiliado). Solo si proveedor === 'viator'. */
  viator_url?: string;

  // ─── Campos nuevos multi-proveedor ─────────────────────────────────────
  /**
   * Proveedor afiliado. Si no se declara en frontmatter, se asume 'viator'
   * (retrocompatibilidad con Toledo SEM).
   */
  proveedor?: SemProveedor;
  /**
   * Código de producto del proveedor (id Viator o id GYG). Sustituye a
   * `viator_product_id` cuando se usa el esquema multi-proveedor.
   */
  proveedor_codigo?: string;
  /**
   * URL completa del producto en el sitio del proveedor (sin tracking de afiliado).
   * Sustituye a `viator_url` cuando se usa el esquema multi-proveedor.
   */
  url_reserva?: string;

  /** Imagen propia en /public/images/sem/{landing}/ */
  imagen: string;
  /** Texto alt de la imagen para accesibilidad */
  imagen_alt: string;
  /**
   * Categoría para el comparador rápido.
   * Toledo SEM usa: 'medio-dia' | 'dia-completo' | 'combinada' | 'privada'.
   * Tapas SEM usa: 'clasico' | 'con-vino' | 'con-azotea' | 'historico'.
   * Landings de entradas/atracciones usan: 'sin-colas' | 'con-guia' | 'nocturno'.
   * El frontend solo requiere que coincida con las categorías declaradas en
   * `comparador.categorias` del landing.
   */
  categoria:
    | 'medio-dia'
    | 'dia-completo'
    | 'combinada'
    | 'privada'
    | 'clasico'
    | 'con-vino'
    | 'con-azotea'
    | 'historico'
    | 'sin-colas'
    | 'con-guia'
    | 'nocturno';
  /** Si es la ancla "Más reservado", se renderiza con borde sky-500 destacado */
  ancla?: boolean;
  /** Si es premium, se renderiza con borde amber sutil */
  premium?: boolean;
  /**
   * Slug de la ficha propia en `/<segmento>/madrid/<segmento_actividades>/{slug}`.
   * El segmento `ciudades`/`cities` y `actividades`/`activities` lo resuelve
   * el componente que renderiza el link según el idioma de la landing.
   * Cuando existe, el CTA "Ver detalles" apunta a la ficha propia (Plan A).
   * Cuando no existe, fallback al proveedor directo con tracking.
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
    /**
     * Etiqueta superior en uppercase (ej: "Más reservado", "Most booked").
     * Opcional: si no se proporciona, el componente cae en su default por idioma.
     */
    etiqueta_superior?: string;
  };
};

export type SemLanding = SemLandingFrontmatter & {
  /** URL relativa, calculada según idioma */
  url: string;
  /** Idioma de la landing, calculado según el directorio del .md */
  idioma: SemIdioma;
};
