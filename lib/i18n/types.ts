import { IDIOMAS_CONFIGURADOS } from "./config";

export type Idioma = (typeof IDIOMAS_CONFIGURADOS)[number];

export type SegmentosUrl = {
  guias: string;
  ciudades: string;
  actividades: string;
};

export type Diccionario = {
  meta: {
    sitioNombre: string;
    sitioDescripcion: string;
  };
  navegacion: {
    inicio: string;
    guias: string;
    ciudades: string;
    sobreNosotros: string;
    contacto: string;
    abrirMenu: string;
    cerrarMenu: string;
    cambiarIdioma: string;
  };
  home: {
    heroTitulo: string;
    heroSubtitulo: string;
    ctaExplorar: string;
    seccionGuiasDestacadas: string;
    seccionCiudades: string;
    verTodas: string;
  };
  guias: {
    tituloIndice: string;
    descripcionIndice: string;
    minutosLectura: string;
    publicadoEl: string;
    autorPor: string;
    relacionadas: string;
    volverAGuias: string;
  };
  ciudades: {
    tituloIndice: string;
    descripcionIndice: string;
    verCiudad: string;
    guiasDeCiudad: string;
    volverACiudades: string;
  };
  actividades: {
    tituloIndiceCiudad: string;
    descripcionIndiceCiudad: string;
    verActividad: string;
    actividadesEnCiudad: string;
    desde: string;
    porPersona: string;
    duracion: string;
    idiomas: string;
    cancelacionGratuita: string;
    cancelacionHorasAntes: string;
    sinColas: string;
    reservar: string;
    viaProveedor: string;
    highlights: string;
    nuestraOpinion: string;
    queIncluye: string;
    queNoIncluye: string;
    puntoEncuentro: string;
    laExperiencia: string;
    guiasRelacionadas: string;
    alternativas: string;
    avisoAfiliacion: string;
    valoracion: string;
    opiniones: string;
    categorias: {
      cultural: string;
      gastronomico: string;
      aireLibre: string;
      nocturno: string;
      excursion: string;
      familiar: string;
    };
    faqEnCiudad: string;
  };
  footer: {
    derechos: string;
    avisoLegal: string;
    privacidad: string;
    cookies: string;
    operadoPor: string;
  };
  comun: {
    cargando: string;
    error: string;
    leerMas: string;
  };
};