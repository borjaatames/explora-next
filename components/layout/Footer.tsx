import Link from "next/link";
import Image from "next/image";
import {
  urlIndiceGuias,
  urlIndiceCiudades,
  urlContacto,
  urlAvisoLegal,
  urlCondiciones,
  urlPrivacidad,
  urlCookies,
  urlCiudad,
} from "@/lib/i18n/utils";
import { urlListadoActividadesSiExiste } from "@/lib/actividades";
import { urlProveedores } from "@/lib/proveedores";
import { urlPlanificador } from "@/lib/planificador";
import { idiomaConCruceros, urlCruceros } from "@/lib/descubrir";
import type { Idioma } from "@/lib/i18n/types";
import { idiomaTieneGuias } from "@/lib/guias";
import RedesSociales from "@/components/RedesSociales";

/**
 * Footer del sitio. Estructura:
 *  1. Fila de promesas (cancelación gratuita / confirmación inmediata / soporte 24 h).
 *  2. Tres columnas (Marca + email · Destinos top · Enlaces ExploraSpain).
 *  3. Bloque "Pago seguro" con sello de GetYourGuide y logos de tarjetas.
 *     Los chips de pago son placeholders de texto estilizado — sustituir por
 *     SVGs oficiales (Visa/MC/AmEx/PayPal/Apple Pay/Google Pay) cuando estén
 *     en /public/payment/ para evitar problemas de marca.
 *  4. Línea legal + copyright.
 *  5. Disclaimer afiliado obligatorio.
 */

