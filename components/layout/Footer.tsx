import Link from "next/link";
import Image from "next/image";
import {
  urlIndiceGuias,
  urlIndiceCiudades,
  urlContacto,
  urlAvisoLegal,
  urlPrivacidad,
  urlCookies,
  urlActividadesDeCiudad,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Footer del sitio. Estructura:
 *  1. Fila de promesas (cancelación gratuita / confirmación inmediata / soporte 24 h).
 *  2. Tres columnas (Marca + email · Destinos top · Enlaces ExploraSpain).
 *  3. Bloque "Pago seguro" con sellos de Viator + GetYourGuide y logos de tarjetas.
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
    promesaCancelacion: "Cancelación gratuita",
    promesaCancelacionSub: "Hasta 24 h antes",
    promesaConfirmacion: "Confirmación inmediata",
    promesaConfirmacionSub: "Ticket en el móvil",
    promesaSoporte: "Atención al cliente",
    promesaSoporteSub: "Te ayudamos con tu reserva",
    sectionDestinos: "Destinos top",
    sectionWeb: "ExploraSpain",
    verTodas: "Ver todas →",
    sobreNosotros: "Sobre nosotros",
    guias: "Guías de viaje",
    ciudades: "Ciudades",
    contacto: "Contacto",
    avisoLegal: "Aviso legal",
    privacidad: "Privacidad",
    cookies: "Cookies",
    pagoSeguro: "Pago 100% seguro",
    pagoDirecto: "Reserva directa con pago seguro vía Stripe",
    reservaPartners: "Reservas con partners oficiales",
    direccion: "Madrid",
    disclaimerAfiliados:
      "En las experiencias de reserva directa, el pago se procesa de forma segura con Stripe y la atención al cliente la presta ExploraSpain. En el resto, actuamos como afiliado oficial de Viator (Tripadvisor) y GetYourGuide, donde se completa la reserva con cancelación gratuita.",
  },
  en: {
    tagline:
      "Tours, activities and editorial guides for traveling Spain with judgment.",
    promesaCancelacion: "Free cancellation",
    promesaCancelacionSub: "Up to 24 h before",
    promesaConfirmacion: "Instant confirmation",
    promesaConfirmacionSub: "Mobile ticket",
    promesaSoporte: "Customer support",
    promesaSoporteSub: "We help with your booking",
    sectionDestinos: "Top destinations",
    sectionWeb: "ExploraSpain",
    verTodas: "See all →",
    sobreNosotros: "About us",
    guias: "Travel guides",
    ciudades: "Cities",
    contacto: "Contact",
    avisoLegal: "Legal notice",
    privacidad: "Privacy",
    cookies: "Cookies",
    pagoSeguro: "100% secure payment",
    pagoDirecto: "Direct booking with secure payment via Stripe",
    reservaPartners: "Bookings with official partners",
    direccion: "Madrid",
    disclaimerAfiliados:
      "For direct-booking experiences, payment is securely processed by Stripe and customer support is provided by ExploraSpain. For the rest, we act as an official affiliate of Viator (Tripadvisor) and GetYourGuide, where the booking is completed with free cancellation.",
  },
} as const;

/** Ciudades destacadas en el footer. Slug -> nombre ES/EN. */
const CIUDADES_TOP: ReadonlyArray<{
  slug: string;
  nombreEs: string;
  nombreEn: string;
}> = [
  { slug: "madrid", nombreEs: "Madrid", nombreEn: "Madrid" },
  { slug: "barcelona", nombreEs: "Barcelona", nombreEn: "Barcelona" },
  { slug: "sevilla", nombreEs: "Sevilla", nombreEn: "Seville" },
  { slug: "granada", nombreEs: "Granada", nombreEn: "Granada" },
  { slug: "valencia", nombreEs: "Valencia", nombreEn: "Valencia" },
  { slug: "malaga", nombreEs: "Málaga", nombreEn: "Málaga" },
  { slug: "cordoba", nombreEs: "Córdoba", nombreEn: "Cordoba" },
  { slug: "girona", nombreEs: "Girona", nombreEn: "Girona" },
];

function urlAbout(idioma: Idioma): string {
  return idioma === "es" ? "/sobre-nosotros" : `/${idioma}/about`;
}

type Props = {
  idioma: Idioma;
};

export default function Footer({ idioma }: Props) {
  const t = DICT[idioma === "en" ? "en" : "es"];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      {/* Fila de promesas */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <Promesa
              icon={<IconShieldCheck />}
              titulo={t.promesaCancelacion}
              subtitulo={t.promesaCancelacionSub}
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
              <h3 className="font-playfair text-2xl font-bold text-white">
                ExploraSpain
              </h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {t.tagline}
            </p>
            <a
              href="mailto:contacto@exploraspain.com"
              className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              <IconMail />
              contacto@exploraspain.com
            </a>
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
                    href={urlActividadesDeCiudad(idioma, c.slug)}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {idioma === "en" ? c.nombreEn : c.nombreEs}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={urlIndiceCiudades(idioma)}
              className="inline-block mt-3 text-xs text-sky-400 hover:text-sky-300 transition-colors"
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
                  className="hover:text-white transition-colors"
                >
                  {t.sobreNosotros}
                </Link>
              </li>
              <li>
                <Link
                  href={urlIndiceGuias(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.guias}
                </Link>
              </li>
              <li>
                <Link
                  href={urlIndiceCiudades(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.ciudades}
                </Link>
              </li>
              <li>
                <Link
                  href={urlContacto(idioma)}
                  className="hover:text-white transition-colors"
                >
                  {t.contacto}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bloque pago seguro */}
        <div className="border-t border-slate-800 pt-12 pb-4 mb-8">
          <p className="text-center text-sm text-white font-semibold mb-6 flex items-center justify-center gap-2">
            <IconLock />
            {t.pagoSeguro}
          </p>

          {/* Pago directo (reservas Bokun) — procesado por Stripe */}
          <p className="text-center text-xs text-slate-400 mb-3">
            {t.pagoDirecto}
          </p>
          <div className="w-full md:w-3/4 mx-auto mb-10 flex flex-wrap items-center justify-between gap-3">
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
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row md:justify-between gap-3 text-xs text-slate-500">
          <div className="flex gap-4 flex-wrap">
            <Link
              href={urlAvisoLegal(idioma)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {t.avisoLegal}
            </Link>
            <Link
              href={urlPrivacidad(idioma)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {t.privacidad}
            </Link>
            <Link
              href={urlCookies(idioma)}
              className="text-slate-400 hover:text-white transition-colors"
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
      <div className="bg-slate-950 border-t border-slate-800 py-3">
        <p className="max-w-6xl mx-auto px-4 text-center text-[11px] text-slate-500 leading-relaxed">
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
      <div className="text-amber-400 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-white font-semibold text-sm leading-tight">
          {titulo}
        </p>
        <p className="text-slate-400 text-xs">{subtitulo}</p>
      </div>
    </div>
  );
}

/** Casilla blanca uniforme para cada logo de pago (mismo tamaño exacto). */
function TilePago({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="bg-white rounded-md h-9 w-[58px] flex items-center justify-center p-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
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
      className="text-amber-400"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
