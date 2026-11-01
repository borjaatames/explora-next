import type { Idioma } from "@/lib/i18n/types";
import { urlActividad } from "@/lib/i18n/utils";

/** Texto en los idiomas activos de la página de proveedores. */
export type TextoIdiomas = Readonly<Record<Idioma, string>>;

/** Ficha nuestra de una actividad del proveedor (enlace interno). */
export type ActividadProveedor = Readonly<{
  ciudad: string;
  slugEs: string;
  slugEn: string;
  nombre: TextoIdiomas;
}>;

/**
 * Proveedor local con el que trabajamos y que ha aceptado el intercambio
 * de enlaces. La URL externa es la que nos ha indicado el propio proveedor.
 */
export type ProveedorLocal = Readonly<{
  id: string;
  nombre: string;
  web: string;
  ciudades: TextoIdiomas;
  descripcion: TextoIdiomas;
  actividades: ReadonlyArray<ActividadProveedor>;
}>;

export const PROVEEDORES_LOCALES: ReadonlyArray<ProveedorLocal> = [
  {
    id: "daremapp",
    nombre: "DareMapp",
    // URL indicada por DareMapp (Ricardo Hernández) el 28-10-2026.
    web: "https://daremapp.com/es/visitas-guiadas/",
    ciudades: {
      es: "Madrid, Barcelona, Sevilla, Granada, Córdoba, Málaga, Valencia y otras 7 ciudades",
      en: "Madrid, Barcelona, Seville, Granada, Cordoba, Malaga, Valencia and 7 more cities",
      de: "Madrid, Barcelona, Sevilla, Granada, Córdoba, Málaga, Valencia und 7 weitere Städte",
      fr: "Madrid, Barcelone, Séville, Grenade, Cordoue, Malaga, Valence et 7 autres villes",
      it: "Madrid, Barcellona, Siviglia, Granada, Cordova, Malaga, Valencia e altre 7 città",
      pt: "Madrid, Barcelona, Sevilha, Granada, Córdova, Málaga, Valência e mais 7 cidades",
    },
    descripcion: {
      es: "Tours autoguiados con app: recorres la ciudad a tu ritmo con un itinerario, audio y explicaciones en el móvil.",
      en: "App-based self-guided tours: explore the city at your own pace with a route, audio and stories on your phone.",
      de: "Selbstgeführte Touren per App: Du erkundest die Stadt in deinem Tempo, mit Route, Audio und Geschichten auf dem Handy.",
      fr: "Visites autoguidées avec application : vous découvrez la ville à votre rythme, avec un itinéraire, de l'audio et des explications sur votre téléphone.",
      it: "Tour autoguidati con app: giri la città con i tuoi tempi, con itinerario, audio e spiegazioni sul cellulare.",
      pt: "Visitas autoguiadas com aplicação: percorre a cidade ao seu ritmo, com itinerário, áudio e explicações no telemóvel.",
    },
    actividades: [
      {
        ciudad: "madrid",
        slugEs: "tour-autoguiado-daremapp-madrid",
        slugEn: "self-guided-tour-daremapp-madrid",
        nombre: { es: "Madrid", en: "Madrid", de: "Madrid", fr: "Madrid", it: "Madrid", pt: "Madrid" },
      },
      {
        ciudad: "barcelona",
        slugEs: "tour-autoguiado-daremapp-barcelona",
        slugEn: "self-guided-tour-daremapp-barcelona",
        nombre: { es: "Barcelona", en: "Barcelona", de: "Barcelona", fr: "Barcelone", it: "Barcellona", pt: "Barcelona" },
      },
      {
        ciudad: "sevilla",
        slugEs: "tour-autoguiado-daremapp-sevilla",
        slugEn: "self-guided-tour-daremapp-sevilla",
        nombre: { es: "Sevilla", en: "Seville", de: "Sevilla", fr: "Séville", it: "Siviglia", pt: "Sevilha" },
      },
      {
        ciudad: "granada",
        slugEs: "tour-autoguiado-daremapp-granada",
        slugEn: "self-guided-tour-daremapp-granada",
        nombre: { es: "Granada", en: "Granada", de: "Granada", fr: "Grenade", it: "Granada", pt: "Granada" },
      },
    ],
  },
  {
    id: "show-me-barcelona",
    nombre: "Show Me Barcelona",
    // URL indicada por Show Me Barcelona (Mofie) el 01-11-2026.
    web: "https://showmebarcelona.co",
    ciudades: {
      es: "Barcelona",
      en: "Barcelona",
      de: "Barcelona",
      fr: "Barcelone",
      it: "Barcellona",
      pt: "Barcelona",
    },
    descripcion: {
      es: "Experiencias sociales en Barcelona: paseo en barco y a pie, tapas con paella y sangría, bici y tapas, sip & paint, catas de cerveza y noche de karaoke.",
      en: "Social experiences in Barcelona: boat cruise and walking tour, tapas with paella and sangria, bike and tapas, sip & paint, beer tastings and a karaoke night out.",
      de: "Gesellige Erlebnisse in Barcelona: Bootsfahrt mit Stadtrundgang, Tapas mit Paella und Sangria, Rad und Tapas, Sip & Paint, Bierverkostung und Karaoke-Nacht.",
      fr: "Expériences conviviales à Barcelone : balade en bateau et visite à pied, tapas avec paella et sangria, vélo et tapas, sip & paint, dégustations de bière et soirée karaoké.",
      it: "Esperienze di gruppo a Barcellona: giro in barca e tour a piedi, tapas con paella e sangria, bici e tapas, sip & paint, degustazioni di birra e serata karaoke.",
      pt: "Experiências em grupo em Barcelona: passeio de barco e visita a pé, tapas com paella e sangria, bicicleta e tapas, sip & paint, provas de cerveja e noite de karaoke.",
    },
    actividades: [
      {
        ciudad: "barcelona",
        slugEs: "barcelona-paseo-en-barco-y-tour-guiado-a-pie",
        slugEn: "barcelona-boat-cruise-and-guided-walking-tour",
        nombre: {
          es: "Barco y paseo a pie",
          en: "Boat cruise and walking tour",
          de: "Bootsfahrt und Rundgang",
          fr: "Bateau et visite à pied",
          it: "Barca e tour a piedi",
          pt: "Barco e visita a pé",
        },
      },
      {
        ciudad: "barcelona",
        slugEs: "barcelona-tour-tapas-paella-sangria-casco-antiguo",
        slugEn: "barcelona-tapas-tour-paella-sangria-old-town",
        nombre: {
          es: "Tapas, paella y sangría",
          en: "Tapas, paella and sangria",
          de: "Tapas, Paella und Sangria",
          fr: "Tapas, paella et sangria",
          it: "Tapas, paella e sangria",
          pt: "Tapas, paella e sangria",
        },
      },
      {
        ciudad: "barcelona",
        slugEs: "barcelona-tour-en-bici-y-tapas",
        slugEn: "barcelona-social-bike-tour-and-tapas",
        nombre: { es: "Bici y tapas", en: "Bike and tapas", de: "Rad und Tapas", fr: "Vélo et tapas", it: "Bici e tapas", pt: "Bicicleta e tapas" },
      },
      {
        ciudad: "barcelona",
        slugEs: "barcelona-sip-and-paint-sangria",
        slugEn: "barcelona-sip-and-paint-with-sangria",
        nombre: { es: "Sip & Paint", en: "Sip & Paint", de: "Sip & Paint", fr: "Sip & Paint", it: "Sip & Paint", pt: "Sip & Paint" },
      },
    ],
  },
];

/** Ruta de la página de proveedores en cada idioma. */
export function urlProveedores(idioma: Idioma): string {
  return idioma === "es" ? "/proveedores" : `/${idioma}/partners`;
}

/**
 * URL de nuestra ficha de una actividad del proveedor. En DE/FR/IT/PT no hay
 * fichas propias de estas actividades, así que no se enlazan.
 */
export function urlActividadProveedor(
  idioma: Idioma,
  actividad: ActividadProveedor
): string | null {
  if (idioma === "es") {
    return urlActividad("es", actividad.ciudad, actividad.slugEs);
  }
  if (idioma === "en") {
    return urlActividad("en", actividad.ciudad, actividad.slugEn);
  }
  return null;
}

export function textoEn(idioma: Idioma, texto: TextoIdiomas): string {
  return texto[idioma];
}