const DICT = {
  es: {
    tagline:
      "Tours, actividades y guías editoriales para viajar por España con criterio.",
    promesaPago: "Pago 100% seguro",
    promesaPagoSub: "Vía Bókun y partners oficiales",
    promesaConfirmacion: "Confirmación inmediata",
    promesaConfirmacionSub: "Ticket en el móvil",
    promesaSoporte: "Atención al cliente",
    promesaSoporteSub: "Te ayudamos con tu reserva",
    sectionDestinos: "Destinos top",
    sectionWeb: "ExploraSpain",
    verTodas: "Ver todas →",
    sobreNosotros: "Sobre nosotros",
    proveedores: "Proveedores locales",
    guias: "Guías de viaje",
    planificador: "Planificador de viaje",
    cruceros: "Excursiones en crucero",
    ciudades: "Ciudades",
    contacto: "Contacto",
    avisoLegal: "Aviso legal",
    condiciones: "Condiciones de reserva",
    privacidad: "Privacidad",
    cookies: "Cookies",
    pagoSeguro: "Pago 100% seguro",
    pagoDirecto: "Reserva directa con pago seguro con tarjeta (Bókun)",
    reservaPartners: "Reservas con partners oficiales",
    direccion: "Madrid",
    disclaimerAfiliados:
      "En las experiencias de reserva directa, el pago se hace con tarjeta en la pasarela segura de Bókun y la atención al cliente la presta ExploraSpain. En el resto, actuamos como afiliado oficial de GetYourGuide, donde se completa la reserva con las condiciones de cancelación de cada actividad.",
  },
  en: {
    tagline:
      "Tours, activities and editorial guides for traveling Spain with judgment.",
    promesaPago: "100% secure payment",
    promesaPagoSub: "Via Bókun and official partners",
    promesaConfirmacion: "Instant confirmation",
    promesaConfirmacionSub: "Mobile ticket",
    promesaSoporte: "Customer support",
    promesaSoporteSub: "We help with your booking",
    sectionDestinos: "Top destinations",
    sectionWeb: "ExploraSpain",
    verTodas: "See all →",
    sobreNosotros: "About us",
    proveedores: "Local partners",
    guias: "Travel guides",
    planificador: "Trip planner",
    cruceros: "Cruise excursions",
    ciudades: "Cities",
    contacto: "Contact",
    avisoLegal: "Legal notice",
    condiciones: "Booking terms",
    privacidad: "Privacy",
    cookies: "Cookies",
    pagoSeguro: "100% secure payment",
    pagoDirecto: "Direct booking with secure card payment (Bókun)",
    reservaPartners: "Bookings with official partners",
    direccion: "Madrid",
    disclaimerAfiliados:
      "For direct-booking experiences, payment is made by card through Bókun's secure gateway and customer support is provided by ExploraSpain. For the rest, we act as an official affiliate of GetYourGuide, where the booking is completed under each activity's cancellation terms.",
  },
  de: {
    tagline:
      "Touren, Aktivitäten und redaktionelle Reiseführer, um Spanien mit Kompetenz zu bereisen.",
    promesaPago: "100% sichere Zahlung",
    promesaPagoSub: "Über Bókun und offizielle Partner",
    promesaConfirmacion: "Sofortige Bestätigung",
    promesaConfirmacionSub: "Ticket auf dem Handy",
    promesaSoporte: "Kundenservice",
    promesaSoporteSub: "Wir helfen bei deiner Buchung",
    sectionDestinos: "Top-Reiseziele",
    sectionWeb: "ExploraSpain",
    verTodas: "Alle ansehen →",
    sobreNosotros: "Über uns",
    proveedores: "Lokale Partner",
    guias: "Reiseführer",
    planificador: "Reiseplaner",
    cruceros: "Kreuzfahrt-Ausflüge",
    ciudades: "Städte",
    contacto: "Kontakt",
    avisoLegal: "Impressum",
    condiciones: "Buchungsbedingungen (EN)",
    privacidad: "Datenschutz",
    cookies: "Cookies",
    pagoSeguro: "100% sichere Zahlung",
    pagoDirecto: "Direktbuchung mit sicherer Kartenzahlung (Bókun)",
    reservaPartners: "Buchungen mit offiziellen Partnern",
    direccion: "Madrid",
    disclaimerAfiliados:
      "Bei Erlebnissen mit Direktbuchung erfolgt die Zahlung per Karte über das sichere Bókun-Gateway und der Kundenservice von ExploraSpain übernommen. Bei den übrigen Angeboten agieren wir als offizieller Partner von GetYourGuide, wo die Buchung zu den Stornobedingungen der jeweiligen Aktivität abgeschlossen wird.",
  },
  fr: {
    tagline:
      "Visites, activités et guides éditoriaux pour voyager en Espagne en connaissance de cause.",
    promesaPago: "Paiement 100 % sécurisé",
    promesaPagoSub: "Via Bókun et des partenaires officiels",
    promesaConfirmacion: "Confirmation immédiate",
    promesaConfirmacionSub: "Billet sur votre mobile",
    promesaSoporte: "Service client",
    promesaSoporteSub: "Nous vous aidons pour votre réservation",
    sectionDestinos: "Destinations phares",
    sectionWeb: "ExploraSpain",
    verTodas: "Tout voir →",
    sobreNosotros: "À propos",
    proveedores: "Partenaires locaux",
    guias: "Guides de voyage",
    planificador: "Planificateur de voyage",
    cruceros: "Excursions en croisière",
    ciudades: "Villes",
    contacto: "Contact",
    avisoLegal: "Mentions légales",
    condiciones: "Conditions de réservation (EN)",
    privacidad: "Confidentialité",
    cookies: "Cookies",
    pagoSeguro: "Paiement 100 % sécurisé",
    pagoDirecto: "Réservation directe avec paiement sécurisé par carte (Bókun)",
    reservaPartners: "Réservations avec des partenaires officiels",
    direccion: "Madrid",
    disclaimerAfiliados:
      "Pour les expériences en réservation directe, le paiement se fait par carte via la passerelle sécurisée de Bókun et le service client est assuré par ExploraSpain. Pour les autres, nous agissons en tant qu’affilié officiel de GetYourGuide, où la réservation est finalisée selon les conditions d’annulation de chaque activité.",
  },
  it: {
    tagline:
      "Tour, attività e guide editoriali per viaggiare in Spagna con criterio.",
    promesaPago: "Pagamento sicuro al 100%",
    promesaPagoSub: "Tramite Bókun e partner ufficiali",
    promesaConfirmacion: "Conferma immediata",
    promesaConfirmacionSub: "Biglietto sul cellulare",
    promesaSoporte: "Assistenza clienti",
    promesaSoporteSub: "Ti aiutiamo con la tua prenotazione",
    sectionDestinos: "Destinazioni top",
    sectionWeb: "ExploraSpain",
    verTodas: "Vedi tutte →",
    sobreNosotros: "Chi siamo",
    proveedores: "Partner locali",
    guias: "Guide di viaggio",
    planificador: "Pianificatore di viaggio",
    cruceros: "Escursioni in crociera",
    ciudades: "Città",
    contacto: "Contatti",
    avisoLegal: "Note legali",
    condiciones: "Condizioni di prenotazione (EN)",
    privacidad: "Privacy",
    cookies: "Cookie",
    pagoSeguro: "Pagamento sicuro al 100%",
    pagoDirecto: "Prenotazione diretta con pagamento sicuro con carta (Bókun)",
    reservaPartners: "Prenotazioni con partner ufficiali",
    direccion: "Madrid",
    disclaimerAfiliados:
      "Per le esperienze con prenotazione diretta, il pagamento avviene con carta tramite il gateway sicuro di Bókun e l’assistenza clienti è fornita da ExploraSpain. Per le altre, agiamo come affiliato ufficiale di GetYourGuide, dove la prenotazione si completa alle condizioni di cancellazione di ciascuna attività.",
  },
  pt: {
    tagline:
      "Tours, atividades e guias editoriais para viajar por Espanha com critério.",
    promesaPago: "Pagamento 100% seguro",
    promesaPagoSub: "Via Bókun e parceiros oficiais",
    promesaConfirmacion: "Confirmação imediata",
    promesaConfirmacionSub: "Bilhete no telemóvel",
    promesaSoporte: "Apoio ao cliente",
    promesaSoporteSub: "Ajudamos com a sua reserva",
    sectionDestinos: "Destinos em destaque",
    sectionWeb: "ExploraSpain",
    verTodas: "Ver todas →",
    sobreNosotros: "Sobre nós",
    proveedores: "Parceiros locais",
    guias: "Guias de viagem",
    planificador: "Planeador de viagem",
    cruceros: "Excursões de cruzeiro",
    ciudades: "Cidades",
    contacto: "Contacto",
    avisoLegal: "Aviso legal",
    condiciones: "Condições de reserva (EN)",
    privacidad: "Privacidade",
    cookies: "Cookies",
    pagoSeguro: "Pagamento 100% seguro",
    pagoDirecto: "Reserva direta com pagamento seguro com cartão (Bókun)",
    reservaPartners: "Reservas com parceiros oficiais",
    direccion: "Madrid",
    disclaimerAfiliados:
      "Nas experiências de reserva direta, o pagamento é feito com cartão no portal seguro da Bókun e o apoio ao cliente é prestado pela ExploraSpain. Nas restantes, atuamos como afiliado oficial da GetYourGuide, onde a reserva é concluída com as condições de cancelamento de cada atividade.",
  },
} as const satisfies Record<Idioma, Record<string, string>>;

