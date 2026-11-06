import type { Idioma } from "@/lib/i18n/types";

type IdiomaNoEs = Exclude<Idioma, "es">;

/** Textos del hub y de las páginas de ciudad de privados fuera de ES. */
export type TextosPrivados = {
  inicio: string;
  migaHub: string;
  migaActividades: string;
  hubTitulo: string;
  hubIntro: (total: number, ciudades: number) => string;
  hubDescripcion: (total: number, ciudades: number, nombres: string) => string;
  desdeCiudad: (nombre: string) => string;
  verTodas: (n: number) => string;
  otrasCiudades: string;
  ciudadTitulo: (nombre: string) => string;
  ciudadIntro: (n: number) => string;
  ciudadDescripcion: (n: number, nombre: string) => string;
  ogLocale: string;
};

export const TEXTOS_PRIVADOS: Record<IdiomaNoEs, TextosPrivados> = {
  en: {
    inicio: "Home",
    migaHub: "Private tours",
    migaActividades: "Activities",
    hubTitulo: "Private tours and day trips in Spain",
    hubIntro: (total, ciudades) =>
      `${total} tours and day trips just for your group in ${ciudades} cities. Pick where you're starting from; each card shows the price per person by group size.`,
    hubDescripcion: (total, ciudades, nombres) =>
      `${total} private tours and day trips in ${ciudades} Spanish cities, just for your group and booked direct: ${nombres} and more.`,
    desdeCiudad: (nombre) => `From ${nombre}`,
    verTodas: (n) => `See all ${n}`,
    otrasCiudades: "Other cities",
    ciudadTitulo: (nombre) => `Private tours and day trips in ${nombre}`,
    ciudadIntro: (n) =>
      `${n} tours and day trips just for your group, with pickup and timing depending on each one. We show the price per person by group size so you can compare them with group tours.`,
    ciudadDescripcion: (n, nombre) =>
      `${n} private tours and day trips in ${nombre}, just for your group, with the price per person by group size and direct booking.`,
    ogLocale: "en_US",
  },
  de: {
    inicio: "Startseite",
    migaHub: "Privattouren",
    migaActividades: "Aktivitäten",
    hubTitulo: "Privattouren und Tagesausflüge in Spanien",
    hubIntro: (total, ciudades) =>
      `${total} Touren und Tagesausflüge nur für deine Gruppe in ${ciudades} Städten. Wähle deinen Ausgangsort; jede Karte zeigt den Preis pro Person je nach Gruppengröße.`,
    hubDescripcion: (total, ciudades, nombres) =>
      `${total} Privattouren und Tagesausflüge in ${ciudades} spanischen Städten, nur für deine Gruppe und direkt gebucht: ${nombres} und mehr.`,
    desdeCiudad: (nombre) => `Ab ${nombre}`,
    verTodas: (n) => `Alle ${n} ansehen`,
    otrasCiudades: "Weitere Städte",
    ciudadTitulo: (nombre) => `Privattouren und Tagesausflüge in ${nombre}`,
    ciudadIntro: (n) =>
      `${n} Touren und Tagesausflüge nur für deine Gruppe; Abholung und Zeiten hängen von der jeweiligen Tour ab. Wir zeigen den Preis pro Person je nach Gruppengröße, damit du sie mit Gruppentouren vergleichen kannst.`,
    ciudadDescripcion: (n, nombre) =>
      `${n} Privattouren und Tagesausflüge in ${nombre}, nur für deine Gruppe, mit Preis pro Person je nach Gruppengröße und Direktbuchung.`,
    ogLocale: "de_DE",
  },
  fr: {
    inicio: "Accueil",
    migaHub: "Visites privées",
    migaActividades: "Activités",
    hubTitulo: "Visites et excursions privées en Espagne",
    hubIntro: (total, ciudades) =>
      `${total} visites et excursions rien que pour votre groupe dans ${ciudades} villes. Choisissez votre point de départ ; chaque carte indique le prix par personne selon la taille du groupe.`,
    hubDescripcion: (total, ciudades, nombres) =>
      `${total} visites et excursions privées dans ${ciudades} villes d’Espagne, rien que pour votre groupe et en réservation directe : ${nombres} et plus encore.`,
    desdeCiudad: (nombre) => `Au départ de ${nombre}`,
    verTodas: (n) => `Voir les ${n}`,
    otrasCiudades: "Autres villes",
    ciudadTitulo: (nombre) => `Visites et excursions privées à ${nombre}`,
    ciudadIntro: (n) =>
      `${n} visites et excursions rien que pour votre groupe ; la prise en charge et les horaires dépendent de chacune. Nous affichons le prix par personne selon la taille du groupe pour que vous puissiez comparer avec les visites en groupe.`,
    ciudadDescripcion: (n, nombre) =>
      `${n} visites et excursions privées à ${nombre}, rien que pour votre groupe, avec le prix par personne selon la taille du groupe et la réservation directe.`,
    ogLocale: "fr_FR",
  },
  it: {
    inicio: "Home",
    migaHub: "Tour privati",
    migaActividades: "Attività",
    hubTitulo: "Tour ed escursioni private in Spagna",
    hubIntro: (total, ciudades) =>
      `${total} tour ed escursioni solo per il tuo gruppo in ${ciudades} città. Scegli da dove parti; ogni scheda mostra il prezzo a persona in base al numero di partecipanti.`,
    hubDescripcion: (total, ciudades, nombres) =>
      `${total} tour ed escursioni private in ${ciudades} città spagnole, solo per il tuo gruppo e con prenotazione diretta: ${nombres} e altre.`,
    desdeCiudad: (nombre) => `Da ${nombre}`,
    verTodas: (n) => `Vedi tutti e ${n}`,
    otrasCiudades: "Altre città",
    ciudadTitulo: (nombre) => `Tour ed escursioni private a ${nombre}`,
    ciudadIntro: (n) =>
      `${n} tour ed escursioni solo per il tuo gruppo; prelievo e orari dipendono da ciascuno. Mostriamo il prezzo a persona in base al numero di partecipanti, così puoi confrontarli con i tour di gruppo.`,
    ciudadDescripcion: (n, nombre) =>
      `${n} tour ed escursioni private a ${nombre}, solo per il tuo gruppo, con prezzo a persona in base al gruppo e prenotazione diretta.`,
    ogLocale: "it_IT",
  },
  pt: {
    inicio: "Início",
    migaHub: "Visitas privadas",
    migaActividades: "Atividades",
    hubTitulo: "Visitas e excursões privadas em Espanha",
    hubIntro: (total, ciudades) =>
      `${total} visitas e excursões só para o seu grupo em ${ciudades} cidades. Escolha de onde parte; cada cartão mostra o preço por pessoa consoante o tamanho do grupo.`,
    hubDescripcion: (total, ciudades, nombres) =>
      `${total} visitas e excursões privadas em ${ciudades} cidades de Espanha, só para o seu grupo e com reserva direta: ${nombres} e mais.`,
    desdeCiudad: (nombre) => `A partir de ${nombre}`,
    verTodas: (n) => `Ver as ${n}`,
    otrasCiudades: "Outras cidades",
    ciudadTitulo: (nombre) => `Visitas e excursões privadas em ${nombre}`,
    ciudadIntro: (n) =>
      `${n} visitas e excursões só para o seu grupo; a recolha e os horários dependem de cada uma. Mostramos o preço por pessoa consoante o tamanho do grupo para que as possa comparar com as visitas em grupo.`,
    ciudadDescripcion: (n, nombre) =>
      `${n} visitas e excursões privadas em ${nombre}, só para o seu grupo, com preço por pessoa consoante o grupo e reserva direta.`,
    ogLocale: "pt_PT",
  },
};