/** Ciudades destacadas en el footer. Slug -> nombre por idioma (por defecto el ES). */
const CIUDADES_TOP: ReadonlyArray<{
  slug: string;
  nombreEs: string;
  nombres?: Partial<Record<Idioma, string>>;
}> = [
  { slug: "madrid", nombreEs: "Madrid" },
  { slug: "barcelona", nombreEs: "Barcelona" },
  { slug: "sevilla", nombreEs: "Sevilla", nombres: { en: "Seville", fr: "Séville", it: "Siviglia", pt: "Sevilha" } },
  { slug: "granada", nombreEs: "Granada", nombres: { fr: "Grenade" } },
  { slug: "valencia", nombreEs: "Valencia", nombres: { fr: "Valence", pt: "Valência" } },
  { slug: "malaga", nombreEs: "Málaga", nombres: { fr: "Malaga", it: "Malaga" } },
  { slug: "cordoba", nombreEs: "Córdoba", nombres: { en: "Cordoba", fr: "Cordoue", it: "Cordova", pt: "Córdova" } },
  { slug: "girona", nombreEs: "Girona", nombres: { fr: "Gérone" } },
];

function urlAbout(idioma: Idioma): string {
  return idioma === "es" ? "/sobre-nosotros" : `/${idioma}/about`;
}

function nombreCiudadTop(
  idioma: Idioma,
  c: { nombreEs: string; nombres?: Partial<Record<Idioma, string>> }
): string {
  return c.nombres?.[idioma] ?? c.nombreEs;
}

type Props = {
  idioma: Idioma;
};

export default function Footer({ idioma }: Props) {
  const t = DICT[idioma];
  // Guías: solo si el idioma tiene alguna publicada. Cruceros: solo con guías de puerto suficientes.
  const hayGuias = idiomaTieneGuias(idioma);
  const hayCruceros = idiomaConCruceros(idioma);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-piedra-900 text-piedra-300 mt-20">
      {/* Fila de promesas */}
      <div className="bg-piedra-800 border-b border-piedra-950">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <Promesa
              icon={<IconShieldCheck />}
              titulo={t.promesaPago}
              subtitulo={t.promesaPagoSub}
            />
            <Promesa
              icon={<IconMobile />}
              titulo={t.promesaConfirmacion}
              subtitulo={t.promesaConfirmacionSub}
            />
            <Promesa
              icon={<IconHeadset />}
              titulo={t.promesaSoporte}
              subtitulo={t.promesaSoporteSub}
            />
          </div>
        </div>
      </div>

      {/* Columnas */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/logo-icon.svg"
                alt=""
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <h3 className="font-fraunces text-2xl font-bold text-white">
                ExploraSpain
              </h3>
            </div>
            <p className="text-sm text-piedra-400 leading-relaxed mb-4">
              {t.tagline}
            </p>
            <a
              href="mailto:contacto@exploraspain.com"
              className="inline-flex items-center gap-2 text-sm text-anil-400 hover:text-anil-300 transition-colors"
            >
              <IconMail />
              contacto@exploraspain.com
            </a>
            <RedesSociales idioma={idioma} variante="oscuro" className="mt-6" />
          </div>

          {/* Destinos top */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              {t.sectionDestinos}
            </h4>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              {CIUDADES_TOP.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={
                      urlListadoActividadesSiExiste(idioma, c.slug) ??
                      urlCiudad(idioma, c.slug)
                    }
                    prefetch={false}
                    className="text-piedra-300 hover:text-white transition-colors"
                  >
                    {nombreCiudadTop(idioma, c)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={urlIndiceCiudades(idioma)}
                    prefetch={false}
              className="inline-block mt-3 text-xs text-anil-400 hover:text-anil-300 transition-colors"
            >
              {t.verTodas}
            </Link>
          </div>

          {/* ExploraSpain */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              {t.sectionWeb}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={urlAbout(idioma)}
                    prefetch={false}
                  className="hover:text-white transition-colors"
                >
                  {t.sobreNosotros}
                </Link>
              </li>
              <li>
                <Link
                  href={urlProveedores(idioma)}
                  prefetch={false}
                  className="hover:text-white transition-colors"
                >
                  {t.proveedores}
                </Link>
              </li>
              {hayGuias ? (
                <li>
                  <Link
                    href={urlIndiceGuias(idioma)}
                    prefetch={false}
                    className="hover:text-white transition-colors"
                  >
                    {t.guias}
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  href={urlPlanificador(idioma)}
                  prefetch={false}
                  className="hover:text-white transition-colors"
                >
                  {t.planificador}
                </Link>
              </li>
              {hayCruceros ? (
                <li>
                  <Link
                    href={urlCruceros(idioma)}
                    prefetch={false}
                    className="hover:text-white transition-colors"
                  >
                    {t.cruceros}
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  href={urlIndiceCiudades(idioma)}
                    prefetch={false}
                  className="hover:text-white transition-colors"
                >
                  {t.ciudades}
                </Link>
              </li>
              <li>
                <Link
                  href={urlContacto(idioma)}
                    prefetch={false}
                  className="hover:text-white transition-colors"
                >
                  {t.contacto}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bloque pago seguro */}
        <div className="border-t border-piedra-800 pt-12 pb-4 mb-8">
          <p className="text-center text-sm text-white font-semibold mb-6 flex items-center justify-center gap-2">
            <IconLock />
            {t.pagoSeguro}
          </p>

          {/* Pago directo (reservas Bokun) — pasarela de Bókun */}
          <p className="text-center text-xs text-piedra-400 mb-3">
            {t.pagoDirecto}
          </p>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <TilePago src="/payment/visa.svg" alt="Visa" />
            <TilePago src="/payment/mastercard.svg" alt="Mastercard" />
            <TilePago src="/payment/amex.svg" alt="American Express" />
            <TilePago src="/payment/applepay.svg" alt="Apple Pay" />
            <TilePago src="/payment/googlepay.svg" alt="Google Pay" />
            <div className="bg-white rounded-md h-9 w-[58px] flex items-center justify-center">
              <span
                className="font-bold italic text-sm"
                style={{ color: "#635BFF" }}
              >
                stripe
              </span>
            </div>
          </div>
        </div>

        {/* Línea legal */}
        <div className="border-t border-piedra-800 pt-6 flex flex-col md:flex-row md:justify-between gap-3 text-xs text-piedra-500">
          <div className="flex gap-4 flex-wrap">
            <Link
              href={urlAvisoLegal(idioma)}
                    prefetch={false}
              className="text-piedra-400 hover:text-white transition-colors"
            >
              {t.avisoLegal}
            </Link>
            <Link
              href={urlCondiciones(idioma)}
              prefetch={false}
              className="text-piedra-400 hover:text-white transition-colors"
            >
              {t.condiciones}
            </Link>
            <Link
              href={urlPrivacidad(idioma)}
                    prefetch={false}
              className="text-piedra-400 hover:text-white transition-colors"
            >
              {t.privacidad}
            </Link>
            <Link
              href={urlCookies(idioma)}
                    prefetch={false}
              className="text-piedra-400 hover:text-white transition-colors"
            >
              {t.cookies}
            </Link>
          </div>
          <p>
            © {year} Skyward Partners S.L. · NIF B26629576 · {t.direccion}
          </p>
        </div>
      </div>

      {/* Disclaimer afiliados */}
      <div className="bg-piedra-950 border-t border-piedra-800 py-3">
        <p className="max-w-6xl mx-auto px-4 text-center text-[11px] text-piedra-500 leading-relaxed">
          {t.disclaimerAfiliados}
        </p>
      </div>
    </footer>
  );
}

/* ───────────────────────── Sub-componentes ───────────────────────── */

function Promesa({
  icon,
  titulo,
  subtitulo,
}: {
  icon: React.ReactNode;
  titulo: string;
  subtitulo: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-azafran-400 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-white font-semibold text-sm leading-tight">
          {titulo}
        </p>
        <p className="text-piedra-400 text-xs">{subtitulo}</p>
      </div>
    </div>
  );
}

/** Casilla blanca uniforme para cada logo de pago (mismo tamaño exacto). */
function TilePago({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="bg-white rounded-md h-9 w-[58px] flex items-center justify-center p-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={46}
        height={24}
        loading="lazy"
        decoding="async"
        className="max-h-full max-w-full w-auto h-auto object-contain"
      />
    </div>
  );
}

/* ───────────────────────── Iconos SVG ───────────────────────── */

function IconShieldCheck() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconMobile() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function IconHeadset() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-azafran-400"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
